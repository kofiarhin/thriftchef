import { classifyFoodGroup, type FoodGroup } from "./productCategories";
import {
  PLAN_DAYS,
  type Appliance,
  type MealPlanRequest,
  type MealType,
  type PantryBasic,
  type SelectableProduct,
} from "./mealPlanTypes";

/**
 * A deterministic planner used for local development, tests, and as the
 * fallback when no AI credentials are configured.
 *
 * It emits the same untrusted shape the NVIDIA client returns and is fed
 * through the same validator, so exercising the mock exercises the real
 * validation, pricing and consolidation path.
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

interface Template {
  mealType: MealType;
  title: string;
  /** Empty means the recipe needs no appliance and is always available. */
  appliances: Appliance[];
  prepMinutes: number;
  cookMinutes: number;
  /** Food groups in the order they should be filled, with pack fractions. */
  components: Array<{ group: FoodGroup; packages: number }>;
  steps: string[];
}

const TEMPLATES: Template[] = [
  {
    mealType: "breakfast",
    title: "Porridge with fruit",
    appliances: ["hob"],
    prepMinutes: 5,
    cookMinutes: 5,
    components: [
      { group: "staple", packages: 0.15 },
      { group: "dairy", packages: 0.2 },
      { group: "fruit", packages: 0.2 },
    ],
    steps: [
      "Warm the milk in a pan over a low heat.",
      "Stir in the oats and cook for five minutes until thick.",
      "Top with chopped fruit and serve.",
    ],
  },
  {
    mealType: "breakfast",
    title: "Toast with cheese",
    appliances: ["toaster"],
    prepMinutes: 3,
    cookMinutes: 3,
    components: [
      { group: "bakery", packages: 0.25 },
      { group: "dairy", packages: 0.15 },
    ],
    steps: ["Toast the bread.", "Top with sliced cheese and serve warm."],
  },
  {
    mealType: "breakfast",
    title: "Yogurt and fruit bowl",
    appliances: [],
    prepMinutes: 5,
    cookMinutes: 0,
    components: [
      { group: "dairy", packages: 0.25 },
      { group: "fruit", packages: 0.25 },
    ],
    steps: ["Spoon the yogurt into bowls.", "Top with chopped fruit."],
  },
  {
    mealType: "lunch",
    title: "Filled sandwich",
    appliances: [],
    prepMinutes: 10,
    cookMinutes: 0,
    components: [
      { group: "bakery", packages: 0.3 },
      { group: "protein", packages: 0.25 },
      { group: "vegetable", packages: 0.2 },
    ],
    steps: [
      "Slice the bread and lay out the filling.",
      "Add salad, close the sandwich and cut in half.",
    ],
  },
  {
    mealType: "lunch",
    title: "Vegetable soup with bread",
    appliances: ["hob"],
    prepMinutes: 10,
    cookMinutes: 25,
    components: [
      { group: "vegetable", packages: 0.4 },
      { group: "sauce", packages: 0.1 },
      { group: "bakery", packages: 0.25 },
    ],
    steps: [
      "Soften the chopped vegetables in a large pan.",
      "Add water and simmer for twenty minutes.",
      "Blend or mash to a rough texture and serve with bread.",
    ],
  },
  {
    mealType: "lunch",
    title: "Loaded jacket potato",
    appliances: ["microwave"],
    prepMinutes: 5,
    cookMinutes: 12,
    components: [
      { group: "staple", packages: 0.3 },
      { group: "dairy", packages: 0.15 },
      { group: "vegetable", packages: 0.2 },
    ],
    steps: [
      "Pierce the potatoes and microwave for ten to twelve minutes.",
      "Split open, add the topping and serve.",
    ],
  },
  {
    mealType: "dinner",
    title: "One-pan protein with rice",
    appliances: ["hob"],
    prepMinutes: 10,
    cookMinutes: 25,
    components: [
      { group: "protein", packages: 0.4 },
      { group: "staple", packages: 0.2 },
      { group: "vegetable", packages: 0.3 },
      { group: "sauce", packages: 0.1 },
    ],
    steps: [
      "Brown the protein in a large pan.",
      "Add the vegetables and sauce, then simmer until cooked through.",
      "Cook the rice separately and serve together.",
    ],
  },
  {
    mealType: "dinner",
    title: "Oven traybake",
    appliances: ["oven"],
    prepMinutes: 15,
    cookMinutes: 35,
    components: [
      { group: "protein", packages: 0.4 },
      { group: "vegetable", packages: 0.35 },
      { group: "sauce", packages: 0.1 },
    ],
    steps: [
      "Heat the oven to 200C.",
      "Toss everything together in a roasting tin.",
      "Roast for thirty-five minutes, turning once.",
    ],
  },
  {
    mealType: "dinner",
    title: "Pasta bake",
    appliances: ["oven"],
    prepMinutes: 15,
    cookMinutes: 30,
    components: [
      { group: "staple", packages: 0.3 },
      { group: "sauce", packages: 0.25 },
      { group: "dairy", packages: 0.2 },
      { group: "vegetable", packages: 0.25 },
    ],
    steps: [
      "Cook the pasta until just short of tender.",
      "Mix with the sauce and vegetables in an oven dish.",
      "Top with cheese and bake for twenty-five minutes.",
    ],
  },
  {
    mealType: "dinner",
    title: "Cold plate with bread",
    appliances: [],
    prepMinutes: 15,
    cookMinutes: 0,
    components: [
      { group: "protein", packages: 0.3 },
      { group: "bakery", packages: 0.3 },
      { group: "vegetable", packages: 0.3 },
    ],
    steps: [
      "Slice the protein and vegetables.",
      "Arrange on plates and serve with bread.",
    ],
  },
  {
    mealType: "snack",
    title: "Fruit and yogurt",
    appliances: [],
    prepMinutes: 3,
    cookMinutes: 0,
    components: [
      { group: "fruit", packages: 0.2 },
      { group: "dairy", packages: 0.15 },
    ],
    steps: ["Chop the fruit.", "Serve with a spoonful of yogurt."],
  },
  {
    mealType: "snack",
    title: "Bread and cheese",
    appliances: [],
    prepMinutes: 3,
    cookMinutes: 0,
    components: [
      { group: "bakery", packages: 0.2 },
      { group: "dairy", packages: 0.15 },
    ],
    steps: ["Slice the bread and cheese.", "Serve together."],
  },
];

const RECIPES_PER_MEAL_TYPE = 3;

/**
 * Groups the selection by food group, cheapest first, so recipes reach for the
 * budget option and repeated picks rotate through a small, reusable set.
 */
function indexByGroup(
  products: SelectableProduct[],
): Map<FoodGroup, SelectableProduct[]> {
  const byGroup = new Map<FoodGroup, SelectableProduct[]>();

  for (const product of products) {
    const group = classifyFoodGroup(product.categoryPaths);
    const existing = byGroup.get(group) ?? [];
    existing.push(product);
    byGroup.set(group, existing);
  }

  for (const entries of byGroup.values()) {
    entries.sort(
      (a, b) => a.pricePence - b.pricePence || a.productId.localeCompare(b.productId),
    );
  }

  return byGroup;
}

export function generateMockPlan(
  request: MealPlanRequest,
  products: SelectableProduct[],
): GeneratedPlan {
  if (products.length === 0) {
    throw new Error("generateMockPlan requires at least one product.");
  }

  const byGroup = indexByGroup(products);
  const cheapestFirst = [...products].sort(
    (a, b) => a.pricePence - b.pricePence || a.productId.localeCompare(b.productId),
  );

  /**
   * A catalogue slice may hold no vegetables at all, so a component falls back
   * to the cheapest available product rather than dropping the ingredient and
   * leaving a recipe with nothing in it.
   */
  const pick = (group: FoodGroup, rotation: number): SelectableProduct => {
    const candidates = byGroup.get(group) ?? [];
    const pool = candidates.length > 0 ? candidates : cheapestFirst;
    return pool[rotation % pool.length];
  };

  const recipes: GeneratedRecipe[] = [];
  const recipeIdsByMealType = new Map<MealType, string[]>();

  for (const mealType of request.mealsPerDay) {
    const usable = TEMPLATES.filter(
      (template) =>
        template.mealType === mealType &&
        template.appliances.every((appliance) =>
          request.appliances.includes(appliance),
        ),
    );

    // Every meal type has at least one appliance-free template, so `usable` is
    // never empty even for a no-cook household.
    const chosen = usable.slice(0, RECIPES_PER_MEAL_TYPE);
    const ids: string[] = [];

    chosen.forEach((template, templateIndex) => {
      const id = `${mealType}-${templateIndex + 1}`;
      const seen = new Set<string>();
      const ingredients: GeneratedIngredient[] = [];

      template.components.forEach((component, componentIndex) => {
        const product = pick(component.group, templateIndex + componentIndex);
        if (seen.has(product.productId)) return;
        seen.add(product.productId);

        ingredients.push({
          productId: product.productId,
          quantity: product.packageSize
            ? `${Math.round(component.packages * 100)}% of ${product.packageSize}`
            : "1 pack",
          packages: component.packages,
        });
      });

      recipes.push({
        id,
        title: template.title,
        mealType,
        servings: request.householdSize,
        prepMinutes: template.prepMinutes,
        cookMinutes: template.cookMinutes,
        appliances: template.appliances,
        ingredients,
        pantryItems: [],
        steps: template.steps,
      });
      ids.push(id);
    });

    recipeIdsByMealType.set(mealType, ids);
  }

  const days = Array.from({ length: PLAN_DAYS }, (_, dayIndex) => ({
    day: dayIndex + 1,
    meals: request.mealsPerDay.map((mealType) => {
      const ids = recipeIdsByMealType.get(mealType) ?? [];
      return { mealType, recipeId: ids[dayIndex % ids.length] };
    }),
  }));

  return { days, recipes };
}
