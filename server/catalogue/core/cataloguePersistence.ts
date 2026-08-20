/**
 * Writing a batch of crawled products to the catalogue.
 *
 * Three collections move together: the product's descriptive identity, the
 * store-scoped offer that prices it, and a price-history row when the price
 * actually changed. Doing that in one place is what keeps them consistent —
 * an offer whose price disagrees with its product, or a history that missed a
 * change, is worse than no history at all.
 *
 * Every write is an upsert on a natural key, so a batch replayed after a crash
 * is a no-op and an interrupted crawl keeps the work it finished.
 */

import { Types } from "mongoose";
import { PriceHistory } from "../../models/PriceHistory";
import { Product, type CatalogueSafetyStatus, type ProductRecord } from "../../models/Product";
import { ProductOffer, type ProductOfferRecord } from "../../models/ProductOffer";
import type { NormalizedCatalogueProduct } from "../contracts/normalizedCatalogueProduct";
import { mergeCategoryPaths } from "./catalogueNormalization";
import type { ResolvedCatalogueScope } from "./retailerTypes";

/** A normalized product plus the safety verdict the runner computed for it. */
export interface AssessedProduct extends NormalizedCatalogueProduct {
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  safetyIssues: string[];
}

export interface PersistResult {
  inserted: number;
  updated: number;
  priceChanges: number;
}

/**
 * Upserts one batch.
 *
 * Legacy product fields are still written alongside the offer. That is
 * deliberate for the whole of the migration: it keeps the `legacy` read path
 * answering correctly, which is what makes rolling the read switch back a
 * configuration change rather than a restore.
 */
export async function persistCatalogueBatch(
  products: AssessedProduct[],
  scope: ResolvedCatalogueScope,
  crawlRunId: string,
  now: Date = new Date(),
): Promise<PersistResult> {
  if (products.length === 0) return { inserted: 0, updated: 0, priceChanges: 0 };

  const retailerRef = toObjectId(scope.retailerId);
  const storeRef = toObjectId(scope.storeId);

  const ids = products.map((product) => product.retailerProductId);
  const existing = await Product.find({
    retailer: scope.retailerSlug,
    storeId: scope.storeSlug,
    retailerProductId: { $in: ids },
  }).lean<(ProductRecord & { _id: Types.ObjectId })[]>();

  const existingById = new Map(
    existing.map((product) => [product.retailerProductId, product]),
  );

  let inserted = 0;
  let updated = 0;
  let priceChanges = 0;

  const productOperations = products.map((product) => {
    const previous = existingById.get(product.retailerProductId);
    const priceChanged = Boolean(previous && previous.pricePence !== product.priceMinor);

    if (previous) updated += 1;
    else inserted += 1;
    if (priceChanged) priceChanges += 1;

    return {
      updateOne: {
        filter: {
          retailer: scope.retailerSlug,
          storeId: scope.storeSlug,
          retailerProductId: product.retailerProductId,
        },
        update: {
          $set: {
            retailerRef,
            storeRef,
            name: product.name,
            brand: product.brand,
            description: product.description,
            categoryPaths: mergeCategoryPaths(
              previous?.categoryPaths ?? [],
              product.categoryPaths,
            ),
            pricePence: product.priceMinor,
            previousPricePence: priceChanged
              ? (previous?.pricePence ?? null)
              : (previous?.previousPricePence ?? null),
            priceChangedAt: priceChanged ? now : (previous?.priceChangedAt ?? null),
            packageSizeRaw: product.packageSizeRaw,
            comparisonPriceRaw: product.comparisonPriceRaw,
            ingredientsRaw: product.ingredientsRaw,
            allergenAdviceRaw: product.allergenAdviceRaw,
            dietaryInformationRaw: product.dietaryInformationRaw,
            normalizedAllergens: product.normalizedAllergens,
            catalogueSafetyStatus: product.catalogueSafetyStatus,
            eligibleForPlanning: product.eligibleForPlanning,
            safetyIssues: product.safetyIssues,
            imageUrl: product.imageUrl,
            productUrl: product.productUrl,
            available: true,
            lastCheckedAt: now,
            lastSeenAt: now,
            lastCrawlRunId: crawlRunId,
          },
          $setOnInsert: {
            retailer: scope.retailerSlug,
            storeId: scope.storeSlug,
            retailerProductId: product.retailerProductId,
            canonicalKey: `${scope.retailerSlug}:${scope.storeSlug}:${product.retailerProductId}`,
          },
        },
        upsert: true,
      },
    };
  });

  await Product.bulkWrite(productOperations, { ordered: false });

  // Re-read to get ids for products this batch inserted; offers join on them.
  const stored = await Product.find(
    {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
      retailerProductId: { $in: ids },
    },
    { _id: 1, retailerProductId: 1 },
  ).lean<{ _id: Types.ObjectId; retailerProductId: string }[]>();

  const productIdByCode = new Map(
    stored.map((product) => [product.retailerProductId, product._id]),
  );

  const offerOperations = products.flatMap((product) => {
    const productId = productIdByCode.get(product.retailerProductId);
    if (!productId) return [];

    return [
      {
        updateOne: {
          filter: { retailerId: retailerRef, storeId: storeRef, productId },
          update: {
            $set: {
              retailerSlug: scope.retailerSlug,
              storeSlug: scope.storeSlug,
              retailerProductId: product.retailerProductId,
              priceMinor: product.priceMinor,
              currency: scope.currency,
              comparisonPriceRaw: product.comparisonPriceRaw,
              // Denormalised so the planner's query is one indexed lookup.
              // The product remains the source of truth; this is a copy the
              // runner is responsible for keeping in step.
              eligibleForPlanning: product.eligibleForPlanning,
              available: true,
              lastSeenAt: now,
              lastCheckedAt: now,
              lastCrawlRunId: crawlRunId,
              // Seeing a product again un-retires it, and clears the record of
              // the run that retired it so a later undo cannot resurrect it.
              unavailableSince: null,
              retiredByCrawlRunId: null,
            },
            $setOnInsert: { comparisonPrice: null, promotion: null },
          },
          upsert: true,
        },
      },
    ];
  });

  if (offerOperations.length > 0) {
    await ProductOffer.bulkWrite(offerOperations, { ordered: false });
  }

  // History rows only for products whose price actually moved. A row per crawl
  // would grow by the catalogue size every few hours and bury the changes.
  const changed = products.filter((product) => {
    const previous = existingById.get(product.retailerProductId);
    return previous && previous.pricePence !== product.priceMinor;
  });

  if (changed.length > 0) {
    await PriceHistory.insertMany(
      changed.flatMap((product) => {
        const productId = productIdByCode.get(product.retailerProductId);
        if (!productId) return [];

        return [
          {
            retailerId: retailerRef,
            storeId: storeRef,
            productId,
            retailerProductId: product.retailerProductId,
            priceMinor: product.priceMinor,
            previousPriceMinor:
              existingById.get(product.retailerProductId)?.pricePence ?? null,
            promotionDescription: null,
            observedAt: now,
            crawlRunId,
          },
        ];
      }),
      { ordered: false },
    );
  }

  return { inserted, updated, priceChanges };
}

/** Offers this run touched, used to decide what reconciliation may retire. */
export async function countOffersSeenBy(
  crawlRunId: string,
  scope: ResolvedCatalogueScope,
): Promise<number> {
  return ProductOffer.countDocuments({
    retailerId: toObjectId(scope.retailerId),
    storeId: toObjectId(scope.storeId),
    lastCrawlRunId: crawlRunId,
  } as Partial<ProductOfferRecord>);
}

function toObjectId(value: string): Types.ObjectId {
  return new Types.ObjectId(value);
}
