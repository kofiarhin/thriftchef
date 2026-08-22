import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadConfig } from "./env";

const MINIMAL: Record<string, string> = {
  MONGODB_URI: "mongodb://localhost:27017/thriftchef",
};

describe("Tesco crawl configuration", () => {
  it("has no store configured by default", () => {
    // Tesco is a development integration. A default scope would be a claim
    // about a shop nobody has verified, and a crawl would happily use it.
    const config = loadConfig(MINIMAL);

    assert.equal(config.tesco.storeId, null);
    assert.equal(config.tesco.postcode, null);
    assert.equal(config.tesco.expectedLocationText, null);
    assert.equal(config.tesco.fulfilmentMode, "delivery");
    assert.equal(config.tesco.headless, false);
    assert.equal(config.tesco.maxProductsPerCategory, null);
  });

  it("reads a configured scope", () => {
    const config = loadConfig({
      ...MINIMAL,
      TESCO_STORE_ID: "tesco-online-cv1",
      TESCO_POSTCODE: "CV1 2AB",
      TESCO_EXPECTED_LOCATION_TEXT: "Delivery to CV1",
      TESCO_FULFILMENT_MODE: "collection",
      TESCO_HEADLESS: "true",
      TESCO_MAX_PRODUCTS_PER_CATEGORY: "5",
    });

    assert.equal(config.tesco.storeId, "tesco-online-cv1");
    assert.equal(config.tesco.postcode, "CV1 2AB");
    assert.equal(config.tesco.expectedLocationText, "Delivery to CV1");
    assert.equal(config.tesco.fulfilmentMode, "collection");
    assert.equal(config.tesco.headless, true);
    assert.equal(config.tesco.maxProductsPerCategory, 5);
  });

  it("rejects a fulfilment mode Tesco does not have", () => {
    assert.throws(
      () => loadConfig({ ...MINIMAL, TESCO_FULFILMENT_MODE: "teleport" }),
      (error: unknown) =>
        error instanceof Error &&
        error.message.includes("TESCO_FULFILMENT_MODE") &&
        error.message.includes("delivery"),
    );
  });

  it("rejects a store id that is not a slug", () => {
    // The store id is the natural key a catalogue is written under. A value
    // the RetailStore schema would refuse must fail here, not half way
    // through a crawl.
    assert.throws(
      () => loadConfig({ ...MINIMAL, TESCO_STORE_ID: "Tesco Online CV1" }),
      (error: unknown) =>
        error instanceof Error && error.message.includes("TESCO_STORE_ID"),
    );
  });

  it("never repeats the postcode in a failure message", () => {
    const error = (() => {
      try {
        loadConfig({
          ...MINIMAL,
          TESCO_POSTCODE: "CV1 2AB",
          TESCO_FULFILMENT_MODE: "teleport",
        });
        return null;
      } catch (thrown) {
        return thrown as Error;
      }
    })();

    assert.ok(error);
    assert.ok(!error.message.includes("CV1 2AB"));
  });
});

describe("loadConfig", () => {
  it("applies documented defaults when only required values are present", () => {
    const config = loadConfig(MINIMAL);

    assert.equal(config.nodeEnv, "development");
    assert.equal(config.port, 5000);
    assert.equal(config.clientOrigin, "http://localhost:5173");
    assert.equal(config.mongodbUri, "mongodb://localhost:27017/thriftchef");
    assert.equal(config.catalogueStaleAfterHours, 72);
    assert.equal(config.rateLimit.windowMs, 60_000);
    assert.equal(config.rateLimit.max, 10);
    assert.equal(config.aldi.storeId, "belper-de56-1ar");
  });

  /**
   * The whole point of the local planner: a developer can clone, set a database
   * URI and generate a meal plan. No API key, no account, no model.
   */
  it("needs only a database URI to start", () => {
    assert.doesNotThrow(() => loadConfig(MINIMAL));
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

  it("defaults every planner bound to its documented value", () => {
    const config = loadConfig(MINIMAL);

    assert.equal(config.mealPlanEngine.maxProducts, 80);
    assert.equal(config.mealPlanEngine.candidateLimit, 24);
    assert.equal(config.mealPlanEngine.beamWidth, 32);
    assert.equal(config.mealPlanEngine.maxRecipeVariants, 6);
    assert.equal(config.mealPlanEngine.timeoutMs, 1_500);
  });

  it("accepts planner bounds inside their documented ranges", () => {
    const config = loadConfig({
      ...MINIMAL,
      MEAL_PLAN_MAX_PRODUCTS: "40",
      MEAL_PLAN_CANDIDATE_LIMIT: "8",
      MEAL_PLAN_BEAM_WIDTH: "16",
      MEAL_PLAN_MAX_RECIPE_VARIANTS: "3",
      MEAL_PLAN_ENGINE_TIMEOUT_MS: "800",
    });

    assert.equal(config.mealPlanEngine.maxProducts, 40);
    assert.equal(config.mealPlanEngine.candidateLimit, 8);
    assert.equal(config.mealPlanEngine.beamWidth, 16);
    assert.equal(config.mealPlanEngine.maxRecipeVariants, 3);
    assert.equal(config.mealPlanEngine.timeoutMs, 800);
  });

  /**
   * The bounds exist so a misconfiguration cannot turn a bounded search into an
   * unbounded one. Rejecting out-of-range values at startup is what makes the
   * latency guarantee hold.
   */
  it("rejects a planner bound outside its range", () => {
    const outOfRange: Array<[string, string]> = [
      ["MEAL_PLAN_MAX_PRODUCTS", "500"],
      ["MEAL_PLAN_MAX_PRODUCTS", "10"],
      ["MEAL_PLAN_CANDIDATE_LIMIT", "128"],
      ["MEAL_PLAN_CANDIDATE_LIMIT", "2"],
      ["MEAL_PLAN_BEAM_WIDTH", "256"],
      ["MEAL_PLAN_BEAM_WIDTH", "4"],
      ["MEAL_PLAN_MAX_RECIPE_VARIANTS", "50"],
      ["MEAL_PLAN_MAX_RECIPE_VARIANTS", "0"],
      ["MEAL_PLAN_ENGINE_TIMEOUT_MS", "60000"],
      ["MEAL_PLAN_ENGINE_TIMEOUT_MS", "10"],
    ];

    for (const [key, value] of outOfRange) {
      assert.throws(
        () => loadConfig({ ...MINIMAL, [key]: value }),
        (error: unknown) => error instanceof Error && error.message.includes(key),
        `${key}=${value} should have been rejected`,
      );
    }
  });

  it("no longer accepts or requires any model configuration", () => {
    const config = loadConfig({
      ...MINIMAL,
      NVIDIA_API_KEY: "should-be-ignored",
      AI_REQUEST_TIMEOUT_MS: "180000",
    });

    assert.ok(!Object.keys(config).includes("nvidia"));
    assert.equal(config.mealPlanEngine.timeoutMs, 1_500);
  });

  it("parses booleans and bounded integers", () => {
    const config = loadConfig({
      ...MINIMAL,
      ALDI_HEADLESS: "true",
      ALDI_MAX_PRODUCTS_PER_CATEGORY: "25",
      MEAL_PLAN_MAX_PRODUCTS: "40",
    });

    assert.equal(config.aldi.headless, true);
    assert.equal(config.aldi.maxProductsPerCategory, 25);
    assert.equal(config.mealPlanEngine.maxProducts, 40);
  });
});
