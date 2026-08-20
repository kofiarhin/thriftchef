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
