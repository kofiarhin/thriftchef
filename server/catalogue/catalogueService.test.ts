import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeCatalogue, type CatalogueCountRow } from "./catalogueService";

const NOW = new Date("2026-08-13T12:00:00.000Z");
const OPTIONS = { storeId: "belper-de56-1ar", now: NOW, staleAfterHours: 72 };

function row(overrides: Partial<CatalogueCountRow>): CatalogueCountRow {
  return {
    catalogueSafetyStatus: "inferred",
    available: 0,
    eligible: 0,
    lastCheckedAt: null,
    ...overrides,
  };
}

describe("summarizeCatalogue", () => {
  it("reports a controlled empty status when nothing has been crawled", () => {
    const status = summarizeCatalogue([], OPTIONS);

    assert.equal(status.retailer, "aldi-uk");
    assert.equal(status.storeId, "belper-de56-1ar");
    assert.equal(status.availableProducts, 0);
    assert.equal(status.eligibleProducts, 0);
    assert.equal(status.lastCheckedAt, null);
    assert.equal(status.isStale, true);
    assert.deepEqual(status.safetyBreakdown, {
      verified: 0,
      inferred: 0,
      incomplete: 0,
      ambiguous: 0,
    });
  });

  it("totals available and eligible products across safety statuses", () => {
    const status = summarizeCatalogue(
      [
        row({
          catalogueSafetyStatus: "inferred",
          available: 164,
          eligible: 164,
          lastCheckedAt: new Date("2026-08-13T09:00:00.000Z"),
        }),
        row({ catalogueSafetyStatus: "incomplete", available: 55, eligible: 0 }),
        row({ catalogueSafetyStatus: "ambiguous", available: 19, eligible: 0 }),
      ],
      OPTIONS,
    );

    assert.equal(status.availableProducts, 238);
    assert.equal(status.eligibleProducts, 164);
    assert.deepEqual(status.safetyBreakdown, {
      verified: 0,
      inferred: 164,
      incomplete: 55,
      ambiguous: 19,
    });
  });

  it("keeps the inferred status visible in the breakdown", () => {
    const status = summarizeCatalogue(
      [row({ catalogueSafetyStatus: "inferred", available: 10, eligible: 10 })],
      OPTIONS,
    );

    assert.equal(status.safetyBreakdown.inferred, 10);
    assert.equal(status.safetyBreakdown.verified, 0);
  });

  it("uses the most recent check across rows to decide freshness", () => {
    const status = summarizeCatalogue(
      [
        row({ available: 1, lastCheckedAt: new Date("2026-08-01T00:00:00.000Z") }),
        row({
          catalogueSafetyStatus: "verified",
          available: 1,
          lastCheckedAt: new Date("2026-08-13T06:00:00.000Z"),
        }),
      ],
      OPTIONS,
    );

    assert.equal(status.lastCheckedAt, "2026-08-13T06:00:00.000Z");
    assert.equal(status.isStale, false);
  });

  it("marks the catalogue stale once past the configured threshold", () => {
    const justInside = summarizeCatalogue(
      [
        row({
          available: 1,
          lastCheckedAt: new Date("2026-08-10T13:00:00.000Z"),
        }),
      ],
      OPTIONS,
    );
    const justOutside = summarizeCatalogue(
      [
        row({
          available: 1,
          lastCheckedAt: new Date("2026-08-10T11:00:00.000Z"),
        }),
      ],
      OPTIONS,
    );

    assert.equal(justInside.isStale, false, "71 hours old is fresh");
    assert.equal(justOutside.isStale, true, "73 hours old is stale");
  });
});
