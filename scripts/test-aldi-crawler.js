/* eslint-disable no-console */
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { PlaywrightCrawler, log } = require("crawlee");

const DEFAULT_CATEGORY_URL =
  "https://www.aldi.co.uk/products/frozen-food/vegetables-sides/k/1588161416978056004";

const CATEGORY_URL =
  process.env.ALDI_CATEGORY_URL?.trim() || DEFAULT_CATEGORY_URL;

const MAX_PRODUCTS = Math.max(
  1,
  Number.parseInt(process.env.ALDI_MAX_PRODUCTS || "5", 10),
);

const HEADLESS = process.env.ALDI_HEADLESS === "true";
const DEBUG = process.env.ALDI_DEBUG !== "false";

let manualSetupCompleted = false;

/**
 * Convert a GBP price such as "£1.29" into integer pence.
 *
 * @param {string | null | undefined} rawValue
 * @returns {number | null}
 */
function parsePricePence(rawValue) {
  if (!rawValue) return null;

  const match = String(rawValue)
    .replace(/,/g, "")
    .match(/£\s*(\d+(?:\.\d{1,2})?)/);

  if (!match) return null;

  const pounds = Number(match[1]);

  return Number.isFinite(pounds) ? Math.round(pounds * 100) : null;
}

/**
 * Extract Aldi's product identifier from the product URL.
 *
 * Example:
 * /product/four-seasons-broccoli-florets-000000000275878002
 *
 * @param {string} productUrl
 * @returns {string | null}
 */
function extractProductId(productUrl) {
  try {
    const pathname = new URL(productUrl).pathname;
    const match = pathname.match(/-(\d{12,})\/?$/);

    return match?.[1] || null;
  } catch {
    const match = String(productUrl).match(/-(\d{12,})\/?$/);

    return match?.[1] || null;
  }
}

/**
 * Parse package text such as:
 * "1 KG (£1.29/1 KG)"
 * "0.8 KG (£2.81/1 KG)"
 *
 * It intentionally preserves the original text.
 *
 * @param {string | null | undefined} rawValue
 */
function parsePackageSize(rawValue) {
  const raw = String(rawValue || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) {
    return {
      raw: null,
      display: null,
      value: null,
      unit: null,
    };
  }

  const display = raw.split("(")[0].trim();
  const match = display.match(
    /(\d+(?:\.\d+)?)\s*(KG|G|L|ML|CL|PACK|PACKS|EA|EACH)\b/i,
  );

  if (!match) {
    return {
      raw,
      display,
      value: null,
      unit: null,
    };
  }

  return {
    raw,
    display,
    value: Number(match[1]),
    unit: match[2].toLowerCase(),
  };
}

/**
 * Convert a relative Aldi URL into an absolute URL.
 *
 * @param {string | null | undefined} rawUrl
 * @param {string} baseUrl
 * @returns {string | null}
 */
function absolutizeUrl(rawUrl, baseUrl) {
  if (!rawUrl) return null;

  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return null;
  }
}

/**
 * Remove fragments and tracking query parameters from a product URL.
 *
 * @param {string} rawUrl
 * @returns {string}
 */
function canonicalizeProductUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    url.hash = "";

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach((parameter) => {
      url.searchParams.delete(parameter);
    });

    return url.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Give the user time to select an Aldi store or handle cookie prompts.
 */
async function waitForManualSetup() {
  if (HEADLESS || manualSetupCompleted) return;

  manualSetupCompleted = true;

  const terminal = readline.createInterface({ input, output });

  try {
    console.log("\nManual Aldi setup");
    console.log("1. Select the required Aldi store in the browser.");
    console.log("2. Accept or reject the cookie prompt.");
    console.log("3. Return to the terminal and press Enter.\n");

    await terminal.question("Press Enter when the Aldi page is ready...");
  } finally {
    terminal.close();
  }
}

/**
 * Attempt to close common cookie banners.
 *
 * This is best-effort only because Aldi may change consent providers.
 *
 * @param {import("playwright").Page} page
 */
async function acceptCookies(page) {
  const selectors = [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept cookies")',
    'button:has-text("Allow all")',
    'button[id*="accept" i]',
    'button[class*="accept" i]',
    'button[aria-label*="accept" i]',
  ];

  for (const selector of selectors) {
    try {
      const button = page.locator(selector).first();

      if ((await button.count()) === 0) continue;
      if (!(await button.isVisible().catch(() => false))) continue;

      await button.click({ timeout: 2_000 }).catch(() => {});
      return;
    } catch {
      // Continue to the next possible cookie button.
    }
  }
}

/**
 * Scroll the category page until the number of product tiles stabilises.
 *
 * @param {import("playwright").Page} page
 */
async function loadProductTiles(page) {
  const productTileSelector = '[data-test="product-tile"]';

  await page.waitForSelector(productTileSelector, {
    timeout: 30_000,
  });

  let previousCount = 0;
  let stableRounds = 0;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const currentCount = await page
      .locator(productTileSelector)
      .count()
      .catch(() => 0);

    if (currentCount <= previousCount) {
      stableRounds += 1;
    } else {
      stableRounds = 0;
    }

    previousCount = currentCount;

    if (stableRounds >= 3 || currentCount >= MAX_PRODUCTS) {
      break;
    }

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(1_000);
  }

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

/**
 * Extract product-card data from an Aldi category page.
 *
 * @param {import("playwright").Page} page
 * @param {string} pageUrl
 */
async function extractProductTiles(page, pageUrl) {
  const products = await page.$$eval('[data-test="product-tile"]', (tiles) =>
    tiles.map((tile) => {
      const getText = (selector) =>
        tile
          .querySelector(selector)
          ?.textContent?.replace(/\s+/g, " ")
          .trim() || null;

      const link = tile.querySelector(
        'a.product-tile__link[href], a[href*="/product/"]',
      );

      const image = tile.querySelector(
        ".product-tile__image-container img, img",
      );

      return {
        tileId: tile.id || null,
        retailerCategoryItemId:
          tile.getAttribute("data-nm-product-category-item") || null,

        href: link?.getAttribute("href") || null,

        brand: getText('[data-test="product-tile__brandname"]'),
        name: getText('[data-test="product-tile__name"]'),

        packageText: getText('[data-test="product-tile__unit-of-measurement"]'),

        comparisonPriceText: getText(
          '[data-test="product-tile__comparison-price"]',
        ),

        priceText:
          getText('[data-test="product-tile__price"]') ||
          getText(".base-price--product-tile") ||
          getText(".base-price"),

        imageUrl:
          image?.currentSrc ||
          image?.getAttribute("src") ||
          image?.getAttribute("data-src") ||
          null,
      };
    }),
  );

  return products
    .map((product) => {
      const productUrl = absolutizeUrl(product.href, pageUrl);

      if (!productUrl) return null;

      return {
        ...product,
        productUrl: canonicalizeProductUrl(productUrl),
        imageUrl: absolutizeUrl(product.imageUrl, pageUrl),
      };
    })
    .filter(Boolean);
}

/**
 * Click an information accordion when one is available.
 *
 * @param {import("playwright").Page} page
 * @param {RegExp} headingPattern
 */
async function expandInformationSection(page, headingPattern) {
  const possibleControls = [
    page.getByRole("button", { name: headingPattern }).first(),
    page.getByRole("tab", { name: headingPattern }).first(),
    page.locator("summary").filter({ hasText: headingPattern }).first(),
  ];

  for (const control of possibleControls) {
    try {
      if ((await control.count()) === 0) continue;
      if (!(await control.isVisible().catch(() => false))) continue;

      const expanded = await control.getAttribute("aria-expanded");

      if (expanded !== "true") {
        await control.click({ timeout: 3_000 }).catch(() => {});
        await page.waitForTimeout(300);
      }

      return;
    } catch {
      // Try the next possible control.
    }
  }
}

/**
 * Extract text from a section identified by its heading.
 *
 * This deliberately returns null when the source cannot be identified.
 * It must not convert missing allergen information into an empty array.
 *
 * @param {import("playwright").Page} page
 * @param {string[]} headingTerms
 * @returns {Promise<string | null>}
 */
async function extractSectionByHeading(page, headingTerms) {
  return page.evaluate((terms) => {
    const clean = (value) =>
      String(value || "")
        .replace(/\s+/g, " ")
        .trim();

    const normalizedTerms = terms.map((term) => term.toLowerCase());

    const headingSelectors = [
      "h2",
      "h3",
      "h4",
      "button",
      "summary",
      "dt",
      '[role="heading"]',
      '[class*="accordion" i]',
    ].join(",");

    const headings = Array.from(document.querySelectorAll(headingSelectors));

    const heading = headings.find((element) => {
      const text = clean(element.textContent).toLowerCase();

      return normalizedTerms.some(
        (term) => text === term || text.startsWith(`${term}:`),
      );
    });

    if (!heading) return null;

    const candidates = [
      heading.nextElementSibling,
      heading.parentElement?.nextElementSibling,
      heading.closest("section"),
      heading.closest("article"),
      heading.closest("li"),
      heading.parentElement,
    ].filter(Boolean);

    for (const candidate of candidates) {
      const text = clean(candidate.innerText || candidate.textContent);

      if (!text) continue;

      const headingText = clean(heading.textContent);
      const withoutHeading = clean(text.replace(headingText, ""));

      if (withoutHeading && withoutHeading.length > 2) {
        return withoutHeading;
      }
    }

    return null;
  }, headingTerms);
}

/**
 * Extract data from one Aldi product-detail page.
 *
 * @param {import("playwright").Page} page
 * @param {import("crawlee").Request} request
 */
async function extractProductDetails(page, request) {
  await page.waitForSelector(
    [
      "main.product-details-page",
      ".product-details",
      "h1.product-details__title",
    ].join(","),
    {
      timeout: 30_000,
    },
  );

  await Promise.all([
    expandInformationSection(page, /ingredients/i),
    expandInformationSection(page, /allergy advice/i),
    expandInformationSection(page, /allergens?/i),
    expandInformationSection(page, /dietary information/i),
  ]);

  const detail = await page.evaluate(() => {
    const clean = (value) =>
      String(value || "")
        .replace(/\s+/g, " ")
        .trim() || null;

    const text = (selector) =>
      clean(document.querySelector(selector)?.textContent);

    const attr = (selector, attribute) =>
      document.querySelector(selector)?.getAttribute(attribute) || null;

    const image =
      document.querySelector(".product-image-carousel img") ||
      document.querySelector(".product-details img") ||
      document.querySelector('main img[src*="aldi"]') ||
      document.querySelector("main img");

    return {
      name:
        text("h1.product-details__title") ||
        text('[data-test="product-details__title"]') ||
        text("h1"),

      brand:
        text(".product-details__brand-name") ||
        text('[data-test="product-details__brand-name"]'),

      packageText:
        text('[data-test="product-details__unit-of-measurement"]') ||
        text(".product-details__unit-of-measurement"),

      comparisonPriceText:
        text(".product-details__comparison-price") ||
        text('[data-test="product-details__comparison-price"]'),

      priceText:
        text(".base-price--product-details .base-price__regular") ||
        text(
          ".base-price--product-details .base-price__regular span:first-child",
        ) ||
        text('[data-test="product-details__price"]'),

      imageUrl:
        image?.currentSrc ||
        image?.getAttribute("src") ||
        image?.getAttribute("data-src") ||
        null,

      pageCanonicalUrl: attr('link[rel="canonical"]', "href"),
    };
  });

  const ingredientsRaw = await extractSectionByHeading(page, ["ingredients"]);

  const allergensRaw = await extractSectionByHeading(page, [
    "allergy advice",
    "allergen information",
    "allergens",
  ]);

  const dietaryInformationRaw = await extractSectionByHeading(page, [
    "dietary information",
    "dietary",
  ]);

  const productUrl = canonicalizeProductUrl(
    detail.pageCanonicalUrl || page.url() || request.url,
  );

  const listingProduct = request.userData?.listingProduct || {};

  const name = detail.name || listingProduct.name || null;
  const brand = detail.brand || listingProduct.brand || null;

  const packageText = detail.packageText || listingProduct.packageText || null;

  const comparisonPriceText =
    detail.comparisonPriceText || listingProduct.comparisonPriceText || null;

  const priceText = detail.priceText || listingProduct.priceText || null;

  const imageUrl = absolutizeUrl(
    detail.imageUrl || listingProduct.imageUrl,
    productUrl,
  );

  return {
    canonicalKey: `aldi-uk:${extractProductId(productUrl) || productUrl}`,

    retailer: "aldi-uk",
    retailerProductId: extractProductId(productUrl),

    store: {
      name: null,
      postcode: null,
      id: null,
    },

    name,
    brand,

    categoryPath: request.userData?.categoryPath || [
      "Frozen Food",
      "Vegetables & Sides",
    ],

    package: parsePackageSize(packageText),

    pricePence: parsePricePence(priceText),

    priceText,
    comparisonPriceText,

    ingredientsRaw,
    allergensRaw,
    dietaryInformationRaw,

    ingredients: null,
    allergens: null,
    dietaryTags: null,

    imageUrl,
    productUrl,

    available: true,

    dataQuality: ingredientsRaw && allergensRaw ? "complete" : "incomplete",

    eligibleForPlanning: false,

    eligibilityReasons: [
      ...(!ingredientsRaw ? ["MISSING_INGREDIENTS"] : []),
      ...(!allergensRaw ? ["MISSING_ALLERGEN_DATA"] : []),
      "MANUAL_TEST_ONLY",
    ],

    scrapedAt: new Date().toISOString(),
  };
}

/**
 * Run a bounded, read-only Aldi catalogue test.
 */
async function runAldiManualTest() {
  const results = [];

  log.setLevel(DEBUG ? log.LEVELS.INFO : log.LEVELS.WARNING);

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 180,
    navigationTimeoutSecs: 90,

    launchContext: {
      launchOptions: {
        headless: HEADLESS,
        timeout: 90_000,
        args: [
          "--disable-blink-features=AutomationControlled",
          "--disable-dev-shm-usage",
        ],
      },
    },

    browserPoolOptions: {
      maxOpenPagesPerBrowser: 1,
    },

    preNavigationHooks: [
      async ({ page }) => {
        page.setDefaultTimeout(60_000);
        page.setDefaultNavigationTimeout(90_000);

        await page.setViewportSize({
          width: 1440,
          height: 900,
        });

        await page.setExtraHTTPHeaders({
          "accept-language": "en-GB,en;q=0.9",
        });

        await page.route("**/*", async (route) => {
          const resourceType = route.request().resourceType();

          if (resourceType === "font" || resourceType === "media") {
            await route.abort();
            return;
          }

          await route.continue();
        });
      },
    ],

    async requestHandler({ page, request, enqueueLinks }) {
      const label = request.label || "LIST";

      if (label === "LIST") {
        await acceptCookies(page);
        await waitForManualSetup();
        await acceptCookies(page);
        await loadProductTiles(page);

        const products = await extractProductTiles(page, request.url);
        const selectedProducts = products.slice(0, MAX_PRODUCTS);

        console.log(
          `\nFound ${products.length} product tiles. Testing ${selectedProducts.length} products.\n`,
        );

        await enqueueLinks({
          urls: selectedProducts.map((product) => product.productUrl),
          label: "DETAIL",

          transformRequestFunction: (detailRequest) => {
            const listingProduct = selectedProducts.find(
              (product) => product.productUrl === detailRequest.url,
            );

            detailRequest.uniqueKey = detailRequest.url;
            detailRequest.userData = {
              listingProduct: listingProduct || null,
              categoryPath: ["Frozen Food", "Vegetables & Sides"],
            };

            return detailRequest;
          },
        });

        return;
      }

      if (label === "DETAIL") {
        await acceptCookies(page);

        const product = await extractProductDetails(page, request);
        results.push(product);

        console.log(
          `Extracted ${results.length}/${MAX_PRODUCTS}:`,
          product.name || product.productUrl,
        );
      }
    },

    failedRequestHandler({ request, error }) {
      console.error("\nFailed Aldi request:", {
        url: request.url,
        label: request.label,
        error: error?.message || String(error),
      });
    },
  });

  await crawler.run([
    {
      url: CATEGORY_URL,
      label: "LIST",
      uniqueKey: `aldi-list:${CATEGORY_URL}:${Date.now()}`,
    },
  ]);

  console.log("\n========== ALDI TEST RESULTS ==========\n");
  console.log(JSON.stringify(results, null, 2));
  console.log(`\nExtracted ${results.length} product records.`);

  return results;
}

if (require.main === module) {
  runAldiManualTest().catch((error) => {
    console.error("\nAldi crawler failed:");
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  runAldiManualTest,
  parsePricePence,
  parsePackageSize,
  extractProductId,
};
