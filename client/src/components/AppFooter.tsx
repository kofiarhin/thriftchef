import { NAV_TARGETS, Wordmark } from "./AppHeader";
import { Icon } from "./Icon";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="print-hidden border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              Weekly meal plans and one Aldi shopping list, built to a budget.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              On this page
            </h2>
            <ul className="mt-3 space-y-2">
              {NAV_TARGETS.map((target) => (
                <li key={target.id}>
                  <a
                    href={`#${target.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
                  >
                    <Icon name="arrow-right" size={13} />
                    {target.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-9 space-y-2 border-t border-line pt-6">
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <span className="mt-0.5 shrink-0">
              <Icon name="info" size={13} />
            </span>
            ThriftChef is an independent project and is not affiliated with Aldi.
            Prices come from a catalogue snapshot and may differ in store.
          </p>
          <p className="flex gap-2 text-xs leading-relaxed text-ink-muted">
            <span className="mt-0.5 shrink-0">
              <Icon name="shield" size={13} />
            </span>
            Allergens are inferred from product wording, not from official
            labelling. Always read the packaging before you cook.
          </p>
        </div>

        <p className="mt-6 text-xs text-ink-muted">
          © {year} ThriftChef
        </p>
      </div>
    </footer>
  );
}
