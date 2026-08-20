/**
 * Feedback is optional, non-blocking and deliberately incapable of carrying
 * personal data. These tests are mostly about that last property.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp, type AppOverrides } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import { ALDI_SCOPE } from "../testing/scopeFixtures";
import { ALDI_CATALOGUE } from "../testing/planningFixtures";

const PLAN_ID = "a".repeat(32);

const recorded: unknown[] = [];

const OVERRIDES: AppOverrides = {
  resolveScope: async () => ALDI_SCOPE,
  mealPlanDependencies: {
    resolveScope: async () => ALDI_SCOPE,
    loadProducts: async () => ALDI_CATALOGUE,
    savePlan: async () => {},
    loadPlan: async () => null,
  },
  feedbackDependencies: {
    loadPlanScope: async (planId) =>
      planId === PLAN_ID
        ? { retailerSlug: "aldi-uk", storeSlug: "belper-de56-1ar" }
        : null,
    record: async (input) => {
      recorded.push(input);
    },
  },
};

async function post(
  path: string,
  body: unknown,
): Promise<{ status: number; code?: string }> {
  const server = await startTestServer(createApp(testConfig(), OVERRIDES));

  try {
    const response = await server.fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 204) return { status: 204 };

    const payload = (await response.json()) as { error?: { code?: string } };
    return { status: response.status, code: payload.error?.code };
  } finally {
    await server.close();
  }
}

describe("POST /api/meal-plans/:planId/feedback", () => {
  it("records a rating", async () => {
    recorded.length = 0;

    const result = await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "good",
    });

    assert.equal(result.status, 204);
    assert.equal(recorded.length, 1);
  });

  it("records the catalogue the plan came from, not the client's word for it", async () => {
    recorded.length = 0;

    await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "poor",
      issues: ["prices-wrong"],
    });

    const entry = recorded[0] as Record<string, unknown>;

    assert.equal(entry.retailerSlug, "aldi-uk");
    assert.equal(entry.storeSlug, "belper-de56-1ar");
    assert.deepEqual(entry.issues, ["prices-wrong"]);
  });

  it("folds a duplicate issue tag away", async () => {
    recorded.length = 0;

    await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "mixed",
      issues: ["too-expensive", "too-expensive"],
    });

    assert.deepEqual((recorded[0] as { issues: string[] }).issues, [
      "too-expensive",
    ]);
  });

  it("rejects an unknown rating", async () => {
    const result = await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "amazing",
    });

    assert.equal(result.status, 400);
    assert.equal(result.code, "INVALID_REQUEST");
  });

  it("rejects an unknown issue tag rather than dropping it", async () => {
    // Silently discarding an unrecognised tag would hide a client/server drift
    // until the collected data was already useless.
    const result = await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "poor",
      issues: ["the-cat-ate-it"],
    });

    assert.equal(result.status, 400);
  });

  it("has nowhere to put free text", async () => {
    recorded.length = 0;

    await post(`/api/meal-plans/${PLAN_ID}/feedback`, {
      rating: "poor",
      comment: "my child is allergic to peanuts and we live at 12 Example Road",
    });

    const entry = recorded[0] as Record<string, unknown>;

    // The extra field is simply not read. There is no field it could land in,
    // which is the point: a free-text box invites people to type things about
    // their household and their health that we should not be storing.
    assert.ok(!("comment" in entry), "feedback must not carry free text");
    assert.deepEqual(Object.keys(entry).sort(), [
      "issues",
      "planId",
      "rating",
      "retailerSlug",
      "storeSlug",
    ]);
  });

  it("rejects a malformed plan id", async () => {
    const result = await post("/api/meal-plans/not-a-plan-id/feedback", {
      rating: "good",
    });

    assert.equal(result.status, 400);
  });

  it("reports a plan that no longer exists", async () => {
    const result = await post(`/api/meal-plans/${"b".repeat(32)}/feedback`, {
      rating: "good",
    });

    assert.equal(result.status, 404);
    assert.equal(result.code, "PLAN_NOT_FOUND");
  });
});
