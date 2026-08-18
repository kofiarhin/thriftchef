import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadConfig } from "./env";

const MINIMAL: Record<string, string> = {
  MONGODB_URI: "mongodb://localhost:27017/thriftchef",
  NVIDIA_API_KEY: "test-key",
  NVIDIA_API_URL: "https://integrate.api.nvidia.com/v1/chat/completions",
  NVIDIA_MODEL: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
};

describe("loadConfig", () => {
  it("applies documented defaults when only required values are present", () => {
    const config = loadConfig(MINIMAL);

    assert.equal(config.nodeEnv, "development");
    assert.equal(config.port, 5000);
    assert.equal(config.clientOrigin, "http://localhost:5173");
    assert.equal(config.mongodbUri, "mongodb://localhost:27017/thriftchef");
    assert.equal(config.nvidia.model, MINIMAL.NVIDIA_MODEL);
    assert.equal(config.catalogueStaleAfterHours, 72);
    assert.equal(config.mealPlanMaxContextProducts, 80);
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

  it("always requires NVIDIA credentials", () => {
    assert.throws(
      () => loadConfig({ MONGODB_URI: MINIMAL.MONGODB_URI }),
      (error: unknown) =>
        error instanceof Error && error.message.includes("NVIDIA_API_KEY"),
    );

    const config = loadConfig({
      ...MINIMAL,
      NVIDIA_API_KEY: "secret-key",
      NVIDIA_API_URL: "https://integrate.api.nvidia.com/v1/chat/completions",
      NVIDIA_MODEL: "meta/llama-3.3-70b-instruct",
    });

    assert.equal(config.nvidia.model, "meta/llama-3.3-70b-instruct");
    assert.equal(config.nvidia.timeoutMs, 120_000);
    assert.equal(config.nvidia.maxRetries, 0);
  });

  /**
   * A 49B model writing a full week of recipes needs well over 30 seconds, so
   * the default must give it the whole two-minute window. Retries default to
   * off: a retried timeout would multiply that window rather than shorten it.
   */
  it("defaults the AI budget to the full two-minute window with no network retry", () => {
    const config = loadConfig(MINIMAL);

    assert.equal(config.nvidia.timeoutMs, 120_000);
    assert.equal(config.nvidia.maxRetries, 0);
  });

  it("caps the configurable AI timeout at two minutes", () => {
    assert.throws(
      () => loadConfig({ ...MINIMAL, AI_REQUEST_TIMEOUT_MS: "180000" }),
      (error: unknown) =>
        error instanceof Error && error.message.includes("AI_REQUEST_TIMEOUT_MS"),
    );
  });

  it("reports every missing required variable at once", () => {
    const error = (() => {
      try {
        loadConfig({});
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
