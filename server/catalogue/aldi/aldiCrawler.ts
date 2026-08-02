import { randomUUID } from "node:crypto";
import { PlaywrightCrawler, Request, log } from "crawlee";
import type { Page } from "playwright";
import { Product, type CatalogueSafetyStatus } from "../../models/Product";
import { ALDI_CATEGORIES, type AldiCategory } from "./aldiCategories";

const RETAILER = "aldi-uk" as const;
const DEFAULT_STORE_ID = "belper-de56-1ar";
const DEFAULT_EXPECTED_STORE_TEXT = "DE56 1AR";
const PRODUCT_TILE_SELECTOR = '[data-test="product-tile"]';

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

interface CrawlIssue {
  type: string;
  url: string;
  message: string;
}

export interface RunAldiCatalogueCrawlOptions {
  storeId?: string;
  expectedStoreText?: string;
  categories?: AldiCategory[];
  headless?: boolean;
  maxProductsPerCategory?: number;
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

interface DetailRequestData {
  label: "DETAIL";
  retailerProductId: string;
}

interface ListRequestData {
  label: "LIST";
  category: AldiCategory;
}

const UK_ALLERGEN_PATTERNS: Array<[string, RegExp]> = [
  ["celery", /\bcelery\b/i],
  ["cereals containing gluten", /\b(wheat|barley|rye|oats?|spelt|kamut|gluten)\b/i],
  ["crustaceans", /\b(crustaceans?|prawn|shrimp|crab|lobster)\b/i],
  ["eggs", /\beggs?\b/i],
  ["fish", /\bfish\b/i],
  ["lupin", /\blupin\b/i],
  ["milk", /\b(milk|dairy|lactose)\b/i],
  ["molluscs", /\b(molluscs?|mussels?|oysters?|squid|snails?)\b/i],
  ["mustard", /\bmustard\b/i],
  ["peanuts", /\bpeanuts?\b/i],
  ["sesame", /\bsesame\b/i],
  ["soybeans", /\b(soya|soybeans?|soy)\b/i],
  ["sulphites", /\b(sulphites?|sulfites?|sulphur dioxide|sulfur dioxide)\b/i],
  ["tree nuts", /\b(almonds?|hazelnuts?|walnuts?|cashews?|pecans?|pistachios?|macadamias?|brazil nuts?|tree nuts?)\b/i],
];

function cleanText(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
  return cleaned || null;
}

function parsePricePence(rawValue: string | null | undefined): number | null {
  const match = String(rawValue ?? "")
    .replace(/,/g, "")
    .match(/(?:£\s*)?(\d+(?:\.\d{1,2})?)/);

  if (!match) return null;

  const pounds = Number(match[1]);
  return Number.isFinite(pounds) ? Math.round(pounds * 100) : null;
}

function extractProductId(productUrl: string): string | null {
  try {
    return new URL(productUrl).pathname.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  } catch {
    return productUrl.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  }
}

function canonicalizeUrl(rawUrl: string, baseUrl?: string): string | null {
  try {
    const url = new URL(rawUrl, baseUrl);
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
      (key) => url.searchParams.delete(key),
    );
    return url.toString();
  } catch {
    return null;
  }
}

function categoryPathKey(path: string[]): string {
  return path.map((part) => part.trim().toLowerCase()).join(" > ");
}

function mergeCategoryPaths(...groups: string[][][]): string[][] {
  const merged = new Map<string, string[]>();

  for (const group of groups) {
    for (const path of group) {
      if (path.length > 0) merged.set(categoryPathKey(path), path);
    }
  }

  return [...merged.values()];
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
  const issues: string[] = [];
  const combinedText = [ingredientsRaw, allergenAdviceRaw].filter(Boolean).join(" ");

  if (!ingredientsRaw) issues.push("MISSING_INGREDIENTS");
  if (!allergenAdviceRaw) issues.push("MISSING_ALLERGEN_DATA");

  const ambiguousPattern =
    /not available|refer to (the )?packaging|check (the )?packaging|information may vary|see product label|details unavailable/i;

  if (ambiguousPattern.test(combinedText)) {
    issues.push("AMBIGUOUS_SAFETY_DATA");
  }

  const normalizedAllergens = UK_ALLERGEN_PATTERNS.filter(([, pattern]) =>
    pattern.test(combinedText),
  ).map(([name]) => name);

  if (
    /see ingredients? in bold/i.test(allergenAdviceRaw ?? "") &&
    normalizedAllergens.length === 0
  ) {
    issues.push("ALLERGEN_FORMATTING_NOT_CAPTURED");
  }

  const uniqueIssues = [...new Set(issues)];
  const catalogueSafetyStatus: CatalogueSafetyStatus = uniqueIssues.some((issue) =>
    issue.startsWith("MISSING_"),
  )
    ? "incomplete"
    : uniqueIssues.length > 0
      ? "ambiguous"
      : "verified";

  return {
    normalizedAllergens,
    catalogueSafetyStatus,
    eligibleForPlanning: catalogueSafetyStatus === "verified",
    safetyIssues: uniqueIssues,
  };
}

async function denyGeolocation(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const denied = { code: 1, message: "Geolocation permission denied." };

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (_success: unknown, error?: (reason: unknown) => void) => error?.(denied),
        watchPosition: (_success: unknown, error?: (reason: unknown) => void) => {
          error?.(denied);
          return 0;
        },
        clearWatch: () => undefined,
      },
    });
  });
}

async function dismissCookieBanner(page: Page): Promise<void> {
  const selectors = [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept cookies")',
    'button:has-text("Allow all")',
  ];

  for (const selector of selectors) {
    const button = page.locator(selector).first();
    if ((await button.isVisible().catch(() => false)) === true) {
      await button.click({ timeout: 2_000 }).catch(() => undefined);
      return;
    }
  }
}

async function waitForSelectedStore(page: Page, expectedStoreText: string): Promise<void> {
  log.info(`Select the Aldi store containing "${expectedStoreText}" in the browser.`);

  await page
    .getByText(expectedStoreText, { exact: false })
    .first()
    .waitFor({ state: "visible", timeout: 120_000 });

  log.info(`Aldi store "${expectedStoreText}" detected. Continuing crawl.`);
}

async function loadAllProductTiles(page: Page, maxProducts?: number): Promise<void> {
  await page.waitForSelector(PRODUCT_TILE_SELECTOR, { timeout: 60_000 });

  let previousCount = 0;
  let stableRounds = 0;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const count = await page.locator(PRODUCT_TILE_SELECTOR).count();

    if (count === previousCount) stableRounds += 1;
    else stableRounds = 0;

    previousCount = count;

    if ((maxProducts && count >= maxProducts) || stableRounds >= 3) break;

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(750);
  }
}

async function extractListingProducts(
  page: Page,
  categoryPath: string[],
): Promise<ListingProduct[]> {
  const rawProducts = await page.$$eval(PRODUCT_TILE_SELECTOR, (tiles) =>
    tiles.map((tile) => {
      const text = (selector: string) =>
        tile.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() || null;
      const link = tile.querySelector<HTMLAnchorElement>(
        'a.product-tile__link[href], a[href*="/product/"]',
      );
      const image = tile.querySelector<HTMLImageElement>("img");

      return {
        href: link?.getAttribute("href") ?? null,
        name: text('[data-test="product-tile__name"]'),
        brand: text('[data-test="product-tile__brandname"]'),
        packageSizeRaw: text('[data-test="product-tile__unit-of-measurement"]'),
        comparisonPriceRaw: text('[data-test="product-tile__comparison-price"]'),
        priceText:
          text('[data-test="product-tile__price"]') ||
          text(".base-price--product-tile") ||
          text(".base-price"),
        imageUrl:
          image?.currentSrc || image?.getAttribute("src") || image?.getAttribute("data-src") || null,
      };
    }),
  );

  return rawProducts.flatMap((raw) => {
    const productUrl = raw.href ? canonicalizeUrl(raw.href, page.url()) : null;
    const retailerProductId = productUrl ? extractProductId(productUrl) : null;

    if (!productUrl || !retailerProductId) return [];

    return [
      {
        retailerProductId,
        productUrl,
        name: cleanText(raw.name),
        brand: cleanText(raw.brand),
        packageSizeRaw: cleanText(raw.packageSizeRaw),
        comparisonPriceRaw: cleanText(raw.comparisonPriceRaw),
        priceText: cleanText(raw.priceText),
        imageUrl: raw.imageUrl ? canonicalizeUrl(raw.imageUrl, page.url()) : null,
        categoryPaths: [categoryPath],
      },
    ];
  });
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

async function extractSectionByHeading(page: Page, headings: string[]): Promise<string | null> {
  return page.evaluate((terms) => {
    const clean = (value: string | null | undefined) =>
      String(value ?? "").replace(/\s+/g, " ").trim();
    const normalizedTerms = terms.map((term) => term.toLowerCase());
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'h2, h3, h4, button, summary, dt, [role="heading"], [class*="accordion" i]',
      ),
    );

    const heading = candidates.find((element) => {
      const value = clean(element.textContent).toLowerCase();
      return normalizedTerms.some((term) => value === term || value.startsWith(`${term}:`));
    });

    if (!heading) return null;

    const containers = [
      heading.nextElementSibling,
      heading.parentElement?.nextElementSibling,
      heading.closest("section"),
      heading.closest("article"),
      heading.closest("li"),
      heading.parentElement,
    ].filter((value): value is Element => Boolean(value));

    for (const container of containers) {
      const fullText = clean((container as HTMLElement).innerText || container.textContent);
      const withoutHeading = clean(fullText.replace(clean(heading.textContent), ""));
      if (withoutHeading.length > 2) return withoutHeading;
    }

    return null;
  }, headings);
}

async function extractDetailProduct(
  page: Page,
  listing: ListingProduct,
): Promise<ScrapedProduct | null> {
  await page.waitForSelector(
    "main.product-details-page, .product-details, h1.product-details__title",
    { timeout: 60_000 },
  );

  await Promise.all([
    expandSection(page, /ingredients/i),
    expandSection(page, /allergy advice|allergens?/i),
    expandSection(page, /dietary information/i),
  ]);

  const detail = await page.evaluate(() => {
    const clean = (value: string | null | undefined) =>
      String(value ?? "").replace(/\s+/g, " ").trim() || null;
    const text = (selector: string) => clean(document.querySelector(selector)?.textContent);
    const image =
      document.querySelector<HTMLImageElement>(".product-image-carousel img") ||
      document.querySelector<HTMLImageElement>(".product-details img") ||
      document.querySelector<HTMLImageElement>("main img");

    let jsonLd: Record<string, unknown> | null = null;
    for (const node of document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')) {
      try {
        const parsed = JSON.parse(node.textContent || "null") as unknown;
        const values = Array.isArray(parsed)
          ? parsed
          : parsed && typeof parsed === "object" && "@graph" in parsed
            ? (parsed as { "@graph": unknown[] })["@graph"]
            : [parsed];
        const product = values.find(
          (value) => value && typeof value === "object" && (value as { "@type"?: string })["@type"] === "Product",
        );
        if (product && typeof product === "object") {
          jsonLd = product as Record<string, unknown>;
          break;
        }
      } catch {
        // Ignore invalid structured data and continue with DOM selectors.
      }
    }

    const offers = jsonLd?.offers as { price?: string | number } | undefined;
    const brand = jsonLd?.brand as { name?: string } | string | undefined;
    const jsonImage = Array.isArray(jsonLd?.image) ? jsonLd?.image[0] : jsonLd?.image;

    return {
      name:
        text("h1.product-details__title") ||
        text('[data-test="product-details__title"]') ||
        clean(typeof jsonLd?.name === "string" ? jsonLd.name : null),
      brand:
        text(".product-details__brand-name") ||
        text('[data-test="product-details__brand-name"]') ||
        clean(typeof brand === "string" ? brand : brand?.name),
      description:
        text('[data-test="product-details__description"]') ||
        text(".product-details__description") ||
        clean(typeof jsonLd?.description === "string" ? jsonLd.description : null),
      packageSizeRaw:
        text('[data-test="product-details__unit-of-measurement"]') ||
        text(".product-details__unit-of-measurement"),
      comparisonPriceRaw:
        text('[data-test="product-details__comparison-price"]') ||
        text(".product-details__comparison-price"),
      priceText:
        text(".base-price--product-details .base-price__regular") ||
        text('[data-test="product-details__price"]') ||
        clean(offers?.price === undefined ? null : String(offers.price)),
      imageUrl:
        image?.currentSrc ||
        image?.getAttribute("src") ||
        image?.getAttribute("data-src") ||
        (typeof jsonImage === "string" ? jsonImage : null),
      canonicalUrl: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || null,
    };
  });

  const ingredientsRaw = cleanText(await extractSectionByHeading(page, ["ingredients"]));
  const allergenAdviceRaw = cleanText(
    await extractSectionByHeading(page, ["allergy advice", "allergen information", "allergens"]),
  );
  const dietaryInformationRaw = cleanText(
    await extractSectionByHeading(page, ["dietary information", "dietary"]),
  );

  const productUrl = canonicalizeUrl(detail.canonicalUrl || page.url()) ?? listing.productUrl;
  const retailerProductId = extractProductId(productUrl) ?? listing.retailerProductId;
  const name = cleanText(detail.name) ?? listing.name;
  const pricePence = parsePricePence(cleanText(detail.priceText) ?? listing.priceText);

  if (!retailerProductId || !name || pricePence === null) return null;

  const safety = evaluateCatalogueSafety(ingredientsRaw, allergenAdviceRaw);

  return {
    retailerProductId,
    name,
    brand: cleanText(detail.brand) ?? listing.brand,
    description: cleanText(detail.description),
    categoryPaths: listing.categoryPaths,
    pricePence,
    packageSizeRaw: cleanText(detail.packageSizeRaw) ?? listing.packageSizeRaw,
    comparisonPriceRaw: cleanText(detail.comparisonPriceRaw) ?? listing.comparisonPriceRaw,
    ingredientsRaw,
    allergenAdviceRaw,
    dietaryInformationRaw,
    ...safety,
    imageUrl:
      (detail.imageUrl ? canonicalizeUrl(detail.imageUrl, productUrl) : null) ?? listing.imageUrl,
    productUrl,
  };
}

async function persistProducts(
  products: ScrapedProduct[],
  storeId: string,
  crawlRunId: string,
): Promise<{ inserted: number; updated: number; priceChanges: number }> {
  if (products.length === 0) return { inserted: 0, updated: 0, priceChanges: 0 };

  await Product.createIndexes();

  const productIds = products.map((product) => product.retailerProductId);
  const existingProducts = await Product.find({
    retailer: RETAILER,
    storeId,
    retailerProductId: { $in: productIds },
  })
    .select({ retailerProductId: 1, pricePence: 1, categoryPaths: 1 })
    .lean();

  const existingById = new Map(
    existingProducts.map((product) => [product.retailerProductId, product]),
  );
  const now = new Date();
  let priceChanges = 0;

  const operations = products.map((product) => {
    const existing = existingById.get(product.retailerProductId);
    const priceChanged = existing !== undefined && existing.pricePence !== product.pricePence;
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
            canonicalKey: `${RETAILER}:${storeId}:${product.retailerProductId}`,
            name: product.name,
            brand: product.brand,
            description: product.description,
            categoryPaths: mergeCategoryPaths(
              existing?.categoryPaths ?? [],
              product.categoryPaths,
            ),
            pricePence: product.pricePence,
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
            ...(priceChanged
              ? {
                  previousPricePence: existing.pricePence,
                  priceChangedAt: now,
                }
              : {}),
          },
          $setOnInsert: {
            retailer: RETAILER,
            storeId,
            retailerProductId: product.retailerProductId,
            ...(priceChanged
              ? {}
              : {
                  previousPricePence: null,
                  priceChangedAt: null,
                }),
          },
        },
        upsert: true,
      },
    };
  });

  const result = await Product.bulkWrite(operations, { ordered: false });

  return {
    inserted: result.upsertedCount,
    updated: result.matchedCount,
    priceChanges,
  };
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
    },
    preNavigationHooks: [
      async ({ page }) => {
        page.setDefaultTimeout(60_000);
        page.setDefaultNavigationTimeout(90_000);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setExtraHTTPHeaders({ "accept-language": "en-GB,en;q=0.9" });
        await denyGeolocation(page);
        await page.route("**/*", async (route) => {
          const type = route.request().resourceType();
          if (type === "font" || type === "media") await route.abort();
          else await route.continue();
        });
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
        const products = await extractListingProducts(page, data.category.categoryPath);
        const selected = options.maxProductsPerCategory
          ? products.slice(0, options.maxProductsPerCategory)
          : products;

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
            } satisfies DetailRequestData,
          })),
        );
        return;
      }

      const listing = listingById.get(data.retailerProductId);
      if (!listing) {
        issues.push({
          type: "MISSING_LISTING_CONTEXT",
          url: request.url,
          message: `No listing data found for ${data.retailerProductId}.`,
        });
        return;
      }

      const product = await extractDetailProduct(page, listing);
      if (!product) {
        issues.push({
          type: "INVALID_PRODUCT_DATA",
          url: request.url,
          message: "The product was missing a stable Aldi ID, name, or price.",
        });
        return;
      }

      scrapedById.set(product.retailerProductId, {
        ...product,
        categoryPaths: mergeCategoryPaths(
          scrapedById.get(product.retailerProductId)?.categoryPaths ?? [],
          listing.categoryPaths,
        ),
      });
    },
    failedRequestHandler({ request, error }) {
      issues.push({
        type: "REQUEST_FAILED",
        url: request.url,
        message: error instanceof Error ? error.message : String(error),
      });
    },
  });

  const initialRequests: Request[] = categories.map(
    (category) =>
      new Request({
        url: category.url,
        uniqueKey: `aldi-category:${category.key}`,
        userData: { label: "LIST", category } satisfies ListRequestData,
      }),
  );

  await crawler.run(initialRequests);

  const scrapedProducts = [...scrapedById.values()].map((product) => ({
    ...product,
    categoryPaths: mergeCategoryPaths(
      product.categoryPaths,
      listingById.get(product.retailerProductId)?.categoryPaths ?? [],
    ),
  }));
  const persisted = await persistProducts(scrapedProducts, storeId, crawlRunId);

  return {
    crawlRunId,
    categoriesRequested: categories.length,
    productLinksDiscovered: listingById.size,
    productsScraped: scrapedProducts.length,
    inserted: persisted.inserted,
    updated: persisted.updated,
    priceChanges: persisted.priceChanges,
    skipped: listingById.size - scrapedProducts.length,
    issues,
  };
}
