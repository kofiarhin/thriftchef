/**
 * The client reads its contract straight from the server's type module rather
 * than keeping a parallel copy. These are type-only imports, erased at build
 * time, so no server code is bundled — but a change to the API shape breaks
 * the client typecheck instead of breaking a user's plan at runtime.
 */
export type {
  Allergen,
  Appliance,
  BudgetStatus,
  MealPlanDay,
  MealPlanMeal,
  MealPlanRequest,
  MealPlanResponse,
  MealPreference,
  MealType,
  ProductCoverage,
  Recipe,
  RecipeIngredient,
  ShoppingListGroup,
  ShoppingListItem,
} from "../../../server/mealPlanning/mealPlanTypes";

export {
  APPLIANCES,
  COOKING_APPLIANCES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  UK_ALLERGENS,
} from "../../../server/mealPlanning/mealPlanTypes";

export interface CatalogueStatus {
  retailer: string;
  storeId: string;
  availableProducts: number;
  eligibleProducts: number;
  lastCheckedAt: string | null;
  isStale: boolean;
  safetyBreakdown: {
    verified: number;
    inferred: number;
    incomplete: number;
    ambiguous: number;
  };
}

export interface FieldIssue {
  field: string;
  message: string;
}
