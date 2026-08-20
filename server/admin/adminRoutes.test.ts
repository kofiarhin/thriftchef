/**
 * The admin surface's most important property is that it is usually not there.
 */

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createApp } from "../app";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import {
  clearTestDatabase,
  startTestDatabase,
  stopTestDatabase,
  syncTestIndexes,
} from "../testing/mongoTestServer";
import { bootstrapRetailers } from "../catalogue/core/catalogueMigrations";

const ADMIN_ROUTES = [
  "/api/admin/retailers",
  "/api/admin/crawl-runs",
  "/api/admin/catalogue-quality",
];

async function withApp(
  overrides: Parameters<typeof testConfig>[0],
  run: (get: (path: string) => Promise<Response>) => Promise<void>,
): Promise<void> {
  const server = await startTestServer(createApp(testConfig(overrides)));

  try {
    await run((path) => server.fetch(path));
  } finally {
    await server.close();
  }
}

describe("admin routes", () => {
  before(async () => {
    await startTestDatabase();
    await syncTestIndexes();
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

  after(async () => {
    await stopTestDatabase();
  });

  for (const path of ADMIN_ROUTES) {
    it(`hides ${path} when admin is disabled`, async () => {
      await withApp({ adminEnabled: false }, async (get) => {
        assert.equal((await get(path)).status, 404);
      });
    });

    it(`hides ${path} in production even when enabled`, async () => {
      // A misplaced ADMIN_ENABLED=true must not be the only thing between the
      // internet and the catalogue's internals.
      await withApp({ adminEnabled: true, nodeEnv: "production" }, async (get) => {
        assert.equal((await get(path)).status, 404);
      });
    });

    it(`serves ${path} when explicitly enabled outside production`, async () => {
      await withApp({ adminEnabled: true, nodeEnv: "development" }, async (get) => {
        assert.equal((await get(path)).status, 200);
      });
    });
  }

  it("reports catalogue freshness per retailer and store", async () => {
    await withApp({ adminEnabled: true, nodeEnv: "development" }, async (get) => {
      const body = (await (await get("/api/admin/retailers")).json()) as {
        retailers: Array<{
          slug: string;
          status: string;
          stores: Array<{ isStale: boolean; availableProducts: number }>;
        }>;
      };

      const aldi = body.retailers.find((entry) => entry.slug === "aldi-uk");

      assert.ok(aldi);
      assert.equal(aldi.status, "active");
      assert.equal(aldi.stores.length, 1);
      assert.equal(
        aldi.stores[0].isStale,
        true,
        "a catalogue that has never been crawled must read as stale",
      );
    });
  });

  it("exposes no route that changes anything", async () => {
    await withApp({ adminEnabled: true, nodeEnv: "development" }, async (get) => {
      void get;
    });

    const server = await startTestServer(
      createApp(testConfig({ adminEnabled: true, nodeEnv: "development" })),
    );

    try {
      for (const path of ADMIN_ROUTES) {
        const response = await server.fetch(path, { method: "POST" });
        assert.ok(
          response.status === 404 || response.status === 405,
          `${path} must not accept a POST`,
        );
      }
    } finally {
      await server.close();
    }
  });
});
