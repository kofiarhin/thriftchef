import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp, type AppOverrides } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import { ALDI_CATALOGUE } from "../testing/planningFixtures";
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
    imageUrl: null,
    lastSeenAt: new Date(),
    ...overrides,
  };
}

const VALID_BODY = {
  budgetPence: 9000,
  householdSize: 2,
  mealsPerDay: ["dinner"],
  mealPreferences: ["quick"],
  cuisinePreferences: ["British"],
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: [],
  pantryBasics: ["salt", "pepper", "cooking oil", "basic herbs and spices", "stock cubes"],
};

type Post = (body: unknown, path?: string) => Promise<Response>;

async function withServer(
  overrides: AppOverrides,
  run: (post: Post) => Promise<void>,
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

/** The real engine against a fixed catalogue: no generator is substituted. */
const WITH_CATALOGUE: AppOverrides = {
  mealPlanDependencies: { loadProducts: async () => ALDI_CATALOGUE },
};

function withCatalogue(catalogue: CandidateProduct[]): AppOverrides {
  return { mealPlanDependencies: { loadProducts: async () => catalogue } };
}

async function errorBody(response: Response): Promise<{
  code: string;
  message: string;
  details?: Record<string, unknown>;
}> {
  const body = (await response.json()) as {
    error: { code: string; message: string; details?: Record<string, unknown> };
  };
  return body.error;
}

describe("POST /api/meal-plans/generate", () => {
  it("returns a complete, priced plan from the local engine", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post(VALID_BODY);

      assert.equal(response.status, 200);
      const plan = (await response.json()) as MealPlanResponse;

      assert.equal(plan.days.length, 7);
      assert.equal(plan.currency, "GBP");
      assert.ok(plan.planId.length > 0);
      assert.ok(plan.recipes.length > 0);
      for (const day of plan.days) {
        assert.deepEqual(day.meals.map((meal) => meal.mealType), ["dinner"]);
      }
    });
  });

  it("stays within the requested budget", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.equal(plan.budgetStatus, "within-budget");
      assert.ok(plan.estimatedTotalPence <= VALID_BODY.budgetPence);
    });
  });

  it("prices the shopping list from catalogue records", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (await post(VALID_BODY)).json()) as MealPlanResponse;
      const byId = new Map(ALDI_CATALOGUE.map((entry) => [entry.retailerProductId, entry]));

      let total = 0;
      for (const group of plan.shoppingList) {
        for (const item of group.items) {
          const source = byId.get(item.productId);
          assert.ok(source, `${item.productId} is not in the catalogue`);
          assert.equal(item.unitPricePence, source.pricePence);
          assert.equal(item.totalPricePence, source.pricePence * item.quantity);
          total += item.totalPricePence;
        }
      }

      assert.equal(plan.estimatedTotalPence, total);
    });
  });

  it("reports product coverage for the request", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.equal(plan.productCoverage.productsConsidered, ALDI_CATALOGUE.length);
      assert.ok(plan.productCoverage.productsUsed > 0);
    });
  });

  it("excludes allergen-conflicting products before planning", async () => {
    const catalogue = ALDI_CATALOGUE.map((product) =>
      /Cheddar|Mozzarella/i.test(product.name)
        ? { ...product, normalizedAllergens: ["milk"] }
        : product,
    );

    await withServer(withCatalogue(catalogue), async (post) => {
      const plan = (await (
        await post({ ...VALID_BODY, allergies: ["milk"], budgetPence: 12000 })
      ).json()) as MealPlanResponse;

      const used = new Set(
        plan.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
      );
      assert.ok(!used.has("p-cheddar"));
      assert.ok(!used.has("p-mozzarella"));
      assert.ok(plan.productCoverage.excludedForAllergies >= 2);
    });
  });

  it("warns that allergen data is inferred, not from a label", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.ok(plan.warnings.some((warning) => /inferred/i.test(warning)));
    });
  });

  it("warns when the catalogue data is stale", async () => {
    const stale = ALDI_CATALOGUE.map((product) => ({
      ...product,
      lastSeenAt: new Date("2020-01-01T00:00:00.000Z"),
    }));

    await withServer(withCatalogue(stale), async (post) => {
      const plan = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.ok(plan.warnings.some((warning) => /last refreshed/i.test(warning)));
    });
  });

  it("plans a no-cook week when the household has no appliances", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...VALID_BODY,
        appliances: [],
        mealsPerDay: ["lunch"],
      });

      assert.equal(response.status, 200);
      const plan = (await response.json()) as MealPlanResponse;
      for (const recipe of plan.recipes) assert.deepEqual(recipe.appliances, []);
    });
  });

  it("returns the same plan for the same request and seed", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const first = (await (await post(VALID_BODY)).json()) as MealPlanResponse;
      const second = (await (await post(VALID_BODY)).json()) as MealPlanResponse;

      assert.deepEqual(first.days, second.days);
      assert.deepEqual(first.recipes, second.recipes);
      assert.equal(first.estimatedTotalPence, second.estimatedTotalPence);
    });
  });

  it("can return a different plan for a different seed", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const base = (await (await post(VALID_BODY)).json()) as MealPlanResponse;
      const others = await Promise.all(
        [1, 2, 3, 4].map(async (variationSeed) =>
          (await (await post({ ...VALID_BODY, variationSeed })).json()) as MealPlanResponse,
        ),
      );

      assert.ok(
        others.some(
          (plan) => JSON.stringify(plan.recipes) !== JSON.stringify(base.recipes),
        ),
        "regeneration must be able to produce a different week",
      );
    });
  });

  it("rejects an invalid request with per-field detail", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...VALID_BODY, budgetPence: 5, householdSize: 0 });

      assert.equal(response.status, 400);
      const error = await errorBody(response);
      assert.equal(error.code, "INVALID_MEAL_PLAN_REQUEST");

      const fields = (error.details as unknown as Array<{ field: string }>).map(
        (issue) => issue.field,
      );
      assert.ok(fields.includes("budgetPence"));
      assert.ok(fields.includes("householdSize"));
    });
  });

  it("rejects a variation seed that is not a whole number in range", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      for (const variationSeed of [-1, 1.5, 2_147_483_648, "3"]) {
        const response = await post({ ...VALID_BODY, variationSeed });

        assert.equal(response.status, 400, `${variationSeed} should be rejected`);
        const fields = (
          (await errorBody(response)).details as unknown as Array<{ field: string }>
        ).map((issue) => issue.field);
        assert.ok(fields.includes("variationSeed"));
      }
    });
  });

  it("returns 503 when the catalogue has never been crawled", async () => {
    await withServer(withCatalogue([]), async (post) => {
      const response = await post(VALID_BODY);

      assert.equal(response.status, 503);
      assert.equal((await errorBody(response)).code, "CATALOGUE_UNAVAILABLE");
    });
  });

  it("returns 409 when the constraints filter the catalogue away", async () => {
    const catalogue = ALDI_CATALOGUE.map((product) => ({
      ...product,
      normalizedAllergens: ["gluten"],
    }));

    await withServer(withCatalogue(catalogue), async (post) => {
      const response = await post({ ...VALID_BODY, allergies: ["gluten"] });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "CATALOGUE_CONSTRAINT_CONFLICT");
      assert.ok(Array.isArray(error.details?.suggestions));
    });
  });

  it("returns 409 when no recipe can be built for a requested meal type", async () => {
    // Only proteins and sauces: nothing that can carry a breakfast.
    const catalogue = ALDI_CATALOGUE.filter((product) =>
      /Chicken|Beef|Salmon|Passata|Olive Oil/i.test(product.name),
    );

    await withServer(withCatalogue(catalogue), async (post) => {
      const response = await post({ ...VALID_BODY, mealsPerDay: ["breakfast"] });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "CATALOGUE_CONSTRAINT_CONFLICT");
      assert.equal(error.details?.mealType, "breakfast");
      assert.ok(Array.isArray(error.details?.suggestions));
    });
  });

  it("returns 409 with a minimum estimate when the budget cannot be met", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      // The smallest budget the schema allows, against the largest household
      // and every meal type: no basket of real Aldi prices can reach it.
      const response = await post({
        ...VALID_BODY,
        budgetPence: 1000,
        householdSize: 10,
        mealsPerDay: ["breakfast", "lunch", "dinner", "snack"],
      });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "NO_AFFORDABLE_PLAN");
      assert.ok((error.details?.minimumEstimatedPence as number) > 1000);
      assert.ok(Array.isArray(error.details?.suggestions));
    });
  });

  it("reports an engine failure as an internal error, never as the user's fault", async () => {
    await withServer(
      {
        mealPlanDependencies: {
          loadProducts: async () => ALDI_CATALOGUE,
          engine: {
            generate: async () => ({
              plan: { days: [], recipes: [] },
              diagnostics: {
                engineVersion: "test",
                durationMs: 0,
                recipesConsidered: 0,
                candidatesGenerated: 0,
                candidatesValid: 0,
                selectedScore: 0,
                scoreBreakdown: {
                  budgetFit: 0,
                  ingredientReuse: 0,
                  recipeVariety: 0,
                  preferenceMatch: 0,
                  cuisineMatch: 0,
                  practicality: 0,
                  foodGroupBalance: 0,
                },
              },
            }),
            replaceMeal: async () => {
              throw new Error("not used");
            },
          },
        },
      },
      async (post) => {
        const response = await post(VALID_BODY);

        assert.equal(response.status, 500);
        const error = await errorBody(response);
        assert.equal(error.code, "PLANNER_INTERNAL_ERROR");
        assert.ok(!/recipe|product/i.test(error.message), "no plan detail may leak");
      },
    );
  });

  it("needs no AI configuration to serve a request", async () => {
    // testConfig supplies only MONGODB_URI and NODE_ENV; if any model setting
    // were still required, loadConfig would have thrown before this ran.
    await withServer(WITH_CATALOGUE, async (post) => {
      assert.equal((await post(VALID_BODY)).status, 200);
    });
  });
});

describe("POST /api/meal-plans/replace", () => {
  const REPLACE_BODY = {
    ...VALID_BODY,
    mealsPerDay: ["breakfast", "dinner"],
    budgetPence: 12000,
  };

  it("replaces one meal without changing the other six days", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const original = (await (await post(REPLACE_BODY)).json()) as MealPlanResponse;
      const response = await post(
        { request: REPLACE_BODY, plan: original, day: 1, mealType: "dinner" },
        "/api/meal-plans/replace",
      );

      assert.equal(response.status, 200);
      const replaced = (await response.json()) as MealPlanResponse;

      assert.equal(replaced.days.length, 7);
      assert.notEqual(replaced.days[0].meals.find((meal) => meal.mealType === "dinner")?.recipeId,
        original.days[0].meals.find((meal) => meal.mealType === "dinner")?.recipeId);

      for (let index = 1; index < 7; index += 1) {
        assert.deepEqual(
          replaced.days[index].meals.map((meal) => meal.recipeId),
          original.days[index].meals.map((meal) => meal.recipeId),
          `day ${index + 1} must be untouched`,
        );
      }
    });
  });

  it("keeps the replaced plan priced and within budget", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const original = (await (await post(REPLACE_BODY)).json()) as MealPlanResponse;
      const replaced = (await (
        await post(
          { request: REPLACE_BODY, plan: original, day: 2, mealType: "breakfast" },
          "/api/meal-plans/replace",
        )
      ).json()) as MealPlanResponse;

      assert.equal(replaced.budgetStatus, "within-budget");
      assert.ok(replaced.estimatedTotalPence <= REPLACE_BODY.budgetPence);
      assert.ok(replaced.shoppingList.length > 0);
    });
  });

  it("rejects a meal the plan does not contain", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const original = (await (await post(REPLACE_BODY)).json()) as MealPlanResponse;
      const response = await post(
        { request: REPLACE_BODY, plan: original, day: 1, mealType: "snack" },
        "/api/meal-plans/replace",
      );

      assert.equal(response.status, 400);
      assert.equal((await errorBody(response)).code, "INVALID_MEAL_PLAN_REQUEST");
    });
  });

  it("treats a malformed submitted plan as a bad request, not a planner failure", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post(
        {
          request: REPLACE_BODY,
          plan: { days: [], recipes: [] },
          day: 1,
          mealType: "dinner",
        },
        "/api/meal-plans/replace",
      );

      assert.equal(response.status, 400);
      assert.equal((await errorBody(response)).code, "INVALID_MEAL_PLAN_REQUEST");
    });
  });

  it("reports when no distinct replacement exists", async () => {
    const catalogue = ALDI_CATALOGUE.filter((product) =>
      /Gala Apples/i.test(product.name),
    ).concat(
      candidate("filler1", "Bananas", ["Fresh Food", "Fruit"], { pricePence: 85 }),
      candidate("filler2", "Blueberries", ["Fresh Food", "Fruit"], { pricePence: 179 }),
    );
    const body = { ...VALID_BODY, mealsPerDay: ["snack"], appliances: [] };

    await withServer(withCatalogue(catalogue), async (post) => {
      const original = (await (await post(body)).json()) as MealPlanResponse;
      const response = await post(
        { request: body, plan: original, day: 1, mealType: "snack" },
        "/api/meal-plans/replace",
      );

      assert.equal(response.status, 409);
      assert.equal((await errorBody(response)).code, "NO_REPLACEMENT_AVAILABLE");
    });
  });
});

describe("budget target and must-have products over HTTP", () => {
  const BUDGET_BODY = {
    ...VALID_BODY,
    budgetPence: 9_000,
    mealsPerDay: ["breakfast", "lunch", "dinner"],
  };

  it("reports budget utilization against the chosen target", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (
        await post({ ...BUDGET_BODY, budgetTargetPercent: 80 })
      ).json()) as MealPlanResponse;

      assert.equal(plan.budgetUtilization.targetPercent, 80);
      assert.equal(plan.budgetUtilization.targetPence, 7_200);
      assert.equal(plan.budgetUtilization.actualPence, plan.estimatedTotalPence);
      assert.equal(
        plan.budgetUtilization.actualPercent,
        Math.round((plan.estimatedTotalPence / 9_000) * 100),
      );
    });
  });

  it("defaults the target to 80 percent when the client omits it", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (await post(BUDGET_BODY)).json()) as MealPlanResponse;

      assert.equal(plan.budgetUtilization.targetPercent, 80);
    });
  });

  it("rejects a target that is not one of the three presets", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...BUDGET_BODY, budgetTargetPercent: 90 });

      assert.equal(response.status, 400);
      assert.equal((await errorBody(response)).code, "INVALID_MEAL_PLAN_REQUEST");
    });
  });

  it("warns, without failing, when the catalogue cannot reach the target", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({ ...BUDGET_BODY, budgetTargetPercent: 80 });
      const plan = (await response.json()) as MealPlanResponse;

      // This catalogue cannot fill £72 of a £90 budget, which is exactly the
      // situation the warning exists for.
      assert.equal(response.status, 200);
      assert.equal(plan.budgetUtilization.withinPreferredRange, false);
      assert.ok(
        plan.warnings.some((warning) => warning.includes("target of about")),
        `no under-target warning in: ${plan.warnings.join(" | ")}`,
      );
    });
  });

  it("does not warn when the basket lands near its target", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const plan = (await (
        await post({ ...BUDGET_BODY, budgetPence: 3_000, budgetTargetPercent: 80 })
      ).json()) as MealPlanResponse;

      assert.ok(
        !plan.warnings.some((warning) => warning.includes("target of about")),
        "warned about a basket that reached its target",
      );
    });
  });

  it("uses and buys every must-have product, and says where", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        mustHaveProductIds: ["p-chicken-breast", "p-basmati-rice"],
      });

      assert.equal(response.status, 200);
      const plan = (await response.json()) as MealPlanResponse;

      assert.deepEqual(
        plan.mustHaveUsage.map((entry) => entry.productId),
        ["p-chicken-breast", "p-basmati-rice"],
      );

      const bought = new Set(
        plan.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
      );

      for (const entry of plan.mustHaveUsage) {
        assert.ok(entry.usedIn.length > 0, `${entry.productId} is used nowhere`);
        assert.ok(bought.has(entry.productId), `${entry.productId} is not in the basket`);
        assert.ok(entry.productName.length > 0);

        for (const use of entry.usedIn) {
          const day = plan.days.find((entry) => entry.day === use.day);
          assert.ok(
            day?.meals.some(
              (meal) => meal.mealType === use.mealType && meal.recipeId === use.recipeId,
            ),
            "must-have usage points at a meal the plan does not contain",
          );
        }
      }
    });
  });

  it("rejects a must-have id the catalogue does not contain", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        mustHaveProductIds: ["p-chicken-breast", "not-a-real-product"],
      });

      assert.equal(response.status, 400);
      const error = await errorBody(response);
      assert.equal(error.code, "MUST_HAVE_PRODUCT_NOT_FOUND");
      assert.deepEqual(error.details?.productIds, ["not-a-real-product"]);
    });
  });

  it("reports a must-have product that conflicts with a declared allergy", async () => {
    const catalogue = ALDI_CATALOGUE.map((product) =>
      product.retailerProductId === "p-cheddar"
        ? { ...product, normalizedAllergens: ["milk"] }
        : product,
    );

    await withServer(withCatalogue(catalogue), async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        allergies: ["milk"],
        mustHaveProductIds: ["p-cheddar"],
      });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "MUST_HAVE_CONSTRAINT_CONFLICT");
      assert.deepEqual(error.details?.products, [
        {
          productId: "p-cheddar",
          productName: "Mature Cheddar Cheese",
          reason: "allergy",
        },
      ]);
    });
  });

  it("reports a must-have product the user also asked to avoid", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        dislikedIngredients: ["broccoli"],
        mustHaveProductIds: ["p-broccoli"],
      });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "MUST_HAVE_CONSTRAINT_CONFLICT");
      assert.deepEqual(
        (error.details?.products as Array<{ reason: string }>).map(
          (product) => product.reason,
        ),
        ["dislike"],
      );
    });
  });

  it("refuses a must-have selection that costs more than the whole budget", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        budgetPence: 1_000,
        mustHaveProductIds: ["p-salmon", "p-chicken-breast", "p-olive-oil"],
      });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "MUST_HAVE_PRODUCTS_OVER_BUDGET");
      assert.equal(error.details?.budgetPence, 1_000);
      assert.ok((error.details?.mustHaveSubtotalPence as number) > 1_000);
    });
  });

  it("reports a must-have product no recipe template can use", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        mealsPerDay: ["dinner"],
        mustHaveProductIds: ["p-crisps"],
      });

      assert.equal(response.status, 409);
      const error = await errorBody(response);
      assert.equal(error.code, "MUST_HAVE_PRODUCT_UNUSABLE");
      assert.deepEqual(error.details?.productIds, ["p-crisps"]);
      assert.ok(Array.isArray(error.details?.suggestions));
    });
  });

  it("rejects more than twelve must-have products", async () => {
    await withServer(WITH_CATALOGUE, async (post) => {
      const response = await post({
        ...BUDGET_BODY,
        mustHaveProductIds: Array.from({ length: 13 }, (_, index) => `p-${index}`),
      });

      assert.equal(response.status, 400);
      assert.equal((await errorBody(response)).code, "INVALID_MEAL_PLAN_REQUEST");
    });
  });

  it("keeps every must-have product when a meal is replaced", async () => {
    const body = {
      ...BUDGET_BODY,
      mustHaveProductIds: ["p-chicken-breast", "p-basmati-rice"],
    };

    await withServer(WITH_CATALOGUE, async (post) => {
      const original = (await (await post(body)).json()) as MealPlanResponse;
      const response = await post(
        { request: body, plan: original, day: 2, mealType: "dinner" },
        "/api/meal-plans/replace",
      );

      assert.equal(response.status, 200);
      const replaced = (await response.json()) as MealPlanResponse;
      const bought = new Set(
        replaced.shoppingList.flatMap((group) =>
          group.items.map((item) => item.productId),
        ),
      );

      for (const entry of replaced.mustHaveUsage) {
        assert.ok(entry.usedIn.length > 0, `${entry.productId} lost its recipe`);
        assert.ok(bought.has(entry.productId), `${entry.productId} left the basket`);
      }
    });
  });

  it("returns the same plan for the same request, seed and must-have selection", async () => {
    const body = {
      ...BUDGET_BODY,
      variationSeed: 7,
      budgetTargetPercent: 65,
      mustHaveProductIds: ["p-chicken-breast"],
    };

    await withServer(WITH_CATALOGUE, async (post) => {
      const first = (await (await post(body)).json()) as MealPlanResponse;
      const second = (await (await post(body)).json()) as MealPlanResponse;

      assert.deepEqual(first.days, second.days);
      assert.deepEqual(first.recipes, second.recipes);
      assert.deepEqual(first.shoppingList, second.shoppingList);
      assert.deepEqual(first.budgetUtilization, second.budgetUtilization);
    });
  });
});
