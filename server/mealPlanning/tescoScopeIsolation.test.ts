/**
 * A Tesco plan may contain Tesco products from one Tesco store, and nothing
 * else — through generation, regeneration, replacement, reopening, and the
 * shopping list.
 *
 * These run against the real engine and the real routes with a fixed
 * catalogue, so a leak has to survive selection, planning, pricing and
 * serialisation to pass. The failure being guarded against is not exotic: it
 * is a query that forgets a store, or a replacement that re-resolves the
 * user's *current* default instead of the plan's own scope, and both produce a
 * basket the user cannot buy in one shop.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp, type AppOverrides } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import {
  ALDI_CATALOGUE,
  TESCO_CATALOGUE,
  TESCO_STORE_B_CATALOGUE,
} from "../testing/planningFixtures";
import { ALDI_SCOPE, TESCO_SCOPE, TESCO_STORE_B_SCOPE } from "../testing/scopeFixtures";
import type { CandidateProduct } from "./productSelector";
import type { MealPlanResponse } from "./mealPlanTypes";
import type { ResolvedCatalogueScope } from "../catalogue/core/retailerTypes";

const REQUEST = {
  budgetPence: 9_000,
  householdSize: 2,
  mealsPerDay: ["dinner"],
  mealPreferences: ["quick"],
  cuisinePreferences: ["British"],
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: [],
  pantryBasics: ["salt", "pepper", "cooking oil", "basic herbs and spices", "stock cubes"],
  retailerId: "tesco-uk",
  storeId: "tesco-online-gb",
};

/**
 * The server resolves the scope; the client's ids are a request, not an
 * instruction. Every override here therefore serves one catalogue, and any
 * product from another one appearing in a response is a genuine leak.
 */
function servingOnly(
  scope: ResolvedCatalogueScope,
  catalogue: CandidateProduct[],
): AppOverrides {
  const saved = new Map<string, MealPlanResponse>();

  return {
    mealPlanDependencies: {
      resolveScope: async () => scope,
      loadProducts: async (requested) => {
        assert.equal(
          requested.storeId,
          scope.storeId,
          "the catalogue was read under a scope the plan did not name",
        );
        return catalogue;
      },
      savePlan: async ({ plan }) => {
        saved.set(plan.planId, plan);
      },
      loadPlan: async (planId) => saved.get(planId) ?? null,
    },
  };
}

type Post = (path: string, body: unknown) => Promise<Response>;
type Get = (path: string) => Promise<Response>;

async function withServer(
  overrides: AppOverrides,
  run: (post: Post, get: Get) => Promise<void>,
): Promise<void> {
  const server = await startTestServer(createApp(testConfig(), overrides));

  try {
    await run(
      (path, body) =>
        server.fetch(path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
      (path) => server.fetch(path),
    );
  } finally {
    await server.close();
  }
}

function productIdsIn(plan: MealPlanResponse): string[] {
  return [
    ...plan.recipes.flatMap((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.productId),
    ),
    ...plan.shoppingList.flatMap((group) =>
      group.items.map((item) => item.productId),
    ),
  ];
}

function assertOnlyFrom(plan: MealPlanResponse, catalogue: CandidateProduct[]): void {
  const known = new Set(catalogue.map((product) => product.retailerProductId));

  for (const productId of productIdsIn(plan)) {
    assert.ok(
      known.has(productId),
      `${productId} is not in the catalogue this plan was scoped to`,
    );
  }
}

async function generate(post: Post, body: unknown = REQUEST): Promise<MealPlanResponse> {
  const response = await post("/api/meal-plans/generate", body);
  assert.equal(response.status, 200, await response.clone().text());

  return (await response.json()) as MealPlanResponse;
}

describe("Tesco plans contain only Tesco products", () => {
  it("builds a whole week from the Tesco catalogue alone", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);

      assertOnlyFrom(plan, TESCO_CATALOGUE);
      for (const productId of productIdsIn(plan)) {
        assert.ok(
          !ALDI_CATALOGUE.some((product) => product.retailerProductId === productId),
          "an Aldi product reached a Tesco plan",
        );
      }
    });
  });

  it("records the Tesco retailer and store as the plan's provenance", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);

      assert.equal(plan.catalogue.retailerSlug, "tesco-uk");
      assert.equal(plan.catalogue.storeSlug, "tesco-online-gb");
      assert.equal(plan.catalogue.storeId, TESCO_SCOPE.storeId);
      assert.ok(plan.catalogue.crawlRunId, "a plan must say which crawl priced it");
    });
  });

  it("keeps Tesco products out of an Aldi plan", async () => {
    await withServer(servingOnly(ALDI_SCOPE, ALDI_CATALOGUE), async (post) => {
      const plan = await generate(post, { ...REQUEST, retailerId: "aldi-uk", storeId: "belper-de56-1ar" });

      assertOnlyFrom(plan, ALDI_CATALOGUE);
      for (const productId of productIdsIn(plan)) {
        assert.ok(
          !TESCO_CATALOGUE.some((product) => product.retailerProductId === productId),
        );
      }
    });
  });

  it("keeps one Tesco store's products out of another Tesco store's plan", async () => {
    // The leak that is easiest to write by accident: a query scoped by
    // retailer that forgot the store. Both catalogues are Tesco, so only the
    // store scoping separates them.
    await withServer(
      servingOnly(TESCO_STORE_B_SCOPE, TESCO_STORE_B_CATALOGUE),
      async (post) => {
        const plan = await generate(post, {
          ...REQUEST,
          storeId: "tesco-online-north",
        });

        assertOnlyFrom(plan, TESCO_STORE_B_CATALOGUE);
        for (const productId of productIdsIn(plan)) {
          assert.ok(
            !TESCO_CATALOGUE.some((product) => product.retailerProductId === productId),
            "a product from another Tesco store reached this plan",
          );
        }
      },
    );
  });
});

describe("Tesco scope survives every later operation", () => {
  it("regenerates within the same retailer and store", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const first = await generate(post);
      const second = await generate(post, { ...REQUEST, variationSeed: 7 });

      assert.equal(second.catalogue.retailerSlug, first.catalogue.retailerSlug);
      assert.equal(second.catalogue.storeSlug, first.catalogue.storeSlug);
      assertOnlyFrom(second, TESCO_CATALOGUE);
    });
  });

  it("replaces a meal within the same retailer and store", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);

      const response = await post("/api/meal-plans/replace", {
        request: REQUEST,
        plan,
        day: 1,
        mealType: "dinner",
      });

      assert.equal(response.status, 200, await response.clone().text());
      const replaced = (await response.json()) as MealPlanResponse;

      assert.equal(replaced.catalogue.retailerSlug, "tesco-uk");
      assert.equal(replaced.catalogue.storeSlug, "tesco-online-gb");
      assertOnlyFrom(replaced, TESCO_CATALOGUE);
    });
  });

  it("reopens a saved plan with its original provenance", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post, get) => {
      const plan = await generate(post);
      const response = await get(`/api/meal-plans/${plan.planId}`);

      assert.equal(response.status, 200);
      const reopened = (await response.json()) as MealPlanResponse;

      // The saved snapshot, not a fresh calculation: a shopping list that
      // reprices itself between the kitchen and the shop is worse than none.
      assert.deepEqual(reopened.catalogue, plan.catalogue);
      assert.equal(reopened.estimatedTotalPence, plan.estimatedTotalPence);
      assertOnlyFrom(reopened, TESCO_CATALOGUE);
    });
  });
});

describe("Tesco budgets and totals", () => {
  it("stays within the requested budget on Tesco shelf prices", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);

      assert.equal(plan.budgetStatus, "within-budget");
      assert.ok(plan.estimatedTotalPence <= REQUEST.budgetPence);
    });
  });

  it("prices every shopping-list item from the Tesco catalogue", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);
      const byId = new Map(
        TESCO_CATALOGUE.map((product) => [product.retailerProductId, product]),
      );

      for (const group of plan.shoppingList) {
        for (const item of group.items) {
          const source = byId.get(item.productId);

          assert.ok(source, `${item.productId} is not a Tesco catalogue product`);
          assert.equal(item.unitPricePence, source.pricePence);
          assert.equal(item.totalPricePence, source.pricePence * item.quantity);
        }
      }
    });
  });

  it("totals the shopping list to the plan's estimate exactly", async () => {
    await withServer(servingOnly(TESCO_SCOPE, TESCO_CATALOGUE), async (post) => {
      const plan = await generate(post);

      const total = plan.shoppingList.reduce(
        (sum, group) =>
          sum + group.items.reduce((groupSum, item) => groupSum + item.totalPricePence, 0),
        0,
      );

      // Integer minor units throughout: a total that disagrees with its own
      // list by a penny is a rounding bug the user finds at the till.
      assert.equal(total, plan.estimatedTotalPence);
      assert.ok(Number.isInteger(total));
    });
  });
});

describe("Tesco planning failures stay inside the Tesco scope", () => {
  it("reports an empty Tesco catalogue rather than falling back to Aldi", async () => {
    await withServer(servingOnly(TESCO_SCOPE, []), async (post) => {
      const response = await post("/api/meal-plans/generate", REQUEST);

      assert.equal(response.status, 503);
      const body = (await response.json()) as {
        error: { code: string; message: string };
      };

      assert.equal(body.error.code, "CATALOGUE_UNAVAILABLE");
      assert.match(body.error.message, /Tesco/);
      assert.ok(
        !/aldi/i.test(body.error.message),
        "a scoped failure must never offer another supermarket's catalogue",
      );
    });
  });

  it("reports a constraint conflict against the Tesco catalogue alone", async () => {
    await withServer(
      servingOnly(TESCO_SCOPE, TESCO_CATALOGUE.slice(0, 2)),
      async (post) => {
        const response = await post("/api/meal-plans/generate", REQUEST);

        assert.equal(response.status, 409);
        const body = (await response.json()) as { error: { message: string } };

        assert.match(body.error.message, /Tesco/);
      },
    );
  });
});
