import type { IconName } from "./Icon";

/**
 * Presentation metadata for the fixed option lists. The lists themselves stay
 * in the shared contract; this only says how each option should look and, where
 * the label alone is ambiguous, what it means in one short phrase.
 *
 * Descriptions are deliberately terse and deliberately non-overlapping: an
 * option card's accessible name is its label plus its description, so a
 * description that repeats another option's word makes both harder to find.
 */
export interface OptionMeta {
  icon: IconName;
  description?: string;
}

export const MEAL_TYPE_META: Record<string, OptionMeta> = {
  breakfast: { icon: "breakfast", description: "Start of the day" },
  lunch: { icon: "lunch", description: "Midday meal" },
  dinner: { icon: "dinner", description: "Evening meal" },
  snack: { icon: "snack", description: "Between meals" },
};

export const MEAL_PREFERENCE_META: Record<string, OptionMeta> = {
  quick: { icon: "quick", description: "Under 30 minutes" },
  "family-friendly": { icon: "users", description: "Crowd pleasers" },
  "high-protein": { icon: "high-protein", description: "Protein forward" },
  vegetarian: { icon: "leaf", description: "Meat free" },
  "low-waste": { icon: "recycle", description: "Reuses ingredients" },
  "batch-cook": { icon: "layers", description: "Cook once, eat twice" },
};

export const APPLIANCE_META: Record<string, OptionMeta> = {
  hob: { icon: "hob", description: "Pans and boiling" },
  oven: { icon: "oven", description: "Roasting and baking" },
  microwave: { icon: "microwave", description: "Fast reheating" },
  "air-fryer": { icon: "air-fryer", description: "Crisp, little oil" },
  "slow-cooker": { icon: "slow-cooker", description: "Long and low" },
  toaster: { icon: "toaster", description: "Toasting and grilling" },
  kettle: { icon: "kettle", description: "Boiling water only" },
  blender: { icon: "blender", description: "Blending only" },
};

/**
 * Fourteen allergens share eight glyphs. A distinct drawing for every one would
 * be less legible at 20px than a familiar food-group symbol, and the label is
 * what carries the meaning.
 */
export const ALLERGEN_META: Record<string, OptionMeta> = {
  celery: { icon: "plant" },
  crustaceans: { icon: "shellfish" },
  eggs: { icon: "egg" },
  fish: { icon: "fish" },
  gluten: { icon: "wheat" },
  lupin: { icon: "plant" },
  milk: { icon: "milk" },
  molluscs: { icon: "shellfish" },
  mustard: { icon: "plant" },
  peanuts: { icon: "nut" },
  sesame: { icon: "plant" },
  soya: { icon: "plant" },
  sulphites: { icon: "droplet" },
  "tree nuts": { icon: "nut" },
};

export const PANTRY_META: Record<string, OptionMeta> = {
  salt: { icon: "shaker" },
  pepper: { icon: "peppermill" },
  "cooking oil": { icon: "droplet" },
  "basic herbs and spices": { icon: "leaf" },
  "stock cubes": { icon: "cube" },
};
