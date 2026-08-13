import { Product, type CatalogueSafetyStatus } from "../models/Product";

const RETAILER = "aldi-uk" as const;

const SAFETY_STATUSES: CatalogueSafetyStatus[] = [
  "verified",
  "inferred",
  "incomplete",
  "ambiguous",
];

export type SafetyBreakdown = Record<CatalogueSafetyStatus, number>;

export interface CatalogueStatus {
  retailer: typeof RETAILER;
  storeId: string;
  availableProducts: number;
  eligibleProducts: number;
  lastCheckedAt: string | null;
  isStale: boolean;
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
  storeId: string;
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
    retailer: RETAILER,
    storeId: options.storeId,
    availableProducts,
    eligibleProducts,
    lastCheckedAt: lastCheckedAt?.toISOString() ?? null,
    isStale,
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
  storeId: string,
): Promise<CatalogueCountRow[]> {
  const rows = await Product.aggregate<AggregatedRow>([
    { $match: { retailer: RETAILER, storeId, available: true } },
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

  return rows.map((row) => ({
    catalogueSafetyStatus: row._id,
    available: row.available,
    eligible: row.eligible,
    lastCheckedAt: row.lastCheckedAt ?? null,
  }));
}

export async function getCatalogueStatus(
  options: SummarizeOptions,
): Promise<CatalogueStatus> {
  return summarizeCatalogue(await fetchCatalogueCounts(options.storeId), options);
}
