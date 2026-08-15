import { useState, type FormEvent } from "react";
import {
  APPLIANCES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  UK_ALLERGENS,
  type Allergen,
  type Appliance,
  type MealPlanRequest,
  type MealPreference,
  type MealType,
} from "../api/types";
import {
  MAX_BUDGET_POUNDS,
  MIN_BUDGET_POUNDS,
  validateConstraints,
  type ConstraintFormState,
  type ValidationIssues,
} from "../constraints";
import { CheckboxGroup, TextField } from "./PreferenceControls";

interface ConstraintFormProps {
  state: ConstraintFormState;
  onStateChange: (state: ConstraintFormState) => void;
  onSubmit: (request: MealPlanRequest) => void;
  isGenerating: boolean;
  /** Field problems reported by the server after a rejected submission. */
  serverIssues?: ValidationIssues;
}

const ALLERGEN_LABELS: Partial<Record<Allergen, string>> = {
  "tree nuts": "Tree nuts",
};

export function ConstraintForm({
  state,
  onStateChange,
  onSubmit,
  isGenerating,
  serverIssues,
}: ConstraintFormProps) {
  // Errors appear only after a submission attempt, so the form does not scold
  // the user while they are still filling it in.
  const [submitted, setSubmitted] = useState(false);

  const validation = validateConstraints(state);
  const issues: ValidationIssues = {
    ...(submitted ? validation.issues : {}),
    ...serverIssues,
  };

  const update = <K extends keyof ConstraintFormState>(
    key: K,
    value: ConstraintFormState[K],
  ): void => {
    onStateChange({ ...state, [key]: value });
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setSubmitted(true);

    if (validation.request) onSubmit(validation.request);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Weekly budget"
          hint={`The whole basket, between £${MIN_BUDGET_POUNDS} and £${MAX_BUDGET_POUNDS}.`}
          value={state.budgetPounds}
          onChange={(value) => update("budgetPounds", value)}
          error={issues.budgetPounds}
          type="number"
          inputMode="decimal"
          min={MIN_BUDGET_POUNDS}
          max={MAX_BUDGET_POUNDS}
          step="0.01"
          prefix="£"
        />

        <TextField
          label="Household size"
          hint="How many people each recipe should serve."
          value={state.householdSize}
          onChange={(value) => update("householdSize", value)}
          error={issues.householdSize}
          type="number"
          inputMode="numeric"
          min={1}
          max={10}
          step="1"
        />
      </section>

      <CheckboxGroup<MealType>
        legend="Meals to plan each day"
        hint="Every selected meal is planned for all seven days."
        options={MEAL_TYPES}
        selected={state.mealsPerDay}
        onChange={(value) => update("mealsPerDay", value)}
        error={issues.mealsPerDay}
      />

      <CheckboxGroup<Appliance>
        legend="Cooking appliances available"
        hint="Clear every option to plan no-cook meals only."
        options={APPLIANCES}
        selected={state.appliances}
        onChange={(value) => update("appliances", value)}
        error={issues.appliances}
      />

      <CheckboxGroup<MealPreference>
        legend="Meal preferences"
        hint="Optional. Guides the style of the recipes."
        options={MEAL_PREFERENCES}
        selected={state.mealPreferences}
        onChange={(value) => update("mealPreferences", value)}
        error={issues.mealPreferences}
      />

      <CheckboxGroup<Allergen>
        legend="Allergies to avoid"
        hint="Products whose allergens conflict are removed before planning. Aldi does not publish allergen labels, so this is based on inference and is not a guarantee."
        options={UK_ALLERGENS}
        selected={state.allergies}
        onChange={(value) => update("allergies", value)}
        error={issues.allergies}
        labels={ALLERGEN_LABELS}
      />

      <section className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Cuisine preferences"
          hint="Optional. Separate with commas, for example: Italian, Thai."
          value={state.cuisinePreferences}
          onChange={(value) => update("cuisinePreferences", value)}
          error={issues.cuisinePreferences}
        />

        <TextField
          label="Disliked ingredients"
          hint="Optional. Separate with commas, for example: olives, mushrooms."
          value={state.dislikedIngredients}
          onChange={(value) => update("dislikedIngredients", value)}
          error={issues.dislikedIngredients}
        />
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={isGenerating}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? "Generating plan…" : "Generate meal plan"}
        </button>

        <p aria-live="polite" className="text-sm text-ink-muted">
          {isGenerating
            ? "Building a seven-day plan from the Aldi catalogue. This can take up to 30 seconds."
            : "Plans use current Aldi shelf prices from the last catalogue crawl."}
        </p>
      </div>
    </form>
  );
}
