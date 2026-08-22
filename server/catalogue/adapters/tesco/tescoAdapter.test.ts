/**
 * The Tesco adapter, driven against saved HTML in a real browser.
 *
 * Not a mock: the fixtures are served to a genuine Chromium page, so the
 * selectors, the tile loop, the pager reading and the detail extraction all
 * run exactly as they do against the live site. The one thing absent is the
 * network — which is the only part that must never run in a test.
 *
 * These are what catch selector drift and the two Tesco-specific mistakes that
 * are silent rather than loud: a Clubcard price read as a shelf price, and a
 * tile whose id disagrees with its link.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { chromium, type Browser, type Page } from "playwright";
import { TescoAdapter, TESCO_ADAPTER_VERSION } from "./tescoAdapter";
import { TESCO_CATEGORIES, TESCO_DIAGNOSTIC_CATEGORY } from "./tescoCategories";
import {
  TESCO_SELECTORS,
  TescoRouteNotFoundError,
  TescoSelectorDriftError,
  isAllowedTescoListingUrl,
} from "./tescoSelectors";
import type { AdapterContext, RetailerListingProduct } from "../../contracts/retailerAdapter";
import { normalizeCatalogueProduct } from "../../core/catalogueNormalization";

const FIXTURES = join(__dirname, "../../../testing/fixtures/tesco");

function fixture(name: string): string {
  return readFileSync(join(FIXTURES, name), "utf8");
}

/** The category the listing fixture stands for. */
const FRESH_FRUIT = {
  key: "fresh-fruit",
  url: "https://www.tesco.com/groceries/en-GB/shop/fresh-food/fresh-fruit/all",
  categoryPath: ["Fresh Food", "Fresh Fruit"],
  enabled: true,
};

let browser: Browser;

/**
 * Serves a fixture at its real URL.
 *
 * Routing rather than `setContent` so `page.url()` is a www.tesco.com address:
 * relative hrefs resolve the way they do in production, and the host allowlist
 * is exercised rather than bypassed.
 */
async function pageWith(html: string, url: string): Promise<Page> {
  const page = await browser.newPage();

  await page.route("**/*", async (route) => {
    const requestUrl = route.request().url();

    if (requestUrl.split("?")[0] === url.split("?")[0]) {
      // The charset matters: without it Chromium decodes UTF-8 as latin-1 and
      // "£0.16" arrives as "Â£0.16", failing price parsing for a reason that
      // has nothing to do with the adapter.
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
      return;
    }

    // Nothing else may load. A fixture test that reaches the network is not a
    // fixture test.
    await route.abort();
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  return page;
}

function contextFor(page: Page, overrides: Partial<AdapterContext> = {}): AdapterContext {
  return {
    page,
    externalStoreId: "tesco-online-cv1",
    expectedStoreText: "Delivery to CV1",
    log: () => {},
    ...overrides,
  };
}

function listingFor(
  overrides: Partial<RetailerListingProduct> = {},
): RetailerListingProduct {
  return {
    retailerProductId: "301219119",
    productUrl: "https://www.tesco.com/groceries/en-GB/products/301219119",
    name: "Tesco Bananas Loose",
    brand: null,
    packageSizeRaw: "Each",
    comparisonPriceRaw: "£1.14/kg",
    priceText: "£0.16",
    imageUrl: null,
    available: true,
    categoryPaths: [FRESH_FRUIT.categoryPath],
    ...overrides,
  };
}

before(async () => {
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser.close();
});

describe("Tesco adapter: identity and registration", () => {
  it("registers under the key a retailer record names", () => {
    const adapter = new TescoAdapter();

    assert.equal(adapter.adapterKey, "tesco");
    assert.equal(adapter.adapterVersion, TESCO_ADAPTER_VERSION);
  });

  it("declares exactly the hosts it may visit", () => {
    assert.deepEqual([...new TescoAdapter().allowedHosts], ["www.tesco.com"]);
  });

  it("crawls only curated food departments", async () => {
    const categories = await new TescoAdapter().discoverCategories();

    assert.ok(categories.length > 0);
    for (const category of categories) {
      assert.ok(
        category.url.startsWith("https://www.tesco.com/groceries/en-GB/shop/"),
        `${category.key} must stay beneath the current category path`,
      );
    }

    const keys = categories.map((category) => category.key);
    assert.equal(new Set(keys).size, keys.length, "category keys must be unique");
  });

  it("carries no category on the retired /shop/en-GB/browse/ route", async () => {
    // The regression. Every one of these answered "Not down this aisle", so a
    // crawl using them read nothing and had no way to say why.
    const categories = [
      ...(await new TescoAdapter().discoverCategories()),
      TESCO_DIAGNOSTIC_CATEGORY,
    ];

    for (const category of categories) {
      assert.ok(
        !category.url.includes("/shop/en-GB/browse/"),
        `${category.key} still uses the retired browse route`,
      );
    }
  });

  it("every category URL passes the navigation allowlist", async () => {
    const categories = [
      ...(await new TescoAdapter().discoverCategories()),
      TESCO_DIAGNOSTIC_CATEGORY,
    ];

    for (const category of categories) {
      assert.equal(
        isAllowedTescoListingUrl(category.url),
        true,
        `${category.key} (${category.url}) is not a navigable listing URL`,
      );
    }
  });

  it("bounds the diagnostic to the verified fresh-food listing", () => {
    // The one route confirmed against the live site. A diagnostic exists to
    // prove the selectors still match, and it can only do that from a page
    // that renders.
    assert.equal(
      TESCO_DIAGNOSTIC_CATEGORY.url,
      "https://www.tesco.com/groceries/en-GB/shop/fresh-food/all",
    );
  });

  it("excludes departments that cannot feed a meal plan", () => {
    const urls = TESCO_CATEGORIES.map((category) => category.url).join(" ");

    for (const excluded of ["beer-wine", "tobacco", "pharmacy", "pets", "clothing"]) {
      assert.ok(!urls.includes(excluded), `${excluded} must not be crawled`);
    }
  });

  it("depends on no generated CSS class in its primary selectors", () => {
    // Minified class names change without notice and carry no meaning. Every
    // primary selector is a data-testid, a role, or an element relationship.
    const selectors = JSON.stringify(TESCO_SELECTORS);
    const classSelectors = selectors.match(/(?:^|[\s,>[])\.[a-zA-Z][\w-]*/g) ?? [];

    assert.deepEqual(classSelectors, []);
  });
});

/**
 * The markup Tesco actually serves, captured 2026-08-22.
 *
 * `listing.html` was authored from a written specification before a live
 * session existed, and it is wrong in the one way that matters: it gives the
 * title link a `data-testid` that Tesco does not publish. A no-write
 * diagnostic against the live site read 29 tiles and zero products, every one
 * counted TESCO_PRODUCT_ID_MISSING, because the link the id is read from could
 * not be found. These tests are that failure, pinned.
 */
describe("Tesco adapter: the listing markup Tesco serves today", () => {
  // The configured route. Tesco answers it with /shop/en-GB/browse/..., so the
  // fixture is served at the redirected URL exactly as a crawl sees it.
  const FRESH_FOOD = {
    key: "diagnostic-fresh-food",
    url: "https://www.tesco.com/groceries/en-GB/shop/fresh-food/all",
    categoryPath: ["Fresh Food"],
    enabled: true,
  };
  const SERVED_AT = "https://www.tesco.com/shop/en-GB/browse/fresh-food/all";

  const CAPTURED_IDS = [
    "314427997",
    "314311837",
    "308849452",
    "290920510",
    "295673143",
    "290921181",
    "252207537",
    "254656508",
  ];

  async function extract(): Promise<{
    adapter: TescoAdapter;
    result: Awaited<ReturnType<TescoAdapter["extractListingPage"]>>;
    page: Page;
  }> {
    const page = await pageWith(fixture("listing-captured.html"), SERVED_AT);
    const adapter = new TescoAdapter();
    const result = await adapter.extractListingPage({
      context: contextFor(page),
      category: FRESH_FOOD,
      page: 1,
    });

    return { adapter, result, page };
  }

  it("extracts a numeric product id from every tile on the page", async () => {
    const { result, page } = await extract();

    try {
      assert.deepEqual(
        result.products.map((product) => product.retailerProductId),
        CAPTURED_IDS,
      );
    } finally {
      await page.close();
    }
  });

  it("counts no tile as missing a product id", async () => {
    const { adapter, page } = await extract();

    try {
      assert.equal(adapter.diagnostics.rejected.TESCO_PRODUCT_ID_MISSING, 0);
      assert.equal(adapter.diagnostics.validProducts, CAPTURED_IDS.length);
    } finally {
      await page.close();
    }
  });

  it("does not count a navigation list item as a product tile", async () => {
    // The live page carries `li[data-testid="more-menu-item"]` alongside the
    // product tiles. Counting it inflates the tile total and, with it, the
    // extraction rate the drift check is judged on.
    const { adapter, page } = await extract();

    try {
      assert.equal(adapter.diagnostics.tilesSeen, CAPTURED_IDS.length);
    } finally {
      await page.close();
    }
  });

  it("canonicalises the /shop/ link a live tile carries onto the product route", async () => {
    const { result, page } = await extract();

    try {
      assert.equal(
        result.products[0].productUrl,
        "https://www.tesco.com/groceries/en-GB/products/314427997",
      );
    } finally {
      await page.close();
    }
  });

  it("reads a tile's name from the heading link that has no testid", async () => {
    const { result, page } = await extract();

    try {
      assert.equal(
        result.products[0].name,
        "Lurpak Lighter Spreadable Butter Rapeseed Oil 400G",
      );
    } finally {
      await page.close();
    }
  });

  it("takes the shelf price even though a Clubcard price sits above it", async () => {
    const { result, page } = await extract();

    try {
      // £2.75 is the Clubcard price, inside the promotion link. £4.25 is what
      // the shopper pays, and what a budget has to be built from.
      assert.equal(result.products[0].priceText, "£4.25");
      assert.equal(result.products[0].comparisonPriceRaw, "£10.62/kg");
    } finally {
      await page.close();
    }
  });

  it("never reads a star rating as a price", async () => {
    const { result, page } = await extract();

    try {
      // The tile shows "4.4 (105)" a few elements above the price.
      const peppers = result.products.find(
        (product) => product.retailerProductId === "295673143",
      );

      assert.equal(peppers?.priceText, "£2.10");
    } finally {
      await page.close();
    }
  });

  it("carries the availability the tile publishes", async () => {
    const { result, page } = await extract();

    try {
      assert.equal(result.products[0].available, true);
    } finally {
      await page.close();
    }
  });

  it("keeps a tile image from the content host", async () => {
    const { result, page } = await extract();

    try {
      assert.ok(
        result.products[0].imageUrl?.startsWith(
          "https://digitalcontent.api.tesco.com/",
        ),
      );
    } finally {
      await page.close();
    }
  });

  it("reads the advertised total from the wording the page uses now", async () => {
    // "Showing 1 to 27 of 4,676 items". Read as nothing, the drift guard is
    // silently disabled and an unreadable department passes as an empty one.
    const { result, page } = await extract();

    try {
      assert.equal(result.nextPages.length, 39);
      assert.ok(
        result.nextPages.every((url) =>
          url.startsWith("https://www.tesco.com/groceries/en-GB/shop/fresh-food/all?page="),
        ),
      );
    } finally {
      await page.close();
    }
  });
});

describe("Tesco adapter: listing extraction", () => {
  it("extracts every readable tile", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      const ids = result.products.map((product) => product.retailerProductId);

      assert.deepEqual(ids, ["301219119", "296057883", "254656107"]);
    } finally {
      await page.close();
    }
  });

  it("reads a tile's name, price, pack size, comparison price and image", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      const bananas = result.products[0];

      assert.equal(bananas.name, "Tesco Bananas Loose");
      assert.equal(bananas.priceText, "£0.16");
      assert.equal(bananas.packageSizeRaw, "Each");
      assert.equal(bananas.comparisonPriceRaw, "£1.14/kg");
      assert.equal(
        bananas.imageUrl,
        "https://digitalcontent.api.tesco.com/images/301219119.jpeg",
      );
      assert.equal(
        bananas.productUrl,
        "https://www.tesco.com/groceries/en-GB/products/301219119",
      );
      assert.deepEqual(bananas.categoryPaths, [FRESH_FRUIT.categoryPath]);
    } finally {
      await page.close();
    }
  });

  it("strips a query string and a fragment from a product link", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      const milk = result.products[1];

      assert.equal(
        milk.productUrl,
        "https://www.tesco.com/groceries/en-GB/products/296057883",
      );
      assert.equal(milk.retailerProductId, "296057883");
    } finally {
      await page.close();
    }
  });

  it("leaves absent optional fields null rather than inventing them", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      const milk = result.products[1];

      assert.equal(milk.packageSizeRaw, null);
      assert.equal(milk.comparisonPriceRaw, null);
      assert.equal(milk.imageUrl, null);
      assert.equal(milk.brand, null);
    } finally {
      await page.close();
    }
  });

  it("carries the tile's availability rather than assuming a product is stocked", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.equal(result.products[0].available, true);
      assert.equal(result.products[2].available, false);
    } finally {
      await page.close();
    }
  });

  it("rejects a tile priced only by a Clubcard offer", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const adapter = new TescoAdapter();
      const result = await adapter.extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.ok(
        !result.products.some((product) => product.retailerProductId === "310442071"),
        "a conditional-only price must never become a basket price",
      );
      assert.equal(adapter.diagnostics.rejected.TESCO_STANDARD_PRICE_MISSING, 1);
    } finally {
      await page.close();
    }
  });

  it("rejects a tile whose id disagrees with its link", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const adapter = new TescoAdapter();
      const result = await adapter.extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.ok(
        !result.products.some((product) =>
          ["999999999", "301219120"].includes(product.retailerProductId),
        ),
      );
      assert.equal(adapter.diagnostics.rejected.TESCO_PRODUCT_ID_MISMATCH, 1);
    } finally {
      await page.close();
    }
  });

  it("rejects a tile linking off the allowed host", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const adapter = new TescoAdapter();
      const result = await adapter.extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.ok(
        !result.products.some((product) =>
          product.productUrl.includes("tesco-offers.example.com"),
        ),
      );
      assert.equal(adapter.diagnostics.rejected.TESCO_HOST_REJECTED, 1);
    } finally {
      await page.close();
    }
  });

  it("counts every tile it could not read", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      // Clubcard-only, id mismatch, off-host: counted, never guessed at. The
      // count feeds the failure rate that decides whether this run may later
      // retire anything.
      assert.equal(result.skipped, 3);
    } finally {
      await page.close();
    }
  });

  it("does not return the same product twice from one page", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      const ids = result.products.map((product) => product.retailerProductId);
      assert.equal(new Set(ids).size, ids.length);
    } finally {
      await page.close();
    }
  });

  it("discovers the remaining pages from the advertised total", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      // "Showing 1 - 6 of 96 items": six per page, sixteen pages, fifteen more
      // to enqueue.
      assert.equal(result.nextPages.length, 15);
      assert.equal(
        result.nextPages[0],
        "https://www.tesco.com/groceries/en-GB/shop/fresh-food/fresh-fruit/all?page=2",
      );
      for (const url of result.nextPages) {
        assert.ok(url.startsWith("https://www.tesco.com/groceries/en-GB/shop/"));
      }
    } finally {
      await page.close();
    }
  });

  it("enqueues no further pages from a page after the first", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter().extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 2,
      });

      assert.deepEqual(result.nextPages, []);
    } finally {
      await page.close();
    }
  });

  it("caps a bounded run and pages nothing", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const result = await new TescoAdapter({ maxProductsPerCategory: 2 }).extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.equal(result.products.length, 2);
      assert.deepEqual(result.nextPages, []);
    } finally {
      await page.close();
    }
  });

  it("fails loudly when a page advertising products yields none", async () => {
    const page = await pageWith(fixture("listing-drifted.html"), FRESH_FRUIT.url);

    try {
      // The failure that must never look like success: reporting this as an
      // empty department would retire a working catalogue.
      await assert.rejects(
        () =>
          new TescoAdapter().extractListingPage({
            context: contextFor(page),
            category: FRESH_FRUIT,
            page: 1,
          }),
        (error: unknown) => {
          assert.ok(error instanceof TescoSelectorDriftError);
          assert.equal(error.code, "TESCO_SELECTOR_DRIFT");
          assert.equal(error.evidence.advertisedTotal, 96);
          return true;
        },
      );
    } finally {
      await page.close();
    }
  });

  it("fails loudly on Tesco's \"Not down this aisle\" page", async () => {
    // A retired route serves this instead of a listing. It advertises no
    // total, so the drift check has no claim to contradict and the page would
    // otherwise read as a real department holding nothing — an absence that
    // could retire a working catalogue.
    const page = await pageWith(
      fixture("listing-not-down-this-aisle.html"),
      FRESH_FRUIT.url,
    );

    try {
      await assert.rejects(
        () =>
          new TescoAdapter().extractListingPage({
            context: contextFor(page),
            category: FRESH_FRUIT,
            page: 1,
          }),
        (error: unknown) => {
          assert.ok(error instanceof TescoRouteNotFoundError);
          assert.equal(error.code, "TESCO_ROUTE_NOT_FOUND");
          return true;
        },
      );
    } finally {
      await page.close();
    }
  });

  it("counts a dead route as a route failure, not as an empty department", async () => {
    const page = await pageWith(
      fixture("listing-not-down-this-aisle.html"),
      FRESH_FRUIT.url,
    );
    const adapter = new TescoAdapter();

    try {
      await assert.rejects(() =>
        adapter.extractListingPage({
          context: contextFor(page),
          category: FRESH_FRUIT,
          page: 1,
        }),
      );

      assert.equal(adapter.diagnostics.rejected.TESCO_ROUTE_NOT_FOUND, 1);
      assert.equal(adapter.diagnostics.tilesSeen, 0);
      assert.equal(adapter.diagnostics.validProducts, 0);
    } finally {
      await page.close();
    }
  });

  it("reads an ordinary listing without raising a route failure", async () => {
    // The other half of the regression: the current route must still extract.
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);
    const adapter = new TescoAdapter();

    try {
      const result = await adapter.extractListingPage({
        context: contextFor(page),
        category: FRESH_FRUIT,
        page: 1,
      });

      assert.ok(result.products.length > 0);
      assert.equal(adapter.diagnostics.rejected.TESCO_ROUTE_NOT_FOUND, 0);
    } finally {
      await page.close();
    }
  });
});

describe("Tesco adapter: detail extraction", () => {
  const DETAIL_URL = "https://www.tesco.com/groceries/en-GB/products/301219119";
  const LABELLED_URL = "https://www.tesco.com/groceries/en-GB/products/254656107";

  it("enriches a listing with the product page", async () => {
    const page = await pageWith(fixture("product-detail.html"), DETAIL_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor(),
      });

      assert.ok(product);
      assert.equal(product.retailerProductId, "301219119");
      assert.equal(product.name, "Tesco Bananas Loose");
      assert.equal(product.brand, "Tesco");
      assert.equal(product.priceMinor, 16);
      assert.equal(product.packageSizeRaw, "Each");
      assert.equal(product.comparisonPriceRaw, "£1.14/kg");
      assert.equal(product.productUrl, DETAIL_URL);
      assert.equal(product.description, "Loose bananas, ripen at home.");
      assert.equal(
        product.imageUrl,
        "https://digitalcontent.api.tesco.com/images/301219119.jpeg",
      );
      assert.equal(product.available, true);
    } finally {
      await page.close();
    }
  });

  it("takes the shelf price even when a Clubcard price is on the page", async () => {
    const page = await pageWith(fixture("product-detail.html"), DETAIL_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor(),
      });

      // The Clubcard price on this fixture is £0.12. Budgeting with it would
      // quote a total the user cannot buy the basket for.
      assert.equal(product?.priceMinor, 16);
    } finally {
      await page.close();
    }
  });

  it("reads ingredients, allergy and dietary information from labelled containers", async () => {
    const page = await pageWith(fixture("product-detail.html"), DETAIL_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor(),
      });

      assert.equal(product?.ingredientsRaw, "Bananas.");
      assert.match(String(product?.allergenAdviceRaw), /may contain nuts/i);
      assert.match(String(product?.dietaryInformationRaw), /suitable for vegans/i);
    } finally {
      await page.close();
    }
  });

  it("keeps storage and preparation text out of the food-safety fields", async () => {
    const page = await pageWith(fixture("product-detail-labelled.html"), LABELLED_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor({
          retailerProductId: "254656107",
          productUrl: LABELLED_URL,
          name: "Tesco Broccoli 335G",
          priceText: "£0.75",
          packageSizeRaw: null,
          comparisonPriceRaw: null,
          available: false,
        }),
      });

      assert.ok(product);
      assert.equal(product.ingredientsRaw, "Broccoli.");
      assert.equal(
        product.allergenAdviceRaw,
        "Packed in a facility that also handles celery.",
      );

      // The boundary is the point: a user with an allergy cannot check a field
      // that has swallowed the storage and preparation copy.
      for (const field of [product.ingredientsRaw, product.allergenAdviceRaw]) {
        assert.ok(!/refrigerated/i.test(String(field)));
        assert.ok(!/steam for 4 minutes/i.test(String(field)));
        assert.ok(!/welwyn/i.test(String(field)));
      }
    } finally {
      await page.close();
    }
  });

  it("leaves an unpublished section null", async () => {
    const page = await pageWith(fixture("product-detail-labelled.html"), LABELLED_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor({
          retailerProductId: "254656107",
          productUrl: LABELLED_URL,
          priceText: "£0.75",
          packageSizeRaw: null,
          comparisonPriceRaw: null,
          available: false,
        }),
      });

      assert.equal(product?.dietaryInformationRaw, null);
      assert.equal(product?.packageSizeRaw, null);
      assert.equal(product?.comparisonPriceRaw, null);
      assert.equal(product?.brand, null);
    } finally {
      await page.close();
    }
  });

  it("carries an unavailable product through as unavailable", async () => {
    const page = await pageWith(fixture("product-detail-labelled.html"), LABELLED_URL);

    try {
      const product = await new TescoAdapter().extractProduct({
        context: contextFor(page),
        listing: listingFor({
          retailerProductId: "254656107",
          productUrl: LABELLED_URL,
          priceText: "£0.75",
          available: false,
        }),
      });

      assert.equal(product?.available, false);
    } finally {
      await page.close();
    }
  });

  it("refuses to repair a detail page whose id disagrees with the listing", async () => {
    const page = await pageWith(fixture("product-detail.html"), DETAIL_URL);

    try {
      const adapter = new TescoAdapter();
      const product = await adapter.extractProduct({
        context: contextFor(page),
        listing: listingFor({ retailerProductId: "254656107" }),
      });

      assert.equal(product, null, "identity is never changed to make a product fit");
      assert.equal(adapter.diagnostics.rejected.TESCO_PRODUCT_ID_MISMATCH, 1);
    } finally {
      await page.close();
    }
  });

  it("produces a record the shared normalizer accepts", async () => {
    const page = await pageWith(fixture("product-detail.html"), DETAIL_URL);

    try {
      const adapter = new TescoAdapter();
      const product = await adapter.extractProduct({
        context: contextFor(page),
        listing: listingFor(),
      });

      const normalized = normalizeCatalogueProduct(product ?? {}, adapter.allowedHosts);

      assert.deepEqual(normalized.issues, []);
      assert.ok(normalized.product);
      assert.ok(Number.isInteger(normalized.product.priceMinor));
      assert.equal(normalized.product.available, true);
    } finally {
      await page.close();
    }
  });
});

describe("Tesco adapter: scope verification", () => {
  it("verifies against the selected location label", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const verified = await new TescoAdapter().verifyStoreSelection(contextFor(page));

      assert.equal(verified, true);
    } finally {
      await page.close();
    }
  });

  it("refuses a location that is not the configured one", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const verified = await new TescoAdapter().verifyStoreSelection(
        contextFor(page, { expectedStoreText: "Delivery to M1" }),
      );

      assert.equal(verified, false);
    } finally {
      await page.close();
    }
  });

  it("refuses when the page shows no location evidence at all", async () => {
    const page = await pageWith(
      fixture("product-detail-labelled.html"),
      "https://www.tesco.com/groceries/en-GB/products/254656107",
    );

    try {
      // Products rendering is not evidence of which store rendered them.
      const verified = await new TescoAdapter().verifyStoreSelection(contextFor(page));

      assert.equal(verified, false);
    } finally {
      await page.close();
    }
  });

  it("names an anonymous session as the reason a scope cannot be verified", async () => {
    // Captured 2026-08-22: an anonymous Tesco session publishes no fulfilment
    // scope at all — no location picker, no postcode input, no selected
    // location label — and the landing page reads "Sign in to start shopping".
    // The operator has to be told that, or a scope failure looks like drift.
    const page = await pageWith(
      fixture("listing-captured.html"),
      "https://www.tesco.com/shop/en-GB/browse/fresh-food/all",
    );
    const messages: string[] = [];

    try {
      const verified = await new TescoAdapter().verifyStoreSelection(
        contextFor(page, { log: (message) => messages.push(message) }),
      );

      assert.equal(verified, false, "an unverified scope must stay unverified");
      assert.match(messages.join(" "), /signed out|sign in|authenticat/i);
    } finally {
      await page.close();
    }
  });

  it("refuses when reading the page throws", async () => {
    const exploding = {
      url: () => "https://www.tesco.com/",
      locator: () => {
        throw new Error("session closed");
      },
    } as unknown as Page;

    const verified = await new TescoAdapter().verifyStoreSelection(
      contextFor(exploding),
    );

    assert.equal(verified, false, "an exception must fail closed, never open");
  });

  it("refuses when no expected location text is configured", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);

    try {
      const verified = await new TescoAdapter().verifyStoreSelection(
        contextFor(page, { expectedStoreText: "  " }),
      );

      assert.equal(verified, false);
    } finally {
      await page.close();
    }
  });

  it("logs the evidence type without leaking the postcode", async () => {
    const page = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);
    const messages: string[] = [];

    try {
      await new TescoAdapter({ postcode: "CV1 2AB" }).verifyStoreSelection(
        contextFor(page, { log: (message) => messages.push(message) }),
      );

      const log = messages.join(" ");
      assert.match(log, /location-label/);
      assert.ok(!log.includes("2AB"), "a full postcode must never reach a log");
    } finally {
      await page.close();
    }
  });
});

describe("Tesco adapter: session preparation", () => {
  it("dismisses the consent dialog and tolerates its absence", async () => {
    const withBanner = await pageWith(fixture("listing.html"), FRESH_FRUIT.url);
    const withoutBanner = await pageWith(
      fixture("product-detail-labelled.html"),
      "https://www.tesco.com/groceries/en-GB/products/254656107",
    );

    try {
      await new TescoAdapter().prepareSession(contextFor(withBanner));
      assert.equal(
        await withBanner.locator(TESCO_SELECTORS.consentAccept[0]).count(),
        1,
        "the fixture keeps the button in the DOM; clicking it must not throw",
      );

      // A page with no banner must not stall the crawl waiting for one.
      await new TescoAdapter().prepareSession(contextFor(withoutBanner));
    } finally {
      await withBanner.close();
      await withoutBanner.close();
    }
  });
});
