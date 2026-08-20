/**
 * Read-only catalogue administration.
 *
 * Every handler here is a `GET` that reports state. Nothing starts a crawl,
 * changes a lifecycle or edits a product — not because those would be hard,
 * but because an unauthenticated surface that can do them is an incident
 * waiting for someone to find the URL.
 *
 * The whole router is refused unless `ADMIN_ENABLED` is set, and it must stay
 * off in production until an authentication mechanism is separately approved.
 */

import type { Request, Response, NextFunction } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { CrawlRun, type CrawlRunRecord } from "../models/CrawlRun";
import { ProductOffer } from "../models/ProductOffer";
import { RetailStore, type RetailStoreRecord } from "../models/RetailStore";
import { Retailer, type RetailerRecord } from "../models/Retailer";
import { assessCrawlTrust } from "../catalogue/core/availabilityReconciliation";

/**
 * Refuses the whole admin surface unless it has been deliberately enabled, and
 * refuses it in production regardless.
 *
 * Two conditions rather than one: a misplaced `ADMIN_ENABLED=true` in a
 * production environment must not be the only thing standing between the
 * internet and the catalogue's internals.
 */
export function requireAdminEnabled(config: AppConfig) {
  return (_request: Request, _response: Response, next: NextFunction): void => {
    if (!config.adminEnabled || config.nodeEnv === "production") {
      next(ApiError.notFound("Not found."));
      return;
    }

    next();
  };
}

export function createRetailerOverviewHandler() {
  return async (_request: Request, response: Response): Promise<void> => {
    const retailers = await Retailer.find({}).sort({ name: 1 }).lean<RetailerRecord[]>();

    const rows = await Promise.all(
      retailers.map(async (retailer) => {
        const stores = await RetailStore.find({ retailerId: retailer._id }).lean<
          RetailStoreRecord[]
        >();

        const storeRows = await Promise.all(
          stores.map(async (store) => {
            const [total, eligible, newest] = await Promise.all([
              ProductOffer.countDocuments({
                retailerId: retailer._id,
                storeId: store._id,
                available: true,
              }),
              ProductOffer.countDocuments({
                retailerId: retailer._id,
                storeId: store._id,
                available: true,
                eligibleForPlanning: true,
              }),
              ProductOffer.findOne({ retailerId: retailer._id, storeId: store._id })
                .sort({ lastCheckedAt: -1 })
                .select({ lastCheckedAt: 1 })
                .lean(),
            ]);

            const lastCheckedAt = newest?.lastCheckedAt ?? null;
            const ageHours = lastCheckedAt
              ? (Date.now() - lastCheckedAt.getTime()) / (60 * 60 * 1000)
              : null;

            return {
              storeId: store._id.toString(),
              externalStoreId: store.externalStoreId,
              name: store.name,
              enabled: store.enabled,
              availableProducts: total,
              eligibleProducts: eligible,
              lastCheckedAt: lastCheckedAt?.toISOString() ?? null,
              catalogueAgeHours: ageHours === null ? null : Math.round(ageHours),
              // Never crawled reads as stale, not as fresh: absent data must
              // not look up to date.
              isStale:
                ageHours === null || ageHours > retailer.crawlPolicy.staleAfterHours,
            };
          }),
        );

        return {
          retailerId: retailer._id.toString(),
          slug: retailer.slug,
          name: retailer.name,
          status: retailer.status,
          adapterKey: retailer.adapterKey,
          catalogueScope: retailer.catalogueScope,
          staleAfterHours: retailer.crawlPolicy.staleAfterHours,
          stores: storeRows,
        };
      }),
    );

    response.json({ retailers: rows });
  };
}

/** How many runs one screen shows. Bounded so a long history cannot flood it. */
const CRAWL_RUN_LIMIT = 50;

export function createCrawlRunsHandler() {
  return async (_request: Request, response: Response): Promise<void> => {
    const runs = await CrawlRun.find({})
      .sort({ createdAt: -1 })
      .limit(CRAWL_RUN_LIMIT)
      .lean<CrawlRunRecord[]>();

    response.json({
      runs: runs.map((run) => {
        const trust = assessCrawlTrust(run);

        return {
          crawlRunId: run._id.toString(),
          retailerId: run.retailerId.toString(),
          storeId: run.storeId?.toString() ?? null,
          adapterKey: run.adapterKey,
          adapterVersion: run.adapterVersion,
          mode: run.mode,
          status: run.status,
          startedAt: run.startedAt?.toISOString() ?? null,
          completedAt: run.completedAt?.toISOString() ?? null,
          durationMs:
            run.startedAt && run.completedAt
              ? run.completedAt.getTime() - run.startedAt.getTime()
              : null,
          categoriesRequested: run.categoriesRequested,
          categoriesCompleted: run.categoriesCompleted,
          productsDiscovered: run.productsDiscovered,
          productsInserted: run.productsInserted,
          productsUpdated: run.productsUpdated,
          priceChanges: run.priceChanges,
          failures: run.failures,
          storeSelectionVerified: run.storeSelectionVerified,
          availabilityReconciled: run.availabilityReconciled,
          offersRetired: run.offersRetired,
          // The reasons a run may not retire products, shown plainly: "why
          // didn't availability update?" is the question this screen exists
          // to answer.
          reconciliationEligible: trust.trusted,
          reconciliationRefusals: trust.refusals,
          errorCount: run.errors.length,
        };
      }),
    });
  };
}

export function createCatalogueQualityHandler() {
  return async (_request: Request, response: Response): Promise<void> => {
    const rows = await ProductOffer.aggregate<{
      _id: { retailerSlug: string; storeSlug: string };
      offers: number;
      available: number;
      eligible: number;
      retired: number;
    }>([
      {
        $group: {
          _id: { retailerSlug: "$retailerSlug", storeSlug: "$storeSlug" },
          offers: { $sum: 1 },
          available: { $sum: { $cond: ["$available", 1, 0] } },
          eligible: {
            $sum: {
              $cond: [
                { $and: ["$available", "$eligibleForPlanning"] },
                1,
                0,
              ],
            },
          },
          retired: {
            $sum: { $cond: [{ $ne: ["$retiredByCrawlRunId", null] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.retailerSlug": 1, "_id.storeSlug": 1 } },
    ]);

    response.json({
      catalogues: rows.map((row) => ({
        retailerSlug: row._id.retailerSlug,
        storeSlug: row._id.storeSlug,
        offers: row.offers,
        available: row.available,
        eligible: row.eligible,
        retired: row.retired,
        eligibleShare: row.available === 0 ? 0 : row.eligible / row.available,
      })),
    });
  };
}
