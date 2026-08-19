import { useEffect, useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../api/products";
import type { ProductSearchItem } from "../api/types";
import { MAX_MUST_HAVE_ITEMS } from "../constraints";
import { formatPence } from "../format";

/**
 * Long enough that a typed word is not searched letter by letter, short enough
 * that the results feel like they belong to what was just typed.
 */
export const SEARCH_DEBOUNCE_MS = 300;

const RESULTS_PER_PAGE = 10;

function useDebounced<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return settled;
}

interface MustHaveSelectorProps {
  selected: ProductSearchItem[];
  onChange: (selected: ProductSearchItem[]) => void;
  error?: string;
}

export function MustHaveSelector({
  selected,
  onChange,
  error,
}: MustHaveSelectorProps) {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounced(term, SEARCH_DEBOUNCE_MS);
  const inputId = useId();
  const statusId = useId();
  const errorId = useId();

  const results = useQuery({
    queryKey: ["product-search", debouncedTerm],
    queryFn: () =>
      searchProducts({ search: debouncedTerm, limit: RESULTS_PER_PAGE }),
    // Only search once the user has typed something worth searching for.
    enabled: debouncedTerm.trim().length >= 2,
  });

  const selectedIds = new Set(selected.map((product) => product.id));
  const atLimit = selected.length >= MAX_MUST_HAVE_ITEMS;
  const subtotalPence = selected.reduce(
    (total, product) => total + product.pricePence,
    0,
  );

  const add = (product: ProductSearchItem): void => {
    if (atLimit || selectedIds.has(product.id)) return;
    onChange([...selected, product]);
  };

  const remove = (productId: string): void =>
    onChange(selected.filter((product) => product.id !== productId));

  const statusMessage = (): string => {
    if (debouncedTerm.trim().length < 2) return "Type at least two characters to search.";
    if (results.isPending) return "Searching the Aldi catalogue…";
    if (results.isError) return "Product search is unavailable. Try again in a moment.";
    if (results.data.total === 0) return `No products match “${debouncedTerm}”.`;
    return `${results.data.total} product${results.data.total === 1 ? "" : "s"} match “${debouncedTerm}”. Showing the first ${results.data.items.length}.`;
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
          Search Aldi products
        </label>
        <p className="mt-1 text-sm text-ink-muted">
          Anything you add here is bought as part of this week's basket and used
          by at least one recipe.
        </p>
        <input
          id={inputId}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="For example: chicken, rice, cheddar"
          autoComplete="off"
          aria-describedby={`${statusId}${error ? ` ${errorId}` : ""}`}
          aria-invalid={error ? true : undefined}
          className="mt-3 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink"
        />
      </div>

      <p id={statusId} role="status" aria-live="polite" className="text-sm text-ink-muted">
        {statusMessage()}
      </p>

      {results.isSuccess && results.data.items.length > 0 ? (
        <ul aria-label="Search results" className="space-y-2">
          {results.data.items.map((product) => {
            const isSelected = selectedIds.has(product.id);

            return (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-raised p-3"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">
                    {product.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {product.category} · {formatPence(product.pricePence)}
                    {product.packageSize ? ` · ${product.packageSize}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => add(product)}
                  disabled={isSelected || atLimit}
                  // The visible label stays short; the accessible name names the
                  // product, so a screen-reader user is never offered a list of
                  // identical "Add" buttons.
                  aria-label={isSelected ? `${product.name} added` : `Add ${product.name}`}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSelected ? "Added" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div>
        <h4 className="text-sm font-semibold text-ink">
          Must-have items ({selected.length} of {MAX_MUST_HAVE_ITEMS})
        </h4>

        {selected.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">
            Nothing selected yet. This step is optional.
          </p>
        ) : (
          <>
            <ul aria-label="Selected must-have products" className="mt-2 space-y-2">
              {selected.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand bg-brand-soft p-3"
                >
                  <span className="text-sm font-semibold text-ink">
                    {product.name}
                    <span className="ml-2 font-normal text-ink-muted">
                      {formatPence(product.pricePence)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-muted">
              Must-have subtotal:{" "}
              <span className="font-semibold tabular-nums text-ink">
                {formatPence(subtotalPence)}
              </span>
            </p>
          </>
        )}

        {atLimit ? (
          <p role="status" className="mt-2 text-sm text-ink-muted">
            That is the maximum of {MAX_MUST_HAVE_ITEMS} must-have products.
            Remove one to add another.
          </p>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
