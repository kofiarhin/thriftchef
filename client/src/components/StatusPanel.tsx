import type { CatalogueStatus } from "../api/types";

interface StatusPanelProps {
  status: CatalogueStatus | undefined;
  isLoading: boolean;
  error: Error | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-ink">{value}</dd>
    </div>
  );
}

/**
 * Shows whether the catalogue can support planning at all. This is the first
 * thing to check when a plan fails, so it stays visible beside the form.
 */
export function StatusPanel({ status, isLoading, error }: StatusPanelProps) {
  return (
    <aside
      aria-labelledby="catalogue-status-heading"
      className="rounded-lg border border-line bg-surface-raised p-5"
    >
      <h2
        id="catalogue-status-heading"
        className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
      >
        Catalogue status
      </h2>

      <div aria-live="polite" className="mt-3">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Checking the Aldi catalogue…</p>
        ) : null}

        {error ? (
          <div role="alert" className="text-sm">
            <p className="font-medium text-danger-ink">
              Could not read the catalogue status.
            </p>
            <p className="mt-1 text-ink-muted">{error.message}</p>
          </div>
        ) : null}

        {status && !isLoading && !error ? (
          <>
            <dl className="space-y-1.5">
              <Row label="Store" value={status.storeId} />
              <Row
                label="Products available"
                value={status.availableProducts.toLocaleString("en-GB")}
              />
              <Row
                label="Usable for planning"
                value={status.eligibleProducts.toLocaleString("en-GB")}
              />
              <Row
                label="Last refreshed"
                value={
                  status.lastCheckedAt
                    ? new Date(status.lastCheckedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Never"
                }
              />
            </dl>

            {status.eligibleProducts === 0 ? (
              <p role="alert" className="mt-3 rounded-md border border-danger bg-danger-surface px-3 py-2 text-sm text-danger-ink">
                No products are available yet. Run{" "}
                <code className="font-mono text-xs">npm run aldi:crawl</code> to
                populate the catalogue.
              </p>
            ) : null}

            {status.isStale && status.eligibleProducts > 0 ? (
              <p className="mt-3 rounded-md border border-warning bg-warning-surface px-3 py-2 text-sm text-warning-ink">
                This catalogue is more than three days old. Prices may have
                changed.
              </p>
            ) : null}

            {status.safetyBreakdown.verified === 0 &&
            status.eligibleProducts > 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                Aldi publishes no allergen labels, so allergens for all{" "}
                {status.eligibleProducts.toLocaleString("en-GB")} products are
                inferred from product wording. Always check the packaging.
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </aside>
  );
}
