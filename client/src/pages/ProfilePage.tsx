import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useHouseholdProfile } from "../features/profile/useHouseholdProfile";

/**
 * What this device remembers, and how to forget it.
 *
 * The clear control is prominent rather than buried: the profile is stored
 * without an account precisely so the user stays in control of it, and that is
 * only true if erasing it is as easy as creating it.
 */
export function ProfilePage(): ReactElement {
  const { profile, reset } = useHouseholdProfile();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Your settings</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Saved on this device only. No account, and nothing sent to us that identifies
        you.
      </p>

      <dl className="mt-8 space-y-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Household</dt>
          <dd className="text-sm text-ink">{profile.householdSize} people</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Allergies</dt>
          <dd className="text-sm text-ink">
            {profile.allergies.length > 0 ? profile.allergies.join(", ") : "None declared"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">Equipment</dt>
          <dd className="text-sm text-ink">
            {profile.appliances.length > 0
              ? profile.appliances.join(", ")
              : "No-cook only"}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/setup"
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Edit settings
        </Link>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-danger px-4 py-2.5 text-sm font-semibold text-danger-ink"
        >
          Clear everything on this device
        </button>
      </div>
    </main>
  );
}
