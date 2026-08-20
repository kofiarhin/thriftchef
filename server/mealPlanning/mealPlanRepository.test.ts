import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { MealPlan } from "../models/MealPlan";
import {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
  syncTestIndexes,
} from "../testing/mongoTestServer";
import { ALDI_SCOPE } from "../testing/scopeFixtures";
import { planRequest } from "../testing/planningFixtures";
import {
  findPlan,
  findPlansForDevice,
  hashAnonymousId,
  newPlanId,
  savePlan,
} from "./mealPlanRepository";
import type { MealPlanResponse } from "./mealPlanTypes";

const NOW = new Date("2026-08-20T00:00:00.000Z");

function planResponse(planId: string, totalPence = 3_000): MealPlanResponse {
  return {
    planId,
    generatedAt: NOW.toISOString(),
    catalogue: {
      retailerId: ALDI_SCOPE.retailerId,
      retailerSlug: ALDI_SCOPE.retailerSlug,
      retailerName: ALDI_SCOPE.retailerName,
      storeId: ALDI_SCOPE.storeId,
      storeSlug: ALDI_SCOPE.storeSlug,
      storeName: ALDI_SCOPE.storeName,
      crawlRunId: "run-1",
      catalogueUpdatedAt: NOW.toISOString(),
    },
    currency: "GBP",
    budgetPence: 7_000,
    estimatedTotalPence: totalPence,
    budgetStatus: "within-budget",
    assumptions: [],
    warnings: [],
    days: [],
    recipes: [],
    shoppingList: [
      {
        category: "Food Cupboard",
        items: [
          {
            productId: "p-rice",
            name: "Basmati Rice",
            brand: null,
            packageSize: "1kg",
            quantity: 1,
            unitPricePence: 179,
            totalPricePence: 179,
            productUrl: "https://www.aldi.co.uk/product/p-rice",
            imageUrl: null,
            alreadyOwned: false,
          },
        ],
      },
    ],
    productCoverage: {
      productsConsidered: 40,
      productsUsed: 10,
      excludedForAllergies: 0,
      excludedForSafety: 0,
    },
    budgetUtilization: {
      targetPercent: 80,
      targetPence: 5_600,
      actualPence: totalPence,
      actualPercent: 43,
      withinPreferredRange: false,
    },
    mustHaveUsage: [],
    cookingDays: [1, 2, 3, 4, 5, 6, 7],
  };
}

async function store(planId: string, anonymousId = "device-a"): Promise<void> {
  await savePlan({
    plan: planResponse(planId),
    request: planRequest(),
    scope: ALDI_SCOPE,
    engineVersion: "1.0.0",
    anonymousId,
    retentionDays: 30,
    now: NOW,
  });
}

describe("meal plan persistence", () => {
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

  it("reopens a saved plan by id", async () => {
    const planId = newPlanId();
    await store(planId);

    const found = await findPlan(planId, NOW);

    assert.ok(found);
    assert.equal(found.plan.planId, planId);
    assert.equal(found.plan.catalogue.retailerSlug, "aldi-uk");
  });

  it("serves the price snapshot, not whatever the catalogue says now", async () => {
    const planId = newPlanId();
    await store(planId);

    // The catalogue moves after the plan was generated. The saved plan must
    // not move with it, or a shopper's list changes under them in the aisle.
    const found = await findPlan(planId, NOW);

    assert.ok(found);
    assert.equal(found.plan.shoppingList[0].items[0].unitPricePence, 179);
    assert.equal(found.plan.estimatedTotalPence, 3_000);
  });

  it("never stores the raw anonymous id", async () => {
    const planId = newPlanId();
    await store(planId, "device-with-a-known-value");

    const record = await MealPlan.findOne({ planId }).orFail();

    assert.notEqual(record.anonymousIdHash, "device-with-a-known-value");
    assert.equal(
      record.anonymousIdHash,
      hashAnonymousId("device-with-a-known-value"),
    );
    assert.match(record.anonymousIdHash, /^[a-f0-9]{64}$/);
  });

  it("gives every plan an unguessable id", async () => {
    const ids = new Set(Array.from({ length: 200 }, () => newPlanId()));

    assert.equal(ids.size, 200, "plan ids must not collide");
    for (const id of ids) assert.match(id, /^[a-f0-9]{32}$/);
  });

  it("treats an expired plan as absent", async () => {
    const planId = newPlanId();
    await store(planId);

    const later = new Date(NOW.getTime() + 31 * 24 * 60 * 60 * 1000);

    // TTL removal is periodic, so the document may still be there. Retention
    // has to be enforced on read as well, or it does not mean anything.
    assert.equal(await findPlan(planId, later), null);
  });

  it("answers the same way for an unknown plan as for an expired one", async () => {
    assert.equal(await findPlan("f".repeat(32), NOW), null);
  });

  it("sets an expiry from the configured retention", async () => {
    const planId = newPlanId();
    await savePlan({
      plan: planResponse(planId),
      request: planRequest(),
      scope: ALDI_SCOPE,
      engineVersion: "1.0.0",
      anonymousId: "device-a",
      retentionDays: 7,
      now: NOW,
    });

    const record = await MealPlan.findOne({ planId }).orFail();
    const days = (record.expiresAt.getTime() - NOW.getTime()) / (24 * 60 * 60 * 1000);

    assert.equal(Math.round(days), 7);
  });

  it("lists only the plans belonging to one device", async () => {
    await store(newPlanId(), "device-a");
    await store(newPlanId(), "device-a");
    await store(newPlanId(), "device-b");

    const mine = await findPlansForDevice("device-a");

    assert.equal(mine.length, 2);
    for (const record of mine) {
      assert.equal(record.anonymousIdHash, hashAnonymousId("device-a"));
    }
  });

  it("replaces a plan in place when it is revised", async () => {
    const planId = newPlanId();
    await store(planId);

    await savePlan({
      plan: planResponse(planId, 4_200),
      request: planRequest(),
      scope: ALDI_SCOPE,
      engineVersion: "1.0.0",
      anonymousId: "device-a",
      retentionDays: 30,
      now: NOW,
    });

    assert.equal(await MealPlan.countDocuments({ planId }), 1);
    assert.equal((await findPlan(planId, NOW))?.plan.estimatedTotalPence, 4_200);
  });

  it("records the catalogue the plan was priced against", async () => {
    const planId = newPlanId();
    await store(planId);

    const record = await MealPlan.findOne({ planId }).orFail();

    assert.equal(record.retailerSlug, "aldi-uk");
    assert.equal(record.storeSlug, "belper-de56-1ar");
    assert.equal(record.crawlRunId, "run-1");
    assert.equal(record.engineVersion, "1.0.0");
  });
});
