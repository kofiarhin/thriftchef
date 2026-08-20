/**
 * Public retailer and store discovery.
 *
 * Read-only, and deliberately thin: it reports what the registry already
 * knows. Nothing here decides selectability — that rule lives in one place, in
 * `retailerTypes`, so the list a customer sees and the scope resolution that
 * backs their plan can never disagree about which supermarkets are open.
 */

import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import { parseIdentity } from "./catalogueController";
import {
  findRetailer,
  listRetailers,
  listStores,
  type PublicRetailer,
  type PublicStore,
} from "./retailerRegistry";
import {
  SUPPORTED_COUNTRY_CODES,
  type CountryCode,
} from "./core/retailerTypes";

function parseCountryCode(raw: unknown): CountryCode {
  if (raw === undefined) return "GB";

  if (typeof raw !== "string") {
    throw ApiError.badRequest("countryCode must be a single string value.");
  }

  const value = raw.trim().toUpperCase();
  if (!(SUPPORTED_COUNTRY_CODES as readonly string[]).includes(value)) {
    throw ApiError.badRequest(
      `countryCode must be one of: ${SUPPORTED_COUNTRY_CODES.join(", ")}.`,
    );
  }

  return value as CountryCode;
}

export interface RetailerListResponse {
  retailers: PublicRetailer[];
}

export function createRetailerListHandler(_config: AppConfig) {
  return async (request: Request, response: Response): Promise<void> => {
    const countryCode = parseCountryCode(request.query.countryCode);
    const retailers = await listRetailers(countryCode);

    addLogContext(response, {
      countryCode,
      retailerCount: retailers.length,
      selectableCount: retailers.filter((entry) => entry.selectable).length,
    });

    response.json({ retailers } satisfies RetailerListResponse);
  };
}

export interface StoreListResponse {
  retailerId: string;
  stores: PublicStore[];
}

export function createStoreListHandler(_config: AppConfig) {
  return async (request: Request, response: Response): Promise<void> => {
    const identity = parseIdentity(request.params.retailerId, "retailerId");
    const retailer = identity ? await findRetailer(identity) : null;

    if (!retailer) {
      throw ApiError.retailerNotFound("That supermarket is not one we support.", {
        suggestions: ["Choose a supermarket from the list."],
      });
    }

    // Always scoped to the retailer in the path. A store listing that could be
    // read without naming its owner is how a store ends up selected under the
    // wrong supermarket.
    const stores = await listStores(retailer._id);

    addLogContext(response, {
      retailer: retailer.slug,
      storeCount: stores.length,
    });

    response.json({
      retailerId: retailer._id.toString(),
      stores,
    } satisfies StoreListResponse);
  };
}
