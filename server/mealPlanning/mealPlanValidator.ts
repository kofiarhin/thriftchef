import { ApiError } from "../http/errors";
import {
  consolidateShoppingList,
  type ProductUsage,
} from "./shoppingList";
import {
  PLAN_DAYS,
  type Appliance,
  type BudgetStatus,
  type MealPlanDay,
  type MealPlanRequest,
  type MealType,
  type Recipe,
  type RecipeIngredient,
  type SelectableProduct,
  type ShoppingListGroup,
} from "./mealPlanTypes";

/**
 * Bounds on generator output. A plan larger than this is not a plan; the caps
 * stop a malformed or hostile response from consuming the request.
 */
const LIMITS = {
  recipes: 60,
  ingredientsPerRecipe: 25,
  steps: 40,
  titleLength: 160,
  stepLength: 600,
  packagesPerIngredient: 20,
  minutes: 600,
  servings: 20,
};

/** Machine-readable cause, safe to return: it never contains generator text. */
export type PlanRejectionReason =
  | "INVALID_JSON"
  | "NOT_AN_OBJECT"
  | "MISSING_RECIPES"
  | "MISSING_DAYS"
  | "TOO_MANY_RECIPES"
  | "INVALID_RECIPE"
  | "DUPLICATE_RECIPE_ID"
  | "WRONG_DAY_COUNT"
  | "INVALID_DAY_NUMBER"
  | "UNREQUESTED_MEAL_TYPE"
  | "MISSING_MEAL"
  | "UNKNOWN_RECIPE"
  | "MEAL_TYPE_MISMATCH"
  | "UNKNOWN_PRODUCT"
  | "ALLERGY_CONFLICT"
  | "UNAVAILABLE_APPLIANCE"
  | "NO_PRODUCTS_USED";

export interface PlanValidationContext {
  request: MealPlanRequest;
  products: Map<string, SelectableProduct>;
}

export interface PricedPlan {
  days: MealPlanDay[];
  recipes: Recipe[];
  shoppingList: ShoppingListGroup[];
  estimatedTotalPence: number;
  budgetStatus: BudgetStatus;
  assumptions: string[];
  productsUsed: number;
}

/**
 * A plan failed validation. The same validator guards two very different
 * callers, so the caller decides what the failure means: engine output that
 * fails is an internal defect (500), while a plan the client submitted for
 * replacement is simply a bad request (400). The default below is the safe one
 * for an unhandled escape — never blame the user for the planner's mistake.
 */
export class PlanRejectedError extends ApiError {
  constructor(readonly reason: PlanRejectionReason, message: string) {
    super(500, "PLANNER_INTERNAL_ERROR", message, { reason });
    this.name = "PlanRejectedError";
  }
}

function reject(reason: PlanRejectionReason, message: string): never {
  throw new PlanRejectedError(reason, message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

function boundedInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

interface ParsedIngredient {
  productId: string;
  quantity: string;
  packages: number;
  /** True when the generator gave no usable pack count and one was assumed. */
  assumed: boolean;
}

function parseIngredient(
  raw: unknown,
  context: PlanValidationContext,
): ParsedIngredient {
  if (!isRecord(raw)) reject("INVALID_RECIPE", "A recipe ingredient was not an object.");

  const productId = typeof raw.productId === "string" ? raw.productId.trim() : "";
  const product = context.products.get(productId);

  // The single most important check: a plan may only shop from the products
  // this request already filtered and approved.
  if (!product) {
    reject(
      "UNKNOWN_PRODUCT",
      "The generated plan referenced a product that is not in the Aldi selection for this request.",
    );
  }

  if (
    product.allergens.some((allergen) =>
      (context.request.allergies as string[]).includes(allergen),
    )
  ) {
    reject(
      "ALLERGY_CONFLICT",
      "The generated plan used a product that conflicts with a declared allergy.",
    );
  }

  const rawPackages = raw.packages;
  const hasUsablePackages =
    typeof rawPackages === "number" &&
    Number.isFinite(rawPackages) &&
    rawPackages > 0;

  // Rounding up rather than down: an assumed quantity may overstate the
  // basket, never understate it, so the budget figure stays a promise.
  const packages = hasUsablePackages
    ? Math.min(LIMITS.packagesPerIngredient, Number(rawPackages.toFixed(2)))
    : 1;

  return {
    productId,
    quantity: text(raw.quantity, 80) ?? (product.packageSize ?? "1 pack"),
    packages,
    assumed: !hasUsablePackages,
  };
}

function parseRecipe(
  raw: unknown,
  context: PlanValidationContext,
): { recipe: Omit<Recipe, "ingredients">; ingredients: ParsedIngredient[] } {
  if (!isRecord(raw)) reject("INVALID_RECIPE", "A recipe was not an object.");

  const id = text(raw.id, 80);
  const title = text(raw.title, LIMITS.titleLength);
  const mealType = raw.mealType as MealType;

  if (!id || !title) reject("INVALID_RECIPE", "A recipe was missing an id or title.");

  if (!context.request.mealsPerDay.includes(mealType)) {
    reject(
      "UNREQUESTED_MEAL_TYPE",
      "The generated plan included a meal type that was not requested.",
    );
  }

  const appliances = Array.isArray(raw.appliances) ? raw.appliances : [];
  for (const appliance of appliances) {
    if (!context.request.appliances.includes(appliance as Appliance)) {
      reject(
        "UNAVAILABLE_APPLIANCE",
        "The generated plan required a cooking appliance this household does not have.",
      );
    }
  }

  const rawIngredients = Array.isArray(raw.ingredients) ? raw.ingredients : [];
  if (
    rawIngredients.length === 0 ||
    rawIngredients.length > LIMITS.ingredientsPerRecipe
  ) {
    reject("INVALID_RECIPE", "A recipe had no usable ingredient list.");
  }

  const rawSteps = Array.isArray(raw.steps) ? raw.steps : [];
  const steps = rawSteps
    .map((step) => text(step, LIMITS.stepLength))
    .filter((step): step is string => step !== null)
    .slice(0, LIMITS.steps);

  if (steps.length === 0) reject("INVALID_RECIPE", "A recipe had no usable steps.");

  const ingredients = rawIngredients.map((ingredient) =>
    parseIngredient(ingredient, context),
  );
  const rawPantryItems = Array.isArray(raw.pantryItems) ? raw.pantryItems : [];

  return {
    recipe: {
      id,
      title,
      mealType,
      servings: boundedInteger(
        raw.servings,
        1,
        LIMITS.servings,
        context.request.householdSize,
      ),
      prepMinutes: boundedInteger(raw.prepMinutes, 0, LIMITS.minutes, 0),
      cookMinutes: boundedInteger(raw.cookMinutes, 0, LIMITS.minutes, 0),
      appliances: appliances as Appliance[],
      pantryItems: context.request.pantryBasics.filter((item) =>
        rawPantryItems.includes(item),
      ),
      steps,
      allergenWarnings: [],
      productIds: [],
    },
    ingredients,
  };
}

/**
 * Validates untrusted generator output against the request and the approved
 * product set, then prices it entirely from catalogue records.
 *
 * Nothing the generator says about money is trusted or carried through, and
 * rejection details are machine-readable codes so no generated text can be
 * reflected back to the client.
 */
export function validateAndPricePlan(
  raw: unknown,
  context: PlanValidationContext,
): PricedPlan {
  if (!isRecord(raw)) reject("NOT_AN_OBJECT", "The generated plan was not a JSON object.");
  if (!Array.isArray(raw.recipes)) reject("MISSING_RECIPES", "The generated plan had no recipes.");
  if (!Array.isArray(raw.days)) reject("MISSING_DAYS", "The generated plan had no days.");
  if (raw.recipes.length === 0 || raw.recipes.length > LIMITS.recipes) {
    reject("TOO_MANY_RECIPES", "The generated plan had an unusable number of recipes.");
  }

  const parsed = raw.recipes.map((recipe) => parseRecipe(recipe, context));

  const byId = new Map<string, (typeof parsed)[number]>();
  for (const entry of parsed) {
    if (byId.has(entry.recipe.id)) {
      reject("DUPLICATE_RECIPE_ID", "The generated plan reused a recipe id.");
    }
    byId.set(entry.recipe.id, entry);
  }

  if (raw.days.length !== PLAN_DAYS) {
    reject("WRONG_DAY_COUNT", `The generated plan must cover exactly ${PLAN_DAYS} days.`);
  }

  const seenDays = new Set<number>();
  const usageCounts = new Map<string, number>();
  const days: MealPlanDay[] = [];

  for (const rawDay of raw.days) {
    if (!isRecord(rawDay)) reject("INVALID_DAY_NUMBER", "A day entry was not an object.");

    const day = rawDay.day;
    if (
      typeof day !== "number" ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > PLAN_DAYS ||
      seenDays.has(day)
    ) {
      reject("INVALID_DAY_NUMBER", "The generated plan had a duplicate or invalid day number.");
    }
    seenDays.add(day);

    const rawMeals = Array.isArray(rawDay.meals) ? rawDay.meals : [];
    const mealTypesSeen = new Set<MealType>();
    const meals = [];

    for (const rawMeal of rawMeals) {
      if (!isRecord(rawMeal)) reject("MISSING_MEAL", "A meal entry was not an object.");

      const mealType = rawMeal.mealType as MealType;
      if (!context.request.mealsPerDay.includes(mealType)) {
        reject(
          "UNREQUESTED_MEAL_TYPE",
          "The generated plan included a meal type that was not requested.",
        );
      }

      const recipeId = typeof rawMeal.recipeId === "string" ? rawMeal.recipeId.trim() : "";
      const entry = byId.get(recipeId);
      if (!entry) {
        reject("UNKNOWN_RECIPE", "A meal referenced a recipe that the plan does not define.");
      }

      if (entry.recipe.mealType !== mealType) {
        reject(
          "MEAL_TYPE_MISMATCH",
          "A meal was filled with a recipe intended for a different meal type.",
        );
      }

      mealTypesSeen.add(mealType);
      usageCounts.set(recipeId, (usageCounts.get(recipeId) ?? 0) + 1);
      meals.push({ mealType, recipeId, entry });
    }

    for (const mealType of context.request.mealsPerDay) {
      if (!mealTypesSeen.has(mealType)) {
        reject("MISSING_MEAL", `Day ${day} was missing the requested ${mealType}.`);
      }
    }

    days.push({ day, meals: [] });
  }

  // Weekly demand: a recipe cooked three times needs three times its packs,
  // but the shopping list still merges them into whole packages once.
  const usages: ProductUsage[] = [];
  for (const [recipeId, count] of usageCounts) {
    const entry = byId.get(recipeId);
    if (!entry) continue;

    for (const ingredient of entry.ingredients) {
      usages.push({
        productId: ingredient.productId,
        packages: ingredient.packages * count,
      });
    }
  }

  const shoppingList = consolidateShoppingList(usages, context.products);
  if (shoppingList.groups.length === 0) {
    reject("NO_PRODUCTS_USED", "The generated plan did not use any Aldi products.");
  }

  const assumptions: string[] = [];
  if (parsed.some((entry) => entry.ingredients.some((item) => item.assumed))) {
    assumptions.push(
      "Some ingredients did not specify how much of a pack they use, so a whole pack was budgeted for each.",
    );
  }

  const recipes: Recipe[] = parsed.map(({ recipe, ingredients }) => {
    const pricedIngredients: RecipeIngredient[] = ingredients.map((ingredient) => {
      const product = context.products.get(ingredient.productId);
      return {
        productId: ingredient.productId,
        name: product?.name ?? ingredient.productId,
        quantity: ingredient.quantity,
        estimatedCostPence: Math.round((product?.pricePence ?? 0) * ingredient.packages),
        packages: ingredient.packages,
        imageUrl: product?.imageUrl ?? null,
      };
    });

    const allergenWarnings = [
      ...new Set(
        ingredients.flatMap(
          (ingredient) => context.products.get(ingredient.productId)?.allergens ?? [],
        ),
      ),
    ].sort();

    return {
      ...recipe,
      ingredients: pricedIngredients,
      allergenWarnings,
      productIds: [...new Set(ingredients.map((item) => item.productId))],
    };
  });

  const costByRecipeId = new Map(
    recipes.map((recipe) => [
      recipe.id,
      recipe.ingredients.reduce((total, item) => total + item.estimatedCostPence, 0),
    ]),
  );

  const orderedDays = days
    .sort((a, b) => a.day - b.day)
    .map((day) => {
      const source = (raw.days as Array<Record<string, unknown>>).find(
        (candidate) => candidate.day === day.day,
      );
      const rawMeals = Array.isArray(source?.meals) ? source.meals : [];

      return {
        day: day.day,
        meals: (rawMeals as Array<Record<string, unknown>>).map((rawMeal) => {
          const recipeId = String(rawMeal.recipeId).trim();
          const recipe = recipes.find((candidate) => candidate.id === recipeId);

          return {
            mealType: rawMeal.mealType as MealType,
            recipeId,
            title: recipe?.title ?? recipeId,
            servings: recipe?.servings ?? context.request.householdSize,
            estimatedCostPence: costByRecipeId.get(recipeId) ?? 0,
          };
        }),
      };
    });

  return {
    days: orderedDays,
    recipes,
    shoppingList: shoppingList.groups,
    estimatedTotalPence: shoppingList.totalPence,
    budgetStatus:
      shoppingList.totalPence <= context.request.budgetPence
        ? "within-budget"
        : "over-budget",
    assumptions,
    productsUsed: new Set(usages.map((usage) => usage.productId)).size,
  };
}
