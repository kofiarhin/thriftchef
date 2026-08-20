import { model, models, Schema, type Model, type Types } from "mongoose";

/**
 * How much of the catalogue a run set out to cover.
 *
 * This is not a label: it is the first of the trust conditions that decide
 * whether missing products may be retired. Only a `full` run can ever justify
 * marking a product unavailable, because only a `full` run expected to see
 * everything.
 */
export const CRAWL_MODES = ["diagnostic", "bounded", "full"] as const;
export type CrawlMode = (typeof CRAWL_MODES)[number];

export const CRAWL_STATUSES = [
  "queued",
  "running",
  "completed",
  "completed_with_warnings",
  "failed",
  "cancelled",
] as const;
export type CrawlStatus = (typeof CRAWL_STATUSES)[number];

/** Statuses that represent a run which reached its own end in good order. */
export const TRUSTED_CRAWL_STATUSES: CrawlStatus[] = [
  "completed",
  "completed_with_warnings",
];

export interface CrawlRunError {
  type: string;
  url: string;
  message: string;
}

export interface CrawlRunRecord {
  _id: Types.ObjectId;
  retailerId: Types.ObjectId;
  storeId: Types.ObjectId | null;
  adapterKey: string;
  adapterVersion: string;
  mode: CrawlMode;
  status: CrawlStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  categoriesRequested: number;
  categoriesCompleted: number;
  productsDiscovered: number;
  productsInserted: number;
  productsUpdated: number;
  priceChanges: number;
  failures: number;
  /**
   * Whether the adapter confirmed it was looking at the requested store. A run
   * that never proved this cannot be trusted to reconcile availability: it may
   * have been reading a different store's shelves the whole time.
   */
  storeSelectionVerified: boolean;
  /** Set only after reconciliation actually ran, never as an intention. */
  availabilityReconciled: boolean;
  offersRetired: number;
  errors: CrawlRunError[];
  createdAt?: Date;
  updatedAt?: Date;
}

const crawlRunErrorSchema = new Schema<CrawlRunError>(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const crawlRunSchema = new Schema<CrawlRunRecord>(
  {
    retailerId: { type: Schema.Types.ObjectId, required: true, ref: "Retailer" },
    storeId: { type: Schema.Types.ObjectId, default: null, ref: "RetailStore" },
    adapterKey: { type: String, required: true, trim: true },
    adapterVersion: { type: String, required: true, trim: true },
    mode: { type: String, required: true, enum: CRAWL_MODES },
    status: { type: String, required: true, enum: CRAWL_STATUSES },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    categoriesRequested: { type: Number, required: true, default: 0, min: 0 },
    categoriesCompleted: { type: Number, required: true, default: 0, min: 0 },
    productsDiscovered: { type: Number, required: true, default: 0, min: 0 },
    productsInserted: { type: Number, required: true, default: 0, min: 0 },
    productsUpdated: { type: Number, required: true, default: 0, min: 0 },
    priceChanges: { type: Number, required: true, default: 0, min: 0 },
    failures: { type: Number, required: true, default: 0, min: 0 },
    storeSelectionVerified: { type: Boolean, required: true, default: false },
    availabilityReconciled: { type: Boolean, required: true, default: false },
    offersRetired: { type: Number, required: true, default: 0, min: 0 },
    errors: { type: [crawlRunErrorSchema], default: [] },
  },
  { timestamps: true, collection: "crawlRuns" },
);

crawlRunSchema.index(
  { retailerId: 1, storeId: 1, createdAt: -1 },
  { name: "crawl_history" },
);
crawlRunSchema.index({ status: 1, createdAt: -1 }, { name: "crawl_status" });

export const CrawlRun: Model<CrawlRunRecord> =
  (models.CrawlRun as Model<CrawlRunRecord> | undefined) ??
  model<CrawlRunRecord>("CrawlRun", crawlRunSchema);
