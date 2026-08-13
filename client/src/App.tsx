import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiRequestError } from "./api/http";
import { fetchCatalogueStatus, generateMealPlan } from "./api/mealPlans";
import type { MealPlanRequest, MealPlanResponse } from "./api/types";
import { ConstraintForm } from "./components/ConstraintForm";
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

export function App() {
  const [formState, setFormState] = useState<ConstraintFormState>(INITIAL_FORM_STATE);
  const [showForm, setShowForm] = useState(true);
  // The submitted request is kept so "Regenerate" repeats it exactly.
  const [lastRequest, setLastRequest] = useState<MealPlanRequest | null>(null);

  const catalogue = useQuery({
    queryKey: ["catalogue-status"],
    queryFn: fetchCatalogueStatus,
  });

  const planMutation = useMutation<MealPlanResponse, unknown, MealPlanRequest>({
    mutationFn: generateMealPlan,
    onSuccess: () => setShowForm(false),
  });

  const submit = (request: MealPlanRequest): void => {
    setLastRequest(request);
    planMutation.mutate(request);
  };

  const regenerate = (): void => {
    if (lastRequest) planMutation.mutate(lastRequest);
  };

  const plan = planMutation.data;
  const isGenerating = planMutation.isPending;

  return (
    <div className="min-h-screen">
      <header className="print-hidden border-b border-line bg-surface-raised">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-2 px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-ink">ThriftChef</h1>
            <p className="text-sm text-ink-muted">
              Weekly meal plans and one Aldi shopping list, built to a budget.
            </p>
          </div>
          <p className="text-sm text-ink-muted">Aldi UK · single store</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="order-2 min-w-0 lg:order-1">
            {showForm ? (
              <section aria-labelledby="constraints-heading">
                <h2 id="constraints-heading" className="text-2xl font-semibold text-ink">
                  Plan your week
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Set your budget and constraints. Every plan is priced from real
                  Aldi products.
                </p>

                <div className="mt-6">
                  <ConstraintForm
                    state={formState}
                    onStateChange={setFormState}
                    onSubmit={submit}
                    isGenerating={isGenerating}
                    serverIssues={serverIssuesFrom(planMutation.error)}
                  />
                </div>
              </section>
            ) : null}

            <div className={showForm ? "mt-8" : ""}>
              {isGenerating ? <PlanSkeleton /> : null}

              {!isGenerating && planMutation.isError ? (
                <PlanError
                  error={planMutation.error}
                  onRetry={regenerate}
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
                  onEditConstraints={() => setShowForm(true)}
                  isRegenerating={isGenerating}
                />
              ) : null}
            </div>

            {!isGenerating && !plan && !planMutation.isError && !showForm ? (
              <p className="text-sm text-ink-muted">
                No plan yet. Open the form to set your constraints.
              </p>
            ) : null}
          </div>

          <div className="print-hidden order-1 lg:order-2">
            <StatusPanel
              status={catalogue.data}
              isLoading={catalogue.isLoading}
              error={catalogue.error as Error | null}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
