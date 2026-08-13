import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractHighestPageNumber,
  extractProductId,
  parsePricePence,
} from "./aldiCrawler";

describe("extractHighestPageNumber", () => {
  it("returns 1 when the listing advertises no further pages", () => {
    assert.equal(extractHighestPageNumber([]), 1);
    assert.equal(extractHighestPageNumber(["/products/fresh-food/k/123"]), 1);
  });

  it("returns the highest advertised page number", () => {
    assert.equal(
      extractHighestPageNumber([
        "/products/fresh-food/vegetables/k/123?page=2",
        "/products/fresh-food/vegetables/k/123?page=5",
        "/products/fresh-food/vegetables/k/123?page=3",
      ]),
      5,
    );
  });

  it("ignores malformed page parameters", () => {
    assert.equal(
      extractHighestPageNumber(["?page=abc", "?page=", "?page=4"]),
      4,
    );
  });

  it("reads page when it is not the first query parameter", () => {
    assert.equal(extractHighestPageNumber(["/k/123?sort=price&page=7"]), 7);
  });
});

describe("parsePricePence", () => {
  it("parses pounds into pence", () => {
    assert.equal(parsePricePence("£1.49"), 149);
    assert.equal(parsePricePence("£12"), 1200);
    assert.equal(parsePricePence("£1,299.99"), 129999);
  });

  it("returns null when there is no price", () => {
    assert.equal(parsePricePence(null), null);
    assert.equal(parsePricePence(""), null);
    assert.equal(parsePricePence("Out of stock"), null);
  });
});

describe("extractProductId", () => {
  it("extracts the trailing Aldi product id", () => {
    assert.equal(
      extractProductId(
        "https://www.aldi.co.uk/product/four-seasons-sweetcorn-000000000000262686",
      ),
      "000000000000262686",
    );
  });

  it("returns null for a non-product url", () => {
    // Category keys are short and slash-separated, so they must not be
    // mistaken for the 12+ digit product id that follows a hyphen.
    assert.equal(
      extractProductId("https://www.aldi.co.uk/products/frozen-food/k/158816"),
      null,
    );
    assert.equal(extractProductId("https://www.aldi.co.uk/"), null);
  });
});
