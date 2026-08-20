import { useEffect, useRef, useState,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router-dom";
import { UK_ALLERGENS, APPLIANCES, COOKING_APPLIANCES } from "../api/types";
import type { Allergen, Appliance } from "../api/types";
import { RetailerPicker } from "../features/retailers/RetailerPicker";
import { useHouseholdProfile } from "../features/profile/useHouseholdProfile";

const STEPS = ["Supermarket", "Household", "Allergies", "Equipment"] as const;
type Step = (typeof STEPS)[number];

/**
 * First-time setup.
 *
 * Four steps, each of which changes what the planner actually does — nothing
 * is collected to be filed away. Allergies are a hard exclusion and are kept
 * visually and structurally apart from dislikes, which are a preference: a
 * user must never be able to mistake one control for the other.
 */
export function OnboardingPage(): ReactElement {
  const navigate = useNavigate();
  const { profile, update } = useHouseholdProfile();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  // Focus follows the step, or a keyboard user stays at the bottom of the page
  // while the content above them silently changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const current: Step = STEPS[step];

  function next(): void {
    if (current === "Supermarket" && !profile.defaultRetailerId) {
      setError("Choose a supermarket to carry on.");
      return;
    }

    setError(null);

    if (step === STEPS.length - 1) {
      navigate("/plan");
      return;
    }

    setStep(step + 1);
  }

  function toggle<T extends string>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((entry) => entry !== value)
      : [...list, value];
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Step {step + 1} of {STEPS.length}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-2xl font-semibold tracking-tight text-ink outline-none"
      >
        {current}
      </h1>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger-ink">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        {current === "Supermarket" ? (
          <RetailerPicker
            retailerId={profile.defaultRetailerId}
            storeId={profile.defaultStoreId}
            onRetailerChange={(retailer) =>
              update({
                defaultRetailerId: retailer.id,
                // Changing supermarket invalidates the store: a branch of one
                // shop is not a branch of another.
                defaultStoreId: null,
              })
            }
            onStoreChange={(store) => update({ defaultStoreId: store.id })}
          />
        ) : null}

        {current === "Household" ? (
          <div>
            <label htmlFor="household-size" className="text-base font-semibold text-ink">
              How many people are you cooking for?
            </label>
            <p className="mt-1 text-sm text-ink-muted">
              Recipes are scaled to this, and so are the pack sizes on your list.
            </p>
            <input
              id="household-size"
              type="number"
              min={1}
              max={10}
              value={profile.householdSize}
              onChange={(event) =>
                update({ householdSize: Number(event.target.value) || 1 })
              }
              className="mt-4 w-28 rounded-lg border border-line px-3 py-2 text-lg"
            />
          </div>
        ) : null}

        {current === "Allergies" ? (
          <fieldset>
            <legend className="text-base font-semibold text-ink">
              Any allergies we must plan around?
            </legend>
            <div
              role="note"
              className="mt-3 rounded-xl border border-warning bg-warning-surface p-4 text-sm text-ink"
            >
              <strong className="font-semibold">Always check the packaging.</strong>{" "}
              Allergen data is inferred from product descriptions, not read from a
              label. We exclude conflicts conservatively, but inference can miss
              things. Do not rely on this plan for allergy safety.
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {UK_ALLERGENS.map((allergen) => (
                <li key={allergen}>
                  <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={profile.allergies.includes(allergen)}
                      onChange={() =>
                        update({
                          allergies: toggle(
                            profile.allergies as Allergen[],
                            allergen,
                          ),
                        })
                      }
                    />
                    {allergen}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ) : null}

        {current === "Equipment" ? (
          <fieldset>
            <legend className="text-base font-semibold text-ink">
              What can you cook with?
            </legend>
            <p className="mt-1 text-sm text-ink-muted">
              Recipes needing something you do not have are never suggested. Clear
              them all for no-cook meals only.
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {APPLIANCES.map((appliance) => (
                <li key={appliance}>
                  <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={profile.appliances.includes(appliance)}
                      onChange={() =>
                        update({
                          appliances: toggle(
                            profile.appliances as Appliance[],
                            appliance,
                          ),
                        })
                      }
                    />
                    {appliance.replace("-", " ")}
                    {COOKING_APPLIANCES.includes(appliance) ? null : (
                      <span className="text-xs text-ink-muted">(not for cooking)</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ) : null}
      </div>

      <div className="mt-10 flex gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={next}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          {step === STEPS.length - 1 ? "Plan my week" : "Continue"}
        </button>
      </div>
    </main>
  );
}
