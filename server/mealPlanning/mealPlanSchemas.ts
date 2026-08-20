import { ApiError } from "../http/errors";
import { SLUG_PATTERN } from "../catalogue/core/retailerTypes";
import {
  ALL_COOKING_DAYS,
  APPLIANCES,
  BUDGET_TARGET_PERCENTS,
  COOKING_APPLIANCES,
  DEFAULT_BUDGET_TARGET_PERCENT,
  MAX_COOKING_DAY,
  MAX_MUST_HAVE_PRODUCTS,
  MAX_TOTAL_MINUTES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  MIN_COOKING_DAY,
  MIN_TOTAL_MINUTES,
  PANTRY_BASICS,
  UK_ALLERGENS,
  type Allergen,
  type Appliance,
  type BudgetTargetPercent,
  type MealPlanRequest,
  type MealPlanResponse,
  type MealPreference,
  type MealType,
  type PantryBasic,
} from "./mealPlanTypes";

/** Field-addressed so the form can render each problem beside its control. */
export interface FieldIssue {
  field: string;
  message: string;
}

export interface MealReplacementRequest {
  request: MealPlanRequest;
  plan: MealPlanResponse;
  day: number;
  mealType: MealType;
}

/**
 * Validates the replacement envelope. The embedded plan remains untrusted and
 * is passed through the normal plan validator before it can be reused.
 */
export function parseMealReplacementRequest(body: unknown): MealReplacementRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw ApiError.badRequest(
      "The replacement request must be a JSON object.",
      [{ field: "body", message: "The replacement request must be a JSON object." }],
      "INVALID_MEAL_PLAN_REQUEST",
    );
  }

  const input = body as Record<string, unknown>;
  const request = parseMealPlanRequest(input.request);
  const day = input.day;
  const mealType = input.mealType;

  const issues: FieldIssue[] = [];
  if (typeof day !== "number" || !Number.isInteger(day) || day < 1 || day > 7) {
    issues.push({ field: "day", message: "day must be a whole number between 1 and 7." });
  }
  if (typeof mealType !== "string" || !MEAL_TYPES.includes(mealType as MealType)) {
    issues.push({ field: "mealType", message: `mealType must be one of: ${MEAL_TYPES.join(", ")}.` });
  }
  if (typeof input.plan !== "object" || input.plan === null || Array.isArray(input.plan)) {
    issues.push({ field: "plan", message: "plan must be the current meal plan." });
  }

  if (issues.length > 0) {
    throw ApiError.badRequest(
      "The replacement request is not valid.",
      issues,
      "INVALID_MEAL_PLAN_REQUEST",
    );
  }

  return {
    request,
    plan: input.plan as MealPlanResponse,
    day: day as number,
    mealType: mealType as MealType,
  };
}

const MAX_FREE_TEXT_LENGTH = 40;
const MAX_FREE_TEXT_ENTRIES = 30;

/**
 * Bounded, but far above the must-have cap. Owning something is a statement of
 * fact about the household's cupboard; wanting it is a planning constraint, and
 * only the latter has to be searched over.
 */
const MAX_OWNED_PRODUCTS = 60;

const ALLOWED_KEYS = new Set([
  "budgetPence",
  "householdSize",
  "mealsPerDay",
  "mealPreferences",
  "cuisinePreferences",
  "appliances",
  "allergies",
  "dislikedIngredients",
  "pantryBasics",
  "retailerId",
  "storeId",
  "cookingDays",
  "maxTotalMinutes",
  "ownedProductIds",
  "variationSeed",
  "budgetTargetPercent",
  "mustHaveProductIds",
]);

/**
 * Catalogue ids are retailer product codes, so anything with whitespace or
 * markup in it never matched a product and is a client defect worth reporting.
 */
const PRODUCT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

class RequestValidator {
  readonly issues: FieldIssue[] = [];

  add(field: string, message: string): void {
    this.issues.push({ field, message });
  }

  integer(
    field: string,
    value: unknown,
    bounds: { min: number; max: number },
  ): number {
    if (
      typeof value !== "number" ||
      !Number.isInteger(value) ||
      value < bounds.min ||
      value > bounds.max
    ) {
      this.add(
        field,
        `${field} must be a whole number between ${bounds.min} and ${bounds.max}.`,
      );
      return bounds.min;
    }

    return value;
  }

  /**
   * Enum lists are matched case- and separator-insensitively so a client may
   * send "Tree-Nuts" for the catalogue's "tree nuts", then de-duplicated in the
   * canonical order rather than the order the client happened to send.
   */
  enumList<T extends string>(
    field: string,
    value: unknown,
    allowed: readonly T[],
    options: { required?: boolean } = {},
  ): T[] {
    if (value === undefined) {
      if (options.required) this.add(field, `${field} must include at least one value.`);
      return [];
    }

    if (!Array.isArray(value)) {
      this.add(field, `${field} must be an array.`);
      return [];
    }

    const canonical = new Map(
      allowed.map((entry) => [entry.replace(/[\s-]/g, ""), entry]),
    );
    const selected = new Set<T>();

    for (const entry of value) {
      if (typeof entry !== "string") {
        this.add(field, `${field} must contain only text values.`);
        return [];
      }

      const match = canonical.get(entry.trim().toLowerCase().replace(/[\s-]/g, ""));
      if (!match) {
        this.add(
          field,
          `${field} may only contain: ${allowed.join(", ")}.`,
        );
        return [];
      }

      selected.add(match);
    }

    if (options.required && selected.size === 0) {
      this.add(field, `${field} must include at least one value.`);
    }

    return allowed.filter((entry) => selected.has(entry));
  }

  /**
   * The budget target is a closed set rather than a free percentage: three
   * presets are what the UI offers, and an arbitrary number would imply a
   * precision the search cannot honour.
   */
  budgetTargetPercent(field: string, value: unknown): BudgetTargetPercent {
    if (value === undefined) return DEFAULT_BUDGET_TARGET_PERCENT;

    if (
      typeof value !== "number" ||
      !(BUDGET_TARGET_PERCENTS as readonly number[]).includes(value)
    ) {
      this.add(
        field,
        `${field} must be one of: ${BUDGET_TARGET_PERCENTS.join(", ")}.`,
      );
      return DEFAULT_BUDGET_TARGET_PERCENT;
    }

    return value as BudgetTargetPercent;
  }

  /**
   * Duplicates are the user clicking twice, not a second request for the same
   * product, so they are folded away. Order is preserved because the engine
   * assigns must-haves to meal types in the order they were chosen, and a
   * stable order is what keeps that assignment deterministic.
   */
  productIdList(field: string, value: unknown, max: number): string[] {
    if (value === undefined) return [];

    if (!Array.isArray(value)) {
      this.add(field, `${field} must be an array.`);
      return [];
    }

    if (value.length > max) {
      this.add(field, `${field} may contain at most ${max} products.`);
      return [];
    }

    const ids: string[] = [];

    for (const entry of value) {
      if (typeof entry !== "string") {
        this.add(field, `${field} must contain only product id strings.`);
        return [];
      }

      const trimmed = entry.trim();
      if (!PRODUCT_ID_PATTERN.test(trimmed)) {
        this.add(field, `${field} contains an id that is not a product id.`);
        return [];
      }

      if (!ids.includes(trimmed)) ids.push(trimmed);
    }

    return ids;
  }

  /**
   * ISO weekdays the household cooks on.
   *
   * Sorted and de-duplicated rather than rejected for order: the user ticking
   * Wednesday before Monday means the same week either way, and a deterministic
   * planner must not give two answers for one intent. An out-of-range day *is*
   * rejected — that is a client defect, not a preference.
   */
  cookingDays(field: string, value: unknown): number[] {
    if (value === undefined) return [...ALL_COOKING_DAYS];

    if (!Array.isArray(value)) {
      this.add(field, `${field} must be an array of weekday numbers.`);
      return [...ALL_COOKING_DAYS];
    }

    if (value.length === 0) {
      this.add(field, `${field} must include at least one day.`);
      return [...ALL_COOKING_DAYS];
    }

    if (value.length > MAX_COOKING_DAY) {
      this.add(field, `${field} may contain at most ${MAX_COOKING_DAY} days.`);
      return [...ALL_COOKING_DAYS];
    }

    const days = new Set<number>();

    for (const entry of value) {
      if (
        typeof entry !== "number" ||
        !Number.isInteger(entry) ||
        entry < MIN_COOKING_DAY ||
        entry > MAX_COOKING_DAY
      ) {
        this.add(
          field,
          `${field} must contain whole numbers between ${MIN_COOKING_DAY} (Monday) and ${MAX_COOKING_DAY} (Sunday).`,
        );
        return [...ALL_COOKING_DAYS];
      }

      days.add(entry);
    }

    return [...days].sort((a, b) => a - b);
  }

  /** A slug or an object id, for naming a retailer or a store. */
  identity(field: string, value: unknown): string | undefined {
    if (value === undefined) return undefined;

    if (typeof value !== "string") {
      this.add(field, `${field} must be a text value.`);
      return undefined;
    }

    const trimmed = value.trim().toLowerCase();
    if (!SLUG_PATTERN.test(trimmed)) {
      this.add(field, `${field} must be a lowercase slug of up to 64 characters.`);
      return undefined;
    }

    return trimmed;
  }

  freeTextList(field: string, value: unknown): string[] {
    if (value === undefined) return [];

    if (!Array.isArray(value)) {
      this.add(field, `${field} must be an array.`);
      return [];
    }

    if (value.length > MAX_FREE_TEXT_ENTRIES) {
      this.add(field, `${field} may contain at most ${MAX_FREE_TEXT_ENTRIES} entries.`);
      return [];
    }

    const entries = new Map<string, string>();

    for (const entry of value) {
      if (typeof entry !== "string") {
        this.add(field, `${field} must contain only text values.`);
        return [];
      }

      const trimmed = entry.trim().replace(/\s+/g, " ");
      if (!trimmed) continue;

      if (trimmed.length > MAX_FREE_TEXT_LENGTH) {
        this.add(
          field,
          `Each entry in ${field} must be ${MAX_FREE_TEXT_LENGTH} characters or fewer.`,
        );
        return [];
      }

      // First spelling wins, so the entry keeps the casing the user chose.
      if (!entries.has(trimmed.toLowerCase())) {
        entries.set(trimmed.toLowerCase(), trimmed);
      }
    }

    return [...entries.values()];
  }
}

/**
 * Validates an untrusted body into a `MealPlanRequest`, reporting every problem
 * at once so the form can highlight all bad fields in a single round trip.
 */
export function parseMealPlanRequest(body: unknown): MealPlanRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw ApiError.badRequest(
      "The request body must be a JSON object.",
      [{ field: "body", message: "The request body must be a JSON object." }],
      "INVALID_MEAL_PLAN_REQUEST",
    );
  }

  const input = body as Record<string, unknown>;
  const validator = new RequestValidator();

  // An unknown key usually means a client/server contract drift, and silently
  // dropping it would hide the drift until a plan came back wrong.
  for (const key of Object.keys(input)) {
    if (!ALLOWED_KEYS.has(key)) {
      validator.add(key, `${key} is not a recognized field.`);
    }
  }

  const budgetPence = validator.integer("budgetPence", input.budgetPence, {
    min: 1_000,
    max: 50_000,
  });
  const householdSize = validator.integer("householdSize", input.householdSize, {
    min: 1,
    max: 10,
  });

  const mealsPerDay = validator.enumList<MealType>(
    "mealsPerDay",
    input.mealsPerDay,
    MEAL_TYPES,
    { required: true },
  );
  const mealPreferences = validator.enumList<MealPreference>(
    "mealPreferences",
    input.mealPreferences,
    MEAL_PREFERENCES,
  );
  const appliances = validator.enumList<Appliance>(
    "appliances",
    input.appliances,
    APPLIANCES,
  );
  const allergies = validator.enumList<Allergen>(
    "allergies",
    input.allergies,
    UK_ALLERGENS,
  );
  const pantryBasics = validator.enumList<PantryBasic>(
    "pantryBasics",
    input.pantryBasics,
    PANTRY_BASICS,
  );

  // An empty list is a valid no-cook plan. A list holding only a kettle and a
  // blender is not: it looks like a cooking selection but cannot cook.
  if (
    appliances.length > 0 &&
    !appliances.some((appliance) => COOKING_APPLIANCES.includes(appliance))
  ) {
    validator.add(
      "appliances",
      `Select at least one cooking appliance (${COOKING_APPLIANCES.join(", ")}), or none at all for no-cook meals.`,
    );
  }

  const budgetTargetPercent = validator.budgetTargetPercent(
    "budgetTargetPercent",
    input.budgetTargetPercent,
  );
  const mustHaveProductIds = validator.productIdList(
    "mustHaveProductIds",
    input.mustHaveProductIds,
    MAX_MUST_HAVE_PRODUCTS,
  );
  // The owned list is not capped at the must-have limit: a household can
  // legitimately already own a lot of what a week needs, and refusing to
  // believe them would put products back in the basket they already have.
  const ownedProductIds = validator.productIdList(
    "ownedProductIds",
    input.ownedProductIds,
    MAX_OWNED_PRODUCTS,
  );
  const cookingDays = validator.cookingDays("cookingDays", input.cookingDays);

  let maxTotalMinutes: number | undefined;
  if (input.maxTotalMinutes !== undefined && input.maxTotalMinutes !== null) {
    maxTotalMinutes = validator.integer("maxTotalMinutes", input.maxTotalMinutes, {
      min: MIN_TOTAL_MINUTES,
      max: MAX_TOTAL_MINUTES,
    });
  }

  const retailerId = validator.identity("retailerId", input.retailerId);

  const cuisinePreferences = validator.freeTextList(
    "cuisinePreferences",
    input.cuisinePreferences,
  );
  const dislikedIngredients = validator.freeTextList(
    "dislikedIngredients",
    input.dislikedIngredients,
  );

  // Regeneration sends a new seed rather than hoping for a different answer:
  // the engine is deterministic, so the same seed must give the same week.
  const variationSeed =
    input.variationSeed === undefined
      ? 0
      : validator.integer("variationSeed", input.variationSeed, {
          min: 0,
          max: 2_147_483_647,
        });

  const storeId = validator.identity("storeId", input.storeId);

  if (validator.issues.length > 0) {
    throw ApiError.badRequest(
      "The meal plan request is not valid.",
      validator.issues,
      "INVALID_MEAL_PLAN_REQUEST",
    );
  }

  return {
    budgetPence,
    householdSize,
    mealsPerDay,
    mealPreferences,
    cuisinePreferences,
    appliances,
    allergies,
    dislikedIngredients,
    pantryBasics,
    variationSeed,
    budgetTargetPercent,
    mustHaveProductIds,
    ownedProductIds,
    cookingDays,
    ...(maxTotalMinutes === undefined ? {} : { maxTotalMinutes }),
    ...(retailerId ? { retailerId } : {}),
    ...(storeId ? { storeId } : {}),
  };
}
