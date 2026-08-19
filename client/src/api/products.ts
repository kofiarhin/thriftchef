import { apiRequest } from "./http";
import type { ProductSearchResponse } from "./types";

export interface ProductSearchQuery {
  search: string;
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * One page of catalogue products. The catalogue is thousands of items, so the
 * browser never asks for all of them: the term and the page go to the server
 * and only the page comes back.
 */
export function searchProducts(
  query: ProductSearchQuery,
): Promise<ProductSearchResponse> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const suffix = params.toString();
  return apiRequest<ProductSearchResponse>(
    suffix ? `/api/products?${suffix}` : "/api/products",
  );
}
