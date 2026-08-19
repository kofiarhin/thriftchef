/**
 * The vocabulary shared by request validation, product selection, the AI
 * prompt, the validator and the frontend. Every enum is exported as a runtime
 * array so validation and the UI read from the same source as the types.
 */

import type { IngredientRole } from "./ingredientRoles";

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

/**
 * How much of the maximum budget a plan should aim to use. Presented to the
 * user as Tight / Balanced / Use my budget. A preset is a soft target: the
 * plan is preferred near it, but the maximum is what is actually enforced.
 */
export const BUDGET_TARGET_PERCENTS = [50, 65, 80] as const;
export type BudgetTargetPercent = (typeof BUDGET_TARGET_PERCENTS)[number];

export const DEFAULT_BUDGET_TARGET_PERCENT: BudgetTargetPercent = 80;

/** The most must-have products one plan may be pinned to. */
export const MAX_MUST_HAVE_PRODUCTS = 12;

/** The resolved spending shape of one request, in pence. */
export interface BudgetTarget {
  percent: BudgetTargetPercent;
  targetPence: number;
  lowerPreferredPence: number;
  upperPreferredPence: number;
  /** The weekly budget. Never exceeded, whatever the target says. */
  hardMaximumPence: number;
}

export interface BudgetUtilization {
  targetPercent: BudgetTargetPercent;
  targetPence: number;
  actualPence: number;
  actualPercent: number;
  withinPreferredRange: boolean;
}

/** Where in the week a must-have product was actually used. */
export interface MustHaveUsage {
  productId: string;
  productName: string;
  usedIn: Array<{ day: number; mealType: MealType; recipeId: string }>;
}

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
  /**
   * Chooses between equally valid weeks. Identical request, catalogue, engine
   * version and seed always produce an identical plan; "Regenerate" increments
   * it rather than relying on a model's randomness.
   */
  variationSeed: number;
  storeId?: string;
  /** How much of `budgetPence` the plan should aim to use. */
  budgetTargetPercent: BudgetTargetPercent;
  /**
   * Catalogue products the user has decided to buy this week. Hard
   * constraints: every one of them must be bought and used by a recipe.
   */
  mustHaveProductIds: string[];
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
  budgetUtilization: BudgetUtilization;
  mustHaveUsage: MustHaveUsage[];
}

/**
 * The untrusted plan shape a planner emits, before validation and pricing.
 * Declared here rather than beside any one planner so the engine, the
 * validator and the tests share a single definition.
 */
export interface GeneratedIngredient {
  productId: string;
  quantity: string;
  packages: number;
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  mealType: MealType;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  appliances: Appliance[];
  ingredients: GeneratedIngredient[];
  pantryItems: PantryBasic[];
  steps: string[];
}

export interface GeneratedPlan {
  days: Array<{ day: number; meals: Array<{ mealType: MealType; recipeId: string }> }>;
  recipes: GeneratedRecipe[];
}

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
  /**
   * Culinary roles, computed once during selection. Recipe slots are filled by
   * role, so carrying them here keeps the classifier off the search's hot path.
   */
  roles: IngredientRole[];
}

/* ------------------------------------------------------------------ engine */

/** Weighted soft-score components. Diagnostics only; never sent to a client. */
export interface ScoreBreakdown {
  budgetFit: number;
  ingredientReuse: number;
  recipeVariety: number;
  preferenceMatch: number;
  cuisineMatch: number;
  practicality: number;
  foodGroupBalance: number;
}

export interface EngineDiagnostics {
  engineVersion: string;
  durationMs: number;
  recipesConsidered: number;
  candidatesGenerated: number;
  candidatesValid: number;
  selectedScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface EngineResult {
  plan: GeneratedPlan;
  diagnostics: EngineDiagnostics;
}

export interface GenerateEngineInput {
  request: MealPlanRequest;
  products: SelectableProduct[];
  variationSeed: number;
}

export interface ReplaceMealEngineInput {
  request: MealPlanRequest;
  currentPlan: GeneratedPlan;
  day: number;
  mealType: MealType;
  products: SelectableProduct[];
  variationSeed: number;
}

/**
 * The single planning collaborator the controller depends on. Generation and
 * replacement are separate operations because they search different spaces,
 * but they share every constraint, template and score.
 */
export interface MealPlanEngine {
  generate(input: GenerateEngineInput): Promise<EngineResult>;
  replaceMeal(input: ReplaceMealEngineInput): Promise<EngineResult>;
}
