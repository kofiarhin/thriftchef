import { COOKING_APPLIANCES } from "./api/types";
import type {
  Allergen,
  Appliance,
  MealPlanRequest,
  MealPreference,
  MealType,
  PantryBasic,
} from "./api/types";

/**
 * Form state is kept as the strings the user typed, so a partly-typed budget
 * is never silently coerced. Validation converts to the request shape.
 */
export interface ConstraintFormState {
  budgetPounds: string;
  householdSize: string;
  mealsPerDay: MealType[];
  mealPreferences: MealPreference[];
  cuisinePreferences: string;
  appliances: Appliance[];
  allergies: Allergen[];
  dislikedIngredients: string;
  pantryBasics: PantryBasic[];
}

export const INITIAL_FORM_STATE: ConstraintFormState = {
  budgetPounds: "70",
  householdSize: "2",
  mealsPerDay: ["dinner"],
  mealPreferences: [],
  cuisinePreferences: "",
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: "",
  pantryBasics: [],
};

export const MIN_BUDGET_POUNDS = 10;
export const MAX_BUDGET_POUNDS = 500;
export const MAX_FREE_TEXT_LENGTH = 40;

export type FieldName = keyof ConstraintFormState;
export type ValidationIssues = Partial<Record<FieldName, string>>;

export interface ValidationResult {
  issues: ValidationIssues;
  /** Null whenever `issues` is non-empty. */
  request: MealPlanRequest | null;
}

function splitFreeText(value: string): string[] {
  const entries = new Map<string, string>();

  for (const raw of value.split(",")) {
    const trimmed = raw.trim().replace(/\s+/g, " ");
    // First spelling wins, so the user sees the entry as they first typed it.
    if (trimmed && !entries.has(trimmed.toLowerCase())) {
      entries.set(trimmed.toLowerCase(), trimmed);
    }
  }

  return [...entries.values()];
}

/**
 * Mirrors the server's rules so obvious mistakes are caught before a request
 * is spent. The server stays authoritative — this never relaxes a rule, it
 * only reports the same failures sooner.
 */
export function validateConstraints(
  state: ConstraintFormState,
): ValidationResult {
  const issues: ValidationIssues = {};

  const budgetPounds = Number(state.budgetPounds);
  if (
    !state.budgetPounds.trim() ||
    !Number.isFinite(budgetPounds) ||
    budgetPounds < MIN_BUDGET_POUNDS ||
    budgetPounds > MAX_BUDGET_POUNDS
  ) {
    issues.budgetPounds = `Enter a weekly budget between £${MIN_BUDGET_POUNDS} and £${MAX_BUDGET_POUNDS}.`;
  } else if (Math.round(budgetPounds * 100) !== budgetPounds * 100) {
    issues.budgetPounds = "Enter a budget in pounds and pence, for example 72.50.";
  }

  const householdSize = Number(state.householdSize);
  if (
    !Number.isInteger(householdSize) ||
    householdSize < 1 ||
    householdSize > 10
  ) {
    issues.householdSize = "Enter a household size between 1 and 10.";
  }

  if (state.mealsPerDay.length === 0) {
    issues.mealsPerDay = "Choose at least one meal to plan each day.";
  }

  // An empty selection is valid and means no-cook. A selection with no cooking
  // appliance in it is a mistake, not a no-cook choice.
  if (
    state.appliances.length > 0 &&
    !state.appliances.some((appliance) =>
      (COOKING_APPLIANCES as readonly string[]).includes(appliance),
    )
  ) {
    issues.appliances =
      "Select a way to cook, or clear the whole list to plan no-cook meals only.";
  }

  const cuisinePreferences = splitFreeText(state.cuisinePreferences);
  if (cuisinePreferences.some((entry) => entry.length > MAX_FREE_TEXT_LENGTH)) {
    issues.cuisinePreferences = `Keep each cuisine under ${MAX_FREE_TEXT_LENGTH} characters.`;
  }

  const dislikedIngredients = splitFreeText(state.dislikedIngredients);
  if (dislikedIngredients.some((entry) => entry.length > MAX_FREE_TEXT_LENGTH)) {
    issues.dislikedIngredients = `Keep each ingredient under ${MAX_FREE_TEXT_LENGTH} characters.`;
  } else if (dislikedIngredients.length > 30) {
    issues.dislikedIngredients = "List at most 30 disliked ingredients.";
  }

  if (Object.keys(issues).length > 0) return { issues, request: null };

  return {
    issues,
    request: {
      budgetPence: Math.round(budgetPounds * 100),
      householdSize,
      mealsPerDay: state.mealsPerDay,
      mealPreferences: state.mealPreferences,
      cuisinePreferences,
      appliances: state.appliances,
      allergies: state.allergies,
      dislikedIngredients,
      pantryBasics: state.pantryBasics,
    },
  };
}

/** Maps server-reported field names back onto form controls. */
export function mapServerFieldToFormField(field: string): FieldName | null {
  const mapping: Record<string, FieldName> = {
    budgetPence: "budgetPounds",
    householdSize: "householdSize",
    mealsPerDay: "mealsPerDay",
    mealPreferences: "mealPreferences",
    cuisinePreferences: "cuisinePreferences",
    appliances: "appliances",
    allergies: "allergies",
    dislikedIngredients: "dislikedIngredients",
    pantryBasics: "pantryBasics",
  };

  return mapping[field] ?? null;
}
