import { useState, type FormEvent } from "react";
import {
  APPLIANCES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  PANTRY_BASICS,
  UK_ALLERGENS,
  type Allergen,
  type Appliance,
  type MealPlanRequest,
  type MealPreference,
  type MealType,
  type PantryBasic,
} from "../api/types";
import {
  MAX_BUDGET_POUNDS,
  MIN_BUDGET_POUNDS,
  validateConstraints,
  type ConstraintFormState,
  type FieldName,
  type ValidationIssues,
} from "../constraints";
import { CheckboxGroup, TextField } from "./PreferenceControls";

interface ConstraintFormProps {
  state: ConstraintFormState;
  onStateChange: (state: ConstraintFormState) => void;
  onSubmit: (request: MealPlanRequest) => void;
  isGenerating: boolean;
  serverIssues?: ValidationIssues;
}

const STEPS = ["Household", "Food", "Kitchen"] as const;
const STEP_FIELDS: FieldName[][] = [
  ["budgetPounds", "householdSize", "mealsPerDay"],
  ["mealPreferences", "cuisinePreferences", "allergies", "dislikedIngredients"],
  ["appliances", "pantryBasics"],
];

const ALLERGEN_LABELS: Partial<Record<Allergen, string>> = {
  "tree nuts": "Tree nuts",
};

function hasStepIssues(issues: ValidationIssues, step: number): boolean {
  return STEP_FIELDS[step].some((field) => Boolean(issues[field]));
}

export function ConstraintForm({
  state,
  onStateChange,
  onSubmit,
  isGenerating,
  serverIssues,
}: ConstraintFormProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const validation = validateConstraints(state);
  const issues: ValidationIssues = {
    ...(submitted ? validation.issues : {}),
    ...serverIssues,
  };

  const update = <K extends keyof ConstraintFormState>(
    key: K,
    value: ConstraintFormState[K],
  ): void => onStateChange({ ...state, [key]: value });

  const continueToNextStep = (): void => {
    setSubmitted(true);
    if (hasStepIssues(validation.issues, step)) return;
    setSubmitted(false);
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      continueToNextStep();
      return;
    }

    setSubmitted(true);
    if (validation.request) onSubmit(validation.request);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav aria-label="Planning progress" className="mb-8">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => index < step && setStep(index)}
                disabled={index > step || isGenerating}
                aria-current={index === step ? "step" : undefined}
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  index === step
                    ? "border-brand bg-brand-soft text-ink"
                    : index < step
                      ? "border-line bg-surface-raised text-ink"
                      : "border-line/70 bg-surface-sunken text-ink-muted opacity-70"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wider">
                  Step {index + 1}
                </span>
                <span className="mt-1 block text-sm font-semibold">{label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-h-[25rem] rounded-2xl border border-line bg-surface-raised p-5 sm:p-8">
        {step === 0 ? (
          <section aria-labelledby="household-step" className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Your week</p>
              <h3 id="household-step" className="mt-2 text-xl font-semibold text-ink">Start with the essentials</h3>
              <p className="mt-1 text-sm text-ink-muted">We will price every retail pack needed for seven days.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Weekly budget" hint={`The complete basket, between £${MIN_BUDGET_POUNDS} and £${MAX_BUDGET_POUNDS}.`} value={state.budgetPounds} onChange={(value) => update("budgetPounds", value)} error={issues.budgetPounds} type="number" inputMode="decimal" min={MIN_BUDGET_POUNDS} max={MAX_BUDGET_POUNDS} step="0.01" prefix="£" />
              <TextField label="Household size" hint="How many people each recipe should serve." value={state.householdSize} onChange={(value) => update("householdSize", value)} error={issues.householdSize} type="number" inputMode="numeric" min={1} max={10} step="1" />
            </div>
            <CheckboxGroup<MealType> legend="Meals to plan each day" hint="Every selected meal is planned for all seven days." options={MEAL_TYPES} selected={state.mealsPerDay} onChange={(value) => update("mealsPerDay", value)} error={issues.mealsPerDay} />
          </section>
        ) : null}

        {step === 1 ? (
          <section aria-labelledby="food-step" className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Your food</p>
              <h3 id="food-step" className="mt-2 text-xl font-semibold text-ink">Make the plan feel like yours</h3>
            </div>
            <CheckboxGroup<MealPreference> legend="Meal preferences" hint="Optional. These guide NVIDIA when composing the recipes." options={MEAL_PREFERENCES} selected={state.mealPreferences} onChange={(value) => update("mealPreferences", value)} error={issues.mealPreferences} />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Cuisine preferences" hint="Separate with commas, for example: Ghanaian, British." value={state.cuisinePreferences} onChange={(value) => update("cuisinePreferences", value)} error={issues.cuisinePreferences} />
              <TextField label="Disliked ingredients" hint="Separate with commas, for example: olives, mushrooms." value={state.dislikedIngredients} onChange={(value) => update("dislikedIngredients", value)} error={issues.dislikedIngredients} />
            </div>
            <CheckboxGroup<Allergen> legend="Allergies to avoid" hint="Aldi allergen data is inferred. Always verify the packaging." options={UK_ALLERGENS} selected={state.allergies} onChange={(value) => update("allergies", value)} error={issues.allergies} labels={ALLERGEN_LABELS} />
          </section>
        ) : null}

        {step === 2 ? (
          <section aria-labelledby="kitchen-step" className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Your kitchen</p>
              <h3 id="kitchen-step" className="mt-2 text-xl font-semibold text-ink">Finish your setup</h3>
            </div>
            <CheckboxGroup<Appliance> legend="Cooking appliances available" hint="Clear every option to request no-cook meals only." options={APPLIANCES} selected={state.appliances} onChange={(value) => update("appliances", value)} error={issues.appliances} />
            <CheckboxGroup<PantryBasic> legend="Already have at home" hint="Only selected basics may be used without appearing in the basket." options={PANTRY_BASICS} selected={state.pantryBasics} onChange={(value) => update("pantryBasics", value)} error={issues.pantryBasics} />
            <div className="rounded-xl border border-line bg-surface-sunken p-4 text-sm text-ink-muted">
              <p className="font-semibold text-ink">Ready to generate</p>
              <p className="mt-1">{state.householdSize || "0"} people · £{state.budgetPounds || "0"} · {state.mealsPerDay.length} meal type{state.mealsPerDay.length === 1 ? "" : "s"} per day</p>
            </div>
          </section>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={() => { setSubmitted(false); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0 || isGenerating} className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink disabled:invisible">Back</button>
        <button type="submit" disabled={isGenerating} className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-on-brand transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {isGenerating ? "Generating with NVIDIA…" : step === STEPS.length - 1 ? "Generate my plan" : "Continue"}
        </button>
      </div>
    </form>
  );
}
