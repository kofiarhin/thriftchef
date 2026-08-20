import { model, models, Schema, type Model, type Types } from "mongoose";

/**
 * A generated plan, kept so it can be reopened.
 *
 * Stored as a complete snapshot rather than as a request to be re-planned.
 * The catalogue moves — prices change on every crawl — and a shopping list
 * that silently reprices itself between the kitchen and the shop is worse than
 * no shopping list. What was generated is what is shown, for as long as the
 * plan is kept.
 *
 * Anonymous throughout: an `anonymousId` the browser generated, and nothing
 * else. No account, no email, no address. The TTL index below is the retention
 * policy, and it is enforced by the database rather than by a cleanup job that
 * might not run.
 */
export interface MealPlanRecord {
  _id: Types.ObjectId;
  planId: string;
  /**
   * Hashed before storage. Correlating a person's own plans needs a stable
   * value, not a reversible one — and a raw browser-generated id in a database
   * is a tracking key waiting to be joined against something else.
   */
  anonymousIdHash: string;
  retailerId: Types.ObjectId;
  storeId: Types.ObjectId;
  retailerSlug: string;
  storeSlug: string;
  crawlRunId: string | null;
  engineVersion: string;
  variationSeed: number;
  /** Exactly what was asked for, so a regeneration can repeat it. */
  requestSnapshot: unknown;
  /** Exactly what was returned, prices and all. */
  responseSnapshot: unknown;
  estimatedTotalMinor: number;
  currency: string;
  createdAt: Date;
  expiresAt: Date;
}

const mealPlanSchema = new Schema<MealPlanRecord>(
  {
    planId: { type: String, required: true, trim: true },
    anonymousIdHash: { type: String, required: true, trim: true },
    retailerId: { type: Schema.Types.ObjectId, required: true, ref: "Retailer" },
    storeId: { type: Schema.Types.ObjectId, required: true, ref: "RetailStore" },
    retailerSlug: { type: String, required: true, trim: true },
    storeSlug: { type: String, required: true, trim: true },
    crawlRunId: { type: String, default: null, trim: true },
    engineVersion: { type: String, required: true, trim: true },
    variationSeed: { type: Number, required: true, min: 0 },
    requestSnapshot: { type: Schema.Types.Mixed, required: true },
    responseSnapshot: { type: Schema.Types.Mixed, required: true },
    estimatedTotalMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "GBP" },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { collection: "mealPlans" },
);

// The plan id is what a URL carries, so it must resolve one document.
mealPlanSchema.index({ planId: 1 }, { unique: true, name: "unique_plan_id" });

// Retention, enforced by MongoDB rather than by a job that might not run.
mealPlanSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "meal_plan_ttl" },
);

// A returning device's own plans, newest first.
mealPlanSchema.index(
  { anonymousIdHash: 1, createdAt: -1 },
  { name: "plans_by_device" },
);

export const MealPlan: Model<MealPlanRecord> =
  (models.MealPlan as Model<MealPlanRecord> | undefined) ??
  model<MealPlanRecord>("MealPlan", mealPlanSchema);
