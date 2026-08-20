import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import { parseIdentity } from "./catalogueController";

describe("parseIdentity", () => {
  it("falls back to the configured store when none is supplied", () => {
    assert.equal(parseIdentity(undefined, "storeId", "belper-de56-1ar"), "belper-de56-1ar");
  });

  it("normalizes case and surrounding whitespace", () => {
    assert.equal(parseIdentity("  Belper-DE56-1AR ", "storeId", "other"), "belper-de56-1ar");
  });

  it("rejects a repeated query parameter rather than guessing", () => {
    assert.throws(
      () => parseIdentity(["a", "b"], "storeId", "belper-de56-1ar"),
      (error: unknown) => error instanceof ApiError && error.status === 400,
    );
  });

  it("rejects slugs that could reach beyond the catalogue", () => {
    for (const value of ["../admin", "store id", "a".repeat(65), "-leading"]) {
      assert.throws(
        () => parseIdentity(value, "storeId", "belper-de56-1ar"),
        (error: unknown) => error instanceof ApiError && error.status === 400,
        `expected ${value} to be rejected`,
      );
    }
  });
});
