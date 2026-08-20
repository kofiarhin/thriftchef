import { model, models, Schema, type Model, type Types } from "mongoose";
import {
  CATALOGUE_SCOPE_KINDS,
  RETAILER_STATUSES,
  SLUG_PATTERN,
  SUPPORTED_COUNTRY_CODES,
  SUPPORTED_CURRENCIES,
  type CatalogueScopeKind,
  type CountryCode,
  type CrawlPolicy,
  type Currency,
  type RetailerStatus,
} from "../catalogue/core/retailerTypes";

/**
 * A supermarket ThriftChef can plan from.
 *
 * A record rather than an enum value: adding a retailer is a row plus an
 * adapter, and never a change to planning logic or collection topology. What
 * the database still enforces is the closed lifecycle — an unknown `status`
 * must not be storable, because the selectability rule reads it.
 */
export interface RetailerRecord {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  countryCode: CountryCode;
  currency: Currency;
  /** Chooses the adapter in the registry. Never a URL. */
  adapterKey: string;
  catalogueScope: CatalogueScopeKind;
  status: RetailerStatus;
  logoUrl: string | null;
  crawlPolicy: CrawlPolicy;
  createdAt?: Date;
  updatedAt?: Date;
}

const crawlPolicySchema = new Schema<CrawlPolicy>(
  {
    schedule: { type: String, default: null, trim: true },
    maxConcurrency: { type: Number, required: true, min: 1, max: 16, default: 1 },
    requestsPerMinute: { type: Number, required: true, min: 1, max: 600, default: 30 },
    staleAfterHours: { type: Number, required: true, min: 1, max: 8_760, default: 72 },
  },
  { _id: false },
);

const retailerSchema = new Schema<RetailerRecord>(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: SLUG_PATTERN,
    },
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, enum: SUPPORTED_COUNTRY_CODES },
    currency: { type: String, required: true, enum: SUPPORTED_CURRENCIES },
    adapterKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: SLUG_PATTERN,
    },
    catalogueScope: { type: String, required: true, enum: CATALOGUE_SCOPE_KINDS },
    status: { type: String, required: true, enum: RETAILER_STATUSES },
    logoUrl: { type: String, default: null, trim: true },
    crawlPolicy: { type: crawlPolicySchema, required: true },
  },
  { timestamps: true, collection: "retailers" },
);

retailerSchema.index({ slug: 1 }, { unique: true, name: "unique_retailer_slug" });
retailerSchema.index({ status: 1, countryCode: 1 }, { name: "retailer_selection" });

export const Retailer: Model<RetailerRecord> =
  (models.Retailer as Model<RetailerRecord> | undefined) ??
  model<RetailerRecord>("Retailer", retailerSchema);
