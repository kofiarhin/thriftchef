import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { parseStoreId } from "./catalogueController";

describe("parseStoreId", () => {
  it("falls back to the configured store when none is supplied", () => {
    assert.equal(parseStoreId(undefined, "belper-de56-1ar"), "belper-de56-1ar");
  });

  it("normalizes case and surrounding whitespace", () => {
    assert.equal(parseStoreId("  Belper-DE56-1AR ", "other"), "belper-de56-1ar");
  });

  it("rejects a repeated query parameter rather than guessing", () => {
    assert.throws(
      () => parseStoreId(["a", "b"], "belper-de56-1ar"),
      (error: unknown) => error instanceof ApiError && error.status === 400,
    );
  });

  it("rejects slugs that could reach beyond the catalogue", () => {
    for (const value of ["../admin", "store id", "a".repeat(65), "-leading"]) {
      assert.throws(
        () => parseStoreId(value, "belper-de56-1ar"),
        (error: unknown) => error instanceof ApiError && error.status === 400,
        `expected ${value} to be rejected`,
      );
    }
  });
});
