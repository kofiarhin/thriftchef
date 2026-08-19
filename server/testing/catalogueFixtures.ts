/**
 * The planning fixture catalogue, projected into the shape catalogue search
 * reads. Search and planning must agree about what a product is, so the search
 * tests draw from the same products the planner does rather than from a second
 * hand-written list that could drift.
 */

import type { SearchableProduct } from "../catalogue/productSearchService";
import { ALDI_CATALOGUE } from "./planningFixtures";

export const SEARCHABLE_CATALOGUE: SearchableProduct[] = ALDI_CATALOGUE.map(
  (product) => ({
    retailerProductId: product.retailerProductId,
    name: product.name,
    description: product.description,
    categoryPaths: product.categoryPaths,
    pricePence: product.pricePence,
    packageSizeRaw: product.packageSizeRaw,
    comparisonPriceRaw: null,
    imageUrl: product.imageUrl ?? null,
    available: true,
  }),
);
