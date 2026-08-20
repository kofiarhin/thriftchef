/**
 * The Aldi adapter, driven against saved HTML in a real browser.
 *
 * Not a mock: the fixtures are served to a genuine Chromium page, so the
 * selectors, the tile loop, the pager reading and the disclosure expansion all
 * run exactly as they do against the live site. The one thing that is absent
 * is the network — which is the only part that must never run in a test.
 *
 * These are what catch selector drift. A selector that stops matching does not
 * throw; it returns nothing, and a crawl "succeeds" with an empty catalogue.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { chromium, type Browser, type Page } from "playwright";
import { AldiAdapter, extractAldiLabelText } from "./aldiAdapter";
import type { AdapterContext } from "../../contracts/retailerAdapter";
import { normalizeCatalogueProduct } from "../../core/catalogueNormalization";
import { evaluateCatalogueSafety } from "../../core/catalogueSafety";

const FIXTURES = join(__dirname, "../../../testing/fixtures/aldi");

function fixture(name: string): string {
  return readFileSync(join(FIXTURES, name), "utf8");
}

/** The category a fixture listing stands for. */
const VEGETABLES = {
  key: "fresh-vegetables",
  url: "https://www.aldi.co.uk/products/fresh-food/vegetables/k/1588161416978050002",
  categoryPath: ["Fresh Food", "Vegetables"],
  enabled: true,
};

let browser: Browser;

/**
 * Serves a fixture at its real URL.
 *
 * Routing rather than `setContent` so `page.url()` is an aldi.co.uk address:
 * relative hrefs resolve the way they do in production, and the host allowlist
 * is exercised rather than bypassed.
 */
async function pageWith(html: string, url: string): Promise<Page> {
  const page = await browser.newPage();

  await page.route("**/*", async (route) => {
    const requestUrl = route.request().url();

    if (requestUrl.startsWith(url)) {
      // The charset matters: without it Chromium decodes UTF-8 as latin-1 and
      // "£0.55" arrives as "Â£0.55", which would fail price parsing in a way
      // that has nothing to do with the adapter.
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
      return;
    }

    // Nothing else is allowed to load. A fixture test that reaches the network
    // is not a fixture test.
    await route.abort();
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  return page;
}

function contextFor(page: Page): AdapterContext {
  return {
    page,
    externalStoreId: "belper-de56-1ar",
    expectedStoreText: "DE56 1AR",
    log: () => {},
  };
}

describe("Aldi adapter: listing extraction", () => {
  before(async () => {
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser.close();
  });

  it("extracts every readable tile from a listing page", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      assert.equal(result.products.length, 2);
      assert.deepEqual(
        result.products.map((product) => product.retailerProductId),
        ["000000000000262686", "000000000000262687"],
      );
    } finally {
      await page.close();
    }
  });

  it("reads the fields the shopper and the planner both need", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      const carrots = result.products[0];

      assert.equal(carrots.name, "Carrots");
      assert.equal(carrots.brand, "Nature's Pick");
      assert.equal(carrots.packageSizeRaw, "1kg");
      assert.equal(carrots.comparisonPriceRaw, "55p per kg");
      assert.equal(carrots.priceText, "£0.55");
      assert.equal(
        carrots.productUrl,
        "https://www.aldi.co.uk/product/carrots-000000000000262686",
      );
      assert.deepEqual(carrots.categoryPaths, [["Fresh Food", "Vegetables"]]);
    } finally {
      await page.close();
    }
  });

  it("falls back through the price selectors", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      // Broccoli carries no `product-tile__price`; the `.base-price` fallback
      // is what keeps it in the catalogue.
      assert.equal(result.products[1].priceText, "£0.69");
    } finally {
      await page.close();
    }
  });

  it("reads a lazy-loaded image from data-src", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      assert.equal(
        result.products[1].imageUrl,
        "https://www.aldi.co.uk/images/broccoli.jpg",
      );
    } finally {
      await page.close();
    }
  });

  it("counts an unreadable tile rather than guessing at it", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      // The promo tile has no product id. It feeds the failure count that
      // decides whether this run may later retire anything.
      assert.equal(result.skipped, 1);
    } finally {
      await page.close();
    }
  });

  it("enqueues the pages the pager advertises", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      assert.equal(result.nextPages.length, 2);
      assert.match(result.nextPages[0], /page=2$/);
      assert.match(result.nextPages[1], /page=3$/);
    } finally {
      await page.close();
    }
  });

  it("reads the pager only from the first page", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter().extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 2,
      });

      assert.deepEqual(result.nextPages, [], "the pager is enqueued once");
    } finally {
      await page.close();
    }
  });

  it("caps a bounded run and enqueues no further pages", async () => {
    const page = await pageWith(fixture("listing.html"), VEGETABLES.url);

    try {
      const result = await new AldiAdapter(1).extractListingPage({
        context: contextFor(page),
        category: VEGETABLES,
        page: 1,
      });

      assert.equal(result.products.length, 1);
      assert.deepEqual(
        result.nextPages,
        [],
        "a capped run is not trying to see the whole category",
      );
    } finally {
      await page.close();
    }
  });

  /**
   * The drift canary. This is the failure this whole fixture suite exists for:
   * a redesign that removes the tile hook produces no error, no exception and
   * no products — and without a test that says so, the first sign is a user
   * being told the shop is empty.
   */
  it("finds nothing when the tile selector stops matching", async () => {
    const page = await pageWith(fixture("listing-drifted.html"), VEGETABLES.url);

    try {
      await assert.rejects(
        () =>
          new AldiAdapter().extractListingPage({
            context: contextFor(page),
            category: VEGETABLES,
            page: 1,
          }),
        /Timeout|waiting for/i,
        "selector drift must surface as a failure, not as an empty catalogue",
      );
    } finally {
      await page.close();
    }
  });
});

describe("Aldi adapter: product extraction", () => {
  before(async () => {
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser.close();
  });

  const listing = {
    retailerProductId: "000000000000262686",
    productUrl: "https://www.aldi.co.uk/product/carrots-000000000000262686",
    name: "Carrots",
    brand: null,
    packageSizeRaw: null,
    comparisonPriceRaw: null,
    priceText: "£0.55",
    imageUrl: null,
    categoryPaths: [["Fresh Food", "Vegetables"]],
  };

  it("extracts a complete product from its detail page", async () => {
    const page = await pageWith(fixture("product-detail.html"), listing.productUrl);

    try {
      const product = await new AldiAdapter().extractProduct({
        context: contextFor(page),
        listing,
      });

      assert.ok(product);
      assert.equal(product.retailerProductId, "000000000000262686");
      assert.equal(product.name, "Carrots");
      assert.equal(product.brand, "Nature's Pick");
      assert.equal(product.priceMinor, 55);
      assert.equal(product.packageSizeRaw, "1kg");
      assert.match(product.description ?? "", /Fresh British carrots/);
    } finally {
      await page.close();
    }
  });

  it("prefers the canonical URL and strips its tracking parameters", async () => {
    const page = await pageWith(fixture("product-detail.html"), listing.productUrl);

    try {
      const product = await new AldiAdapter().extractProduct({
        context: contextFor(page),
        listing,
      });

      assert.equal(
        product?.productUrl,
        "https://www.aldi.co.uk/product/carrots-000000000000262686",
      );
    } finally {
      await page.close();
    }
  });

  it("produces a candidate the shared normalizer accepts", async () => {
    const page = await pageWith(fixture("product-detail.html"), listing.productUrl);

    try {
      const adapter = new AldiAdapter();
      const product = await adapter.extractProduct({
        context: contextFor(page),
        listing,
      });

      assert.ok(product);

      // The adapter's output has to survive the same gate every retailer's
      // does. An adapter that only passes its own tests is not integrated.
      const normalized = normalizeCatalogueProduct(product, adapter.allowedHosts);

      assert.deepEqual(normalized.issues, []);
      assert.ok(normalized.product);
      assert.ok(Number.isInteger(normalized.product.priceMinor));
    } finally {
      await page.close();
    }
  });

  it("marks an Aldi product inferred, never verified", async () => {
    const page = await pageWith(
      fixture("product-detail-labelled.html"),
      "https://www.aldi.co.uk/product/cheese-onion-pasty-000000000000998877",
    );

    try {
      const product = await new AldiAdapter().extractProduct({
        context: contextFor(page),
        listing: {
          ...listing,
          retailerProductId: "000000000000998877",
          productUrl:
            "https://www.aldi.co.uk/product/cheese-onion-pasty-000000000000998877",
          name: "Cheese & Onion Pasty",
          priceText: "£1.29",
        },
      });

      assert.ok(product);

      const verdict = evaluateCatalogueSafety(
        product.ingredientsRaw,
        product.allergenAdviceRaw,
        {
          name: product.name,
          brand: product.brand,
          description: product.description,
          categoryPaths: product.categoryPaths,
        },
      );

      // Aldi publishes no label data, so nothing it sells can be "verified".
      assert.equal(verdict.catalogueSafetyStatus, "inferred");
      assert.ok(verdict.safetyIssues.includes("NO_RETAILER_ALLERGEN_DATA"));
    } finally {
      await page.close();
    }
  });

  it("returns null rather than a product with no price", async () => {
    const page = await pageWith(
      "<html><body><main><h1>Mystery item</h1></main></body></html>",
      listing.productUrl,
    );

    try {
      const product = await new AldiAdapter().extractProduct({
        context: contextFor(page),
        listing: { ...listing, priceText: null },
      });

      assert.equal(product, null);
    } finally {
      await page.close();
    }
  });
});

describe("Aldi label-text extraction", () => {
  it("reads ingredients up to the next known heading", () => {
    const result = extractAldiLabelText(
      [
        "Cheese & Onion Pasty",
        "Ingredients",
        "Wheat Flour, Cheddar Cheese (Milk), Onion, Palm Oil",
        "Allergy advice",
        "For allergens, see ingredients in bold.",
        "Storage information",
        "Keep refrigerated.",
      ].join("\n"),
    );

    assert.match(result.ingredientsRaw ?? "", /Wheat Flour/);
    assert.ok(
      !/allergy advice/i.test(result.ingredientsRaw ?? ""),
      "the next heading must end the block",
    );
    assert.match(result.allergenAdviceRaw ?? "", /see ingredients in bold/);
  });

  it("reads a value written inline after the label", () => {
    const result = extractAldiLabelText("Ingredients: Carrots (100%)");

    assert.equal(result.ingredientsRaw, "Carrots (100%)");
  });

  it("returns null when a section is absent", () => {
    const result = extractAldiLabelText("Carrots\n1kg\n£0.55");

    assert.equal(result.ingredientsRaw, null);
    assert.equal(result.allergenAdviceRaw, null);
    assert.equal(result.dietaryInformationRaw, null);
  });

  it("stops after twelve lines so a missing heading cannot swallow the page", () => {
    const result = extractAldiLabelText(
      ["Ingredients", ...Array.from({ length: 40 }, (_, i) => `line ${i}`)].join("\n"),
    );

    assert.ok((result.ingredientsRaw ?? "").split(" ").length < 60);
  });
});
