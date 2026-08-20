/**
 * Catalogue-ownership rules, against a real MongoDB.
 *
 * Uniqueness, compound keys and index behaviour are properties of the server,
 * not of the schema object, so these run against an in-memory instance rather
 * than a stub. A test that asserts "the slug is unique" without a real unique
 * index asserts nothing at all.
 */

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { Types } from "mongoose";
import {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
  syncTestIndexes,
} from "../testing/mongoTestServer";
import { CrawlRun } from "./CrawlRun";
import { RetailStore } from "./RetailStore";
import { Retailer } from "./Retailer";
import { DEFAULT_CRAWL_POLICY } from "../catalogue/core/retailerTypes";

function retailerFields(overrides: Record<string, unknown> = {}) {
  return {
    slug: "aldi-uk",
    name: "Aldi UK",
    countryCode: "GB" as const,
    currency: "GBP" as const,
    adapterKey: "aldi",
    catalogueScope: "store" as const,
    status: "active" as const,
    crawlPolicy: DEFAULT_CRAWL_POLICY,
    ...overrides,
  };
}

function storeFields(retailerId: Types.ObjectId, overrides: Record<string, unknown> = {}) {
  return {
    retailerId,
    externalStoreId: "belper-de56-1ar",
    name: "Aldi Belper",
    scope: "physical" as const,
    enabled: true,
    ...overrides,
  };
}

describe("catalogue ownership", () => {
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

  describe("Retailer", () => {
    it("stores a retailer with its adapter key and crawl policy", async () => {
      const retailer = await Retailer.create(retailerFields());

      assert.equal(retailer.slug, "aldi-uk");
      assert.equal(retailer.adapterKey, "aldi");
      assert.equal(retailer.catalogueScope, "store");
      assert.equal(retailer.crawlPolicy.staleAfterHours, 72);
    });

    it("refuses a second retailer with the same slug", async () => {
      await Retailer.create(retailerFields());

      await assert.rejects(
        () => Retailer.create(retailerFields({ name: "Aldi UK (duplicate)" })),
        /duplicate key/i,
      );
    });

    it("refuses an unknown lifecycle status", async () => {
      await assert.rejects(
        () => Retailer.create(retailerFields({ status: "probably-fine" })),
        /ValidationError/,
      );
    });

    it("refuses an unknown catalogue scope", async () => {
      await assert.rejects(
        () => Retailer.create(retailerFields({ catalogueScope: "galactic" })),
        /ValidationError/,
      );
    });

    it("refuses a slug that is not a slug", async () => {
      await assert.rejects(
        () => Retailer.create(retailerFields({ slug: "Aldi UK!" })),
        /ValidationError/,
      );
    });
  });

  describe("RetailStore", () => {
    it("refuses two stores with the same external id under one retailer", async () => {
      const retailer = await Retailer.create(retailerFields());

      await RetailStore.create(storeFields(retailer._id));

      await assert.rejects(
        () => RetailStore.create(storeFields(retailer._id, { name: "Duplicate" })),
        /duplicate key/i,
      );
    });

    it("allows the same external id under two different retailers", async () => {
      const aldi = await Retailer.create(retailerFields());
      const other = await Retailer.create(
        retailerFields({ slug: "other-uk", name: "Other UK", adapterKey: "other" }),
      );

      await RetailStore.create(storeFields(aldi._id));
      const second = await RetailStore.create(storeFields(other._id));

      assert.equal(second.externalStoreId, "belper-de56-1ar");
    });

    it("does not resolve a store under a retailer that does not own it", async () => {
      const aldi = await Retailer.create(retailerFields());
      const other = await Retailer.create(
        retailerFields({ slug: "other-uk", name: "Other UK", adapterKey: "other" }),
      );

      const store = await RetailStore.create(storeFields(aldi._id));

      const wrongOwner = await RetailStore.findOne({
        _id: store._id,
        retailerId: other._id,
      });

      assert.equal(wrongOwner, null);
    });

    it("refuses an unknown store scope", async () => {
      const retailer = await Retailer.create(retailerFields());

      await assert.rejects(
        () => RetailStore.create(storeFields(retailer._id, { scope: "orbital" })),
        /ValidationError/,
      );
    });
  });

  describe("CrawlRun", () => {
    it("records a run against a retailer and store with counted outcomes", async () => {
      const retailer = await Retailer.create(retailerFields());
      const store = await RetailStore.create(storeFields(retailer._id));

      const run = await CrawlRun.create({
        retailerId: retailer._id,
        storeId: store._id,
        adapterKey: "aldi",
        adapterVersion: "1.0.0",
        mode: "bounded",
        status: "queued",
        categoriesRequested: 3,
      });

      assert.equal(run.status, "queued");
      assert.equal(run.productsDiscovered, 0);
      assert.equal(run.availabilityReconciled, false);
      assert.equal(run.storeSelectionVerified, false);
    });

    it("refuses an unknown crawl mode", async () => {
      const retailer = await Retailer.create(retailerFields());

      await assert.rejects(
        () =>
          CrawlRun.create({
            retailerId: retailer._id,
            adapterKey: "aldi",
            adapterVersion: "1.0.0",
            mode: "yolo" as never,
            status: "queued",
          }),
        /ValidationError/,
      );
    });

    it("refuses an unknown status", async () => {
      const retailer = await Retailer.create(retailerFields());

      await assert.rejects(
        () =>
          CrawlRun.create({
            retailerId: retailer._id,
            adapterKey: "aldi",
            adapterVersion: "1.0.0",
            mode: "full",
            status: "vibes" as never,
          }),
        /ValidationError/,
      );
    });
  });
});
