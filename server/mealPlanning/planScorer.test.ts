import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveBudgetTarget } from "./budgetTarget";
import {
  SCORE_WEIGHTS,
  comparePlanCandidates,
  scorePlan,
  type PlanFacts,
} from "./planScorer";

/** £70 maximum, aiming at 80% of it. */
const TARGET = resolveBudgetTarget(7_000, 80);

function facts(overrides: Partial<PlanFacts> = {}): PlanFacts {
  const base = {
    totalPence: 5_600,
    consumedPence: 5_600,
    budgetTarget: TARGET,
    packagesUsed: 20,
    packagesBought: 25,
    distinctRecipesByMealType: [3, 3, 3],
    distinctRecipeCount: 9,
    recipesMatchingPreference: 9,
    recipesMatchingCuisine: 9,
    hasPreferenceRequest: true,
    hasCuisineRequest: true,
    averageMinutes: 10,
    foodGroupsCovered: 6,
    uniqueProductCount: 18,
  };

  // Consumed spend tracks the basket unless a test deliberately separates them,
  // so a test that only moves `totalPence` is describing a whole basket.
  const merged = { ...base, ...overrides };
  return "consumedPence" in overrides
    ? merged
    : { ...merged, consumedPence: merged.totalPence };
}

describe("scorePlan", () => {
  it("keeps every component inside its declared weight", () => {
    const extremes: PlanFacts[] = [
      facts(),
      facts({ totalPence: 0 }),
      facts({ totalPence: 7_000 }),
      facts({ totalPence: 14_000 }),
      facts({ totalPence: 5_600, consumedPence: 0 }),
      facts({ packagesUsed: 0, packagesBought: 100 }),
      facts({ packagesUsed: 100, packagesBought: 1 }),
      facts({ distinctRecipesByMealType: [1] }),
      facts({ distinctRecipesByMealType: [7, 7, 7, 7] }),
      facts({ recipesMatchingPreference: 0, recipesMatchingCuisine: 0 }),
      facts({ averageMinutes: 0 }),
      facts({ averageMinutes: 600 }),
      facts({ foodGroupsCovered: 0 }),
      facts({ foodGroupsCovered: 9 }),
    ];

    for (const input of extremes) {
      const { breakdown, total } = scorePlan(input);

      for (const [component, weight] of Object.entries(SCORE_WEIGHTS)) {
        const value = breakdown[component as keyof typeof breakdown];
        assert.ok(value >= 0, `${component} went negative: ${value}`);
        assert.ok(value <= weight, `${component} exceeded its weight: ${value} > ${weight}`);
      }

      assert.ok(total >= 0 && total <= 100, `total out of range: ${total}`);
      assert.ok(Number.isInteger(total), `total must be an integer: ${total}`);
    }
  });

  it("declares weights that add up to 100", () => {
    const sum = Object.values(SCORE_WEIGHTS).reduce((total, weight) => total + weight, 0);

    assert.equal(sum, 100);
  });

  it("scores a plan at the target above one far below it", () => {
    const onTarget = scorePlan(facts({ totalPence: TARGET.targetPence })).breakdown.budgetFit;
    const threadbare = scorePlan(facts({ totalPence: 1_600 })).breakdown.budgetFit;

    assert.ok(
      onTarget > threadbare,
      `on target ${onTarget} must beat far below ${threadbare}`,
    );
  });

  it("scores a plan inside the preferred band above one outside it", () => {
    const inside = scorePlan(facts({ totalPence: TARGET.upperPreferredPence })).breakdown.budgetFit;
    const below = scorePlan(
      facts({ totalPence: TARGET.lowerPreferredPence - 100 }),
    ).breakdown.budgetFit;

    assert.ok(inside > below, `inside ${inside} must beat outside ${below}`);
  });

  it("follows the chosen preset rather than a fixed ideal", () => {
    const tight = resolveBudgetTarget(7_000, 50);
    const atTightTarget = scorePlan(
      facts({ budgetTarget: tight, totalPence: tight.targetPence }),
    ).breakdown.budgetFit;
    const atFullTarget = scorePlan(
      facts({ budgetTarget: tight, totalPence: TARGET.targetPence }),
    ).breakdown.budgetFit;

    assert.ok(
      atTightTarget > atFullTarget,
      "a tight request must prefer the tight target, not the default one",
    );
  });

  it("punishes falling short of the target harder than overshooting it", () => {
    const under = scorePlan(facts({ totalPence: TARGET.targetPence - 700 })).breakdown.budgetFit;
    const over = scorePlan(facts({ totalPence: TARGET.targetPence + 700 })).breakdown.budgetFit;

    assert.ok(over > under, `overshoot ${over} must beat shortfall ${under}`);
  });

  it("gives no budget credit to a plan that breaks the hard maximum", () => {
    assert.equal(scorePlan(facts({ totalPence: 14_000 })).breakdown.budgetFit, 0);
  });

  it("does not pay for stock the week never opens", () => {
    const onTarget = scorePlan(facts({ totalPence: TARGET.targetPence }));
    const padded = scorePlan(
      facts({ totalPence: TARGET.targetPence, consumedPence: 1_600 }),
    );

    assert.ok(
      padded.breakdown.budgetFit < onTarget.breakdown.budgetFit,
      "spending that no recipe consumes must not earn budget credit",
    );
  });

  it("never lets buying unused packs improve the total score", () => {
    const lean = scorePlan(
      facts({ totalPence: 2_000, consumedPence: 1_900, packagesUsed: 22, packagesBought: 25 }),
    );
    // The same week, plus packs nobody cooks with, priced up to the target.
    const padded = scorePlan(
      facts({
        totalPence: TARGET.targetPence,
        consumedPence: 1_900,
        packagesUsed: 22,
        packagesBought: 60,
      }),
    );

    assert.ok(
      padded.total <= lean.total,
      `padding the basket raised the score: ${padded.total} > ${lean.total}`,
    );
  });

  it("rewards using more of what was bought", () => {
    const wasteful = scorePlan(facts({ packagesUsed: 5, packagesBought: 25 }));
    const thrifty = scorePlan(facts({ packagesUsed: 22, packagesBought: 25 }));

    assert.ok(thrifty.breakdown.ingredientReuse > wasteful.breakdown.ingredientReuse);
  });

  it("awards full reuse credit when nothing is left over", () => {
    assert.equal(
      scorePlan(facts({ packagesUsed: 25, packagesBought: 25 })).breakdown.ingredientReuse,
      SCORE_WEIGHTS.ingredientReuse,
    );
  });

  it("rewards a varied week over the same dish seven times", () => {
    const repetitive = scorePlan(facts({ distinctRecipesByMealType: [1, 1, 1] }));
    const varied = scorePlan(facts({ distinctRecipesByMealType: [3, 3, 3] }));

    assert.ok(varied.breakdown.recipeVariety > repetitive.breakdown.recipeVariety);
  });

  it("does not pay for variety beyond a useful weekly spread", () => {
    const three = scorePlan(facts({ distinctRecipesByMealType: [3] })).breakdown.recipeVariety;
    const seven = scorePlan(facts({ distinctRecipesByMealType: [7] })).breakdown.recipeVariety;

    assert.equal(three, seven);
  });

  it("rewards recipes that match the stated preferences", () => {
    const missed = scorePlan(facts({ recipesMatchingPreference: 0 }));
    const matched = scorePlan(facts({ recipesMatchingPreference: 9 }));

    assert.ok(matched.breakdown.preferenceMatch > missed.breakdown.preferenceMatch);
  });

  it("does not penalise a request that stated no preference or cuisine", () => {
    const scored = scorePlan(
      facts({
        hasPreferenceRequest: false,
        hasCuisineRequest: false,
        recipesMatchingPreference: 0,
        recipesMatchingCuisine: 0,
      }),
    );

    assert.equal(scored.breakdown.preferenceMatch, SCORE_WEIGHTS.preferenceMatch);
    assert.equal(scored.breakdown.cuisineMatch, SCORE_WEIGHTS.cuisineMatch);
  });

  it("rewards quicker cooking", () => {
    const slow = scorePlan(facts({ averageMinutes: 90 }));
    const quick = scorePlan(facts({ averageMinutes: 15 }));

    assert.ok(quick.breakdown.practicality > slow.breakdown.practicality);
  });

  it("rewards a broader spread of food groups", () => {
    const narrow = scorePlan(facts({ foodGroupsCovered: 1 }));
    const broad = scorePlan(facts({ foodGroupsCovered: 6 }));

    assert.ok(broad.breakdown.foodGroupBalance > narrow.breakdown.foodGroupBalance);
  });

  it("totals its own components", () => {
    const { total, breakdown } = scorePlan(facts());
    const sum = Object.values(breakdown).reduce((running, value) => running + value, 0);

    assert.equal(total, Math.round(sum));
  });

  it("is deterministic", () => {
    assert.deepEqual(scorePlan(facts()), scorePlan(facts()));
  });
});

describe("comparePlanCandidates", () => {
  const base = {
    score: 70,
    targetDistancePence: 600,
    totalPence: 5_000,
    uniqueProductCount: 15,
    signature: "b",
  };

  it("prefers the higher score", () => {
    assert.ok(comparePlanCandidates({ ...base, score: 80 }, base) < 0);
  });

  it("breaks a score tie on the basket nearest the chosen target", () => {
    assert.ok(comparePlanCandidates({ ...base, targetDistancePence: 100 }, base) < 0);
    assert.ok(comparePlanCandidates({ ...base, targetDistancePence: 2_400 }, base) > 0);
  });

  it("breaks a target-distance tie on the cheaper basket", () => {
    assert.ok(comparePlanCandidates({ ...base, totalPence: 4_000 }, base) < 0);
  });

  it("breaks a cost tie on fewer products to buy", () => {
    assert.ok(comparePlanCandidates({ ...base, uniqueProductCount: 10 }, base) < 0);
  });

  it("breaks every remaining tie on the canonical signature", () => {
    assert.ok(comparePlanCandidates({ ...base, signature: "a" }, base) < 0);
    assert.ok(comparePlanCandidates({ ...base, signature: "c" }, base) > 0);
  });

  it("is a total order, so sorting can never be ambiguous", () => {
    const candidates = [
      { ...base, signature: "b" },
      { ...base, signature: "a" },
      { ...base, score: 90, totalPence: 6_000, uniqueProductCount: 20, signature: "c" },
      { ...base, totalPence: 4_000, signature: "d" },
    ];

    for (const left of candidates) {
      for (const right of candidates) {
        if (left === right) continue;
        assert.notEqual(
          comparePlanCandidates(left, right),
          0,
          `${left.signature} and ${right.signature} compare equal`,
        );
      }
    }

    const sorted = [...candidates].sort(comparePlanCandidates).map((entry) => entry.signature);
    assert.deepEqual(sorted, ["c", "d", "a", "b"]);
  });
});
