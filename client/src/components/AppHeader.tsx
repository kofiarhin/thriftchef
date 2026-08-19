import { useState } from "react";
import type { CatalogueStatus } from "../api/types";
import { Icon } from "./Icon";
import { CatalogueBadge, type CatalogueState } from "./StatusPanel";

export interface NavTarget {
  id: string;
  label: string;
}

/** The three in-page destinations, shared by the header and the footer. */
export const NAV_TARGETS: NavTarget[] = [
  { id: "planner", label: "Planner" },
  { id: "how-it-works", label: "How it works" },
  { id: "catalogue", label: "Catalogue" },
];

interface AppHeaderProps {
  status: CatalogueStatus | undefined;
  isLoading: boolean;
  error: Error | null;
  onPlanClick: () => void;
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-on-brand shadow-brand-glow">
        <Icon name="logo" size={size} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink">
        Thrift<span className="text-brand">Chef</span>
      </span>
    </span>
  );
}

export function catalogueStateFrom(
  status: CatalogueStatus | undefined,
  isLoading: boolean,
  error: Error | null,
): CatalogueState {
  if (error) return "error";
  if (isLoading || !status) return "loading";
  if (status.eligibleProducts === 0) return "empty";
  return status.isStale ? "stale" : "ready";
}

/**
 * One page, so navigation is a set of in-page anchors rather than a router.
 * The links stay real anchors — they work without JavaScript, they can be
 * opened in a new tab, and they land on sections that are always rendered.
 */
export function AppHeader({ status, isLoading, error, onPlanClick }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const state = catalogueStateFrom(status, isLoading, error);

  return (
    <header className="print-hidden sticky top-0 z-30 border-b border-line/80 bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#planner" className="rounded-lg" aria-label="ThriftChef home">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_TARGETS.map((target) => (
            <a
              key={target.id}
              href={`#${target.id}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-raised hover:text-ink"
            >
              {target.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <CatalogueBadge state={state} status={status} />
          </span>

          <button
            type="button"
            onClick={onPlanClick}
            className="hidden items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:brightness-110 sm:flex"
          >
            Plan my week
            <Icon name="arrow-right" size={16} />
          </button>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink md:hidden"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} size={18} />
            Menu
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        hidden={!isMenuOpen}
        className="border-t border-line md:hidden"
      >
        {isMenuOpen ? (
        <nav aria-label="Primary, mobile" className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <ul className="space-y-1">
            {NAV_TARGETS.map((target) => (
              <li key={target.id}>
                <a
                  href={`#${target.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-raised hover:text-ink"
                >
                  {target.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
            <CatalogueBadge state={state} status={status} />
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onPlanClick();
              }}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-on-brand"
            >
              Plan my week
            </button>
          </div>
        </nav>
        ) : null}
      </div>
    </header>
  );
}
