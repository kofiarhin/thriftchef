/**
 * A resolved catalogue scope for tests that exercise planning without a
 * database.
 *
 * Matches the Aldi records the bootstrap creates, so a test using this fixture
 * and a request running against a real bootstrapped database are scoped
 * identically — the fixture is a stand-in, not a different shape.
 */

import type { ResolvedCatalogueScope } from "../catalogue/core/retailerTypes";

/** Stable object ids so scoped fixtures are reproducible across runs. */
export const ALDI_RETAILER_ID = "000000000000000000000a1d";
export const ALDI_STORE_ID = "000000000000000000005702";

export const ALDI_SCOPE: ResolvedCatalogueScope = {
  retailerId: ALDI_RETAILER_ID,
  retailerSlug: "aldi-uk",
  retailerName: "Aldi UK",
  storeId: ALDI_STORE_ID,
  storeSlug: "belper-de56-1ar",
  storeName: "Aldi Belper",
  currency: "GBP",
  countryCode: "GB",
  catalogueScope: "store",
  status: "active",
  staleAfterHours: 72,
};

export function scopeFor(
  overrides: Partial<ResolvedCatalogueScope> = {},
): ResolvedCatalogueScope {
  return { ...ALDI_SCOPE, ...overrides };
}

/**
 * Tesco, as a second retailer for isolation tests.
 *
 * Two stores rather than one, because "products from another retailer" and
 * "products from another branch of the same retailer" are different leaks and
 * only the second one is easy to write by accident.
 *
 * `development` matches the seeded record: Tesco is not selectable, and a test
 * that needs it to be says so explicitly rather than inheriting it.
 */
export const TESCO_RETAILER_ID = "000000000000000000000e5c";
export const TESCO_STORE_A_ID = "000000000000000000005703";
export const TESCO_STORE_B_ID = "000000000000000000005704";

export const TESCO_SCOPE: ResolvedCatalogueScope = {
  retailerId: TESCO_RETAILER_ID,
  retailerSlug: "tesco-uk",
  retailerName: "Tesco UK",
  storeId: TESCO_STORE_A_ID,
  storeSlug: "tesco-online-gb",
  storeName: "Tesco Online (delivery)",
  currency: "GBP",
  countryCode: "GB",
  catalogueScope: "store",
  status: "development",
  staleAfterHours: 72,
};

/** A second Tesco scope: same retailer, different catalogue. */
export const TESCO_STORE_B_SCOPE: ResolvedCatalogueScope = {
  ...TESCO_SCOPE,
  storeId: TESCO_STORE_B_ID,
  storeSlug: "tesco-online-north",
  storeName: "Tesco Online (north)",
};

export function tescoScopeFor(
  overrides: Partial<ResolvedCatalogueScope> = {},
): ResolvedCatalogueScope {
  return { ...TESCO_SCOPE, ...overrides };
}
