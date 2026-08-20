/**
 * Migration properties, against a real MongoDB.
 *
 * Idempotency, restartability and reversibility are claims about what happens
 * when a migration is run twice, interrupted, or undone. None of those can be
 * demonstrated against a stub, because all three are properties of upsert and
 * index behaviour on a real server.
 */

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { Product } from "../../models/Product";
import { ProductOffer } from "../../models/ProductOffer";
import { RetailStore } from "../../models/RetailStore";
import { Retailer } from "../../models/Retailer";
import {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
  syncTestIndexes,
} from "../../testing/mongoTestServer";
import {
  backfillProductOffers,
  bootstrapRetailers,
  rollbackProductOffers,
  type RetailerSeed,
} from "./catalogueMigrations";

const ALDI_SEED: RetailerSeed = {
  slug: "aldi-uk",
  name: "Aldi UK",
  adapterKey: "aldi",
  catalogueScope: "store",
  status: "active",
  stores: [
    {
      externalStoreId: "belper-de56-1ar",
      name: "Aldi Belper",
      postcode: "DE56 1AR",
      scope: "physical",
    },
  ],
};

const SCOPE = { retailerSlug: "aldi-uk", storeSlug: "belper-de56-1ar" };

async function seedLegacyProducts(count: number): Promise<void> {
  const now = new Date("2026-08-18T06:00:00.000Z");

  await Product.insertMany(
    Array.from({ length: count }, (_, index) => ({
      retailer: "aldi-uk",
      storeId: "belper-de56-1ar",
      retailerProductId: `legacy-${index}`,
      canonicalKey: `aldi-uk:belper-de56-1ar:legacy-${index}`,
      name: `Legacy Product ${index}`,
      categoryPaths: [["Food Cupboard", "Tins"]],
      pricePence: 100 + index,
      catalogueSafetyStatus: "inferred",
      eligibleForPlanning: index % 5 !== 0,
      available: true,
      productUrl: `https://www.aldi.co.uk/product/legacy-${index}`,
      lastCheckedAt: now,
      lastSeenAt: now,
      lastCrawlRunId: "legacy-run",
    })),
  );
}

describe("bootstrapRetailers", () => {
  before(async () => {
    await startTestDatabase();
    await syncTestIndexes();
  });

  after(async () => {
    await stopTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  it("creates the retailer and its store", async () => {
    const result = await bootstrapRetailers([ALDI_SEED]);

    assert.equal(result.retailersCreated, 1);
    assert.equal(result.storesCreated, 1);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    assert.equal(retailer.adapterKey, "aldi");
    assert.equal(retailer.status, "active");

    const store = await RetailStore.findOne({ retailerId: retailer._id }).orFail();
    assert.equal(store.externalStoreId, "belper-de56-1ar");
    assert.equal(store.postcode, "DE56 1AR");
  });

  it("is idempotent: running it twice creates nothing new", async () => {
    await bootstrapRetailers([ALDI_SEED]);
    const second = await bootstrapRetailers([ALDI_SEED]);

    assert.equal(second.retailersCreated, 0);
    assert.equal(second.retailersUpdated, 1);
    assert.equal(second.storesCreated, 0);

    assert.equal(await Retailer.countDocuments({}), 1);
    assert.equal(await RetailStore.countDocuments({}), 1);
  });

  it("carries a lifecycle change through on a re-run", async () => {
    await bootstrapRetailers([{ ...ALDI_SEED, status: "validating" }]);
    await bootstrapRetailers([{ ...ALDI_SEED, status: "active" }]);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    assert.equal(retailer.status, "active");
  });

  it("keeps two retailers' stores apart", async () => {
    await bootstrapRetailers([
      ALDI_SEED,
      {
        slug: "other-uk",
        name: "Other UK",
        adapterKey: "other",
        catalogueScope: "national",
        status: "development",
        stores: [
          { externalStoreId: "national", name: "National", scope: "national" },
        ],
      },
    ]);

    assert.equal(await RetailStore.countDocuments({}), 2);

    const aldi = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    assert.equal(await RetailStore.countDocuments({ retailerId: aldi._id }), 1);
  });
});

describe("backfillProductOffers", () => {
  before(async () => {
    await startTestDatabase();
    await syncTestIndexes();
  });

  after(async () => {
    await stopTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await bootstrapRetailers([ALDI_SEED]);
  });

  it("creates one offer per legacy product", async () => {
    await seedLegacyProducts(12);

    const result = await backfillProductOffers(SCOPE);

    assert.equal(result.productsScanned, 12);
    assert.equal(result.offersCreated, 12);
    assert.equal(await ProductOffer.countDocuments({}), 12);
  });

  it("copies price, availability and eligibility onto the offer", async () => {
    await seedLegacyProducts(6);
    await backfillProductOffers(SCOPE);

    const product = await Product.findOne({ retailerProductId: "legacy-3" }).orFail();
    const offer = await ProductOffer.findOne({ productId: product._id }).orFail();

    assert.equal(offer.priceMinor, product.pricePence);
    assert.equal(offer.available, product.available);
    assert.equal(offer.eligibleForPlanning, product.eligibleForPlanning);
    assert.equal(offer.retailerProductId, "legacy-3");
    assert.equal(offer.currency, "GBP");
  });

  it("leaves promotion and structured comparison price null", async () => {
    await seedLegacyProducts(3);
    await backfillProductOffers(SCOPE);

    const offers = await ProductOffer.find({}).lean();

    for (const offer of offers) {
      assert.equal(offer.promotion, null);
      assert.equal(offer.comparisonPrice, null);
    }
  });

  it("links every product to its retailer and store by object id", async () => {
    await seedLegacyProducts(8);
    await backfillProductOffers(SCOPE);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    const store = await RetailStore.findOne({ retailerId: retailer._id }).orFail();

    const unlinked = await Product.countDocuments({
      $or: [{ retailerRef: null }, { storeRef: null }],
    });
    assert.equal(unlinked, 0);

    const sample = await Product.findOne({ retailerProductId: "legacy-1" }).orFail();
    assert.equal(sample.retailerRef?.toString(), retailer._id.toString());
    assert.equal(sample.storeRef?.toString(), store._id.toString());
  });

  it("is idempotent: a second run creates no duplicates", async () => {
    await seedLegacyProducts(10);

    await backfillProductOffers(SCOPE);
    const second = await backfillProductOffers(SCOPE);

    assert.equal(second.offersCreated, 0);
    assert.equal(second.offersUpdated, 10);
    assert.equal(await ProductOffer.countDocuments({}), 10);
  });

  it("is restartable: resuming after an interruption completes the catalogue", async () => {
    await seedLegacyProducts(25);

    // A batch size below the catalogue size is the interrupted-run shape: the
    // first pass stops part way, the second must finish the job rather than
    // start again or skip what moved.
    await backfillProductOffers(SCOPE, { batchSize: 4 });

    assert.equal(await ProductOffer.countDocuments({}), 25);

    const again = await backfillProductOffers(SCOPE, { batchSize: 7 });
    assert.equal(again.offersCreated, 0);
    assert.equal(await ProductOffer.countDocuments({}), 25);
  });

  it("does not modify any legacy product field", async () => {
    await seedLegacyProducts(5);

    const before = await Product.find({}).sort({ retailerProductId: 1 }).lean();
    await backfillProductOffers(SCOPE);
    const after = await Product.find({}).sort({ retailerProductId: 1 }).lean();

    for (let index = 0; index < before.length; index += 1) {
      assert.equal(after[index].pricePence, before[index].pricePence);
      assert.equal(after[index].available, before[index].available);
      assert.equal(after[index].eligibleForPlanning, before[index].eligibleForPlanning);
      assert.equal(after[index].retailer, before[index].retailer);
      assert.equal(after[index].storeId, before[index].storeId);
    }
  });

  it("refuses to run before the retailer has been bootstrapped", async () => {
    await seedLegacyProducts(2);

    await assert.rejects(
      () => backfillProductOffers({ retailerSlug: "ghost-uk", storeSlug: "nowhere" }),
      /no retailer record/i,
    );
  });

  it("refuses a store the retailer does not own", async () => {
    await seedLegacyProducts(2);

    await assert.rejects(
      () => backfillProductOffers({ retailerSlug: "aldi-uk", storeSlug: "not-a-store" }),
      /has no store/i,
    );
  });

  it("never creates an offer joining a product from another retailer", async () => {
    await seedLegacyProducts(4);

    await bootstrapRetailers([
      {
        slug: "other-uk",
        name: "Other UK",
        adapterKey: "other",
        catalogueScope: "national",
        status: "development",
        stores: [{ externalStoreId: "national", name: "National", scope: "national" }],
      },
    ]);

    await backfillProductOffers(SCOPE);

    const other = await Retailer.findOne({ slug: "other-uk" }).orFail();
    assert.equal(await ProductOffer.countDocuments({ retailerId: other._id }), 0);
  });

  it("refuses a duplicate offer for the same product and store", async () => {
    await seedLegacyProducts(1);
    await backfillProductOffers(SCOPE);

    const existing = await ProductOffer.findOne({}).orFail();

    await assert.rejects(
      () =>
        ProductOffer.create({
          retailerId: existing.retailerId,
          storeId: existing.storeId,
          productId: existing.productId,
          retailerSlug: existing.retailerSlug,
          storeSlug: existing.storeSlug,
          retailerProductId: existing.retailerProductId,
          priceMinor: 999,
          currency: "GBP",
          available: true,
          eligibleForPlanning: true,
          lastSeenAt: new Date(),
          lastCheckedAt: new Date(),
          lastCrawlRunId: "duplicate",
        }),
      /duplicate key/i,
    );
  });

  it("prices the same product differently in two stores", async () => {
    await seedLegacyProducts(1);
    await backfillProductOffers(SCOPE);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    const secondStore = await RetailStore.create({
      retailerId: retailer._id,
      externalStoreId: "derby-de1-2ab",
      name: "Aldi Derby",
      scope: "physical",
      enabled: true,
    });
    const product = await Product.findOne({}).orFail();

    await ProductOffer.create({
      retailerId: retailer._id,
      storeId: secondStore._id,
      productId: product._id,
      retailerSlug: "aldi-uk",
      storeSlug: "derby-de1-2ab",
      retailerProductId: product.retailerProductId,
      priceMinor: 250,
      currency: "GBP",
      available: true,
      eligibleForPlanning: true,
      lastSeenAt: new Date(),
      lastCheckedAt: new Date(),
      lastCrawlRunId: "second-store",
    });

    const offers = await ProductOffer.find({ productId: product._id }).lean();
    assert.equal(offers.length, 2);
    assert.notEqual(offers[0].priceMinor, offers[1].priceMinor);
  });
});

describe("rollbackProductOffers", () => {
  before(async () => {
    await startTestDatabase();
    await syncTestIndexes();
  });

  after(async () => {
    await stopTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await bootstrapRetailers([ALDI_SEED]);
  });

  it("returns the catalogue to its pre-migration state", async () => {
    await seedLegacyProducts(9);
    const before = await Product.find({}).sort({ retailerProductId: 1 }).lean();

    await backfillProductOffers(SCOPE);
    const result = await rollbackProductOffers(SCOPE);

    assert.equal(result.offersRemoved, 9);
    assert.equal(await ProductOffer.countDocuments({}), 0);

    const after = await Product.find({}).sort({ retailerProductId: 1 }).lean();
    for (let index = 0; index < before.length; index += 1) {
      assert.equal(after[index].pricePence, before[index].pricePence);
      assert.equal(after[index].retailerRef, null);
      assert.equal(after[index].storeRef, null);
    }
  });

  it("can be followed by another backfill", async () => {
    await seedLegacyProducts(5);

    await backfillProductOffers(SCOPE);
    await rollbackProductOffers(SCOPE);
    const again = await backfillProductOffers(SCOPE);

    assert.equal(again.offersCreated, 5);
    assert.equal(await ProductOffer.countDocuments({}), 5);
  });
});
