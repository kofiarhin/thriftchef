/**
 * Everything that knows what an aldi.co.uk page looks like.
 *
 * Kept pure and separate from the Playwright calls so it can be exercised
 * against saved HTML. Selector drift is the failure mode that matters here —
 * a selector that silently stops matching does not throw, it returns nothing,
 * and a crawl "succeeds" with an empty catalogue. Fixtures are how that gets
 * caught before a user does.
 */

export const ALDI_HOSTS = ["aldi.co.uk"] as const;

export const PRODUCT_TILE_SELECTOR = '[data-test="product-tile"]';

/** Tried in order; the first that yields text wins. */
export const ALDI_SELECTORS = {
  tileLink: 'a.product-tile__link[href], a[href*="/product/"]',
  tileName: '[data-test="product-tile__name"]',
  tileBrand: '[data-test="product-tile__brandname"]',
  tilePackageSize: '[data-test="product-tile__unit-of-measurement"]',
  tileComparisonPrice: '[data-test="product-tile__comparison-price"]',
  tilePrice: [
    '[data-test="product-tile__price"]',
    ".base-price--product-tile",
    ".base-price",
  ],
  detailReady:
    "main.product-details-page, .product-details, h1.product-details__title, main h1",
  detailName: [
    "h1.product-details__title",
    '[data-test="product-details__title"]',
    "main h1",
  ],
  detailBrand: [
    ".product-details__brand-name",
    '[data-test="product-details__brand-name"]',
  ],
  detailDescription: [
    '[data-test="product-details__description"]',
    ".product-details__description",
  ],
  detailPackageSize: [
    '[data-test="product-details__unit-of-measurement"]',
    ".product-details__unit-of-measurement",
  ],
  detailComparisonPrice: [
    '[data-test="product-details__comparison-price"]',
    ".product-details__comparison-price",
  ],
  detailPrice: [
    ".base-price--product-details .base-price__regular",
    '[data-test="product-details__price"]',
  ],
  detailImage: [
    ".product-image-carousel img",
    ".product-details img",
    "main img",
  ],
  cookieAccept: [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("Accept cookies")',
    'button:has-text("Allow all")',
    'button[id*="accept" i]',
    'button[aria-label*="accept" i]',
  ],
} as const;

/**
 * Denies geolocation before the page can ask.
 *
 * Aldi prompts for location to pick a store, and an unanswered native prompt
 * blocks the crawl indefinitely. Refusing up front is what keeps store
 * selection an explicit, verifiable step rather than a browser dialog.
 */
export const GEOLOCATION_DENIED_SCRIPT = `
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

export function cleanText(value: string | null | undefined): string | null {
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

/**
 * Aldi's product id is the long numeric suffix of the URL path.
 *
 * Never derived from the product name: two crawls of the same item with
 * different marketing copy must remain one product.
 */
export function extractProductId(url: string): string | null {
  try {
    return new URL(url).pathname.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  } catch {
    return url.match(/-(\d{12,})\/?$/)?.[1] ?? null;
  }
}

export function canonicalizeUrl(value: string, baseUrl?: string): string | null {
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

/**
 * Aldi caps a listing at 30 tiles and exposes the rest through `?page=N`
 * links in its pager. Scrolling alone never reveals them, so the highest
 * advertised page number decides how many extra listing requests to enqueue.
 */
export function extractHighestPageNumber(hrefs: string[]): number {
  return hrefs.reduce((highest, href) => {
    const raw = href.match(/[?&]page=(\d+)/)?.[1];
    const page = raw ? Number.parseInt(raw, 10) : Number.NaN;

    return Number.isInteger(page) && page > highest ? page : highest;
  }, 1);
}

export function buildListingPageUrl(
  categoryUrl: string,
  page: number,
): string | null {
  try {
    const url = new URL(categoryUrl);
    url.searchParams.set("page", String(page));
    return url.toString();
  } catch {
    return null;
  }
}

/** Sections that end an ingredients or allergen block. */
export const DETAIL_STOP_LABELS = [
  "allergy advice",
  "allergen information",
  "allergens",
  "dietary information",
  "storage information",
  "nutrition information",
  "features",
  "you may also like",
] as const;

/**
 * Pulls a labelled block out of the product page's flat text.
 *
 * Aldi renders ingredients and allergy advice as headings followed by loose
 * text rather than as addressable elements, so there is nothing to select.
 * Reading forward from the label until the next known heading is the only
 * available approach — and the twelve-line cap stops a missing stop-label from
 * swallowing the rest of the page.
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

  const normalizedLabels = labels.map((label) => label.toLowerCase());
  const normalizedStopLabels = stopLabels.map((label) => label.toLowerCase());

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index].toLowerCase();
    const matchingLabel = normalizedLabels.find(
      (label) => current === label || current.startsWith(`${label}:`),
    );

    if (!matchingLabel) continue;

    const values: string[] = [];
    const inlineValue = cleanText(
      lines[index].slice(matchingLabel.length).replace(/^:/, ""),
    );
    if (inlineValue) values.push(inlineValue);

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex];
      const normalizedNextLine = nextLine.toLowerCase();

      if (
        normalizedStopLabels.some(
          (label) =>
            normalizedNextLine === label ||
            normalizedNextLine.startsWith(`${label}:`),
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
