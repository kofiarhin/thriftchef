/**
 * The pure half of the Tesco adapter, exercised without a browser.
 *
 * Everything here is a rule about reading an untrusted retailer page: what a
 * product's identity is, what its price is, which URLs may be visited, and
 * where a food-safety field stops. They are tested apart from Playwright
 * because this is where a mistake is silent — a selector that stops matching
 * does not throw, it returns nothing, and a crawl "succeeds" empty.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TESCO_DETAIL_STOP_LABELS,
  TESCO_HOSTS,
  buildListingPageUrl,
  canonicalTescoProductUrl,
  detectSelectorDrift,
  extractLabelledSection,
  extractTescoProductId,
  isAllowedTescoBrowseUrl,
  isAllowedTescoImageUrl,
  parseAvailability,
  parseDisplayedRange,
  parseGbpMinor,
  reconcileProductId,
  redactPostcode,
  resolveNextPageUrl,
  selectStandardPrice,
} from "./tescoSelectors";

describe("Tesco product identity", () => {
  it("reads the numeric id from an absolute product URL", () => {
    assert.equal(
      extractTescoProductId("https://www.tesco.com/shop/en-GB/products/296057883"),
      "296057883",
    );
  });

  it("reads the numeric id from a relative product URL", () => {
    assert.equal(extractTescoProductId("/shop/en-GB/products/301219119"), "301219119");
  });

  it("ignores a trailing slash, a query string and a fragment", () => {
    for (const url of [
      "https://www.tesco.com/shop/en-GB/products/301219119/",
      "https://www.tesco.com/shop/en-GB/products/301219119?bcuid=99",
      "https://www.tesco.com/shop/en-GB/products/301219119#reviews",
    ]) {
      assert.equal(extractTescoProductId(url), "301219119", url);
    }
  });

  it("refuses a URL that is not a product page", () => {
    assert.equal(
      extractTescoProductId("https://www.tesco.com/shop/en-GB/browse/fresh-food"),
      null,
    );
    assert.equal(extractTescoProductId("https://www.tesco.com/"), null);
    // A number somewhere in the path is not a product id.
    assert.equal(
      extractTescoProductId("https://www.tesco.com/shop/en-GB/products/301219119/reviews"),
      null,
    );
  });

  it("never derives identity from the product name", () => {
    // Two crawls of one product with different marketing copy must remain one
    // product, so identity comes from the numeric path segment alone.
    assert.equal(
      extractTescoProductId("/shop/en-GB/products/301219119"),
      extractTescoProductId("/shop/en-GB/products/301219119?name=tesco-bananas-loose"),
    );
  });

  it("accepts a tile id and a URL id that agree", () => {
    assert.deepEqual(reconcileProductId({ tileId: "301219119", urlId: "301219119" }), {
      productId: "301219119",
      error: null,
    });
  });

  it("accepts a URL id when the tile carries no id", () => {
    assert.deepEqual(reconcileProductId({ tileId: null, urlId: "301219119" }), {
      productId: "301219119",
      error: null,
    });
  });

  it("rejects a tile whose id disagrees with its URL", () => {
    // Repairing this by preferring one side would silently price one product
    // as another. The tile is dropped and the disagreement is reported.
    const result = reconcileProductId({ tileId: "999999999", urlId: "301219120" });

    assert.equal(result.productId, null);
    assert.equal(result.error, "TESCO_PRODUCT_ID_MISMATCH");
  });

  it("rejects a tile with no id on either side", () => {
    assert.equal(
      reconcileProductId({ tileId: null, urlId: null }).error,
      "TESCO_PRODUCT_ID_MISSING",
    );
  });
});

describe("Tesco prices", () => {
  it("parses whole pounds", () => {
    assert.equal(parseGbpMinor("£1"), 100);
    assert.equal(parseGbpMinor("£12"), 1200);
  });

  it("parses decimal pounds", () => {
    assert.equal(parseGbpMinor("£1.30"), 130);
    assert.equal(parseGbpMinor("£0.75"), 75);
    assert.equal(parseGbpMinor("£10.05"), 1005);
  });

  it("parses a single decimal place as tenths of a pound", () => {
    assert.equal(parseGbpMinor("£1.5"), 150);
  });

  it("parses without binary floating point", () => {
    // 8.29 * 100 is 828.9999... in binary floating point. String parsing is
    // the only way this is 829 every time rather than most of the time.
    assert.equal(parseGbpMinor("£8.29"), 829);
    assert.equal(parseGbpMinor("£1.15"), 115);
    assert.equal(parseGbpMinor("£4.35"), 435);
  });

  it("returns null rather than inventing a price", () => {
    for (const text of [null, undefined, "", "   ", "Add", "Out of stock", "£"]) {
      assert.equal(parseGbpMinor(text), null, JSON.stringify(text));
    }
  });

  it("takes the normal shelf price when a Clubcard price is also shown", () => {
    const result = selectStandardPrice({
      priceText: "£0.16",
      promotionText: "Clubcard Price £0.12 Each Clubcard Price",
    });

    assert.equal(result.priceMinor, 16);
    assert.equal(result.promotionObserved, true);
    assert.equal(result.error, null);
  });

  it("refuses a product priced only by a Clubcard offer", () => {
    // Understating the user's cost is worse than losing a product: the
    // shopping list would not add up at the till.
    const result = selectStandardPrice({
      priceText: null,
      promotionText: "Clubcard Price £3.50 Clubcard Price",
    });

    assert.equal(result.priceMinor, null);
    assert.equal(result.error, "TESCO_STANDARD_PRICE_MISSING");
  });

  it("never reads a Clubcard price as the shelf price", () => {
    const result = selectStandardPrice({
      priceText: "Clubcard Price £3.50 Clubcard Price",
      promotionText: null,
    });

    assert.equal(result.priceMinor, null);
    assert.equal(result.error, "TESCO_STANDARD_PRICE_MISSING");
  });

  it("ignores any other conditional price", () => {
    for (const conditional of [
      "Any 3 for £5.00",
      "2 for £2 Multibuy",
      "Save 50p with a coupon",
    ]) {
      assert.equal(
        selectStandardPrice({ priceText: conditional, promotionText: null }).priceMinor,
        null,
        conditional,
      );
    }
  });

  it("reports a missing price with no promotion at all", () => {
    assert.equal(
      selectStandardPrice({ priceText: null, promotionText: null }).error,
      "TESCO_STANDARD_PRICE_MISSING",
    );
  });
});

describe("Tesco URLs and hosts", () => {
  it("declares exactly one navigable host", () => {
    assert.deepEqual([...TESCO_HOSTS], ["www.tesco.com"]);
  });

  it("canonicalises a product URL to its path", () => {
    assert.equal(
      canonicalTescoProductUrl(
        "https://www.tesco.com/shop/en-GB/products/296057883?bcuid=1234#reviews",
      ),
      "https://www.tesco.com/shop/en-GB/products/296057883",
    );
  });

  it("resolves a relative product URL against the page it was found on", () => {
    assert.equal(
      canonicalTescoProductUrl(
        "/shop/en-GB/products/301219119",
        "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit",
      ),
      "https://www.tesco.com/shop/en-GB/products/301219119",
    );
  });

  it("refuses a host that only looks like Tesco", () => {
    // The allowlist is exact: a suffix match would accept
    // www.tesco.com.evil.example, and a subdomain match would accept any
    // Tesco host including ones this adapter has never been tested against.
    for (const url of [
      "https://tesco-offers.example.com/shop/en-GB/products/400000001",
      "https://www.tesco.com.evil.example/shop/en-GB/products/1",
      "https://groceries.tesco.com/shop/en-GB/products/1",
    ]) {
      assert.equal(canonicalTescoProductUrl(url), null, url);
    }
  });

  it("refuses credentials, a non-standard port and a non-HTTPS scheme", () => {
    for (const url of [
      "https://user:pass@www.tesco.com/shop/en-GB/products/1",
      "https://www.tesco.com:8443/shop/en-GB/products/1",
      "http://www.tesco.com/shop/en-GB/products/1",
      "javascript:alert(1)",
      "file:///etc/passwd",
    ]) {
      assert.equal(canonicalTescoProductUrl(url), null, url);
    }
  });

  it("refuses a path that is not a product page", () => {
    assert.equal(
      canonicalTescoProductUrl("https://www.tesco.com/shop/en-GB/browse/fresh-food"),
      null,
    );
    assert.equal(canonicalTescoProductUrl("https://www.tesco.com/account"), null);
  });

  it("accepts only browse URLs beneath the curated path", () => {
    assert.equal(
      isAllowedTescoBrowseUrl(
        "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit?page=2",
      ),
      true,
    );
    assert.equal(
      isAllowedTescoBrowseUrl("https://www.tesco.com/shop/en-GB/products/1"),
      false,
    );
    assert.equal(isAllowedTescoBrowseUrl("https://evil.example.com/shop/en-GB/browse/x"), false);
  });

  it("validates an image host separately from the navigation allowlist", () => {
    // Images are stored as data and never visited, so the content host is
    // allowed here without becoming somewhere the crawler may navigate.
    assert.equal(
      isAllowedTescoImageUrl("https://digitalcontent.api.tesco.com/images/301219119.jpeg"),
      true,
    );
    assert.equal(isAllowedTescoImageUrl("https://www.tesco.com/images/301219119.jpeg"), true);
    assert.equal(isAllowedTescoImageUrl("https://cdn.example.com/a.jpg"), false);
    assert.equal(
      canonicalTescoProductUrl("https://digitalcontent.api.tesco.com/shop/en-GB/products/1"),
      null,
      "an image host must not become navigable",
    );
  });
});

describe("Tesco pagination", () => {
  it("reads the displayed item range", () => {
    assert.deepEqual(parseDisplayedRange("Showing 1 - 24 of 96 items"), {
      from: 1,
      to: 24,
      total: 96,
    });
  });

  it("reads a range with thousands separators", () => {
    assert.deepEqual(parseDisplayedRange("Showing 25 - 48 of 1,204 items"), {
      from: 25,
      to: 48,
      total: 1204,
    });
  });

  it("returns null when no range is displayed", () => {
    assert.equal(parseDisplayedRange(null), null);
    assert.equal(parseDisplayedRange("Fresh Fruit"), null);
  });

  it("builds a listing page URL preserving the category path", () => {
    assert.equal(
      buildListingPageUrl("https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit", 3),
      "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit?page=3",
    );
  });

  it("preserves a supported page-size parameter when paging", () => {
    assert.equal(
      buildListingPageUrl(
        "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit?count=48",
        2,
      ),
      "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit?count=48&page=2",
    );
  });

  it("refuses to page a URL that is not a browse URL", () => {
    assert.equal(buildListingPageUrl("https://evil.example.com/browse", 2), null);
  });

  it("resolves a next-page link against the listing it was found on", () => {
    assert.equal(
      resolveNextPageUrl(
        "/shop/en-GB/browse/fresh-food/fresh-fruit?page=2",
        "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit",
      ),
      "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit?page=2",
    );
  });

  it("refuses a next-page link that leaves the browse path or the host", () => {
    const base = "https://www.tesco.com/shop/en-GB/browse/fresh-food/fresh-fruit";

    assert.equal(resolveNextPageUrl("https://evil.example.com/?page=2", base), null);
    assert.equal(resolveNextPageUrl("/account?page=2", base), null);
  });

  it("reports when the displayed range has reached the total", () => {
    assert.equal(parseDisplayedRange("Showing 73 - 96 of 96 items")?.to, 96);
  });
});

describe("Tesco selector drift", () => {
  it("fails loudly when a page claiming products yields no tiles", () => {
    const drift = detectSelectorDrift({
      advertisedTotal: 96,
      tilesSeen: 0,
      validProducts: 0,
    });

    assert.equal(drift?.code, "TESCO_SELECTOR_DRIFT");
  });

  it("fails loudly when tiles are seen but none can be read", () => {
    const drift = detectSelectorDrift({
      advertisedTotal: 96,
      tilesSeen: 24,
      validProducts: 0,
    });

    assert.equal(drift?.code, "TESCO_SELECTOR_DRIFT");
  });

  it("treats a materially reduced extraction rate as drift, not absence", () => {
    // A sudden fall from 24 readable tiles to 2 is a layout change. Reading it
    // as "the shop stopped stocking things" would retire a working catalogue.
    const drift = detectSelectorDrift({
      advertisedTotal: 24,
      tilesSeen: 24,
      validProducts: 2,
    });

    assert.equal(drift?.code, "TESCO_SELECTOR_DRIFT");
  });

  it("is silent for a healthy page", () => {
    assert.equal(
      detectSelectorDrift({ advertisedTotal: 24, tilesSeen: 24, validProducts: 22 }),
      null,
    );
  });

  it("is silent for a page that genuinely advertises nothing", () => {
    assert.equal(
      detectSelectorDrift({ advertisedTotal: 0, tilesSeen: 0, validProducts: 0 }),
      null,
    );
  });

  it("is silent when the page does not advertise a total at all", () => {
    assert.equal(
      detectSelectorDrift({ advertisedTotal: null, tilesSeen: 0, validProducts: 0 }),
      null,
    );
  });
});

describe("Tesco availability", () => {
  it("reads the availability attribute", () => {
    assert.equal(parseAvailability({ attribute: "true", text: null }), true);
    assert.equal(parseAvailability({ attribute: "false", text: null }), false);
  });

  it("reads an explicit unavailability message when the attribute is absent", () => {
    assert.equal(
      parseAvailability({
        attribute: null,
        text: "Sorry, product currently not available",
      }),
      false,
    );
  });

  it("is indeterminate rather than optimistic when there is no evidence", () => {
    // Guessing "available" puts out-of-stock products in a shopping list.
    assert.equal(parseAvailability({ attribute: null, text: null }), null);
  });
});

describe("Tesco labelled sections", () => {
  const pageText = [
    "Ingredients",
    "Broccoli.",
    "Allergy Information",
    "Packed in a facility that also handles celery.",
    "Storage",
    "Keep refrigerated. Once opened consume within 2 days.",
    "Preparation and Usage",
    "Steam for 4 minutes.",
  ].join("\n");

  it("reads a labelled block", () => {
    assert.equal(
      extractLabelledSection(pageText, ["ingredients"], TESCO_DETAIL_STOP_LABELS),
      "Broccoli.",
    );
  });

  it("stops at the next peer heading", () => {
    // Storage or preparation text inside an allergy field is the failure a
    // user with an allergy cannot check.
    const allergy = extractLabelledSection(
      pageText,
      ["allergy information"],
      TESCO_DETAIL_STOP_LABELS,
    );

    assert.equal(allergy, "Packed in a facility that also handles celery.");
    assert.ok(!String(allergy).toLowerCase().includes("refrigerated"));
    assert.ok(!String(allergy).toLowerCase().includes("steam"));
  });

  it("returns null for a section the page does not publish", () => {
    assert.equal(
      extractLabelledSection(pageText, ["dietary information"], TESCO_DETAIL_STOP_LABELS),
      null,
    );
  });

  it("reads a value written inline after its label", () => {
    assert.equal(
      extractLabelledSection(
        "Ingredients: Bananas.\nStorage\nCool dry place.",
        ["ingredients"],
        TESCO_DETAIL_STOP_LABELS,
      ),
      "Bananas.",
    );
  });

  it("is bounded so a missing stop label cannot swallow the page", () => {
    const runaway = [
      "Ingredients",
      ...Array.from({ length: 200 }, (_, index) => `line ${index}`),
    ].join("\n");

    const value = extractLabelledSection(runaway, ["ingredients"], TESCO_DETAIL_STOP_LABELS);

    assert.ok(value);
    assert.ok(value.split(" ").length < 60, "the block must be bounded");
  });
});

describe("Tesco log redaction", () => {
  it("keeps only the outward area of a postcode", () => {
    // A full postcode identifies a household. The outward area is enough to
    // debug a fulfilment scope and is not a home address.
    assert.equal(redactPostcode("CV1 2AB"), "CV1");
    assert.equal(redactPostcode("de56 1ar"), "DE56");
  });

  it("never echoes a value it cannot recognise", () => {
    assert.equal(redactPostcode("not-a-postcode"), "[redacted]");
    assert.equal(redactPostcode(null), "[redacted]");
  });
});
