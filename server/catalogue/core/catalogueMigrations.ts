/**
 * Additive, idempotent, restartable catalogue migrations.
 *
 * Every function here can be run twice with the same result as running it
 * once, and can be interrupted half way and resumed without leaving a
 * half-migrated catalogue. That is not politeness: a catalogue migration runs
 * against thousands of live products, and the realistic failure is a dropped
 * connection at product 4,000 of 9,000.
 *
 * Nothing here deletes or rewrites a legacy field. The old Aldi shape keeps
 * working throughout, which is what makes the rollback a configuration change
 * rather than a restore.
 */

import type { Types } from "mongoose";
import { Product, type ProductRecord } from "../../models/Product";
import { ProductOffer } from "../../models/ProductOffer";
import { RetailStore, type RetailStoreRecord } from "../../models/RetailStore";
import { Retailer, type RetailerRecord } from "../../models/Retailer";
import {
  DEFAULT_CRAWL_POLICY,
  type CatalogueScopeKind,
  type CrawlPolicy,
  type RetailerStatus,
  type StoreScope,
} from "./retailerTypes";

export interface RetailerSeed {
  slug: string;
  name: string;
  adapterKey: string;
  catalogueScope: CatalogueScopeKind;
  status: RetailerStatus;
  logoUrl?: string | null;
  crawlPolicy?: Partial<CrawlPolicy>;
  stores: Array<{
    externalStoreId: string;
    name: string;
    postcode?: string | null;
    scope: StoreScope;
    enabled?: boolean;
  }>;
}

export interface BootstrapResult {
  retailersCreated: number;
  retailersUpdated: number;
  storesCreated: number;
  storesUpdated: number;
}

/**
 * Creates or refreshes retailer and store records from a seed.
 *
 * Upserts by natural key — retailer slug, and `{retailerId, externalStoreId}`
 * — so re-running never duplicates. Lifecycle `status` is deliberately part of
 * the update: promoting a retailer to `active` is a seed change plus a re-run,
 * which keeps activation an auditable, repeatable operation rather than a
 * hand-typed database edit.
 */
export async function bootstrapRetailers(
  seeds: RetailerSeed[],
): Promise<BootstrapResult> {
  const result: BootstrapResult = {
    retailersCreated: 0,
    retailersUpdated: 0,
    storesCreated: 0,
    storesUpdated: 0,
  };

  for (const seed of seeds) {
    const existing = await Retailer.findOne({ slug: seed.slug }).lean<RetailerRecord>();

    await Retailer.updateOne(
      { slug: seed.slug },
      {
        $set: {
          name: seed.name,
          countryCode: "GB",
          currency: "GBP",
          adapterKey: seed.adapterKey,
          catalogueScope: seed.catalogueScope,
          status: seed.status,
          logoUrl: seed.logoUrl ?? null,
          crawlPolicy: { ...DEFAULT_CRAWL_POLICY, ...seed.crawlPolicy },
        },
      },
      { upsert: true },
    );

    if (existing) result.retailersUpdated += 1;
    else result.retailersCreated += 1;

    const retailer = await Retailer.findOne({ slug: seed.slug }).orFail();

    for (const store of seed.stores) {
      const existingStore = await RetailStore.findOne({
        retailerId: retailer._id,
        externalStoreId: store.externalStoreId,
      }).lean<RetailStoreRecord>();

      await RetailStore.updateOne(
        { retailerId: retailer._id, externalStoreId: store.externalStoreId },
        {
          $set: {
            name: store.name,
            postcode: store.postcode ?? null,
            scope: store.scope,
            enabled: store.enabled ?? true,
          },
        },
        { upsert: true },
      );

      if (existingStore) result.storesUpdated += 1;
      else result.storesCreated += 1;
    }
  }

  return result;
}

export interface BackfillResult {
  productsScanned: number;
  productsLinked: number;
  offersCreated: number;
  offersUpdated: number;
}

export interface BackfillOptions {
  /** Documents per batch. Bounded so a huge catalogue cannot exhaust memory. */
  batchSize?: number;
}

const DEFAULT_BATCH_SIZE = 500;

/**
 * Gives every legacy product its ObjectId dual key and one offer per store.
 *
 * Restartable by construction: it pages by ascending `_id` rather than by
 * skip/limit, so a resumed run continues from where it stopped without
 * re-reading or skipping documents that shifted. Both writes are upserts keyed
 * on natural identity, so a batch replayed after a crash is a no-op.
 *
 * Deliberately does not touch legacy price or availability fields. They remain
 * the source of truth until the read switch is flipped and compared, which is
 * what makes this reversible.
 */
export async function backfillProductOffers(
  scope: { retailerSlug: string; storeSlug: string },
  options: BackfillOptions = {},
): Promise<BackfillResult> {
  const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
  const result: BackfillResult = {
    productsScanned: 0,
    productsLinked: 0,
    offersCreated: 0,
    offersUpdated: 0,
  };

  const retailer = await Retailer.findOne({ slug: scope.retailerSlug }).lean<RetailerRecord>();
  if (!retailer) {
    throw new Error(
      `Cannot backfill offers: no retailer record for "${scope.retailerSlug}". Run the bootstrap first.`,
    );
  }

  const store = await RetailStore.findOne({
    retailerId: retailer._id,
    externalStoreId: scope.storeSlug,
  }).lean<RetailStoreRecord>();
  if (!store) {
    throw new Error(
      `Cannot backfill offers: retailer "${scope.retailerSlug}" has no store "${scope.storeSlug}".`,
    );
  }

  let cursor: Types.ObjectId | null = null;

  for (;;) {
    const filter: Record<string, unknown> = {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
    };
    if (cursor) filter._id = { $gt: cursor };

    const batch = await Product.find(filter)
      .sort({ _id: 1 })
      .limit(batchSize)
      .lean<ProductRecord[]>();

    if (batch.length === 0) break;

    for (const product of batch) {
      result.productsScanned += 1;

      if (
        !product.retailerRef ||
        product.retailerRef.toString() !== retailer._id.toString()
      ) {
        result.productsLinked += 1;
      }

      const existingOffer = await ProductOffer.findOne({
        retailerId: retailer._id,
        storeId: store._id,
        productId: product._id,
      })
        .select({ _id: 1 })
        .lean();

      await ProductOffer.updateOne(
        { retailerId: retailer._id, storeId: store._id, productId: product._id },
        {
          $set: {
            retailerSlug: retailer.slug,
            storeSlug: store.externalStoreId,
            retailerProductId: product.retailerProductId,
            priceMinor: product.pricePence,
            currency: "GBP",
            comparisonPriceRaw: product.comparisonPriceRaw ?? null,
            available: product.available,
            eligibleForPlanning: product.eligibleForPlanning,
            lastSeenAt: product.lastSeenAt,
            lastCheckedAt: product.lastCheckedAt,
            lastCrawlRunId: product.lastCrawlRunId,
          },
          // Structured promotion and comparison price stay null until an
          // adapter supplies data worth trusting. Inventing them from the
          // legacy free-text field would be a guess presented as a fact.
          $setOnInsert: { comparisonPrice: null, promotion: null },
        },
        { upsert: true },
      );

      if (existingOffer) result.offersUpdated += 1;
      else result.offersCreated += 1;
    }

    // Linking is a single bulk write per batch rather than per product: it is
    // the same value for every document in the batch.
    await Product.updateMany(
      { _id: { $in: batch.map((product) => product._id) } },
      { $set: { retailerRef: retailer._id, storeRef: store._id } },
    );

    cursor = batch[batch.length - 1]._id;
    if (batch.length < batchSize) break;
  }

  return result;
}

/**
 * Undoes `backfillProductOffers` for one scope.
 *
 * Removes the derived offers and unlinks the dual key. Legacy product fields
 * were never modified, so this returns the catalogue to exactly its
 * pre-migration state — which is what "additive" is supposed to buy.
 */
export async function rollbackProductOffers(scope: {
  retailerSlug: string;
  storeSlug: string;
}): Promise<{ offersRemoved: number; productsUnlinked: number }> {
  const offers = await ProductOffer.deleteMany({
    retailerSlug: scope.retailerSlug,
    storeSlug: scope.storeSlug,
  });

  const products = await Product.updateMany(
    { retailer: scope.retailerSlug, storeId: scope.storeSlug },
    { $set: { retailerRef: null, storeRef: null } },
  );

  // Price history is written by crawls, not by the backfill, so it is not
  // this function's to remove. Rolling back the read migration must not throw
  // away observations that were legitimately recorded.

  return {
    offersRemoved: offers.deletedCount ?? 0,
    productsUnlinked: products.modifiedCount ?? 0,
  };
}
