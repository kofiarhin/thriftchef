import { ApiRequestError } from "../api/http";
import { Icon } from "./Icon";

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
    case "NO_AFFORDABLE_PLAN":
      return {
        title: "This week costs more than the budget",
        body: error.message,
      };
    case "NO_REPLACEMENT_AVAILABLE":
      return {
        title: "No other meal fits this day",
        body: "Nothing else can be built for this meal within your constraints and budget. Keep the current meal, or widen the constraints.",
      };
    case "PLANNER_CAPACITY_EXCEEDED":
      return {
        title: "The planner is busy",
        body: "The planner ran out of time building your week. Try again in a moment.",
      };
    case "PLANNER_INTERNAL_ERROR":
      return {
        title: "Could not build a valid plan",
        body: "Something went wrong inside the planner. Try again, and change a constraint if it keeps happening.",
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
      className="rounded-2xl border border-danger bg-danger-surface p-6 text-danger-ink"
    >
      <span className="flex size-10 items-center justify-center rounded-xl border border-danger bg-danger-surface">
        <Icon name="alert-circle" size={20} />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-prose text-sm">{body}</p>

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
          className="inline-flex items-center gap-2 rounded-xl border border-danger bg-surface-raised px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-danger-strong"
        >
          <Icon name="sliders" size={15} />
          Edit constraints
        </button>

        {canRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-danger-strong px-4 py-2.5 text-sm font-semibold text-on-danger transition hover:brightness-110"
          >
            <Icon name="refresh" size={15} />
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
