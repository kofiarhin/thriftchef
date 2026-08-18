import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import express from "express";
import { createApp } from "../app";
import { loadConfig } from "../config/env";
import {
  startTestServer,
  type TestServer,
} from "../testing/httpTestServer";
import type { CandidateProduct } from "./productSelector";
import type { MealPlanResponse } from "./mealPlanTypes";

/**
 * Exercises `MEAL_PLAN_GENERATOR=nvidia` against a stub upstream over real
 * HTTP. This proves the switch, the client, the prompt and the validator are
 * wired together — the only thing a live call adds is the model itself.
 */

function candidate(
  retailerProductId: string,
  name: string,
  categoryPath: string[],
  pricePence: number,
): CandidateProduct {
  return {
    retailerProductId,
    name,
    brand: null,
    description: null,
    categoryPaths: [categoryPath],
    pricePence,
    packageSizeRaw: "500g",
    dietaryInformationRaw: null,
    normalizedAllergens: [],
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    productUrl: `https://www.aldi.co.uk/product/${retailerProductId}`,
    lastSeenAt: new Date(),
  };
}

const CATALOGUE: CandidateProduct[] = [
  candidate("p-chicken", "Chicken Breast Fillets", ["Fresh Food", "Poultry"], 350),
  candidate("p-rice", "Basmati Rice", ["Food Cupboard", "Rice, Pasta & Noodles"], 145),
  candidate("p-carrots", "Carrots", ["Fresh Food", "Vegetables"], 60),
  candidate("p-tomatoes", "Chopped Tomatoes", ["Food Cupboard", "Tins, Cans & Packets"], 45),
];

const REQUEST_BODY = {
  budgetPence: 7000,
  householdSize: 2,
  mealsPerDay: ["dinner"],
  appliances: ["hob"],
};

/**
 * Stands in for the NVIDIA API. It reads the product ids out of the prompt it
 * was sent, so a prompt missing usable ids would fail this test.
 */
function createUpstreamStub(behaviour: {
  respond: (productIds: string[], callIndex: number) => unknown;
  /** Simulates a slow model, so budget arithmetic can be exercised. */
  delayMs?: number;
}) {
  const app = express();
  const received: Array<{ authorization: string | undefined; body: unknown }> = [];
  let callIndex = 0;

  app.use(express.json({ limit: "2mb" }));
  app.post("/v1/chat/completions", (request, response) => {
    received.push({
      authorization: request.headers.authorization,
      body: request.body,
    });

    // The prompt arrives as a JSON string inside a JSON body, so quotes are
    // escaped; match the ids themselves rather than the surrounding syntax.
    const prompt = JSON.stringify(request.body);
    const productIds = [...new Set(prompt.match(/p-[a-z]+/g) ?? [])];
    const send = (): void => {
      response.json({
        choices: [
          {
            message: {
              content: JSON.stringify(behaviour.respond(productIds, callIndex++)),
            },
          },
        ],
      });
    };

    if (behaviour.delayMs) setTimeout(send, behaviour.delayMs);
    else send();
  });

  return { app, received };
}

function planUsing(productIds: string[]) {
  return {
    days: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      meals: [{ mealType: "dinner", recipeId: "r1" }],
    })),
    recipes: [
      {
        id: "r1",
        title: "Chicken and rice",
        mealType: "dinner",
        servings: 2,
        prepMinutes: 10,
        cookMinutes: 25,
        appliances: ["hob"],
        ingredients: productIds.slice(0, 2).map((productId) => ({
          productId,
          quantity: "half a pack",
          packages: 0.5,
        })),
        steps: ["Cook the chicken.", "Serve with rice."],
      },
    ],
  };
}

async function withNvidiaApp(
  stub: ReturnType<typeof createUpstreamStub>,
  run: (post: (body: unknown) => Promise<Response>) => Promise<void>,
  overrides: Record<string, string> = {},
): Promise<void> {
  const upstream = await startTestServer(stub.app);

  const config = loadConfig({
    NODE_ENV: "test",
    MONGODB_URI: "mongodb://localhost:27017/thriftchef-test",
    MEAL_PLAN_GENERATOR: "nvidia",
    NVIDIA_API_KEY: "nvapi-test-key",
    NVIDIA_API_URL: `${upstream.url}/v1/chat/completions`,
    NVIDIA_MODEL: "meta/llama-3.3-70b-instruct",
    AI_REQUEST_TIMEOUT_MS: "5000",
    AI_MAX_RETRIES: "0",
    ...overrides,
  });

  const api = await startTestServer(
    createApp(config, {
      mealPlanDependencies: { loadProducts: async () => CATALOGUE },
    }),
  );

  try {
    await run((body) =>
      api.fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  } finally {
    await api.close();
    await upstream.close();
  }
}

describe("meal plan generation in nvidia mode", () => {
  it("calls the configured endpoint and returns a server-priced plan", async () => {
    const stub = createUpstreamStub({ respond: (ids) => planUsing(ids) });

    await withNvidiaApp(stub, async (post) => {
      const response = await post(REQUEST_BODY);
      assert.equal(response.status, 200);

      const body = (await response.json()) as MealPlanResponse;
      assert.equal(body.days.length, 7);
      assert.equal(body.budgetStatus, "within-budget");
      assert.ok(body.estimatedTotalPence > 0);

      // Prices come from the catalogue, not from the model.
      const priceById = new Map(
        CATALOGUE.map((entry) => [entry.retailerProductId, entry.pricePence]),
      );
      for (const group of body.shoppingList) {
        for (const item of group.items) {
          assert.equal(item.unitPricePence, priceById.get(item.productId));
        }
      }
    });

    assert.equal(stub.received.length, 1);
    assert.equal(stub.received[0].authorization, "Bearer nvapi-test-key");
  });

  it("sends the model a bounded product context and no secrets", async () => {
    const stub = createUpstreamStub({ respond: (ids) => planUsing(ids) });

    await withNvidiaApp(stub, async (post) => {
      assert.equal((await post(REQUEST_BODY)).status, 200);
    });

    const sent = JSON.stringify(stub.received[0].body);
    assert.ok(sent.includes("p-chicken"), "the prompt must carry product ids");
    assert.ok(!sent.includes("aldi.co.uk"), "product URLs must not be sent");
    assert.ok(!sent.includes("nvapi-test-key"), "the key must not be in the body");
    assert.ok(!sent.includes("MONGODB_URI"));
  });

  it("rejects a model that invents a product, after one retry", async () => {
    const stub = createUpstreamStub({
      respond: () => planUsing(["p-not-in-catalogue"]),
    });

    await withNvidiaApp(stub, async (post) => {
      const response = await post(REQUEST_BODY);
      assert.equal(response.status, 422);

      const body = (await response.json()) as {
        error: { code: string; details: { reason: string } };
      };
      assert.equal(body.error.code, "AI_INVALID_RESPONSE");
      assert.equal(body.error.details.reason, "UNKNOWN_PRODUCT");
    });

    assert.equal(stub.received.length, 2, "one retry, then give up");
  });

  /**
   * The validation repair is a second upstream call, so an unbudgeted repair
   * after a slow first attempt would double the wait the user was promised.
   * When too little of the window remains, the original rejection is returned
   * instead — a controlled 422 beats a 504 the repair was always going to hit.
   */
  it("skips the repair attempt when too little of the budget remains", async () => {
    const stub = createUpstreamStub({
      respond: () => planUsing(["p-not-in-catalogue"]),
      delayMs: 900,
    });

    const started = Date.now();

    await withNvidiaApp(
      stub,
      async (post) => {
        const response = await post(REQUEST_BODY);
        assert.equal(response.status, 422);

        const body = (await response.json()) as {
          error: { code: string; details: { reason: string } };
        };
        assert.equal(body.error.code, "AI_INVALID_RESPONSE");
        assert.equal(body.error.details.reason, "UNKNOWN_PRODUCT");
      },
      { AI_REQUEST_TIMEOUT_MS: "1000" },
    );

    assert.equal(stub.received.length, 1, "no repair on an almost-spent budget");
    assert.ok(
      Date.now() - started < 2_000,
      "the request must not outlive its configured budget",
    );
  });

  it("logs generation timings without leaking the key or the prompt", async () => {
    const stub = createUpstreamStub({ respond: (ids) => planUsing(ids) });
    const lines: string[] = [];
    const realLog = console.log;
    console.log = (...args: unknown[]) => lines.push(args.map(String).join(" "));

    try {
      await withNvidiaApp(stub, async (post) => {
        assert.equal((await post(REQUEST_BODY)).status, 200);
      });
    } finally {
      console.log = realLog;
    }

    const access = lines
      .map((line) => {
        try {
          return JSON.parse(line) as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .find((entry) => entry?.route === "/api/meal-plans/generate");

    assert.ok(access, "the generate request must produce an access log line");
    for (const field of [
      "contextMs",
      "upstreamMs",
      "validationMs",
      "generationMs",
      "generationAttempts",
    ]) {
      assert.ok(field in access, `expected ${field} in the access log`);
    }

    const serialized = JSON.stringify(access);
    assert.ok(!serialized.includes("nvapi-test-key"), "no key in logs");
    assert.ok(!serialized.includes("Chicken and rice"), "no upstream text in logs");
  });

  it("recovers when the model returns valid JSON only on the retry", async () => {
    const stub = createUpstreamStub({
      respond: (ids, callIndex) =>
        callIndex === 0 ? { nonsense: true } : planUsing(ids),
    });

    await withNvidiaApp(stub, async (post) => {
      const response = await post(REQUEST_BODY);
      assert.equal(response.status, 200);

      const body = (await response.json()) as MealPlanResponse;
      assert.ok(
        body.warnings.some((warning) => /regenerated/i.test(warning)),
        "the user is told the plan was regenerated",
      );
    });

    assert.equal(stub.received.length, 2);
  });
});
