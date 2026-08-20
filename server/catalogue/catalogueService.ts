import { Types } from "mongoose";
import { Product, type CatalogueSafetyStatus } from "../models/Product";
import { ProductOffer } from "../models/ProductOffer";
import type { CatalogueReadSource } from "./core/catalogueTypes";
import type { ResolvedCatalogueScope } from "./core/retailerTypes";

const SAFETY_STATUSES: CatalogueSafetyStatus[] = [
  "verified",
  "inferred",
  "incomplete",
  "ambiguous",
];

export type SafetyBreakdown = Record<CatalogueSafetyStatus, number>;

/**
 * The public view of one retailer/store catalogue.
 *
 * The four internal safety statuses are kept as they are: they are what the
 * crawler records and what the admin surface diagnoses from. The spec's
 * narrower public vocabulary is a presentation concern, mapped at the
 * boundary rather than by rewriting every stored document.
 */
export interface CatalogueStatus {
  retailerId: string;
  retailer: string;
  retailerName: string;
  storeId: string;
  storeSlug: string;
  storeName: string;
  availableProducts: number;
  eligibleProducts: number;
  lastCheckedAt: string | null;
  isStale: boolean;
  /** Whether a new plan may be generated against this catalogue right now. */
  selectable: boolean;
  safetyBreakdown: SafetyBreakdown;
}

/** One aggregation bucket: available products sharing a safety status. */
export interface CatalogueCountRow {
  catalogueSafetyStatus: CatalogueSafetyStatus;
  available: number;
  /** Available, planning-eligible and priced — the products a plan can use. */
  eligible: number;
  lastCheckedAt: Date | null;
}

export interface SummarizeOptions {
  scope: ResolvedCatalogueScope;
  now: Date;
  staleAfterHours: number;
}

/**
 * Folds aggregation buckets into the public status shape. Separated from the
 * query so counting and freshness rules are testable without a database.
 *
 * A catalogue that has never been crawled is stale, not fresh: absent data
 * must never read as up-to-date.
 */
export function summarizeCatalogue(
  rows: CatalogueCountRow[],
  options: SummarizeOptions,
): CatalogueStatus {
  const safetyBreakdown = Object.fromEntries(
    SAFETY_STATUSES.map((status) => [status, 0]),
  ) as SafetyBreakdown;

  let availableProducts = 0;
  let eligibleProducts = 0;
  let lastCheckedAt: Date | null = null;

  for (const row of rows) {
    safetyBreakdown[row.catalogueSafetyStatus] += row.available;
    availableProducts += row.available;
    eligibleProducts += row.eligible;

    if (row.lastCheckedAt && (!lastCheckedAt || row.lastCheckedAt > lastCheckedAt)) {
      lastCheckedAt = row.lastCheckedAt;
    }
  }

  const staleAfterMs = options.staleAfterHours * 60 * 60 * 1000;
  const isStale =
    lastCheckedAt === null ||
    options.now.getTime() - lastCheckedAt.getTime() > staleAfterMs;

  return {
    retailerId: options.scope.retailerId,
    retailer: options.scope.retailerSlug,
    retailerName: options.scope.retailerName,
    storeId: options.scope.storeId,
    storeSlug: options.scope.storeSlug,
    storeName: options.scope.storeName,
    availableProducts,
    eligibleProducts,
    lastCheckedAt: lastCheckedAt?.toISOString() ?? null,
    isStale,
    // A stale or non-active catalogue may still be *read*; it simply may not
    // back a new plan. Saying so here is what lets the client offer the right
    // recovery instead of a generic failure.
    selectable: options.scope.status === "active" && !isStale && eligibleProducts > 0,
    safetyBreakdown,
  };
}

interface AggregatedRow {
  _id: CatalogueSafetyStatus;
  available: number;
  eligible: number;
  lastCheckedAt: Date | null;
}

/**
 * Counts are produced by the database rather than by loading documents: the
 * catalogue is thousands of products and the endpoint is polled by the UI.
 */
export async function fetchCatalogueCounts(
  scope: ResolvedCatalogueScope,
  source: CatalogueReadSource = "legacy",
): Promise<CatalogueCountRow[]> {
  const rows =
    source === "offers"
      ? await countFromOffers(scope)
      : await countFromLegacy(scope);

  return rows.map((row) => ({
    catalogueSafetyStatus: row._id,
    available: row.available,
    eligible: row.eligible,
    lastCheckedAt: row.lastCheckedAt ?? null,
  }));
}

function countFromLegacy(scope: ResolvedCatalogueScope) {
  return Product.aggregate<AggregatedRow>([
    {
      $match: {
        retailer: scope.retailerSlug,
        storeId: scope.storeSlug,
        available: true,
      },
    },
    {
      $group: {
        _id: "$catalogueSafetyStatus",
        available: { $sum: 1 },
        eligible: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$eligibleForPlanning", true] },
                  { $gt: ["$pricePence", 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        lastCheckedAt: { $max: "$lastCheckedAt" },
      },
    },
  ]);
}

/**
 * Counted from the offer side, joining to the product only for its safety
 * status. Availability, eligibility and price are the offer's to report — that
 * is the whole reason the offer collection exists.
 */
function countFromOffers(scope: ResolvedCatalogueScope) {
  return ProductOffer.aggregate<AggregatedRow>([
    {
      $match: {
        retailerId: new Types.ObjectId(scope.retailerId),
        storeId: new Types.ObjectId(scope.storeId),
        available: true,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
        pipeline: [{ $project: { catalogueSafetyStatus: 1 } }],
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.catalogueSafetyStatus",
        available: { $sum: 1 },
        eligible: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$eligibleForPlanning", true] },
                  { $gt: ["$priceMinor", 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        lastCheckedAt: { $max: "$lastCheckedAt" },
      },
    },
  ]);
}

export async function getCatalogueStatus(
  options: SummarizeOptions,
  source: CatalogueReadSource = "legacy",
): Promise<CatalogueStatus> {
  return summarizeCatalogue(
    await fetchCatalogueCounts(options.scope, source),
    options,
  );
}
