/**
 * Selected cooking days, the hard cooking-time ceiling, and ingredients the
 * household already owns.
 *
 * All three are constraints rather than preferences, so every test here is
 * about what the planner *refuses* to return. A plan that cooks on a day the
 * user unticked, or hands a 50-minute recipe to someone who said 30, has not
 * partially satisfied the request — it has ignored it.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import {
  planRequest,
  productsById,
  selectedProducts,
} from "../testing/planningFixtures";
import { createMealPlanEngine, type EngineOptions } from "./mealPlanEngine";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import { validateAndPricePlan } from "./mealPlanValidator";
import type { MealPlanRequest } from "./mealPlanTypes";

const BOUNDS: EngineOptions = {
  beamWidth: 32,
  candidateLimit: 24,
  maxRecipeVariants: 6,
  timeoutMs: 1_500,
};

async function plan(request: MealPlanRequest, variationSeed = 0) {
  const products = selectedProducts(request);
  const { plan: generated } = await createMealPlanEngine(BOUNDS).generate({
    request,
    products,
    variationSeed,
  });

  return validateAndPricePlan(generated, {
    request,
    products: productsById(products),
  });
}

describe("selected cooking days", () => {
  it("defaults to the whole week when none are named", () => {
    assert.deepEqual(planRequest().cookingDays, [1, 2, 3, 4, 5, 6, 7]);
  });

  it("returns one day for one selected day", async () => {
    const priced = await plan(planRequest({ cookingDays: [3] }));

    assert.equal(priced.days.length, 1);
    assert.equal(priced.days[0].day, 3);
  });

  it("returns exactly the four days that were selected", async () => {
    const priced = await plan(planRequest({ cookingDays: [1, 2, 5, 7] }));

    assert.deepEqual(
      priced.days.map((day) => day.day),
      [1, 2, 5, 7],
    );
  });

  it("ignores the order the days were sent in", async () => {
    const ordered = await plan(planRequest({ cookingDays: [1, 3, 6] }));
    const shuffled = await plan(planRequest({ cookingDays: [6, 1, 3] }));

    assert.deepEqual(shuffled.days, ordered.days);
    assert.equal(shuffled.estimatedTotalPence, ordered.estimatedTotalPence);
  });

  it("folds a duplicate day away rather than cooking twice", () => {
    assert.deepEqual(planRequest({ cookingDays: [2, 2, 5] }).cookingDays, [2, 5]);
  });

  for (const days of [[0], [8], [1, 9], [-1], [1.5]]) {
    it(`rejects out-of-range cooking days: ${JSON.stringify(days)}`, () => {
      assert.throws(
        () => parseMealPlanRequest({ ...validBody(), cookingDays: days }),
        (error: unknown) =>
          error instanceof ApiError &&
          error.details !== undefined &&
          JSON.stringify(error.details).includes("cookingDays"),
      );
    });
  }

  it("rejects an empty selection rather than planning nothing", () => {
    assert.throws(
      () => parseMealPlanRequest({ ...validBody(), cookingDays: [] }),
      ApiError,
    );
  });

  it("buys only for the days it plans", async () => {
    const wholeWeek = await plan(planRequest({ mealsPerDay: ["dinner"] }));
    const twoDays = await plan(
      planRequest({ mealsPerDay: ["dinner"], cookingDays: [1, 2] }),
    );

    assert.ok(
      twoDays.estimatedTotalPence < wholeWeek.estimatedTotalPence,
      "cooking two days must not cost as much as cooking seven",
    );
  });

  it("preserves the legacy week when all seven days are selected", async () => {
    const implicit = await plan(planRequest({ mealsPerDay: ["dinner"] }));
    const explicit = await plan(
      planRequest({ mealsPerDay: ["dinner"], cookingDays: [1, 2, 3, 4, 5, 6, 7] }),
    );

    assert.deepEqual(explicit.days, implicit.days);
    assert.equal(explicit.estimatedTotalPence, implicit.estimatedTotalPence);
  });

  it("rejects a plan that cooks on a day the household did not choose", () => {
    const request = planRequest({ mealsPerDay: ["dinner"], cookingDays: [1, 2] });
    const products = selectedProducts(request);

    assert.throws(
      () =>
        validateAndPricePlan(
          {
            days: [
              { day: 1, meals: [{ mealType: "dinner", recipeId: "r-1" }] },
              // Day 4 was never selected.
              { day: 4, meals: [{ mealType: "dinner", recipeId: "r-1" }] },
            ],
            recipes: [
              {
                id: "r-1",
                title: "Test",
                mealType: "dinner",
                servings: 2,
                prepMinutes: 5,
                cookMinutes: 5,
                appliances: ["hob"],
                ingredients: [
                  { productId: products[0].productId, quantity: "1", packages: 1 },
                ],
                pantryItems: [],
                steps: ["Cook."],
              },
            ],
          },
          { request, products: productsById(products) },
        ),
      /duplicate or invalid day number/i,
    );
  });
});

describe("hard cooking-time limit", () => {
  it("never returns a recipe longer than the limit", async () => {
    const priced = await plan(
      planRequest({ mealsPerDay: ["dinner"], maxTotalMinutes: 30 }),
    );

    for (const recipe of priced.recipes) {
      assert.ok(
        recipe.prepMinutes + recipe.cookMinutes <= 30,
        `${recipe.title} takes ${recipe.prepMinutes + recipe.cookMinutes} minutes`,
      );
    }
  });

  it("allows longer recipes when no limit is set", async () => {
    const limited = await plan(
      planRequest({ mealsPerDay: ["dinner"], maxTotalMinutes: 30 }),
    );
    const unlimited = await plan(planRequest({ mealsPerDay: ["dinner"] }));

    const longest = (recipes: typeof unlimited.recipes) =>
      Math.max(...recipes.map((r) => r.prepMinutes + r.cookMinutes));

    assert.ok(longest(unlimited.recipes) >= longest(limited.recipes));
  });

  it("keeps `quick` a preference rather than a ceiling", async () => {
    // A quick-preferring week may still contain a longer recipe; only an
    // explicit limit forbids one. Conflating the two would silently narrow
    // the menu for everyone who ticked "quick".
    const priced = await plan(
      planRequest({ mealsPerDay: ["dinner"], mealPreferences: ["quick"] }),
    );

    assert.ok(priced.recipes.length > 0);
  });

  it("reports a constraint conflict when nothing fits the limit", async () => {
    await assert.rejects(
      () => plan(planRequest({ mealsPerDay: ["dinner"], maxTotalMinutes: 10 })),
      (error: unknown) =>
        error instanceof ApiError &&
        ["CATALOGUE_CONSTRAINT_CONFLICT", "PLANNER_INTERNAL_ERROR"].includes(error.code),
    );
  });

  for (const value of [0, 5, 500, 1.5, "30"]) {
    it(`rejects an invalid time limit: ${JSON.stringify(value)}`, () => {
      assert.throws(
        () => parseMealPlanRequest({ ...validBody(), maxTotalMinutes: value }),
        ApiError,
      );
    });
  }
});

describe("ingredients already owned", () => {
  it("keeps an owned product in the recipe but out of the total", async () => {
    const base = planRequest({ mealsPerDay: ["dinner"], cookingDays: [1, 2] });
    const priced = await plan(base);

    const bought = priced.shoppingList.flatMap((group) => group.items);
    assert.ok(bought.length > 0);

    const ownedId = bought[0].productId;
    const withOwned = await plan(
      planRequest({
        mealsPerDay: ["dinner"],
        cookingDays: [1, 2],
        ownedProductIds: [ownedId],
      }),
    );

    const item = withOwned.shoppingList
      .flatMap((group) => group.items)
      .find((entry) => entry.productId === ownedId);

    assert.ok(item, "an owned product must remain visible on the list");
    assert.equal(item.alreadyOwned, true);
    assert.equal(item.totalPricePence, 0);
  });

  it("still lets the recipe use the owned ingredient", async () => {
    const base = await plan(planRequest({ mealsPerDay: ["dinner"], cookingDays: [1] }));
    const ownedId = base.shoppingList[0].items[0].productId;

    const withOwned = await plan(
      planRequest({
        mealsPerDay: ["dinner"],
        cookingDays: [1],
        ownedProductIds: [ownedId],
      }),
    );

    const usedByARecipe = withOwned.recipes.some((recipe) =>
      recipe.productIds.includes(ownedId),
    );

    assert.ok(usedByARecipe, "owning something must not remove it from the cooking");
  });

  it("defaults to owning nothing", () => {
    assert.deepEqual(planRequest().ownedProductIds, []);
  });
});

function validBody(): Record<string, unknown> {
  return {
    budgetPence: 7_000,
    householdSize: 2,
    mealsPerDay: ["dinner"],
    appliances: ["hob", "oven"],
    pantryBasics: [],
  };
}
