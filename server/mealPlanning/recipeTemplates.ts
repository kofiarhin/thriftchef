/**
 * Curated recipe templates: the replacement for `mockPlanner.ts`'s food-group
 * components, which filled a missing group with "the cheapest product left" and
 * could therefore serve pâté for breakfast.
 *
 * A template describes the *shape* of a dish — which culinary roles it needs,
 * how much of each at a base serving count, and how to describe the result. The
 * planner fills the slots from real catalogue products. A required slot with no
 * accepted-role product available discards the whole template; nothing is ever
 * substituted across roles.
 *
 * Template content is data, not search breadth: adding templates widens the
 * menu without loosening any bound on the search.
 */

import type { IngredientRole } from "./ingredientRoles";
import {
  APPLIANCES,
  MEAL_TYPES,
  PANTRY_BASICS,
  type Appliance,
  type MealPreference,
  type MealType,
  type PantryBasic,
} from "./mealPlanTypes";

export interface IngredientSlot {
  /** Referenced from `titlePattern` and instructions as `{key}`. */
  key: string;
  acceptedRoles: IngredientRole[];
  required: boolean;
  /** Packs consumed at `baseServings`; scaled to the household by the planner. */
  packagesAtBaseServings: number;
  /** How many distinct products may be considered for this slot. */
  maxChoices: number;
}

export interface InstructionTemplate {
  /**
   * A step, with `{slotKey}` tokens replaced by the chosen product's display
   * name. A step whose token refers to an unfilled optional slot is dropped, so
   * an omitted ingredient never leaves a dangling instruction.
   */
  text: string;
}

export interface RecipeTemplate {
  id: string;
  mealType: MealType;
  titlePattern: string;
  cuisineTags: string[];
  preferenceTags: MealPreference[];
  requiredAppliances: Appliance[];
  pantryItems: PantryBasic[];
  prepMinutes: number;
  cookMinutes: number;
  baseServings: number;
  slots: IngredientSlot[];
  instructions: InstructionTemplate[];
}

const TOKEN = /\{([a-zA-Z0-9_]+)\}/g;

export function tokensIn(pattern: string): string[] {
  return [...pattern.matchAll(TOKEN)].map((match) => match[1]);
}

/**
 * Static checks run over the shipped library in a test rather than at runtime:
 * a malformed template is an authoring mistake to catch before release, not a
 * condition to handle on a request.
 */
export function validateTemplate(template: RecipeTemplate): string[] {
  const problems: string[] = [];

  if (!template.id.trim()) problems.push("id must not be empty");
  if (!MEAL_TYPES.includes(template.mealType)) {
    problems.push(`mealType ${template.mealType} is not a requestable meal type`);
  }
  if (!template.titlePattern.trim()) problems.push("titlePattern must not be empty");
  if (template.instructions.length === 0) problems.push("instructions must not be empty");
  if (!Number.isInteger(template.baseServings) || template.baseServings < 1) {
    problems.push("baseServings must be a whole number of servings, at least 1");
  }
  if (template.prepMinutes < 0 || template.cookMinutes < 0) {
    problems.push("prepMinutes and cookMinutes must not be negative");
  }

  for (const appliance of template.requiredAppliances) {
    if (!APPLIANCES.includes(appliance)) {
      problems.push(`requiredAppliances contains unknown appliance ${appliance}`);
    }
  }

  for (const item of template.pantryItems) {
    if (!PANTRY_BASICS.includes(item)) {
      problems.push(`pantryItems contains ${item}, which the request schema rejects`);
    }
  }

  const keys = new Set<string>();
  const requiredKeys = new Set<string>();

  for (const slot of template.slots) {
    if (keys.has(slot.key)) problems.push(`duplicate slot key ${slot.key}`);
    keys.add(slot.key);
    if (slot.required) requiredKeys.add(slot.key);

    if (slot.acceptedRoles.length === 0) {
      problems.push(`slot ${slot.key} accepts no role, so nothing can fill it`);
    }
    if (slot.acceptedRoles.includes("unknown")) {
      problems.push(`slot ${slot.key} accepts unknown products`);
    }
    if (!(slot.packagesAtBaseServings > 0)) {
      problems.push(`slot ${slot.key} must consume a positive number of packages`);
    }
    if (!Number.isInteger(slot.maxChoices) || slot.maxChoices < 1) {
      problems.push(`slot ${slot.key} must allow at least one choice (maxChoices)`);
    }
  }

  if (requiredKeys.size === 0) {
    problems.push("a template must declare at least one required slot");
  }

  // A title is rendered before anything optional is known to be present, so a
  // title token pointing at an optional slot would leave a hole in the name.
  for (const token of tokensIn(template.titlePattern)) {
    if (!keys.has(token)) {
      problems.push(`titlePattern references unknown slot {${token}}`);
    } else if (!requiredKeys.has(token)) {
      problems.push(`titlePattern references optional slot {${token}}`);
    }
  }

  for (const instruction of template.instructions) {
    for (const token of tokensIn(instruction.text)) {
      if (!keys.has(token)) {
        problems.push(`instruction references unknown slot {${token}}`);
      }
    }
  }

  return problems;
}

/** Roles that can carry a meal's main protein, used by several templates. */
const MAIN_PROTEIN: IngredientRole[] = [
  "poultry",
  "red_meat",
  "fish",
  "plant_protein",
  "cheese",
];

function slot(
  key: string,
  acceptedRoles: IngredientRole[],
  packagesAtBaseServings: number,
  options: { required?: boolean; maxChoices?: number } = {},
): IngredientSlot {
  return {
    key,
    acceptedRoles,
    required: options.required ?? true,
    packagesAtBaseServings,
    maxChoices: options.maxChoices ?? 3,
  };
}

function steps(...text: string[]): InstructionTemplate[] {
  return text.map((entry) => ({ text: entry }));
}

const BREAKFAST: RecipeTemplate[] = [
  {
    id: "breakfast-porridge",
    mealType: "breakfast",
    titlePattern: "Creamy {cereal} porridge",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick", "low-waste"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt"],
    prepMinutes: 2,
    cookMinutes: 6,
    baseServings: 2,
    slots: [
      slot("cereal", ["breakfast_cereal"], 0.15),
      slot("milk", ["milk"], 0.2),
      slot("fruit", ["fruit"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Warm the {milk} in a pan over a low heat.",
      "Stir in the {cereal} and cook for five minutes until thick, adding a pinch of salt.",
      "Top with chopped {fruit} and serve.",
    ),
  },
  {
    id: "breakfast-cereal-bowl",
    mealType: "breakfast",
    titlePattern: "{cereal} with cold milk",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 3,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("cereal", ["breakfast_cereal"], 0.12),
      slot("milk", ["milk"], 0.2),
      slot("fruit", ["fruit"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Divide the {cereal} between bowls.",
      "Pour over the {milk}.",
      "Scatter over sliced {fruit}.",
    ),
  },
  {
    id: "breakfast-yogurt-fruit-bowl",
    mealType: "breakfast",
    titlePattern: "{yogurt} and {fruit} bowl",
    cuisineTags: ["mediterranean"],
    preferenceTags: ["vegetarian", "quick", "high-protein"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 5,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("yogurt", ["yogurt"], 0.25),
      slot("fruit", ["fruit"], 0.25),
      slot("topping", ["snack", "breakfast_cereal"], 0.1, { required: false }),
    ],
    instructions: steps(
      "Spoon the {yogurt} into bowls.",
      "Chop the {fruit} and pile it on top.",
      "Finish with a scattering of {topping}.",
    ),
  },
  {
    id: "breakfast-scrambled-eggs-on-toast",
    mealType: "breakfast",
    titlePattern: "Scrambled {egg} on {bread}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "high-protein", "quick"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 3,
    cookMinutes: 7,
    baseServings: 2,
    slots: [
      slot("egg", ["egg"], 0.35),
      slot("bread", ["bread"], 0.25),
      slot("cheese", ["cheese"], 0.1, { required: false }),
    ],
    instructions: steps(
      "Beat the {egg} with a pinch of salt and pepper.",
      "Cook gently in an oiled pan, stirring, until just set.",
      "Toast the {bread} and pile the eggs on top.",
      "Grate over a little {cheese}.",
    ),
  },
  {
    id: "breakfast-cheese-on-toast",
    mealType: "breakfast",
    titlePattern: "{cheese} on toasted {bread}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: ["toaster"],
    pantryItems: ["pepper"],
    prepMinutes: 3,
    cookMinutes: 4,
    baseServings: 2,
    slots: [
      slot("bread", ["bread"], 0.25),
      slot("cheese", ["cheese"], 0.15),
      slot("vegetable", ["other_vegetable"], 0.1, { required: false }),
    ],
    instructions: steps(
      "Toast the {bread} until golden.",
      "Lay slices of {cheese} over the hot toast so it softens.",
      "Top with sliced {vegetable} and a grind of pepper.",
    ),
  },
  {
    id: "breakfast-cooked-breakfast",
    mealType: "breakfast",
    titlePattern: "Cooked breakfast with {meat}",
    cuisineTags: ["british"],
    preferenceTags: ["high-protein", "family-friendly"],
    requiredAppliances: ["hob"],
    pantryItems: ["cooking oil", "salt", "pepper"],
    prepMinutes: 5,
    cookMinutes: 15,
    baseServings: 2,
    slots: [
      slot("meat", ["red_meat"], 0.4),
      slot("egg", ["egg"], 0.25),
      slot("vegetable", ["other_vegetable"], 0.2, { required: false }),
      slot("bread", ["bread"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Fry the {meat} in a little oil until cooked through.",
      "Add the halved {vegetable} to the pan and cook until softened.",
      "Fry the {egg} to your liking and season.",
      "Serve with the {bread} alongside.",
    ),
  },
  {
    id: "breakfast-egg-wrap",
    mealType: "breakfast",
    titlePattern: "{egg} breakfast {wrap}",
    cuisineTags: ["american"],
    preferenceTags: ["high-protein", "quick"],
    requiredAppliances: ["hob"],
    pantryItems: ["cooking oil", "pepper"],
    prepMinutes: 5,
    cookMinutes: 6,
    baseServings: 2,
    slots: [
      slot("egg", ["egg"], 0.3),
      slot("wrap", ["wrap"], 0.3),
      slot("greens", ["leafy_vegetable"], 0.15, { required: false }),
      slot("cheese", ["cheese"], 0.1, { required: false }),
    ],
    instructions: steps(
      "Scramble the {egg} in an oiled pan and season with pepper.",
      "Warm the {wrap} briefly in the dry pan.",
      "Fill with the eggs, the {greens} and the {cheese}, then roll up tightly.",
    ),
  },
  {
    id: "breakfast-overnight-oats",
    mealType: "breakfast",
    titlePattern: "Overnight {cereal} with {yogurt}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "batch-cook", "low-waste"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 8,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("cereal", ["breakfast_cereal"], 0.15),
      slot("yogurt", ["yogurt"], 0.25),
      slot("fruit", ["fruit"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Stir the {cereal} into the {yogurt} in a covered container.",
      "Chill overnight so the oats soften.",
      "Top with chopped {fruit} before serving.",
    ),
  },
];

const LUNCH: RecipeTemplate[] = [
  {
    id: "lunch-filled-sandwich",
    mealType: "lunch",
    titlePattern: "{filling} sandwich",
    cuisineTags: ["british"],
    preferenceTags: ["quick", "family-friendly"],
    requiredAppliances: [],
    pantryItems: ["salt", "pepper"],
    prepMinutes: 8,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("bread", ["bread"], 0.3),
      slot("filling", MAIN_PROTEIN, 0.25),
      slot("salad", ["leafy_vegetable", "other_vegetable"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Lay out slices of {bread}.",
      "Add the {filling} and season.",
      "Top with the {salad}, close the sandwich and cut in half.",
    ),
  },
  {
    id: "lunch-cheese-salad-wrap",
    mealType: "lunch",
    titlePattern: "{cheese} and salad {wrap}",
    cuisineTags: ["mediterranean"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: ["pepper"],
    prepMinutes: 8,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("wrap", ["wrap"], 0.3),
      slot("cheese", ["cheese"], 0.2),
      slot("greens", ["leafy_vegetable"], 0.2),
      slot("sauce", ["sauce"], 0.08, { required: false }),
    ],
    instructions: steps(
      "Spread the {wrap} with a little {sauce}.",
      "Add the sliced {cheese} and the {greens}.",
      "Roll up tightly and cut on the diagonal.",
    ),
  },
  {
    id: "lunch-jacket-potato-beans",
    mealType: "lunch",
    titlePattern: "Jacket {potato} with {beans}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "family-friendly", "low-waste"],
    requiredAppliances: ["oven"],
    pantryItems: ["salt", "cooking oil"],
    prepMinutes: 5,
    cookMinutes: 60,
    baseServings: 2,
    slots: [
      slot("potato", ["potato"], 0.35),
      slot("beans", ["plant_protein"], 0.4),
      slot("cheese", ["cheese"], 0.12, { required: false }),
    ],
    instructions: steps(
      "Rub the {potato} with oil and salt, then bake until the skin crisps.",
      "Warm the {beans} through.",
      "Split the potatoes, pile in the beans and grate over the {cheese}.",
    ),
  },
  {
    id: "lunch-vegetable-soup",
    mealType: "lunch",
    titlePattern: "{vegetable} soup with {bread}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "low-waste", "batch-cook"],
    requiredAppliances: ["hob"],
    pantryItems: ["stock cubes", "salt", "pepper", "cooking oil"],
    prepMinutes: 10,
    cookMinutes: 25,
    baseServings: 4,
    slots: [
      slot("vegetable", ["other_vegetable"], 0.6),
      slot("bread", ["bread"], 0.4),
      slot("greens", ["leafy_vegetable"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Chop the {vegetable} and soften in a little oil.",
      "Cover with stock, simmer until tender, then stir in the {greens}.",
      "Blend or mash to the texture you like and season.",
      "Serve with the {bread}.",
    ),
  },
  {
    id: "lunch-tuna-pasta-salad",
    mealType: "lunch",
    titlePattern: "{fish} {pasta} salad",
    cuisineTags: ["italian"],
    preferenceTags: ["high-protein", "batch-cook"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper"],
    prepMinutes: 8,
    cookMinutes: 12,
    baseServings: 4,
    slots: [
      slot("pasta", ["pasta"], 0.4),
      slot("fish", ["fish"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.25, { required: false }),
      slot("sauce", ["sauce"], 0.12, { required: false }),
    ],
    instructions: steps(
      "Boil the {pasta} in salted water until just tender, then cool under the tap.",
      "Flake in the {fish} and add the chopped {vegetable}.",
      "Loosen with the {sauce} and season well.",
    ),
  },
  {
    id: "lunch-chicken-rice-bowl",
    mealType: "lunch",
    titlePattern: "{poultry} and {rice} bowl",
    cuisineTags: ["asian"],
    preferenceTags: ["high-protein", "batch-cook"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "cooking oil", "basic herbs and spices"],
    prepMinutes: 8,
    cookMinutes: 20,
    baseServings: 4,
    slots: [
      slot("rice", ["rice"], 0.35),
      slot("poultry", ["poultry"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.3),
      slot("sauce", ["sauce"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Cook the {rice} according to the pack and keep warm.",
      "Fry the sliced {poultry} in oil with your spices until cooked through.",
      "Add the {vegetable} and cook until just tender.",
      "Spoon over the rice and finish with the {sauce}.",
    ),
  },
  {
    id: "lunch-lentil-soup",
    mealType: "lunch",
    titlePattern: "{pulse} and {vegetable} soup",
    cuisineTags: ["mediterranean"],
    preferenceTags: ["vegetarian", "low-waste", "batch-cook"],
    requiredAppliances: ["hob"],
    pantryItems: ["stock cubes", "basic herbs and spices", "cooking oil", "salt"],
    prepMinutes: 10,
    cookMinutes: 30,
    baseServings: 4,
    slots: [
      slot("pulse", ["plant_protein"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.5),
      slot("bread", ["bread"], 0.3, { required: false }),
    ],
    instructions: steps(
      "Soften the chopped {vegetable} in oil with a spoonful of spices.",
      "Add the {pulse} and enough stock to cover, then simmer until soft.",
      "Season to taste and serve with the {bread}.",
    ),
  },
  {
    id: "lunch-omelette",
    mealType: "lunch",
    titlePattern: "{egg} omelette",
    cuisineTags: ["french"],
    preferenceTags: ["vegetarian", "quick", "high-protein"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 5,
    cookMinutes: 8,
    baseServings: 2,
    slots: [
      slot("egg", ["egg"], 0.4),
      slot("cheese", ["cheese"], 0.15, { required: false }),
      slot("vegetable", ["other_vegetable"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Beat the {egg} with salt and pepper.",
      "Soften the chopped {vegetable} in an oiled pan.",
      "Pour in the eggs, scatter over the {cheese} and cook until just set, then fold.",
    ),
  },
  {
    id: "lunch-couscous-salad",
    mealType: "lunch",
    titlePattern: "{starch} salad with {vegetable}",
    cuisineTags: ["mediterranean"],
    preferenceTags: ["vegetarian", "quick", "batch-cook"],
    requiredAppliances: ["kettle"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 10,
    cookMinutes: 5,
    baseServings: 4,
    slots: [
      slot("starch", ["other_starch"], 0.35),
      slot("vegetable", ["other_vegetable"], 0.35),
      slot("cheese", ["cheese"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Cover the {starch} with boiling water and leave to swell, then fork through.",
      "Stir in the chopped {vegetable} and a splash of oil.",
      "Crumble over the {cheese} and season.",
    ),
  },
  {
    id: "lunch-ploughmans-plate",
    mealType: "lunch",
    titlePattern: "{cheese} ploughman's plate",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: ["pepper"],
    prepMinutes: 10,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("cheese", ["cheese"], 0.25),
      slot("bread", ["bread"], 0.3),
      slot("vegetable", ["other_vegetable"], 0.2, { required: false }),
      slot("fruit", ["fruit"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Cut the {cheese} into thick wedges.",
      "Arrange on plates with the {bread}, the {vegetable} and the {fruit}.",
    ),
  },
];

const DINNER: RecipeTemplate[] = [
  {
    id: "dinner-chicken-rice-vegetables",
    mealType: "dinner",
    titlePattern: "{poultry} with {rice} and {vegetable}",
    cuisineTags: ["british", "asian"],
    preferenceTags: ["high-protein", "family-friendly"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper", "cooking oil", "basic herbs and spices"],
    prepMinutes: 10,
    cookMinutes: 25,
    baseServings: 4,
    slots: [
      slot("poultry", ["poultry"], 0.6),
      slot("rice", ["rice"], 0.35),
      slot("vegetable", ["other_vegetable"], 0.4),
      slot("sauce", ["sauce"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Cook the {rice} according to the pack.",
      "Season the {poultry} and fry in oil until cooked through.",
      "Add the {vegetable} and cook until tender.",
      "Stir through the {sauce} and serve over the rice.",
    ),
  },
  {
    id: "dinner-bolognese",
    mealType: "dinner",
    titlePattern: "{meat} bolognese with {pasta}",
    cuisineTags: ["italian"],
    preferenceTags: ["family-friendly", "batch-cook", "high-protein"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper", "cooking oil", "basic herbs and spices"],
    prepMinutes: 10,
    cookMinutes: 35,
    baseServings: 4,
    slots: [
      slot("meat", ["red_meat"], 0.6),
      slot("pasta", ["pasta"], 0.4),
      slot("sauce", ["sauce"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.3, { required: false }),
    ],
    instructions: steps(
      "Brown the {meat} in a little oil, breaking it up as it cooks.",
      "Add the chopped {vegetable} and soften.",
      "Pour in the {sauce}, season and simmer for half an hour.",
      "Boil the {pasta} until just tender and serve the sauce over the top.",
    ),
  },
  {
    id: "dinner-vegetable-curry",
    mealType: "dinner",
    titlePattern: "{vegetable} curry with {rice}",
    cuisineTags: ["indian"],
    preferenceTags: ["vegetarian", "batch-cook", "low-waste"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "cooking oil", "basic herbs and spices", "stock cubes"],
    prepMinutes: 12,
    cookMinutes: 30,
    baseServings: 4,
    slots: [
      slot("vegetable", ["other_vegetable"], 0.6),
      slot("rice", ["rice"], 0.35),
      slot("sauce", ["sauce"], 0.4),
      slot("pulse", ["plant_protein"], 0.35, { required: false }),
    ],
    instructions: steps(
      "Fry your spices in oil for a minute until fragrant.",
      "Add the chopped {vegetable} and the {pulse} and coat in the spices.",
      "Pour in the {sauce}, then simmer until everything is tender.",
      "Serve with the cooked {rice}.",
    ),
  },
  {
    id: "dinner-baked-fish-potatoes",
    mealType: "dinner",
    titlePattern: "Baked {fish} with {potato}",
    cuisineTags: ["british"],
    preferenceTags: ["high-protein"],
    requiredAppliances: ["oven"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 10,
    cookMinutes: 35,
    baseServings: 4,
    slots: [
      slot("fish", ["fish"], 0.6),
      slot("potato", ["potato"], 0.45),
      slot("vegetable", ["other_vegetable"], 0.35),
    ],
    instructions: steps(
      "Cut the {potato} into wedges, toss in oil and salt, and roast until golden.",
      "Add the {fish} to the tray for the last fifteen minutes.",
      "Steam or roast the {vegetable} alongside and season everything well.",
    ),
  },
  {
    id: "dinner-sausage-mash",
    mealType: "dinner",
    titlePattern: "{meat} with mashed {potato}",
    cuisineTags: ["british"],
    preferenceTags: ["family-friendly", "high-protein"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 10,
    cookMinutes: 30,
    baseServings: 4,
    slots: [
      slot("meat", ["red_meat"], 0.6),
      slot("potato", ["potato"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.35),
      slot("dairy", ["milk"], 0.1, { required: false }),
    ],
    instructions: steps(
      "Boil the {potato} until soft, then mash with the {dairy} and season.",
      "Fry or grill the {meat} until browned and cooked through.",
      "Cook the {vegetable} until tender and serve everything together.",
    ),
  },
  {
    id: "dinner-roast-chicken-tray",
    mealType: "dinner",
    titlePattern: "Roast {poultry} tray with {potato}",
    cuisineTags: ["british"],
    preferenceTags: ["family-friendly", "batch-cook", "high-protein"],
    requiredAppliances: ["oven"],
    pantryItems: ["salt", "pepper", "cooking oil", "basic herbs and spices"],
    prepMinutes: 12,
    cookMinutes: 50,
    baseServings: 4,
    slots: [
      slot("poultry", ["poultry"], 0.7),
      slot("potato", ["potato"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.4),
    ],
    instructions: steps(
      "Halve the {potato} and the {vegetable} and spread over a roasting tray.",
      "Sit the {poultry} on top, oil and season generously.",
      "Roast until the chicken is cooked through and the vegetables are golden.",
    ),
  },
  {
    id: "dinner-lentil-dhal",
    mealType: "dinner",
    titlePattern: "{pulse} dhal with {rice}",
    cuisineTags: ["indian"],
    preferenceTags: ["vegetarian", "low-waste", "batch-cook"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "cooking oil", "basic herbs and spices", "stock cubes"],
    prepMinutes: 8,
    cookMinutes: 35,
    baseServings: 4,
    slots: [
      slot("pulse", ["plant_protein"], 0.5),
      slot("rice", ["rice"], 0.35),
      slot("vegetable", ["other_vegetable"], 0.3, { required: false }),
      slot("sauce", ["sauce"], 0.25, { required: false }),
    ],
    instructions: steps(
      "Toast your spices in oil, then add the {pulse} and the chopped {vegetable}.",
      "Cover with stock and the {sauce} and simmer until thick and soft.",
      "Season well and serve with the {rice}.",
    ),
  },
  {
    id: "dinner-pasta-bake",
    mealType: "dinner",
    titlePattern: "{cheese} and {vegetable} {pasta} bake",
    cuisineTags: ["italian"],
    preferenceTags: ["vegetarian", "family-friendly", "batch-cook"],
    requiredAppliances: ["oven", "hob"],
    pantryItems: ["salt", "pepper", "cooking oil"],
    prepMinutes: 12,
    cookMinutes: 35,
    baseServings: 4,
    slots: [
      slot("pasta", ["pasta"], 0.45),
      slot("cheese", ["cheese"], 0.35),
      slot("sauce", ["sauce"], 0.5),
      slot("vegetable", ["other_vegetable"], 0.35),
    ],
    instructions: steps(
      "Boil the {pasta} until just short of tender and drain.",
      "Soften the chopped {vegetable}, then stir in the {sauce} and the pasta.",
      "Tip into a dish, cover with the grated {cheese} and bake until bubbling.",
    ),
  },
  {
    id: "dinner-stir-fry-noodles",
    mealType: "dinner",
    titlePattern: "{vegetable} and {starch} stir fry",
    cuisineTags: ["chinese", "asian"],
    preferenceTags: ["quick", "low-waste"],
    requiredAppliances: ["hob"],
    pantryItems: ["cooking oil", "basic herbs and spices"],
    prepMinutes: 10,
    cookMinutes: 12,
    baseServings: 4,
    slots: [
      slot("starch", ["other_starch", "rice"], 0.4),
      slot("vegetable", ["other_vegetable"], 0.5),
      slot("protein", MAIN_PROTEIN, 0.45, { required: false }),
      slot("sauce", ["sauce"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Prepare the {starch} according to the pack and set aside.",
      "Fry the {protein} over a high heat until cooked, then lift out.",
      "Stir fry the sliced {vegetable} until just tender.",
      "Return everything to the pan with the {sauce} and toss to coat.",
    ),
  },
  {
    id: "dinner-air-fryer-chicken",
    mealType: "dinner",
    titlePattern: "Air fryer {poultry} and {potato}",
    cuisineTags: ["british"],
    preferenceTags: ["quick", "high-protein"],
    requiredAppliances: ["air-fryer"],
    pantryItems: ["salt", "pepper", "cooking oil", "basic herbs and spices"],
    prepMinutes: 8,
    cookMinutes: 25,
    baseServings: 2,
    slots: [
      slot("poultry", ["poultry"], 0.5),
      slot("potato", ["potato"], 0.4),
      slot("vegetable", ["other_vegetable"], 0.3, { required: false }),
    ],
    instructions: steps(
      "Cut the {potato} into chips, toss in oil and salt and air fry until crisp.",
      "Season the {poultry} and air fry until cooked through.",
      "Serve with the {vegetable} on the side.",
    ),
  },
  {
    id: "dinner-cold-plate",
    mealType: "dinner",
    titlePattern: "{protein} plate with {bread}",
    cuisineTags: ["british"],
    preferenceTags: ["quick"],
    requiredAppliances: [],
    pantryItems: ["salt", "pepper"],
    prepMinutes: 15,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("protein", MAIN_PROTEIN, 0.4),
      slot("bread", ["bread"], 0.35),
      slot("vegetable", ["other_vegetable"], 0.3),
      slot("greens", ["leafy_vegetable"], 0.2, { required: false }),
    ],
    instructions: steps(
      "Slice the {protein} and the {vegetable}.",
      "Arrange on plates with the {greens} and season.",
      "Serve with the {bread} alongside.",
    ),
  },
  {
    id: "dinner-bean-chilli",
    mealType: "dinner",
    titlePattern: "{pulse} chilli with {rice}",
    cuisineTags: ["mexican"],
    preferenceTags: ["vegetarian", "batch-cook", "low-waste"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "cooking oil", "basic herbs and spices", "stock cubes"],
    prepMinutes: 10,
    cookMinutes: 30,
    baseServings: 4,
    slots: [
      slot("pulse", ["plant_protein"], 0.55),
      slot("rice", ["rice"], 0.35),
      slot("vegetable", ["other_vegetable"], 0.4),
      slot("sauce", ["sauce"], 0.4),
    ],
    instructions: steps(
      "Soften the chopped {vegetable} in oil with your chilli spices.",
      "Add the {pulse} and the {sauce} and simmer until thick.",
      "Season and serve over the cooked {rice}.",
    ),
  },
];

const SNACK: RecipeTemplate[] = [
  {
    id: "snack-fruit-and-yogurt",
    mealType: "snack",
    titlePattern: "{fruit} with {yogurt}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 3,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("fruit", ["fruit"], 0.2),
      slot("yogurt", ["yogurt"], 0.15),
    ],
    instructions: steps("Chop the {fruit}.", "Serve with a spoonful of {yogurt}."),
  },
  {
    id: "snack-bread-and-cheese",
    mealType: "snack",
    titlePattern: "{cheese} on {bread}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: ["pepper"],
    prepMinutes: 3,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("bread", ["bread"], 0.2),
      slot("cheese", ["cheese"], 0.15),
    ],
    instructions: steps("Slice the {bread} and the {cheese}.", "Serve together."),
  },
  {
    id: "snack-vegetables-and-dip",
    mealType: "snack",
    titlePattern: "{vegetable} sticks with {dip}",
    cuisineTags: ["mediterranean"],
    preferenceTags: ["vegetarian", "low-waste", "quick"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 5,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("vegetable", ["other_vegetable"], 0.2),
      slot("dip", ["plant_protein", "sauce"], 0.2),
    ],
    instructions: steps(
      "Cut the {vegetable} into sticks.",
      "Serve with the {dip} to share.",
    ),
  },
  {
    id: "snack-fruit-bowl",
    mealType: "snack",
    titlePattern: "Fresh {fruit}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick", "low-waste"],
    requiredAppliances: [],
    pantryItems: [],
    prepMinutes: 2,
    cookMinutes: 0,
    baseServings: 2,
    slots: [slot("fruit", ["fruit"], 0.25)],
    instructions: steps("Wash and prepare the {fruit}, then serve."),
  },
  {
    id: "snack-crackers-and-cheese",
    mealType: "snack",
    titlePattern: "{cheese} with {crackers}",
    cuisineTags: ["british"],
    preferenceTags: ["vegetarian", "quick"],
    requiredAppliances: [],
    pantryItems: ["pepper"],
    prepMinutes: 3,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      slot("crackers", ["snack"], 0.2),
      slot("cheese", ["cheese"], 0.15),
      slot("fruit", ["fruit"], 0.15, { required: false }),
    ],
    instructions: steps(
      "Lay out the {crackers}.",
      "Top with sliced {cheese} and serve the {fruit} alongside.",
    ),
  },
  {
    id: "snack-boiled-eggs",
    mealType: "snack",
    titlePattern: "Boiled {egg}",
    cuisineTags: ["british"],
    preferenceTags: ["high-protein", "quick", "vegetarian"],
    requiredAppliances: ["hob"],
    pantryItems: ["salt", "pepper"],
    prepMinutes: 2,
    cookMinutes: 8,
    baseServings: 2,
    slots: [slot("egg", ["egg"], 0.25)],
    instructions: steps(
      "Simmer the {egg} for eight minutes, then cool under cold water.",
      "Peel, season with salt and pepper, and serve.",
    ),
  },
];

export const RECIPE_TEMPLATES: readonly RecipeTemplate[] = Object.freeze([
  ...BREAKFAST,
  ...LUNCH,
  ...DINNER,
  ...SNACK,
]);

export function templatesForMealType(mealType: MealType): RecipeTemplate[] {
  return RECIPE_TEMPLATES.filter((template) => template.mealType === mealType);
}
