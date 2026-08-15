import type { MealPlanResponse } from "../api/types";
import { formatDay, formatPence, titleCase } from "../format";
import { RecipeCard } from "./RecipeCard";
import { ShoppingList } from "./ShoppingList";

interface MealPlanResultsProps {
  plan: MealPlanResponse;
  onRegenerate: () => void;
  onEditConstraints: () => void;
  isRegenerating: boolean;
}

function BudgetSummary({ plan }: { plan: MealPlanResponse }) {
  const isOver = plan.budgetStatus === "over-budget";
  const differencePence = plan.budgetPence - plan.estimatedTotalPence;

  return (
    <div className="grid gap-4 rounded-lg border border-line bg-surface-raised p-5 sm:grid-cols-3">
      <div>
        <p className="text-sm text-ink-muted">Weekly budget</p>
        <p className="text-2xl font-semibold tabular-nums text-ink">
          {formatPence(plan.budgetPence)}
        </p>
      </div>

      <div>
        <p className="text-sm text-ink-muted">Estimated basket</p>
        <p className="text-2xl font-semibold tabular-nums text-ink">
          {formatPence(plan.estimatedTotalPence)}
        </p>
      </div>

      <div>
        <p className="text-sm text-ink-muted">
          {isOver ? "Over budget by" : "Left over"}
        </p>
        <p
          className={`text-2xl font-semibold tabular-nums ${
            isOver ? "text-danger-ink" : "text-ink"
          }`}
        >
          {formatPence(Math.abs(differencePence))}
        </p>
        {/* Text, not just colour, carries the status. */}
        <p className="text-sm font-medium text-ink-muted">
          {isOver ? "Over budget" : "Within budget"}
        </p>
      </div>
    </div>
  );
}

export function MealPlanResults({
  plan,
  onRegenerate,
  onEditConstraints,
  isRegenerating,
}: MealPlanResultsProps) {
  const recipesById = new Map(plan.recipes.map((recipe) => [recipe.id, recipe]));

  return (
    <div className="space-y-10">
      <section aria-labelledby="plan-summary-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="plan-summary-heading" className="text-2xl font-semibold text-ink">
            Your week of meals
          </h2>

          <div className="print-hidden flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEditConstraints}
              className="rounded-md border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-ink transition hover:border-ink-muted"
            >
              Edit constraints
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegenerating ? "Regenerating…" : "Regenerate plan"}
            </button>
          </div>
        </div>

        <BudgetSummary plan={plan} />

        {plan.warnings.length > 0 ? (
          <div className="rounded-lg border border-warning bg-warning-surface p-4">
            <h3 className="text-sm font-semibold text-warning-ink">
              Before you shop
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-warning-ink">
              {plan.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {plan.assumptions.length > 0 ? (
          <details className="rounded-lg border border-line bg-surface-raised p-4">
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              Assumptions used for this plan
            </summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {plan.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-muted">
              Built from {plan.productCoverage.productsConsidered} Aldi products,
              using {plan.productCoverage.productsUsed}.{" "}
              {plan.productCoverage.excludedForAllergies} were excluded for
              allergies and {plan.productCoverage.excludedForSafety} for missing
              safety data.
            </p>
          </details>
        ) : null}
      </section>

      <section aria-labelledby="plan-days-heading">
        <h3 id="plan-days-heading" className="text-xl font-semibold text-ink">
          Seven-day plan
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plan.days.map((day) => (
            <div
              key={day.day}
              className="print-break-inside-avoid rounded-lg border border-line bg-surface-raised p-4"
            >
              <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                {formatDay(day.day)}
              </h4>

              <ul className="mt-2 space-y-2">
                {day.meals.map((meal) => (
                  <li key={`${day.day}-${meal.mealType}`}>
                    <p className="text-xs text-ink-muted">
                      {titleCase(meal.mealType)}
                    </p>
                    <p className="text-sm font-medium break-words text-ink">
                      {meal.title}
                    </p>
                    <p className="text-xs tabular-nums text-ink-muted">
                      {formatPence(meal.estimatedCostPence)} · serves{" "}
                      {meal.servings}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="plan-recipes-heading">
        <h3 id="plan-recipes-heading" className="text-xl font-semibold text-ink">
          Recipes
        </h3>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[...recipesById.values()].map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <ShoppingList
        groups={plan.shoppingList}
        totalPence={plan.estimatedTotalPence}
      />
    </div>
  );
}
