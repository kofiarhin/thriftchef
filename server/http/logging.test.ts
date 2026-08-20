/**
 * What must never reach an access log.
 *
 * A meal-plan request carries allergies, dislikes and a household size; a
 * product search carries what someone is looking for. None of it is needed to
 * diagnose a request, and all of it is the kind of thing that ends up in a
 * log-aggregation service with a much longer retention than anyone intended.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import { SEARCHABLE_CATALOGUE } from "../testing/catalogueFixtures";
import { ALDI_CATALOGUE } from "../testing/planningFixtures";
import { ALDI_SCOPE } from "../testing/scopeFixtures";
import { searchProductsInMemory } from "../catalogue/productSearchService";
import { safeRoute } from "./requestId";

describe("safeRoute", () => {
  it("keeps the path", () => {
    assert.equal(safeRoute("/api/products"), "/api/products");
  });

  it("drops a product search term", () => {
    assert.equal(
      safeRoute("/api/products?search=gluten%20free%20bread"),
      "/api/products",
    );
  });

  it("drops a postcode", () => {
    assert.equal(
      safeRoute("/api/retailers/aldi-uk/stores?postcode=DE56%201AR"),
      "/api/retailers/aldi-uk/stores",
    );
  });
});

describe("access logging", () => {
  /** Captures what the app actually writes, rather than what it intends to. */
  async function logsFor(run: (base: string) => Promise<void>): Promise<string[]> {
    const lines: string[] = [];
    const original = console.log;
    console.log = (message: unknown) => lines.push(String(message));

    const app = createApp(testConfig(), {
      resolveScope: async () => ALDI_SCOPE,
      searchProducts: async (params) =>
        searchProductsInMemory(SEARCHABLE_CATALOGUE, params),
      mealPlanDependencies: {
        resolveScope: async () => ALDI_SCOPE,
        loadProducts: async () => ALDI_CATALOGUE,
        savePlan: async () => {},
        loadPlan: async () => null,
      },
    });

    const server = await startTestServer(app);

    try {
      await run(server.url);
    } finally {
      await server.close();
      console.log = original;
    }

    return lines;
  }

  it("never logs a product search term", async () => {
    const lines = await logsFor(async (base) => {
      await fetch(`${base}/api/products?search=gluten%20free%20bread`);
    });

    const joined = lines.join("\n");
    assert.ok(joined.length > 0, "the request should have been logged at all");
    assert.ok(!/gluten/i.test(joined), joined);
    assert.ok(/\/api\/products/.test(joined), "the route itself is still logged");
  });

  it("never logs the request body of a plan", async () => {
    const lines = await logsFor(async (base) => {
      await fetch(`${base}/api/meal-plans/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          budgetPence: 9_000,
          householdSize: 2,
          mealsPerDay: ["dinner"],
          appliances: ["hob", "oven"],
          allergies: ["peanuts"],
          dislikedIngredients: ["broccoli"],
          pantryBasics: [],
        }),
      });
    });

    const joined = lines.join("\n");

    assert.ok(!/peanuts/i.test(joined), "an allergy must never be logged");
    assert.ok(!/broccoli/i.test(joined), "a dislike must never be logged");
    assert.ok(!/chicken|rice|pasta/i.test(joined), "no product name may be logged");
    assert.ok(!/Chilli|Stir Fry|Traybake/i.test(joined), "no recipe title may be logged");
  });

  it("still logs enough to diagnose a request", async () => {
    const lines = await logsFor(async (base) => {
      await fetch(`${base}/api/health`);
    });

    const entry = JSON.parse(lines[0]) as Record<string, unknown>;

    assert.ok(entry.requestId, "a correlation id is what makes a log usable");
    assert.equal(entry.method, "GET");
    assert.equal(entry.route, "/api/health");
    assert.equal(entry.status, 200);
    assert.equal(typeof entry.durationMs, "number");
  });
});
