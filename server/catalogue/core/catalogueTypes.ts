/**
 * The catalogue projection planning is allowed to see.
 *
 * Deliberately narrower than a product document: crawl metadata, raw label
 * text and internal safety notes have no place in a plan. Defined here rather
 * than beside either reader so the legacy path and the offer path are provably
 * producing the same thing.
 */

import type { CatalogueSafetyStatus } from "../../models/Product";

export interface CandidateProduct {
  retailerProductId: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  packageSizeRaw: string | null;
  dietaryInformationRaw: string | null;
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  productUrl: string;
  imageUrl?: string | null;
  lastSeenAt: Date;
  /**
   * Which crawl last confirmed this product, and when. Carried into the plan
   * snapshot so a basket can always be traced back to the run that priced it.
   */
  lastCheckedAt: Date;
  lastCrawlRunId: string;
}

/**
 * Which collection the catalogue is read from.
 *
 * The migration switches this, not the query sites. Rolling back to `legacy`
 * is a configuration change: the legacy fields were never dropped, so the old
 * path still answers correctly at any point.
 */
export const CATALOGUE_READ_SOURCES = ["legacy", "offers"] as const;
export type CatalogueReadSource = (typeof CATALOGUE_READ_SOURCES)[number];
