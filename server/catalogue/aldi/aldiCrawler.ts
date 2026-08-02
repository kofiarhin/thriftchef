import { randomUUID } from "node:crypto";
import { PlaywrightCrawler, Request, log } from "crawlee";
import type { Locator, Page } from "playwright";
import { Product, type CatalogueSafetyStatus } from "../../models/Product";
import { ALDI_CATEGORIES, type AldiCategory } from "./aldiCategories";

const RETAILER = "aldi-uk" as const;
const DEFAULT_STORE_ID = "belper-de56-1ar";
const DEFAULT_EXPECTED_STORE_TEXT = "DE56 1AR";
const PRODUCT_TILE_SELECTOR = '[data-test="product-tile"]';

const GEOLOCATION_DENIED_SCRIPT = `
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: function (_success, error) {
        if (typeof error === "function") {
          error({ code: 1, message: "Geolocation permission denied by crawler." });
        }
      },
      watchPosition: function (_success, error) {
        if (typeof error === "function") {
          error({ code: 1, message: "Geolocation permission denied by crawler." });
        }
        return 0;
      },
      clearWatch: function () {}
    }
  });
`;

export interface RunAldiCatalogueCrawlOptions {
  storeId?: string;
  expectedStoreText?: string;
  headless?: boolean;
  maxProductsPerCategory?: number;
  categories?: AldiCategory[];
}

export interface CrawlIssue {
  type: string;
  url: string;
  message: string;
}

export interface AldiCrawlSummary {
  crawlRunId: string;
  categoriesRequested: number;
  productLinksDiscovered: number;
  productsScraped: number;
  inserted: number;
  updated: number;
  priceChanges: number;
  skipped: number;
  issues: CrawlIssue[];
}

interface ListingProduct {
  retailerProductId: string;
  productUrl: string;
  name: string | null;
  brand: string | null;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  priceText: string | null;
  imageUrl: string | null;
  categoryPaths: string[][];
}

interface ScrapedProduct {
  retailerProductId: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  ingredientsRaw: string | null;
  allergenAdviceRaw: string | null;
  dietaryInformationRaw: string | null;
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  safetyIssues: string[];
  imageUrl: string | null;
  productUrl: string;
}

interface ListRequestData {
  label: "LIST";
  category: AldiCategory;
}

interface DetailRequestData {
  label: "DETAIL";
  retailerProductId: string;
}

function cleanText(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

export function parsePricePence(value: string | null | undefined): number | null {
  if (!value) return null;

  const match = value.replace(/,/g, "").match(/(?:£\s*)?(\d+(?:\.\d{1,2})?)/);
  if (!match) return null;

  const pounds = Number(match[1]);
  return Number.isFinite(pounds) ? Math.round(pounds * 100) : null;
}

export function extractProductId(url: string): string | null {
  try {
    return new URL(url).pathname.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  } catch {
    return url.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  }
}

function canonicalizeUrl(value: string, baseUrl?: string): string | null {
  try {
    const url = new URL(value, baseUrl);
    url.hash = "";

    for (const parameter of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      url.searchParams.delete(parameter);
    }

    return url.toString();
  } catch {
    return null;
  }
}

function mergeCategoryPaths(existing: string[][], incoming: string[][]): string[][] {
  const paths = new Map<string, string[]>();

  for (const path of [...existing, ...incoming]) {
    paths.set(JSON.stringify(path), path);
  }

  return [...paths.values()];
}

function normalizeAllergens(
  ingredientsRaw: string | null,
  allergenAdviceRaw: string | null,
): string[] {
  const source = `${ingredientsRaw ?? ""} ${allergenAdviceRaw ?? ""}`.toLowerCase();
  const matchers: Array<[string, RegExp]> = [
    ["celery", /\bcelery\b/],
    ["gluten", /\b(gluten|wheat|barley|rye|oats?)\b/],
    ["crustaceans", /\b(crustaceans?|prawn|shrimp|crab|lobster)\b/],
    ["eggs", /\beggs?\b/],
    ["fish", /\bfish\b/],
    ["lupin", /\blupin\b/],
    ["milk", /\b(milk|dairy)\b/],
    ["molluscs", /\b(molluscs?|mussel|oyster|squid|octopus)\b/],
    ["mustard", /\bmustard\b/],
    ["peanuts", /\bpeanuts?\b/],
    ["sesame", /\bsesame\b/],
    ["soya", /\b(soya|soy)\b/],
    ["sulphites", /\b(sulphites?|sulfites?|sulphur dioxide|sulfur dioxide)\b/],
    ["tree nuts", /\b(almond|hazelnut|walnut|cashew|pecan|brazil nut|pistachio|macadamia|tree nuts?)\b/],
  ];

  return matchers.filter(([, pattern]) => pattern.test(source)).map(([name]) => name);
}

function evaluateCatalogueSafety(
  ingredientsRaw: string | null,
  allergenAdviceRaw: string | null,
): {
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  safetyIssues: string[];
} {
  const safetyIssues: string[] = [];

  if (!ingredientsRaw) safetyIssues.push("MISSING_INGREDIENTS");
  if (!allergenAdviceRaw) safetyIssues.push("MISSING_ALLERGEN_DATA");

  const combined = `${ingredientsRaw ?? ""} ${allergenAdviceRaw ?? ""}`.toLowerCase();
  if (/information unavailable|not available|see packaging|check pack/i.test(combined)) {
    safetyIssues.push("AMBIGUOUS_SAFETY_DATA");
  }

  const catalogueSafetyStatus: CatalogueSafetyStatus = safetyIssues.includes(
    "AMBIGUOUS_SAFETY_DATA",
  )
    ? "ambiguous"
    : safetyIssues.length > 0
      ? "incomplete"
      : "verified";

  return {
    normalizedAllergens: normalizeAllergens(ingredientsRaw, allergenAdviceRaw),
    catalogueSafetyStatus,
    eligibleForPlanning: catalogueSafetyStatus === "verified",
    safetyIssues,
  };
}

async function readLocatorText(locator: Locator): Promise<string | null> {
  if ((await locator.count()) === 0) return null;
  return cleanText(await locator.first().textContent().catch(() => null));
}

async function readFirstText(page: Page, selectors: string[]): Promise<string | null> {
  for (const selector of selectors) {
    const value = await readLocatorText(page.locator(selector));
    if (value) return value;
  }

  return null;
}

async function readFirstAttribute(
  page: Page,
  selectors: string[],
  attribute: string,
): Promise<string | null> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) continue;

    const value = cleanText(await locator.getAttribute(attribute).catch(() => null));
    if (value) return value;
  }

  return null;
}

async function dismissCookieBanner(page: Page): Promise<void> {
  const selectors = [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept cookies")',
    'button:has-text("Allow all")',
    'button[id*="accept" i]',
    'button[aria-label*="accept" i]',
  ];

  for (const selector of selectors) {
    const button = page.locator(selector).first();
    if ((await button.isVisible().catch(() => false)) !== true) continue;

    await button.click({ timeout: 2_000 }).catch(() => undefined);
    return;
  }
}

async function waitForSelectedStore(page: Page, expectedStoreText: string): Promise<void> {
  if (!expectedStoreText.trim()) return;

  log.info(
    `Select the Aldi store containing "${expectedStoreText}" in the browser. The crawl will continue automatically.`,
  );

  await page
    .getByText(expectedStoreText, { exact: false })
    .first()
    .waitFor({ state: "visible", timeout: 120_000 });

  log.info(`Aldi store "${expectedStoreText}" detected. Continuing crawl.`);
}

async function loadAllProductTiles(page: Page, maxProducts?: number): Promise<void> {
  await page.waitForSelector(PRODUCT_TILE_SELECTOR, { timeout: 60_000 });

  let previousCount = -1;
  let stableRounds = 0;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const count = await page.locator(PRODUCT_TILE_SELECTOR).count();

    if (count === previousCount) stableRounds += 1;
    else stableRounds = 0;

    previousCount = count;

    if ((maxProducts && count >= maxProducts) || stableRounds >= 3) break;

    await page.mouse.wheel(0, 8_000);
    await page.waitForTimeout(750);
  }

  await page.keyboard.press("Home");
}

async function extractListingProducts(
  page: Page,
  categoryPath: string[],
): Promise<{ products: ListingProduct[]; skipped: number }> {
  const tiles = page.locator(PRODUCT_TILE_SELECTOR);
  const tileCount = await tiles.count();
  const products: ListingProduct[] = [];
  let skipped = 0;

  for (let index = 0; index < tileCount; index += 1) {
    const tile = tiles.nth(index);
    const link = tile.locator('a.product-tile__link[href], a[href*="/product/"]').first();
    const href = await link.getAttribute("href").catch(() => null);
    const productUrl = href ? canonicalizeUrl(href, page.url()) : null;
    const retailerProductId = productUrl ? extractProductId(productUrl) : null;

    if (!productUrl || !retailerProductId) {
      skipped += 1;
      continue;
    }

    const image = tile.locator("img").first();
    const imageSource =
      (await image.getAttribute("src").catch(() => null)) ??
      (await image.getAttribute("data-src").catch(() => null));

    products.push({
      retailerProductId,
      productUrl,
      name: await readLocatorText(tile.locator('[data-test="product-tile__name"]')),
      brand: await readLocatorText(tile.locator('[data-test="product-tile__brandname"]')),
      packageSizeRaw: await readLocatorText(
        tile.locator('[data-test="product-tile__unit-of-measurement"]'),
      ),
      comparisonPriceRaw: await readLocatorText(
        tile.locator('[data-test="product-tile__comparison-price"]'),
      ),
      priceText:
        (await readLocatorText(tile.locator('[data-test="product-tile__price"]'))) ??
        (await readLocatorText(tile.locator(".base-price--product-tile"))) ??
        (await readLocatorText(tile.locator(".base-price"))),
      imageUrl: imageSource ? canonicalizeUrl(imageSource, page.url()) : null,
      categoryPaths: [categoryPath],
    });
  }

  return { products, skipped };
}

async function expandSection(page: Page, pattern: RegExp): Promise<void> {
  const controls = [
    page.getByRole("button", { name: pattern }).first(),
    page.getByRole("tab", { name: pattern }).first(),
    page.locator("summary").filter({ hasText: pattern }).first(),
  ];

  for (const control of controls) {
    if ((await control.isVisible().catch(() => false)) !== true) continue;

    if ((await control.getAttribute("aria-expanded")) !== "true") {
      await control.click({ timeout: 3_000 }).catch(() => undefined);
      await page.waitForTimeout(250);
    }

    return;
  }
}

function extractLabelledSection(
  pageText: string,
  labels: string[],
  stopLabels: string[],
): string | null {
  const lines = pageText
    .split(/\r?\n/)
    .map((line) => cleanText(line))
    .filter((line): line is string => Boolean(line));

  const normalizedLabels = labels.map((label) => label.toLowerCase());
  const normalizedStopLabels = stopLabels.map((label) => label.toLowerCase());

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index].toLowerCase();
    const matchingLabel = normalizedLabels.find(
      (label) => current === label || current.startsWith(`${label}:`),
    );

    if (!matchingLabel) continue;

    const values: string[] = [];
    const inlineValue = cleanText(lines[index].slice(matchingLabel.length).replace(/^:/, ""));
    if (inlineValue) values.push(inlineValue);

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex];
      const normalizedNextLine = nextLine.toLowerCase();

      if (
        normalizedStopLabels.some(
          (label) => normalizedNextLine === label || normalizedNextLine.startsWith(`${label}:`),
        )
      ) {
        break;
      }

      values.push(nextLine);
      if (values.length >= 12) break;
    }

    return cleanText(values.join(" "));
  }

  return null;
}

async function extractDetailProduct(
  page: Page,
  listing: ListingProduct,
): Promise<ScrapedProduct | null> {
  await page.waitForSelector(
    "main.product-details-page, .product-details, h1.product-details__title, main h1",
    { timeout: 60_000 },
  );

  await expandSection(page, /ingredients/i);
  await expandSection(page, /allergy advice|allergens?/i);
  await expandSection(page, /dietary information/i);

  const name =
    (await readFirstText(page, [
      "h1.product-details__title",
      '[data-test="product-details__title"]',
      "main h1",
    ])) ?? listing.name;

  const brand =
    (await readFirstText(page, [
      ".product-details__brand-name",
      '[data-test="product-details__brand-name"]',
    ])) ?? listing.brand;

  const description = await readFirstText(page, [
    '[data-test="product-details__description"]',
    ".product-details__description",
  ]);

  const packageSizeRaw =
    (await readFirstText(page, [
      '[data-test="product-details__unit-of-measurement"]',
      ".product-details__unit-of-measurement",
    ])) ?? listing.packageSizeRaw;

  const comparisonPriceRaw =
    (await readFirstText(page, [
      '[data-test="product-details__comparison-price"]',
      ".product-details__comparison-price",
    ])) ?? listing.comparisonPriceRaw;

  const priceText =
    (await readFirstText(page, [
      ".base-price--product-details .base-price__regular",
      '[data-test="product-details__price"]',
    ])) ?? listing.priceText;

  const canonicalUrl = await readFirstAttribute(page, ['link[rel="canonical"]'], "href");
  const productUrl = canonicalizeUrl(canonicalUrl ?? page.url()) ?? listing.productUrl;
  const retailerProductId = extractProductId(productUrl) ?? listing.retailerProductId;
  const pricePence = parsePricePence(priceText);

  const imageSource = await readFirstAttribute(
    page,
    [".product-image-carousel img", ".product-details img", "main img"],
    "src",
  );

  const pageText = cleanText(await page.locator("main").innerText().catch(() => null)) ?? "";
  const stopLabels = [
    "allergy advice",
    "allergen information",
    "allergens",
    "dietary information",
    "storage information",
    "nutrition information",
    "features",
    "you may also like",
  ];

  const ingredientsRaw = extractLabelledSection(pageText, ["ingredients"], stopLabels);
  const allergenAdviceRaw = extractLabelledSection(
    pageText,
    ["allergy advice", "allergen information", "allergens"],
    ["dietary information", "storage information", "nutrition information", "features", "you may also like"],
  );
  const dietaryInformationRaw = extractLabelledSection(
    pageText,
    ["dietary information", "dietary"],
    ["storage information", "nutrition information", "features", "you may also like"],
  );

  if (!retailerProductId || !name || pricePence === null) return null;

  return {
    retailerProductId,
    name,
    brand,
    description,
    categoryPaths: listing.categoryPaths,
    pricePence,
    packageSizeRaw,
    comparisonPriceRaw,
    ingredientsRaw,
    allergenAdviceRaw,
    dietaryInformationRaw,
    ...evaluateCatalogueSafety(ingredientsRaw, allergenAdviceRaw),
    imageUrl: imageSource ? canonicalizeUrl(imageSource, productUrl) : listing.imageUrl,
    productUrl,
  };
}

async function persistProducts(
  products: ScrapedProduct[],
  storeId: string,
  crawlRunId: string,
): Promise<{ inserted: number; updated: number; priceChanges: number }> {
  if (products.length === 0) {
    return { inserted: 0, updated: 0, priceChanges: 0 };
  }

  await Product.createIndexes();

  const productIds = products.map((product) => product.retailerProductId);
  const existingProducts = await Product.find({
    retailer: RETAILER,
    storeId,
    retailerProductId: { $in: productIds },
  }).lean();

  const existingById = new Map(
    existingProducts.map((product) => [product.retailerProductId, product]),
  );
  const now = new Date();
  let inserted = 0;
  let updated = 0;
  let priceChanges = 0;

  const operations = products.map((product) => {
    const existing = existingById.get(product.retailerProductId);
    const priceChanged = Boolean(existing && existing.pricePence !== product.pricePence);

    if (existing) updated += 1;
    else inserted += 1;

    if (priceChanged) priceChanges += 1;

    return {
      updateOne: {
        filter: {
          retailer: RETAILER,
          storeId,
          retailerProductId: product.retailerProductId,
        },
        update: {
          $set: {
            name: product.name,
            brand: product.brand,
            description: product.description,
            categoryPaths: mergeCategoryPaths(existing?.categoryPaths ?? [], product.categoryPaths),
            pricePence: product.pricePence,
            previousPricePence: priceChanged
              ? existing?.pricePence ?? null
              : existing?.previousPricePence ?? null,
            priceChangedAt: priceChanged
              ? now
              : existing?.priceChangedAt ?? null,
            packageSizeRaw: product.packageSizeRaw,
            comparisonPriceRaw: product.comparisonPriceRaw,
            ingredientsRaw: product.ingredientsRaw,
            allergenAdviceRaw: product.allergenAdviceRaw,
            dietaryInformationRaw: product.dietaryInformationRaw,
            normalizedAllergens: product.normalizedAllergens,
            catalogueSafetyStatus: product.catalogueSafetyStatus,
            eligibleForPlanning: product.eligibleForPlanning,
            safetyIssues: product.safetyIssues,
            imageUrl: product.imageUrl,
            productUrl: product.productUrl,
            available: true,
            lastCheckedAt: now,
            lastSeenAt: now,
            lastCrawlRunId: crawlRunId,
          },
          $setOnInsert: {
            retailer: RETAILER,
            storeId,
            retailerProductId: product.retailerProductId,
            canonicalKey: `${RETAILER}:${storeId}:${product.retailerProductId}`,
          },
        },
        upsert: true,
      },
    };
  });

  await Product.bulkWrite(operations, { ordered: false });

  return { inserted, updated, priceChanges };
}

export async function runAldiCatalogueCrawl(
  options: RunAldiCatalogueCrawlOptions = {},
): Promise<AldiCrawlSummary> {
  const crawlRunId = randomUUID();
  const storeId = options.storeId ?? DEFAULT_STORE_ID;
  const expectedStoreText = options.expectedStoreText ?? DEFAULT_EXPECTED_STORE_TEXT;
  const categories = (options.categories ?? ALDI_CATEGORIES).filter((category) => category.enabled);
  const listingById = new Map<string, ListingProduct>();
  const scrapedById = new Map<string, ScrapedProduct>();
  const issues: CrawlIssue[] = [];
  let skipped = 0;
  let storeConfirmed = false;

  if (categories.length === 0) {
    throw new Error("No enabled Aldi categories are configured.");
  }

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 180,
    navigationTimeoutSecs: 90,
    launchContext: {
      launchOptions: {
        headless: options.headless ?? false,
        args: ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
      },
      browserContextOptions: {
        locale: "en-GB",
      },
    },
    preNavigationHooks: [
      async ({ page }) => {
        page.setDefaultTimeout(60_000);
        page.setDefaultNavigationTimeout(90_000);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setExtraHTTPHeaders({ "accept-language": "en-GB,en;q=0.9" });
        await page.addInitScript(GEOLOCATION_DENIED_SCRIPT);
      },
    ],
    async requestHandler({ page, request }) {
      const data = request.userData as ListRequestData | DetailRequestData;

      await dismissCookieBanner(page);

      if (data.label === "LIST") {
        if (!storeConfirmed) {
          await waitForSelectedStore(page, expectedStoreText);
          storeConfirmed = true;
        }

        await loadAllProductTiles(page, options.maxProductsPerCategory);
        const listingResult = await extractListingProducts(page, data.category.categoryPath);
        skipped += listingResult.skipped;

        const selected = options.maxProductsPerCategory
          ? listingResult.products.slice(0, options.maxProductsPerCategory)
          : listingResult.products;

        for (const product of selected) {
          const existing = listingById.get(product.retailerProductId);
          listingById.set(product.retailerProductId, {
            ...(existing ?? product),
            ...product,
            categoryPaths: mergeCategoryPaths(
              existing?.categoryPaths ?? [],
              product.categoryPaths,
            ),
          });
        }

        await crawler.addRequests(
          selected.map((product) => ({
            url: product.productUrl,
            uniqueKey: `aldi-product:${product.retailerProductId}`,
            userData: {
              label: "DETAIL",
              retailerProductId: product.retailerProductId,
            } as DetailRequestData,
          })),
        );

        log.info(
          `Aldi category ${data.category.key}: discovered ${selected.length} product links.`,
        );
        return;
      }

      const listing = listingById.get(data.retailerProductId);
      if (!listing) {
        skipped += 1;
        issues.push({
          type: "MISSING_LISTING_CONTEXT",
          url: request.url,
          message: `No listing data found for ${data.retailerProductId}.`,
        });
        return;
      }

      const product = await extractDetailProduct(page, listing);
      if (!product) {
        skipped += 1;
        issues.push({
          type: "INVALID_PRODUCT_DATA",
          url: request.url,
          message: "The product was missing a stable Aldi ID, name, or price.",
        });
        return;
      }

      const previouslyScraped = scrapedById.get(product.retailerProductId);
      scrapedById.set(product.retailerProductId, {
        ...product,
        categoryPaths: mergeCategoryPaths(
          previouslyScraped?.categoryPaths ?? [],
          listing.categoryPaths,
        ),
      });
    },
    failedRequestHandler({ request }, error) {
      issues.push({
        type: "REQUEST_FAILED",
        url: request.url,
        message: error instanceof Error ? error.message : String(error),
      });
    },
  });

  const initialRequests = categories.map(
    (category) =>
      new Request({
        url: category.url,
        uniqueKey: `aldi-category:${category.key}:${crawlRunId}`,
        userData: { label: "LIST", category } as ListRequestData,
      }),
  );

  await crawler.run(initialRequests);

  const scrapedProducts = [...scrapedById.values()];
  const persisted = await persistProducts(scrapedProducts, storeId, crawlRunId);

  return {
    crawlRunId,
    categoriesRequested: categories.length,
    productLinksDiscovered: listingById.size,
    productsScraped: scrapedProducts.length,
    inserted: persisted.inserted,
    updated: persisted.updated,
    priceChanges: persisted.priceChanges,
    skipped,
    issues,
  };
}
