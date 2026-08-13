import type { ShoppingListGroup } from "../api/types";
import { formatPence } from "../format";

interface ShoppingListProps {
  groups: ShoppingListGroup[];
  totalPence: number;
}

export function ShoppingList({ groups, totalPence }: ShoppingListProps) {
  const itemCount = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <section aria-labelledby="shopping-list-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="shopping-list-heading" className="text-xl font-semibold text-ink">
          Shopping list
        </h3>
        <p className="text-sm text-ink-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
          <span className="font-semibold text-ink">{formatPence(totalPence)}</span>
        </p>
      </div>

      <div className="mt-4 space-y-6">
        {groups.map((group) => (
          <div key={group.category} className="print-break-inside-avoid">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              {group.category}
            </h4>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Product
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Size
                    </th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">
                      Qty
                    </th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">
                      Unit
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={item.productId} className="border-b border-line/60">
                      <td className="py-2 pr-3">
                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-brand"
                        >
                          {item.name}
                        </a>
                        {item.brand ? (
                          <span className="block text-xs text-ink-muted">
                            {item.brand}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-3 text-ink-muted">
                        {item.packageSize ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums text-ink-muted">
                        {formatPence(item.unitPricePence)}
                      </td>
                      <td className="py-2 text-right font-medium tabular-nums">
                        {formatPence(item.totalPricePence)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-line pt-3 text-right text-sm">
        <span className="text-ink-muted">Estimated basket total: </span>
        <span className="text-lg font-semibold text-ink">
          {formatPence(totalPence)}
        </span>
      </p>
    </section>
  );
}
