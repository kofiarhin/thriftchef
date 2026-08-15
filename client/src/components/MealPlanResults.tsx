import { useState } from "react";
import type { MealPlanResponse, MealType } from "../api/types";
import { formatDay, formatMinutes, formatPence, titleCase } from "../format";
import { RecipeCard } from "./RecipeCard";
import { ShoppingList } from "./ShoppingList";

type ResultTab = "week" | "recipes" | "shopping";

interface MealPlanResultsProps {
  plan: MealPlanResponse;
  onRegenerate: () => void;
  onEditConstraints: () => void;
  onReplaceMeal: (day: number, mealType: MealType) => void;
  isRegenerating: boolean;
  isReplacing: boolean;
}

const TABS: Array<{ id: ResultTab; label: string }> = [
  { id: "week", label: "Weekly plan" },
  { id: "recipes", label: "Recipes" },
  { id: "shopping", label: "Shopping list" },
];

function BudgetSummary({ plan }: { plan: MealPlanResponse }) {
  const remaining = plan.budgetPence - plan.estimatedTotalPence;
  return (
    <div className="grid overflow-hidden rounded-2xl border border-line bg-surface-raised sm:grid-cols-3">
      {[
        ["Weekly budget", formatPence(plan.budgetPence)],
        ["Whole basket", formatPence(plan.estimatedTotalPence)],
        [remaining >= 0 ? "Remaining" : "Over budget", formatPence(Math.abs(remaining))],
      ].map(([label, value], index) => (
        <div key={label} className={`p-5 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function MealPlanResults({ plan, onRegenerate, onEditConstraints, onReplaceMeal, isRegenerating, isReplacing }: MealPlanResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("week");
  const [selectedRecipeId, setSelectedRecipeId] = useState(plan.recipes[0]?.id ?? "");
  const [selectedTarget, setSelectedTarget] = useState<{ day: number; mealType: MealType } | null>(null);
  const [confirmRegeneration, setConfirmRegeneration] = useState(false);
  const recipesById = new Map(plan.recipes.map((recipe) => [recipe.id, recipe]));
  const targetMeal = selectedTarget
    ? plan.days.find((day) => day.day === selectedTarget.day)?.meals.find((meal) => meal.mealType === selectedTarget.mealType)
    : undefined;
  const selectedRecipe = recipesById.get(targetMeal?.recipeId ?? selectedRecipeId) ?? plan.recipes[0];
  const mealTypes = plan.days[0]?.meals.map((meal) => meal.mealType) ?? [];

  const openRecipe = (recipeId: string, day: number, mealType: MealType): void => {
    setSelectedRecipeId(recipeId);
    setSelectedTarget({ day, mealType });
    setActiveTab("recipes");
  };

  const selectedOccurrence = selectedTarget && targetMeal
    ? { day: selectedTarget.day, meal: targetMeal }
    : selectedRecipe
    ? plan.days.flatMap((day) => day.meals.map((meal) => ({ day: day.day, meal }))).find(({ meal }) => meal.recipeId === selectedRecipe.id)
    : undefined;

  return (
    <section aria-labelledby="plan-summary-heading" className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Your NVIDIA-planned week</p>
          <h2 id="plan-summary-heading" className="mt-2 text-3xl font-semibold text-ink">Your week is sorted</h2>
          <p className="mt-1 text-sm text-ink-muted">Review the week, open a recipe, then take your list to Aldi.</p>
        </div>
        <div className="print-hidden flex gap-2">
          <button type="button" onClick={onEditConstraints} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink">Edit plan</button>
          <button type="button" onClick={() => { if (confirmRegeneration) { setConfirmRegeneration(false); onRegenerate(); } else setConfirmRegeneration(true); }} disabled={isRegenerating || isReplacing} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-on-brand disabled:opacity-60">{isRegenerating ? "Regenerating…" : confirmRegeneration ? "Confirm regenerate" : "Regenerate week"}</button>
        </div>
      </div>

      <BudgetSummary plan={plan} />

      {plan.warnings.length > 0 ? (
        <details className="rounded-xl border border-warning bg-warning-surface px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-warning-ink">Important shopping notes ({plan.warnings.length})</summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-warning-ink">{plan.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
        </details>
      ) : null}

      <div className="print-hidden border-b border-line" role="tablist" aria-label="Meal plan views">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`${tab.id}-panel`} onClick={() => setActiveTab(tab.id)} className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-ink"}`}>{tab.label}</button>
        ))}
      </div>

      <div id="week-panel" role="tabpanel" hidden={activeTab !== "week"}>
        <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface-raised sm:block">
          <table className="w-full border-collapse text-left">
            <thead><tr className="border-b border-line bg-surface-sunken"><th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Day</th>{mealTypes.map((mealType) => <th key={mealType} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{titleCase(mealType)}</th>)}</tr></thead>
            <tbody>{plan.days.map((day) => <tr key={day.day} className="border-b border-line/60 last:border-0"><th className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-ink">{formatDay(day.day)}</th>{mealTypes.map((mealType) => { const meal = day.meals.find((entry) => entry.mealType === mealType); return <td key={mealType} className="px-4 py-3">{meal ? <button type="button" onClick={() => openRecipe(meal.recipeId, day.day, meal.mealType)} className="group text-left"><span className="block text-sm font-semibold text-ink group-hover:text-brand">{meal.title}</span><span className="mt-1 block text-xs text-ink-muted">{formatPence(meal.estimatedCostPence)} food used · serves {meal.servings}</span></button> : "—"}</td>; })}</tr>)}</tbody>
          </table>
        </div>
        <div className="space-y-3 sm:hidden">{plan.days.map((day) => <details key={day.day} open={day.day === 1} className="rounded-xl border border-line bg-surface-raised"><summary className="cursor-pointer p-4 font-semibold text-ink">{formatDay(day.day)}</summary><ul className="border-t border-line p-4">{day.meals.map((meal) => <li key={meal.mealType} className="mb-3 last:mb-0"><button type="button" onClick={() => openRecipe(meal.recipeId, day.day, meal.mealType)} className="w-full text-left"><span className="text-xs uppercase tracking-wide text-ink-muted">{titleCase(meal.mealType)}</span><span className="block font-semibold text-ink">{meal.title}</span></button></li>)}</ul></details>)}</div>
      </div>

      <div id="recipes-panel" role="tabpanel" hidden={activeTab !== "recipes"}>
        <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible">{plan.recipes.map((recipe) => <button key={recipe.id} type="button" onClick={() => { setSelectedRecipeId(recipe.id); setSelectedTarget(null); }} aria-pressed={selectedRecipe?.id === recipe.id} className={`min-w-56 rounded-xl border p-4 text-left transition lg:w-full ${selectedRecipe?.id === recipe.id ? "border-brand bg-brand-soft" : "border-line bg-surface-raised hover:border-ink-muted"}`}><span className="text-xs uppercase tracking-wide text-ink-muted">{titleCase(recipe.mealType)} · {formatMinutes(recipe.prepMinutes + recipe.cookMinutes)}</span><span className="mt-1 block font-semibold text-ink">{recipe.title}</span></button>)}</div>
          {selectedRecipe ? <RecipeCard recipe={selectedRecipe} isReplacing={isReplacing} onReplace={selectedOccurrence ? () => onReplaceMeal(selectedOccurrence.day, selectedOccurrence.meal.mealType) : undefined} /> : null}
        </div>
      </div>

      <div id="shopping-panel" role="tabpanel" hidden={activeTab !== "shopping"}><ShoppingList groups={plan.shoppingList} totalPence={plan.estimatedTotalPence} /></div>

      {plan.assumptions.length > 0 ? <details className="rounded-xl border border-line bg-surface-raised p-4"><summary className="cursor-pointer text-sm font-semibold text-ink">Plan details and assumptions</summary><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">{plan.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul></details> : null}
    </section>
  );
}
