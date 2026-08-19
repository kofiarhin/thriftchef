import { Icon, type IconName } from "./Icon";

const STEPS: Array<{ icon: IconName; title: string; detail: string }> = [
  {
    icon: "wallet",
    title: "Set the budget",
    detail: "Your weekly maximum and how much of it to use.",
  },
  {
    icon: "sliders",
    title: "Choose preferences",
    detail: "Meals, appliances, allergies and anything you dislike.",
  },
  {
    icon: "receipt",
    title: "Get the plan and list",
    detail: "Seven days of recipes and one costed shopping list.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="print-hidden border-t border-line/70 bg-surface-sunken/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Three steps
        </p>
        <h2
          id="how-it-works-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
        >
          How it works
        </h2>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative rounded-2xl border border-line bg-surface-raised p-5 transition duration-200 hover:border-brand/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon name={step.icon} size={22} />
                </span>
                <span
                  aria-hidden="true"
                  className="text-3xl font-semibold tabular-nums text-line"
                >
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
