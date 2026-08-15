import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NvidiaConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { createNvidiaGenerator, extractJsonObject } from "./nvidiaClient";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import { PlanRejectedError } from "./mealPlanValidator";
import type {
  PlanGeneratorInput,
  SelectableProduct,
} from "./mealPlanTypes";

const API_KEY = "nvapi-super-secret-key";

const CONFIG: NvidiaConfig = {
  apiKey: API_KEY,
  apiUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
  model: "meta/llama-3.3-70b-instruct",
  timeoutMs: 5_000,
  maxRetries: 1,
};

const PRODUCTS: SelectableProduct[] = [
  {
    productId: "4000000000001",
    name: "Chicken Breast Fillets",
    brand: "Ashfields",
    category: "Fresh Food",
    categoryPaths: [["Fresh Food", "Poultry"]],
    pricePence: 350,
    packageSize: "650g",
    allergens: [],
    dietaryInfo: null,
    safetyStatus: "inferred",
    productUrl: "https://www.aldi.co.uk/product/4000000000001",
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
  },
];

function input(overrides: Partial<PlanGeneratorInput> = {}): PlanGeneratorInput {
  return {
    request: parseMealPlanRequest({
      budgetPence: 7000,
      householdSize: 2,
      mealsPerDay: ["dinner"],
      appliances: ["hob"],
    }),
    products: PRODUCTS,
    ...overrides,
  };
}

function jsonResponse(content: string, status = 200): Response {
  return new Response(
    JSON.stringify({ choices: [{ message: { content } }] }),
    { status, headers: { "content-type": "application/json" } },
  );
}

const VALID_PLAN = JSON.stringify({ days: [], recipes: [] });

describe("extractJsonObject", () => {
  it("parses a bare JSON object", () => {
    assert.deepEqual(extractJsonObject('{"days":[]}'), { days: [] });
  });

  it("recovers JSON from a markdown fence", () => {
    assert.deepEqual(
      extractJsonObject('```json\n{"days":[1]}\n```'),
      { days: [1] },
    );
  });

  it("recovers JSON wrapped in prose", () => {
    assert.deepEqual(
      extractJsonObject('Here is your plan:\n{"days":[]}\nEnjoy!'),
      { days: [] },
    );
  });

  it("rejects content with no JSON at all", () => {
    assert.throws(
      () => extractJsonObject("I cannot help with that."),
      (error: unknown) =>
        error instanceof PlanRejectedError && error.reason === "INVALID_JSON",
    );
  });
});

describe("createNvidiaGenerator", () => {
  it("sends the model, prompt and bearer token the API expects", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];

    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async (url, init) => {
        calls.push({ url: String(url), init: init ?? {} });
        return jsonResponse(VALID_PLAN);
      },
    });

    await generate(input());

    assert.equal(calls.length, 1);
    const captured = calls[0];
    assert.equal(captured.url, CONFIG.apiUrl);
    assert.equal(captured.init.method, "POST");

    const headers = captured.init.headers as Record<string, string>;
    assert.equal(headers.authorization, `Bearer ${API_KEY}`);

    const body = JSON.parse(String(captured.init.body)) as {
      model: string;
      temperature: number;
      messages: Array<{ role: string; content: string }>;
    };
    assert.equal(body.model, CONFIG.model);
    assert.equal(body.temperature, 0);
    assert.ok(body.messages[0]?.content.startsWith("/no_think"));
    assert.deepEqual(
      body.messages.map((message) => message.role),
      ["system", "user"],
    );
  });

  it("puts the catalogue product ids in the prompt and nothing more", async () => {
    let promptBody = "";

    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async (_url, init) => {
        promptBody = String(init?.body);
        return jsonResponse(VALID_PLAN);
      },
    });

    await generate(input());

    assert.ok(promptBody.includes("4000000000001"), "the product id must be present");
    assert.ok(!promptBody.includes("aldi.co.uk"), "product URLs must not be sent");
    assert.ok(!promptBody.includes(API_KEY), "the key must never reach the prompt");
  });

  it("returns the parsed plan candidate", async () => {
    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async () => jsonResponse('{"days":[],"recipes":[{"id":"r1"}]}'),
    });

    assert.deepEqual(await generate(input()), {
      days: [],
      recipes: [{ id: "r1" }],
    });
  });

  it("maps a timeout to a 504 without exposing the key", async () => {
    const generate = createNvidiaGenerator({
      config: { ...CONFIG, timeoutMs: 20, maxRetries: 0 },
      maxContextProducts: 120,
      fetchImpl: (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    });

    await assert.rejects(generate(input()), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 504);
      assert.equal(error.code, "AI_TIMEOUT");
      assert.ok(!error.message.includes(API_KEY));
      return true;
    });
  });

  it("retries once on a transient upstream failure", async () => {
    let calls = 0;

    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async () => {
        calls += 1;
        return calls === 1
          ? new Response("upstream busy", { status: 503 })
          : jsonResponse(VALID_PLAN);
      },
    });

    assert.deepEqual(await generate(input()), { days: [], recipes: [] });
    assert.equal(calls, 2);
  });

  it("does not retry a client error and never echoes the upstream body", async () => {
    let calls = 0;

    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async () => {
        calls += 1;
        return new Response(`bad key ${API_KEY}`, { status: 401 });
      },
    });

    await assert.rejects(generate(input()), (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 502);
      assert.ok(!error.message.includes(API_KEY));
      return true;
    });

    assert.equal(calls, 1, "a 401 is not transient");
  });

  it("reports unusable content as an invalid plan so the route can retry", async () => {
    const generate = createNvidiaGenerator({
      config: { ...CONFIG, maxRetries: 0 },
      maxContextProducts: 120,
      fetchImpl: async () => jsonResponse("Sorry, I cannot do that."),
    });

    await assert.rejects(generate(input()), (error: unknown) => {
      assert.ok(error instanceof PlanRejectedError);
      assert.equal(error.reason, "INVALID_JSON");
      return true;
    });
  });

  it("tells the model why a previous attempt was rejected", async () => {
    let promptBody = "";

    const generate = createNvidiaGenerator({
      config: CONFIG,
      maxContextProducts: 120,
      fetchImpl: async (_url, init) => {
        promptBody = String(init?.body);
        return jsonResponse(VALID_PLAN);
      },
    });

    await generate(
      input({ retry: { reason: "OVER_BUDGET", previousTotalPence: 9_000 } }),
    );

    assert.ok(promptBody.includes("OVER_BUDGET"));
    assert.ok(promptBody.includes("90.00"), "the previous total should steer the retry");
  });
});
