import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import { getCatalogueStatus } from "./catalogueService";

/** Store IDs are slugs the operator configures; anything else is a bad request. */
const STORE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function parseStoreId(raw: unknown, fallback: string): string {
  if (raw === undefined) return fallback;

  if (typeof raw !== "string") {
    throw ApiError.badRequest("storeId must be a single string value.");
  }

  const storeId = raw.trim().toLowerCase();
  if (!STORE_ID_PATTERN.test(storeId)) {
    throw ApiError.badRequest(
      "storeId must be a lowercase slug of up to 64 characters.",
    );
  }

  return storeId;
}

export function createCatalogueStatusHandler(config: AppConfig) {
  return async (request: Request, response: Response): Promise<void> => {
    const storeId = parseStoreId(request.query.storeId, config.aldi.storeId);

    const status = await getCatalogueStatus({
      storeId,
      now: new Date(),
      staleAfterHours: config.catalogueStaleAfterHours,
    });

    addLogContext(response, {
      storeId,
      eligibleProducts: status.eligibleProducts,
      isStale: status.isStale,
    });

    response.json(status);
  };
}
