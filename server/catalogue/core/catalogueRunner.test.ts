/**
 * The shared runner's write precondition.
 *
 * One rule is being pinned down here, and it is the most expensive one in the
 * catalogue to get wrong: a store-scoped run that cannot prove which store it
 * is reading must not write a single product. An unverified session may have
 * been reading a different branch's prices and availability all along, and
 * those writes are indistinguishable from correct ones afterwards.
 *
 * The policy is tested exhaustively as a pure function, and then the whole
 * runner is driven end to end with a fake adapter against a local fixture
 * server and a throwaway database — because "we would have refused" and "we
 * did refuse, and nothing reached MongoDB" are different claims.
 */

import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { CrawlRun } from "../../models/CrawlRun";
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
import { assessWritePrecondition, runCatalogueCrawl } from "./catalogueRunner";
import type { ResolvedCatalogueScope } from "./retailerTypes";
import type {
  ListingPageResult,
  RetailerCatalogueAdapter,
} from "../contracts/retailerAdapter";
import type { NormalizedCatalogueProduct } from "../contracts/normalizedCatalogueProduct";

describe("write precondition", () => {
  it("permits writes for a verified store-scoped run", () => {
    const verdict = assessWritePrecondition({
      persist: true,
      catalogueScope: "store",
      storeSelectionVerified: true,
    });

    assert.deepEqual(verdict, { mayWrite: true, refusal: null });
  });

  it("refuses every write for an unverified store-scoped run", () => {
    const verdict = assessWritePrecondition({
      persist: true,
      catalogueScope: "store",
      storeSelectionVerified: false,
    });

    assert.equal(verdict.mayWrite, false);
    assert.equal(verdict.refusal, "STORE_SCOPE_UNVERIFIED");
  });

  it("does not demand store verification from a national catalogue", () => {
    // A national catalogue has one set of prices. There is no other branch it
    // could have been reading, so there is nothing to verify.
    for (const catalogueScope of ["national", "regional"] as const) {
      assert.equal(
        assessWritePrecondition({
          persist: true,
          catalogueScope,
          storeSelectionVerified: false,
        }).mayWrite,
        true,
        catalogueScope,
      );
    }
  });

  it("writes nothing at all for a diagnostic, verified or not", () => {
    for (const storeSelectionVerified of [true, false]) {
      const verdict = assessWritePrecondition({
        persist: false,
        catalogueScope: "store",
        storeSelectionVerified,
      });

      assert.equal(verdict.mayWrite, false);
      assert.equal(verdict.refusal, "NOT_PERSISTING");
    }
  });
});

/**
 * A retailer that behaves exactly as told.
 *
 * Deliberately not Aldi or Tesco: the rule under test belongs to the runner,
 * and testing it through a real adapter would make it look like a property of
 * that shop's website rather than of the pipeline every shop shares.
 */
let fakeProductSequence = 0;

function fakeAdapter(options: {
  baseUrl: string;
  verified: boolean;
  available?: boolean;
}): RetailerCatalogueAdapter {
  // A distinct product per adapter, because Crawlee's request queue outlives a
  // single crawl within one process: a detail request whose key another test
  // already handled would be skipped rather than re-fetched. Production runs
  // are separate processes and never see this.
  const productId = `fake-${(fakeProductSequence += 1)}`;

  const listing = {
    retailerProductId: productId,
    productUrl: `${options.baseUrl}/products/${productId}`,
    name: "Fake Chicken Breast Fillets",
    brand: null,
    packageSizeRaw: "650g",
    comparisonPriceRaw: null,
    priceText: "£3.89",
    imageUrl: null,
    available: options.available ?? true,
    categoryPaths: [["Fresh Food", "Poultry"]],
  };

  return {
    adapterKey: "fake",
    adapterVersion: "1.0.0",
    allowedHosts: ["127.0.0.1"],
    prepareSession: async () => {},
    verifyStoreSelection: async () => options.verified,
    discoverCategories: async () => [
      {
        key: "poultry",
        url: `${options.baseUrl}/browse/poultry`,
        categoryPath: ["Fresh Food", "Poultry"],
        enabled: true,
      },
    ],
    extractListingPage: async (): Promise<ListingPageResult> => ({
      products: [listing],
      nextPages: [],
      skipped: 0,
    }),
    extractProduct: async (): Promise<NormalizedCatalogueProduct> => ({
      retailerProductId: listing.retailerProductId,
      name: listing.name,
      brand: null,
      description: null,
      categoryPaths: listing.categoryPaths,
      priceMinor: 389,
      packageSizeRaw: listing.packageSizeRaw,
      comparisonPriceRaw: null,
      ingredientsRaw: "Chicken breast (100%).",
      allergenAdviceRaw: "No allergens.",
      dietaryInformationRaw: null,
      imageUrl: null,
      productUrl: listing.productUrl,
      available: options.available ?? true,
    }),
  };
}

describe("runCatalogueCrawl: store verification gates every write", () => {
  let scope: ResolvedCatalogueScope;
  let server: Server;
  let baseUrl: string;

  before(async () => {
    // Crawlee keeps its request queue on disk. A throwaway directory keeps a
    // test crawl's queue out of the checkout and away from any real one.
    process.env.CRAWLEE_STORAGE_DIR = mkdtempSync(join(tmpdir(), "crawlee-test-"));
    process.env.CRAWLEE_PURGE_ON_START = "1";

    server = createServer((request, response) => {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(`<!doctype html><html><body><main>${request.url}</main></body></html>`);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    await startTestDatabase();
    await syncTestIndexes();
  });

  after(async () => {
    await stopTestDatabase();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await bootstrapRetailers([
      {
        slug: "fake-uk",
        name: "Fake UK",
        adapterKey: "fake",
        catalogueScope: "store",
        status: "development",
        stores: [
          { externalStoreId: "fake-store-one", name: "Fake Store One", scope: "physical" },
        ],
      },
    ]);

    const retailer = await Retailer.findOne({ slug: "fake-uk" }).orFail();
    const store = await RetailStore.findOne({ retailerId: retailer._id }).orFail();
    scope = toScope(retailer.toObject(), store.toObject());
  });

  it("writes no product when the store could not be verified", async () => {
    const summary = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: false }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    assert.equal(summary.storeSelectionVerified, false);
    assert.equal(summary.status, "failed");
    assert.equal(summary.inserted, 0);

    // The claim that matters is about the database, not the summary.
    assert.equal(await Product.countDocuments({}), 0);
    assert.equal(await ProductOffer.countDocuments({}), 0);
  });

  it("records why an unverified run failed", async () => {
    await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: false }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    const run = await CrawlRun.findOne({}).orFail();

    assert.equal(run.status, "failed");
    assert.equal(run.storeSelectionVerified, false);
    assert.equal(run.adapterKey, "fake");
    assert.equal(run.adapterVersion, "1.0.0");
    assert.equal(run.mode, "full");
    assert.ok(
      run.errors.some((issue) => issue.type === "STORE_SCOPE_UNVERIFIED"),
      "an operator must be able to see why nothing was written",
    );
  });

  it("never reconciles an unverified run", async () => {
    const summary = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: false }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    assert.equal(summary.reconciled, false);
    assert.equal(summary.offersRetired, 0);
  });

  it("leaves the last trusted catalogue alone when a crawl fails", async () => {
    // The catalogue a failed crawl inherits is the one users are planning
    // against. Emptying it is the worst outcome available.
    const trusted = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: true }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    assert.equal(trusted.inserted, 1);

    await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: false }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    const offer = await ProductOffer.findOne({}).orFail();
    assert.equal(offer.available, true);
    assert.equal(await Product.countDocuments({}), 1);
  });

  it("writes products for a verified run", async () => {
    const summary = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: true }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    assert.equal(summary.storeSelectionVerified, true);
    assert.equal(summary.inserted, 1);
    assert.equal(await Product.countDocuments({}), 1);

    const offer = await ProductOffer.findOne({}).orFail();
    assert.equal(offer.priceMinor, 389);
    assert.equal(offer.storeSlug, "fake-store-one");
  });

  it("carries an unavailable product through both write paths", async () => {
    await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: true, available: false }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
    });

    const product = await Product.findOne({}).orFail();
    const offer = await ProductOffer.findOne({}).orFail();

    assert.equal(product.available, false);
    assert.equal(offer.available, false);
  });

  it("writes nothing and reconciles nothing for a diagnostic", async () => {
    const summary = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: true }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "diagnostic",
      persist: false,
      reconcile: false,
    });

    assert.equal(await Product.countDocuments({}), 0);
    assert.equal(await CrawlRun.countDocuments({}), 0);
    assert.equal(summary.reconciled, false);
    assert.ok(summary.sample && summary.sample.length > 0, "a diagnostic returns what it saw");
  });

  it("never reconciles a bounded crawl", async () => {
    const summary = await runCatalogueCrawl({
      scope,
      adapter: fakeAdapter({ baseUrl, verified: true }),
      expectedStoreText: "Fake Store One",
      headless: true,
      mode: "full",
      // A cap makes the run bounded whatever the caller called it: it did not
      // look at the whole shop and cannot tell "gone" from "not visited".
      maxProductsPerCategory: 1,
    });

    assert.equal(summary.mode, "bounded");
    assert.equal(summary.reconciled, false);
    assert.ok(summary.reconciliationRefusals.includes("NOT_A_FULL_CRAWL"));
  });
});
