/**
 * The migration's central claim: reading the catalogue through offers answers
 * the same question as reading it through legacy product fields.
 *
 * If that is not true, the read switch is not safe to flip, and no amount of
 * unit-testing either path in isolation would have revealed it.
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
import { toScope } from "../retailerRegistry";
import {
  compareCatalogueReads,
  loadCandidateProducts,
} from "./catalogueReads";
import { backfillProductOffers, bootstrapRetailers } from "./catalogueMigrations";
import type { ResolvedCatalogueScope } from "./retailerTypes";

const SCOPE = { retailerSlug: "aldi-uk", storeSlug: "belper-de56-1ar" };
const SEEN_AT = new Date("2026-08-18T06:00:00.000Z");

async function seedCatalogue(
  entries: Array<{ id: string; price: number; available?: boolean; eligible?: boolean }>,
  storeSlug = "belper-de56-1ar",
  retailerSlug = "aldi-uk",
): Promise<void> {
  await Product.insertMany(
    entries.map((entry) => ({
      retailer: retailerSlug,
      storeId: storeSlug,
      retailerProductId: entry.id,
      canonicalKey: `${retailerSlug}:${storeSlug}:${entry.id}`,
      name: `Product ${entry.id}`,
      brand: null,
      description: null,
      categoryPaths: [["Food Cupboard", "Tins"]],
      pricePence: entry.price,
      packageSizeRaw: "400g",
      catalogueSafetyStatus: "inferred",
      eligibleForPlanning: entry.eligible ?? true,
      available: entry.available ?? true,
      productUrl: `https://www.aldi.co.uk/product/${entry.id}`,
      lastCheckedAt: SEEN_AT,
      lastSeenAt: SEEN_AT,
      lastCrawlRunId: "seed-run",
    })),
  );
}

async function scopeFor(
  retailerSlug = "aldi-uk",
  storeSlug = "belper-de56-1ar",
): Promise<ResolvedCatalogueScope> {
  const retailer = await Retailer.findOne({ slug: retailerSlug }).orFail();
  const store = await RetailStore.findOne({
    retailerId: retailer._id,
    externalStoreId: storeSlug,
  }).orFail();

  return toScope(retailer.toObject(), store.toObject());
}

describe("catalogue reads", () => {
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
  });

  it("returns the same candidates from legacy fields and from offers", async () => {
    await seedCatalogue([
      { id: "a-1", price: 129 },
      { id: "a-2", price: 249 },
      { id: "a-3", price: 75, eligible: false },
    ]);
    await backfillProductOffers(SCOPE);

    const scope = await scopeFor();
    const legacy = await loadCandidateProducts(scope, "legacy");
    const offers = await loadCandidateProducts(scope, "offers");

    assert.equal(legacy.length, 3);
    assert.deepEqual(offers, legacy);
  });

  it("reports the two readers as equivalent after a backfill", async () => {
    await seedCatalogue([
      { id: "b-1", price: 100 },
      { id: "b-2", price: 200 },
    ]);
    await backfillProductOffers(SCOPE);

    const comparison = await compareCatalogueReads(await scopeFor());

    assert.equal(comparison.matches, true);
    assert.equal(comparison.legacyCount, 2);
    assert.equal(comparison.offerCount, 2);
    assert.deepEqual(comparison.differences, []);
  });

  it("reports a drift rather than hiding it", async () => {
    await seedCatalogue([{ id: "c-1", price: 100 }]);
    await backfillProductOffers(SCOPE);

    await ProductOffer.updateOne({ retailerProductId: "c-1" }, { $set: { priceMinor: 999 } });

    const comparison = await compareCatalogueReads(await scopeFor());

    assert.equal(comparison.matches, false);
    assert.match(comparison.differences[0], /c-1: price 100 vs 999/);
  });

  it("excludes unavailable products from both readers", async () => {
    await seedCatalogue([
      { id: "d-1", price: 100 },
      { id: "d-2", price: 100, available: false },
    ]);
    await backfillProductOffers(SCOPE);

    const scope = await scopeFor();

    assert.equal((await loadCandidateProducts(scope, "legacy")).length, 1);
    assert.equal((await loadCandidateProducts(scope, "offers")).length, 1);
  });

  it("takes price and eligibility from the offer, not the product", async () => {
    await seedCatalogue([{ id: "e-1", price: 100 }]);
    await backfillProductOffers(SCOPE);

    // A store-specific price change lands on the offer alone. Reading it back
    // through the offer path is what "store-scoped pricing" has to mean.
    await ProductOffer.updateOne(
      { retailerProductId: "e-1" },
      { $set: { priceMinor: 175, eligibleForPlanning: false } },
    );

    const scope = await scopeFor();
    const [offer] = await loadCandidateProducts(scope, "offers");
    const [legacy] = await loadCandidateProducts(scope, "legacy");

    assert.equal(offer.pricePence, 175);
    assert.equal(offer.eligibleForPlanning, false);
    assert.equal(legacy.pricePence, 100, "the legacy path is untouched");
  });

  it("never returns another retailer's products", async () => {
    await seedCatalogue([{ id: "f-1", price: 100 }]);
    await bootstrapRetailers([
      {
        slug: "other-uk",
        name: "Other UK",
        adapterKey: "other",
        catalogueScope: "store",
        status: "active",
        stores: [
          { externalStoreId: "elsewhere-zz1-9zz", name: "Elsewhere", scope: "physical" },
        ],
      },
    ]);
    await seedCatalogue(
      [{ id: "f-2", price: 100 }],
      "elsewhere-zz1-9zz",
      "other-uk",
    );

    await backfillProductOffers(SCOPE);
    await backfillProductOffers({
      retailerSlug: "other-uk",
      storeSlug: "elsewhere-zz1-9zz",
    });

    const aldi = await scopeFor();
    const other = await scopeFor("other-uk", "elsewhere-zz1-9zz");

    for (const source of ["legacy", "offers"] as const) {
      const aldiProducts = await loadCandidateProducts(aldi, source);
      const otherProducts = await loadCandidateProducts(other, source);

      assert.deepEqual(
        aldiProducts.map((product) => product.retailerProductId),
        ["f-1"],
        `${source} leaked across retailers`,
      );
      assert.deepEqual(
        otherProducts.map((product) => product.retailerProductId),
        ["f-2"],
        `${source} leaked across retailers`,
      );
    }
  });

  it("never returns another store's products", async () => {
    await seedCatalogue([{ id: "g-1", price: 100 }]);

    const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
    await RetailStore.create({
      retailerId: retailer._id,
      externalStoreId: "derby-de1-2ab",
      name: "Aldi Derby",
      scope: "physical",
      enabled: true,
    });
    await seedCatalogue([{ id: "g-2", price: 100 }], "derby-de1-2ab");

    await backfillProductOffers(SCOPE);
    await backfillProductOffers({
      retailerSlug: "aldi-uk",
      storeSlug: "derby-de1-2ab",
    });

    const belper = await scopeFor();
    const derby = await scopeFor("aldi-uk", "derby-de1-2ab");

    for (const source of ["legacy", "offers"] as const) {
      assert.deepEqual(
        (await loadCandidateProducts(belper, source)).map((p) => p.retailerProductId),
        ["g-1"],
        `${source} leaked across stores`,
      );
      assert.deepEqual(
        (await loadCandidateProducts(derby, source)).map((p) => p.retailerProductId),
        ["g-2"],
        `${source} leaked across stores`,
      );
    }
  });

  it("returns nothing for a scope that has never been crawled", async () => {
    const scope = await scopeFor();

    assert.deepEqual(await loadCandidateProducts(scope, "legacy"), []);
    assert.deepEqual(await loadCandidateProducts(scope, "offers"), []);
  });

  it("drops an offer whose product has gone rather than inventing one", async () => {
    await seedCatalogue([{ id: "h-1", price: 100 }]);
    await backfillProductOffers(SCOPE);

    await Product.deleteMany({});

    assert.deepEqual(await loadCandidateProducts(await scopeFor(), "offers"), []);
  });
});
