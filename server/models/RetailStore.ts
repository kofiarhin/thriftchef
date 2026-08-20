import { model, models, Schema, type Model, type Types } from "mongoose";
import {
  SLUG_PATTERN,
  STORE_SCOPES,
  type StoreScope,
} from "../catalogue/core/retailerTypes";

/**
 * One catalogue scope belonging to one retailer.
 *
 * A national retailer still gets a store row — a logical one, scoped
 * `national`. Every plan therefore names exactly one store, and no query can
 * be written that scopes by retailer and forgets the store. The alternative,
 * an optional store, would make the missing case the easy one to write.
 *
 * `externalStoreId` is the retailer's own stable identifier and doubles as the
 * legacy slug the existing Aldi catalogue is keyed by, which is what makes the
 * migration additive.
 */
export interface RetailStoreRecord {
  _id: Types.ObjectId;
  retailerId: Types.ObjectId;
  externalStoreId: string;
  name: string;
  postcode: string | null;
  scope: StoreScope;
  enabled: boolean;
  lastSuccessfulCrawlAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const retailStoreSchema = new Schema<RetailStoreRecord>(
  {
    retailerId: { type: Schema.Types.ObjectId, required: true, ref: "Retailer" },
    externalStoreId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: SLUG_PATTERN,
    },
    name: { type: String, required: true, trim: true },
    postcode: { type: String, default: null, trim: true },
    scope: { type: String, required: true, enum: STORE_SCOPES },
    enabled: { type: Boolean, required: true, default: true },
    lastSuccessfulCrawlAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "stores" },
);

// The compound key is what stops one retailer's store id resolving under
// another retailer: the same external id under two retailers is two stores.
retailStoreSchema.index(
  { retailerId: 1, externalStoreId: 1 },
  { unique: true, name: "unique_retailer_store" },
);
retailStoreSchema.index({ retailerId: 1, enabled: 1 }, { name: "store_selection" });

export const RetailStore: Model<RetailStoreRecord> =
  (models.RetailStore as Model<RetailStoreRecord> | undefined) ??
  model<RetailStoreRecord>("RetailStore", retailStoreSchema);
