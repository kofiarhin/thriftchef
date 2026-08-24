import { useState, type ReactElement } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Icon } from "../components/Icon";

export interface ShellDestination {
  to: string;
  label: string;
}

/**
 * The places a user moves between, in the order the work happens: choose a
 * week, read it, shop it, adjust what the device remembers.
 *
 * Routes, not page anchors. An anchor only works on the page that contains the
 * section it names, which made the old navigation dead on every screen except
 * the landing page.
 */
export const SHELL_DESTINATIONS: ShellDestination[] = [
  { to: "/plan", label: "Plan" },
  { to: "/week", label: "My week" },
  { to: "/shopping", label: "Shopping" },
  { to: "/profile", label: "Settings" },
];

export function Wordmark({ size = 22 }: { size?: number }): ReactElement {
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

function destinationClasses({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-surface-raised text-ink"
      : "text-ink-muted hover:bg-surface-raised hover:text-ink"
  }`;
}

/**
 * The one frame every route renders inside.
 *
 * It owns the header, the navigation and the footer, and nothing else: each
 * page still supplies its own `main` and its own heading, so a route stays
 * renderable on its own and there is never a second banner or contentinfo on
 * the page. It holds no plan, profile or catalogue state — those live in the
 * providers above the router, so moving between routes cannot disturb them.
 */
export function AppShell(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="print-hidden sticky top-0 z-30 border-b border-line/80 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="rounded-lg" aria-label="ThriftChef home">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {SHELL_DESTINATIONS.map((destination) => (
              <NavLink
                key={destination.to}
                to={destination.to}
                className={destinationClasses}
              >
                {destination.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="shell-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink md:hidden"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} size={18} />
            Menu
          </button>
        </div>

        {/* Rendered below the bar rather than over it, so an open menu pushes
            the page down instead of covering the content behind it. */}
        <div
          id="shell-navigation"
          hidden={!isMenuOpen}
          className="border-t border-line md:hidden"
        >
          {isMenuOpen ? (
            <nav
              aria-label="Primary, mobile"
              className="mx-auto max-w-5xl px-4 py-3 sm:px-6"
            >
              <ul className="space-y-1">
                {SHELL_DESTINATIONS.map((destination) => (
                  <li key={destination.to}>
                    <NavLink
                      to={destination.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block ${destinationClasses({ isActive })}`
                      }
                    >
                      {destination.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </header>

      {/* A plain wrapper: the page inside supplies the `main` landmark. */}
      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="print-hidden border-t border-line bg-surface-sunken">
        <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 sm:px-6">
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <span className="mt-0.5 shrink-0">
              <Icon name="info" size={13} />
            </span>
            ThriftChef is an independent project and is not affiliated with any
            supermarket. Prices come from a catalogue snapshot and may differ in
            store.
          </p>
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <span className="mt-0.5 shrink-0">
              <Icon name="shield" size={13} />
            </span>
            Allergens are inferred from product wording, not from official
            labelling. Always read the packaging before you cook.
          </p>
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} ThriftChef</p>
        </div>
      </footer>
    </div>
  );
}
