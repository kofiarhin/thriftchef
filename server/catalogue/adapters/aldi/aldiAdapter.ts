/**
 * Aldi UK, expressed as a catalogue adapter.
 *
 * Everything here is about how aldi.co.uk behaves: its cookie banner, its
 * store picker, its 30-tile listing pages, its `?page=N` pager, and the fact
 * that it publishes ingredients and allergen advice as loose text under
 * headings rather than in addressable elements.
 *
 * Nothing here knows about MongoDB, crawl runs, retries, batching, price
 * history or availability. Those belong to the shared runner, and the whole
 * point of this boundary is that a second retailer inherits them rather than
 * reimplementing them.
 */

import { log } from "crawlee";
import type { Locator, Page } from "playwright";
import type {
  AdapterContext,
  ListingPageResult,
  RetailerCatalogueAdapter,
  RetailerListingProduct,
} from "../../contracts/retailerAdapter";
import type { NormalizedCatalogueProduct } from "../../contracts/normalizedCatalogueProduct";
import type { RetailerCategory } from "../../contracts/retailerCategory";
import { ALDI_CATEGORIES } from "./aldiCategories";
import {
  ALDI_HOSTS,
  ALDI_SELECTORS,
  DETAIL_STOP_LABELS,
  GEOLOCATION_DENIED_SCRIPT,
  PRODUCT_TILE_SELECTOR,
  buildListingPageUrl,
  canonicalizeUrl,
  cleanText,
  extractHighestPageNumber,
  extractLabelledSection,
  extractProductId,
  parsePricePence,
} from "./aldiSelectors";

/** Bumped when extraction changes, so a crawl run records what produced it. */
export const ALDI_ADAPTER_VERSION = "1.0.0";

/** How long to wait for a human to pick the store in a visible browser. */
const STORE_SELECTION_TIMEOUT_MS = 120_000;

async function readLocatorText(locator: Locator): Promise<string | null> {
  if ((await locator.count()) === 0) return null;

  return cleanText(
    await locator
      .first()
      .textContent()
      .catch(() => null),
  );
}

async function readFirstText(
  page: Page,
  selectors: readonly string[],
): Promise<string | null> {
  for (const selector of selectors) {
    const value = await readLocatorText(page.locator(selector));
    if (value) return value;
  }

  return null;
}

async function readFirstAttribute(
  page: Page,
  selectors: readonly string[],
  attribute: string,
): Promise<string | null> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) continue;

    const value = cleanText(
      await locator.getAttribute(attribute).catch(() => null),
    );
    if (value) return value;
  }

  return null;
}

/**
 * Aldi lazy-loads tiles as the page scrolls. Stopping after three rounds with
 * no new tiles is what distinguishes "the list has ended" from "the next batch
 * has not arrived yet"; a fixed number of scrolls would do neither reliably.
 */
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

async function readPaginationHrefs(page: Page): Promise<string[]> {
  return page
    .locator('a[href*="page="]')
    .evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
    )
    .catch(() => []);
}

export class AldiAdapter implements RetailerCatalogueAdapter {
  readonly adapterKey = "aldi";
  readonly adapterVersion = ALDI_ADAPTER_VERSION;
  readonly allowedHosts = ALDI_HOSTS;
  readonly initScript = GEOLOCATION_DENIED_SCRIPT;

  /** Only used to cap a bounded or diagnostic run. */
  constructor(private readonly maxProductsPerCategory?: number) {}

  async prepareSession(context: AdapterContext): Promise<void> {
    await this.dismissCookieBanner(context.page);
  }

  /**
   * Confirms the session is actually looking at the requested store.
   *
   * Load-bearing well beyond this crawl: availability reconciliation refuses
   * to retire anything without it, because an unverified session may have been
   * reading a different branch's shelves the whole time.
   */
  async verifyStoreSelection(context: AdapterContext): Promise<boolean> {
    const expected = context.expectedStoreText.trim();
    if (!expected) return false;

    context.log(
      `Select the Aldi store containing "${expected}" in the browser. The crawl will continue automatically.`,
    );

    const found = await context.page
      .getByText(expected, { exact: false })
      .first()
      .waitFor({ state: "visible", timeout: STORE_SELECTION_TIMEOUT_MS })
      .then(() => true)
      .catch(() => false);

    if (found) context.log(`Aldi store "${expected}" detected. Continuing crawl.`);
    else context.log(`Aldi store "${expected}" was never confirmed.`);

    return found;
  }

  /**
   * A static registry rather than site discovery.
   *
   * Scope follows the product: only edible-grocery departments can contribute
   * to a meal plan, and ordering matters because the departments a plan
   * depends on most are crawled first.
   */
  async discoverCategories(): Promise<RetailerCategory[]> {
    return ALDI_CATEGORIES.filter((category) => category.enabled);
  }

  async extractListingPage({
    context,
    category,
    page,
  }: {
    context: AdapterContext;
    category: RetailerCategory;
    page: number;
  }): Promise<ListingPageResult> {
    await this.dismissCookieBanner(context.page);
    await loadAllProductTiles(context.page, this.maxProductsPerCategory);

    const tiles = context.page.locator(PRODUCT_TILE_SELECTOR);
    const tileCount = await tiles.count();
    const products: RetailerListingProduct[] = [];
    let skipped = 0;

    for (let index = 0; index < tileCount; index += 1) {
      const tile = tiles.nth(index);
      const link = tile.locator(ALDI_SELECTORS.tileLink).first();
      const href = await link.getAttribute("href").catch(() => null);
      const productUrl = href ? canonicalizeUrl(href, context.page.url()) : null;
      const retailerProductId = productUrl ? extractProductId(productUrl) : null;

      // A tile without a resolvable product id is counted, not guessed at. The
      // count feeds the failure rate that decides whether this run may later
      // retire anything.
      if (!productUrl || !retailerProductId) {
        skipped += 1;
        continue;
      }

      const image = tile.locator("img").first();
      const imageSource =
        (await image.getAttribute("src").catch(() => null)) ??
        (await image.getAttribute("data-src").catch(() => null));

      let priceText: string | null = null;
      for (const selector of ALDI_SELECTORS.tilePrice) {
        priceText = await readLocatorText(tile.locator(selector));
        if (priceText) break;
      }

      products.push({
        retailerProductId,
        productUrl,
        name: await readLocatorText(tile.locator(ALDI_SELECTORS.tileName)),
        brand: await readLocatorText(tile.locator(ALDI_SELECTORS.tileBrand)),
        packageSizeRaw: await readLocatorText(
          tile.locator(ALDI_SELECTORS.tilePackageSize),
        ),
        comparisonPriceRaw: await readLocatorText(
          tile.locator(ALDI_SELECTORS.tileComparisonPrice),
        ),
        priceText,
        imageUrl: imageSource
          ? canonicalizeUrl(imageSource, context.page.url())
          : null,
        categoryPaths: [category.categoryPath],
      });
    }

    // Only the first page advertises the full pager, so the rest are enqueued
    // once. A capped run skips this entirely: it is not trying to see the
    // whole category.
    const nextPages: string[] = [];
    if (page === 1 && !this.maxProductsPerCategory) {
      const highest = extractHighestPageNumber(
        await readPaginationHrefs(context.page),
      );

      for (let next = 2; next <= highest; next += 1) {
        const url = buildListingPageUrl(category.url, next);
        if (url) nextPages.push(url);
      }
    }

    const selected = this.maxProductsPerCategory
      ? products.slice(0, this.maxProductsPerCategory)
      : products;

    return { products: selected, nextPages, skipped };
  }

  async extractProduct({
    context,
    listing,
  }: {
    context: AdapterContext;
    listing: RetailerListingProduct;
  }): Promise<NormalizedCatalogueProduct | null> {
    const { page } = context;

    await this.dismissCookieBanner(page);
    await page.waitForSelector(ALDI_SELECTORS.detailReady, { timeout: 60_000 });

    // Ingredients and allergen advice sit inside collapsed disclosures, so
    // reading the page text without opening them finds nothing at all.
    await expandSection(page, /ingredients/i);
    await expandSection(page, /allergy advice|allergens?/i);
    await expandSection(page, /dietary information/i);

    const name =
      (await readFirstText(page, ALDI_SELECTORS.detailName)) ?? listing.name;
    const brand =
      (await readFirstText(page, ALDI_SELECTORS.detailBrand)) ?? listing.brand;
    const description = await readFirstText(
      page,
      ALDI_SELECTORS.detailDescription,
    );
    const packageSizeRaw =
      (await readFirstText(page, ALDI_SELECTORS.detailPackageSize)) ??
      listing.packageSizeRaw;
    const comparisonPriceRaw =
      (await readFirstText(page, ALDI_SELECTORS.detailComparisonPrice)) ??
      listing.comparisonPriceRaw;
    const priceText =
      (await readFirstText(page, ALDI_SELECTORS.detailPrice)) ?? listing.priceText;

    const canonical = await readFirstAttribute(
      page,
      ['link[rel="canonical"]'],
      "href",
    );
    const productUrl =
      canonicalizeUrl(canonical ?? page.url()) ?? listing.productUrl;
    const retailerProductId =
      extractProductId(productUrl) ?? listing.retailerProductId;
    const priceMinor = parsePricePence(priceText);

    const imageSource = await readFirstAttribute(
      page,
      ALDI_SELECTORS.detailImage,
      "src",
    );

    const pageText =
      cleanText(
        await page
          .locator("main")
          .innerText()
          .catch(() => null),
      ) ?? "";

    const { ingredientsRaw, allergenAdviceRaw, dietaryInformationRaw } =
      extractAldiLabelText(pageText);

    // The runner validates this again, but a candidate missing its identity,
    // name or price cannot be normalised into anything useful and is dropped
    // here so the failure is attributed to extraction.
    if (!retailerProductId || !name || priceMinor === null) return null;

    return {
      retailerProductId,
      name,
      brand,
      description,
      categoryPaths: listing.categoryPaths,
      priceMinor,
      packageSizeRaw,
      comparisonPriceRaw,
      ingredientsRaw,
      allergenAdviceRaw,
      dietaryInformationRaw,
      imageUrl: imageSource ? canonicalizeUrl(imageSource, page.url()) : null,
      productUrl,
      available: true,
    };
  }

  /** Called before every navigation: Aldi re-shows the banner across hosts. */
  private async dismissCookieBanner(page: Page): Promise<void> {
    for (const selector of ALDI_SELECTORS.cookieAccept) {
      const button = page.locator(selector).first();
      if ((await button.isVisible().catch(() => false)) !== true) continue;

      await button.click({ timeout: 2_000 }).catch(() => undefined);
      return;
    }
  }
}

/**
 * The three label blocks, read out of the product page's flat text.
 *
 * Separated from the Playwright call so it can be exercised against saved page
 * text — which is exactly what the fixture tests do.
 */
export function extractAldiLabelText(pageText: string): {
  ingredientsRaw: string | null;
  allergenAdviceRaw: string | null;
  dietaryInformationRaw: string | null;
} {
  return {
    ingredientsRaw: extractLabelledSection(
      pageText,
      ["ingredients"],
      DETAIL_STOP_LABELS,
    ),
    allergenAdviceRaw: extractLabelledSection(
      pageText,
      ["allergy advice", "allergen information", "allergens"],
      [
        "dietary information",
        "storage information",
        "nutrition information",
        "features",
        "you may also like",
      ],
    ),
    dietaryInformationRaw: extractLabelledSection(
      pageText,
      ["dietary information", "dietary"],
      [
        "storage information",
        "nutrition information",
        "features",
        "you may also like",
      ],
    ),
  };
}

/** The registered instance. A bounded run constructs its own with a cap. */
export const aldiAdapter = new AldiAdapter();

export { log };
