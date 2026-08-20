import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import { getCatalogueStatus } from "./catalogueService";
import { resolveCatalogueScope } from "./retailerRegistry";
import { SLUG_PATTERN, type ResolvedCatalogueScope } from "./core/retailerTypes";

/** Retailer and store are named by slug or object id; anything else is a bad request. */
export function parseIdentity(
  raw: unknown,
  field: string,
  fallback?: string,
): string | undefined {
  if (raw === undefined) return fallback;

  if (typeof raw !== "string") {
    throw ApiError.badRequest(`${field} must be a single string value.`);
  }

  const value = raw.trim().toLowerCase();
  if (!SLUG_PATTERN.test(value)) {
    throw ApiError.badRequest(
      `${field} must be a lowercase slug of up to 64 characters.`,
    );
  }

  return value;
}

export type ScopeResolver = (
  request: Request,
  config: AppConfig,
) => Promise<ResolvedCatalogueScope>;

/**
 * Resolves the scope a catalogue query runs under, from query parameters.
 *
 * `requireSelectable: false` because status is a *reporting* concern here: an
 * operator asking why a retailer is unavailable needs the status endpoint to
 * answer rather than to refuse.
 */
export const resolveScopeFromQuery: ScopeResolver = (request, config) =>
  resolveCatalogueScope(
    {
      retailer:
        parseIdentity(request.query.retailerId, "retailerId", config.defaultRetailerSlug) ??
        config.defaultRetailerSlug,
      store: parseIdentity(request.query.storeId, "storeId"),
    },
    { requireSelectable: false },
  );

export function createCatalogueStatusHandler(
  config: AppConfig,
  resolveScope: ScopeResolver = resolveScopeFromQuery,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const scope = await resolveScope(request, config);

    const status = await getCatalogueStatus(
      {
        scope,
        now: new Date(),
        staleAfterHours: scope.staleAfterHours,
      },
      config.catalogueReadSource,
    );

    addLogContext(response, {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
      eligibleProducts: status.eligibleProducts,
      isStale: status.isStale,
    });

    response.json(status);
  };
}
