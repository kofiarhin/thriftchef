import { model, models, Schema, type Model, type Types } from "mongoose";

/** How a week went, in the coarsest terms that are still useful. */
export const FEEDBACK_RATINGS = ["good", "mixed", "poor"] as const;
export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];

/**
 * What the user thought a problem was, from a closed list.
 *
 * Closed on purpose: free text about a meal plan invites people to type things
 * about their household and their health that we have no business storing.
 * These categories are enough to tell a catalogue problem from a planning one.
 */
export const FEEDBACK_ISSUES = [
  "too-expensive",
  "prices-wrong",
  "too-repetitive",
  "too-slow-to-cook",
  "missing-ingredients",
  "disliked-meals",
] as const;
export type FeedbackIssue = (typeof FEEDBACK_ISSUES)[number];

/**
 * Optional end-of-week feedback.
 *
 * Deliberately thin. It records a rating, a closed set of issue tags and the
 * catalogue the plan came from — enough to notice that one retailer's prices
 * are consistently wrong, and not enough to describe a person.
 *
 * No free text, no anonymous id, no plan contents. It is joined to a plan only
 * by id, and it expires with the plan.
 */
export interface PlanFeedbackRecord {
  _id: Types.ObjectId;
  planId: string;
  retailerSlug: string;
  storeSlug: string;
  rating: FeedbackRating;
  issues: FeedbackIssue[];
  createdAt: Date;
  expiresAt: Date;
}

const planFeedbackSchema = new Schema<PlanFeedbackRecord>(
  {
    planId: { type: String, required: true, trim: true },
    retailerSlug: { type: String, required: true, trim: true },
    storeSlug: { type: String, required: true, trim: true },
    rating: { type: String, required: true, enum: FEEDBACK_RATINGS },
    issues: [{ type: String, enum: FEEDBACK_ISSUES }],
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { collection: "planFeedback" },
);

// One verdict per plan. Changing your mind replaces it rather than adding a
// second opinion about the same week.
planFeedbackSchema.index({ planId: 1 }, { unique: true, name: "unique_plan_feedback" });
planFeedbackSchema.index(
  { retailerSlug: 1, storeSlug: 1, createdAt: -1 },
  { name: "feedback_by_catalogue" },
);
planFeedbackSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "feedback_ttl" },
);

export const PlanFeedback: Model<PlanFeedbackRecord> =
  (models.PlanFeedback as Model<PlanFeedbackRecord> | undefined) ??
  model<PlanFeedbackRecord>("PlanFeedback", planFeedbackSchema);
