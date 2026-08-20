import { model, models, Schema, type Model, type Types } from "mongoose";
import { SLUG_PATTERN, type Currency } from "../catalogue/core/retailerTypes";

/**
 * What one product costs, and whether it is on the shelf, in one store.
 *
 * Split from `Product` because those two facts are the only ones that differ
 * between stores. Duplicating the whole product per store instead would
 * multiply descriptive data, allergen inference and safety verdicts by the
 * number of branches, and make "the same product" a matter of string
 * comparison rather than identity.
 *
 * `eligibleForPlanning` is deliberately denormalised from the product. The
 * planner's query filters on retailer, store, availability, eligibility and a
 * positive price at once, and MongoDB cannot index across collections — so
 * either eligibility lives here or every plan pays for a `$lookup` on the hot
 * path. The crawl runner owns keeping it in step, and it is derived data: the
 * product remains the source of truth.
 */
export interface ProductOfferRecord {
  _id: Types.ObjectId;
  retailerId: Types.ObjectId;
  storeId: Types.ObjectId;
  productId: Types.ObjectId;

  /**
   * The slug half of the dual key, carried alongside the ObjectIds. It is what
   * the legacy Aldi documents are keyed by, what appears in operational
   * queries, and what makes a mis-scoped offer obvious when read by a human.
   */
  retailerSlug: string;
  storeSlug: string;
  /** The retailer's own product code, denormalised for lookup and debugging. */
  retailerProductId: string;

  priceMinor: number;
  currency: Currency;

  /**
   * Null until an adapter supplies structured data. Aldi publishes a free-text
   * comparison price and no promotions at all, so these stay null rather than
   * being invented from a parse that would be wrong more often than right.
   */
  comparisonPrice: { priceMinor: number; unit: string } | null;
  comparisonPriceRaw: string | null;
  promotion: {
    description: string;
    validFrom: Date | null;
    validTo: Date | null;
  } | null;

  available: boolean;
  eligibleForPlanning: boolean;

  lastSeenAt: Date;
  lastCheckedAt: Date;
  lastCrawlRunId: string;

  /**
   * Set when reconciliation retires an offer, together with the run that did
   * it. Retirement is the only destructive write in the catalogue, so it must
   * be attributable to a single run and reversible by that run's id.
   */
  unavailableSince: Date | null;
  retiredByCrawlRunId: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

const comparisonPriceSchema = new Schema(
  {
    priceMinor: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const promotionSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    validFrom: { type: Date, default: null },
    validTo: { type: Date, default: null },
  },
  { _id: false },
);

const productOfferSchema = new Schema<ProductOfferRecord>(
  {
    retailerId: { type: Schema.Types.ObjectId, required: true, ref: "Retailer" },
    storeId: { type: Schema.Types.ObjectId, required: true, ref: "RetailStore" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },

    retailerSlug: { type: String, required: true, trim: true, match: SLUG_PATTERN },
    storeSlug: { type: String, required: true, trim: true, match: SLUG_PATTERN },
    retailerProductId: { type: String, required: true, trim: true },

    priceMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ["GBP"], default: "GBP" },

    comparisonPrice: { type: comparisonPriceSchema, default: null },
    comparisonPriceRaw: { type: String, default: null, trim: true },
    promotion: { type: promotionSchema, default: null },

    available: { type: Boolean, required: true, default: true },
    eligibleForPlanning: { type: Boolean, required: true, default: false },

    lastSeenAt: { type: Date, required: true },
    lastCheckedAt: { type: Date, required: true },
    lastCrawlRunId: { type: String, required: true, trim: true },

    unavailableSince: { type: Date, default: null },
    retiredByCrawlRunId: { type: String, default: null, trim: true },
  },
  { timestamps: true, collection: "productOffers" },
);

// One offer per product per store. This is what makes the crawl upsert
// idempotent and what stops a product being priced twice in one basket.
productOfferSchema.index(
  { retailerId: 1, storeId: 1, productId: 1 },
  { unique: true, name: "unique_store_product_offer" },
);

// The planner's query, in one index: scope, availability, eligibility, price.
productOfferSchema.index(
  { retailerId: 1, storeId: 1, available: 1, eligibleForPlanning: 1, priceMinor: 1 },
  { name: "offer_planning_lookup" },
);

// Catalogue freshness and the reconciliation sweep.
productOfferSchema.index(
  { retailerId: 1, storeId: 1, lastCheckedAt: -1 },
  { name: "offer_freshness" },
);

// Reversing one reconciliation run without touching any other.
productOfferSchema.index(
  { retiredByCrawlRunId: 1 },
  { name: "offer_retirement", sparse: true },
);

export const ProductOffer: Model<ProductOfferRecord> =
  (models.ProductOffer as Model<ProductOfferRecord> | undefined) ??
  model<ProductOfferRecord>("ProductOffer", productOfferSchema);
