/**
 * Retiring products that have left the shelf.
 *
 * This is the only destructive write in the catalogue, and the failure mode is
 * severe: a crawl that stops half way has *not* discovered that the second
 * half of the shop closed down. Marking those products unavailable would empty
 * a working catalogue and break planning for every user of that store, with no
 * error anywhere to explain it.
 *
 * So reconciliation is refused by default and permitted only when a run can
 * demonstrate it saw the whole catalogue. Every condition below is a way a run
 * can fail to know that. They are checked together and reported together, so
 * an operator asking "why didn't it reconcile?" gets the full answer rather
 * than the first reason.
 */

import { Types } from "mongoose";
import {
  TRUSTED_CRAWL_STATUSES,
  type CrawlRunRecord,
} from "../../models/CrawlRun";
import { ProductOffer } from "../../models/ProductOffer";
import type { ResolvedCatalogueScope } from "./retailerTypes";

/**
 * How much of a crawl may fail before its coverage is doubtful.
 *
 * Not zero: a handful of transient request failures across thousands of pages
 * is normal and does not mean the catalogue was missed. A tenth of it failing
 * means something systemic — a layout change, a block, a network fault — and
 * the products "missing" are far more likely to be unseen than gone.
 */
export const MAX_FAILURE_RATE = 0.1;

/** Category coverage below this suggests the crawl did not finish its sweep. */
export const MIN_CATEGORY_COMPLETION = 1;

export type ReconciliationRefusal =
  | "NOT_A_FULL_CRAWL"
  | "RUN_NOT_TRUSTED"
  | "STORE_SELECTION_UNVERIFIED"
  | "CATEGORIES_INCOMPLETE"
  | "TOO_MANY_FAILURES"
  | "NOTHING_DISCOVERED";

export interface TrustAssessment {
  trusted: boolean;
  refusals: ReconciliationRefusal[];
}

/**
 * Whether a run may retire products.
 *
 * Pure, so the rule can be exercised exhaustively without a database, and so
 * the reasons a run was refused are inspectable rather than buried in a query.
 */
export function assessCrawlTrust(run: CrawlRunRecord): TrustAssessment {
  const refusals: ReconciliationRefusal[] = [];

  // A bounded or diagnostic run deliberately looked at part of the shop. It
  // cannot distinguish "gone" from "not looked at".
  if (run.mode !== "full") refusals.push("NOT_A_FULL_CRAWL");

  // Failed, cancelled and still-running crawls all stopped early, whatever the
  // reason. None of them saw the whole catalogue.
  if (!TRUSTED_CRAWL_STATUSES.includes(run.status)) refusals.push("RUN_NOT_TRUSTED");

  // Without confirming the store, the run may have been reading a different
  // branch's shelves — in which case every "missing" product is missing from
  // the wrong shop.
  if (!run.storeSelectionVerified) refusals.push("STORE_SELECTION_UNVERIFIED");

  const completion =
    run.categoriesRequested === 0
      ? 0
      : run.categoriesCompleted / run.categoriesRequested;
  if (completion < MIN_CATEGORY_COMPLETION) refusals.push("CATEGORIES_INCOMPLETE");

  const attempted = run.productsDiscovered + run.failures;
  if (attempted > 0 && run.failures / attempted > MAX_FAILURE_RATE) {
    refusals.push("TOO_MANY_FAILURES");
  }

  // A "successful" run that found nothing is a selector that stopped matching,
  // not a shop with no products in it.
  if (run.productsDiscovered === 0) refusals.push("NOTHING_DISCOVERED");

  return { trusted: refusals.length === 0, refusals };
}

export interface ReconciliationResult {
  reconciled: boolean;
  refusals: ReconciliationRefusal[];
  offersRetired: number;
}

/**
 * Marks every offer this run did not see as unavailable.
 *
 * Scoped to one retailer and store, always. Reconciliation is the single most
 * dangerous query in the system, and one written without a scope would retire
 * another supermarket's entire catalogue.
 *
 * Retirement records which run did it, so a mistake can be undone precisely
 * rather than by restoring a backup.
 */
export async function reconcileAvailability(
  run: CrawlRunRecord,
  scope: ResolvedCatalogueScope,
  now: Date = new Date(),
): Promise<ReconciliationResult> {
  const trust = assessCrawlTrust(run);

  if (!trust.trusted) {
    return { reconciled: false, refusals: trust.refusals, offersRetired: 0 };
  }

  const crawlRunId = run._id.toString();

  const result = await ProductOffer.updateMany(
    {
      retailerId: new Types.ObjectId(scope.retailerId),
      storeId: new Types.ObjectId(scope.storeId),
      available: true,
      // Anything this run touched was seen. Everything else was not.
      lastCrawlRunId: { $ne: crawlRunId },
    },
    {
      $set: {
        available: false,
        unavailableSince: now,
        retiredByCrawlRunId: crawlRunId,
        lastCheckedAt: now,
      },
    },
  );

  return {
    reconciled: true,
    refusals: [],
    offersRetired: result.modifiedCount ?? 0,
  };
}

/**
 * Puts back everything one reconciliation run retired.
 *
 * The safety net that makes reconciliation an acceptable risk at all: a bad
 * sweep is reversible by run id, without touching offers retired by any other
 * run and without a database restore.
 */
export async function undoReconciliation(
  crawlRunId: string,
  scope: ResolvedCatalogueScope,
  now: Date = new Date(),
): Promise<{ offersRestored: number }> {
  const result = await ProductOffer.updateMany(
    {
      retailerId: new Types.ObjectId(scope.retailerId),
      storeId: new Types.ObjectId(scope.storeId),
      retiredByCrawlRunId: crawlRunId,
    },
    {
      $set: { available: true, lastCheckedAt: now },
      $unset: { unavailableSince: "", retiredByCrawlRunId: "" },
    },
  );

  return { offersRestored: result.modifiedCount ?? 0 };
}
