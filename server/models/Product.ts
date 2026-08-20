import { model, models, Schema, type Model, type Types } from "mongoose";
import { SLUG_PATTERN } from "../catalogue/core/retailerTypes";

/**
 * "verified" means the retailer published ingredients and allergen advice.
 * "inferred" means allergens were derived from the product's published wording
 * because the retailer publishes none — usable for planning, but never safe to
 * present to a user as an allergen guarantee.
 */
export type CatalogueSafetyStatus =
  | "verified"
  | "inferred"
  | "incomplete"
  | "ambiguous";

export interface ProductRecord {
  _id: Types.ObjectId;
  /**
   * The retailer slug. Kept as the primary key half it always was: every
   * existing document is written under it, the unique index is built on it,
   * and the public API accepts it. No longer a closed union — retailers are
   * records now, so a new supermarket is a row rather than a schema change.
   */
  retailer: string;
  /** The store slug, unchanged. `retailerRef`/`storeRef` are its id twin. */
  storeId: string;

  /**
   * The ObjectId half of the dual key, added additively.
   *
   * Optional because every document written before the migration lacks it and
   * backfilling is a separate, restartable step. Offers join on these; nothing
   * reads them until the backfill has run.
   */
  retailerRef?: Types.ObjectId | null;
  storeRef?: Types.ObjectId | null;

  retailerProductId: string;
  canonicalKey: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  previousPricePence: number | null;
  priceChangedAt: Date | null;
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
  available: boolean;
  lastCheckedAt: Date;
  lastSeenAt: Date;
  lastCrawlRunId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<ProductRecord>(
  {
    retailer: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: SLUG_PATTERN,
      index: true,
    },
    storeId: { type: String, required: true, trim: true, index: true },
    retailerRef: { type: Schema.Types.ObjectId, default: null, ref: "Retailer" },
    storeRef: { type: Schema.Types.ObjectId, default: null, ref: "RetailStore" },
    retailerProductId: { type: String, required: true, trim: true },
    canonicalKey: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: null, trim: true },
    description: { type: String, default: null, trim: true },
    categoryPaths: { type: [[String]], default: [] },
    pricePence: { type: Number, required: true, min: 0 },
    previousPricePence: { type: Number, default: null, min: 0 },
    priceChangedAt: { type: Date, default: null },
    packageSizeRaw: { type: String, default: null, trim: true },
    comparisonPriceRaw: { type: String, default: null, trim: true },
    ingredientsRaw: { type: String, default: null, trim: true },
    allergenAdviceRaw: { type: String, default: null, trim: true },
    dietaryInformationRaw: { type: String, default: null, trim: true },
    normalizedAllergens: { type: [String], default: [] },
    catalogueSafetyStatus: {
      type: String,
      required: true,
      enum: ["verified", "inferred", "incomplete", "ambiguous"],
    },
    eligibleForPlanning: { type: Boolean, required: true, default: false },
    safetyIssues: { type: [String], default: [] },
    imageUrl: { type: String, default: null, trim: true },
    productUrl: { type: String, required: true, trim: true },
    available: { type: Boolean, required: true, default: true, index: true },
    lastCheckedAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    lastCrawlRunId: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "products",
  },
);

productSchema.index(
  { retailer: 1, storeId: 1, retailerProductId: 1 },
  { unique: true, name: "unique_retailer_store_product" },
);

productSchema.index(
  { retailer: 1, storeId: 1, available: 1, eligibleForPlanning: 1 },
  { name: "catalogue_planning_lookup" },
);

// Resolving a product from an offer, and the offer backfill's own lookup.
productSchema.index(
  { retailerRef: 1, retailerProductId: 1 },
  { name: "product_by_retailer_ref", sparse: true },
);

export const Product: Model<ProductRecord> =
  (models.Product as Model<ProductRecord> | undefined) ??
  model<ProductRecord>("Product", productSchema);
