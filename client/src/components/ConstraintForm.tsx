import { useEffect, useRef, useState, type FormEvent, type Ref } from "react";
import {
  APPLIANCES,
  MEAL_PREFERENCES,
  MEAL_TYPES,
  PANTRY_BASICS,
  UK_ALLERGENS,
  type Allergen,
  type Appliance,
  type BudgetTargetPercent,
  type MealPlanRequest,
  type MealPreference,
  type MealType,
  type PantryBasic,
} from "../api/types";
import {
  BUDGET_TARGET_OPTIONS,
  MAX_BUDGET_POUNDS,
  MIN_BUDGET_POUNDS,
  targetPenceFor,
  validateConstraints,
  type ConstraintFormState,
  type FieldName,
  type ValidationIssues,
} from "../constraints";
import { formatPence } from "../format";
import { Icon } from "./Icon";
import { MustHaveSelector } from "./MustHaveSelector";
import {
  ALLERGEN_META,
  APPLIANCE_META,
  MEAL_PREFERENCE_META,
  MEAL_TYPE_META,
  PANTRY_META,
} from "./optionMeta";
import { CheckboxGroup, TextField } from "./PreferenceControls";

interface ConstraintFormProps {
  state: ConstraintFormState;
  onStateChange: (state: ConstraintFormState) => void;
  onSubmit: (request: MealPlanRequest) => void;
  isGenerating: boolean;
  serverIssues?: ValidationIssues;
}

const STEPS = ["Basics", "Preferences", "Kitchen"] as const;
const STEP_FIELDS: FieldName[][] = [
  ["budgetPounds", "budgetTargetPercent", "householdSize", "mealsPerDay"],
  ["mustHaveProducts", "mealPreferences", "cuisinePreferences", "allergies", "dislikedIngredients"],
  ["appliances", "pantryBasics"],
];

const ALLERGEN_LABELS: Partial<Record<Allergen, string>> = {
  "tree nuts": "Tree nuts",
};

function hasStepIssues(issues: ValidationIssues, step: number): boolean {
  return STEP_FIELDS[step].some((field) => Boolean(issues[field]));
}

function StepIntro({
  eyebrow,
  id,
  title,
  detail,
  headingRef,
}: {
  eyebrow: string;
  id: string;
  title: string;
  detail?: string;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </p>
      <h3
        id={id}
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 scroll-mt-24 text-xl font-semibold tracking-tight text-ink outline-none"
      >
        {title}
      </h3>
      {detail ? <p className="mt-1 text-sm text-ink-muted">{detail}</p> : null}
    </div>
  );
}

interface BudgetTargetChoiceProps {
  value: BudgetTargetPercent;
  onChange: (value: BudgetTargetPercent) => void;
  targetPence: number | null;
  error?: string;
}

/**
 * Radio cards rather than a slider: the three presets are the whole choice,
 * and a real radio group is what gives keyboard and screen-reader users arrow
 * navigation and a spoken group label for free.
 */
function BudgetTargetChoice({
  value,
  onChange,
  targetPence,
  error,
}: BudgetTargetChoiceProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">
        How much of your budget should we aim to use?
      </legend>
      <p className="mt-1 text-sm text-ink-muted">
        Your budget is the maximum. We aim near the selected share, never over.
      </p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {BUDGET_TARGET_OPTIONS.map((option) => (
          <label
            key={option.percent}
            data-selected={value === option.percent ? "true" : "false"}
            className="group relative block cursor-pointer rounded-xl border border-line bg-surface-raised p-4 transition duration-150 hover:border-ink-muted data-[selected=true]:border-brand data-[selected=true]:bg-brand-soft focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink">
                {option.label} — {option.percent}%
              </span>
              <input
                type="radio"
                name="budgetTargetPercent"
                value={option.percent}
                checked={value === option.percent}
                onChange={() => onChange(option.percent)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="flex size-5 shrink-0 items-center justify-center rounded-full border border-line text-on-brand transition group-data-[selected=true]:border-brand group-data-[selected=true]:bg-brand"
              >
                {value === option.percent ? (
                  <Icon name="check" size={13} strokeWidth={2.6} />
                ) : null}
              </span>
            </span>
            <span className="mt-1.5 block text-xs leading-snug text-ink-muted">
              {option.description}
            </span>
          </label>
        ))}
      </div>

      <p
        className="mt-3 flex items-center gap-2 text-sm text-ink-muted"
        data-testid="budget-target-summary"
      >
        <Icon name="price-tag" size={15} />
        {targetPence === null
          ? "Enter a budget to see the amount we will aim for."
          : `Aiming for about ${formatPence(targetPence)} of your maximum.`}
      </p>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/**
 * Aldi publishes no allergen labels, so the safety story needs more than one
 * line — but not at the top of the form every time. The short warning stays
 * visible; the reasoning sits one click away.
 */
function AllergenSafetyNote() {
  return (
    <details className="group rounded-xl border border-warning bg-warning-surface px-4 py-3">
      <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-warning-ink">
        <Icon name="shield" size={14} />
        How allergen data is worked out
      </summary>
      <p className="mt-2 text-xs leading-relaxed text-warning-ink">
        Aldi does not publish allergen data, so ThriftChef infers it from
        product wording. Selecting an allergen removes anything that looks like
        it contains that allergen, but inference is not a label. Read the label
        before you cook, every time.
      </p>
    </details>
  );
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
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasRenderedRef = useRef(false);
  const validation = validateConstraints(state);
  const issues: ValidationIssues = {
    ...(submitted ? validation.issues : {}),
    ...serverIssues,
  };

  useEffect(() => {
    if (!hasRenderedRef.current) {
      hasRenderedRef.current = true;
      return;
    }

    const heading = stepHeadingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [step]);

  const update = <K extends keyof ConstraintFormState>(
    key: K,
    value: ConstraintFormState[K],
  ): void => onStateChange({ ...state, [key]: value });

  const goToStep = (nextStep: number): void => {
    setSubmitted(false);
    setStep(Math.max(0, Math.min(STEPS.length - 1, nextStep)));
  };

  const continueToNextStep = (): void => {
    setSubmitted(true);
    if (hasStepIssues(validation.issues, step)) return;
    goToStep(step + 1);
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

  const isLastStep = step === STEPS.length - 1;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav aria-label="Planning progress" className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-ink">Step {step + 1} of {STEPS.length}</p>
          <p className="text-ink-muted">{STEPS[step]}</p>
        </div>
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => index < step && goToStep(index)}
                disabled={index > step || isGenerating}
                aria-current={index === step ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${label}`}
                className="block min-h-11 w-full py-4"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 w-full rounded-full transition ${
                    index <= step ? "bg-brand" : "bg-line"
                  }`}
                />
                <span className="sr-only">{label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-h-[30rem] rounded-2xl border border-line bg-surface-raised p-5 shadow-elevated sm:p-7">
        {step === 0 ? (
          <section aria-labelledby="household-step" className="space-y-6">
            <StepIntro
              eyebrow="Your week"
              id="household-step"
              title="Set your budget and household"
              detail="Tell us what you want to spend and who you are feeding."
              headingRef={stepHeadingRef}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Weekly budget"
                hint={`Between £${MIN_BUDGET_POUNDS} and £${MAX_BUDGET_POUNDS} for the whole basket.`}
                value={state.budgetPounds}
                onChange={(value) => update("budgetPounds", value)}
                error={issues.budgetPounds}
                type="number"
                inputMode="decimal"
                min={MIN_BUDGET_POUNDS}
                max={MAX_BUDGET_POUNDS}
                step="0.01"
                prefix="£"
                icon="wallet"
                emphasis
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
                icon="users"
                emphasis
              />
            </div>

            <BudgetTargetChoice
              value={state.budgetTargetPercent}
              onChange={(value) => update("budgetTargetPercent", value)}
              targetPence={targetPenceFor(state)}
              error={issues.budgetTargetPercent}
            />

            <CheckboxGroup<MealType>
              legend="Meals to plan each day"
              hint="Every selected meal is planned for all seven days."
              options={MEAL_TYPES}
              selected={state.mealsPerDay}
              onChange={(value) => update("mealsPerDay", value)}
              error={issues.mealsPerDay}
              meta={MEAL_TYPE_META}
            />
          </section>
        ) : null}

        {step === 1 ? (
          <section aria-labelledby="preferences-step" className="space-y-6">
            <StepIntro
              eyebrow="Your food"
              id="preferences-step"
              title="Make the plan feel like yours"
              detail="Choose what matters. Everything else can stay at its default."
              headingRef={stepHeadingRef}
            />

            <CheckboxGroup<MealPreference>
              legend="Meal preferences"
              hint="Optional. These steer which recipes the planner picks."
              options={MEAL_PREFERENCES}
              selected={state.mealPreferences}
              onChange={(value) => update("mealPreferences", value)}
              error={issues.mealPreferences}
              meta={MEAL_PREFERENCE_META}
            />

            <details
              defaultOpen={state.mustHaveProducts.length > 0}
              className="group rounded-xl border border-line bg-surface-sunken px-4 py-3"
            >
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="basket" size={16} />
                Add must-have items
                {state.mustHaveProducts.length > 0
                  ? ` (${state.mustHaveProducts.length})`
                  : ""}
              </summary>
              <div className="mt-4">
                <MustHaveSelector
                  selected={state.mustHaveProducts}
                  onChange={(value) => update("mustHaveProducts", value)}
                  error={issues.mustHaveProducts}
                />
              </div>
            </details>

            <details
              defaultOpen={state.allergies.length > 0}
              className="group rounded-xl border border-line bg-surface-sunken px-4 py-3"
            >
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="shield" size={16} />
                Add allergies
                {state.allergies.length > 0 ? ` (${state.allergies.length})` : ""}
              </summary>
              <div className="mt-4">
                <CheckboxGroup<Allergen>
                  legend="Allergies to avoid"
                  hint="Allergen data is inferred, never official. Check the packaging."
                  options={UK_ALLERGENS}
                  selected={state.allergies}
                  onChange={(value) => update("allergies", value)}
                  error={issues.allergies}
                  labels={ALLERGEN_LABELS}
                  meta={ALLERGEN_META}
                  dense
                  footnote={<AllergenSafetyNote />}
                />
              </div>
            </details>

            <details
              defaultOpen={
                Boolean(state.cuisinePreferences.trim()) ||
                Boolean(state.dislikedIngredients.trim())
              }
              className="group rounded-xl border border-line bg-surface-sunken px-4 py-3"
            >
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="sliders" size={16} />
                Add optional details
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Cuisine preferences"
                  hint="Comma separated, for example: Ghanaian, British."
                  value={state.cuisinePreferences}
                  onChange={(value) => update("cuisinePreferences", value)}
                  error={issues.cuisinePreferences}
                />
                <TextField
                  label="Disliked ingredients"
                  hint="Comma separated, for example: olives, mushrooms."
                  value={state.dislikedIngredients}
                  onChange={(value) => update("dislikedIngredients", value)}
                  error={issues.dislikedIngredients}
                />
              </div>
            </details>
          </section>
        ) : null}

        {step === 2 ? (
          <section aria-labelledby="kitchen-step" className="space-y-8">
            <StepIntro
              eyebrow="Your kitchen"
              id="kitchen-step"
              title="Finish your setup"
              headingRef={stepHeadingRef}
            />

            <CheckboxGroup<Appliance>
              legend="Cooking appliances available"
              hint="Clear every option to request no-cook meals only."
              options={APPLIANCES}
              selected={state.appliances}
              onChange={(value) => update("appliances", value)}
              error={issues.appliances}
              meta={APPLIANCE_META}
            />

            <CheckboxGroup<PantryBasic>
              legend="Already have at home"
              hint="Only selected basics may be used without joining the basket."
              options={PANTRY_BASICS}
              selected={state.pantryBasics}
              onChange={(value) => update("pantryBasics", value)}
              error={issues.pantryBasics}
              meta={PANTRY_META}
            />

            <div className="rounded-xl border border-brand/40 bg-brand-soft p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon name="check-circle" size={16} />
                Ready to generate
              </p>
              <p className="mt-1.5 text-sm text-ink-muted">
                {state.householdSize || "0"} people · £{state.budgetPounds || "0"}{" "}
                maximum · aiming for {state.budgetTargetPercent}% ·{" "}
                {state.mealsPerDay.length} meal type
                {state.mealsPerDay.length === 1 ? "" : "s"} per day
                {state.mustHaveProducts.length > 0
                  ? ` · ${state.mustHaveProducts.length} must-have item${state.mustHaveProducts.length === 1 ? "" : "s"}`
                  : ""}
              </p>
            </div>
          </section>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-20 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/95 p-3 shadow-elevated backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={() => goToStep(step - 1)}
          disabled={step === 0 || isGenerating}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink-muted disabled:invisible"
        >
          Back
        </button>

        <p className="hidden text-xs text-ink-muted sm:block">You can change this later.</p>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-on-brand shadow-brand-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating
              ? "Building your plan…"
              : isLastStep
                ? "Generate my plan"
                : "Continue"}
            <Icon name="arrow-right" size={16} />
          </button>

      </div>
    </form>
  );
}
