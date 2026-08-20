/**
 * The suite every retailer adapter must pass.
 *
 * Adapters are the part of the system most likely to be written in a hurry,
 * against a site that changes without warning, by someone who only cares about
 * one shop. These are the rules that keep a hurried adapter from corrupting a
 * catalogue everyone else depends on — and a new retailer is not activated
 * until its fixtures pass them unmodified.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  RetailerAdapterRegistry,
  type RetailerCatalogueAdapter,
} from "./retailerAdapter";
import {
  canonicalUrl,
  mergeCategoryPaths,
  normalizeCatalogueProduct,
  parsePriceMinor,
} from "../core/catalogueNormalization";
import type { NormalizedCatalogueProduct } from "./normalizedCatalogueProduct";

const HOSTS = ["aldi.co.uk"] as const;

function candidate(
  overrides: Partial<NormalizedCatalogueProduct> = {},
): Partial<NormalizedCatalogueProduct> {
  return {
    retailerProductId: "4088600123456",
    name: "Chicken Breast Fillets",
    brand: "Ashfields",
    description: "British chicken breast fillets.",
    categoryPaths: [["Fresh Food", "Poultry"]],
    priceMinor: 389,
    packageSizeRaw: "650g",
    comparisonPriceRaw: "£5.98 per kg",
    productUrl: "https://www.aldi.co.uk/product/4088600123456",
    imageUrl: "https://www.aldi.co.uk/images/4088600123456.jpg",
    available: true,
    ...overrides,
  };
}

describe("adapter contract: product identity", () => {
  it("requires a stable retailer product id", () => {
    const result = normalizeCatalogueProduct(
      candidate({ retailerProductId: "" }),
      HOSTS,
    );

    assert.equal(result.product, null);
    assert.ok(result.issues.includes("MISSING_PRODUCT_ID"));
  });

  it("keeps identity independent of the product name", () => {
    // Two crawls of the same product with different marketing copy must still
    // be one product. An id derived from the name would make them two.
    const first = normalizeCatalogueProduct(candidate(), HOSTS).product;
    const second = normalizeCatalogueProduct(
      candidate({ name: "Chicken Breast Fillets (New Recipe)" }),
      HOSTS,
    ).product;

    assert.equal(first?.retailerProductId, second?.retailerProductId);
  });

  it("rejects a product with no name", () => {
    assert.ok(
      normalizeCatalogueProduct(candidate({ name: "   " }), HOSTS).issues.includes(
        "MISSING_NAME",
      ),
    );
  });
});

describe("adapter contract: price", () => {
  for (const [text, expected] of [
    ["£3.49", 349],
    ["3.49", 349],
    ["49p", 49],
    ["£12", 1200],
    ["  £1.05  ", 105],
  ] as const) {
    it(`parses ${text} as ${expected} minor units`, () => {
      assert.equal(parsePriceMinor(text), expected);
    });
  }

  for (const text of ["", "   ", "Add to basket", "from", null]) {
    it(`refuses to invent a price from ${JSON.stringify(text)}`, () => {
      assert.equal(parsePriceMinor(text), null);
    });
  }

  for (const priceMinor of [0, -100, 3.49, Number.NaN, 60_000]) {
    it(`rejects an unusable price: ${priceMinor}`, () => {
      assert.ok(
        normalizeCatalogueProduct(candidate({ priceMinor }), HOSTS).issues.includes(
          "INVALID_PRICE",
        ),
      );
    });
  }

  it("always yields an integer in minor units", () => {
    const product = normalizeCatalogueProduct(candidate(), HOSTS).product;

    assert.ok(product);
    assert.ok(Number.isInteger(product.priceMinor));
    assert.ok(product.priceMinor > 0);
  });
});

describe("adapter contract: URLs and hosts", () => {
  it("accepts a canonical URL on an allowed host", () => {
    const { url } = canonicalUrl("https://www.aldi.co.uk/product/1", HOSTS);

    assert.equal(url, "https://www.aldi.co.uk/product/1");
  });

  it("strips tracking query strings and fragments", () => {
    const { url } = canonicalUrl(
      "https://www.aldi.co.uk/product/1?utm_source=x#reviews",
      HOSTS,
    );

    assert.equal(url, "https://www.aldi.co.uk/product/1");
  });

  it("refuses a host the adapter did not declare", () => {
    // The allowlist is the SSRF boundary: a crawl must never be steerable at
    // an arbitrary host by anything on a retailer's page.
    const { url, issue } = canonicalUrl("https://evil.example.com/x", HOSTS);

    assert.equal(url, null);
    assert.equal(issue, "DISALLOWED_HOST");
  });

  it("refuses a non-http scheme", () => {
    assert.equal(canonicalUrl("file:///etc/passwd", HOSTS).issue, "INVALID_URL");
    assert.equal(canonicalUrl("javascript:alert(1)", HOSTS).issue, "INVALID_URL");
  });

  it("drops an off-host image rather than rejecting the product", () => {
    const result = normalizeCatalogueProduct(
      candidate({ imageUrl: "https://cdn.example.com/a.jpg" }),
      HOSTS,
    );

    assert.ok(result.product, "a missing picture must not lose a product");
    assert.equal(result.product.imageUrl, null);
  });
});

describe("adapter contract: missing data", () => {
  it("stores absent fields as null rather than inventing them", () => {
    const result = normalizeCatalogueProduct(
      candidate({
        brand: null,
        description: undefined,
        packageSizeRaw: "",
        ingredientsRaw: null,
        allergenAdviceRaw: undefined,
      }),
      HOSTS,
    );

    assert.ok(result.product);
    assert.equal(result.product.brand, null);
    assert.equal(result.product.description, null);
    assert.equal(result.product.packageSizeRaw, null);
    assert.equal(result.product.ingredientsRaw, null);
    assert.equal(result.product.allergenAdviceRaw, null);
  });

  it("survives a product with no categories at all", () => {
    const result = normalizeCatalogueProduct(candidate({ categoryPaths: [] }), HOSTS);

    assert.ok(result.product);
    assert.deepEqual(result.product.categoryPaths, []);
  });
});

describe("adapter contract: determinism", () => {
  it("normalizes identical input identically", () => {
    const first = normalizeCatalogueProduct(candidate(), HOSTS);
    const second = normalizeCatalogueProduct(candidate(), HOSTS);

    assert.deepEqual(first, second);
  });

  it("collapses whitespace the same way every time", () => {
    const result = normalizeCatalogueProduct(
      candidate({ name: "  Chicken   Breast \n Fillets  " }),
      HOSTS,
    );

    assert.equal(result.product?.name, "Chicken Breast Fillets");
  });
});

describe("adapter contract: category merging", () => {
  it("does not duplicate a path already recorded", () => {
    const merged = mergeCategoryPaths(
      [["Fresh Food", "Poultry"]],
      [["Fresh Food", "Poultry"]],
    );

    assert.deepEqual(merged, [["Fresh Food", "Poultry"]]);
  });

  it("keeps a product's second section", () => {
    const merged = mergeCategoryPaths(
      [["Fresh Food", "Poultry"]],
      [["Dinner Ideas", "Roasts"]],
    );

    assert.equal(merged.length, 2);
  });
});

describe("adapter registry", () => {
  function stubAdapter(adapterKey: string): RetailerCatalogueAdapter {
    return {
      adapterKey,
      adapterVersion: "1.0.0",
      allowedHosts: ["example.com"],
      prepareSession: async () => {},
      verifyStoreSelection: async () => true,
      discoverCategories: async () => [],
      extractListingPage: async () => ({ products: [], nextPages: [], skipped: 0 }),
      extractProduct: async () => null,
    };
  }

  it("resolves an adapter by the key a retailer record names", () => {
    const registry = new RetailerAdapterRegistry().register(stubAdapter("aldi"));

    assert.equal(registry.get("aldi").adapterKey, "aldi");
  });

  it("refuses to register two adapters under one key", () => {
    const registry = new RetailerAdapterRegistry().register(stubAdapter("aldi"));

    assert.throws(() => registry.register(stubAdapter("aldi")), /already registered/i);
  });

  it("names the registered adapters when one is missing", () => {
    const registry = new RetailerAdapterRegistry().register(stubAdapter("aldi"));

    assert.throws(() => registry.get("tesco"), /Registered adapters: aldi/);
  });

  it("declares an allowed host for every adapter", () => {
    const registry = new RetailerAdapterRegistry().register(stubAdapter("aldi"));

    for (const key of registry.keys()) {
      assert.ok(
        registry.get(key).allowedHosts.length > 0,
        `${key} must declare the hosts it may visit`,
      );
    }
  });
});
