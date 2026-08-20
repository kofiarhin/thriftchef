/**
 * The Phase 0 regression oracle.
 *
 * These tests do not describe what the planner *should* do — the rest of the
 * suite does that. They pin what it *currently* does, so that the
 * multi-retailer migration can prove it changed nothing it did not intend to.
 *
 * A failure here means planning behaviour moved. That is sometimes correct and
 * sometimes a regression, and the only way to tell them apart is to look. The
 * fix is never to loosen an assertion: it is to re-record the baseline with
 * `npm run baseline:record` and justify the resulting diff.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BASELINE_REPLACEMENTS,
  BASELINE_SCENARIOS,
} from "../testing/baseline/aldiBaselineRequests";
import { ALDI_BASELINE } from "../testing/baseline/aldiBaselineSnapshot";
import {
  captureBaseline,
  type BaselineRecord,
  type ReplacementRecord,
  type ScenarioRecord,
} from "../testing/baseline/baselineCapture";
import { ALDI_CATALOGUE } from "../testing/planningFixtures";
import { ENGINE_VERSION } from "./mealPlanEngine";
import {
  INFERRED_ALLERGEN_WARNING,
  INFERRED_WITH_ALLERGIES_WARNING,
} from "./productSelector";
import type {
  MealPlanDay,
  MealPlanMeal,
  MealPlanResponse,
  MustHaveUsage,
} from "./mealPlanTypes";

/**
 * Captured once for the whole file, lazily. Every scenario runs a real HTTP
 * request through the real engine, so re-capturing per test would multiply a
 * slow fixture by the number of assertions without proving anything extra.
 */
let pending: Promise<CapturedBaseline> | null = null;

interface CapturedBaseline {
  record: BaselineRecord;
  scenarios: Map<string, ScenarioRecord>;
  replacements: Map<string, ReplacementRecord>;
}

function baseline(): Promise<CapturedBaseline> {
  pending ??= captureBaseline().then((record) => ({
    record,
    scenarios: new Map(record.scenarios.map((entry) => [entry.key, entry])),
    replacements: new Map(record.replacements.map((entry) => [entry.key, entry])),
  }));

  return pending;
}

const recordedScenarios = new Map(
  ALDI_BASELINE.scenarios.map((entry) => [entry.key, entry]),
);
const recordedReplacements = new Map(
  ALDI_BASELINE.replacements.map((entry) => [entry.key, entry]),
);

/** Every product id a plan cooks with or buys. */
function productIdsIn(plan: MealPlanResponse): string[] {
  return [
    ...plan.recipes.flatMap((recipe) => recipe.ingredients.map((item) => item.productId)),
    ...plan.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
  ];
}

describe("Aldi baseline: recorded behaviour", () => {
  it("still runs the engine version the baseline was recorded from", async () => {
    assert.equal(ENGINE_VERSION, ALDI_BASELINE.engineVersion);
  });

  it("covers every frozen scenario", async () => {
    const { record: captured } = await baseline();
    assert.equal(captured.scenarios.length, BASELINE_SCENARIOS.length);
    assert.equal(captured.replacements.length, BASELINE_REPLACEMENTS.length);
    assert.deepEqual(
      [...(await baseline()).scenarios.keys()].sort(),
      [...recordedScenarios.keys()].sort(),
    );
  });

  for (const scenario of BASELINE_SCENARIOS) {
    it(`reproduces the recorded plan: ${scenario.key}`, async () => {
      const { scenarios: capturedScenarios } = await baseline();
      const now: ScenarioRecord | undefined = capturedScenarios.get(scenario.key);
      const recorded: ScenarioRecord | undefined = recordedScenarios.get(scenario.key);

      assert.ok(now, `scenario ${scenario.key} was not captured`);
      assert.ok(recorded, `scenario ${scenario.key} is missing from the snapshot`);

      assert.deepEqual(
        now.selection,
        recorded.selection,
        `product selection changed for ${scenario.key}`,
      );
      assert.deepEqual(
        now.response,
        recorded.response,
        `plan output changed for ${scenario.key}`,
      );
    });
  }

  for (const scenario of BASELINE_REPLACEMENTS) {
    it(`reproduces the recorded replacement: ${scenario.key}`, async () => {
      const { replacements: capturedReplacements } = await baseline();
      const now: ReplacementRecord | undefined = capturedReplacements.get(scenario.key);
      const recorded: ReplacementRecord | undefined = recordedReplacements.get(
        scenario.key,
      );

      assert.ok(now, `replacement ${scenario.key} was not captured`);
      assert.ok(recorded, `replacement ${scenario.key} is missing from the snapshot`);

      assert.deepEqual(now.before, recorded.before);
      assert.deepEqual(now.after, recorded.after);
    });
  }
});

describe("Aldi baseline: preserved invariants", () => {
  it("is deterministic for the same request and seed", async () => {
    const { record: captured } = await baseline();
    const second = await captureBaseline();
    assert.deepEqual(second, captured);
  });

  it("returns a different week for a different variation seed", async () => {
    const { scenarios: capturedScenarios } = await baseline();
    const seed0: ScenarioRecord | undefined = capturedScenarios.get("standard-seed-0");
    const seed1: ScenarioRecord | undefined = capturedScenarios.get("standard-seed-1");

    assert.ok(seed0 && seed1);
    assert.notDeepEqual(
      seed0.response.days,
      seed1.response.days,
      "regeneration must explore a different corner of the search",
    );
  });

  it("never exceeds the requested budget", async () => {
    for (const scenario of (await baseline()).record.scenarios) {
      const { budgetPence, estimatedTotalPence, budgetStatus } = scenario.response;

      assert.ok(
        estimatedTotalPence <= budgetPence,
        `${scenario.key} spent ${estimatedTotalPence} of ${budgetPence}`,
      );
      assert.notEqual(budgetStatus, "over-budget", scenario.key);
    }
  });

  it("keeps the inferred-allergen warning on every plan", async () => {
    for (const scenario of (await baseline()).record.scenarios) {
      const declaredAllergies = scenario.response.warnings.includes(
        INFERRED_WITH_ALLERGIES_WARNING,
      );
      const plainInference = scenario.response.warnings.includes(
        INFERRED_ALLERGEN_WARNING,
      );

      assert.ok(
        declaredAllergies || plainInference,
        `${scenario.key} lost its inferred-allergen warning`,
      );
    }
  });

  it("uses the allergy-specific warning exactly when an allergy was declared", async () => {
    for (const scenario of BASELINE_SCENARIOS) {
      const { scenarios: capturedScenarios } = await baseline();
      const entry: ScenarioRecord | undefined = capturedScenarios.get(scenario.key);
      assert.ok(entry);

      const expectsAllergyWording = scenario.request.allergies.length > 0;

      assert.equal(
        entry.response.warnings.includes(INFERRED_WITH_ALLERGIES_WARNING),
        expectsAllergyWording,
        scenario.key,
      );
    }
  });

  it("shops only from the Aldi catalogue it was given", async () => {
    const known = new Set(ALDI_CATALOGUE.map((product) => product.retailerProductId));

    for (const scenario of (await baseline()).record.scenarios) {
      for (const productId of productIdsIn(scenario.response)) {
        assert.ok(
          known.has(productId),
          `${scenario.key} used ${productId}, which is not in the Aldi catalogue`,
        );
      }
    }
  });

  /**
   * The strongest cross-retailer check available before plans carry a retailer
   * id: every product a plan buys must link back to an aldi.co.uk page. Slice
   * 3.2 replaces this with a real scope assertion.
   */
  it("links every purchased product to an aldi.co.uk page", async () => {
    const urls = new Map(
      ALDI_CATALOGUE.map((product) => [product.retailerProductId, product.productUrl]),
    );

    for (const scenario of (await baseline()).record.scenarios) {
      for (const group of scenario.response.shoppingList) {
        for (const item of group.items) {
          assert.equal(item.productUrl, urls.get(item.productId));
          assert.ok(
            item.productUrl.startsWith("https://www.aldi.co.uk/"),
            `${scenario.key} bought ${item.productId} from outside Aldi`,
          );
        }
      }
    }
  });

  it("prices every basket line from the catalogue, not from the planner", async () => {
    const prices = new Map(
      ALDI_CATALOGUE.map((product) => [product.retailerProductId, product.pricePence]),
    );

    for (const scenario of (await baseline()).record.scenarios) {
      let total = 0;

      for (const group of scenario.response.shoppingList) {
        for (const item of group.items) {
          assert.equal(item.unitPricePence, prices.get(item.productId), item.productId);
          assert.equal(item.totalPricePence, item.unitPricePence * item.quantity);
          total += item.totalPricePence;
        }
      }

      assert.equal(total, scenario.response.estimatedTotalPence, scenario.key);
    }
  });

  it("buys every must-have product and reports where it was used", async () => {
    for (const scenario of BASELINE_SCENARIOS) {
      if (scenario.request.mustHaveProductIds.length === 0) continue;

      const { scenarios: capturedScenarios } = await baseline();
      const entry: ScenarioRecord | undefined = capturedScenarios.get(scenario.key);
      assert.ok(entry);

      const bought = new Set(
        entry.response.shoppingList.flatMap((group) =>
          group.items.map((item) => item.productId),
        ),
      );

      for (const productId of scenario.request.mustHaveProductIds) {
        assert.ok(bought.has(productId), `${scenario.key} did not buy ${productId}`);

        const usage: MustHaveUsage | undefined = entry.response.mustHaveUsage.find(
          (used) => used.productId === productId,
        );
        assert.ok(usage && usage.usedIn.length > 0, `${scenario.key}: ${productId}`);
      }
    }
  });

  it("spends more as the budget target rises", async () => {
    const { scenarios: capturedScenarios } = await baseline();
    const tight: ScenarioRecord | undefined = capturedScenarios.get("budget-target-50");
    const generous: ScenarioRecord | undefined =
      capturedScenarios.get("budget-target-80");

    assert.ok(tight && generous);
    assert.ok(
      generous.response.estimatedTotalPence >= tight.response.estimatedTotalPence,
      "a generous target must not buy less than a tight one",
    );
  });
});

describe("Aldi baseline: meal replacement", () => {
  for (const scenario of BASELINE_REPLACEMENTS) {
    it(`changes only the targeted meal: ${scenario.key}`, async () => {
      const { replacements: capturedReplacements } = await baseline();
      const entry: ReplacementRecord | undefined = capturedReplacements.get(scenario.key);
      assert.ok(entry);

      for (const before of entry.before.days) {
        const after: MealPlanDay | undefined = entry.after.days.find(
          (day) => day.day === before.day,
        );
        assert.ok(after);

        if (before.day !== scenario.day) {
          assert.deepEqual(after, before, `day ${before.day} changed`);
          continue;
        }

        for (const meal of before.meals) {
          const replaced: MealPlanMeal | undefined = after.meals.find(
            (candidate) => candidate.mealType === meal.mealType,
          );
          assert.ok(replaced);

          if (meal.mealType !== scenario.mealType) {
            assert.deepEqual(replaced, meal);
          } else {
            assert.notEqual(replaced.recipeId, meal.recipeId, "the meal did not change");
          }
        }
      }
    });

    it(`reprices the whole basket after replacement: ${scenario.key}`, async () => {
      const { replacements: capturedReplacements } = await baseline();
      const entry: ReplacementRecord | undefined = capturedReplacements.get(scenario.key);
      assert.ok(entry);

      const total = entry.after.shoppingList.reduce(
        (sum, group) =>
          sum + group.items.reduce((groupSum, item) => groupSum + item.totalPricePence, 0),
        0,
      );

      assert.equal(total, entry.after.estimatedTotalPence);
      assert.ok(entry.after.estimatedTotalPence <= entry.after.budgetPence);
      assert.notEqual(entry.after.budgetStatus, "over-budget");
    });
  }
});
