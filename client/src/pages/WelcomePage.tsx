import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { useHouseholdProfile } from "../features/profile/useHouseholdProfile";

/**
 * The first screen.
 *
 * Outcome-led and free of sign-up language, because there is no sign-up:
 * generation is anonymous and unmetered, and implying otherwise would cost us
 * the users the open policy exists to serve.
 */
export function WelcomePage(): ReactElement {
  const { hasCompletedSetup } = useHouseholdProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            ThriftChef
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            A week of meals, built to your budget.
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-muted">
            Pick your supermarket, tell us how you cook, and get a week of recipes
            with one shopping list — priced from that shop&rsquo;s real catalogue.
          </p>

          <ul className="mt-8 space-y-2 text-sm text-ink-muted">
            <li>No account, no email, no payment.</li>
            <li>Generate, regenerate and swap meals as often as you like.</li>
            <li>Your budget is a hard limit, not a suggestion.</li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={hasCompletedSetup ? "/plan" : "/setup"}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              {hasCompletedSetup ? "Plan this week" : "Start planning"}
            </Link>
            {hasCompletedSetup ? (
              <Link
                to="/week"
                className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink"
              >
                My week
              </Link>
            ) : null}
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
