import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateMockPlan } from "./mockPlanner";
import { validateAndPricePlan } from "./mealPlanValidator";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import type { MealPlanRequest, SelectableProduct } from "./mealPlanTypes";

function product(
  productId: string,
  name: string,
  categoryPath: string[],
  pricePence = 120,
): SelectableProduct {
  return {
    productId,
    name,
    brand: null,
    category: categoryPath[0],
    categoryPaths: [categoryPath],
    pricePence,
    packageSize: "500g",
    allergens: [],
    dietaryInfo: null,
    safetyStatus: "inferred",
    productUrl: `https://www.aldi.co.uk/product/${productId}`,
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
  };
}

const CATALOGUE: SelectableProduct[] = [
  product("prot1", "Chicken Breast Fillets", ["Fresh Food", "Poultry"], 350),
  product("prot2", "Beef Mince 5%", ["Fresh Food", "Beef"], 320),
  product("prot3", "Salmon Fillets", ["Fresh Food", "Fish"], 400),
  product("veg1", "Carrots 1kg", ["Fresh Food", "Vegetables"], 60),
  product("veg2", "Broccoli", ["Fresh Food", "Vegetables"], 65),
  product("veg3", "Onions 1kg", ["Fresh Food", "Vegetables"], 89),
  product("stap1", "Basmati Rice 1kg", ["Food Cupboard", "Rice, Pasta & Noodles"], 145),
  product("stap2", "Fusilli Pasta 500g", ["Food Cupboard", "Rice, Pasta & Noodles"], 75),
  product("stap3", "Potatoes 2.5kg", ["Frozen Food", "Chips & Potato"], 199),
  product("dairy1", "Semi Skimmed Milk", ["Chilled Food", "Milk"], 120),
  product("dairy2", "Natural Yogurt", ["Chilled Food", "Yogurts"], 65),
  product("dairy3", "Mature Cheddar", ["Chilled Food", "Cheese"], 245),
  product("bake1", "Wholemeal Bread", ["Bakery", "Bread"], 89),
  product("bake2", "Bread Rolls", ["Bakery", "Bread Rolls"], 99),
  product("sauce1", "Chopped Tomatoes", ["Food Cupboard", "Tins, Cans & Packets"], 45),
  product("sauce2", "Olive Oil", ["Food Cupboard", "Sauces, Oils & Dressings"], 299),
  product("fruit1", "Bananas", ["Fresh Food", "Fruit"], 85),
  product("fruit2", "Apples 6 Pack", ["Fresh Food", "Fruit"], 145),
];

function request(overrides: Record<string, unknown> = {}): MealPlanRequest {
  return parseMealPlanRequest({
    budgetPence: 7000,
    householdSize: 2,
    mealsPerDay: ["dinner"],
    appliances: ["hob", "oven"],
    ...overrides,
  });
}

function catalogueMap(products = CATALOGUE): Map<string, SelectableProduct> {
  return new Map(products.map((entry) => [entry.productId, entry]));
}

describe("generateMockPlan", () => {
  it("produces a plan the real validator accepts", () => {
    const priced = validateAndPricePlan(generateMockPlan(request(), CATALOGUE), {
      request: request(),
      products: catalogueMap(),
    });

    assert.equal(priced.days.length, 7);
    assert.ok(priced.recipes.length > 0);
    assert.ok(priced.estimatedTotalPence > 0);
  });

  it("covers every requested meal type on all seven days", () => {
    const constraints = request({ mealsPerDay: ["breakfast", "lunch", "dinner"] });
    const priced = validateAndPricePlan(generateMockPlan(constraints, CATALOGUE), {
      request: constraints,
      products: catalogueMap(),
    });

    assert.equal(priced.days.length, 7);
    for (const day of priced.days) {
      assert.deepEqual(
        day.meals.map((meal) => meal.mealType).sort(),
        ["breakfast", "dinner", "lunch"],
      );
    }
  });

  it("uses only products from the supplied selection", () => {
    const allowed = new Set(CATALOGUE.map((entry) => entry.productId));
    const plan = generateMockPlan(request(), CATALOGUE);

    for (const recipe of plan.recipes) {
      for (const ingredient of recipe.ingredients) {
        assert.ok(
          allowed.has(ingredient.productId),
          `${ingredient.productId} is not in the selection`,
        );
      }
    }
  });

  it("plans only no-cook meals when the household has no appliances", () => {
    const constraints = request({ appliances: [] });
    const plan = generateMockPlan(constraints, CATALOGUE);

    for (const recipe of plan.recipes) {
      assert.deepEqual(recipe.appliances, []);
    }

    // The validator is the real check: it rejects any appliance use here.
    validateAndPricePlan(plan, { request: constraints, products: catalogueMap() });
  });

  it("never requires an appliance the household did not select", () => {
    const constraints = request({ appliances: ["microwave"] });
    const plan = generateMockPlan(constraints, CATALOGUE);

    for (const recipe of plan.recipes) {
      for (const appliance of recipe.appliances) {
        assert.equal(appliance, "microwave");
      }
    }
  });

  it("is deterministic for the same request and catalogue", () => {
    assert.deepEqual(
      generateMockPlan(request(), CATALOGUE),
      generateMockPlan(request(), [...CATALOGUE]),
    );
  });

  it("reuses a small set of recipes across the week to limit waste", () => {
    const plan = generateMockPlan(request(), CATALOGUE);

    assert.ok(plan.recipes.length >= 2, "a week of one meal is not a plan");
    assert.ok(plan.recipes.length <= 5, "too much variety wastes ingredients");
  });

  it("still plans when the catalogue holds only one usable product", () => {
    const single = [CATALOGUE[0]];
    const priced = validateAndPricePlan(generateMockPlan(request(), single), {
      request: request(),
      products: catalogueMap(single),
    });

    assert.equal(priced.days.length, 7);
  });

  it("stays within a realistic weekly budget for a two-person household", () => {
    const constraints = request({ budgetPence: 7000 });
    const priced = validateAndPricePlan(generateMockPlan(constraints, CATALOGUE), {
      request: constraints,
      products: catalogueMap(),
    });

    assert.equal(priced.budgetStatus, "within-budget");
  });
});
