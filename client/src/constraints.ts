import { applyMoods } from "./features/weeklyPlan/weeklyMood";
import {
  BUDGET_TARGET_PERCENTS,
  COOKING_APPLIANCES,
  DEFAULT_BUDGET_TARGET_PERCENT,
  MAX_MUST_HAVE_PRODUCTS,
} from "./api/types";
import type {
  Allergen,
  Appliance,
  BudgetTargetPercent,
  MealPlanRequest,
  MealPreference,
  MealType,
  PantryBasic,
  ProductSearchItem,
} from "./api/types";

/**
 * Form state is kept as the strings the user typed, so a partly-typed budget
 * is never silently coerced. Validation converts to the request shape.
 */
export interface ConstraintFormState {
  /** The retailer and store every product in the plan will come from. */
  retailerId: string | null;
  storeId: string | null;
  /** ISO weekdays the household cooks on. */
  cookingDays: number[];
  /** Hard ceiling on a single recipe, or null for no limit. */
  maxTotalMinutes: number | null;
  budgetPounds: string;
  /** The share of the maximum the plan should aim to use. */
  budgetTargetPercent: BudgetTargetPercent;
  householdSize: string;
  mealsPerDay: MealType[];
  mealPreferences: MealPreference[];
  cuisinePreferences: string;
  appliances: Appliance[];
  allergies: Allergen[];
  dislikedIngredients: string;
  pantryBasics: PantryBasic[];
  /**
   * The whole catalogue item, not just its id: the picker shows a name and a
   * running subtotal. Only the ids are ever sent — the server prices and names
   * every product from its own catalogue snapshot.
   */
  mustHaveProducts: ProductSearchItem[];
  /** Catalogue products the household already has and should not buy again. */
  ownedProducts: ProductSearchItem[];
  /**
   * This week's mood, as ids from `WEEKLY_MOODS`. Folded into the request's
   * preferences at submit time and never written back to the saved profile.
   */
  weeklyMoods: string[];
}

export const INITIAL_FORM_STATE: ConstraintFormState = {
  retailerId: null,
  storeId: null,
  // Every day, which is what every plan generated before cooking days existed
  // assumed. The weekly wizard narrows it; the classic form leaves it whole.
  cookingDays: [1, 2, 3, 4, 5, 6, 7],
  maxTotalMinutes: null,
  budgetPounds: "70",
  budgetTargetPercent: DEFAULT_BUDGET_TARGET_PERCENT,
  householdSize: "2",
  mealsPerDay: ["dinner"],
  mealPreferences: [],
  cuisinePreferences: "",
  appliances: ["hob", "oven"],
  allergies: [],
  dislikedIngredients: "",
  pantryBasics: [],
  mustHaveProducts: [],
  ownedProducts: [],
  weeklyMoods: [],
};

export const MIN_BUDGET_POUNDS = 10;
export const MAX_BUDGET_POUNDS = 500;
export const MAX_FREE_TEXT_LENGTH = 40;
export const MAX_MUST_HAVE_ITEMS = MAX_MUST_HAVE_PRODUCTS;

/** The three presets, with the wording the form shows for each. */
export const BUDGET_TARGET_OPTIONS: Array<{
  percent: BudgetTargetPercent;
  label: string;
  description: string;
}> = [
  { percent: 50, label: "Tight", description: "Spend about half of the maximum." },
  { percent: 65, label: "Balanced", description: "Leave a little headroom." },
  { percent: 80, label: "Use my budget", description: "Aim close to the maximum." },
];

/**
 * The target in pence, or null while the budget is not yet a usable number.
 * The server recomputes this; showing it here is what makes the preset mean
 * something before the plan is generated.
 */
export function targetPenceFor(state: ConstraintFormState): number | null {
  const budgetPounds = Number(state.budgetPounds);
  if (!state.budgetPounds.trim() || !Number.isFinite(budgetPounds)) return null;

  return Math.round(budgetPounds * 100 * (state.budgetTargetPercent / 100));
}

export function mustHaveSubtotalPence(state: ConstraintFormState): number {
  return state.mustHaveProducts.reduce(
    (total, product) => total + product.pricePence,
    0,
  );
}

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

  if (!BUDGET_TARGET_PERCENTS.includes(state.budgetTargetPercent)) {
    issues.budgetTargetPercent = "Choose how much of your budget to aim for.";
  }

  if (state.mustHaveProducts.length > MAX_MUST_HAVE_ITEMS) {
    issues.mustHaveProducts = `Choose at most ${MAX_MUST_HAVE_ITEMS} must-have products.`;
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
      budgetTargetPercent: state.budgetTargetPercent,
      householdSize,
      // The first request of a session always asks for seed 0, so the same
      // constraints give the same week until the user asks to regenerate.
      variationSeed: 0,
      mealsPerDay: state.mealsPerDay,
      // Saved preferences plus this week's moods. Additive: a mood can add a
      // preference for one week but never remove one the household always
      // wants.
      mealPreferences: applyMoods(
        state.mealPreferences,
        cuisinePreferences,
        state.weeklyMoods,
      ).mealPreferences,
      cuisinePreferences: applyMoods(
        state.mealPreferences,
        cuisinePreferences,
        state.weeklyMoods,
      ).cuisinePreferences,
      appliances: state.appliances,
      allergies: state.allergies,
      dislikedIngredients,
      pantryBasics: state.pantryBasics,
      mustHaveProductIds: state.mustHaveProducts.map((product) => product.id),
      ownedProductIds: state.ownedProducts.map((product) => product.id),
      cookingDays: [...state.cookingDays].sort((a, b) => a - b),
      ...(state.maxTotalMinutes === null
        ? {}
        : { maxTotalMinutes: state.maxTotalMinutes }),
      ...(state.retailerId ? { retailerId: state.retailerId } : {}),
      ...(state.storeId ? { storeId: state.storeId } : {}),
    },
  };
}

/** Maps server-reported field names back onto form controls. */
export function mapServerFieldToFormField(field: string): FieldName | null {
  const mapping: Record<string, FieldName> = {
    retailerId: "retailerId",
    storeId: "storeId",
    budgetPence: "budgetPounds",
    budgetTargetPercent: "budgetTargetPercent",
    mustHaveProductIds: "mustHaveProducts",
    householdSize: "householdSize",
    mealsPerDay: "mealsPerDay",
    mealPreferences: "mealPreferences",
    cuisinePreferences: "cuisinePreferences",
    appliances: "appliances",
    allergies: "allergies",
    dislikedIngredients: "dislikedIngredients",
    pantryBasics: "pantryBasics",
    cookingDays: "cookingDays",
    maxTotalMinutes: "maxTotalMinutes",
    ownedProductIds: "ownedProducts",
  };

  return mapping[field] ?? null;
}
