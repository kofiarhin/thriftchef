import { Product, type CatalogueSafetyStatus } from "../models/Product";
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

const RETAILER = "aldi-uk" as const;

/**
 * Aldi publishes no allergen labels, so every crawled product is "inferred".
 * Planning may still use them, but the user must be told the difference
 * between an inference and a label — this wording is what they see.
 */
export const INFERRED_ALLERGEN_WARNING =
  "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.";

export const INFERRED_WITH_ALLERGIES_WARNING =
  "You declared an allergy, but no product in this plan has retailer-verified allergen data. Products whose inferred allergens conflicted with your allergies were removed, but inference can miss allergens. Do not rely on this plan for allergy safety; check the packaging of every item.";

/** The catalogue fields planning is allowed to see. */
export interface CandidateProduct {
  retailerProductId: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  packageSizeRaw: string | null;
  dietaryInformationRaw: string | null;
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  productUrl: string;
  lastSeenAt: Date;
}

export interface SelectionResult {
  products: SelectableProduct[];
  productsConsidered: number;
  excludedForAllergies: number;
  excludedForSafety: number;
  excludedForDislikes: number;
  usesInferredProducts: boolean;
  warnings: string[];
}

export interface SelectionOptions {
  maxProducts: number;
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
    lastSeenAt: product.lastSeenAt,
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
      continue;
    }

    if (product.pricePence <= 0) {
      excludedForSafety += 1;
      continue;
    }

    if (product.normalizedAllergens.some((allergen) => allergies.has(allergen))) {
      excludedForAllergies += 1;
      continue;
    }

    if (matchesDislike(product, request.dislikedIngredients)) {
      excludedForDislikes += 1;
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

  // Cap by food group rather than by rank alone. Ranking favours cheap
  // cupboard staples, so a straight top-N would hand every slot to tinned
  // goods and leave the planner with no protein, vegetables or dairy.
  const products = allocateAcrossFoodGroups(
    ranked.map((entry) => entry.product),
    {
      maxItems: options.maxProducts,
      groupOf: (product) => classifyFoodGroup(product.categoryPaths),
      includeSnacks: request.mealsPerDay.includes("snack"),
    },
  );

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
  };
}

/**
 * Loads every available, priced product for a store. Eligibility, safety and
 * allergy filtering deliberately happen in `selectProducts` instead of the
 * query, so the response can report how many products each rule removed.
 */
export async function fetchCandidateProducts(
  storeId: string,
): Promise<CandidateProduct[]> {
  const documents = await Product.find(
    { retailer: RETAILER, storeId, available: true },
    {
      retailerProductId: 1,
      name: 1,
      brand: 1,
      description: 1,
      categoryPaths: 1,
      pricePence: 1,
      packageSizeRaw: 1,
      dietaryInformationRaw: 1,
      normalizedAllergens: 1,
      catalogueSafetyStatus: 1,
      eligibleForPlanning: 1,
      productUrl: 1,
      lastSeenAt: 1,
    },
  ).lean();

  return documents.map((document) => ({
    retailerProductId: document.retailerProductId,
    name: document.name,
    brand: document.brand ?? null,
    description: document.description ?? null,
    categoryPaths: document.categoryPaths ?? [],
    pricePence: document.pricePence,
    packageSizeRaw: document.packageSizeRaw ?? null,
    dietaryInformationRaw: document.dietaryInformationRaw ?? null,
    normalizedAllergens: document.normalizedAllergens ?? [],
    catalogueSafetyStatus: document.catalogueSafetyStatus,
    eligibleForPlanning: document.eligibleForPlanning,
    productUrl: document.productUrl,
    lastSeenAt: document.lastSeenAt,
  }));
}
