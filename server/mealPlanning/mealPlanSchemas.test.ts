import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { parseMealPlanRequest, type FieldIssue } from "./mealPlanSchemas";

const VALID = {
  budgetPence: 7000,
  householdSize: 2,
  mealsPerDay: ["dinner"],
  mealPreferences: ["quick", "low-waste"],
  cuisinePreferences: ["Italian", "British"],
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: [],
  pantryBasics: [],
};

function issuesFor(body: unknown): FieldIssue[] {
  try {
    parseMealPlanRequest(body);
    return [];
  } catch (error) {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 400);
    assert.equal(error.code, "INVALID_MEAL_PLAN_REQUEST");
    return error.details as FieldIssue[];
  }
}

function fieldsFor(body: unknown): string[] {
  return issuesFor(body).map((issue) => issue.field);
}

describe("parseMealPlanRequest", () => {
  it("normalizes supported pantry basics", () => {
    const request = parseMealPlanRequest({
      ...VALID,
      pantryBasics: ["Cooking-Oil", "salt", "cooking oil"],
    });

    assert.deepEqual(request.pantryBasics, ["salt", "cooking oil"]);
  });

  it("rejects unknown pantry basics", () => {
    assert.deepEqual(fieldsFor({ ...VALID, pantryBasics: ["fresh chicken"] }), [
      "pantryBasics",
    ]);
  });
  it("accepts a well-formed request", () => {
    const request = parseMealPlanRequest(VALID);

    assert.equal(request.budgetPence, 7000);
    assert.equal(request.householdSize, 2);
    assert.deepEqual(request.mealsPerDay, ["dinner"]);
    assert.deepEqual(request.appliances, ["hob", "oven"]);
  });

  it("rejects a non-object body", () => {
    for (const body of [null, "text", 42, []]) {
      assert.deepEqual(fieldsFor(body), ["body"]);
    }
  });

  it("enforces the budget range in pence", () => {
    assert.deepEqual(fieldsFor({ ...VALID, budgetPence: 999 }), ["budgetPence"]);
    assert.deepEqual(fieldsFor({ ...VALID, budgetPence: 50_001 }), [
      "budgetPence",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, budgetPence: 70.5 }), [
      "budgetPence",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, budgetPence: 1000 }), []);
    assert.deepEqual(fieldsFor({ ...VALID, budgetPence: 50_000 }), []);
  });

  it("enforces the household size range", () => {
    assert.deepEqual(fieldsFor({ ...VALID, householdSize: 0 }), [
      "householdSize",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, householdSize: 11 }), [
      "householdSize",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, householdSize: 10 }), []);
  });

  it("requires at least one meal type and rejects unknown ones", () => {
    assert.deepEqual(fieldsFor({ ...VALID, mealsPerDay: [] }), ["mealsPerDay"]);
    assert.deepEqual(fieldsFor({ ...VALID, mealsPerDay: ["brunch"] }), [
      "mealsPerDay",
    ]);
  });

  it("de-duplicates enum lists and returns them in canonical order", () => {
    const request = parseMealPlanRequest({
      ...VALID,
      mealsPerDay: ["dinner", "dinner", "lunch"],
      appliances: ["oven", "hob", "hob"],
    });

    // Canonical order, not the order the client sent, so downstream prompts
    // and cache keys are stable for equivalent selections.
    assert.deepEqual(request.mealsPerDay, ["lunch", "dinner"]);
    assert.deepEqual(request.appliances, ["hob", "oven"]);
  });

  it("treats an empty appliance list as an explicit no-cook plan", () => {
    const request = parseMealPlanRequest({ ...VALID, appliances: [] });
    assert.deepEqual(request.appliances, []);
  });

  it("rejects an appliance list with no way to cook", () => {
    assert.deepEqual(fieldsFor({ ...VALID, appliances: ["kettle", "blender"] }), [
      "appliances",
    ]);
  });

  it("normalizes allergy slugs to the catalogue's wording", () => {
    const request = parseMealPlanRequest({
      ...VALID,
      allergies: ["Tree-Nuts", " MILK ", "tree nuts"],
    });

    assert.deepEqual(request.allergies, ["milk", "tree nuts"]);
  });

  it("rejects an allergy outside the 14 regulated allergens", () => {
    const issues = issuesFor({ ...VALID, allergies: ["kiwi"] });
    assert.deepEqual(
      issues.map((issue) => issue.field),
      ["allergies"],
    );
    assert.match(issues[0].message, /celery/);
  });

  it("trims free text and drops empty entries", () => {
    const request = parseMealPlanRequest({
      ...VALID,
      cuisinePreferences: ["  Thai  ", "", "   "],
      dislikedIngredients: [" Olives ", "olives"],
    });

    assert.deepEqual(request.cuisinePreferences, ["Thai"]);
    // De-duplicated case-insensitively, keeping the first spelling supplied.
    assert.deepEqual(request.dislikedIngredients, ["Olives"]);
  });

  it("length-limits and count-limits free text", () => {
    assert.deepEqual(
      fieldsFor({ ...VALID, cuisinePreferences: ["x".repeat(41)] }),
      ["cuisinePreferences"],
    );
    assert.deepEqual(
      fieldsFor({
        ...VALID,
        dislikedIngredients: Array.from({ length: 31 }, (_, i) => `item${i}`),
      }),
      ["dislikedIngredients"],
    );
  });

  it("defaults omitted optional lists to empty", () => {
    const request = parseMealPlanRequest({
      budgetPence: 4000,
      householdSize: 1,
      mealsPerDay: ["breakfast"],
      appliances: ["microwave"],
    });

    assert.deepEqual(request.mealPreferences, []);
    assert.deepEqual(request.cuisinePreferences, []);
    assert.deepEqual(request.allergies, []);
    assert.deepEqual(request.dislikedIngredients, []);
    assert.deepEqual(request.pantryBasics, []);
    assert.equal(request.storeId, undefined);
  });

  it("rejects unexpected properties rather than silently ignoring them", () => {
    assert.deepEqual(fieldsFor({ ...VALID, isAdmin: true }), ["isAdmin"]);
  });

  it("collects every problem in one response", () => {
    const fields = fieldsFor({
      ...VALID,
      budgetPence: 10,
      householdSize: 99,
      mealsPerDay: [],
    });

    assert.deepEqual(fields.sort(), [
      "budgetPence",
      "householdSize",
      "mealsPerDay",
    ]);
  });

  it("defaults budgetTargetPercent to 80 when it is omitted", () => {
    assert.equal(parseMealPlanRequest(VALID).budgetTargetPercent, 80);
  });

  it("accepts each documented budget target preset", () => {
    for (const percent of [50, 65, 80]) {
      assert.equal(
        parseMealPlanRequest({ ...VALID, budgetTargetPercent: percent })
          .budgetTargetPercent,
        percent,
      );
    }
  });

  it("rejects a budget target that is not a documented preset", () => {
    assert.deepEqual(fieldsFor({ ...VALID, budgetTargetPercent: 70 }), [
      "budgetTargetPercent",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, budgetTargetPercent: "80" }), [
      "budgetTargetPercent",
    ]);
  });

  it("defaults mustHaveProductIds to an empty list", () => {
    assert.deepEqual(parseMealPlanRequest(VALID).mustHaveProductIds, []);
  });

  it("de-duplicates must-have product ids while preserving the order sent", () => {
    const request = parseMealPlanRequest({
      ...VALID,
      mustHaveProductIds: [" b-2 ", "a-1", "b-2"],
    });

    assert.deepEqual(request.mustHaveProductIds, ["b-2", "a-1"]);
  });

  it("rejects blank or malformed must-have product ids", () => {
    assert.deepEqual(fieldsFor({ ...VALID, mustHaveProductIds: ["   "] }), [
      "mustHaveProductIds",
    ]);
    assert.deepEqual(fieldsFor({ ...VALID, mustHaveProductIds: [42] }), [
      "mustHaveProductIds",
    ]);
    assert.deepEqual(
      fieldsFor({ ...VALID, mustHaveProductIds: ["has space"] }),
      ["mustHaveProductIds"],
    );
  });

  it("rejects more than twelve must-have products", () => {
    const ids = Array.from({ length: 13 }, (_, index) => `p-${index}`);

    assert.deepEqual(fieldsFor({ ...VALID, mustHaveProductIds: ids }), [
      "mustHaveProductIds",
    ]);
  });
});
