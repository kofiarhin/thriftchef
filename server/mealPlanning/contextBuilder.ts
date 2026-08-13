import {
  allocateAcrossFoodGroups,
  classifyFoodGroup,
} from "./productCategories";
import type { MealPlanRequest, SelectableProduct } from "./mealPlanTypes";

/**
 * The only product shape the AI ever sees. Deliberately minimal: product URLs,
 * crawl timestamps and category arrays cost tokens, add nothing to planning,
 * and widen what a prompt injection could reach.
 */
export interface AiContextProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  pricePence: number;
  packageSize: string | null;
  allergens: string[];
  dietaryInfo: string | null;
  safetyStatus: "verified" | "inferred";
}

export interface AiContext {
  products: AiContextProduct[];
  containsInferredAllergens: boolean;
}

export interface ContextOptions {
  maxProducts: number;
}

const MAX_DIETARY_INFO_LENGTH = 80;
const MAX_NAME_LENGTH = 100;

function truncate(value: string | null, maxLength: number): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1)}…` : trimmed;
}

function toContextProduct(product: SelectableProduct): AiContextProduct {
  return {
    id: product.productId,
    name: truncate(product.name, MAX_NAME_LENGTH) ?? product.productId,
    brand: truncate(product.brand, 40),
    category: product.category,
    pricePence: product.pricePence,
    packageSize: truncate(product.packageSize, 30),
    allergens: product.allergens,
    dietaryInfo: truncate(product.dietaryInfo, MAX_DIETARY_INFO_LENGTH),
    safetyStatus: product.safetyStatus,
  };
}

/**
 * Projects the selected products into a bounded, balanced prompt payload.
 *
 * Input order is preserved within each group, so the selector's ranking still
 * decides which products inside a group make the cut.
 */
export function buildAiContext(
  products: SelectableProduct[],
  request: MealPlanRequest,
  options: ContextOptions,
): AiContext {
  // The selector already balances and caps its output; applying the same
  // allocation here keeps the prompt bounded even if a caller passes a raw,
  // unbalanced list.
  const selected = allocateAcrossFoodGroups(products, {
    maxItems: options.maxProducts,
    groupOf: (product) => classifyFoodGroup(product.categoryPaths),
    includeSnacks: request.mealsPerDay.includes("snack"),
  });

  return {
    products: selected.map(toContextProduct),
    containsInferredAllergens: selected.some(
      (product) => product.safetyStatus === "inferred",
    ),
  };
}
