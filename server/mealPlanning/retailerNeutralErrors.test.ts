import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { createMealPlanEngine } from "./mealPlanEngine";
import { parseMealPlanRequest } from "./mealPlanSchemas";

describe("retailer-neutral planner errors", () => {
  it("does not tell a Tesco request to refresh Aldi when no dinner variant exists", async () => {
    const engine = createMealPlanEngine({
      beamWidth: 8,
      candidateLimit: 4,
      maxRecipeVariants: 2,
      timeoutMs: 1_000,
    });
    const request = parseMealPlanRequest({
      budgetPence: 5_000,
      householdSize: 2,
      mealsPerDay: ["dinner"],
      cookingDays: [1, 2, 3, 4, 5, 6, 7],
      appliances: ["hob", "oven"],
      allergies: [],
      dislikedIngredients: [],
      pantryBasics: ["salt", "pepper", "cooking oil"],
      retailerId: "tesco-uk",
      storeId: "tesco-online-gb",
    });

    await assert.rejects(
      engine.generate({ request, products: [], variationSeed: 0 }),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 409);
        assert.equal(error.code, "CATALOGUE_CONSTRAINT_CONFLICT");
        assert.doesNotMatch(error.message, /aldi/i);
        assert.doesNotMatch(JSON.stringify(error.details), /aldi/i);
        return true;
      },
    );
  });
});
