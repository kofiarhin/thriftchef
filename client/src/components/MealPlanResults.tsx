import { useState } from "react";
import type { MealPlanResponse, MealType } from "../api/types";
import { formatDay, formatMinutes, formatPence, titleCase } from "../format";
import { Icon, type IconName } from "./Icon";
import { MEAL_TYPE_META } from "./optionMeta";
import { RecipeCard } from "./RecipeCard";
import { ShoppingList } from "./ShoppingList";

type ResultTab = "week" | "recipes" | "shopping";

interface MealPlanResultsProps {
  plan: MealPlanResponse;
  onRegenerate: () => void;
  onStartNewPlan: () => void;
  onEditConstraints: () => void;
  onReplaceMeal: (day: number, mealType: MealType) => void;
  isRegenerating: boolean;
  isReplacing: boolean;
}

const TABS: Array<{ id: ResultTab; label: string; icon: IconName }> = [
  { id: "week", label: "Weekly plan", icon: "calendar" },
  { id: "recipes", label: "Recipes", icon: "receipt" },
  { id: "shopping", label: "Shopping list", icon: "basket" },
];

function mealIcon(mealType: string): IconName {
  return MEAL_TYPE_META[mealType]?.icon ?? "dinner";
}

function BudgetSummary({ plan }: { plan: MealPlanResponse }) {
  const remaining = plan.budgetPence - plan.estimatedTotalPence;
  const utilization = plan.budgetUtilization;
  const isOver = remaining < 0;

  const cells: Array<{ label: string; value: string; icon: IconName; accent?: boolean }> = [
    { label: "Maximum budget", value: formatPence(plan.budgetPence), icon: "wallet" },
    {
      label: `Target (${utilization.targetPercent}%)`,
      value: formatPence(utilization.targetPence),
      icon: "price-tag",
    },
    {
      label: "Whole basket",
      value: formatPence(plan.estimatedTotalPence),
      icon: "basket",
      accent: true,
    },
    {
      label: isOver ? "Over budget" : "Remaining",
      value: formatPence(Math.abs(remaining)),
      icon: isOver ? "alert-circle" : "check-circle",
    },
  ];

  return (
    <div>
      <div className="grid overflow-hidden rounded-2xl border border-line bg-surface-raised sm:grid-cols-4">
        {cells.map((cell, index) => (
          <div
            key={cell.label}
            className={`p-5 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${
              cell.accent ? "bg-brand-soft/50" : ""
            }`}
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <Icon name={cell.icon} size={13} />
              {cell.label}
            </p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-ink">
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-sm text-ink-muted">
        This basket uses {utilization.actualPercent}% of your maximum
        {utilization.withinPreferredRange
          ? ", which is within the range you asked for."
          : "."}
      </p>
    </div>
  );
}

function MustHaveUsageSection({ plan }: { plan: MealPlanResponse }) {
  if (plan.mustHaveUsage.length === 0) return null;

  return (
    <section
      aria-labelledby="must-have-usage-heading"
      className="rounded-2xl border border-line bg-surface-raised p-5"
    >
      <h3
        id="must-have-usage-heading"
        className="flex items-center gap-2 text-sm font-semibold text-ink"
      >
        <span className="text-brand">
          <Icon name="basket" size={15} />
        </span>
        Must-have items used
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Each of these is in your shopping list and is cooked with during the week.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {plan.mustHaveUsage.map((entry) => (
          <li
            key={entry.productId}
            className="rounded-xl border border-line bg-surface-sunken p-3 text-sm text-ink"
          >
            <span className="font-semibold">{entry.productName}</span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              {entry.usedIn.length === 0
                ? "Not used"
                : entry.usedIn
                    .map((use) => `${formatDay(use.day)} ${use.mealType}`)
                    .join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MealPlanResults({
  plan,
  onRegenerate,
  onStartNewPlan,
  onEditConstraints,
  onReplaceMeal,
  isRegenerating,
  isReplacing,
}: MealPlanResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("week");
  const [selectedRecipeId, setSelectedRecipeId] = useState(plan.recipes[0]?.id ?? "");
  const [selectedTarget, setSelectedTarget] = useState<{ day: number; mealType: MealType } | null>(null);
  const [confirmRegeneration, setConfirmRegeneration] = useState(false);
  const recipesById = new Map(plan.recipes.map((recipe) => [recipe.id, recipe]));
  const targetMeal = selectedTarget
    ? plan.days
        .find((day) => day.day === selectedTarget.day)
        ?.meals.find((meal) => meal.mealType === selectedTarget.mealType)
    : undefined;
  const selectedRecipe =
    recipesById.get(targetMeal?.recipeId ?? selectedRecipeId) ?? plan.recipes[0];
  const mealTypes = plan.days[0]?.meals.map((meal) => meal.mealType) ?? [];

  const openRecipe = (recipeId: string, day: number, mealType: MealType): void => {
    setSelectedRecipeId(recipeId);
    setSelectedTarget({ day, mealType });
    setActiveTab("recipes");
  };

  const selectedOccurrence =
    selectedTarget && targetMeal
      ? { day: selectedTarget.day, meal: targetMeal }
      : selectedRecipe
        ? plan.days
            .flatMap((day) => day.meals.map((meal) => ({ day: day.day, meal })))
            .find(({ meal }) => meal.recipeId === selectedRecipe.id)
        : undefined;

  return (
    <section aria-labelledby="plan-summary-heading" className="space-y-7">
      <p
        data-testid="print-title"
        className="print-only text-lg font-semibold text-ink"
      >
        ThriftChef weekly plan
      </p>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="print-hidden flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            <Icon name="check-circle" size={14} />
            Your planned week
          </p>
          <h1
            id="plan-summary-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-ink"
          >
            Your week is sorted
          </h1>
          <p className="print-hidden mt-1 text-sm text-ink-muted">
            Review the week, open a recipe, then take your list to {plan.catalogue.retailerName}.
          </p>
        </div>

        <div className="print-hidden flex gap-2">
          <button
            type="button"
            onClick={onStartNewPlan}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink-muted"
          >
            Start new plan
          </button>
          <button
            type="button"
            onClick={onEditConstraints}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink-muted"
          >
            <Icon name="sliders" size={15} />
            Edit plan
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirmRegeneration) {
                setConfirmRegeneration(false);
                onRegenerate();
              } else setConfirmRegeneration(true);
            }}
            disabled={isRegenerating || isReplacing}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-on-brand shadow-brand-glow transition hover:brightness-110 disabled:opacity-60"
          >
            <Icon name="refresh" size={15} />
            {isRegenerating
              ? "Regenerating…"
              : confirmRegeneration
                ? "Confirm regenerate"
                : "Regenerate week"}
          </button>
        </div>
      </div>

      <BudgetSummary plan={plan} />

      <MustHaveUsageSection plan={plan} />

      {plan.warnings.length > 0 ? (
        <details className="rounded-xl border border-warning bg-warning-surface px-4 py-3">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-warning-ink">
            <Icon name="shield" size={15} />
            Important shopping notes ({plan.warnings.length})
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-warning-ink">
            {plan.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </details>
      ) : null}

      <div
        className="print-hidden flex gap-1 border-b border-line"
        role="tablist"
        aria-label="Meal plan views"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div id="week-panel" role="tabpanel" hidden={activeTab !== "week"}>
        <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface-raised sm:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-sunken">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Day
                </th>
                {mealTypes.map((mealType) => (
                  <th
                    key={mealType}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon name={mealIcon(mealType)} size={13} />
                      {titleCase(mealType)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.days.map((day) => (
                <tr
                  key={day.day}
                  className="print-break-inside-avoid border-b border-line/60 last:border-0"
                >
                  <th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-ink">
                    {formatDay(day.day)}
                  </th>
                  {mealTypes.map((mealType) => {
                    const meal = day.meals.find((entry) => entry.mealType === mealType);

                    return (
                      <td key={mealType} className="px-4 py-3">
                        {meal ? (
                          <button
                            type="button"
                            data-testid="open-recipe"
                            onClick={() => openRecipe(meal.recipeId, day.day, meal.mealType)}
                            className="group text-left"
                          >
                            <span className="block text-sm font-semibold text-ink transition group-hover:text-brand">
                              {meal.title}
                            </span>
                            <span className="mt-1 block text-xs text-ink-muted">
                              {formatPence(meal.estimatedCostPence)} food used · serves{" "}
                              {meal.servings}
                            </span>
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 sm:hidden">
          {plan.days.map((day) => (
            <details
              key={day.day}
              open={day.day === 1}
              className="print-break-inside-avoid rounded-xl border border-line bg-surface-raised"
            >
              <summary className="cursor-pointer p-4 font-semibold text-ink">
                {formatDay(day.day)}
              </summary>
              <ul className="border-t border-line p-4">
                {day.meals.map((meal) => (
                  <li key={meal.mealType} className="mb-3 last:mb-0">
                    <button
                      type="button"
                      data-testid="open-recipe"
                      onClick={() => openRecipe(meal.recipeId, day.day, meal.mealType)}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span className="rounded-lg bg-brand-soft p-1.5 text-brand">
                        <Icon name={mealIcon(meal.mealType)} size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wide text-ink-muted">
                          {titleCase(meal.mealType)}
                        </span>
                        <span className="block font-semibold text-ink">{meal.title}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>

      <div id="recipes-panel" role="tabpanel" hidden={activeTab !== "recipes"}>
        <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="print-hidden flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible">
            {plan.recipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => {
                  setSelectedRecipeId(recipe.id);
                  setSelectedTarget(null);
                }}
                aria-pressed={selectedRecipe?.id === recipe.id}
                data-selected={selectedRecipe?.id === recipe.id ? "true" : "false"}
                className="min-w-56 rounded-xl border border-line bg-surface-raised p-4 text-left transition duration-150 hover:border-ink-muted data-[selected=true]:border-brand data-[selected=true]:bg-brand-soft lg:w-full"
              >
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-muted">
                  <Icon name={mealIcon(recipe.mealType)} size={13} />
                  {titleCase(recipe.mealType)} ·{" "}
                  {formatMinutes(recipe.prepMinutes + recipe.cookMinutes)}
                </span>
                <span className="mt-1.5 block font-semibold text-ink">{recipe.title}</span>
              </button>
            ))}
          </div>

          {selectedRecipe ? (
            <RecipeCard
              recipe={selectedRecipe}
              isReplacing={isReplacing}
              onReplace={
                selectedOccurrence
                  ? () => onReplaceMeal(selectedOccurrence.day, selectedOccurrence.meal.mealType)
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>

      <div id="shopping-panel" role="tabpanel" hidden={activeTab !== "shopping"}>
        <ShoppingList groups={plan.shoppingList} totalPence={plan.estimatedTotalPence} />
      </div>

      {plan.assumptions.length > 0 ? (
        <details className="rounded-xl border border-line bg-surface-raised p-4">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="info" size={15} />
            Plan details and assumptions
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {plan.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
