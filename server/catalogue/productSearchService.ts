/**
 * Read-only catalogue search for the must-have product picker.
 *
 * The catalogue is thousands of products, so search and paging happen in the
 * database and the browser never receives more than one page. Only the fields
 * the picker draws are projected: crawl metadata, raw label text and the
 * planner's safety verdicts are not the client's business.
 */

import type { QueryFilter } from "mongoose";
import { Product, type ProductRecord } from "../models/Product";
import { primaryCategory } from "../mealPlanning/productCategories";

const RETAILER = "aldi-uk" as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export interface ProductSearchParams {
  storeId: string;
  /** Already trimmed and collapsed; an empty string means "browse". */
  search: string;
  category: string | null;
  page: number;
  limit: number;
}

export interface ProductSearchItem {
  id: string;
  name: string;
  category: string;
  pricePence: number;
  packageSize: string | null;
  /** Aldi's own comparison price, when it published one ("£1.20 per kg"). */
  unitPrice: string | null;
  imageUrl: string | null;
  available: boolean;
}

export interface ProductSearchResponse {
  items: ProductSearchItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductSearchPage {
  items: ProductSearchItem[];
  total: number;
}

/**
 * The single collaborator the route depends on. MongoDB in production, a
 * fixture catalogue in tests, so the endpoint's contract can be exercised
 * without a database.
 */
export type ProductSearchPort = (
  params: ProductSearchParams,
) => Promise<ProductSearchPage>;

/** The catalogue fields search is allowed to read. */
export interface SearchableProduct {
  retailerProductId: string;
  name: string;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  imageUrl: string | null;
  available: boolean;
}

export function toSearchItem(product: SearchableProduct): ProductSearchItem {
  return {
    id: product.retailerProductId,
    name: product.name,
    category: primaryCategory(product.categoryPaths),
    pricePence: product.pricePence,
    packageSize: product.packageSizeRaw,
    unitPrice: product.comparisonPriceRaw,
    imageUrl: product.imageUrl,
    available: product.available,
  };
}

/**
 * Name first, then id. Paging over an unstable order silently drops and
 * repeats products between pages, which reads to the user as the catalogue
 * changing under them.
 */
export function compareSearchItems(
  a: ProductSearchItem,
  b: ProductSearchItem,
): number {
  return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

/** Escaped so a product name containing regex punctuation cannot alter the query. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesSearch(product: SearchableProduct, search: string): boolean {
  if (!search) return true;

  const haystack = [product.name, product.description ?? "", ...product.categoryPaths.flat()]
    .join(" ")
    .toLowerCase();

  // Every word must appear somewhere, so "chicken breast" does not match every
  // chicken product in the catalogue.
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

function matchesCategory(product: SearchableProduct, category: string | null): boolean {
  if (!category) return true;

  const wanted = category.toLowerCase();
  return product.categoryPaths
    .flat()
    .some((segment) => segment.toLowerCase() === wanted);
}

/**
 * The reference implementation of the search contract, over an in-memory
 * catalogue. The MongoDB query below mirrors it; keeping the rules expressed
 * once, in code that tests can drive directly, is what stops the two drifting.
 */
export function searchProductsInMemory(
  products: SearchableProduct[],
  params: ProductSearchParams,
): ProductSearchPage {
  const matched = products
    .filter(
      (product) =>
        matchesSearch(product, params.search) && matchesCategory(product, params.category),
    )
    .map(toSearchItem)
    .sort(compareSearchItems);

  const start = (params.page - 1) * params.limit;

  return {
    items: matched.slice(start, start + params.limit),
    total: matched.length,
  };
}

export function paginate(
  page: ProductSearchPage,
  params: ProductSearchParams,
): ProductSearchResponse {
  return {
    items: page.items,
    page: params.page,
    limit: params.limit,
    total: page.total,
    totalPages: Math.max(1, Math.ceil(page.total / params.limit)),
  };
}

export function buildSearchFilter(
  params: ProductSearchParams,
): QueryFilter<ProductRecord> {
  const filter: QueryFilter<ProductRecord> = {
    retailer: RETAILER,
    storeId: params.storeId,
    available: true,
  };

  const tokens = params.search.split(/\s+/).filter(Boolean);
  if (tokens.length > 0) {
    // One clause per word, each matching any searchable field, so multi-word
    // queries narrow rather than widen.
    filter.$and = tokens.map((token) => {
      const pattern = new RegExp(escapeRegExp(token), "i");
      return {
        $or: [
          { name: pattern },
          { description: pattern },
          { categoryPaths: { $elemMatch: { $elemMatch: { $regex: pattern } } } },
        ],
      };
    });
  }

  if (params.category) {
    filter.categoryPaths = {
      $elemMatch: {
        $elemMatch: { $regex: new RegExp(`^${escapeRegExp(params.category)}$`, "i") },
      },
    };
  }

  return filter;
}

/**
 * One count and one page of documents. Paged in the database rather than in
 * the process: the alternative loads the whole catalogue per keystroke.
 */
export async function searchCatalogueProducts(
  params: ProductSearchParams,
): Promise<ProductSearchPage> {
  const filter = buildSearchFilter(params);

  const [documents, total] = await Promise.all([
    Product.find(filter, {
      retailerProductId: 1,
      name: 1,
      description: 1,
      categoryPaths: 1,
      pricePence: 1,
      packageSizeRaw: 1,
      comparisonPriceRaw: 1,
      imageUrl: 1,
      available: 1,
    })
      .sort({ name: 1, retailerProductId: 1 })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: documents.map((document) =>
      toSearchItem({
        retailerProductId: document.retailerProductId,
        name: document.name,
        description: document.description ?? null,
        categoryPaths: document.categoryPaths ?? [],
        pricePence: document.pricePence,
        packageSizeRaw: document.packageSizeRaw ?? null,
        comparisonPriceRaw: document.comparisonPriceRaw ?? null,
        imageUrl: document.imageUrl ?? null,
        available: document.available,
      }),
    ),
    total,
  };
}
