import { describe, expect, it } from "vitest";
import {
  INITIAL_FORM_STATE,
  mapServerFieldToFormField,
  validateConstraints,
  type ConstraintFormState,
} from "./constraints";

function state(overrides: Partial<ConstraintFormState> = {}): ConstraintFormState {
  return { ...INITIAL_FORM_STATE, ...overrides };
}

describe("validateConstraints", () => {
  it("builds a request in pence from a valid form", () => {
    const { request, issues } = validateConstraints(
      state({ budgetPounds: "72.50", householdSize: "3" }),
    );

    expect(issues).toEqual({});
    expect(request).toMatchObject({ budgetPence: 7250, householdSize: 3 });
  });

  it("rejects a budget outside the supported range", () => {
    expect(validateConstraints(state({ budgetPounds: "5" })).issues)
      .toHaveProperty("budgetPounds");
    expect(validateConstraints(state({ budgetPounds: "5000" })).issues)
      .toHaveProperty("budgetPounds");
    expect(validateConstraints(state({ budgetPounds: "" })).issues)
      .toHaveProperty("budgetPounds");
  });

  it("rejects a budget with fractions of a penny", () => {
    expect(validateConstraints(state({ budgetPounds: "70.555" })).issues)
      .toHaveProperty("budgetPounds");
  });

  it("rejects a household size outside 1 to 10", () => {
    expect(validateConstraints(state({ householdSize: "0" })).issues)
      .toHaveProperty("householdSize");
    expect(validateConstraints(state({ householdSize: "11" })).issues)
      .toHaveProperty("householdSize");
    expect(validateConstraints(state({ householdSize: "2.5" })).issues)
      .toHaveProperty("householdSize");
  });

  it("requires at least one meal type", () => {
    expect(validateConstraints(state({ mealsPerDay: [] })).issues)
      .toHaveProperty("mealsPerDay");
  });

  it("accepts an empty appliance list as a no-cook plan", () => {
    const { issues, request } = validateConstraints(state({ appliances: [] }));

    expect(issues).toEqual({});
    expect(request?.appliances).toEqual([]);
  });

  it("rejects an appliance list that cannot cook", () => {
    expect(
      validateConstraints(state({ appliances: ["kettle", "blender"] })).issues,
    ).toHaveProperty("appliances");
  });

  it("splits, trims and de-duplicates comma-separated free text", () => {
    const { request } = validateConstraints(
      state({
        cuisinePreferences: " Italian ,  thai , Italian ,,",
        dislikedIngredients: "olives, Olives",
      }),
    );

    expect(request?.cuisinePreferences).toEqual(["Italian", "thai"]);
    expect(request?.dislikedIngredients).toEqual(["olives"]);
  });

  it("rejects overlong free-text entries", () => {
    expect(
      validateConstraints(state({ cuisinePreferences: "x".repeat(41) })).issues,
    ).toHaveProperty("cuisinePreferences");
  });

  it("returns no request while any field is invalid", () => {
    expect(validateConstraints(state({ budgetPounds: "1" })).request).toBeNull();
  });
});

describe("mapServerFieldToFormField", () => {
  it("maps the server's pence field onto the pounds control", () => {
    expect(mapServerFieldToFormField("budgetPence")).toBe("budgetPounds");
  });

  it("ignores fields with no control", () => {
    expect(mapServerFieldToFormField("storeId")).toBeNull();
  });
});
