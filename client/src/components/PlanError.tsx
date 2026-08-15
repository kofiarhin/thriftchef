import { ApiRequestError } from "../api/http";

interface PlanErrorProps {
  error: unknown;
  onRetry: () => void;
  onEditConstraints: () => void;
}

/**
 * Failure copy is chosen by error code, so the user is told what to change
 * rather than being shown the same message for every failure.
 */
function describe(error: unknown): { title: string; body: string } {
  if (!(error instanceof ApiRequestError)) {
    return {
      title: "Something went wrong",
      body: "The plan could not be generated. Try again in a moment.",
    };
  }

  switch (error.code) {
    case "CATALOGUE_UNAVAILABLE":
      return {
        title: "The Aldi catalogue is empty",
        body: "There is no product data to plan from yet. Run the Aldi crawl, then try again.",
      };
    case "CATALOGUE_CONSTRAINT_CONFLICT":
      return {
        title: "Could not build a plan with these constraints",
        body: error.message,
      };
    case "AI_TIMEOUT":
      return {
        title: "Plan generation timed out",
        body: "The meal plan service did not respond in time. Try again — it usually works on a second attempt.",
      };
    case "AI_INVALID_RESPONSE":
      return {
        title: "Could not generate a valid plan",
        body: "The generated plan did not meet the rules for your constraints. Try increasing the budget or reducing meal types.",
      };
    case "RATE_LIMITED":
      return { title: "Too many attempts", body: error.message };
    case "INVALID_MEAL_PLAN_REQUEST":
      return {
        title: "Check the form",
        body: "Some constraints were not accepted. The problems are marked on the form.",
      };
    case "NETWORK_ERROR":
      return {
        title: "Cannot reach the ThriftChef API",
        body: "Check that the API server is running, then try again.",
      };
    default:
      return { title: "Something went wrong", body: error.message };
  }
}

export function PlanError({ error, onRetry, onEditConstraints }: PlanErrorProps) {
  const { title, body } = describe(error);
  const suggestions =
    error instanceof ApiRequestError ? error.suggestions : [];
  const canRetry = !(error instanceof ApiRequestError) || error.isRetryable;

  return (
    <div
      role="alert"
      className="rounded-lg border border-danger bg-danger-surface p-5 text-danger-ink"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{body}</p>

      {suggestions.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEditConstraints}
          className="rounded-md border border-danger bg-surface-raised px-4 py-2 text-sm font-medium text-ink transition hover:border-danger-strong"
        >
          Edit constraints
        </button>

        {canRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-danger-strong px-4 py-2 text-sm font-semibold text-on-danger transition hover:opacity-90"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
