import { useEffect, useRef,
  type ReactElement,
} from "react";
import type { Retailer, RetailStore } from "../../api/retailers";
import { useRetailers, useStores } from "./useRetailers";

interface RetailerPickerProps {
  retailerId: string | null;
  storeId: string | null;
  onRetailerChange: (retailer: Retailer) => void;
  onStoreChange: (store: RetailStore) => void;
}

/**
 * Choosing the one supermarket a plan is built from.
 *
 * Only active catalogues are offered, and an unavailable one is shown disabled
 * with a reason rather than hidden — a shopper looking for their usual shop
 * needs to know it exists and is temporarily off, not wonder whether they
 * misremembered.
 */
export function RetailerPicker({
  retailerId,
  storeId,
  onRetailerChange,
  onStoreChange,
}: RetailerPickerProps): ReactElement {
  const retailers = useRetailers();
  const selected = retailers.data?.find((entry) => entry.id === retailerId) ?? null;
  const stores = useStores(selected?.requiresStoreSelection ? selected.id : null);

  // Focus moves to the store step when it appears, so a keyboard user is not
  // left at the top of the page wondering what changed.
  const storeHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (selected?.requiresStoreSelection) storeHeadingRef.current?.focus();
  }, [selected?.id, selected?.requiresStoreSelection]);

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
          We could not load the list of supermarkets. Check your connection and try
          again.
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

  const available = retailers.data ?? [];

  if (available.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No supermarkets are set up yet. Run the catalogue bootstrap to add one.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-base font-semibold text-ink">
          Which supermarket do you shop at?
        </legend>
        <p className="mt-1 text-sm text-ink-muted">
          Every recipe, price and shopping-list item comes from the one you pick.
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {available.map((retailer) => (
            <li key={retailer.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  retailer.id === retailerId
                    ? "border-brand bg-brand-surface"
                    : "border-line hover:border-brand"
                } ${retailer.selectable ? "" : "cursor-not-allowed opacity-60"}`}
              >
                <input
                  type="radio"
                  name="retailer"
                  value={retailer.id}
                  checked={retailer.id === retailerId}
                  disabled={!retailer.selectable}
                  onChange={() => onRetailerChange(retailer)}
                  className="mt-1"
                />
                <span>
                  {/* The name, not the logo, is the label: a logo alone is
                      unreadable to a screen reader and invisible in high
                      contrast. */}
                  <span className="block text-sm font-semibold text-ink">
                    {retailer.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {retailer.selectable
                      ? retailer.requiresStoreSelection
                        ? "Prices vary by store"
                        : "One national catalogue"
                      : "Not available for planning right now"}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {selected?.requiresStoreSelection ? (
        <fieldset>
          <legend>
            <h3
              ref={storeHeadingRef}
              tabIndex={-1}
              className="text-base font-semibold text-ink outline-none"
            >
              Which {selected.name} store?
            </h3>
          </legend>
          <p className="mt-1 text-sm text-ink-muted">
            Prices and availability differ between branches.
          </p>

          {stores.isLoading ? (
            <p className="mt-3 text-sm text-ink-muted" role="status">
              Loading stores…
            </p>
          ) : null}

          {stores.isError ? (
            <p role="alert" className="mt-3 text-sm text-danger-ink">
              We could not load the stores for {selected.name}.
            </p>
          ) : null}

          {stores.data?.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">
              No stores are configured for {selected.name} yet.
            </p>
          ) : null}

          <ul className="mt-4 space-y-2">
            {(stores.data ?? []).map((store) => (
              <li key={store.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3">
                  <input
                    type="radio"
                    name="store"
                    value={store.id}
                    checked={store.id === storeId}
                    onChange={() => onStoreChange(store)}
                  />
                  <span className="text-sm text-ink">
                    {store.name}
                    {store.postcode ? (
                      <span className="text-ink-muted"> · {store.postcode}</span>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}
    </div>
  );
}
