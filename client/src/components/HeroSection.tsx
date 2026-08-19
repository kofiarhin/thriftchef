import { Icon, type IconName } from "./Icon";

interface HeroSectionProps {
  onPlanClick: () => void;
}

const BENEFITS: Array<{ icon: IconName; title: string; detail: string }> = [
  { icon: "calendar", title: "Seven days planned", detail: "Every meal, every day" },
  { icon: "price-tag", title: "Real Aldi prices", detail: "Priced from the catalogue" },
  { icon: "basket", title: "One shopping list", detail: "Consolidated by aisle" },
];

/** A decorative sketch of the output, drawn from the same tokens as the app. */
function PlanPreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      aria-hidden="true"
      className="reveal rounded-3xl border border-line bg-gradient-to-br from-surface-raised to-surface-sunken p-5 shadow-elevated sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          <Icon name="calendar" size={14} />
          Your week
        </span>
        <span className="rounded-full border border-brand/40 bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
          £64.20
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((day, index) => (
          <div
            key={day}
            className="rounded-lg border border-line bg-surface p-1.5 text-center"
          >
            <span className="block text-[0.6rem] font-medium text-ink-muted">{day}</span>
            <span
              className="mx-auto mt-1.5 block h-1.5 rounded-full bg-brand"
              style={{ opacity: 0.35 + index * 0.09 }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {[
          { icon: "dinner" as IconName, title: "One-pan chicken and rice", meta: "Serves 2 · 35 min" },
          { icon: "leaf" as IconName, title: "Tomato and lentil stew", meta: "Serves 2 · 30 min" },
        ].map((meal) => (
          <div
            key={meal.title}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5"
          >
            <span className="rounded-lg bg-brand-soft p-1.5 text-brand">
              <Icon name={meal.icon} size={16} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-ink">{meal.title}</span>
              <span className="block text-[0.65rem] text-ink-muted">{meal.meta}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-surface p-2.5">
        <span className="rounded-lg bg-brand-soft p-1.5 text-brand">
          <Icon name="basket" size={16} />
        </span>
        <span className="text-xs font-semibold text-ink">23 items · 1 shopping list</span>
      </div>
    </div>
  );
}

export function HeroSection({ onPlanClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="print-hidden border-b border-line/70"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="reveal min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
            <Icon name="store" size={14} />
            Aldi UK · single store
          </span>

          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
          >
            Seven days of Aldi meals,{" "}
            <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
              planned to your budget
            </span>
          </h1>

          <p className="mt-4 max-w-md text-base text-ink-muted">
            Set a weekly budget. Get a full week of recipes and a single costed
            basket, priced from real Aldi products.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPlanClick}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-on-brand transition hover:brightness-110"
            >
              Start planning
              <Icon name="arrow-right" size={16} />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink-muted hover:bg-surface-raised"
            >
              How it works
              <Icon name="arrow-down" size={16} />
            </a>
          </div>

          <ul className="mt-9 grid gap-3 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-xl border border-line bg-surface-raised p-3.5"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Icon name={benefit.icon} size={16} />
                </span>
                <span className="mt-2.5 block text-sm font-semibold text-ink">
                  {benefit.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  {benefit.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <PlanPreview />
      </div>
    </section>
  );
}
