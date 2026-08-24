import type { ReactElement } from "react";
import type { Retailer } from "../../api/retailers";
import { useRetailers } from "./useRetailers";

interface RetailerPickerProps {
  retailerId: string | null;
  onRetailerChange: (retailer: Retailer) => void;
  /** Remove the outer card chrome when a parent step already provides it. */
  embedded?: boolean;
}

/**
 * The one supermarket a plan uses.
 *
 * The MVP exposes active retailers only. Store resolution belongs to the
 * backend: each retailer has one configured catalogue, so shoppers choose
 * Aldi or Tesco and nothing else.
 */
export function RetailerPicker({
  retailerId,
  onRetailerChange,
  embedded = false,
}: RetailerPickerProps): ReactElement {
  const retailers = useRetailers();

  if (retailers.isLoading) {
    return (
      <p className="text-sm text-ink-muted" role="status">
        Loading supermarkets…
      </p>
    );
  }

  if (retailers.isError) {
    return (
      <div role="alert" className="rounded-xl border border-danger bg-danger-surface p-4">
        <p className="text-sm text-danger-ink">
          We could not load the supermarkets. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => void retailers.refetch()}
          className="mt-3 rounded-lg border border-danger px-3 py-1.5 text-sm font-medium text-danger-ink"
        >
          Try again
        </button>
      </div>
    );
  }

  const available = (retailers.data ?? []).filter((retailer) => retailer.selectable);

  if (available.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No supermarkets are available yet. Try again later.
      </p>
    );
  }

  return (
    <fieldset
      className={
        embedded
          ? ""
          : "rounded-2xl border border-line bg-surface-raised p-5 shadow-elevated sm:p-7"
      }
    >
      <legend className={embedded ? "sr-only" : "px-1 text-base font-semibold text-ink"}>
        Choose your supermarket
      </legend>
      {!embedded ? (
        <p className="mt-1 text-sm text-ink-muted">
          Every product, price and shopping-list item comes from this supermarket.
        </p>
      ) : null}

      <ul className={`${embedded ? "" : "mt-4 "}grid gap-3 sm:grid-cols-2`}>
        {available.map((retailer) => (
          <li key={retailer.id}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                retailer.id === retailerId
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-surface-sunken hover:border-brand"
              }`}
            >
              <input
                type="radio"
                name="retailer"
                value={retailer.id}
                checked={retailer.id === retailerId}
                onChange={() => onRetailerChange(retailer)}
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {retailer.name}
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  Use {retailer.name} products and prices
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
