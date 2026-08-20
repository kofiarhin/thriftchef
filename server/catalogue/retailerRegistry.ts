/**
 * Resolves a requested retailer and store into the one value every catalogue
 * query is allowed to run under.
 *
 * This is the choke point for catalogue ownership. A caller cannot obtain a
 * scope for an inactive retailer, for a store belonging to someone else, or
 * for a retailer that does not exist — so "products from two retailers ended
 * up in one plan" is not a bug that can be written downstream, because there
 * is no downstream value that spans two retailers.
 *
 * Both halves of the dual key are accepted. The public API speaks slugs
 * because that is what the existing Aldi catalogue and the saved client
 * profiles use; ObjectIds are accepted because that is what offers join on.
 */

import { isValidObjectId, Types } from "mongoose";
import { ApiError } from "../http/errors";
import { Retailer, type RetailerRecord } from "../models/Retailer";
import { RetailStore, type RetailStoreRecord } from "../models/RetailStore";
import {
  isSelectableStatus,
  type CountryCode,
  type ResolvedCatalogueScope,
} from "./core/retailerTypes";

/** What a client may name a retailer or store by. */
export interface CatalogueScopeRequest {
  retailer: string;
  store?: string;
}

export interface PublicRetailer {
  id: string;
  slug: string;
  name: string;
  countryCode: CountryCode;
  currency: string;
  logoUrl: string | null;
  catalogueScope: string;
  /** Whether a customer may generate against it right now. */
  selectable: boolean;
  /** True when the retailer's catalogue is scoped per store. */
  requiresStoreSelection: boolean;
}

export interface PublicStore {
  id: string;
  externalStoreId: string;
  name: string;
  postcode: string | null;
  scope: string;
  lastSuccessfulCrawlAt: string | null;
}

/**
 * Adapter configuration is deliberately absent. A customer has no business
 * knowing which adapter backs a retailer, and leaking `adapterKey` would turn
 * an internal registry key into a public contract.
 */
export function toPublicRetailer(retailer: RetailerRecord): PublicRetailer {
  return {
    id: retailer._id.toString(),
    slug: retailer.slug,
    name: retailer.name,
    countryCode: retailer.countryCode,
    currency: retailer.currency,
    logoUrl: retailer.logoUrl,
    catalogueScope: retailer.catalogueScope,
    selectable: isSelectableStatus(retailer.status),
    requiresStoreSelection: retailer.catalogueScope === "store",
  };
}

export function toPublicStore(store: RetailStoreRecord): PublicStore {
  return {
    id: store._id.toString(),
    externalStoreId: store.externalStoreId,
    name: store.name,
    postcode: store.postcode,
    scope: store.scope,
    lastSuccessfulCrawlAt: store.lastSuccessfulCrawlAt?.toISOString() ?? null,
  };
}

/**
 * Matches either half of the dual key without ever letting a slug be read as
 * an id. A 24-character hex string is a valid slug by pattern, so the ObjectId
 * branch is tried first and the slug branch is a genuine alternative rather
 * than a fallback that could match the wrong document.
 */
function identityFilter(value: string, slugField: string): Record<string, unknown> {
  const trimmed = value.trim().toLowerCase();

  return isValidObjectId(trimmed)
    ? { $or: [{ _id: new Types.ObjectId(trimmed) }, { [slugField]: trimmed }] }
    : { [slugField]: trimmed };
}

export async function findRetailer(identity: string): Promise<RetailerRecord | null> {
  return Retailer.findOne(identityFilter(identity, "slug")).lean<RetailerRecord>();
}

export async function listRetailers(
  countryCode: CountryCode = "GB",
): Promise<PublicRetailer[]> {
  const retailers = await Retailer.find({ countryCode })
    .sort({ name: 1 })
    .lean<RetailerRecord[]>();

  return retailers.map(toPublicRetailer);
}

export async function listStores(retailerId: Types.ObjectId): Promise<PublicStore[]> {
  const stores = await RetailStore.find({ retailerId, enabled: true })
    .sort({ name: 1 })
    .lean<RetailStoreRecord[]>();

  return stores.map(toPublicStore);
}

/**
 * The store a request resolves to.
 *
 * A national or regional catalogue still resolves to exactly one store row, so
 * an omitted store is only legal when the retailer has precisely one enabled
 * store to fall back to. Guessing between several would silently price a plan
 * against a shop the user never chose.
 */
async function resolveStore(
  retailer: RetailerRecord,
  requested: string | undefined,
): Promise<RetailStoreRecord> {
  if (requested) {
    const store = await RetailStore.findOne({
      retailerId: retailer._id,
      ...identityFilter(requested, "externalStoreId"),
    }).lean<RetailStoreRecord>();

    if (!store) {
      throw ApiError.storeNotFound(
        `${retailer.name} has no store matching that selection.`,
        { retailer: retailer.slug, suggestions: ["Choose a store from the list."] },
      );
    }

    if (!store.enabled) {
      throw ApiError.storeNotFound(`That ${retailer.name} store is not available.`, {
        retailer: retailer.slug,
      });
    }

    return store;
  }

  const enabled = await RetailStore.find({ retailerId: retailer._id, enabled: true })
    .limit(2)
    .lean<RetailStoreRecord[]>();

  if (enabled.length === 1) return enabled[0];

  if (enabled.length === 0) {
    throw ApiError.storeNotFound(`${retailer.name} has no catalogue configured yet.`, {
      retailer: retailer.slug,
    });
  }

  throw ApiError.storeNotFound(`Choose which ${retailer.name} store to plan from.`, {
    retailer: retailer.slug,
    suggestions: ["Select a store before generating a plan."],
  });
}

export function toScope(
  retailer: RetailerRecord,
  store: RetailStoreRecord,
): ResolvedCatalogueScope {
  return {
    retailerId: retailer._id.toString(),
    retailerSlug: retailer.slug,
    retailerName: retailer.name,
    storeId: store._id.toString(),
    storeSlug: store.externalStoreId,
    storeName: store.name,
    currency: retailer.currency,
    countryCode: retailer.countryCode,
    catalogueScope: retailer.catalogueScope,
    status: retailer.status,
    staleAfterHours: retailer.crawlPolicy.staleAfterHours,
  };
}

export interface ResolveOptions {
  /**
   * Whether the caller is about to build a *new* plan. Reading an existing
   * plan against a degraded retailer is fine and must keep working; building
   * another one against it is not.
   */
  requireSelectable?: boolean;
}

export async function resolveCatalogueScope(
  request: CatalogueScopeRequest,
  options: ResolveOptions = {},
): Promise<ResolvedCatalogueScope> {
  const retailer = await findRetailer(request.retailer);

  if (!retailer) {
    throw ApiError.retailerNotFound("That supermarket is not one we support.", {
      suggestions: ["Choose a supermarket from the list."],
    });
  }

  if (options.requireSelectable !== false && !isSelectableStatus(retailer.status)) {
    throw ApiError.retailerNotActive(
      `${retailer.name} is not available for planning at the moment.`,
      {
        retailer: retailer.slug,
        suggestions: [
          "Choose another supermarket.",
          "Try again later — this is usually temporary.",
        ],
      },
    );
  }

  return toScope(retailer, await resolveStore(retailer, request.store));
}
