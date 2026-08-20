import { useEffect, useState,
  type ReactElement,
} from "react";
import { Link } from "react-router-dom";
import { formatPence } from "../format";
import {
  loadCheckedItems,
  saveCheckedItems,
} from "../features/shopping/checklistStorage";
import { usePlan } from "../features/weeklyPlan/usePlan";

/**
 * The shopping companion.
 *
 * Prices and quantities come from the plan snapshot, never from a fresh
 * catalogue read: a shopper standing in an aisle needs the list to say what it
 * said when they generated it. Ticking an item records progress on the device
 * and changes nothing about the plan.
 */
export function ShoppingPage(): ReactElement {
  const { plan } = usePlan();
  const planId = plan?.planId ?? null;
  const [checked, setChecked] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (planId) setChecked(loadCheckedItems(planId));
  }, [planId]);

  if (!plan) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">No shopping list yet</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Generate a week and its list will appear here.
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

  const items = plan.shoppingList.flatMap((group) => group.items);
  const toBuy = items.filter((item) => !item.alreadyOwned);
  const remainingPence = toBuy
    .filter((item) => !checked.has(item.productId))
    .reduce((total, item) => total + item.totalPricePence, 0);

  function toggle(productId: string): void {
    const next = new Set(checked);
    if (next.has(productId)) next.delete(productId);
    else next.add(productId);

    setChecked(next);
    if (planId) saveCheckedItems(planId, next);
  }

  const done = toBuy.filter((item) => checked.has(item.productId)).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Shopping list</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {plan.catalogue.retailerName} · {plan.catalogue.storeName}
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-line p-4">
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">
            {formatPence(plan.estimatedTotalPence)}
          </span>{" "}
          estimated · <span className="font-semibold text-ink">
            {formatPence(remainingPence)}
          </span>{" "}
          still to buy
        </p>
        <progress
          value={done}
          max={Math.max(1, toBuy.length)}
          aria-label={`${done} of ${toBuy.length} items collected`}
          className="mt-3 w-full"
        />
      </div>

      {plan.shoppingList.map((group) => (
        <section key={group.category} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {group.category}
          </h2>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => (
              <li key={item.productId}>
                <label className="flex items-start gap-3 rounded-lg border border-line p-3">
                  <input
                    type="checkbox"
                    checked={checked.has(item.productId)}
                    onChange={() => toggle(item.productId)}
                    className="mt-1"
                    aria-label={`Collected ${item.name}`}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {item.quantity} ×{" "}
                      {item.packageSize ? `${item.packageSize} · ` : ""}
                      {formatPence(item.unitPricePence)}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {item.alreadyOwned ? (
                      <span className="text-xs font-normal text-ink-muted">
                        Already have
                      </span>
                    ) : (
                      formatPence(item.totalPricePence)
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
