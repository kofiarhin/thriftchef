import { model, models, Schema, type Model, type Types } from "mongoose";

/**
 * One observation of a price, written only when the price or promotion
 * actually changed.
 *
 * Append-only and never read by planning. A plan prices itself from the offer
 * at generation time and then keeps its own snapshot, so history exists for
 * operators diagnosing "why did this basket jump" — not for the request path.
 *
 * Writing a row per crawl instead of per change would grow the collection by
 * the catalogue size every few hours and bury the changes worth seeing.
 */
export interface PriceHistoryRecord {
  _id: Types.ObjectId;
  retailerId: Types.ObjectId;
  storeId: Types.ObjectId;
  productId: Types.ObjectId;
  retailerProductId: string;
  priceMinor: number;
  previousPriceMinor: number | null;
  promotionDescription: string | null;
  observedAt: Date;
  crawlRunId: string;
}

const priceHistorySchema = new Schema<PriceHistoryRecord>(
  {
    retailerId: { type: Schema.Types.ObjectId, required: true, ref: "Retailer" },
    storeId: { type: Schema.Types.ObjectId, required: true, ref: "RetailStore" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    retailerProductId: { type: String, required: true, trim: true },
    priceMinor: { type: Number, required: true, min: 0 },
    previousPriceMinor: { type: Number, default: null, min: 0 },
    promotionDescription: { type: String, default: null, trim: true },
    observedAt: { type: Date, required: true },
    crawlRunId: { type: String, required: true, trim: true },
  },
  { collection: "priceHistory" },
);

priceHistorySchema.index(
  { retailerId: 1, storeId: 1, productId: 1, observedAt: -1 },
  { name: "price_history_lookup" },
);
priceHistorySchema.index({ crawlRunId: 1 }, { name: "price_history_by_run" });

export const PriceHistory: Model<PriceHistoryRecord> =
  (models.PriceHistory as Model<PriceHistoryRecord> | undefined) ??
  model<PriceHistoryRecord>("PriceHistory", priceHistorySchema);
