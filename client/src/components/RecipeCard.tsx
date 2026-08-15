import type { Recipe } from "../api/types";
import { formatMinutes, formatPence, labelForSlug, titleCase } from "../format";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalCost = recipe.ingredients.reduce(
    (total, ingredient) => total + ingredient.estimatedCostPence,
    0,
  );

  return (
    <article className="print-break-inside-avoid rounded-lg border border-line bg-surface-raised p-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {titleCase(recipe.mealType)}
        </p>
        <h4 className="mt-1 text-lg font-semibold text-ink">{recipe.title}</h4>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
          <div className="flex gap-1">
            <dt>Serves</dt>
            <dd className="font-medium text-ink">{recipe.servings}</dd>
          </div>
          <div className="flex gap-1">
            <dt>Prep</dt>
            <dd className="font-medium text-ink">
              {formatMinutes(recipe.prepMinutes)}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>Cook</dt>
            <dd className="font-medium text-ink">
              {formatMinutes(recipe.cookMinutes)}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>Ingredient cost</dt>
            <dd className="font-medium text-ink">{formatPence(totalCost)}</dd>
          </div>
        </dl>

        <p className="mt-2 text-sm text-ink-muted">
          Equipment:{" "}
          <span className="text-ink">
            {recipe.appliances.length > 0
              ? recipe.appliances.map(labelForSlug).join(", ")
              : "None — no cooking required"}
          </span>
        </p>
      </header>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <h5 className="text-sm font-semibold text-ink">Ingredients</h5>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.productId} className="flex justify-between gap-3">
                <span className="min-w-0 break-words text-ink">
                  {ingredient.name}
                  <span className="text-ink-muted"> — {ingredient.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatPence(ingredient.estimatedCostPence)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-ink">Method</h5>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-muted">
            {recipe.steps.map((step, index) => (
              <li key={`${recipe.id}-step-${index}`} className="break-words">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.allergenWarnings.length > 0 ? (
        <p className="mt-4 rounded-md border border-warning bg-warning-surface px-3 py-2 text-sm text-warning-ink">
          <span className="font-semibold">May contain:</span>{" "}
          {recipe.allergenWarnings.join(", ")}. Inferred from product wording —
          check the packaging.
        </p>
      ) : null}
    </article>
  );
}
