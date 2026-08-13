import { model, models, Schema, type Model } from "mongoose";

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
  retailer: "aldi-uk";
  storeId: string;
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
      enum: ["aldi-uk"],
      index: true,
    },
    storeId: { type: String, required: true, trim: true, index: true },
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

export const Product: Model<ProductRecord> =
  (models.Product as Model<ProductRecord> | undefined) ??
  model<ProductRecord>("Product", productSchema);
