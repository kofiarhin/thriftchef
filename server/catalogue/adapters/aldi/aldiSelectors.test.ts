import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildListingPageUrl,
  canonicalizeUrl,
  extractHighestPageNumber,
  extractProductId,
  parsePricePence,
} from "./aldiSelectors";

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
    assert.equal(extractHighestPageNumber(["?page=abc", "?page=", "?page=4"]), 4);
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

  it("is not derived from the product name", () => {
    // Two crawls of one product with different marketing copy must remain one
    // product, so identity must come from the numeric suffix alone.
    assert.equal(
      extractProductId("https://www.aldi.co.uk/product/carrots-000000000000262686"),
      extractProductId(
        "https://www.aldi.co.uk/product/carrots-new-recipe-000000000000262686",
      ),
    );
  });
});

describe("canonicalizeUrl", () => {
  it("resolves a relative href against the page", () => {
    assert.equal(
      canonicalizeUrl("/product/carrots-000000000000262686", "https://www.aldi.co.uk/x"),
      "https://www.aldi.co.uk/product/carrots-000000000000262686",
    );
  });

  it("strips tracking parameters and fragments", () => {
    assert.equal(
      canonicalizeUrl(
        "https://www.aldi.co.uk/product/a-000000000000262686?utm_source=email&utm_medium=cpc#reviews",
      ),
      "https://www.aldi.co.uk/product/a-000000000000262686",
    );
  });

  it("keeps a parameter the catalogue actually needs", () => {
    assert.equal(
      canonicalizeUrl("https://www.aldi.co.uk/products/x/k/1?page=3"),
      "https://www.aldi.co.uk/products/x/k/1?page=3",
    );
  });

  it("returns null for something that is not a URL", () => {
    assert.equal(canonicalizeUrl("not a url"), null);
  });
});

describe("buildListingPageUrl", () => {
  it("adds a page parameter", () => {
    assert.equal(
      buildListingPageUrl("https://www.aldi.co.uk/products/x/k/1", 4),
      "https://www.aldi.co.uk/products/x/k/1?page=4",
    );
  });

  it("replaces an existing page parameter rather than repeating it", () => {
    assert.equal(
      buildListingPageUrl("https://www.aldi.co.uk/products/x/k/1?page=2", 5),
      "https://www.aldi.co.uk/products/x/k/1?page=5",
    );
  });
});
