import { useState, type ReactElement } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FEEDBACK_ISSUES,
  FEEDBACK_RATINGS,
  submitPlanFeedback,
  type FeedbackIssue,
  type FeedbackRating,
} from "../../api/feedback";

const RATING_LABELS: Record<FeedbackRating, string> = {
  good: "Went well",
  mixed: "Mixed",
  poor: "Did not work",
};

/**
 * Optional end-of-week feedback.
 *
 * Skippable by simply not touching it, because it is genuinely optional: a
 * user who ignores it loses nothing, and nothing here sits on the path to a
 * plan. A failed submission is reported quietly and never presented as
 * something the user has to resolve.
 */
export function PlanFeedback({ planId }: { planId: string }): ReactElement {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [issues, setIssues] = useState<FeedbackIssue[]>([]);

  const mutation = useMutation({
    mutationFn: () =>
      submitPlanFeedback({ planId, rating: rating as FeedbackRating, issues }),
  });

  if (mutation.isSuccess) {
    return (
      <section className="mt-10 rounded-xl border border-line p-4">
        <p role="status" className="text-sm text-ink">
          Thanks — that helps us spot catalogue problems.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-xl border border-line p-4">
      <h2 className="text-sm font-semibold text-ink">How did this week go?</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Optional. No names, no free text — just what worked and what did not.
      </p>

      <fieldset className="mt-3">
        <legend className="sr-only">Overall rating</legend>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_RATINGS.map((value) => (
            <label
              key={value}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                rating === value
                  ? "border-brand bg-brand-surface font-semibold text-ink"
                  : "border-line text-ink-muted"
              }`}
            >
              <input
                type="radio"
                name="plan-rating"
                className="sr-only"
                checked={rating === value}
                onChange={() => setRating(value)}
              />
              {RATING_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {rating && rating !== "good" ? (
        <fieldset className="mt-4">
          <legend className="text-xs font-semibold text-ink">
            What went wrong? (optional)
          </legend>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {FEEDBACK_ISSUES.map((issue) => (
              <li key={issue.id}>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={issues.includes(issue.id)}
                    onChange={() =>
                      setIssues((current) =>
                        current.includes(issue.id)
                          ? current.filter((entry) => entry !== issue.id)
                          : [...current, issue.id],
                      )
                    }
                  />
                  {issue.label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      {mutation.isError ? (
        <p role="alert" className="mt-3 text-xs text-danger-ink">
          We could not send that just now. Your plan is unaffected.
        </p>
      ) : null}

      <button
        type="button"
        disabled={rating === null || mutation.isPending}
        onClick={() => mutation.mutate()}
        className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Sending…" : "Send feedback"}
      </button>
    </section>
  );
}
