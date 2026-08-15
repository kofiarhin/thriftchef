/**
 * The vocabulary shared by request validation, product selection, the AI
 * prompt, the validator and the frontend. Every enum is exported as a runtime
 * array so validation and the UI read from the same source as the types.
 */

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_PREFERENCES = [
  "quick",
  "family-friendly",
  "high-protein",
  "vegetarian",
  "low-waste",
  "batch-cook",
] as const;
export type MealPreference = (typeof MEAL_PREFERENCES)[number];

export const APPLIANCES = [
  "hob",
  "oven",
  "microwave",
  "air-fryer",
  "slow-cooker",
  "toaster",
  "kettle",
  "blender",
] as const;
export type Appliance = (typeof APPLIANCES)[number];

/**
 * A blender chops and a kettle boils water, but neither cooks a meal. An empty
 * appliance list is legal and means the plan must be no-cook.
 */
export const COOKING_APPLIANCES: Appliance[] = [
  "hob",
  "oven",
  "microwave",
  "air-fryer",
  "slow-cooker",
  "toaster",
];

/** The 14 allergens UK food law requires to be declared. */
export const UK_ALLERGENS = [
  "celery",
  "crustaceans",
  "eggs",
  "fish",
  "gluten",
  "lupin",
  "milk",
  "molluscs",
  "mustard",
  "peanuts",
  "sesame",
  "soya",
  "sulphites",
  "tree nuts",
] as const;
export type Allergen = (typeof UK_ALLERGENS)[number];

export const PANTRY_BASICS = [
  "salt",
  "pepper",
  "cooking oil",
  "basic herbs and spices",
  "stock cubes",
] as const;
export type PantryBasic = (typeof PANTRY_BASICS)[number];

export const PLAN_DAYS = 7;

export interface MealPlanRequest {
  budgetPence: number;
  householdSize: number;
  mealsPerDay: MealType[];
  mealPreferences: MealPreference[];
  cuisinePreferences: string[];
  appliances: Appliance[];
  allergies: Allergen[];
  dislikedIngredients: string[];
  pantryBasics: PantryBasic[];
  storeId?: string;
}

export type BudgetStatus =
  | "within-budget"
  | "over-budget"
  | "insufficient-products";

export interface MealPlanMeal {
  mealType: MealType;
  recipeId: string;
  title: string;
  servings: number;
  estimatedCostPence: number;
}

export interface MealPlanDay {
  day: number;
  meals: MealPlanMeal[];
}

export interface RecipeIngredient {
  productId: string;
  name: string;
  quantity: string;
  estimatedCostPence: number;
  /** Fraction of a retail pack consumed by this recipe. */
  packages: number;
  imageUrl: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  mealType: MealType;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  appliances: Appliance[];
  ingredients: RecipeIngredient[];
  pantryItems: PantryBasic[];
  steps: string[];
  allergenWarnings: string[];
  productIds: string[];
}

export interface ShoppingListItem {
  productId: string;
  name: string;
  brand: string | null;
  packageSize: string | null;
  quantity: number;
  unitPricePence: number;
  totalPricePence: number;
  productUrl: string;
  imageUrl: string | null;
}

export interface ShoppingListGroup {
  category: string;
  items: ShoppingListItem[];
}

export interface ProductCoverage {
  productsConsidered: number;
  productsUsed: number;
  excludedForAllergies: number;
  excludedForSafety: number;
}

export interface MealPlanResponse {
  planId: string;
  generatedAt: string;
  currency: "GBP";
  budgetPence: number;
  estimatedTotalPence: number;
  budgetStatus: BudgetStatus;
  assumptions: string[];
  warnings: string[];
  days: MealPlanDay[];
  recipes: Recipe[];
  shoppingList: ShoppingListGroup[];
  productCoverage: ProductCoverage;
}

export interface PlanGeneratorInput {
  request: MealPlanRequest;
  products: SelectableProduct[];
  /** Present on the second attempt, describing why the first was unusable. */
  retry?: { reason: string; previousTotalPence?: number };
  replacement?: {
    day: number;
    mealType: MealType;
    currentPlan: { days: MealPlanDay[]; recipes: Recipe[] };
  };
}

/**
 * Returns untrusted plan output. Mock and live generators share this contract
 * so both are validated by exactly the same code path.
 */
export type PlanGenerator = (input: PlanGeneratorInput) => Promise<unknown>;

/**
 * The projection every planner works from. Deliberately narrower than
 * `ProductRecord`: crawl metadata and raw label text have no place in
 * planning, pricing or the AI prompt.
 */
export interface SelectableProduct {
  productId: string;
  name: string;
  brand: string | null;
  category: string;
  categoryPaths: string[][];
  pricePence: number;
  packageSize: string | null;
  allergens: string[];
  dietaryInfo: string | null;
  safetyStatus: "verified" | "inferred";
  productUrl: string;
  imageUrl?: string | null;
  lastSeenAt: Date;
}
