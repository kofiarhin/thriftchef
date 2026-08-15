import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp, type AppOverrides } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import { generateMockPlan } from "./mockPlanner";
import type { CandidateProduct } from "./productSelector";
import type { MealPlanResponse } from "./mealPlanTypes";

function candidate(
  retailerProductId: string,
  name: string,
  categoryPath: string[],
  overrides: Partial<CandidateProduct> = {},
): CandidateProduct {
  return {
    retailerProductId,
    name,
    brand: null,
    description: null,
    categoryPaths: [categoryPath],
    pricePence: 120,
    packageSizeRaw: "500g",
    dietaryInformationRaw: null,
    normalizedAllergens: [],
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    productUrl: `https://www.aldi.co.uk/product/${retailerProductId}`,
    lastSeenAt: new Date(),
    ...overrides,
  };
}

const CATALOGUE: CandidateProduct[] = [
  candidate("prot1", "Chicken Breast Fillets", ["Fresh Food", "Poultry"], {
    pricePence: 350,
  }),
  candidate("prot2", "Beef Mince", ["Fresh Food", "Beef"], { pricePence: 320 }),
  candidate("veg1", "Carrots", ["Fresh Food", "Vegetables"], { pricePence: 60 }),
  candidate("veg2", "Broccoli", ["Fresh Food", "Vegetables"], { pricePence: 65 }),
  candidate("stap1", "Basmati Rice", ["Food Cupboard", "Rice, Pasta & Noodles"], {
    pricePence: 145,
  }),
  candidate("stap2", "Fusilli Pasta", ["Food Cupboard", "Rice, Pasta & Noodles"], {
    pricePence: 75,
  }),
  candidate("dairy1", "Mature Cheddar", ["Chilled Food", "Cheese"], {
    pricePence: 245,
    normalizedAllergens: ["milk"],
  }),
  candidate("bake1", "Wholemeal Bread", ["Bakery", "Bread"], { pricePence: 89 }),
  candidate("sauce1", "Chopped Tomatoes", ["Food Cupboard", "Tins, Cans & Packets"], {
    pricePence: 45,
  }),
  candidate("fruit1", "Bananas", ["Fresh Food", "Fruit"], { pricePence: 85 }),
];

const VALID_BODY = {
  budgetPence: 7000,
  householdSize: 2,
  mealsPerDay: ["dinner"],
  mealPreferences: ["quick"],
  cuisinePreferences: ["British"],
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: [],
};

async function withServer(
  overrides: AppOverrides,
  run: (post: (body: unknown, path?: string) => Promise<Response>) => Promise<void>,
): Promise<void> {
  const server = await startTestServer(createApp(testConfig(), overrides));

  try {
    await run((body, path = "/api/meal-plans/generate") =>
      server.fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  } finally {
    await server.close();
  }
}

const WITH_CATALOGUE: AppOverrides = {
  mealPlanDependencies: {
    loadProducts: async () => CATALOGUE,
    generate: async ({ request, products }) => generateMockPlan(request, products),
  },
};

describe("POST /api/meal-plans/generate", () => {
  it("replaces one meal without changing the other six days", async () => {
    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => CATALOGUE,
          generate: async (input) =>
            input.replacement
              ? {
                  recipe: {
                    id: "ignored-by-server",
                    title: "Chicken tomato rice bowl",
                    mealType: "dinner",
                    servings: 2,
                    prepMinutes: 10,
                    cookMinutes: 25,
                    appliances: ["hob"],
                    ingredients: [
                      { productId: "prot1", quantity: "250g", packages: 0.4 },
                      { productId: "stap1", quantity: "150g", packages: 0.2 },
                      { productId: "sauce1", quantity: "half a tin", packages: 0.5 },
                    ],
                    pantryItems: [],
                    steps: ["Brown the chicken.", "Simmer with tomatoes and rice."],
                  },
                }
              : generateMockPlan(input.request, input.products),
        },
      },
      async (post) => {
        const original = (await (await post(VALID_BODY)).json()) as MealPlanResponse;
        const originalDayTwo = original.days[1].meals[0].title;
        const response = await post(
          { request: VALID_BODY, plan: original, day: 1, mealType: "dinner" },
          "/api/meal-plans/replace",
        );

        assert.equal(response.status, 200);
        const replaced = (await response.json()) as MealPlanResponse;
        assert.equal(replaced.days[0].meals[0].title, "Chicken tomato rice bowl");
        assert.equal(replaced.days[1].meals[0].title, originalDayTwo);
        assert.equal(replaced.days.length, 7);
      },
    );
  });
  it("returns a complete, priced plan without calling any AI", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post(VALID_BODY);
      assert.equal(response.status, 200);

      const body = (await response.json()) as MealPlanResponse;

      assert.equal(body.currency, "GBP");
      assert.equal(body.budgetPence, 7000);
      assert.equal(body.days.length, 7);
      assert.ok(body.recipes.length > 0);
      assert.ok(body.shoppingList.length > 0);
      assert.ok(body.estimatedTotalPence > 0);
      assert.equal(body.budgetStatus, "within-budget");
      assert.match(body.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
      assert.ok(body.planId.length > 0);
    });
  });

  it("prices the shopping list from catalogue records", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const body = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      const priceById = new Map(
        CATALOGUE.map((entry) => [entry.retailerProductId, entry.pricePence]),
      );
      let expectedTotal = 0;

      for (const group of body.shoppingList) {
        for (const item of group.items) {
          assert.equal(item.unitPricePence, priceById.get(item.productId));
          assert.equal(item.totalPricePence, item.unitPricePence * item.quantity);
          assert.ok(Number.isInteger(item.quantity) && item.quantity > 0);
          expectedTotal += item.totalPricePence;
        }
      }

      assert.equal(body.estimatedTotalPence, expectedTotal);
    });
  });

  it("reports product coverage for the request", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const body = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.equal(body.productCoverage.productsConsidered, CATALOGUE.length);
      assert.ok(body.productCoverage.productsUsed > 0);
      assert.equal(body.productCoverage.excludedForAllergies, 0);
    });
  });

  it("excludes allergen-conflicting products before generating", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...VALID_BODY, allergies: ["milk"] });
      const body = (await response.json()) as MealPlanResponse;

      assert.equal(response.status, 200);
      assert.equal(body.productCoverage.excludedForAllergies, 1);

      const usedIds = body.shoppingList.flatMap((group) =>
        group.items.map((item) => item.productId),
      );
      assert.ok(!usedIds.includes("dairy1"), "the milk product must not be bought");
    });
  });

  it("warns that allergen data is inferred, not from a label", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const body = (await (await post({ ...VALID_BODY, allergies: ["milk"] })).json()) as MealPlanResponse;

      assert.ok(
        body.warnings.some((warning) => /inferred/i.test(warning)),
        "an inferred-allergen warning must be present",
      );
    });
  });

  it("rejects an invalid request with per-field detail", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...VALID_BODY, budgetPence: 10 });
      assert.equal(response.status, 400);

      const body = (await response.json()) as {
        error: { code: string; details: Array<{ field: string }> };
      };
      assert.equal(body.error.code, "INVALID_MEAL_PLAN_REQUEST");
      assert.deepEqual(
        body.error.details.map((issue) => issue.field),
        ["budgetPence"],
      );
    });
  });

  it("returns 503 when the catalogue has never been crawled", async () => {
    await withServer(
      { mealPlanDependencies: { loadProducts: async () => [] } },
      async (post) => {
        const response = await post(VALID_BODY);
        assert.equal(response.status, 503);

        const body = (await response.json()) as {
          error: { code: string; message: string };
        };
        assert.equal(body.error.code, "CATALOGUE_UNAVAILABLE");
        assert.match(body.error.message, /crawl/i);
      },
    );
  });

  it("returns 409 when the constraints filter the catalogue away", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...VALID_BODY,
        dislikedIngredients: [
          "chicken",
          "beef",
          "carrots",
          "broccoli",
          "rice",
          "pasta",
          "cheddar",
          "bread",
          "tomatoes",
          "bananas",
        ],
      });

      assert.equal(response.status, 409);
      const body = (await response.json()) as {
        error: { code: string; details: { suggestions: string[] } };
      };
      assert.equal(body.error.code, "CATALOGUE_CONSTRAINT_CONFLICT");
      assert.ok(body.error.details.suggestions.length > 0);
    });
  });

  it("returns 409 with a minimum estimate when the budget cannot be met", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...VALID_BODY, budgetPence: 1000 });

      assert.equal(response.status, 409);
      const body = (await response.json()) as {
        error: { code: string; details: { minimumEstimatedPence: number } };
      };
      assert.equal(body.error.code, "CATALOGUE_CONSTRAINT_CONFLICT");
      assert.ok(body.error.details.minimumEstimatedPence > 1000);
    });
  });

  it("rejects generator output that references an unknown product", async () => {
    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => CATALOGUE,
          generate: async () => ({
            days: Array.from({ length: 7 }, (_, index) => ({
              day: index + 1,
              meals: [{ mealType: "dinner", recipeId: "r1" }],
            })),
            recipes: [
              {
                id: "r1",
                title: "Invented Dish",
                mealType: "dinner",
                servings: 2,
                prepMinutes: 5,
                cookMinutes: 5,
                appliances: ["hob"],
                ingredients: [
                  { productId: "aldi-truffle-9999", quantity: "1", packages: 1 },
                ],
                steps: ["Cook it."],
              },
            ],
          }),
        },
      },
      async (post) => {
        const response = await post(VALID_BODY);
        assert.equal(response.status, 422);

        const body = (await response.json()) as {
          error: { code: string; details: { reason: string } };
        };
        assert.equal(body.error.code, "AI_INVALID_RESPONSE");
        assert.equal(body.error.details.reason, "UNKNOWN_PRODUCT");
      },
    );
  });

  it("retries once when the first generation is invalid, then succeeds", async () => {
    let calls = 0;

    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => CATALOGUE,
          generate: async ({ request, products, retry }) => {
            calls += 1;
            if (calls === 1) return { days: [], recipes: [] };

            assert.ok(retry, "the second attempt must be told why the first failed");
            return generateMockPlan(request, products);
          },
        },
      },
      async (post) => {
        const response = await post(VALID_BODY);

        assert.equal(response.status, 200);
        assert.equal(calls, 2);

        const body = (await response.json()) as MealPlanResponse;
        assert.ok(
          body.warnings.some((warning) => /regenerated/i.test(warning)),
          "the user should be told the plan was regenerated",
        );
      },
    );
  });

  it("gives up after one retry rather than looping", async () => {
    let calls = 0;

    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => CATALOGUE,
          generate: async () => {
            calls += 1;
            return { days: [], recipes: [] };
          },
        },
      },
      async (post) => {
        const response = await post(VALID_BODY);

        assert.equal(response.status, 422);
        assert.equal(calls, 2, "exactly one retry");
      },
    );
  });

  it("warns when the catalogue data is stale", async () => {
    const stale = CATALOGUE.map((entry) => ({
      ...entry,
      lastSeenAt: new Date("2026-01-01T00:00:00.000Z"),
    }));

    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => stale,
          generate: async ({ request, products }) =>
            generateMockPlan(request, products),
        },
      },
      async (post) => {
        const body = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

        assert.ok(
          body.warnings.some((warning) => /last refreshed/i.test(warning)),
          "a stale catalogue must be disclosed",
        );
      },
    );
  });

  it("plans a no-cook week when the household has no appliances", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...VALID_BODY, appliances: [] });
      assert.equal(response.status, 200);

      const body = (await response.json()) as MealPlanResponse;
      for (const recipe of body.recipes) {
        assert.deepEqual(recipe.appliances, []);
        assert.equal(recipe.cookMinutes, 0);
      }
    });
  });
});
