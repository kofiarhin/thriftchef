import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import { parseStoreId } from "./catalogueController";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  paginate,
  type ProductSearchParams,
  type ProductSearchPort,
} from "./productSearchService";

/** Long enough for any real product name, short enough to bound the regex. */
const MAX_QUERY_LENGTH = 80;

/**
 * Deep paging costs the database a growing skip for no user benefit — nobody
 * scrolls to page 500 of a product picker.
 */
const MAX_PAGE = 200;

function singleString(field: string, value: unknown): string | undefined {
  if (value === undefined) return undefined;

  // Express hands back an array when a parameter is repeated, which is either
  // a mistake or an attempt to confuse the validation.
  if (typeof value !== "string") {
    throw ApiError.badRequest(`${field} must be a single text value.`);
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw ApiError.badRequest(
      `${field} must be ${MAX_QUERY_LENGTH} characters or fewer.`,
    );
  }

  return normalized;
}

function positiveInteger(
  field: string,
  value: unknown,
  fallback: number,
  max: number,
): number {
  if (value === undefined) return fallback;

  if (typeof value !== "string") {
    throw ApiError.badRequest(`${field} must be a single whole number.`);
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw ApiError.badRequest(
      `${field} must be a whole number between 1 and ${max}.`,
    );
  }

  return parsed;
}

export function parseProductSearchQuery(
  query: Request["query"],
  defaultStoreId: string,
): ProductSearchParams {
  return {
    storeId: parseStoreId(query.storeId, defaultStoreId),
    // An empty search term is a browse, not an error.
    search: singleString("search", query.search) ?? "",
    category: singleString("category", query.category) || null,
    page: positiveInteger("page", query.page, 1, MAX_PAGE),
    limit: positiveInteger("limit", query.limit, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
  };
}

export function createProductSearchHandler(
  config: AppConfig,
  search: ProductSearchPort,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const params = parseProductSearchQuery(request.query, config.aldi.storeId);
    const page = await search(params);

    addLogContext(response, {
      storeId: params.storeId,
      hasSearchTerm: params.search.length > 0 ? 1 : 0,
      page: params.page,
      limit: params.limit,
      total: page.total,
    });

    response.json(paginate(page, params));
  };
}
