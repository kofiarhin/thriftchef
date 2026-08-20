import { useEffect, useRef, type ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiRequestError } from "../api/http";
import { formatPence } from "../format";
import { usePlan } from "../features/weeklyPlan/usePlan";

/**
 * One recipe, at its own URL.
 *
 * The plan is restored by id after a refresh, so this page works from a
 * bookmark or a shared link rather than only as a step inside a session. What
 * it shows is the saved snapshot — the prices the plan was generated with, not
 * whatever the catalogue says now.
 */
export function RecipePage(): ReactElement {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { plan, isRestoring, restoreError } = usePlan();

  const headingRef = useRef<HTMLHeadingElement>(null);

  const recipe = plan?.recipes.find((entry) => entry.id === recipeId) ?? null;

  // Focus the title on arrival, so a keyboard or screen-reader user lands on
  // the recipe rather than at the top of a page that has silently changed.
  useEffect(() => {
    if (recipe) headingRef.current?.focus();
  }, [recipe?.id]);

  if (isRestoring) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p role="status" className="text-sm text-ink-muted">
          Loading your plan…
        </p>
      </main>
    );
  }

  // A plan that has expired or was never saved is a specific, recoverable
  // situation — not a generic failure. Saying which it is decides what the
  // user should do next.
  if (restoreError || !plan) {
    const expired =
      restoreError instanceof ApiRequestError && restoreError.code === "PLAN_NOT_FOUND";

    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">
          {expired ? "That plan has expired" : "No plan open"}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {expired
            ? "Plans are kept for a limited time. Generate a fresh one for this week."
            : "Generate a week and its recipes will be available here."}
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

  if (!recipe) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">Recipe not in this plan</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This week&rsquo;s plan does not include that recipe. It may have been
          swapped out.
        </p>
        <Link
          to="/week"
          className="mt-6 inline-block rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink"
        >
          Back to my week
        </Link>
      </main>
    );
  }

  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes;
  const owned = recipe.ingredients.filter((ingredient) =>
    plan.shoppingList.some((group) =>
      group.items.some(
        (item) => item.productId === ingredient.productId && item.alreadyOwned,
      ),
    ),
  );
  const toBuy = recipe.ingredients.filter(
    (ingredient) => !owned.some((entry) => entry.productId === ingredient.productId),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-ink-muted underline"
        >
          Back
        </button>
      </nav>

      <header className="mt-4">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold tracking-tight text-ink outline-none"
        >
          {recipe.title}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {recipe.servings} servings · {recipe.prepMinutes} min prep ·{" "}
          {recipe.cookMinutes} min cooking ·{" "}
          <span className="font-medium text-ink">{totalMinutes} min total</span>
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Priced from {plan.catalogue.retailerName} · {plan.catalogue.storeName}
        </p>
      </header>

      {recipe.allergenWarnings.length > 0 ? (
        <div
          role="note"
          className="mt-6 rounded-xl border border-warning bg-warning-surface p-4 text-sm text-ink"
        >
          <strong className="font-semibold">Check the packaging.</strong>{" "}
          {recipe.allergenWarnings.join(" ")}
        </div>
      ) : null}

      {recipe.appliances.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Equipment
          </h2>
          <p className="mt-2 text-sm text-ink">
            {recipe.appliances.map((a) => a.replace("-", " ")).join(", ")}
          </p>
        </section>
      ) : null}

      {owned.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            You already have
          </h2>
          <ul className="mt-2 space-y-1">
            {owned.map((ingredient) => (
              <li key={ingredient.productId} className="text-sm text-ink">
                {ingredient.name} · {ingredient.quantity}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          To buy
        </h2>
        <ul className="mt-2 space-y-1">
          {toBuy.map((ingredient) => (
            <li key={ingredient.productId} className="text-sm text-ink">
              {ingredient.name} · {ingredient.quantity} ·{" "}
              <span className="text-ink-muted">
                {formatPence(ingredient.estimatedCostPence)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {recipe.pantryItems.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            From the cupboard
          </h2>
          <p className="mt-2 text-sm text-ink">{recipe.pantryItems.join(", ")}</p>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Method
        </h2>
        <ol className="mt-3 list-decimal space-y-3 pl-5">
          {recipe.steps.map((step, index) => (
            <li key={index} className="text-sm text-ink">
              {step}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 flex gap-3">
        <Link
          to="/week"
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink"
        >
          My week
        </Link>
        <Link
          to="/shopping"
          className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Shopping list
        </Link>
      </div>
    </main>
  );
}
