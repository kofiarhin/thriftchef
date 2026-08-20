import { loadCandidateProducts } from "../catalogue/core/catalogueReads";
import type {
  CandidateProduct,
  CatalogueReadSource,
} from "../catalogue/core/catalogueTypes";
import type { ResolvedCatalogueScope } from "../catalogue/core/retailerTypes";
import { classifyIngredientRoles, type IngredientRole } from "./ingredientRoles";
import {
  allocateAcrossFoodGroups,
  classifyFoodGroup,
  primaryCategory,
  type FoodGroup,
} from "./productCategories";
import type {
  MealPlanRequest,
  SelectableProduct,
} from "./mealPlanTypes";

/**
 * Aldi publishes no allergen labels, so every crawled product is "inferred".
 * Planning may still use them, but the user must be told the difference
 * between an inference and a label — this wording is what they see.
 */
export const INFERRED_ALLERGEN_WARNING =
  "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.";

export const INFERRED_WITH_ALLERGIES_WARNING =
  "You declared an allergy, but no product in this plan has retailer-verified allergen data. Products whose inferred allergens conflicted with your allergies were removed, but inference can miss allergens. Do not rely on this plan for allergy safety; check the packaging of every item.";

/**
 * Re-exported from the catalogue core so existing importers keep working. The
 * definition moved there because two readers — legacy fields and store-scoped
 * offers — must provably produce the same shape.
 */
export type { CandidateProduct };

/**
 * Why a product the user insisted on cannot be planned with. Never a silent
 * removal: a must-have the plan cannot honour is reported back with the
 * product's catalogue name so the user can choose something else.
 */
export type MustHaveExclusionReason = "allergy" | "dislike" | "unavailable";

export interface MustHaveIssue {
  productId: string;
  /** From the catalogue record, never from the client. */
  productName: string;
  reason: MustHaveExclusionReason;
}

export interface SelectionResult {
  products: SelectableProduct[];
  productsConsidered: number;
  excludedForAllergies: number;
  excludedForSafety: number;
  excludedForDislikes: number;
  usesInferredProducts: boolean;
  warnings: string[];
  /** Must-have products the safety and constraint filters removed. */
  mustHaveIssues: MustHaveIssue[];
}

export interface SelectionOptions {
  maxProducts: number;
  /**
   * Products the user has committed to buying. Forced into the selection past
   * the ranking cap, but never past a safety, allergy or dislike filter.
   */
  mustHaveProductIds?: string[];
}

/**
 * How much a food group is worth to a weekly meal plan. Proteins, vegetables
 * and staples carry most meals; confectionery earns its place only when
 * snacks were asked for.
 */
const GROUP_WEIGHT: Record<FoodGroup, number> = {
  protein: 100,
  staple: 95,
  vegetable: 90,
  dairy: 75,
  bakery: 65,
  sauce: 55,
  fruit: 50,
  snack: 15,
  other: 10,
};

const PREFERENCE_BONUS: Record<string, Partial<Record<FoodGroup, number>>> = {
  "high-protein": { protein: 30, dairy: 10 },
  vegetarian: { vegetable: 30, dairy: 15, staple: 10 },
  "batch-cook": { staple: 20, protein: 15 },
  "low-waste": { staple: 15, sauce: 10 },
  quick: { staple: 10 },
  "family-friendly": {},
};

function matchesDislike(product: CandidateProduct, dislikes: string[]): boolean {
  if (dislikes.length === 0) return false;

  const haystack = `${product.name} ${product.description ?? ""}`.toLowerCase();

  // Whole-word matching so "olives" does not strike out "olive oil".
  return dislikes.some((dislike) =>
    new RegExp(`\\b${dislike.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
      haystack,
    ),
  );
}

function rankScore(
  product: CandidateProduct,
  group: FoodGroup,
  request: MealPlanRequest,
  newestSeenAt: number,
): number {
  let score = GROUP_WEIGHT[group];

  for (const preference of request.mealPreferences) {
    score += PREFERENCE_BONUS[preference]?.[group] ?? 0;
  }

  // Snacks are dead weight unless the user asked for them.
  if (group === "snack" && !request.mealsPerDay.includes("snack")) score -= 10;

  // Cheapness matters, but must not outrank usefulness: a 30-point band keeps
  // a cheap sweet below a mid-priced protein.
  score += Math.max(0, 30 - Math.floor(product.pricePence / 25));

  // Complete data makes a product usable in a recipe and in a shopping list.
  if (product.packageSizeRaw) score += 8;
  if (product.description) score += 4;

  // Products confirmed by the newest crawl are likelier to still be on shelf.
  if (product.lastSeenAt.getTime() >= newestSeenAt) score += 6;

  return score;
}

/**
 * How many products per price band, per culinary role, are pulled to the front
 * of the ranking so the food-group cap cannot drop them.
 */
const PER_ROLE_BAND_QUOTA = 1;

const PRICE_BANDS = 3;

/**
 * Only the mid and dear bands are protected. The cheap band needs no help —
 * ranking already prefers it — and promoting it as well simply refills the cap
 * with the products that were never at risk, squeezing out the dearer ones
 * this exists to keep.
 */
const FIRST_PROTECTED_BAND = 1;

/**
 * Reorders a ranked list so each culinary role keeps a cheap, a mid-priced and
 * a dearer option near the front.
 *
 * Ranking rewards cheapness, and a straight cap therefore hands every slot in a
 * role to its cheapest members. That is fine for a tight week and useless for a
 * generous one: with nothing dearer in the selection, no amount of scoring can
 * build a plan that uses a larger budget. Order within a band is left exactly
 * as ranking left it, so this widens the choice without overruling it.
 */
export function retainRolePriceBands(
  ranked: SelectableProduct[],
): SelectableProduct[] {
  const byRole = new Map<IngredientRole, SelectableProduct[]>();

  for (const product of ranked) {
    for (const role of product.roles) {
      if (role === "unknown") continue;

      const members = byRole.get(role) ?? [];
      members.push(product);
      byRole.set(role, members);
    }
  }

  const promoted = new Set<string>();

  // Roles are visited in a fixed order so the promoted set never depends on
  // Map insertion order, which depends on the catalogue.
  for (const role of [...byRole.keys()].sort()) {
    const members = byRole.get(role) ?? [];
    if (members.length < PRICE_BANDS) continue;

    // Bands split the role's price *range*, not its population. Aldi's price
    // distribution inside a role is heavily skewed toward the cheap end — 279
    // poultry products from 29p to £12.29, most of them under £3 — so splitting
    // by population puts the whole "dearest third" below £3 and promotes
    // nothing a generous budget could actually spend on.
    const prices = members.map((product) => product.pricePence);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    if (highest <= lowest) continue;

    const bandWidth = (highest - lowest) / PRICE_BANDS;

    for (let band = FIRST_PROTECTED_BAND; band < PRICE_BANDS; band += 1) {
      const from = lowest + band * bandWidth;
      const to = band === PRICE_BANDS - 1 ? Infinity : lowest + (band + 1) * bandWidth;

      // Inside a band, ranking still decides which products are worth keeping.
      let taken = 0;
      for (const product of members) {
        if (taken >= PER_ROLE_BAND_QUOTA) break;
        if (product.pricePence < from || product.pricePence >= to) continue;

        promoted.add(product.productId);
        taken += 1;
      }
    }
  }

  // A stable partition: promoted products keep their relative ranking, and so
  // does everything else.
  return [
    ...ranked.filter((product) => promoted.has(product.productId)),
    ...ranked.filter((product) => !promoted.has(product.productId)),
  ];
}

function toSelectable(product: CandidateProduct): SelectableProduct {
  return {
    productId: product.retailerProductId,
    name: product.name,
    brand: product.brand,
    category: primaryCategory(product.categoryPaths),
    categoryPaths: product.categoryPaths,
    pricePence: product.pricePence,
    packageSize: product.packageSizeRaw,
    allergens: [...product.normalizedAllergens].sort(),
    dietaryInfo: product.dietaryInformationRaw,
    safetyStatus: product.catalogueSafetyStatus === "verified" ? "verified" : "inferred",
    productUrl: product.productUrl,
    imageUrl: product.imageUrl ?? null,
    lastSeenAt: product.lastSeenAt,
    roles: classifyIngredientRoles({
      name: product.name,
      description: product.description,
      categoryPaths: product.categoryPaths,
    }),
  };
}

/**
 * Filters and ranks catalogue candidates into the product set a planner may
 * use. Pure and synchronous: allergy and safety policy must be provable
 * without a database or an AI call.
 *
 * An empty result is a legitimate outcome, not an error — the caller decides
 * whether that is a 409 or a 503.
 */
export function selectProducts(
  candidates: CandidateProduct[],
  request: MealPlanRequest,
  options: SelectionOptions,
): SelectionResult {
  // Widened to string: the catalogue's `normalizedAllergens` is untyped text
  // from the crawler, and an unknown value there simply will not match.
  const allergies = new Set<string>(request.allergies);
  const newestSeenAt = candidates.reduce(
    (newest, product) => Math.max(newest, product.lastSeenAt.getTime()),
    0,
  );

  const mustHaveIds = options.mustHaveProductIds ?? [];
  const mustHaveSet = new Set(mustHaveIds);
  const mustHaveIssuesById = new Map<string, MustHaveIssue>();

  function noteMustHaveIssue(
    product: CandidateProduct,
    reason: MustHaveExclusionReason,
  ): void {
    if (!mustHaveSet.has(product.retailerProductId)) return;
    if (mustHaveIssuesById.has(product.retailerProductId)) return;

    mustHaveIssuesById.set(product.retailerProductId, {
      productId: product.retailerProductId,
      productName: product.name,
      reason,
    });
  }

  let excludedForAllergies = 0;
  let excludedForSafety = 0;
  let excludedForDislikes = 0;
  let usesInferredProducts = false;

  const ranked: Array<{ product: SelectableProduct; score: number }> = [];

  for (const product of candidates) {
    const safetyStatus = product.catalogueSafetyStatus;

    if (
      !product.eligibleForPlanning ||
      (safetyStatus !== "verified" && safetyStatus !== "inferred")
    ) {
      excludedForSafety += 1;
      noteMustHaveIssue(product, "unavailable");
      continue;
    }

    if (product.pricePence <= 0) {
      excludedForSafety += 1;
      noteMustHaveIssue(product, "unavailable");
      continue;
    }

    if (product.normalizedAllergens.some((allergen) => allergies.has(allergen))) {
      excludedForAllergies += 1;
      noteMustHaveIssue(product, "allergy");
      continue;
    }

    if (matchesDislike(product, request.dislikedIngredients)) {
      excludedForDislikes += 1;
      noteMustHaveIssue(product, "dislike");
      continue;
    }

    if (safetyStatus === "inferred") usesInferredProducts = true;

    const group = classifyFoodGroup(product.categoryPaths);
    ranked.push({
      product: toSelectable(product),
      score: rankScore(product, group, request, newestSeenAt),
    });
  }

  // Ties break on price then product ID so the same catalogue always yields
  // the same context, which keeps AI prompts and tests reproducible.
  ranked.sort(
    (a, b) =>
      b.score - a.score ||
      a.product.pricePence - b.product.pricePence ||
      a.product.productId.localeCompare(b.product.productId),
  );

  const rankedProducts = retainRolePriceBands(ranked.map((entry) => entry.product));

  // Products the user committed to buying are not candidates to be ranked; the
  // decision is already made. They take their places first, and the cap then
  // shares out what is left.
  const forced = rankedProducts.filter((product) => mustHaveSet.has(product.productId));
  const forcedIds = new Set(forced.map((product) => product.productId));

  // Cap by food group rather than by rank alone. Ranking favours cheap
  // cupboard staples, so a straight top-N would hand every slot to tinned
  // goods and leave the planner with no protein, vegetables or dairy.
  const products = [
    ...forced,
    ...allocateAcrossFoodGroups(
      rankedProducts.filter((product) => !forcedIds.has(product.productId)),
      {
        maxItems: Math.max(0, options.maxProducts - forced.length),
        groupOf: (product) => classifyFoodGroup(product.categoryPaths),
        includeSnacks: request.mealsPerDay.includes("snack"),
      },
    ),
  ];

  const warnings: string[] = [];
  if (products.some((product) => product.safetyStatus === "inferred")) {
    warnings.push(
      request.allergies.length > 0
        ? INFERRED_WITH_ALLERGIES_WARNING
        : INFERRED_ALLERGEN_WARNING,
    );
  }

  return {
    products,
    productsConsidered: candidates.length,
    excludedForAllergies,
    excludedForSafety,
    excludedForDislikes,
    usesInferredProducts,
    warnings,
    // Reported in the order the user chose the products, so the message reads
    // back in the order the selector was given.
    mustHaveIssues: mustHaveIds
      .map((productId) => mustHaveIssuesById.get(productId))
      .filter((issue): issue is MustHaveIssue => issue !== undefined),
  };
}

/**
 * Loads every available product for one resolved retailer and store.
 *
 * Eligibility, safety and allergy filtering deliberately happen in
 * `selectProducts` rather than in the query, so the response can report how
 * many products each rule removed.
 *
 * Takes a resolved scope rather than a store id: a scope cannot be constructed
 * without a retailer, so there is no way to call this and accidentally read
 * the whole catalogue.
 */
export async function fetchCandidateProducts(
  scope: ResolvedCatalogueScope,
  source: CatalogueReadSource = "legacy",
): Promise<CandidateProduct[]> {
  return loadCandidateProducts(scope, source);
}
