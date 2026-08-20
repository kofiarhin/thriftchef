/**
 * Every read of the catalogue, scoped by retailer and store.
 *
 * Two implementations of the same question — "what can this store sell me?" —
 * so the offer migration can be proven equivalent before it is trusted, and
 * reversed by configuration if it is not. Both are exercised by the same
 * tests against the same data, which is the only way "the totals match" means
 * anything.
 *
 * There is no unscoped variant, on purpose. A function that could read the
 * whole catalogue is a function that could put two retailers in one basket.
 */

import { Types } from "mongoose";
import { Product, type ProductRecord } from "../../models/Product";
import { ProductOffer, type ProductOfferRecord } from "../../models/ProductOffer";
import type { CandidateProduct, CatalogueReadSource } from "./catalogueTypes";
import type { ResolvedCatalogueScope } from "./retailerTypes";

/** Descriptive fields, read from the product either way. */
const PRODUCT_PROJECTION = {
  retailerProductId: 1,
  name: 1,
  brand: 1,
  description: 1,
  categoryPaths: 1,
  pricePence: 1,
  packageSizeRaw: 1,
  dietaryInformationRaw: 1,
  normalizedAllergens: 1,
  catalogueSafetyStatus: 1,
  eligibleForPlanning: 1,
  productUrl: 1,
  imageUrl: 1,
  lastSeenAt: 1,
  lastCheckedAt: 1,
  lastCrawlRunId: 1,
} as const;

/**
 * Sorted by product id so the two readers return the same list in the same
 * order. Selection sorts by score anyway, but an unstable input order would
 * make legacy-versus-offer comparison meaningless.
 */
function byProductId(a: CandidateProduct, b: CandidateProduct): number {
  return a.retailerProductId.localeCompare(b.retailerProductId);
}

function fromLegacyProduct(document: ProductRecord): CandidateProduct {
  return {
    retailerProductId: document.retailerProductId,
    name: document.name,
    brand: document.brand ?? null,
    description: document.description ?? null,
    categoryPaths: document.categoryPaths ?? [],
    pricePence: document.pricePence,
    packageSizeRaw: document.packageSizeRaw ?? null,
    dietaryInformationRaw: document.dietaryInformationRaw ?? null,
    normalizedAllergens: document.normalizedAllergens ?? [],
    catalogueSafetyStatus: document.catalogueSafetyStatus,
    eligibleForPlanning: document.eligibleForPlanning,
    productUrl: document.productUrl,
    imageUrl: document.imageUrl ?? null,
    lastSeenAt: document.lastSeenAt,
    lastCheckedAt: document.lastCheckedAt,
    lastCrawlRunId: document.lastCrawlRunId,
  };
}

/**
 * Price and availability come from the offer; everything descriptive comes
 * from the product. That split is the entire point of the offer collection, so
 * it is expressed here rather than by copying fields around.
 */
function fromOffer(
  offer: ProductOfferRecord,
  document: ProductRecord,
): CandidateProduct {
  return {
    ...fromLegacyProduct(document),
    pricePence: offer.priceMinor,
    eligibleForPlanning: offer.eligibleForPlanning,
    lastSeenAt: offer.lastSeenAt,
    lastCheckedAt: offer.lastCheckedAt,
    lastCrawlRunId: offer.lastCrawlRunId,
  };
}

async function loadFromLegacy(
  scope: ResolvedCatalogueScope,
): Promise<CandidateProduct[]> {
  const documents = await Product.find(
    { retailer: scope.retailerSlug, storeId: scope.storeSlug, available: true },
    PRODUCT_PROJECTION,
  ).lean<ProductRecord[]>();

  return documents.map(fromLegacyProduct).sort(byProductId);
}

async function loadFromOffers(
  scope: ResolvedCatalogueScope,
): Promise<CandidateProduct[]> {
  const offers = await ProductOffer.find({
    retailerId: new Types.ObjectId(scope.retailerId),
    storeId: new Types.ObjectId(scope.storeId),
    available: true,
  }).lean<ProductOfferRecord[]>();

  if (offers.length === 0) return [];

  // Two queries rather than an aggregation `$lookup`: both are indexed, the
  // second is a single `$in` over primary keys, and the result is far easier
  // to reason about than a pipeline on the request path.
  const documents = await Product.find(
    { _id: { $in: offers.map((offer) => offer.productId) } },
    PRODUCT_PROJECTION,
  ).lean<(ProductRecord & { _id: Types.ObjectId })[]>();

  const byId = new Map(documents.map((document) => [document._id.toString(), document]));

  return offers
    .flatMap((offer) => {
      const document = byId.get(offer.productId.toString());
      // An offer whose product is missing is a broken join, not a free
      // product: dropping it is the only safe reading.
      return document ? [fromOffer(offer, document)] : [];
    })
    .sort(byProductId);
}

export async function loadCandidateProducts(
  scope: ResolvedCatalogueScope,
  source: CatalogueReadSource,
): Promise<CandidateProduct[]> {
  return source === "offers" ? loadFromOffers(scope) : loadFromLegacy(scope);
}

/**
 * Both readers over the same scope, for the migration's equivalence check.
 *
 * Exists so an operator can prove the offer path answers identically before
 * the read switch is flipped, rather than discovering a difference through a
 * user's shopping list.
 */
export async function compareCatalogueReads(
  scope: ResolvedCatalogueScope,
): Promise<{
  legacyCount: number;
  offerCount: number;
  matches: boolean;
  differences: string[];
}> {
  const [legacy, offers] = await Promise.all([
    loadFromLegacy(scope),
    loadFromOffers(scope),
  ]);

  const differences: string[] = [];
  const offersById = new Map(
    offers.map((product) => [product.retailerProductId, product]),
  );

  for (const product of legacy) {
    const offer = offersById.get(product.retailerProductId);

    if (!offer) {
      differences.push(`${product.retailerProductId}: missing from offers`);
      continue;
    }

    if (offer.pricePence !== product.pricePence) {
      differences.push(
        `${product.retailerProductId}: price ${product.pricePence} vs ${offer.pricePence}`,
      );
    }
    if (offer.eligibleForPlanning !== product.eligibleForPlanning) {
      differences.push(`${product.retailerProductId}: eligibility differs`);
    }
  }

  for (const offer of offers) {
    if (!legacy.some((product) => product.retailerProductId === offer.retailerProductId)) {
      differences.push(`${offer.retailerProductId}: present in offers only`);
    }
  }

  return {
    legacyCount: legacy.length,
    offerCount: offers.length,
    matches: differences.length === 0,
    // Bounded: a wholesale mismatch must not produce a million-line report.
    differences: differences.slice(0, 50),
  };
}
