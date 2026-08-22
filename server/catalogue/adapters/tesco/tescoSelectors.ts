/**
 * Everything that knows what a www.tesco.com page looks like.
 *
 * Kept pure and free of Playwright so it can be exercised against saved HTML
 * and plain strings. Three failure modes shape the rules here, and each one is
 * silent rather than loud if it is not guarded explicitly:
 *
 *   - a selector that stops matching returns nothing, and a crawl "succeeds"
 *     with an empty catalogue rather than throwing;
 *   - a Clubcard price read as a shelf price understates a shopping list at
 *     the till, where the user cannot correct it;
 *   - a product URL taken from the page rather than validated against an
 *     exact allowlist turns a crawler into a request forgery.
 *
 * Selector policy, in order of preference: stable `data-testid` attributes,
 * accessible roles and labels, element relationships inside a tile, then
 * narrowly scoped text. Generated or minified CSS class names are never a
 * primary selector — they change without notice and carry no meaning.
 */

/**
 * The exact hosts this adapter may navigate to.
 *
 * Exact, not suffix-matched: a suffix rule accepts `www.tesco.com.evil.test`,
 * and a subdomain rule accepts Tesco hosts this adapter has never been tested
 * against.
 */
export const TESCO_HOSTS = ["www.tesco.com"] as const;

/**
 * Hosts that may serve a product image.
 *
 * Deliberately a different list. An image URL is stored as data and never
 * visited, so Tesco's content host belongs here without becoming somewhere
 * the crawler is allowed to navigate.
 */
export const TESCO_IMAGE_HOSTS = [
  "digitalcontent.api.tesco.com",
  "www.tesco.com",
] as const;

/**
 * Product pages, anchored to the numeric id at the end of the path.
 *
 * Two route families, both live. Tesco moved its grocery site under
 * `/groceries/en-GB/` and left `/shop/en-GB/products/` resolving, so a link on
 * a current listing page and a URL stored by an earlier crawl can be the same
 * product wearing different paths. Both are read; only one is written back.
 */
const PRODUCT_PATH = /^\/(?:groceries|shop)\/en-GB\/products\/(\d+)\/?$/;

/**
 * The route a product URL is stored as.
 *
 * `/groceries/` rather than `/shop/`: the legacy family is the one Tesco is
 * retiring, and it already took the category pages with it. Canonicalising
 * onto it would schedule this same outage for every stored product URL.
 */
const CANONICAL_PRODUCT_PREFIX = "/groceries/en-GB/products/";

/**
 * Curated category pages. Nothing outside this prefix is a listing.
 *
 * `/shop/en-GB/browse/...` was the shape this adapter shipped with and is now
 * dead for grocery departments — Tesco answers those with a "Not down this
 * aisle" page. It is deliberately *not* accepted here: an allowlist that still
 * admits the retired route lets a crawl navigate to a 404 and read its
 * emptiness as a result.
 */
const LISTING_PATH_PREFIX = "/groceries/en-GB/shop/";

/**
 * Stable codes for the failures worth acting on, so an operator reading a
 * crawl run can tell a layout change from a blocked session from a bad price.
 */
export type TescoErrorCode =
  | "TESCO_SCOPE_UNVERIFIED"
  | "TESCO_SELECTOR_DRIFT"
  | "TESCO_ROUTE_NOT_FOUND"
  | "TESCO_PRODUCT_ID_MISMATCH"
  | "TESCO_PRODUCT_ID_MISSING"
  | "TESCO_STANDARD_PRICE_MISSING"
  | "TESCO_HOST_REJECTED"
  | "TESCO_ACCESS_CHALLENGE";

/**
 * Raised when Tesco served its category 404 instead of a listing.
 *
 * Distinct from drift, because the remedy is different: drift means the page
 * is right and the selectors are wrong, this means the URL is wrong and no
 * selector would have helped. Distinct from an empty department, because that
 * page advertises no total for the drift check to contradict — it would pass
 * as a real department holding nothing, and an absence is what retires
 * products.
 */
export class TescoRouteNotFoundError extends Error {
  readonly code: TescoErrorCode = "TESCO_ROUTE_NOT_FOUND";

  constructor(readonly url: string) {
    super(
      `Tesco served its "Not down this aisle" page rather than a listing (${url}). ` +
        "The category route is retired or the slug is wrong.",
    );
    this.name = "TescoRouteNotFoundError";
  }
}

/**
 * Raised when a page advertises a catalogue but yields no readable products.
 *
 * Thrown rather than returned: an empty result that looks like a successful
 * page is exactly the outcome that must never be recorded as "this shop has
 * nothing in it".
 */
export class TescoSelectorDriftError extends Error {
  readonly code: TescoErrorCode = "TESCO_SELECTOR_DRIFT";

  constructor(
    message: string,
    readonly evidence: {
      advertisedTotal: number | null;
      tilesSeen: number;
      validProducts: number;
    },
  ) {
    super(message);
    this.name = "TescoSelectorDriftError";
  }
}

/**
 * The DOM contract, in one place so drift is a diff in this file.
 *
 * Every primary entry is a `data-testid` or an accessible role. The text
 * alternatives exist because a consent dialog and a location control are the
 * two things a site changes most often, and being unable to dismiss a cookie
 * banner stops a crawl before it starts.
 */
export const TESCO_SELECTORS = {
  /**
   * A listing tile: a list item carrying a product id and holding a link to
   * that product.
   *
   * Both halves are load-bearing. The id alone is not enough — a captured page
   * also carries `li[data-testid="more-menu-item"]`, and counting navigation
   * as a tile inflates the denominator the drift check judges an extraction
   * rate against. The link alone is not enough either: the id on the tile is
   * what the link is reconciled against.
   */
  productTile: 'li[data-testid]:has(a[href*="/products/"])',
  /**
   * The link the product id is read from.
   *
   * The testid is kept first for pages that still publish it, but a page
   * captured 2026-08-22 publishes none: the title is an `h2` wrapping a bare
   * anchor. The heading form is preferred over any product link because it is
   * the one carrying the product name; the plain link is the last resort, and
   * only ever supplies an id.
   */
  tileTitleLink: [
    '[data-testid="product-tile--title"]',
    'h2 a[href*="/products/"]',
    'a[href*="/products/"]',
  ],
  /**
   * Candidates for the shelf price, promotion subtrees excluded in the
   * selector itself.
   *
   * A current tile labels no price at all: it is an unlabelled `<p>` sitting
   * after a Clubcard price, a star rating and a comparison price. Excluding
   * `a[href*="/promotions/"]` here rather than filtering by wording afterwards
   * is what stops a Clubcard price being read as a shelf price on the day
   * Tesco renders one without the words "Clubcard Price" beside it.
   */
  tilePrice: [
    '[data-testid="product-tile--price"]',
    '[data-testid="price-value"]',
    'p:not(a[href*="/promotions/"] p)',
  ],
  tilePromotion: [
    '[data-testid="product-tile--promotion"]',
    '[data-testid="promotion-message"]',
    'a[href*="/promotions/"]',
  ],
  tilePackageSize: ['[data-testid="product-tile--package-size"]'],
  tileComparisonPrice: [
    '[data-testid="product-tile--price-per-quantity-weight"]',
    'p:not(a[href*="/promotions/"] p)',
  ],
  tileAvailabilityText: ['[data-testid="product-tile--availability"]'],
  /** Availability published as an attribute on the tile itself. */
  tileAvailabilityAttribute: "data-auto-available",
  resultCount: [
    '[data-testid="pagination-result-count"]',
    '[data-testid="result-count"]',
  ],
  nextPage: ['a[data-testid="pagination-next"]', 'a[rel="next"]'],

  detailReady: '[data-testid="product-details"], main h1',
  detailName: ['[data-testid="product-details--title"]', "main h1"],
  detailBrand: ['[data-testid="product-details--brand"]'],
  detailPrice: [
    '[data-testid="product-details--price"]',
    '[data-testid="price-value"]',
  ],
  detailPromotion: ['[data-testid="product-details--promotion"]'],
  detailPackageSize: ['[data-testid="product-details--package-size"]'],
  detailComparisonPrice: [
    '[data-testid="product-details--price-per-quantity-weight"]',
  ],
  detailDescription: ['[data-testid="product-details--description"]'],
  detailIngredients: ['[data-testid="product-details--ingredients"]'],
  detailAllergy: ['[data-testid="product-details--allergy-information"]'],
  detailDietary: ['[data-testid="product-details--dietary-information"]'],
  detailImage: ['[data-testid="product-details--image"]', "main img"],
  detailAvailabilityText: ['[data-testid="product-details--availability"]'],
  detailAddToBasket: ['[data-testid="add-to-basket-button"]'],

  consentAccept: [
    '[data-testid="accept-all-cookies-button"]',
    'button:has-text("Accept all cookies")',
    'button:has-text("Accept all")',
  ],
  locationTrigger: [
    '[data-testid="location-picker-trigger"]',
    'button[aria-label*="delivery" i]',
    'button[aria-label*="location" i]',
  ],
  locationPostcodeInput: [
    '[data-testid="location-postcode-input"]',
    'input[name*="postcode" i]',
    'input[aria-label*="postcode" i]',
  ],
  locationSubmit: [
    '[data-testid="location-postcode-submit"]',
    'button[type="submit"]',
  ],
  selectedLocationLabel: [
    '[data-testid="selected-location-label"]',
    '[data-testid="location-summary"]',
  ],
  fulfilmentModeLabel: ['[data-testid="fulfilment-mode-label"]'],
  /**
   * Evidence that the session is anonymous.
   *
   * Not a way to verify anything — it is the opposite. A session Tesco has not
   * signed in has no fulfilment scope to report, so a missing location label
   * means "there is no scope here" rather than "the selector drifted". The two
   * need different work from an operator, and only this tells them apart.
   */
  signedOutMarker: [
    '[data-testid="sign-in"]',
    'a[href*="/account/en-GB/login"]',
  ],
  /**
   * Tesco's category 404, which arrives as an ordinary-looking page.
   *
   * Text rather than a testid because Tesco publishes none for it, and this
   * is exactly the "narrowly scoped text" tier the selector policy allows as
   * a last resort. The wording is confirmed by what a retired
   * `/shop/en-GB/browse/` category returns today.
   */
  aisleNotFound: [
    'h1:has-text("Not down this aisle")',
    'h2:has-text("Not down this aisle")',
  ],
  /** Evidence that the session was challenged rather than served. */
  accessChallenge: [
    "#challenge-running",
    '[data-testid="access-denied"]',
    'h1:has-text("Access Denied")',
  ],
} as const;

/** Headings that end an ingredients, allergy or dietary block. */
export const TESCO_DETAIL_STOP_LABELS = [
  "allergy information",
  "allergy advice",
  "allergens",
  "dietary information",
  "storage",
  "storage information",
  "preparation and usage",
  "preparation",
  "manufacturer",
  "net contents",
  "nutrition",
  "nutrition information",
  "number of uses",
  "return to",
  "reviews",
  "product description",
  "safety warning",
  "brand details",
  "using product information",
] as const;

/** Lines kept after a label before the block is cut off regardless. */
const MAX_SECTION_LINES = 8;

/**
 * Below this share of readable tiles, a page is treated as drifted rather than
 * as a shop that stopped stocking things.
 *
 * Not zero: an occasional unreadable tile — a sponsored slot, a bundle, a
 * placeholder — is normal. Half of them failing is a layout change.
 */
const MIN_EXTRACTION_RATE = 0.5;

export function cleanText(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

/**
 * "£1.30" → 130, by string arithmetic.
 *
 * Never `Number(pounds) * 100`: 8.29 is 8.289999... in binary floating point,
 * and a price that is right most of the time is a shopping list that does not
 * add up some of the time.
 *
 * Strict about the whole string, not a search within it. A price found inside
 * arbitrary text is how "Clubcard Price £3.50" becomes a shelf price.
 */
export function parseGbpMinor(value: string | null | undefined): number | null {
  const text = cleanText(value);
  if (!text) return null;

  const match = /^£?\s*(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) return null;

  const pounds = Number.parseInt(match[1].replace(/,/g, ""), 10);
  if (!Number.isSafeInteger(pounds)) return null;

  // One decimal place is tenths of a pound: "£1.5" is £1.50, not £1.05.
  const minorText = (match[2] ?? "0").padEnd(2, "0");
  const minor = Number.parseInt(minorText, 10);

  return pounds * 100 + minor;
}

/** Wording that makes a price conditional on something the user may not have. */
export function isConditionalPriceText(value: string | null | undefined): boolean {
  const text = cleanText(value)?.toLowerCase();
  if (!text) return false;

  return /clubcard|meal deal|multibuy|coupon|any \d|\d for £|save \d|was £|offer/.test(
    text,
  );
}

/**
 * A price and nothing else: the currency symbol is required.
 *
 * Without the symbol "4.4" is a price, and a live tile carries "4.4 (105)" as
 * its star rating a few elements above the shelf price. A butter priced at its
 * review score is exactly the silent kind of wrong this file exists to stop.
 */
const SHELF_PRICE_TEXT = /^£\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/;

/**
 * The shelf price among a tile's unlabelled paragraphs.
 *
 * Tesco publishes no price testid on a listing tile any more: the price is a
 * bare `<p>`, and the paragraphs around it hold a star rating, a comparison
 * price and — above it in the DOM — a Clubcard price. Candidates are supplied
 * in document order with promotion subtrees already excluded by the selector,
 * so this rule is the second guard rather than the only one: anything that is
 * not exactly a price, or that carries conditional wording, is passed over
 * rather than repaired.
 */
export function selectTileShelfPriceText(
  candidates: readonly (string | null | undefined)[],
): string | null {
  for (const candidate of candidates) {
    const text = cleanText(candidate);
    if (!text || isConditionalPriceText(text)) continue;
    if (SHELF_PRICE_TEXT.test(text)) return text;
  }

  return null;
}

/**
 * A comparison price: a price, a slash, a unit, and nothing else.
 *
 * Unparenthesised on purpose. The Clubcard block renders its own comparison
 * price as "(£6.88/kg)", and the brackets are the one thing on the tile that
 * tells the two apart without reading the DOM again.
 */
const COMPARISON_PRICE_TEXT = /^£\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\s*\/\s*[a-z0-9]+$/i;

/**
 * The comparison price among a tile's unlabelled paragraphs.
 *
 * Reported for transparency rather than used for budgeting, so an unreadable
 * one is left null instead of being reconstructed from the price and the pack
 * size — a computed figure would look like something the retailer published.
 */
export function selectTileComparisonPriceText(
  candidates: readonly (string | null | undefined)[],
): string | null {
  for (const candidate of candidates) {
    const text = cleanText(candidate);
    if (text && COMPARISON_PRICE_TEXT.test(text)) return text;
  }

  return null;
}

export interface StandardPriceResult {
  priceMinor: number | null;
  /** Recorded for diagnostics only; it never becomes the basket price. */
  promotionObserved: boolean;
  error: Extract<TescoErrorCode, "TESCO_STANDARD_PRICE_MISSING"> | null;
}

/**
 * The normal shelf price, and nothing else.
 *
 * A Clubcard, multibuy or coupon price is a price for a different shopper.
 * Budgeting with it produces a plan the user cannot actually buy for the
 * quoted total, so a product with no unambiguous shelf price is rejected
 * rather than priced optimistically.
 */
export function selectStandardPrice(input: {
  priceText: string | null | undefined;
  promotionText: string | null | undefined;
}): StandardPriceResult {
  const promotionObserved = isConditionalPriceText(input.promotionText);
  const priceMinor = isConditionalPriceText(input.priceText)
    ? null
    : parseGbpMinor(input.priceText);

  if (priceMinor === null) {
    return {
      priceMinor: null,
      promotionObserved,
      error: "TESCO_STANDARD_PRICE_MISSING",
    };
  }

  return { priceMinor, promotionObserved, error: null };
}

/**
 * The numeric Tesco product id, anchored to the product path.
 *
 * Never derived from the product name: two crawls of one item with different
 * marketing copy must remain one product.
 */
export function extractTescoProductId(
  value: string | null | undefined,
): string | null {
  const text = cleanText(value);
  if (!text) return null;

  let parsed: URL;
  try {
    // A base is supplied so a relative href parses; the host is not trusted
    // here, only the path shape. Host validation is a separate rule.
    parsed = new URL(text, "https://www.tesco.com");
  } catch {
    return null;
  }

  return PRODUCT_PATH.exec(parsed.pathname)?.[1] ?? null;
}

export interface ProductIdentity {
  productId: string | null;
  error: Extract<
    TescoErrorCode,
    "TESCO_PRODUCT_ID_MISMATCH" | "TESCO_PRODUCT_ID_MISSING"
  > | null;
}

/**
 * Reconciles the id on a tile with the id in its link.
 *
 * A disagreement is never repaired by preferring one side: doing so would
 * silently price one product as another, and there is no evidence on the page
 * that says which side is right.
 */
export function reconcileProductId(input: {
  tileId: string | null;
  urlId: string | null;
}): ProductIdentity {
  const tileId = cleanText(input.tileId);
  const urlId = cleanText(input.urlId);

  if (tileId && urlId && tileId !== urlId) {
    return { productId: null, error: "TESCO_PRODUCT_ID_MISMATCH" };
  }

  const productId = urlId ?? tileId;
  if (!productId || !/^\d+$/.test(productId)) {
    return { productId: null, error: "TESCO_PRODUCT_ID_MISSING" };
  }

  return { productId, error: null };
}

function parseStrictUrl(
  value: string | null | undefined,
  baseUrl?: string,
): URL | null {
  const text = cleanText(value);
  if (!text) return null;

  let parsed: URL;
  try {
    parsed = new URL(text, baseUrl);
  } catch {
    return null;
  }

  // Credentials and a non-standard port are how a URL that reads as Tesco
  // reaches somewhere else entirely.
  if (parsed.protocol !== "https:") return null;
  if (parsed.username || parsed.password) return null;
  if (parsed.port) return null;

  return parsed;
}

function isAllowedHost(url: URL, hosts: readonly string[]): boolean {
  return hosts.includes(url.hostname.toLowerCase());
}

/**
 * The canonical product URL, or nothing.
 *
 * Query strings are session and tracking noise, and a fragment is a scroll
 * position; the product is the path. A URL that is not a product page on the
 * one allowed host is rejected rather than rewritten.
 */
export function canonicalTescoProductUrl(
  value: string | null | undefined,
  baseUrl?: string,
): string | null {
  const parsed = parseStrictUrl(value, baseUrl);
  if (!parsed || !isAllowedHost(parsed, TESCO_HOSTS)) return null;

  const productId = PRODUCT_PATH.exec(parsed.pathname)?.[1];
  if (!productId) return null;

  return `https://${parsed.hostname.toLowerCase()}${CANONICAL_PRODUCT_PREFIX}${productId}`;
}

/** A curated category page on the allowed host, and nowhere else. */
export function isAllowedTescoListingUrl(value: string | null | undefined): boolean {
  const parsed = parseStrictUrl(value);

  return Boolean(
    parsed &&
      isAllowedHost(parsed, TESCO_HOSTS) &&
      parsed.pathname.startsWith(LISTING_PATH_PREFIX),
  );
}

/** An image host is validated separately and is never navigated to. */
export function isAllowedTescoImageUrl(value: string | null | undefined): boolean {
  const parsed = parseStrictUrl(value);

  return Boolean(parsed && isAllowedHost(parsed, TESCO_IMAGE_HOSTS));
}

export interface DisplayedRange {
  from: number;
  to: number;
  total: number;
}

/**
 * "Showing 1 - 24 of 96 items".
 *
 * The total is what makes an empty extraction obviously wrong, so it is read
 * even though paging does not strictly need it.
 */
export function parseDisplayedRange(
  value: string | null | undefined,
): DisplayedRange | null {
  const text = cleanText(value);
  if (!text) return null;

  // "1 to 27" and "1 - 27" are the same claim. Tesco moved from the dash to
  // the word, and reading neither returns null — which silently switches the
  // drift guard off, because a page that advertises nothing cannot contradict
  // an empty extraction.
  const match =
    /(\d[\d,]*)\s*(?:[-–—]|to)\s*(\d[\d,]*)\s+of\s+(\d[\d,]*)/i.exec(text);
  if (!match) return null;

  const [from, to, total] = match
    .slice(1, 4)
    .map((part) => Number.parseInt(part.replace(/,/g, ""), 10));

  return Number.isInteger(from) && Number.isInteger(to) && Number.isInteger(total)
    ? { from, to, total }
    : null;
}

/** The same category, a page further on. Existing parameters are preserved. */
export function buildListingPageUrl(
  categoryUrl: string,
  page: number,
): string | null {
  if (!isAllowedTescoListingUrl(categoryUrl)) return null;

  const url = new URL(categoryUrl);
  url.hash = "";
  url.searchParams.set("page", String(page));

  return url.toString();
}

/**
 * A next-page link discovered on the page, validated before it is followed.
 *
 * Links on a retailer page are untrusted input: one pointing off the listing
 * path or off the host is dropped rather than enqueued.
 */
export function resolveNextPageUrl(
  href: string | null | undefined,
  baseUrl: string,
): string | null {
  const parsed = parseStrictUrl(href, baseUrl);
  if (!parsed) return null;

  parsed.hash = "";
  const candidate = parsed.toString();

  return isAllowedTescoListingUrl(candidate) ? candidate : null;
}

export interface DriftEvidence {
  advertisedTotal: number | null;
  tilesSeen: number;
  validProducts: number;
}

export interface DriftVerdict extends DriftEvidence {
  code: Extract<TescoErrorCode, "TESCO_SELECTOR_DRIFT">;
  message: string;
}

/**
 * Whether a listing page's emptiness is a layout change rather than an empty
 * shelf.
 *
 * A page that says it holds 96 products and yields none has not discovered a
 * closed department. Treating that as mass unavailability is how a working
 * catalogue disappears, so it is reported as drift and the run loses the right
 * to retire anything.
 */
export function detectSelectorDrift(evidence: DriftEvidence): DriftVerdict | null {
  const { advertisedTotal, tilesSeen, validProducts } = evidence;

  // A page that advertises nothing may legitimately be empty; there is no
  // claim to contradict.
  if (advertisedTotal === null || advertisedTotal <= 0) return null;

  if (validProducts === 0) {
    return {
      ...evidence,
      code: "TESCO_SELECTOR_DRIFT",
      message: `The listing advertises ${advertisedTotal} products but no tile could be read.`,
    };
  }

  const expected = tilesSeen > 0 ? Math.min(tilesSeen, advertisedTotal) : advertisedTotal;
  if (expected > 0 && validProducts / expected < MIN_EXTRACTION_RATE) {
    return {
      ...evidence,
      code: "TESCO_SELECTOR_DRIFT",
      message: `Only ${validProducts} of ${expected} tiles could be read; the extraction rate has fallen materially.`,
    };
  }

  return null;
}

/**
 * Whether a page is Tesco's "Not down this aisle" category 404.
 *
 * Matched on the exact phrase rather than loosely: "down the aisle" is a real
 * Tesco shelf name, and a substring rule would read a legitimate wedding-cake
 * department as a dead route. Whitespace and case vary between the heading and
 * the body copy, so both are normalised first.
 */
export function isAisleNotFound(value: string | null | undefined): boolean {
  const text = cleanText(value)?.toLowerCase();

  return Boolean(text && /\bnot down this aisle\b/.test(text));
}

/**
 * Availability, or an admission that the page did not say.
 *
 * `null` rather than `true` when there is no evidence. Assuming a product is
 * on the shelf because nothing said otherwise is how an out-of-stock item
 * reaches a shopping list.
 */
export function parseAvailability(input: {
  attribute: string | null | undefined;
  text: string | null | undefined;
}): boolean | null {
  const attribute = cleanText(input.attribute)?.toLowerCase();
  if (attribute === "true") return true;
  if (attribute === "false") return false;

  const text = cleanText(input.text)?.toLowerCase();
  if (!text) return null;

  if (/not available|out of stock|currently unavailable|sold out/.test(text)) {
    return false;
  }

  return null;
}

/**
 * Pulls one labelled block out of a product page's flat text.
 *
 * Used for the sibling-heading layout, where ingredients and allergy advice
 * are headings followed by loose peer content with nothing to select. Reading
 * forward until the next known heading is the only available approach, and the
 * line cap stops a missing stop-label from swallowing the rest of the page
 * into a food-safety field.
 */
export function extractLabelledSection(
  pageText: string,
  labels: string[],
  stopLabels: readonly string[],
): string | null {
  const lines = pageText
    .split(/\r?\n/)
    .map((line) => cleanText(line))
    .filter((line): line is string => Boolean(line));

  const wanted = labels.map((label) => label.toLowerCase());
  const stops = stopLabels.map((label) => label.toLowerCase());

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index].toLowerCase();
    const label = wanted.find(
      (candidate) => current === candidate || current.startsWith(`${candidate}:`),
    );

    if (!label) continue;

    const values: string[] = [];
    const inline = cleanText(lines[index].slice(label.length).replace(/^:/, ""));
    if (inline) values.push(inline);

    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next];
      const normalized = line.toLowerCase();

      if (
        stops.some((stop) => normalized === stop || normalized.startsWith(`${stop}:`))
      ) {
        break;
      }

      values.push(line);
      if (values.length >= MAX_SECTION_LINES) break;
    }

    return cleanText(values.join(" "));
  }

  return null;
}

/**
 * A postcode, reduced to the outward area before it reaches a log.
 *
 * A full UK postcode identifies a household. The outward area is enough to
 * tell which fulfilment scope a session established and is not an address.
 */
export function redactPostcode(value: string | null | undefined): string {
  const text = cleanText(value)?.toUpperCase().replace(/\s+/g, "");
  if (!text) return "[redacted]";

  const outward = /^([A-Z]{1,2}[0-9][A-Z0-9]?)(?:[0-9][A-Z]{2})?$/.exec(text)?.[1];

  return outward ?? "[redacted]";
}

/**
 * Compares a location label the page shows with the one the scope expects.
 *
 * Case and spacing differ between the picker and the confirmation banner, so
 * both sides are normalised before they are compared. Nothing looser: a
 * partial match would let a neighbouring branch verify as the configured one.
 */
export function normalizeLocationText(value: string | null | undefined): string {
  return cleanText(value)?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}
