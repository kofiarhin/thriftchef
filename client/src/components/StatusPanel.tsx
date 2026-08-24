import type { CatalogueStatus } from "../api/types";
import { Icon, type IconName } from "./Icon";

export type CatalogueState = "loading" | "error" | "empty" | "stale" | "ready";

interface StatusPanelProps {
  status: CatalogueStatus | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface StateVisual {
  label: string;
  icon: IconName;
  /** Semantic token classes; no raw palette shades reach a component. */
  tone: string;
}

const STATE_VISUALS: Record<CatalogueState, StateVisual> = {
  loading: {
    label: "Checking",
    icon: "clock",
    tone: "border-line bg-surface-sunken text-ink-muted",
  },
  error: {
    label: "Catalogue unavailable",
    icon: "x-circle",
    tone: "border-danger bg-danger-surface text-danger-ink",
  },
  empty: {
    label: "No products",
    icon: "alert-circle",
    tone: "border-danger bg-danger-surface text-danger-ink",
  },
  stale: {
    label: "Stale",
    icon: "alert-circle",
    tone: "border-warning bg-warning-surface text-warning-ink",
  },
  ready: {
    label: "Ready",
    icon: "check-circle",
    tone: "border-brand bg-brand-soft text-brand",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 py-2 last:border-0">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function Notice({
  tone,
  icon,
  children,
}: {
  tone: "danger" | "warning" | "muted";
  icon: IconName;
  children: React.ReactNode;
}) {
  const tones = {
    danger: "border-danger bg-danger-surface text-danger-ink",
    warning: "border-warning bg-warning-surface text-warning-ink",
    muted: "border-line bg-surface-sunken text-ink-muted",
  } as const;

  return (
    <div className={`mt-3 flex gap-2.5 rounded-xl border px-3 py-2.5 text-xs leading-relaxed ${tones[tone]}`}>
      <span className="mt-0.5 shrink-0">
        <Icon name={icon} size={14} />
      </span>
      <div>{children}</div>
    </div>
  );
}

/**
 * The command that fills this retailer's catalogue.
 *
 * A lookup rather than a string built from the slug: telling someone to run a
 * script that does not exist is worse than telling them nothing, and each
 * retailer's crawl command is a real entry in package.json.
 */
const CRAWL_COMMANDS: Record<string, string> = {
  "aldi-uk": "npm run aldi:crawl",
  "tesco-uk": "npm run tesco:crawl",
};

/**
 * Shows whether the catalogue can support planning at all. This is the first
 * thing to check when a plan fails, so it stays on the page rather than being
 * hidden behind a link — but as a compact card, not a wall of prose.
 *
 * Every label naming the shop reads from the status rather than being written
 * into the component: with more than one retailer, a hard-coded name tells
 * some shoppers their prices came from a supermarket they did not choose.
 */
export function StatusPanel({ status, isLoading, error }: StatusPanelProps) {
  const state: CatalogueState = error
    ? "error"
    : isLoading || !status
      ? "loading"
      : status.eligibleProducts === 0
        ? "empty"
        : status.isStale
          ? "stale"
          : "ready";
  const visual = STATE_VISUALS[state];

  return (
    <aside
      aria-labelledby="catalogue-status-heading"
      className="rounded-2xl border border-line bg-surface-raised p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="catalogue-status-heading"
          className="flex items-center gap-2 text-sm font-semibold text-ink"
        >
          <span className="text-brand">
            <Icon name="store" size={16} />
          </span>
          {status ? `${status.retailerName} catalogue` : "Catalogue"}
        </h2>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${visual.tone}`}
        >
          <Icon name={visual.icon} size={13} />
          {visual.label}
        </span>
      </div>

      <div aria-live="polite" className="mt-4">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Checking the catalogue…</p>
        ) : null}

        {error ? (
          <div role="alert" className="text-sm">
            <p className="font-medium text-danger-ink">
              Could not read the catalogue status.
            </p>
            <p className="mt-1 text-xs text-ink-muted">{error.message}</p>
          </div>
        ) : null}

        {status && !isLoading && !error ? (
          <>
            <dl>
              {/* The scope's name, not its id: "Tesco Online (delivery)"
                  says what was priced; an ObjectId says nothing. */}
              <Row label="Store" value={status.storeName} />
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
              <Notice tone="danger" icon="alert-circle">
                <p role="alert">
                  No products are available yet.
                  {CRAWL_COMMANDS[status.retailer] ? (
                    <>
                      {" "}
                      Run{" "}
                      <code className="rounded bg-surface-sunken px-1 font-mono">
                        {CRAWL_COMMANDS[status.retailer]}
                      </code>{" "}
                      to populate the catalogue.
                    </>
                  ) : (
                    " Run this retailer's catalogue crawl to populate it."
                  )}
                </p>
              </Notice>
            ) : null}

            {status.isStale && status.eligibleProducts > 0 ? (
              <Notice tone="warning" icon="clock">
                This catalogue is more than three days old. Prices may have
                changed.
              </Notice>
            ) : null}

            {status.safetyBreakdown.verified === 0 &&
            status.eligibleProducts > 0 ? (
              <Notice tone="muted" icon="shield">
                {status.retailerName} publishes no allergen labels for these
                products, so allergens for all{" "}
                {status.eligibleProducts.toLocaleString("en-GB")} of them are
                inferred from product wording. Always check the packaging.
              </Notice>
            ) : null}
          </>
        ) : null}
      </div>
    </aside>
  );
}
