/**
 * The vocabulary of catalogue ownership.
 *
 * Retailers are records rather than a fixed union, so adding a supermarket is
 * a row and an adapter, never a schema migration. What stays closed is the
 * *lifecycle*: an unknown status must not quietly behave like `active`.
 */

/**
 * Where a retailer's prices are decided.
 *
 * `national` still resolves to one logical store, so every plan has exactly
 * one catalogue scope and no query can be written that forgets to name one.
 */
export const CATALOGUE_SCOPE_KINDS = ["national", "regional", "store"] as const;
export type CatalogueScopeKind = (typeof CATALOGUE_SCOPE_KINDS)[number];

/**
 * A retailer's integration lifecycle.
 *
 * Only `active` is selectable by a customer. `validating` is a retailer whose
 * catalogue exists but has not passed its activation gates; `degraded` is one
 * whose catalogue is live but currently untrustworthy. Neither may back a new
 * plan, and neither invalidates plans already generated.
 */
export const RETAILER_STATUSES = [
  "development",
  "validating",
  "active",
  "degraded",
  "disabled",
] as const;
export type RetailerStatus = (typeof RETAILER_STATUSES)[number];

/** The lifecycle states a customer may generate against. */
export const SELECTABLE_RETAILER_STATUSES: RetailerStatus[] = ["active"];

export function isSelectableStatus(status: RetailerStatus): boolean {
  return SELECTABLE_RETAILER_STATUSES.includes(status);
}

export const STORE_SCOPES = ["physical", "online", "regional", "national"] as const;
export type StoreScope = (typeof STORE_SCOPES)[number];

export const SUPPORTED_COUNTRY_CODES = ["GB"] as const;
export type CountryCode = (typeof SUPPORTED_COUNTRY_CODES)[number];

export const SUPPORTED_CURRENCIES = ["GBP"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * Slugs are the stable, human-readable half of the dual key. They are what the
 * existing Aldi catalogue is written under and what the public API accepts, so
 * they outrank the ObjectId for compatibility purposes even though the
 * ObjectId is the canonical join key.
 */
export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function isSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

/** Per-retailer pacing and freshness policy. */
export interface CrawlPolicy {
  schedule: string | null;
  maxConcurrency: number;
  requestsPerMinute: number;
  staleAfterHours: number;
}

export const DEFAULT_CRAWL_POLICY: CrawlPolicy = {
  schedule: null,
  maxConcurrency: 1,
  requestsPerMinute: 30,
  staleAfterHours: 72,
};

/**
 * A retailer and store resolved together, carried by every catalogue query.
 *
 * Both halves of the dual key travel together deliberately. The ObjectIds are
 * what offers join on; the slugs are what the legacy Aldi documents are keyed
 * by and what appears in logs. A query that has this object cannot forget to
 * scope itself, which is the entire reason it exists as one value rather than
 * two loose parameters.
 */
export interface ResolvedCatalogueScope {
  retailerId: string;
  retailerSlug: string;
  retailerName: string;
  storeId: string;
  storeSlug: string;
  storeName: string;
  currency: Currency;
  countryCode: CountryCode;
  catalogueScope: CatalogueScopeKind;
  status: RetailerStatus;
  staleAfterHours: number;
}
