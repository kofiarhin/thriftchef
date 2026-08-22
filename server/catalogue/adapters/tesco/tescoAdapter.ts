/**
 * Tesco UK, expressed as a catalogue adapter.
 *
 * Everything here is about how www.tesco.com behaves: its consent dialog, its
 * fulfilment-location control, its numeric product ids, its paged listings,
 * its Clubcard prices sitting beside shelf prices, and the two layouts it uses
 * for ingredients and allergy advice.
 *
 * Nothing here knows about MongoDB, crawl runs, retries, batching, price
 * history or reconciliation. Those belong to the shared runner, and the whole
 * point of this boundary is that Tesco inherits them rather than growing a
 * second copy of every bug already fixed there.
 *
 * Two rules in this file are load-bearing beyond the crawl:
 *
 *   - verification fails closed. An unverified session may have been reading a
 *     different fulfilment scope's prices, and the runner refuses to write
 *     store-scoped products without it.
 *   - the normal shelf price is the only basket price. A Clubcard price is a
 *     price for a different shopper, and budgeting with it produces a total
 *     the user cannot buy the basket for.
 */

import type { Locator, Page } from "playwright";
import type {
  AdapterContext,
  ListingPageResult,
  RetailerCatalogueAdapter,
  RetailerListingProduct,
} from "../../contracts/retailerAdapter";
import type { NormalizedCatalogueProduct } from "../../contracts/normalizedCatalogueProduct";
import type { RetailerCategory } from "../../contracts/retailerCategory";
import { TESCO_CATEGORIES } from "./tescoCategories";
import {
  TESCO_DETAIL_STOP_LABELS,
  TESCO_HOSTS,
  TESCO_SELECTORS,
  TescoRouteNotFoundError,
  TescoSelectorDriftError,
  buildListingPageUrl,
  canonicalTescoProductUrl,
  cleanText,
  detectSelectorDrift,
  extractLabelledSection,
  extractTescoProductId,
  isAisleNotFound,
  isAllowedTescoImageUrl,
  normalizeLocationText,
  parseAvailability,
  parseDisplayedRange,
  reconcileProductId,
  redactPostcode,
  resolveNextPageUrl,
  selectStandardPrice,
  selectTileComparisonPriceText,
  selectTileShelfPriceText,
  type TescoErrorCode,
} from "./tescoSelectors";

/**
 * Bumped when extraction changes, so a crawl run records what produced it.
 *
 * 1.1.0 moved every category off the retired `/shop/en-GB/browse/` route onto
 * `/groceries/en-GB/shop/`, and started refusing to read Tesco's
 * "Not down this aisle" page as a department.
 *
 * 1.2.0 rebuilt listing extraction on the markup a live page actually serves,
 * captured 2026-08-22: no product testids at all, a title that is an `h2`
 * wrapping a bare anchor, an unlabelled shelf price sitting below a Clubcard
 * price, and a result count reading "1 to 27" rather than "1 - 27".
 */
export const TESCO_ADAPTER_VERSION = "1.2.0";

/** Bounds. A crawl that cannot end is worse than one that ends early. */
const MAX_PAGES_PER_CATEGORY = 40;
const MAX_SCROLL_ROUNDS = 30;
const SHORT_TIMEOUT_MS = 2_000;
const READY_TIMEOUT_MS = 30_000;
/**
 * How long to wait for the first listing tile.
 *
 * Shorter than the page-ready wait on purpose: a listing that has rendered
 * nothing after ten seconds is a page worth judging rather than one worth
 * waiting on, and the drift check that follows needs to run to say so.
 */
const TILE_WAIT_MS = 10_000;

export type TescoFulfilmentMode = "delivery" | "collection";

export interface TescoAdapterOptions {
  /** Only used to cap a bounded or diagnostic run. */
  maxProductsPerCategory?: number;
  /**
   * The postcode used to establish a fulfilment location, when the scope needs
   * one. Never logged in full: only its outward area reaches a log line.
   */
  postcode?: string | null;
  fulfilmentMode?: TescoFulfilmentMode;
  /**
   * Extra verification evidence beyond the runner's `expectedStoreText`, for a
   * scope whose confirmation banner reads differently from its display name.
   */
  expectedLocationText?: string | null;
}

/** Why a candidate was dropped, counted rather than guessed at. */
export type TescoRejectionCounts = Record<TescoErrorCode, number>;

/**
 * What one Tesco run saw, in numbers.
 *
 * Diagnostics are not decoration here: a run that writes nothing and a run
 * that read nothing look identical from the outside, and the counts are what
 * separates "this department is empty" from "this selector stopped matching".
 */
export interface TescoDiagnostics {
  tilesSeen: number;
  validProducts: number;
  duplicateTiles: number;
  promotionsObserved: number;
  availableProducts: number;
  unavailableProducts: number;
  /** Extracted but with no availability evidence anywhere; treated as off-shelf. */
  availabilityUnknown: number;
  rejected: TescoRejectionCounts;
}

function emptyRejections(): TescoRejectionCounts {
  return {
    TESCO_SCOPE_UNVERIFIED: 0,
    TESCO_SELECTOR_DRIFT: 0,
    TESCO_ROUTE_NOT_FOUND: 0,
    TESCO_PRODUCT_ID_MISMATCH: 0,
    TESCO_PRODUCT_ID_MISSING: 0,
    TESCO_STANDARD_PRICE_MISSING: 0,
    TESCO_HOST_REJECTED: 0,
    TESCO_ACCESS_CHALLENGE: 0,
  };
}

/** Raised when Tesco served a challenge instead of a page. */
export class TescoAccessChallengeError extends Error {
  readonly code: TescoErrorCode = "TESCO_ACCESS_CHALLENGE";

  constructor(url: string) {
    super(`Tesco served an access challenge rather than a page (${url}).`);
    this.name = "TescoAccessChallengeError";
  }
}

async function textOf(locator: Locator): Promise<string | null> {
  if ((await locator.count()) === 0) return null;

  return cleanText(
    await locator
      .first()
      .textContent()
      .catch(() => null),
  );
}

async function firstText(
  root: Page | Locator,
  selectors: readonly string[],
): Promise<string | null> {
  for (const selector of selectors) {
    const value = await textOf(root.locator(selector));
    if (value) return value;
  }

  return null;
}

/**
 * An attribute, or null when the element is not there.
 *
 * Playwright's `getAttribute` auto-waits for a missing element and only then
 * fails, so calling it directly on an optional field costs the full timeout
 * per tile. A tile with no image is ordinary, not a reason to stall a crawl.
 */
async function attributeOf(locator: Locator, attribute: string): Promise<string | null> {
  if ((await locator.count()) === 0) return null;

  return cleanText(
    await locator
      .first()
      .getAttribute(attribute)
      .catch(() => null),
  );
}

/**
 * The first selector in a preference list that matches anything.
 *
 * A list rather than one selector because the same element is published
 * differently on different Tesco layouts, and a testid that still exists on
 * one page is worth preferring over a structural fallback everywhere.
 */
async function firstLocator(
  root: Page | Locator,
  selectors: readonly string[],
): Promise<Locator | null> {
  for (const selector of selectors) {
    const locator = root.locator(selector);
    if ((await locator.count()) > 0) return locator.first();
  }

  return null;
}

/**
 * Every text a preference list finds, from the first selector that matches.
 *
 * Used where the page publishes no label for the value being read: the caller
 * gets the candidates in document order and a rule decides which one is the
 * price, rather than the selector deciding by position.
 */
async function allTexts(
  root: Page | Locator,
  selectors: readonly string[],
): Promise<string[]> {
  for (const selector of selectors) {
    const locator = root.locator(selector);
    if ((await locator.count()) === 0) continue;

    const texts = (await locator.allTextContents())
      .map((text) => cleanText(text))
      .filter((text): text is string => Boolean(text));

    if (texts.length > 0) return texts;
  }

  return [];
}

async function firstAttribute(
  root: Page | Locator,
  selectors: readonly string[],
  attribute: string,
): Promise<string | null> {
  for (const selector of selectors) {
    const locator = root.locator(selector).first();
    if ((await locator.count()) === 0) continue;

    const value = cleanText(await locator.getAttribute(attribute).catch(() => null));
    if (value) return value;
  }

  return null;
}

export class TescoAdapter implements RetailerCatalogueAdapter {
  readonly adapterKey = "tesco";
  readonly adapterVersion = TESCO_ADAPTER_VERSION;
  readonly allowedHosts = TESCO_HOSTS;

  readonly diagnostics: TescoDiagnostics = {
    tilesSeen: 0,
    validProducts: 0,
    duplicateTiles: 0,
    promotionsObserved: 0,
    availableProducts: 0,
    unavailableProducts: 0,
    availabilityUnknown: 0,
    rejected: emptyRejections(),
  };

  constructor(private readonly options: TescoAdapterOptions = {}) {}

  private reject(code: TescoErrorCode): void {
    this.diagnostics.rejected[code] += 1;
  }

  /**
   * Consent, then the fulfilment location.
   *
   * No sign-in and no imported cookies or local storage. A personal Tesco
   * account would tie a crawl to a real person's data and their prices; a
   * fresh automation session is the only shape of session this adapter has.
   */
  async prepareSession(context: AdapterContext): Promise<void> {
    await this.dismissConsent(context.page);
    await this.assertNotChallenged(context.page);
    await this.selectFulfilmentLocation(context);
  }

  /**
   * Whether the session is demonstrably looking at the configured scope.
   *
   * Evidence in priority order: a scope identifier the page exposes, then the
   * selected-location label, then the fulfilment mode paired with the
   * postcode area. Product rendering is deliberately *not* evidence — every
   * fulfilment scope renders products, so accepting that would verify nothing
   * while looking like it verified something.
   *
   * Anything other than a positive match returns false. Indeterminate is not
   * a lesser yes: the runner refuses to write store-scoped products without a
   * true here, and that refusal is the whole safety property.
   */
  async verifyStoreSelection(context: AdapterContext): Promise<boolean> {
    const expected = cleanText(
      this.options.expectedLocationText ?? context.expectedStoreText,
    );

    if (!expected) {
      context.log(
        "Tesco scope unverified: no expected location text is configured (TESCO_SCOPE_UNVERIFIED).",
      );
      this.reject("TESCO_SCOPE_UNVERIFIED");
      return false;
    }

    try {
      const scopeId = await firstText(context.page, [
        '[data-testid="selected-store-id"]',
        'meta[name="tesco-store-id"]',
      ]);

      if (scopeId && scopeId === context.externalStoreId) {
        context.log(
          `Tesco scope verified by evidence=scope-id for store ${context.externalStoreId}.`,
        );
        return true;
      }

      const label = await firstText(
        context.page,
        TESCO_SELECTORS.selectedLocationLabel,
      );

      if (label && normalizeLocationText(label) === normalizeLocationText(expected)) {
        context.log(
          `Tesco scope verified by evidence=location-label for store ${context.externalStoreId}.`,
        );
        return true;
      }

      const mode = await firstText(context.page, TESCO_SELECTORS.fulfilmentModeLabel);
      const area = redactPostcode(this.options.postcode);

      if (
        this.options.fulfilmentMode &&
        mode &&
        normalizeLocationText(mode) === normalizeLocationText(this.options.fulfilmentMode) &&
        area !== "[redacted]" &&
        label &&
        normalizeLocationText(label).includes(normalizeLocationText(area))
      ) {
        context.log(
          `Tesco scope verified by evidence=fulfilment-mode-and-area (${mode}, ${area}).`,
        );
        return true;
      }

      // A missing label on an anonymous session is not drift: Tesco publishes
      // no fulfilment scope at all until a session is signed in, so there was
      // never anything to read. Saying so is the difference between an
      // operator fixing a selector and an operator learning this is blocked.
      if (!label && (await firstLocator(context.page, TESCO_SELECTORS.signedOutMarker))) {
        context.log(
          `Tesco scope unverified (TESCO_SCOPE_UNVERIFIED): the session is signed out, and an anonymous Tesco session publishes no fulfilment scope for store ${context.externalStoreId}. This adapter does not sign in.`,
        );
        this.reject("TESCO_SCOPE_UNVERIFIED");
        return false;
      }

      // The label is reported normalised rather than raw so a session token or
      // an account name rendered beside it cannot ride along into a log.
      context.log(
        `Tesco scope unverified (TESCO_SCOPE_UNVERIFIED): expected evidence for store ${context.externalStoreId}, found ${label ? "a different location label" : "no location label"}.`,
      );
      this.reject("TESCO_SCOPE_UNVERIFIED");
      return false;
    } catch (error) {
      // An exception is not an inconclusive result to be retried optimistically:
      // it is a session that cannot prove which shop it is reading.
      context.log(
        `Tesco scope verification failed (TESCO_SCOPE_UNVERIFIED): ${error instanceof Error ? error.message : String(error)}`,
      );
      this.reject("TESCO_SCOPE_UNVERIFIED");
      return false;
    }
  }

  /**
   * A curated registry rather than site discovery.
   *
   * Only edible-grocery departments can contribute to a meal plan, and walking
   * the navigation would collect alcohol, pharmacy and homeware alongside them.
   */
  async discoverCategories(): Promise<RetailerCategory[]> {
    return TESCO_CATEGORIES.filter((category) => category.enabled).map(
      ({ key, url, categoryPath, enabled }) => ({ key, url, categoryPath, enabled }),
    );
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
    await this.dismissConsent(context.page);
    await this.assertNotChallenged(context.page);
    await this.assertAisleExists(context.page);
    await this.loadAllTiles(context.page);

    const advertised = parseDisplayedRange(
      await firstText(context.page, TESCO_SELECTORS.resultCount),
    );

    const tiles = context.page.locator(TESCO_SELECTORS.productTile);
    const tileCount = await tiles.count();

    const products: RetailerListingProduct[] = [];
    const seen = new Set<string>();
    let skipped = 0;

    for (let index = 0; index < tileCount; index += 1) {
      this.diagnostics.tilesSeen += 1;

      const tile = tiles.nth(index);
      const product = await this.readTile(tile, context, category);

      if (!product) {
        skipped += 1;
        continue;
      }

      // One product listed twice on a page is one product. The runner also
      // deduplicates across pages; this keeps a single page honest.
      if (seen.has(product.retailerProductId)) {
        this.diagnostics.duplicateTiles += 1;
        continue;
      }

      seen.add(product.retailerProductId);
      products.push(product);
      this.diagnostics.validProducts += 1;
    }

    // A page claiming a catalogue and yielding nothing is a layout change, not
    // an empty department, and it must fail rather than be recorded as an
    // absence that could later retire products.
    const drift = detectSelectorDrift({
      advertisedTotal: advertised?.total ?? null,
      tilesSeen: tileCount,
      validProducts: products.length,
    });

    if (drift) {
      this.reject("TESCO_SELECTOR_DRIFT");
      throw new TescoSelectorDriftError(drift.message, drift);
    }

    const selected = this.options.maxProductsPerCategory
      ? products.slice(0, this.options.maxProductsPerCategory)
      : products;

    return {
      products: selected,
      nextPages: await this.discoverNextPages({ context, category, page, advertised }),
      skipped,
    };
  }

  async extractProduct({
    context,
    listing,
  }: {
    context: AdapterContext;
    listing: RetailerListingProduct;
  }): Promise<NormalizedCatalogueProduct | null> {
    const { page } = context;

    await this.dismissConsent(page);
    await this.assertNotChallenged(page);
    await page
      .waitForSelector(TESCO_SELECTORS.detailReady, { timeout: READY_TIMEOUT_MS })
      .catch(() => undefined);

    const canonical = await firstAttribute(page, ['link[rel="canonical"]'], "href");
    const productUrl =
      canonicalTescoProductUrl(canonical ?? page.url()) ?? listing.productUrl;
    const detailId = extractTescoProductId(productUrl);

    // Identity is never repaired to make a product fit. A detail page that
    // disagrees with the tile that led here means one of them is describing a
    // different product, and there is nothing on the page saying which.
    if (detailId && detailId !== listing.retailerProductId) {
      this.reject("TESCO_PRODUCT_ID_MISMATCH");
      context.log(
        `TESCO_PRODUCT_ID_MISMATCH: listing ${listing.retailerProductId} led to detail ${detailId}.`,
      );
      return null;
    }

    const priceText =
      (await firstText(page, TESCO_SELECTORS.detailPrice)) ?? listing.priceText;
    const promotionText = await firstText(page, TESCO_SELECTORS.detailPromotion);
    const price = selectStandardPrice({ priceText, promotionText });

    if (price.promotionObserved) this.diagnostics.promotionsObserved += 1;

    if (price.error) {
      this.reject("TESCO_STANDARD_PRICE_MISSING");
      context.log(
        `TESCO_STANDARD_PRICE_MISSING: ${listing.retailerProductId} has no unambiguous shelf price.`,
      );
      return null;
    }

    const name = (await firstText(page, TESCO_SELECTORS.detailName)) ?? listing.name;
    if (!name) return null;

    const imageSource =
      (await firstAttribute(page, TESCO_SELECTORS.detailImage, "src")) ??
      listing.imageUrl;

    const available = await this.readDetailAvailability(page, listing);

    if (available) this.diagnostics.availableProducts += 1;
    else this.diagnostics.unavailableProducts += 1;

    const sections = await this.readLabelledSections(page);

    return {
      retailerProductId: listing.retailerProductId,
      name,
      brand: (await firstText(page, TESCO_SELECTORS.detailBrand)) ?? listing.brand,
      description: await firstText(page, TESCO_SELECTORS.detailDescription),
      categoryPaths: listing.categoryPaths,
      priceMinor: price.priceMinor as number,
      packageSizeRaw:
        (await firstText(page, TESCO_SELECTORS.detailPackageSize)) ??
        listing.packageSizeRaw,
      comparisonPriceRaw:
        (await firstText(page, TESCO_SELECTORS.detailComparisonPrice)) ??
        listing.comparisonPriceRaw,
      ingredientsRaw: sections.ingredientsRaw,
      allergenAdviceRaw: sections.allergenAdviceRaw,
      dietaryInformationRaw: sections.dietaryInformationRaw,
      // Stored as data and never navigated to, so the image host is validated
      // by its own rule rather than by the navigation allowlist.
      imageUrl: isAllowedTescoImageUrl(imageSource) ? imageSource : null,
      productUrl,
      available,
    };
  }

  /** One listing tile, or nothing plus a counted reason. */
  private async readTile(
    tile: Locator,
    context: AdapterContext,
    category: RetailerCategory,
  ): Promise<RetailerListingProduct | null> {
    const tileId = cleanText(await tile.getAttribute("data-testid").catch(() => null));
    const link = await firstLocator(tile, TESCO_SELECTORS.tileTitleLink);
    const href = link ? await attributeOf(link, "href") : null;

    const productUrl = href
      ? canonicalTescoProductUrl(href, context.page.url())
      : null;

    if (href && !productUrl) {
      // Either off the allowed host or not a product path. Both are reasons to
      // drop a link rather than follow it.
      this.reject("TESCO_HOST_REJECTED");
      return null;
    }

    const identity = reconcileProductId({
      tileId: tileId && /^\d+$/.test(tileId) ? tileId : null,
      urlId: productUrl ? extractTescoProductId(productUrl) : null,
    });

    if (identity.error || !productUrl) {
      this.reject(identity.error ?? "TESCO_PRODUCT_ID_MISSING");
      return null;
    }

    // The price is read from candidates rather than from a labelled element:
    // a current tile labels none, so the rule that picks one has to be
    // explicit about what a price looks like.
    const priceCandidates = await allTexts(tile, TESCO_SELECTORS.tilePrice);
    const priceText = selectTileShelfPriceText(priceCandidates);
    const promotionText = await firstText(tile, TESCO_SELECTORS.tilePromotion);
    const price = selectStandardPrice({ priceText, promotionText });

    if (price.promotionObserved) this.diagnostics.promotionsObserved += 1;

    if (price.error) {
      this.reject("TESCO_STANDARD_PRICE_MISSING");
      return null;
    }

    const image = tile.locator("img").first();
    const imageSource =
      (await attributeOf(image, "src")) ?? (await attributeOf(image, "data-src"));

    return {
      retailerProductId: identity.productId as string,
      productUrl,
      name: link ? await textOf(link) : null,
      brand: null,
      packageSizeRaw: await firstText(tile, TESCO_SELECTORS.tilePackageSize),
      comparisonPriceRaw: selectTileComparisonPriceText(
        await allTexts(tile, TESCO_SELECTORS.tileComparisonPrice),
      ),
      priceText,
      imageUrl: isAllowedTescoImageUrl(imageSource) ? imageSource : null,
      available: parseAvailability({
        attribute: await attributeOf(tile, TESCO_SELECTORS.tileAvailabilityAttribute),
        text: await firstText(tile, TESCO_SELECTORS.tileAvailabilityText),
      }),
      categoryPaths: [category.categoryPath],
    };
  }

  /**
   * Availability, from the detail page first and the tile second.
   *
   * With no evidence on either, the product is recorded as off the shelf. That
   * is the only direction that fails safely: a product wrongly marked
   * unavailable is missing from a plan, while one wrongly marked available is
   * a shopping-list item that is not in the shop. The count is reported so a
   * catalogue going quiet is visible rather than mysterious.
   */
  private async readDetailAvailability(
    page: Page,
    listing: RetailerListingProduct,
  ): Promise<boolean> {
    const fromDetail = parseAvailability({
      attribute: await firstAttribute(
        page,
        ['[data-testid="product-details"]'],
        TESCO_SELECTORS.tileAvailabilityAttribute,
      ),
      text: await firstText(page, TESCO_SELECTORS.detailAvailabilityText),
    });

    if (fromDetail !== null) return fromDetail;
    if (listing.available !== null && listing.available !== undefined) {
      return listing.available;
    }

    const addToBasket = page.locator(TESCO_SELECTORS.detailAddToBasket[0]).first();
    if ((await addToBasket.count()) > 0) {
      return (await addToBasket.isDisabled().catch(() => true)) !== true;
    }

    this.diagnostics.availabilityUnknown += 1;
    return false;
  }

  /**
   * Ingredients, allergy advice and dietary information.
   *
   * Two layouts, both real: labelled containers, and headings followed by
   * loose peer content. The container path is tried first because it has an
   * unambiguous boundary; the text path is bounded by the next known heading,
   * because storage or preparation copy inside an allergen field is exactly
   * the mistake a user with an allergy cannot catch.
   */
  private async readLabelledSections(page: Page): Promise<{
    ingredientsRaw: string | null;
    allergenAdviceRaw: string | null;
    dietaryInformationRaw: string | null;
  }> {
    const fromContainers = {
      ingredientsRaw: await firstText(page, TESCO_SELECTORS.detailIngredients),
      allergenAdviceRaw: await firstText(page, TESCO_SELECTORS.detailAllergy),
      dietaryInformationRaw: await firstText(page, TESCO_SELECTORS.detailDietary),
    };

    const pageText =
      (await page
        .locator("main")
        .innerText()
        .catch(() => null)) ?? "";

    return {
      ingredientsRaw:
        stripHeading(fromContainers.ingredientsRaw, "ingredients") ??
        extractLabelledSection(pageText, ["ingredients"], TESCO_DETAIL_STOP_LABELS),
      allergenAdviceRaw:
        stripHeading(fromContainers.allergenAdviceRaw, "allergy information") ??
        extractLabelledSection(
          pageText,
          ["allergy information", "allergy advice", "allergens"],
          TESCO_DETAIL_STOP_LABELS,
        ),
      dietaryInformationRaw:
        stripHeading(fromContainers.dietaryInformationRaw, "dietary information") ??
        extractLabelledSection(
          pageText,
          ["dietary information"],
          TESCO_DETAIL_STOP_LABELS,
        ),
    };
  }

  /**
   * The rest of the category, enqueued from the first page only.
   *
   * The runner numbers the pages an adapter discloses in one go, so paging has
   * to be decided here rather than chained page by page. The advertised total
   * and the page size give the page count directly; a next-page link is the
   * fallback when the listing advertises no total at all.
   */
  private async discoverNextPages({
    context,
    category,
    page,
    advertised,
  }: {
    context: AdapterContext;
    category: RetailerCategory;
    page: number;
    advertised: ReturnType<typeof parseDisplayedRange>;
  }): Promise<string[]> {
    // A capped run is not trying to see the whole category, and a later page
    // has nothing left to disclose.
    if (page !== 1 || this.options.maxProductsPerCategory) return [];

    if (advertised && advertised.total > advertised.to) {
      const pageSize = Math.max(1, advertised.to - advertised.from + 1);
      const pages = Math.min(
        Math.ceil(advertised.total / pageSize),
        MAX_PAGES_PER_CATEGORY,
      );

      const urls: string[] = [];
      for (let next = 2; next <= pages; next += 1) {
        const url = buildListingPageUrl(category.url, next);
        if (url) urls.push(url);
      }

      return urls;
    }

    const href = await firstAttribute(context.page, TESCO_SELECTORS.nextPage, "href");
    const nextUrl = resolveNextPageUrl(href, context.page.url());

    return nextUrl ? [nextUrl] : [];
  }

  /**
   * Tesco renders listing tiles lazily. Stopping after three rounds with no
   * new tiles distinguishes "the list has ended" from "the next batch has not
   * arrived yet"; a fixed number of scrolls would do neither reliably.
   */
  private async loadAllTiles(page: Page): Promise<void> {
    await page
      .waitForSelector(TESCO_SELECTORS.productTile, { timeout: TILE_WAIT_MS })
      .catch(() => undefined);

    let previous = -1;
    let stable = 0;

    for (let round = 0; round < MAX_SCROLL_ROUNDS; round += 1) {
      const count = await page.locator(TESCO_SELECTORS.productTile).count();

      stable = count === previous ? stable + 1 : 0;
      previous = count;

      const cap = this.options.maxProductsPerCategory;
      if ((cap && count >= cap) || stable >= 3) break;

      await page.mouse.wheel(0, 6_000);
      await page.waitForTimeout(500);
    }

    await page.keyboard.press("Home").catch(() => undefined);
  }

  /** Tesco re-shows consent across sections, so this runs before every read. */
  private async dismissConsent(page: Page): Promise<void> {
    for (const selector of TESCO_SELECTORS.consentAccept) {
      const button = page.locator(selector).first();
      if ((await button.isVisible().catch(() => false)) !== true) continue;

      await button.click({ timeout: SHORT_TIMEOUT_MS }).catch(() => undefined);
      return;
    }
  }

  /**
   * Establishes the fulfilment location, when one is configured.
   *
   * A blocked or absent control is left alone rather than forced: verification
   * is the gate that decides whether the session is usable, and a session that
   * quietly failed to set its location must fail there rather than be nudged
   * into looking right.
   */
  private async selectFulfilmentLocation(context: AdapterContext): Promise<void> {
    const postcode = cleanText(this.options.postcode);
    if (!postcode) return;

    const { page } = context;
    context.log(
      `Setting Tesco fulfilment location: mode=${this.options.fulfilmentMode ?? "delivery"}, area=${redactPostcode(postcode)}.`,
    );

    for (const selector of TESCO_SELECTORS.locationTrigger) {
      const trigger = page.locator(selector).first();
      if ((await trigger.isVisible().catch(() => false)) !== true) continue;

      await trigger.click({ timeout: SHORT_TIMEOUT_MS }).catch(() => undefined);
      break;
    }

    for (const selector of TESCO_SELECTORS.locationPostcodeInput) {
      const input = page.locator(selector).first();
      if ((await input.isVisible().catch(() => false)) !== true) continue;

      await input.fill(postcode, { timeout: SHORT_TIMEOUT_MS }).catch(() => undefined);

      for (const submitSelector of TESCO_SELECTORS.locationSubmit) {
        const submit = page.locator(submitSelector).first();
        if ((await submit.isVisible().catch(() => false)) !== true) continue;

        await submit.click({ timeout: SHORT_TIMEOUT_MS }).catch(() => undefined);
        break;
      }

      break;
    }

    // Settle, but bounded: an unanswered location dialog must not hold a crawl
    // open indefinitely.
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  }

  /**
   * A retired or mistyped category route is a failure, not an empty aisle.
   *
   * Tesco answers one with an ordinary-looking page headed "Not down this
   * aisle": no error status to notice, no advertised total for the drift check
   * to contradict, and no tiles. Left unguarded it reads as a real department
   * that happens to stock nothing — and an absence is what later retires
   * products from a working catalogue.
   *
   * Checked before any tile work so a dead route costs no scrolling and never
   * contributes to the tile counts an operator reads afterwards.
   */
  private async assertAisleExists(page: Page): Promise<void> {
    for (const selector of TESCO_SELECTORS.aisleNotFound) {
      const marker = page.locator(selector).first();
      if ((await marker.count().catch(() => 0)) === 0) continue;

      this.reject("TESCO_ROUTE_NOT_FOUND");
      throw new TescoRouteNotFoundError(page.url());
    }

    // Tesco has moved this copy between a heading and body text before, so the
    // heading selectors above are backed by the page's own words rather than
    // trusted alone. Bounded to the main region: a footer link named after the
    // 404 must not condemn a page that rendered.
    const heading = await page
      .locator("main")
      .first()
      .innerText()
      .catch(() => null);

    if (isAisleNotFound(heading?.split(/\r?\n/)[0])) {
      this.reject("TESCO_ROUTE_NOT_FOUND");
      throw new TescoRouteNotFoundError(page.url());
    }
  }

  /**
   * A challenge is a crawl failure, never an obstacle to work around.
   *
   * Treating it as anything else would mean building evasion into a crawler,
   * which is neither permitted nor a thing this product needs.
   */
  private async assertNotChallenged(page: Page): Promise<void> {
    for (const selector of TESCO_SELECTORS.accessChallenge) {
      const marker = page.locator(selector).first();
      if ((await marker.count().catch(() => 0)) === 0) continue;

      this.reject("TESCO_ACCESS_CHALLENGE");
      throw new TescoAccessChallengeError(page.url());
    }
  }
}

/**
 * Drops a container's own heading from its text.
 *
 * A labelled container reads as "Ingredients Bananas." because the heading is
 * inside it. Keeping the heading would make every allergen field begin with
 * the word "Allergy".
 */
function stripHeading(value: string | null, heading: string): string | null {
  const text = cleanText(value);
  if (!text) return null;

  const normalized = text.toLowerCase();
  if (!normalized.startsWith(heading.toLowerCase())) return text;

  return cleanText(text.slice(heading.length).replace(/^[:\s]+/, ""));
}

/** The registered instance. A bounded run constructs its own with a cap. */
export const tescoAdapter = new TescoAdapter();
