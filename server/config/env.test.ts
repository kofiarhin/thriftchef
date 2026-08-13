import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadConfig } from "./env";

const MINIMAL: Record<string, string> = {
  MONGODB_URI: "mongodb://localhost:27017/thriftchef",
};

describe("loadConfig", () => {
  it("applies documented defaults when only required values are present", () => {
    const config = loadConfig(MINIMAL);

    assert.equal(config.nodeEnv, "development");
    assert.equal(config.port, 5000);
    assert.equal(config.clientOrigin, "http://localhost:5173");
    assert.equal(config.mongodbUri, "mongodb://localhost:27017/thriftchef");
    assert.equal(config.mealPlanGenerator, "mock");
    assert.equal(config.catalogueStaleAfterHours, 72);
    assert.equal(config.mealPlanMaxContextProducts, 120);
    assert.equal(config.rateLimit.windowMs, 60_000);
    assert.equal(config.rateLimit.max, 10);
    assert.equal(config.aldi.storeId, "belper-de56-1ar");
  });

  it("fails fast when a required variable is missing", () => {
    assert.throws(
      () => loadConfig({}),
      (error: unknown) =>
        error instanceof Error && error.message.includes("MONGODB_URI"),
    );
  });

  it("never repeats a supplied value in the failure message", () => {
    const error = (() => {
      try {
        loadConfig({ ...MINIMAL, PORT: "not-a-port" });
        return null;
      } catch (thrown) {
        return thrown as Error;
      }
    })();

    assert.ok(error, "expected loadConfig to reject an invalid PORT");
    assert.ok(error.message.includes("PORT"));
    assert.ok(!error.message.includes("not-a-port"));
  });

  it("requires NVIDIA credentials only when the nvidia generator is selected", () => {
    assert.equal(
      loadConfig({ ...MINIMAL, MEAL_PLAN_GENERATOR: "mock" }).nvidia,
      null,
    );

    assert.throws(
      () => loadConfig({ ...MINIMAL, MEAL_PLAN_GENERATOR: "nvidia" }),
      (error: unknown) =>
        error instanceof Error && error.message.includes("NVIDIA_API_KEY"),
    );

    const config = loadConfig({
      ...MINIMAL,
      MEAL_PLAN_GENERATOR: "nvidia",
      NVIDIA_API_KEY: "secret-key",
      NVIDIA_API_URL: "https://integrate.api.nvidia.com/v1/chat/completions",
      NVIDIA_MODEL: "meta/llama-3.3-70b-instruct",
    });

    assert.equal(config.nvidia?.model, "meta/llama-3.3-70b-instruct");
    assert.equal(config.nvidia?.timeoutMs, 30_000);
    assert.equal(config.nvidia?.maxRetries, 1);
  });

  it("rejects an unknown generator without echoing the value", () => {
    assert.throws(
      () => loadConfig({ ...MINIMAL, MEAL_PLAN_GENERATOR: "openai" }),
      (error: unknown) =>
        error instanceof Error &&
        error.message.includes("MEAL_PLAN_GENERATOR") &&
        !error.message.includes("openai"),
    );
  });

  it("reports every missing required variable at once", () => {
    const error = (() => {
      try {
        loadConfig({ MEAL_PLAN_GENERATOR: "nvidia" });
        return null;
      } catch (thrown) {
        return thrown as Error;
      }
    })();

    assert.ok(error);
    for (const key of [
      "MONGODB_URI",
      "NVIDIA_API_KEY",
      "NVIDIA_API_URL",
      "NVIDIA_MODEL",
    ]) {
      assert.ok(error.message.includes(key), `expected ${key} in the message`);
    }
  });

  it("parses booleans and bounded integers", () => {
    const config = loadConfig({
      ...MINIMAL,
      ALDI_HEADLESS: "true",
      ALDI_MAX_PRODUCTS_PER_CATEGORY: "25",
      MEAL_PLAN_MAX_CONTEXT_PRODUCTS: "40",
    });

    assert.equal(config.aldi.headless, true);
    assert.equal(config.aldi.maxProductsPerCategory, 25);
    assert.equal(config.mealPlanMaxContextProducts, 40);
  });
});
