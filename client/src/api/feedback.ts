import { apiRequest } from "./http";

/** How a week went, in the coarsest terms that are still useful. */
export const FEEDBACK_RATINGS = ["good", "mixed", "poor"] as const;
export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];

/**
 * A closed list, deliberately. Free text about a meal plan invites people to
 * type things about their household and their health that we should not store.
 */
export const FEEDBACK_ISSUES = [
  { id: "too-expensive", label: "Cost more than expected" },
  { id: "prices-wrong", label: "Prices were wrong in store" },
  { id: "too-repetitive", label: "Too repetitive" },
  { id: "too-slow-to-cook", label: "Took too long to cook" },
  { id: "missing-ingredients", label: "Ingredients were unavailable" },
  { id: "disliked-meals", label: "We did not enjoy the meals" },
] as const;

export type FeedbackIssue = (typeof FEEDBACK_ISSUES)[number]["id"];

export function submitPlanFeedback(input: {
  planId: string;
  rating: FeedbackRating;
  issues: FeedbackIssue[];
}): Promise<void> {
  return apiRequest<void>(
    `/api/meal-plans/${encodeURIComponent(input.planId)}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({ rating: input.rating, issues: input.issues }),
    },
  );
}
