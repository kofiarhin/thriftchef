/**
 * Reconciliation is refused far more often than it runs, and these tests are
 * mostly about the refusals. Each one corresponds to a way a crawl can fail to
 * have seen the whole shop — and each, if ignored, empties a working catalogue.
 */

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { Types } from "mongoose";
import { CrawlRun, type CrawlRunRecord } from "../../models/CrawlRun";
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
  assessCrawlTrust,
  reconcileAvailability,
  undoReconciliation,
} from "./availabilityReconciliation";
import { backfillProductOffers, bootstrapRetailers } from "./catalogueMigrations";
import type { ResolvedCatalogueScope } from "./retailerTypes";

/** A run that satisfies every trust condition. */
function trustedRun(overrides: Partial<CrawlRunRecord> = {}): CrawlRunRecord {
  return {
    _id: new Types.ObjectId(),
    retailerId: new Types.ObjectId(),
    storeId: new Types.ObjectId(),
    adapterKey: "aldi",
    adapterVersion: "1.0.0",
    mode: "full",
    status: "completed",
    startedAt: new Date(),
    completedAt: new Date(),
    categoriesRequested: 10,
    categoriesCompleted: 10,
    productsDiscovered: 500,
    productsInserted: 0,
    productsUpdated: 500,
    priceChanges: 0,
    failures: 0,
    storeSelectionVerified: true,
    availabilityReconciled: false,
    offersRetired: 0,
    errors: [],
    ...overrides,
  } as CrawlRunRecord;
}

describe("assessCrawlTrust", () => {
  it("trusts a complete, verified full crawl", () => {
    assert.deepEqual(assessCrawlTrust(trustedRun()), { trusted: true, refusals: [] });
  });

  it("accepts a completed-with-warnings run", () => {
    assert.equal(
      assessCrawlTrust(trustedRun({ status: "completed_with_warnings" })).trusted,
      true,
    );
  });

  for (const mode of ["bounded", "diagnostic"] as const) {
    it(`refuses a ${mode} crawl, which only looked at part of the shop`, () => {
      const trust = assessCrawlTrust(trustedRun({ mode }));

      assert.equal(trust.trusted, false);
      assert.ok(trust.refusals.includes("NOT_A_FULL_CRAWL"));
    });
  }

  for (const status of ["failed", "cancelled", "running", "queued"] as const) {
    it(`refuses a ${status} crawl, which stopped early`, () => {
      const trust = assessCrawlTrust(trustedRun({ status }));

      assert.equal(trust.trusted, false);
      assert.ok(trust.refusals.includes("RUN_NOT_TRUSTED"));
    });
  }

  it("refuses a crawl that never confirmed which store it was reading", () => {
    const trust = assessCrawlTrust(trustedRun({ storeSelectionVerified: false }));

    assert.equal(trust.trusted, false);
    assert.ok(trust.refusals.includes("STORE_SELECTION_UNVERIFIED"));
  });

  it("refuses a crawl that did not finish every category", () => {
    const trust = assessCrawlTrust(
      trustedRun({ categoriesRequested: 10, categoriesCompleted: 9 }),
    );

    assert.equal(trust.trusted, false);
    assert.ok(trust.refusals.includes("CATEGORIES_INCOMPLETE"));
  });

  it("tolerates a few transient failures", () => {
    assert.equal(
      assessCrawlTrust(trustedRun({ productsDiscovered: 500, failures: 20 })).trusted,
      true,
    );
  });

  it("refuses a crawl whose failure rate suggests a systemic problem", () => {
    const trust = assessCrawlTrust(
      trustedRun({ productsDiscovered: 500, failures: 200 }),
    );

    assert.equal(trust.trusted, false);
    assert.ok(trust.refusals.includes("TOO_MANY_FAILURES"));
  });

  it("refuses a crawl that discovered nothing, however cleanly it finished", () => {
    const trust = assessCrawlTrust(trustedRun({ productsDiscovered: 0 }));

    assert.equal(trust.trusted, false);
    assert.ok(trust.refusals.includes("NOTHING_DISCOVERED"));
  });

  it("reports every reason at once rather than only the first", () => {
    const trust = assessCrawlTrust(
      trustedRun({
        mode: "bounded",
        status: "failed",
        storeSelectionVerified: false,
        categoriesCompleted: 1,
      }),
    );

    assert.ok(trust.refusals.length >= 4, trust.refusals.join(", "));
  });
});

describe("reconcileAvailability", () => {
  let scope: ResolvedCatalogueScope;
  let otherScope: ResolvedCatalogueScope;

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
          { externalStoreId: "derby-de1-2ab", name: "Aldi Derby", scope: "physical" },
        ],
      },
      {
        slug: "other-uk",
        name: "Other UK",
        adapterKey: "other",
        catalogueScope: "national",
        status: "active",
        stores: [{ externalStoreId: "national", name: "National", scope: "national" }],
      },
    ]);

    scope = await scopeFor("aldi-uk", "belper-de56-1ar");
    otherScope = await scopeFor("other-uk", "national");
  });

  async function scopeFor(
    retailerSlug: string,
    storeSlug: string,
  ): Promise<ResolvedCatalogueScope> {
    const retailer = await Retailer.findOne({ slug: retailerSlug }).orFail();
    const store = await RetailStore.findOne({
      retailerId: retailer._id,
      externalStoreId: storeSlug,
    }).orFail();

    return toScope(retailer.toObject(), store.toObject());
  }

  async function seed(
    ids: string[],
    retailerSlug: string,
    storeSlug: string,
    crawlRunId: string,
  ): Promise<void> {
    const now = new Date("2026-08-18T06:00:00.000Z");

    await Product.insertMany(
      ids.map((id) => ({
        retailer: retailerSlug,
        storeId: storeSlug,
        retailerProductId: id,
        canonicalKey: `${retailerSlug}:${storeSlug}:${id}`,
        name: `Product ${id}`,
        categoryPaths: [["Food Cupboard"]],
        pricePence: 100,
        catalogueSafetyStatus: "inferred",
        eligibleForPlanning: true,
        available: true,
        productUrl: `https://www.aldi.co.uk/product/${id}`,
        lastCheckedAt: now,
        lastSeenAt: now,
        lastCrawlRunId: crawlRunId,
      })),
    );

    await backfillProductOffers({ retailerSlug, storeSlug });
    await ProductOffer.updateMany({ retailerSlug, storeSlug }, { $set: { lastCrawlRunId: crawlRunId } });
  }

  async function runFor(
    overrides: Partial<CrawlRunRecord> = {},
  ): Promise<CrawlRunRecord> {
    const run = await CrawlRun.create({
      retailerId: new Types.ObjectId(scope.retailerId),
      storeId: new Types.ObjectId(scope.storeId),
      adapterKey: "aldi",
      adapterVersion: "1.0.0",
      mode: "full",
      status: "completed",
      categoriesRequested: 5,
      categoriesCompleted: 5,
      productsDiscovered: 100,
      failures: 0,
      storeSelectionVerified: true,
      ...overrides,
    });

    return run.toObject() as CrawlRunRecord;
  }

  it("retires offers a trusted full crawl did not see", async () => {
    const run = await runFor();
    const runId = run._id.toString();

    await seed(["seen-1", "seen-2", "gone-1"], "aldi-uk", "belper-de56-1ar", runId);
    // "gone-1" was not touched by this run.
    await ProductOffer.updateOne(
      { retailerProductId: "gone-1" },
      { $set: { lastCrawlRunId: "an-older-run" } },
    );

    const result = await reconcileAvailability(run, scope);

    assert.equal(result.reconciled, true);
    assert.equal(result.offersRetired, 1);

    const gone = await ProductOffer.findOne({ retailerProductId: "gone-1" }).orFail();
    assert.equal(gone.available, false);
    assert.equal(gone.retiredByCrawlRunId, runId);
    assert.ok(gone.unavailableSince);

    const seen = await ProductOffer.findOne({ retailerProductId: "seen-1" }).orFail();
    assert.equal(seen.available, true);
  });

  for (const [label, overrides] of [
    ["a bounded crawl", { mode: "bounded" as const }],
    ["a failed crawl", { status: "failed" as const }],
    ["a cancelled crawl", { status: "cancelled" as const }],
    ["an interrupted crawl", { status: "running" as const }],
    ["an unverified store selection", { storeSelectionVerified: false }],
    ["an incomplete category sweep", { categoriesCompleted: 2 }],
    ["a high failure rate", { productsDiscovered: 10, failures: 90 }],
  ] as const) {
    it(`never retires anything after ${label}`, async () => {
      const run = await runFor(overrides);
      await seed(["a", "b"], "aldi-uk", "belper-de56-1ar", "an-older-run");

      const result = await reconcileAvailability(run, scope);

      assert.equal(result.reconciled, false);
      assert.equal(result.offersRetired, 0);
      assert.ok(result.refusals.length > 0);

      const stillAvailable = await ProductOffer.countDocuments({ available: true });
      assert.equal(stillAvailable, 2, "a distrusted crawl must change nothing");
    });
  }

  it("cannot touch another retailer's catalogue", async () => {
    const run = await runFor();
    await seed(["a"], "aldi-uk", "belper-de56-1ar", run._id.toString());
    await seed(["x"], "other-uk", "national", "unrelated-run");

    await reconcileAvailability(run, scope);

    const other = await ProductOffer.findOne({ retailerSlug: "other-uk" }).orFail();
    assert.equal(other.available, true);
  });

  it("cannot touch another store of the same retailer", async () => {
    const run = await runFor();
    await seed(["a"], "aldi-uk", "belper-de56-1ar", run._id.toString());
    await seed(["b"], "aldi-uk", "derby-de1-2ab", "unrelated-run");

    await reconcileAvailability(run, scope);

    const derby = await ProductOffer.findOne({ storeSlug: "derby-de1-2ab" }).orFail();
    assert.equal(derby.available, true);
  });

  it("brings a product back when a later crawl sees it again", async () => {
    const first = await runFor();
    await seed(["a"], "aldi-uk", "belper-de56-1ar", "an-older-run");

    await reconcileAvailability(first, scope);
    assert.equal((await ProductOffer.findOne({}).orFail()).available, false);

    // A later crawl finds it back on the shelf.
    const second = await runFor();
    await ProductOffer.updateOne(
      { retailerProductId: "a" },
      {
        $set: {
          available: true,
          lastCrawlRunId: second._id.toString(),
          unavailableSince: null,
          retiredByCrawlRunId: null,
        },
      },
    );

    const result = await reconcileAvailability(second, scope);

    assert.equal(result.offersRetired, 0);
    assert.equal((await ProductOffer.findOne({}).orFail()).available, true);
  });

  it("reverses exactly one run's retirements", async () => {
    const older = await runFor();
    const run = await runFor();

    await seed(["a", "b"], "aldi-uk", "belper-de56-1ar", "an-older-run");

    // "b" was retired earlier by a different run and must stay retired.
    await ProductOffer.updateOne(
      { retailerProductId: "b" },
      {
        $set: {
          available: false,
          retiredByCrawlRunId: older._id.toString(),
          unavailableSince: new Date(),
        },
      },
    );

    await reconcileAvailability(run, scope);

    const undone = await undoReconciliation(run._id.toString(), scope);

    assert.equal(undone.offersRestored, 1);
    assert.equal((await ProductOffer.findOne({ retailerProductId: "a" }).orFail()).available, true);
    assert.equal(
      (await ProductOffer.findOne({ retailerProductId: "b" }).orFail()).available,
      false,
      "another run's retirement must survive this undo",
    );
  });
});
