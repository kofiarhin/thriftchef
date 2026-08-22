/**
 * Tesco's catalogue, against a real database.
 *
 * The route-level isolation suite proves a plan cannot mix catalogues given a
 * correctly scoped read. This proves the read itself: real collections, real
 * indexes, both read paths, and three catalogues written side by side —
 * Aldi, Tesco store A and Tesco store B — so a query that forgets its store
 * fails here rather than in someone's shopping list.
 *
 * Both `legacy` and `offers` are exercised over the same data, because the
 * production read source is still `legacy` and the equivalence claim is only
 * worth anything if both are checked.
 */

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
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
import { loadCandidateProducts } from "./catalogueReads";
import { persistCatalogueBatch, type AssessedProduct } from "./cataloguePersistence";
import type { ResolvedCatalogueScope } from "./retailerTypes";

const READ_SOURCES = ["legacy", "offers"] as const;

function tescoProduct(
  retailerProductId: string,
  overrides: Partial<AssessedProduct> = {},
): AssessedProduct {
  return {
    retailerProductId,
    name: `Tesco Product ${retailerProductId}`,
    brand: "Tesco",
    description: null,
    categoryPaths: [["Fresh Food", "Fresh Fruit"]],
    priceMinor: 165,
    packageSizeRaw: "Each",
    comparisonPriceRaw: null,
    ingredientsRaw: "Bananas.",
    allergenAdviceRaw: "No allergens.",
    dietaryInformationRaw: null,
    imageUrl: null,
    productUrl: `https://www.tesco.com/shop/en-GB/products/${retailerProductId}`,
    available: true,
    normalizedAllergens: [],
    catalogueSafetyStatus: "verified",
    eligibleForPlanning: true,
    safetyIssues: [],
    ...overrides,
  };
}

function aldiProduct(retailerProductId: string): AssessedProduct {
  return {
    ...tescoProduct(retailerProductId),
    name: `Aldi Product ${retailerProductId}`,
    brand: "Ashfields",
    productUrl: `https://www.aldi.co.uk/product/${retailerProductId}`,
  };
}

describe("Tesco catalogue scope", () => {
  let aldi: ResolvedCatalogueScope;
  let tescoA: ResolvedCatalogueScope;
  let tescoB: ResolvedCatalogueScope;

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
      {
        slug: "tesco-uk",
        name: "Tesco UK",
        adapterKey: "tesco",
        catalogueScope: "store",
        status: "development",
        stores: [
          {
            externalStoreId: "tesco-online-gb",
            name: "Tesco Online (delivery)",
            scope: "online",
          },
          {
            externalStoreId: "tesco-online-north",
            name: "Tesco Online (north)",
            scope: "online",
          },
        ],
      },
    ]);

    aldi = await scopeFor("aldi-uk", "belper-de56-1ar");
    tescoA = await scopeFor("tesco-uk", "tesco-online-gb");
    tescoB = await scopeFor("tesco-uk", "tesco-online-north");

    await persistCatalogueBatch([aldiProduct("4088600123456")], aldi, "aldi-run");
    await persistCatalogueBatch([tescoProduct("301219119")], tescoA, "tesco-a-run");
    await persistCatalogueBatch([tescoProduct("254656107")], tescoB, "tesco-b-run");
  });

  async function scopeFor(
    retailerSlug: string,
    externalStoreId: string,
  ): Promise<ResolvedCatalogueScope> {
    const retailer = await Retailer.findOne({ slug: retailerSlug }).orFail();
    const store = await RetailStore.findOne({
      retailerId: retailer._id,
      externalStoreId,
    }).orFail();

    return toScope(retailer.toObject(), store.toObject());
  }

  for (const source of READ_SOURCES) {
    describe(`reading from ${source}`, () => {
      it("returns only the requested Tesco store's products", async () => {
        const products = await loadCandidateProducts(tescoA, source);

        assert.deepEqual(
          products.map((product) => product.retailerProductId),
          ["301219119"],
        );
      });

      it("never returns another Tesco store's products", async () => {
        // Both stores belong to one retailer, so only the store half of the
        // scope separates them. This is the leak a retailer-only query makes.
        const products = await loadCandidateProducts(tescoB, source);

        assert.deepEqual(
          products.map((product) => product.retailerProductId),
          ["254656107"],
        );
      });

      it("never returns another retailer's products", async () => {
        const tesco = await loadCandidateProducts(tescoA, source);
        const aldiProducts = await loadCandidateProducts(aldi, source);

        assert.ok(tesco.every((product) => product.productUrl.includes("tesco.com")));
        assert.ok(
          aldiProducts.every((product) => product.productUrl.includes("aldi.co.uk")),
        );
      });

      it("excludes a Tesco product the crawl saw off the shelf", async () => {
        // Availability now travels from extraction through persistence to
        // here. If it stopped anywhere in between, an out-of-stock product
        // would be plannable and the user would find out in the aisle.
        await persistCatalogueBatch(
          [tescoProduct("301219119", { available: false })],
          tescoA,
          "tesco-a-run-2",
        );

        const products = await loadCandidateProducts(tescoA, source);

        assert.deepEqual(products, []);
      });

      it("returns a Tesco product again once it is back on the shelf", async () => {
        await persistCatalogueBatch(
          [tescoProduct("301219119", { available: false })],
          tescoA,
          "tesco-a-run-2",
        );
        await persistCatalogueBatch([tescoProduct("301219119")], tescoA, "tesco-a-run-3");

        const products = await loadCandidateProducts(tescoA, source);

        assert.equal(products.length, 1);
      });
    });
  }

  it("keeps Tesco out of the customer's choices while it is in development", async () => {
    const retailer = await Retailer.findOne({ slug: "tesco-uk" }).orFail();

    assert.equal(retailer.status, "development");
    assert.equal(
      tescoA.status,
      "development",
      "a resolved Tesco scope must carry the status that makes it unselectable",
    );
  });

  it("describes the Tesco scope as the online catalogue it actually is", async () => {
    // Labelling an online fulfilment catalogue as a named branch would tell a
    // user their prices came from a shop nobody selected.
    const store = await RetailStore.findOne({
      externalStoreId: "tesco-online-gb",
    }).orFail();

    assert.equal(store.scope, "online");
    assert.match(store.name, /online/i);
    assert.equal(store.lastSuccessfulCrawlAt, null, "freshness is never seeded");
  });

  it("is idempotent: bootstrapping Tesco twice changes nothing", async () => {
    const seed = {
      slug: "tesco-uk",
      name: "Tesco UK",
      adapterKey: "tesco",
      catalogueScope: "store" as const,
      status: "development" as const,
      stores: [
        {
          externalStoreId: "tesco-online-gb",
          name: "Tesco Online (delivery)",
          scope: "online" as const,
        },
      ],
    };

    await bootstrapRetailers([seed]);
    await bootstrapRetailers([seed]);

    assert.equal(await Retailer.countDocuments({ slug: "tesco-uk" }), 1);
    assert.equal(
      await RetailStore.countDocuments({ externalStoreId: "tesco-online-gb" }),
      1,
    );
  });
});
