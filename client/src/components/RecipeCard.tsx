import type { Recipe } from "../api/types";
import { formatMinutes, formatPence, labelForSlug, titleCase } from "../format";
import { Icon } from "./Icon";

interface RecipeCardProps {
  recipe: Recipe;
  onReplace?: () => void;
  isReplacing?: boolean;
}

export function RecipeCard({ recipe, onReplace, isReplacing }: RecipeCardProps) {
  const consumedCost = recipe.ingredients.reduce(
    (total, ingredient) => total + ingredient.estimatedCostPence,
    0,
  );

  return (
    <article className="print-break-inside-avoid rounded-2xl border border-line bg-surface-raised">
      <header className="border-b border-line p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <Icon name="receipt" size={13} />
              {titleCase(recipe.mealType)}
            </p>
            <h4 className="mt-2 text-2xl font-semibold text-ink">{recipe.title}</h4>
          </div>
          {onReplace ? (
            <button type="button" onClick={onReplace} disabled={isReplacing} className="print-hidden inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand disabled:opacity-60">
              <Icon name="refresh" size={15} />
              {isReplacing ? "Replacing…" : "Replace this meal"}
            </button>
          ) : null}
        </div>
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
          <div><dt className="inline">Serves </dt><dd className="inline font-semibold text-ink">{recipe.servings}</dd></div>
          <div><dt className="inline">Prep </dt><dd className="inline font-semibold text-ink">{formatMinutes(recipe.prepMinutes)}</dd></div>
          <div><dt className="inline">Cook </dt><dd className="inline font-semibold text-ink">{formatMinutes(recipe.cookMinutes)}</dd></div>
          <div><dt className="inline">Food used </dt><dd className="inline font-semibold text-ink">{formatPence(consumedCost)}</dd></div>
        </dl>
        <p className="mt-3 text-sm text-ink-muted">Equipment: <span className="text-ink">{recipe.appliances.length > 0 ? recipe.appliances.map(labelForSlug).join(", ") : "No cooking required"}</span></p>
      </header>

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <h5 className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="text-brand"><Icon name="store" size={15} /></span>From Aldi</h5>
          <ul className="mt-3 space-y-3">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.productId} className="flex items-center gap-3 rounded-xl bg-surface-sunken p-3">
                {ingredient.imageUrl ? <img src={ingredient.imageUrl} alt="" loading="lazy" className="size-12 rounded-lg bg-white object-contain" /> : <div className="size-12 rounded-lg border border-line bg-surface-raised" aria-hidden="true" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{ingredient.name}</p>
                  <p className="text-xs text-ink-muted">{ingredient.quantity}</p>
                </div>
                <span className="text-sm tabular-nums text-ink-muted">{formatPence(ingredient.estimatedCostPence)}</span>
              </li>
            ))}
          </ul>
          {recipe.pantryItems.length > 0 ? (
            <div className="mt-5">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="text-brand"><Icon name="cube" size={15} /></span>From your pantry</h5>
              <p className="mt-2 text-sm text-ink-muted">{recipe.pantryItems.map(labelForSlug).join(", ")}</p>
            </div>
          ) : null}
        </div>

        <div>
          <h5 className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="text-brand"><Icon name="hob" size={15} /></span>Method</h5>
          <ol className="mt-3 space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={`${recipe.id}-step-${index}`} className="grid grid-cols-[2rem_1fr] gap-3 text-sm text-ink-muted">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">{index + 1}</span>
                <p className="pt-1.5 leading-6">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.allergenWarnings.length > 0 ? (
        <p className="m-5 rounded-xl border border-warning bg-warning-surface px-4 py-3 text-sm text-warning-ink sm:m-6">
          <span className="font-semibold">May contain:</span> {recipe.allergenWarnings.join(", ")}. Inferred from product wording—check the packaging.
        </p>
      ) : null}
    </article>
  );
}
