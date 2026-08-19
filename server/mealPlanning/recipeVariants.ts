/**
 * Turns a template plus the selected catalogue into concrete, renderable
 * recipes. This is where the "no fallback" rule is enforced: a required slot is
 * filled by a product carrying an accepted role, or the template produces
 * nothing at all.
 *
 * Enumeration is deliberately narrow. Only the best few products per slot are
 * ever considered, and the number of variants per template is capped, so a
 * large catalogue widens quality rather than search time.
 */

import { fillsAnyRole } from "./ingredientRoles";
import {
  RECIPE_TEMPLATES,
  tokensIn,
  type IngredientSlot,
  type RecipeTemplate,
} from "./recipeTemplates";
import type {
  GeneratedRecipe,
  MealPlanRequest,
  MealPreference,
  MealType,
  SelectableProduct,
} from "./mealPlanTypes";

export interface FilledSlot {
  slotKey: string;
  product: SelectableProduct;
  /** Packs of this product one cooking of the recipe consumes. */
  packages: number;
}

export interface RecipeVariant {
  templateId: string;
  mealType: MealType;
  recipe: GeneratedRecipe;
  filledSlots: FilledSlot[];
  productIds: string[];
  totalMinutes: number;
  cuisineTags: string[];
  preferenceTags: MealPreference[];
  /** Stable ordering and de-duplication key. */
  signature: string;
}

export interface BuildVariantsInput {
  template: RecipeTemplate;
  /** In selection-rank order; the index is the rank. */
  products: SelectableProduct[];
  request: MealPlanRequest;
  seed: number;
  maxVariants: number;
  /**
   * Products the user has committed to buying. A must-have that can fill a
   * slot is kept at the head of that slot's shortlist, so it survives both the
   * `maxChoices` cut and the seed rotation. It is never given a slot whose
   * roles it does not carry.
   */
  mustHaveProductIds?: string[];
}

/** The validator caps a single ingredient at 20 packs. */
const MAX_PACKAGES = 20;

/**
 * A cheap, stable, non-cryptographic hash. Recipe ids must be short enough for
 * the validator (80 characters) yet unique per product combination, so the
 * chosen products are folded into a fixed-width suffix.
 */
function shortHash(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(36).padStart(7, "0").slice(0, 7);
}

function roundPackages(value: number): number {
  return Math.min(MAX_PACKAGES, Math.max(0.01, Number(value.toFixed(2))));
}

function describeQuantity(packages: number, product: SelectableProduct): string {
  const size = product.packageSize ?? "pack";

  if (packages >= 1) {
    const whole = Math.round(packages * 100) / 100;
    return `${whole} × ${size}`;
  }

  return `${Math.round(packages * 100)}% of ${size}`;
}

/**
 * Candidates for one slot, best first. Ordering is selection rank, then price,
 * then id — the same tie-breaking `selectProducts` uses, so the whole pipeline
 * stays reproducible.
 */
function candidatesForSlot(
  slot: IngredientSlot,
  products: SelectableProduct[],
  rankById: Map<string, number>,
): SelectableProduct[] {
  return products
    .filter((product) => fillsAnyRole(product.roles, slot.acceptedRoles))
    .sort(
      (a, b) =>
        (rankById.get(a.productId) ?? 0) - (rankById.get(b.productId) ?? 0) ||
        a.pricePence - b.pricePence ||
        a.productId.localeCompare(b.productId),
    );
}

/**
 * Splits a slot shortlist into the products the user insisted on and the rest.
 * Must-haves keep their relative order and stay ahead of the rotation, because
 * a product the user has already decided to buy is not a candidate to be
 * shuffled away by a seed.
 */
function partitionMustHaves(
  candidates: SelectableProduct[],
  mustHaveIds: Set<string>,
): { required: SelectableProduct[]; optional: SelectableProduct[] } {
  const required: SelectableProduct[] = [];
  const optional: SelectableProduct[] = [];

  for (const product of candidates) {
    (mustHaveIds.has(product.productId) ? required : optional).push(product);
  }

  return { required, optional };
}

/**
 * Rotates the shortlist by the seed. Only the top `maxChoices` products are
 * ever in play, so a different seed swaps between comparable options rather
 * than reaching down the list for something worse.
 */
function rotate<T>(items: T[], by: number): T[] {
  if (items.length <= 1) return items;
  const offset = ((by % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function render(pattern: string, byKey: Map<string, SelectableProduct>): string | null {
  const tokens = tokensIn(pattern);

  // A step naming an ingredient that was left out has nothing to say.
  if (tokens.some((token) => !byKey.has(token))) return null;

  return pattern
    .replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => byKey.get(key)?.name ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildRecipeVariants(input: BuildVariantsInput): RecipeVariant[] {
  const { template, products, request, seed, maxVariants } = input;

  if (maxVariants < 1) return [];
  if (template.mealType && !request.mealsPerDay.includes(template.mealType)) return [];

  // Appliances are a hard constraint: the validator rejects any recipe needing
  // one the household does not own, so an unusable template is discarded here.
  if (
    !template.requiredAppliances.every((appliance) =>
      request.appliances.includes(appliance),
    )
  ) {
    return [];
  }

  const rankById = new Map(products.map((product, index) => [product.productId, index]));
  const mustHaveIds = new Set(input.mustHaveProductIds ?? []);
  const shortlists: Array<{ slot: IngredientSlot; options: SelectableProduct[] }> = [];

  for (const slot of template.slots) {
    const candidates = candidatesForSlot(slot, products, rankById);

    if (candidates.length === 0) {
      // The rule that stops "Pasta and Pâté Breakfast": an unfillable required
      // slot discards the template rather than borrowing another role.
      if (slot.required) return [];
      continue;
    }

    const { required, optional } = partitionMustHaves(candidates, mustHaveIds);
    const remaining = Math.max(0, slot.maxChoices - required.length);

    shortlists.push({
      slot,
      options: [...required, ...rotate(optional.slice(0, remaining), seed)],
    });
  }

  if (shortlists.length === 0) return [];

  const scale = request.householdSize / template.baseServings;
  const variants: RecipeVariant[] = [];
  const seen = new Set<string>();
  const cursor = shortlists.map(() => 0);

  // Odometer enumeration: deterministic, and it stops the moment the cap is
  // reached rather than materialising the full cartesian product.
  const combinations =
    shortlists.reduce((total, entry) => total * entry.options.length, 1) || 0;

  for (let step = 0; step < combinations && variants.length < maxVariants; step += 1) {
    const chosen: FilledSlot[] = [];
    const usedProductIds = new Set<string>();
    let duplicate = false;

    for (let index = 0; index < shortlists.length; index += 1) {
      const { slot, options } = shortlists[index];
      const product = options[cursor[index]];

      if (usedProductIds.has(product.productId)) {
        // One product cannot be two ingredients of the same dish.
        if (slot.required) {
          duplicate = true;
          break;
        }
        continue;
      }

      usedProductIds.add(product.productId);
      chosen.push({
        slotKey: slot.key,
        product,
        packages: roundPackages(slot.packagesAtBaseServings * scale),
      });
    }

    if (!duplicate && chosen.length > 0) {
      const variant = toVariant(template, chosen, request);

      if (!seen.has(variant.signature)) {
        seen.add(variant.signature);
        variants.push(variant);
      }
    }

    // Advance the odometer.
    for (let index = shortlists.length - 1; index >= 0; index -= 1) {
      cursor[index] += 1;
      if (cursor[index] < shortlists[index].options.length) break;
      cursor[index] = 0;
    }
  }

  return variants;
}

function toVariant(
  template: RecipeTemplate,
  chosen: FilledSlot[],
  request: MealPlanRequest,
): RecipeVariant {
  const byKey = new Map(chosen.map((slot) => [slot.slotKey, slot.product]));
  const productIds = chosen.map((slot) => slot.product.productId);
  const signature = `${template.id}:${[...productIds].sort().join(",")}`;

  const title = render(template.titlePattern, byKey) ?? template.titlePattern;
  const steps = template.instructions
    .map((instruction) => render(instruction.text, byKey))
    .filter((step): step is string => step !== null && step.length > 0);

  const recipe: GeneratedRecipe = {
    id: `${template.id}-${shortHash(signature)}`,
    title,
    mealType: template.mealType,
    servings: request.householdSize,
    prepMinutes: template.prepMinutes,
    cookMinutes: template.cookMinutes,
    appliances: [...template.requiredAppliances],
    ingredients: chosen.map((slot) => ({
      productId: slot.product.productId,
      quantity: describeQuantity(slot.packages, slot.product),
      packages: slot.packages,
    })),
    // Only pantry items the household actually declared may be assumed.
    pantryItems: template.pantryItems.filter((item) =>
      request.pantryBasics.includes(item),
    ),
    steps,
  };

  return {
    templateId: template.id,
    mealType: template.mealType,
    recipe,
    filledSlots: chosen,
    productIds,
    totalMinutes: template.prepMinutes + template.cookMinutes,
    cuisineTags: template.cuisineTags,
    preferenceTags: template.preferenceTags,
    signature,
  };
}

export interface MealTypeVariantsInput {
  mealType: MealType;
  products: SelectableProduct[];
  request: MealPlanRequest;
  seed: number;
  maxVariants: number;
  mustHaveProductIds?: string[];
}

/** Every usable variant for one meal type, in stable template order. */
export function buildVariantsForMealType(
  input: MealTypeVariantsInput,
): RecipeVariant[] {
  const variants: RecipeVariant[] = [];
  // Two variants that render the same title are the same dish: they differ only
  // in an optional ingredient the title never mentions. Keeping both would let
  // the planner serve what looks like the identical meal twice in one week.
  const seenTitles = new Set<string>();

  for (const template of RECIPE_TEMPLATES) {
    if (template.mealType !== input.mealType) continue;

    for (const variant of buildRecipeVariants({
      template,
      products: input.products,
      request: input.request,
      seed: input.seed,
      maxVariants: input.maxVariants,
      mustHaveProductIds: input.mustHaveProductIds,
    })) {
      if (seenTitles.has(variant.recipe.title)) continue;

      seenTitles.add(variant.recipe.title);
      variants.push(variant);
    }
  }

  return variants;
}
