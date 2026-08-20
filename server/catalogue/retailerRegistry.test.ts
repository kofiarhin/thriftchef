/**
 * Scope resolution is the guarantee that a plan cannot span two retailers.
 * These tests are therefore about what resolution *refuses*, at least as much
 * as what it returns.
 */

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { Retailer } from "../models/Retailer";
import { RetailStore } from "../models/RetailStore";
import {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
  syncTestIndexes,
} from "../testing/mongoTestServer";
import { DEFAULT_CRAWL_POLICY, type RetailerStatus } from "./core/retailerTypes";
import {
  listRetailers,
  listStores,
  resolveCatalogueScope,
} from "./retailerRegistry";

async function seedRetailer(
  overrides: Record<string, unknown> = {},
): Promise<{ retailerId: string; storeId: string }> {
  const retailer = await Retailer.create({
    slug: "aldi-uk",
    name: "Aldi UK",
    countryCode: "GB",
    currency: "GBP",
    adapterKey: "aldi",
    catalogueScope: "store",
    status: "active",
    crawlPolicy: DEFAULT_CRAWL_POLICY,
    ...overrides,
  });

  const store = await RetailStore.create({
    retailerId: retailer._id,
    externalStoreId: "belper-de56-1ar",
    name: "Aldi Belper",
    scope: "physical",
    enabled: true,
  });

  return { retailerId: retailer._id.toString(), storeId: store._id.toString() };
}

async function codeOf(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
  } catch (error) {
    assert.ok(error instanceof ApiError, `expected an ApiError, got ${String(error)}`);
    return error.code;
  }

  throw new assert.AssertionError({ message: "expected the call to be rejected" });
}

describe("resolveCatalogueScope", () => {
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

  it("resolves a retailer and store by slug", async () => {
    await seedRetailer();

    const scope = await resolveCatalogueScope({
      retailer: "aldi-uk",
      store: "belper-de56-1ar",
    });

    assert.equal(scope.retailerSlug, "aldi-uk");
    assert.equal(scope.storeSlug, "belper-de56-1ar");
    assert.equal(scope.currency, "GBP");
    assert.equal(scope.staleAfterHours, 72);
  });

  it("resolves the same scope by object id", async () => {
    const { retailerId, storeId } = await seedRetailer();

    const bySlug = await resolveCatalogueScope({
      retailer: "aldi-uk",
      store: "belper-de56-1ar",
    });
    const byId = await resolveCatalogueScope({ retailer: retailerId, store: storeId });

    assert.deepEqual(byId, bySlug);
  });

  it("falls back to the only enabled store when none is named", async () => {
    await seedRetailer();

    const scope = await resolveCatalogueScope({ retailer: "aldi-uk" });

    assert.equal(scope.storeSlug, "belper-de56-1ar");
  });

  it("refuses to guess when a retailer has several enabled stores", async () => {
    const { retailerId } = await seedRetailer();

    await RetailStore.create({
      retailerId,
      externalStoreId: "derby-de1-2ab",
      name: "Aldi Derby",
      scope: "physical",
      enabled: true,
    });

    assert.equal(
      await codeOf(() => resolveCatalogueScope({ retailer: "aldi-uk" })),
      "STORE_NOT_FOUND",
    );
  });

  it("rejects an unknown retailer", async () => {
    assert.equal(
      await codeOf(() => resolveCatalogueScope({ retailer: "definitely-not-a-shop" })),
      "RETAILER_NOT_FOUND",
    );
  });

  for (const status of ["development", "validating", "degraded", "disabled"] as const) {
    it(`refuses to plan against a ${status} retailer`, async () => {
      await seedRetailer({ status });

      assert.equal(
        await codeOf(() =>
          resolveCatalogueScope({ retailer: "aldi-uk", store: "belper-de56-1ar" }),
        ),
        "RETAILER_NOT_ACTIVE",
      );
    });
  }

  it("still resolves a degraded retailer when selectability is not required", async () => {
    await seedRetailer({ status: "degraded" });

    const scope = await resolveCatalogueScope(
      { retailer: "aldi-uk", store: "belper-de56-1ar" },
      { requireSelectable: false },
    );

    assert.equal(scope.status, "degraded");
  });

  it("never resolves a store belonging to another retailer", async () => {
    await seedRetailer();

    const other = await Retailer.create({
      slug: "other-uk",
      name: "Other UK",
      countryCode: "GB",
      currency: "GBP",
      adapterKey: "other",
      catalogueScope: "store",
      status: "active",
      crawlPolicy: DEFAULT_CRAWL_POLICY,
    });
    const otherStore = await RetailStore.create({
      retailerId: other._id,
      externalStoreId: "elsewhere-zz1-9zz",
      name: "Other Elsewhere",
      scope: "physical",
      enabled: true,
    });

    assert.equal(
      await codeOf(() =>
        resolveCatalogueScope({
          retailer: "aldi-uk",
          store: otherStore._id.toString(),
        }),
      ),
      "STORE_NOT_FOUND",
    );
  });

  it("refuses a disabled store", async () => {
    const { retailerId } = await seedRetailer();

    await RetailStore.updateOne(
      { retailerId, externalStoreId: "belper-de56-1ar" },
      { $set: { enabled: false } },
    );

    assert.equal(
      await codeOf(() =>
        resolveCatalogueScope({ retailer: "aldi-uk", store: "belper-de56-1ar" }),
      ),
      "STORE_NOT_FOUND",
    );
  });

  it("gives a national retailer one logical store", async () => {
    const retailer = await Retailer.create({
      slug: "national-uk",
      name: "National UK",
      countryCode: "GB",
      currency: "GBP",
      adapterKey: "national",
      catalogueScope: "national",
      status: "active",
      crawlPolicy: DEFAULT_CRAWL_POLICY,
    });
    await RetailStore.create({
      retailerId: retailer._id,
      externalStoreId: "national",
      name: "National catalogue",
      scope: "national",
      enabled: true,
    });

    const scope = await resolveCatalogueScope({ retailer: "national-uk" });

    assert.equal(scope.catalogueScope, "national");
    assert.equal(scope.storeSlug, "national");
  });
});

describe("retailer listings", () => {
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

  it("marks only active retailers as selectable", async () => {
    await seedRetailer();
    await Retailer.create({
      slug: "pending-uk",
      name: "Pending UK",
      countryCode: "GB",
      currency: "GBP",
      adapterKey: "pending",
      catalogueScope: "national",
      status: "validating" as RetailerStatus,
      crawlPolicy: DEFAULT_CRAWL_POLICY,
    });

    const retailers = await listRetailers("GB");
    const bySlug = new Map(retailers.map((entry) => [entry.slug, entry]));

    assert.equal(bySlug.get("aldi-uk")?.selectable, true);
    assert.equal(bySlug.get("pending-uk")?.selectable, false);
  });

  it("never exposes the adapter key to a client", async () => {
    await seedRetailer();

    const [retailer] = await listRetailers("GB");

    assert.ok(!("adapterKey" in retailer), "adapter configuration must stay internal");
  });

  it("says whether a store must be chosen", async () => {
    await seedRetailer();

    const [retailer] = await listRetailers("GB");

    assert.equal(retailer.requiresStoreSelection, true);
  });

  it("lists stores only for the retailer that owns them", async () => {
    const { retailerId } = await seedRetailer();

    const other = await Retailer.create({
      slug: "other-uk",
      name: "Other UK",
      countryCode: "GB",
      currency: "GBP",
      adapterKey: "other",
      catalogueScope: "store",
      status: "active",
      crawlPolicy: DEFAULT_CRAWL_POLICY,
    });
    await RetailStore.create({
      retailerId: other._id,
      externalStoreId: "elsewhere-zz1-9zz",
      name: "Other Elsewhere",
      scope: "physical",
      enabled: true,
    });

    const stores = await listStores(
      (await Retailer.findById(retailerId).orFail())._id,
    );

    assert.equal(stores.length, 1);
    assert.equal(stores[0].externalStoreId, "belper-de56-1ar");
  });
});
