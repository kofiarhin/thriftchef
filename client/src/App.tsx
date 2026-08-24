import { useState, type ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiRequestError } from "./api/http";
import {
  fetchCatalogueStatus,
  generateMealPlan,
  replaceMeal,
  type ReplaceMealInput,
} from "./api/mealPlans";
import type { MealPlanRequest, MealPlanResponse, MealType } from "./api/types";
import { ConstraintForm } from "./components/ConstraintForm";
import { Icon } from "./components/Icon";
import { MealPlanResults } from "./components/MealPlanResults";
import { PlanError } from "./components/PlanError";
import { PlanSkeleton } from "./components/PlanSkeleton";
import { StatusPanel } from "./components/StatusPanel";
import {
  INITIAL_FORM_STATE,
  mapServerFieldToFormField,
  type ConstraintFormState,
  type ValidationIssues,
} from "./constraints";

/** The seed is a signed 32-bit integer server-side, so it wraps rather than grows. */
const MAX_VARIATION_SEED = 2_147_483_647;

function withNextSeed(request: MealPlanRequest): MealPlanRequest {
  return {
    ...request,
    variationSeed: request.variationSeed >= MAX_VARIATION_SEED ? 0 : request.variationSeed + 1,
  };
}

/**
 * "No alternative exists" is a different situation from "the request failed",
 * and telling the user to try again when nothing else can be built would send
 * them round a loop that cannot end.
 */
function describeReplacementFailure(error: unknown): string {
  if (error instanceof ApiRequestError && error.code === "NO_REPLACEMENT_AVAILABLE") {
    return "No other meal fits this day within your constraints and budget. Your current plan is unchanged.";
  }

  return "This meal could not be replaced. Your current plan is unchanged. Try again.";
}

/** Field errors the server reported, mapped back onto form controls. */
function serverIssuesFrom(error: unknown): ValidationIssues {
  if (!(error instanceof ApiRequestError)) return {};

  const issues: ValidationIssues = {};
  for (const issue of error.fieldIssues) {
    const field = mapServerFieldToFormField(issue.field);
    if (field) issues[field] = issue.message;
  }

  return issues;
}

export interface AppProps {
  /**
   * Form values seeded from the saved household profile.
   *
   * Optional so the planner still renders standalone with its own defaults —
   * which is what the existing behaviour is, and what its tests exercise.
   */
  defaults?: Partial<ConstraintFormState>;
  /**
   * Publishes each generated or revised plan to whatever owns it outside the
   * planner — the router's plan context, in the routed app.
   *
   * Optional so the planner still works standalone, which is what its own
   * tests exercise. Without it the week, recipe and shopping routes would have
   * no plan to show, because this component holds it in local state.
   */
  onPlanChange?: (plan: MealPlanResponse, request: MealPlanRequest) => void;
  /** Optional retailer choice rendered before the planning constraints. */
  retailerSelector?: ReactNode;
  /** Starts a separate planning session, including a fresh retailer choice. */
  onStartNewPlan?: () => void;
}

/**
 * The planning screen.
 *
 * It renders one thing — the constraints, and the week they produce — and
 * nothing around it: the header, navigation and footer belong to `AppShell`,
 * which every route shares. It used to be the whole application, which is why
 * it is still called `App` and why its props are optional; the routed planner
 * passes all of them.
 */
export function App({
  defaults,
  onPlanChange,
  retailerSelector,
  onStartNewPlan,
}: AppProps = {}) {
  const [formState, setFormState] = useState<ConstraintFormState>(() => ({
    ...INITIAL_FORM_STATE,
    ...defaults,
  }));
  const [showForm, setShowForm] = useState(true);
  // The submitted request is kept so "Regenerate" repeats it exactly.
  const [lastRequest, setLastRequest] = useState<MealPlanRequest | null>(null);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);

  const catalogue = useQuery({
    queryKey: ["catalogue-status"],
    queryFn: fetchCatalogueStatus,
  });

  const planMutation = useMutation<MealPlanResponse, unknown, MealPlanRequest>({
    mutationFn: generateMealPlan,
    onMutate: () => setShowForm(false),
    onSuccess: (nextPlan, submitted) => {
      setPlan(nextPlan);
      setShowForm(false);
      onPlanChange?.(nextPlan, submitted);
    },
    onError: (error) => {
      if (Object.keys(serverIssuesFrom(error)).length > 0) setShowForm(true);
    },
  });
  const replaceMutation = useMutation<MealPlanResponse, unknown, ReplaceMealInput>({
    mutationFn: replaceMeal,
    onSuccess: (revised, submitted) => {
      setPlan(revised);
      // A swap reprices the whole basket, so the shopping list has to follow.
      onPlanChange?.(revised, submitted.request);
    },
  });

  const run = (request: MealPlanRequest): void => {
    setLastRequest(request);
    setPlan(null);
    planMutation.mutate(request);
  };

  const submit = (request: MealPlanRequest): void => run(request);

  /**
   * The planner is deterministic, so repeating a request unchanged repeats the
   * week exactly. Asking for a different week means asking for a different
   * seed — that is what "Regenerate" is.
   */
  const regenerate = (): void => {
    if (lastRequest) run(withNextSeed(lastRequest));
  };

  const startNewPlan = (): void => {
    setFormState({ ...INITIAL_FORM_STATE, ...defaults });
    setLastRequest(null);
    setPlan(null);
    setShowForm(true);
    planMutation.reset();
    replaceMutation.reset();
    onStartNewPlan?.();
  };

  /**
   * A retry after a failed request is different: when the request never reached
   * the server the user has not seen a plan for this seed yet, so re-sending it
   * unchanged is what they asked for. Any other failure did reach the server,
   * and repeating the same seed would reproduce the same failure.
   */
  const retry = (): void => {
    if (!lastRequest) return;

    const outcomeUnknown =
      planMutation.error instanceof ApiRequestError &&
      planMutation.error.code === "NETWORK_ERROR";

    run(outcomeUnknown ? lastRequest : withNextSeed(lastRequest));
  };

  const replaceSelectedMeal = (day: number, mealType: MealType): void => {
    if (!lastRequest || !plan) return;
    replaceMutation.mutate({ request: lastRequest, plan, day, mealType });
  };

  const isGenerating = planMutation.isPending;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {showForm ? (
        <section aria-labelledby="constraints-heading">
          <div className="print-hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              The planner
            </p>
            <h1
              id="constraints-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-ink"
            >
              Plan your week
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-ink-muted">
              Three focused steps. You can change anything before generating.
            </p>
          </div>

          <div className="mt-7 space-y-7">
            {retailerSelector}
            <ConstraintForm
              state={formState}
              onStateChange={setFormState}
              onSubmit={submit}
              isGenerating={isGenerating}
              serverIssues={serverIssuesFrom(planMutation.error)}
            />

            {/* Kept beside the form, not on a marketing page: when generation
                fails, whether the catalogue can support a plan at all is the
                first thing worth knowing. */}
            <div className="print-hidden max-w-md">
              <StatusPanel
                status={catalogue.data}
                isLoading={catalogue.isLoading}
                error={catalogue.error as Error | null}
              />
            </div>
          </div>
        </section>
      ) : (
        <div>
          {isGenerating ? <PlanSkeleton /> : null}

          {!isGenerating && planMutation.isError ? (
            <PlanError
              error={planMutation.error}
              onRetry={retry}
              onEditConstraints={() => {
                setShowForm(true);
                planMutation.reset();
              }}
            />
          ) : null}

          {!isGenerating && !planMutation.isError && plan ? (
            <MealPlanResults
              plan={plan}
              onRegenerate={regenerate}
              onStartNewPlan={startNewPlan}
              onEditConstraints={() => setShowForm(true)}
              onReplaceMeal={replaceSelectedMeal}
              isRegenerating={isGenerating}
              isReplacing={replaceMutation.isPending}
            />
          ) : null}

          {replaceMutation.isError ? (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger bg-danger-surface p-4 text-sm text-danger-ink"
            >
              <span className="mt-0.5 shrink-0">
                <Icon name="alert-circle" size={16} />
              </span>
              {describeReplacementFailure(replaceMutation.error)}
            </div>
          ) : null}

          {!isGenerating && !plan && !planMutation.isError ? (
            <p className="text-sm text-ink-muted">
              No plan yet. Open the form to set your constraints.
            </p>
          ) : null}
        </div>
      )}
    </main>
  );
}
