import { useState } from "react";
import type { ShoppingListGroup } from "../api/types";
import { formatPence } from "../format";

interface ShoppingListProps {
  groups: ShoppingListGroup[];
  totalPence: number;
}

export function ShoppingList({ groups, totalPence }: ShoppingListProps) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const itemCount = groups.reduce((total, group) => total + group.items.length, 0);

  const toggle = (productId: string): void => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  return (
    <section aria-labelledby="shopping-list-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Take it to Aldi</p>
          <h3 id="shopping-list-heading" className="mt-2 text-2xl font-semibold text-ink">Shopping list</h3>
          <p className="mt-1 text-sm text-ink-muted">{checked.size} of {itemCount} items checked</p>
        </div>
        <div className="rounded-xl border border-brand/40 bg-brand-soft px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Whole basket</p>
          <p className="text-2xl font-semibold tabular-nums text-ink">{formatPence(totalPence)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <details key={group.category} open className="rounded-xl border border-line bg-surface-raised">
            <summary className="cursor-pointer px-4 py-4 text-sm font-semibold uppercase tracking-wide text-ink">
              {group.category} <span className="ml-2 font-normal text-ink-muted">{group.items.length}</span>
            </summary>
            <ul className="border-t border-line">
              {group.items.map((item) => {
                const isChecked = checked.has(item.productId);
                return (
                  <li key={item.productId} className="border-b border-line/60 last:border-0">
                    <div className={`grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-4 transition ${isChecked ? "opacity-55" : "hover:bg-surface-sunken"}`}>
                      <input type="checkbox" checked={isChecked} onChange={() => toggle(item.productId)} aria-label={`Mark ${item.name} as bought`} className="size-5 accent-brand" />
                      {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" className="size-14 rounded-lg bg-white object-contain" /> : <div className="size-14 rounded-lg border border-line bg-surface-sunken" aria-hidden="true" />}
                      <span className="min-w-0">
                        <a href={item.productUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className={`block font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-brand ${isChecked ? "line-through" : ""}`}>{item.name}</a>
                        <span className="mt-1 block text-xs text-ink-muted">{item.brand ? `${item.brand} · ` : ""}{item.packageSize ?? "Pack size unavailable"} · {item.quantity} pack{item.quantity === 1 ? "" : "s"}</span>
                      </span>
                      <span className="font-semibold tabular-nums text-ink">{formatPence(item.totalPricePence)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
