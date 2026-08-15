import { ApiError } from "../http/errors";
import {
  APPLIANCES,
  COOKING_APPLIANCES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  PANTRY_BASICS,
  UK_ALLERGENS,
  type Allergen,
  type Appliance,
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
  "storeId",
]);

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

  const cuisinePreferences = validator.freeTextList(
    "cuisinePreferences",
    input.cuisinePreferences,
  );
  const dislikedIngredients = validator.freeTextList(
    "dislikedIngredients",
    input.dislikedIngredients,
  );

  let storeId: string | undefined;
  if (input.storeId !== undefined) {
    if (typeof input.storeId !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(input.storeId.trim().toLowerCase())) {
      validator.add("storeId", "storeId must be a lowercase slug of up to 64 characters.");
    } else {
      storeId = input.storeId.trim().toLowerCase();
    }
  }

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
    ...(storeId ? { storeId } : {}),
  };
}
