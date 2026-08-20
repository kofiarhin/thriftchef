/**
 * Validation every adapter's output passes through before it can be persisted.
 *
 * Retailer pages are untrusted input. A selector that silently starts matching
 * the wrong element does not throw — it returns a plausible-looking string, and
 * without this the catalogue quietly fills with products named "Add to basket"
 * priced at zero. Everything here is a rule about what a *usable* catalogue
 * record is, checked once, in one place, for every retailer.
 */

import type {
  NormalizationIssue,
  NormalizationResult,
  NormalizedCatalogueProduct,
} from "../contracts/normalizedCatalogueProduct";

/** Long enough for any real product name, short enough to bound storage. */
const MAX_NAME_LENGTH = 200;
const MAX_TEXT_LENGTH = 4_000;

/** £500 for one grocery item is a parse error, not a product. */
const MAX_PRICE_MINOR = 50_000;

export function cleanText(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned.slice(0, MAX_TEXT_LENGTH) : null;
}

/**
 * "£3.49", "349p", "3.49" → 349.
 *
 * Returns null rather than a guess when the text is not a price. A crawler
 * that treats an unparseable price as zero puts free food in the catalogue and
 * a plan that cannot be shopped.
 */
export function parsePriceMinor(value: string | null | undefined): number | null {
  const text = cleanText(value);
  if (!text) return null;

  const pence = /^(\d+)\s*p$/i.exec(text.replace(/\s/g, ""));
  if (pence) {
    const parsed = Number.parseInt(pence[1], 10);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }

  const pounds = /(\d+(?:\.\d{1,2})?)/.exec(text.replace(/[£,\s]/g, ""));
  if (!pounds) return null;

  const parsed = Math.round(Number.parseFloat(pounds[1]) * 100);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

/** Absolute, http(s), and on a host the adapter declared. */
export function canonicalUrl(
  value: string | null | undefined,
  allowedHosts: readonly string[],
  baseUrl?: string,
): { url: string | null; issue: NormalizationIssue | null } {
  const text = cleanText(value);
  if (!text) return { url: null, issue: "INVALID_URL" };

  let parsed: URL;
  try {
    parsed = new URL(text, baseUrl);
  } catch {
    return { url: null, issue: "INVALID_URL" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { url: null, issue: "INVALID_URL" };
  }

  // The allowlist belongs to the adapter, never to a crawl request. Without
  // it, a crawl job could be pointed at any host the server can reach.
  const host = parsed.hostname.toLowerCase();
  const allowed = allowedHosts.some(
    (candidate) => host === candidate || host.endsWith(`.${candidate}`),
  );

  if (!allowed) return { url: null, issue: "DISALLOWED_HOST" };

  // Query strings and fragments are session and tracking noise; the canonical
  // product URL is the path.
  parsed.search = "";
  parsed.hash = "";

  return { url: parsed.toString(), issue: null };
}

function normalizeCategoryPaths(paths: unknown): string[][] | null {
  if (!Array.isArray(paths)) return null;

  const cleaned: string[][] = [];

  for (const path of paths) {
    if (!Array.isArray(path)) return null;

    const segments = path
      .map((segment) => cleanText(typeof segment === "string" ? segment : null))
      .filter((segment): segment is string => segment !== null);

    if (segments.length > 0) cleaned.push(segments);
  }

  return cleaned;
}

/**
 * Merges category paths without duplicating them.
 *
 * A product legitimately appears in several sections, and each crawl of each
 * section reports one of them. Appending blindly would grow the array on every
 * run until the document was mostly breadcrumbs.
 */
export function mergeCategoryPaths(
  existing: string[][],
  incoming: string[][],
): string[][] {
  const seen = new Set(existing.map((path) => path.join(" > ")));
  const merged = [...existing];

  for (const path of incoming) {
    const key = path.join(" > ");
    if (seen.has(key)) continue;

    seen.add(key);
    merged.push(path);
  }

  return merged;
}

/**
 * The one gate every candidate passes, whichever retailer produced it.
 *
 * Returns the issues rather than throwing: a single unreadable tile is a
 * counted failure, not a reason to abandon a crawl of nine thousand products.
 */
export function normalizeCatalogueProduct(
  candidate: Partial<NormalizedCatalogueProduct>,
  allowedHosts: readonly string[],
): NormalizationResult {
  const issues: NormalizationIssue[] = [];

  const retailerProductId = cleanText(candidate.retailerProductId);
  if (!retailerProductId) issues.push("MISSING_PRODUCT_ID");

  const name = cleanText(candidate.name);
  if (!name || name.length > MAX_NAME_LENGTH) issues.push("MISSING_NAME");

  const priceMinor = candidate.priceMinor;
  if (
    typeof priceMinor !== "number" ||
    !Number.isInteger(priceMinor) ||
    priceMinor <= 0 ||
    priceMinor > MAX_PRICE_MINOR
  ) {
    issues.push("INVALID_PRICE");
  }

  const { url, issue: urlIssue } = canonicalUrl(candidate.productUrl, allowedHosts);
  if (urlIssue) issues.push(urlIssue);

  const categoryPaths = normalizeCategoryPaths(candidate.categoryPaths ?? []);
  if (categoryPaths === null) issues.push("INVALID_CATEGORY_PATH");

  if (issues.length > 0) return { product: null, issues };

  const image = candidate.imageUrl
    ? canonicalUrl(candidate.imageUrl, allowedHosts)
    : { url: null, issue: null };

  return {
    product: {
      retailerProductId: retailerProductId as string,
      name: name as string,
      brand: cleanText(candidate.brand),
      description: cleanText(candidate.description),
      categoryPaths: categoryPaths as string[][],
      priceMinor: priceMinor as number,
      packageSizeRaw: cleanText(candidate.packageSizeRaw),
      comparisonPriceRaw: cleanText(candidate.comparisonPriceRaw),
      ingredientsRaw: cleanText(candidate.ingredientsRaw),
      allergenAdviceRaw: cleanText(candidate.allergenAdviceRaw),
      dietaryInformationRaw: cleanText(candidate.dietaryInformationRaw),
      // An image on an unexpected host is dropped rather than rejecting the
      // product: a missing picture is cosmetic, a missing product is not.
      imageUrl: image.url,
      productUrl: url as string,
      available: candidate.available ?? true,
    },
    issues: [],
  };
}
