import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { PriceHistory } from "../../models/PriceHistory";
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
import { toScope } from "../retailerRegistry";
import { bootstrapRetailers } from "./catalogueMigrations";
import { persistCatalogueBatch, type AssessedProduct } from "./cataloguePersistence";
import type { ResolvedCatalogueScope } from "./retailerTypes";

function assessed(overrides: Partial<AssessedProduct> = {}): AssessedProduct {
  return {
    retailerProductId: "4088600123456",
    name: "Chicken Breast Fillets",
    brand: "Ashfields",
    description: null,
    categoryPaths: [["Fresh Food", "Poultry"]],
    priceMinor: 389,
    packageSizeRaw: "650g",
    comparisonPriceRaw: "£5.98 per kg",
    ingredientsRaw: null,
    allergenAdviceRaw: null,
    dietaryInformationRaw: null,
    imageUrl: null,
    productUrl: "https://www.aldi.co.uk/product/4088600123456",
    available: true,
    normalizedAllergens: [],
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    safetyIssues: [],
    ...overrides,
  };
}

describe("persistCatalogueBatch", () => {
  let scope: ResolvedCatalogueScope;

  before(async () => {
    await startTestDatabase();
    await syncTestIndexes();
  });

  after(async () => {
    await stopTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await bootstrapRetailers([
      {
        slug: "aldi-uk",
        name: "Aldi UK",
        adapterKey: "aldi",
        catalogueScope: "store",
        status: "active",
        stores: [
          { externalStoreId: "belper-de56-1ar", name: "Aldi Belper", scope: "physical" },
        ],
      },
    ]);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    const store = await RetailStore.findOne({ retailerId: retailer._id }).orFail();
    scope = toScope(retailer.toObject(), store.toObject());
  });

  it("writes the product and its store-scoped offer together", async () => {
    const result = await persistCatalogueBatch([assessed()], scope, "run-1");

    assert.equal(result.inserted, 1);

    const product = await Product.findOne({}).orFail();
    assert.equal(product.pricePence, 389);
    assert.equal(product.retailerRef?.toString(), scope.retailerId);

    const offer = await ProductOffer.findOne({}).orFail();
    assert.equal(offer.priceMinor, 389);
    assert.equal(offer.productId.toString(), product._id.toString());
    assert.equal(offer.eligibleForPlanning, true);
    assert.equal(offer.lastCrawlRunId, "run-1");
  });

  it("is idempotent: replaying a batch creates no duplicates", async () => {
    await persistCatalogueBatch([assessed()], scope, "run-1");
    const second = await persistCatalogueBatch([assessed()], scope, "run-1");

    assert.equal(second.inserted, 0);
    assert.equal(second.updated, 1);
    assert.equal(await Product.countDocuments({}), 1);
    assert.equal(await ProductOffer.countDocuments({}), 1);
  });

  it("records a price-history row only when the price moved", async () => {
    await persistCatalogueBatch([assessed()], scope, "run-1");
    assert.equal(await PriceHistory.countDocuments({}), 0);

    // Same price again: nothing worth recording.
    await persistCatalogueBatch([assessed()], scope, "run-2");
    assert.equal(await PriceHistory.countDocuments({}), 0);

    const changed = await persistCatalogueBatch(
      [assessed({ priceMinor: 425 })],
      scope,
      "run-3",
    );

    assert.equal(changed.priceChanges, 1);

    const history = await PriceHistory.findOne({}).orFail();
    assert.equal(history.priceMinor, 425);
    assert.equal(history.previousPriceMinor, 389);
    assert.equal(history.crawlRunId, "run-3");
  });

  it("keeps the legacy product fields answering correctly", async () => {
    await persistCatalogueBatch([assessed({ priceMinor: 500 })], scope, "run-1");

    // The legacy read path must stay correct for the whole migration, or
    // rolling the read switch back would not be a rollback.
    const product = await Product.findOne({}).orFail();
    assert.equal(product.pricePence, 500);
    assert.equal(product.available, true);
    assert.equal(product.retailer, "aldi-uk");
    assert.equal(product.storeId, "belper-de56-1ar");
  });

  it("merges a product's second category without duplicating the first", async () => {
    await persistCatalogueBatch([assessed()], scope, "run-1");
    await persistCatalogueBatch(
      [assessed({ categoryPaths: [["Dinner Ideas", "Roasts"]] })],
      scope,
      "run-2",
    );

    const product = await Product.findOne({}).orFail();
    assert.equal(product.categoryPaths.length, 2);
  });

  it("brings a retired offer back when the product reappears", async () => {
    await persistCatalogueBatch([assessed()], scope, "run-1");
    await ProductOffer.updateOne(
      {},
      {
        $set: {
          available: false,
          unavailableSince: new Date(),
          retiredByCrawlRunId: "run-0",
        },
      },
    );

    await persistCatalogueBatch([assessed()], scope, "run-2");

    const offer = await ProductOffer.findOne({}).orFail();
    assert.equal(offer.available, true);
    assert.equal(offer.unavailableSince, null);
    assert.equal(offer.retiredByCrawlRunId, null);
  });

  it("carries the safety verdict onto both the product and the offer", async () => {
    await persistCatalogueBatch(
      [
        assessed({
          catalogueSafetyStatus: "incomplete",
          eligibleForPlanning: false,
          safetyIssues: ["no ingredients published"],
        }),
      ],
      scope,
      "run-1",
    );

    const product = await Product.findOne({}).orFail();
    assert.equal(product.catalogueSafetyStatus, "incomplete");
    assert.equal(product.eligibleForPlanning, false);

    const offer = await ProductOffer.findOne({}).orFail();
    assert.equal(
      offer.eligibleForPlanning,
      false,
      "the planner's indexed copy must agree with the product",
    );
  });

  it("writes nothing for an empty batch", async () => {
    const result = await persistCatalogueBatch([], scope, "run-1");

    assert.deepEqual(result, { inserted: 0, updated: 0, priceChanges: 0 });
    assert.equal(await Product.countDocuments({}), 0);
  });
});
