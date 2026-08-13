import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import { validateAndPricePlan } from "./mealPlanValidator";
import type { MealPlanRequest, SelectableProduct } from "./mealPlanTypes";

function product(
  productId: string,
  overrides: Partial<SelectableProduct> = {},
): SelectableProduct {
  return {
    productId,
    name: `Product ${productId}`,
    brand: null,
    category: "Food Cupboard",
    categoryPaths: [["Food Cupboard", "Rice, Pasta & Noodles"]],
    pricePence: 100,
    packageSize: "500g",
    allergens: [],
    dietaryInfo: null,
    safetyStatus: "inferred",
    productUrl: `https://www.aldi.co.uk/product/${productId}`,
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
    ...overrides,
  };
}

const PRODUCTS = new Map(
  [product("p1"), product("p2", { pricePence: 250 })].map((entry) => [
    entry.productId,
    entry,
  ]),
);

function request(overrides: Partial<MealPlanRequest> = {}): MealPlanRequest {
  return parseMealPlanRequest({
    budgetPence: 7000,
    householdSize: 2,
    mealsPerDay: ["dinner"],
    appliances: ["hob"],
    ...overrides,
  });
}

function plan(overrides: Record<string, unknown> = {}) {
  return {
    days: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      meals: [{ mealType: "dinner", recipeId: "r1" }],
    })),
    recipes: [
      {
        id: "r1",
        title: "Tomato Pasta",
        mealType: "dinner",
        servings: 2,
        prepMinutes: 10,
        cookMinutes: 20,
        appliances: ["hob"],
        ingredients: [{ productId: "p1", quantity: "200g", packages: 0.4 }],
        steps: ["Boil the pasta.", "Stir through the sauce."],
      },
    ],
    ...overrides,
  };
}

function context(overrides: Partial<MealPlanRequest> = {}) {
  return { request: request(overrides), products: PRODUCTS };
}

function rejectionReason(raw: unknown, ctx = context()): string {
  try {
    validateAndPricePlan(raw, ctx);
    return "ACCEPTED";
  } catch (error) {
    assert.ok(error instanceof ApiError, "expected an ApiError");
    assert.equal(error.status, 422);
    assert.equal(error.code, "AI_INVALID_RESPONSE");
    return (error.details as { reason: string }).reason;
  }
}

describe("validateAndPricePlan", () => {
  it("accepts a well-formed plan and prices it from product records", () => {
    const priced = validateAndPricePlan(plan(), context());

    assert.equal(priced.days.length, 7);
    assert.equal(priced.recipes.length, 1);
    // 7 dinners x 0.4 packs = 2.8 packs, rounded up to 3 packs at 100p.
    assert.equal(priced.estimatedTotalPence, 300);
    assert.equal(priced.budgetStatus, "within-budget");
  });

  it("ignores any price the generator claims", () => {
    const priced = validateAndPricePlan(
      plan({
        recipes: [
          {
            ...plan().recipes[0],
            estimatedCostPence: 999_999,
            ingredients: [
              {
                productId: "p1",
                quantity: "200g",
                packages: 0.4,
                estimatedCostPence: 1,
              },
            ],
          },
        ],
      }),
      context(),
    );

    assert.equal(priced.estimatedTotalPence, 300);
    assert.equal(priced.recipes[0].ingredients[0].estimatedCostPence, 40);
  });

  it("rejects a plan referencing a product outside the selection", () => {
    assert.equal(
      rejectionReason(
        plan({
          recipes: [
            {
              ...plan().recipes[0],
              ingredients: [
                { productId: "not-a-real-product", quantity: "1", packages: 1 },
              ],
            },
          ],
        }),
      ),
      "UNKNOWN_PRODUCT",
    );
  });

  it("rejects a plan that is not exactly seven days", () => {
    assert.equal(rejectionReason(plan({ days: [] })), "WRONG_DAY_COUNT");
    assert.equal(
      rejectionReason(plan({ days: [...plan().days, { day: 8, meals: [] }] })),
      "WRONG_DAY_COUNT",
    );
  });

  it("rejects duplicated or out-of-range day numbers", () => {
    const days = plan().days.map((day) => ({ ...day, day: 1 }));
    assert.equal(rejectionReason(plan({ days })), "INVALID_DAY_NUMBER");
  });

  it("rejects a meal type the user did not ask for", () => {
    const days = plan().days.map((day) => ({
      ...day,
      meals: [{ mealType: "breakfast", recipeId: "r1" }],
    }));

    assert.equal(rejectionReason(plan({ days })), "UNREQUESTED_MEAL_TYPE");
  });

  it("requires every requested meal type on every day", () => {
    assert.equal(
      rejectionReason(plan(), context({ mealsPerDay: ["dinner", "lunch"] })),
      "MISSING_MEAL",
    );
  });

  it("rejects a meal pointing at a recipe that does not exist", () => {
    const days = plan().days.map((day) => ({
      ...day,
      meals: [{ mealType: "dinner", recipeId: "ghost" }],
    }));

    assert.equal(rejectionReason(plan({ days })), "UNKNOWN_RECIPE");
  });

  it("rejects a recipe needing an appliance the household lacks", () => {
    assert.equal(
      rejectionReason(
        plan({
          recipes: [{ ...plan().recipes[0], appliances: ["air-fryer"] }],
        }),
      ),
      "UNAVAILABLE_APPLIANCE",
    );
  });

  it("allows only no-cook recipes when no appliance was selected", () => {
    assert.equal(
      rejectionReason(plan(), context({ appliances: [] })),
      "UNAVAILABLE_APPLIANCE",
    );

    const noCook = plan({
      recipes: [{ ...plan().recipes[0], appliances: [], cookMinutes: 0 }],
    });
    assert.equal(rejectionReason(noCook, context({ appliances: [] })), "ACCEPTED");
  });

  it("rejects a recipe using a product that conflicts with a declared allergy", () => {
    const products = new Map(PRODUCTS);
    products.set("p1", product("p1", { allergens: ["milk"] }));

    try {
      validateAndPricePlan(plan(), {
        request: request({ allergies: ["milk"] }),
        products,
      });
      assert.fail("expected an allergy conflict to be rejected");
    } catch (error) {
      assert.ok(error instanceof ApiError);
      assert.equal((error.details as { reason: string }).reason, "ALLERGY_CONFLICT");
    }
  });

  it("rejects structurally broken output without echoing it back", () => {
    assert.equal(rejectionReason(null), "NOT_AN_OBJECT");
    assert.equal(rejectionReason("{}"), "NOT_AN_OBJECT");
    assert.equal(rejectionReason({ days: plan().days }), "MISSING_RECIPES");
    assert.equal(
      rejectionReason(plan({ recipes: [{ ...plan().recipes[0], steps: [] }] })),
      "INVALID_RECIPE",
    );
  });

  it("treats a missing package count as one whole pack and records the assumption", () => {
    const priced = validateAndPricePlan(
      plan({
        recipes: [
          {
            ...plan().recipes[0],
            ingredients: [{ productId: "p1", quantity: "some" }],
          },
        ],
      }),
      context(),
    );

    // 7 dinners x 1 pack, never under-counted: the budget promise must not
    // depend on the generator supplying a quantity.
    assert.equal(priced.estimatedTotalPence, 700);
    assert.ok(priced.assumptions.some((note) => /pack/i.test(note)));
  });

  it("counts a reused recipe once per appearance in the week", () => {
    const priced = validateAndPricePlan(
      plan({
        days: Array.from({ length: 7 }, (_, index) => ({
          day: index + 1,
          meals: [{ mealType: "dinner", recipeId: index < 3 ? "r1" : "r2" }],
        })),
        recipes: [
          plan().recipes[0],
          {
            ...plan().recipes[0],
            id: "r2",
            title: "Rice Bowl",
            ingredients: [{ productId: "p2", quantity: "1 pack", packages: 1 }],
          },
        ],
      }),
      context(),
    );

    // r1 x3 x0.4 = 1.2 -> 2 packs of p1 (200p); r2 x4 x1 = 4 packs of p2 (1000p).
    assert.equal(priced.estimatedTotalPence, 1200);
    assert.equal(priced.productsUsed, 2);
  });

  it("marks a plan over budget rather than silently trimming it", () => {
    const priced = validateAndPricePlan(plan(), {
      request: request({ budgetPence: 1000 }),
      products: PRODUCTS,
    });

    assert.equal(priced.budgetStatus, "within-budget");

    const expensive = validateAndPricePlan(
      plan({
        recipes: [
          {
            ...plan().recipes[0],
            ingredients: [{ productId: "p2", quantity: "1", packages: 5 }],
          },
        ],
      }),
      { request: request({ budgetPence: 1000 }), products: PRODUCTS },
    );

    assert.equal(expensive.budgetStatus, "over-budget");
    assert.ok(expensive.estimatedTotalPence > 1000);
  });

  it("caps absurdly large output", () => {
    assert.equal(
      rejectionReason(
        plan({
          recipes: Array.from({ length: 200 }, (_, index) => ({
            ...plan().recipes[0],
            id: `r${index}`,
          })),
        }),
      ),
      "TOO_MANY_RECIPES",
    );
  });
});
