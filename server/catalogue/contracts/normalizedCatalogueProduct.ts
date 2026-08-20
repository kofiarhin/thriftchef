/**
 * What every retailer adapter must produce, whatever its site looks like.
 *
 * The shared runner validates, prices, assesses safety and persists this shape
 * and no other. That is what keeps adding a supermarket to an adapter rather
 * than a second copy of the pipeline.
 *
 * Missing source data is `null`. Never a guess, never an empty string standing
 * in for a value: a plan that treats an invented pack size as real produces a
 * shopping list that is wrong in the aisle, where the user cannot check it.
 */
export interface NormalizedCatalogueProduct {
  /** The retailer's own stable code. Never derived from the product name. */
  retailerProductId: string;
  name: string;
  brand: string | null;
  description: string | null;
  /** Ordered breadcrumb paths; a product may sit in several. */
  categoryPaths: string[][];
  /** Integer minor units. Never a float, never a formatted string. */
  priceMinor: number;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  ingredientsRaw: string | null;
  allergenAdviceRaw: string | null;
  dietaryInformationRaw: string | null;
  imageUrl: string | null;
  /** Absolute, on a host the adapter declares. */
  productUrl: string;
  available: boolean;
}

/** Why a candidate was rejected before it could be persisted. */
export type NormalizationIssue =
  | "MISSING_PRODUCT_ID"
  | "MISSING_NAME"
  | "INVALID_PRICE"
  | "INVALID_URL"
  | "DISALLOWED_HOST"
  | "INVALID_CATEGORY_PATH";

export interface NormalizationResult {
  product: NormalizedCatalogueProduct | null;
  issues: NormalizationIssue[];
}
