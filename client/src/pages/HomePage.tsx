import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { formatDay, formatPence } from "../format";
import { PlanFeedback } from "../features/weeklyPlan/PlanFeedback";
import { usePlan } from "../features/weeklyPlan/usePlan";



/**
 * The week at a glance.
 *
 * Shows the plan already generated rather than fetching one: the plan is an
 * immutable snapshot, and re-requesting it between screens would reprice the
 * basket against whatever the catalogue says now.
 */
export function HomePage(): ReactElement {
  const { plan } = usePlan();

  if (!plan) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">No plan yet</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Generate a week and it will appear here.
        </p>
        <Link
          to="/plan"
          className="mt-6 inline-block rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Plan this week
        </Link>
      </main>
    );
  }

  const remaining = plan.budgetPence - plan.estimatedTotalPence;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Your week</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {plan.catalogue.retailerName} · {plan.catalogue.storeName}
          {plan.catalogue.catalogueUpdatedAt ? (
            <>
              {" "}
              · prices from{" "}
              {new Date(plan.catalogue.catalogueUpdatedAt).toLocaleDateString("en-GB")}
            </>
          ) : null}
        </p>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Basket</dt>
          <dd className="text-lg font-semibold text-ink">
            {formatPence(plan.estimatedTotalPence)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Budget</dt>
          <dd className="text-lg font-semibold text-ink">
            {formatPence(plan.budgetPence)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Left over</dt>
          <dd className="text-lg font-semibold text-ink">{formatPence(remaining)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Meals</dt>
          <dd className="text-lg font-semibold text-ink">
            {plan.days.reduce((total, day) => total + day.meals.length, 0)}
          </dd>
        </div>
      </dl>

      <ul className="mt-8 space-y-3">
        {plan.days.map((day) => (
          <li key={day.day} className="rounded-xl border border-line p-4">
            <h2 className="text-sm font-semibold text-ink">{formatDay(day.day)}</h2>
            <ul className="mt-2 space-y-1">
              {day.meals.map((meal) => (
                <li key={meal.mealType} className="text-sm text-ink-muted">
                  <Link
                    to={"/recipe/" + encodeURIComponent(meal.recipeId)}
                    className="font-medium text-ink underline"
                  >
                    {meal.title}
                  </Link>{" "}
                  · {meal.servings} servings ·{" "}
                  {formatPence(meal.estimatedCostPence)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-3">
        <Link
          to="/shopping"
          className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Shopping list
        </Link>
        <Link
          to="/plan"
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink"
        >
          Plan again
        </Link>
      </div>

      <PlanFeedback planId={plan.planId} />
    </main>
  );
}
