import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type Ref,
} from "react";
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
import { WeeklyMoodPicker } from "../features/weeklyPlan/WeeklyMoodPicker";
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
  /**
   * The routed `/plan` experience uses the single-focus wizard. The grouped
   * form remains the standalone fallback because `App` is also rendered
   * directly by its existing component tests and optional embedding contract.
   */
  focusedWizard?: boolean;
  /** Existing selectable-retailer UI, rendered as the first focused step. */
  retailerSelector?: ReactNode;
  /** Human-readable retailer name used by the Review step. */
  retailerName?: string | null;
}

const LEGACY_STEPS = ["Basics", "Preferences", "Kitchen"] as const;
const LEGACY_STEP_FIELDS: FieldName[][] = [
  ["budgetPounds", "budgetTargetPercent", "householdSize", "mealsPerDay"],
  [
    "mustHaveProducts",
    "mealPreferences",
    "cuisinePreferences",
    "allergies",
    "dislikedIngredients",
  ],
  ["appliances", "pantryBasics"],
];

interface FocusedStepDefinition {
  id:
    | "supermarket"
    | "budget"
    | "household"
    | "meals"
    | "days"
    | "time"
    | "preferences"
    | "diet"
    | "kitchen"
    | "review";
  label: string;
  fields: FieldName[];
}

const FOCUSED_STEPS: FocusedStepDefinition[] = [
  { id: "supermarket", label: "Supermarket", fields: ["retailerId"] },
  {
    id: "budget",
    label: "Budget",
    fields: ["budgetPounds", "budgetTargetPercent"],
  },
  { id: "household", label: "Household", fields: ["householdSize"] },
  { id: "meals", label: "Meals", fields: ["mealsPerDay"] },
  { id: "days", label: "Cooking days", fields: ["cookingDays"] },
  { id: "time", label: "Cooking time", fields: ["maxTotalMinutes"] },
  {
    id: "preferences",
    label: "Food preferences",
    fields: ["weeklyMoods", "mealPreferences", "cuisinePreferences"],
  },
  {
    id: "diet",
    label: "Diet & exclusions",
    fields: ["mustHaveProducts", "allergies", "dislikedIngredients"],
  },
  {
    id: "kitchen",
    label: "Kitchen & pantry",
    fields: ["appliances", "pantryBasics"],
  },
  { id: "review", label: "Review", fields: [] },
];

const ALLERGEN_LABELS: Partial<Record<Allergen, string>> = {
  "tree nuts": "Tree nuts",
};

function hasLegacyStepIssues(issues: ValidationIssues, step: number): boolean {
  return LEGACY_STEP_FIELDS[step].some((field) => Boolean(issues[field]));
}

function hasFocusedStepIssues(
  issues: ValidationIssues,
  definition: FocusedStepDefinition,
): boolean {
  return definition.fields.some((field) => Boolean(issues[field]));
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

const WEEKDAY_LABELS = [
  { day: 1, short: "Mon", long: "Monday" },
  { day: 2, short: "Tue", long: "Tuesday" },
  { day: 3, short: "Wed", long: "Wednesday" },
  { day: 4, short: "Thu", long: "Thursday" },
  { day: 5, short: "Fri", long: "Friday" },
  { day: 6, short: "Sat", long: "Saturday" },
  { day: 7, short: "Sun", long: "Sunday" },
];

function CookingDaysChoice({
  value,
  onChange,
  error,
}: {
  value: number[];
  onChange: (value: number[]) => void;
  error?: string;
}) {
  function toggle(day: number): void {
    const next = value.includes(day)
      ? value.filter((entry) => entry !== day)
      : [...value, day];

    onChange(next.sort((a, b) => a - b));
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Days you cook</legend>
      <p className="mt-1 text-xs text-ink-muted">
        We only plan meals — and only buy food — for the days you pick.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {WEEKDAY_LABELS.map((weekday) => (
          <label
            key={weekday.day}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              value.includes(weekday.day)
                ? "border-brand bg-brand-surface font-semibold text-ink"
                : "border-line text-ink-muted"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={value.includes(weekday.day)}
              onChange={() => toggle(weekday.day)}
              aria-label={weekday.long}
            />
            <span aria-hidden="true">{weekday.short}</span>
          </label>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function CookingTimeChoice({
  value,
  onChange,
  error,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
}) {
  const options: Array<{ minutes: number | null; label: string }> = [
    { minutes: 30, label: "Up to 30 min" },
    { minutes: 45, label: "Up to 45 min" },
    { minutes: 60, label: "Up to an hour" },
    { minutes: null, label: "No limit" },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">
        Longest a meal may take
      </legend>
      <p className="mt-1 text-xs text-ink-muted">
        Preparation and cooking together. Nothing longer will be suggested.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.label}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              value === option.minutes
                ? "border-brand bg-brand-surface font-semibold text-ink"
                : "border-line text-ink-muted"
            }`}
          >
            <input
              type="radio"
              name="max-total-minutes"
              className="sr-only"
              checked={value === option.minutes}
              onChange={() => onChange(option.minutes)}
            />
            {option.label}
          </label>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function daysSummary(days: number[]): string {
  return WEEKDAY_LABELS.filter((weekday) => days.includes(weekday.day))
    .map((weekday) => weekday.short)
    .join(", ");
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 py-3 last:border-0">
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-ink">{value}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-brand hover:bg-brand-soft"
      >
        Edit {label}
      </button>
    </div>
  );
}

function FocusedConstraintForm({
  state,
  onStateChange,
  onSubmit,
  isGenerating,
  serverIssues,
  retailerSelector,
  retailerName,
}: ConstraintFormProps) {
  const steps = retailerSelector
    ? FOCUSED_STEPS
    : FOCUSED_STEPS.filter((definition) => definition.id !== "supermarket");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [retailerError, setRetailerError] = useState<string | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasRenderedRef = useRef(false);
  const validation = validateConstraints(state);
  const issues: ValidationIssues = {
    ...(submitted ? validation.issues : {}),
    ...serverIssues,
  };
  const currentStep = steps[step];

  useEffect(() => {
    if (!hasRenderedRef.current) {
      hasRenderedRef.current = true;
      return;
    }

    const heading = stepHeadingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(() => {
    if (!serverIssues) return;

    const fieldsWithServerIssues = new Set(
      Object.entries(serverIssues)
        .filter(([, message]) => Boolean(message))
        .map(([field]) => field as FieldName),
    );

    if (fieldsWithServerIssues.size === 0) return;

    const target = steps.findIndex((definition) =>
      definition.fields.some((field) => fieldsWithServerIssues.has(field)),
    );

    if (target >= 0) {
      setSubmitted(true);
      setStep(target);
    }
  }, [serverIssues, steps]);

  const update = <K extends keyof ConstraintFormState>(
    key: K,
    value: ConstraintFormState[K],
  ): void => onStateChange({ ...state, [key]: value });

  const goToStep = (nextStep: number): void => {
    setSubmitted(false);
    setRetailerError(null);
    setStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
  };

  const goToFocusedStep = (id: FocusedStepDefinition["id"]): void => {
    const index = steps.findIndex((definition) => definition.id === id);
    if (index >= 0) goToStep(index);
  };

  const continueToNextStep = (): void => {
    setSubmitted(true);

    if (
      currentStep.id === "supermarket" &&
      retailerSelector &&
      !state.retailerId
    ) {
      setRetailerError("Choose a supermarket to continue.");
      return;
    }

    setRetailerError(null);
    if (hasFocusedStepIssues(validation.issues, currentStep)) return;
    goToStep(step + 1);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    if (currentStep.id !== "review") {
      continueToNextStep();
      return;
    }

    setSubmitted(true);
    if (validation.request) {
      onSubmit(validation.request);
      return;
    }

    const target = steps.findIndex((definition) =>
      definition.fields.some((field) => Boolean(validation.issues[field])),
    );
    if (target >= 0) setStep(target);
  };

  const preferenceCount =
    state.weeklyMoods.length +
    state.mealPreferences.length +
    (state.cuisinePreferences.trim() ? 1 : 0);
  const exclusionCount =
    state.allergies.length +
    state.mustHaveProducts.length +
    (state.dislikedIngredients.trim() ? 1 : 0);
  const kitchenCount = state.appliances.length + state.pantryBasics.length;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav aria-label="Planning progress" className="mb-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-ink">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-ink-muted">{currentStep.label}</p>
        </div>
        <div
          role="progressbar"
          aria-label="Planning progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      <div className="min-h-[26rem] rounded-2xl border border-line bg-surface-raised p-5 shadow-elevated sm:p-7">
        {currentStep.id === "supermarket" ? (
          <section aria-labelledby="supermarket-step" className="space-y-6">
            <StepIntro
              eyebrow="Supermarket"
              id="supermarket-step"
              title="Choose your supermarket"
              detail="Every product, price and shopping-list item will come from this shop."
              headingRef={stepHeadingRef}
            />
            {retailerSelector}
            {retailerError ? (
              <p role="alert" className="text-sm text-danger-ink">
                {retailerError}
              </p>
            ) : null}
          </section>
        ) : null}

        {currentStep.id === "budget" ? (
          <section aria-labelledby="budget-step" className="space-y-6">
            <StepIntro
              eyebrow="Budget"
              id="budget-step"
              title="Set your weekly budget"
              detail="This is a hard maximum for the whole basket."
              headingRef={stepHeadingRef}
            />
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
            <BudgetTargetChoice
              value={state.budgetTargetPercent}
              onChange={(value) => update("budgetTargetPercent", value)}
              targetPence={targetPenceFor(state)}
              error={issues.budgetTargetPercent}
            />
          </section>
        ) : null}

        {currentStep.id === "household" ? (
          <section aria-labelledby="household-step" className="space-y-6">
            <StepIntro
              eyebrow="Household"
              id="household-step"
              title="How many people are you cooking for?"
              detail="Recipes and shopping quantities are sized to your household."
              headingRef={stepHeadingRef}
            />
            <div className="max-w-sm">
              <TextField
                label="Household size"
                hint="Between 1 and 10 people."
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
          </section>
        ) : null}

        {currentStep.id === "meals" ? (
          <section aria-labelledby="meals-step" className="space-y-6">
            <StepIntro
              eyebrow="Meals"
              id="meals-step"
              title="Which meals should we plan?"
              detail="Each selected meal type is planned for every cooking day."
              headingRef={stepHeadingRef}
            />
            <CheckboxGroup<MealType>
              legend="Meals to plan each day"
              hint="Choose at least one."
              options={MEAL_TYPES}
              selected={state.mealsPerDay}
              onChange={(value) => update("mealsPerDay", value)}
              error={issues.mealsPerDay}
              meta={MEAL_TYPE_META}
            />
          </section>
        ) : null}

        {currentStep.id === "days" ? (
          <section aria-labelledby="days-step" className="space-y-6">
            <StepIntro
              eyebrow="Schedule"
              id="days-step"
              title="Which days are you cooking?"
              detail="We only plan meals and buy food for the days you choose."
              headingRef={stepHeadingRef}
            />
            <CookingDaysChoice
              value={state.cookingDays}
              onChange={(value) => update("cookingDays", value)}
              error={issues.cookingDays}
            />
          </section>
        ) : null}

        {currentStep.id === "time" ? (
          <section aria-labelledby="time-step" className="space-y-6">
            <StepIntro
              eyebrow="Cooking time"
              id="time-step"
              title="How long can dinner take?"
              detail="Nothing longer than this limit will be suggested."
              headingRef={stepHeadingRef}
            />
            <CookingTimeChoice
              value={state.maxTotalMinutes}
              onChange={(value) => update("maxTotalMinutes", value)}
              error={issues.maxTotalMinutes}
            />
          </section>
        ) : null}

        {currentStep.id === "preferences" ? (
          <section aria-labelledby="preferences-step" className="space-y-7">
            <StepIntro
              eyebrow="Food preferences"
              id="preferences-step"
              title="What sounds good this week?"
              detail="These choices steer the planner; leave them empty for more variety."
              headingRef={stepHeadingRef}
            />
            <WeeklyMoodPicker
              selected={state.weeklyMoods}
              onChange={(value) => update("weeklyMoods", value)}
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
            <TextField
              label="Cuisine preferences"
              hint="Optional, comma separated — for example: Ghanaian, British."
              value={state.cuisinePreferences}
              onChange={(value) => update("cuisinePreferences", value)}
              error={issues.cuisinePreferences}
            />
          </section>
        ) : null}

        {currentStep.id === "diet" ? (
          <section aria-labelledby="diet-step" className="space-y-7">
            <StepIntro
              eyebrow="Diet & exclusions"
              id="diet-step"
              title="Anything we must include or avoid?"
              detail="Set hard exclusions and any products you definitely want this week."
              headingRef={stepHeadingRef}
            />
            <div>
              <h4 className="text-sm font-semibold text-ink">Must-have items</h4>
              <p className="mt-1 text-xs text-ink-muted">
                Optional. Add catalogue products you want included in the basket.
              </p>
              <div className="mt-3">
                <MustHaveSelector
                  selected={state.mustHaveProducts}
                  onChange={(value) => update("mustHaveProducts", value)}
                  error={issues.mustHaveProducts}
                />
              </div>
            </div>
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
            <TextField
              label="Disliked ingredients"
              hint="Optional, comma separated — for example: olives, mushrooms."
              value={state.dislikedIngredients}
              onChange={(value) => update("dislikedIngredients", value)}
              error={issues.dislikedIngredients}
            />
          </section>
        ) : null}

        {currentStep.id === "kitchen" ? (
          <section aria-labelledby="kitchen-step" className="space-y-8">
            <StepIntro
              eyebrow="Kitchen & pantry"
              id="kitchen-step"
              title="What is already in your kitchen?"
              detail="We will only suggest recipes you can cook and avoid rebuying selected basics."
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
          </section>
        ) : null}

        {currentStep.id === "review" ? (
          <section aria-labelledby="review-step" className="space-y-6">
            <StepIntro
              eyebrow="Review"
              id="review-step"
              title="Review your week"
              detail="Check the essentials before ThriftChef builds the plan."
              headingRef={stepHeadingRef}
            />
            <dl className="rounded-xl border border-line bg-surface-sunken px-4">
              {retailerSelector ? (
                <ReviewRow
                  label="Supermarket"
                  value={retailerName ?? "Selected supermarket"}
                  onEdit={() => goToFocusedStep("supermarket")}
                />
              ) : null}
              <ReviewRow
                label="Budget"
                value={`£${state.budgetPounds || "0"} maximum · aiming for ${state.budgetTargetPercent}%`}
                onEdit={() => goToFocusedStep("budget")}
              />
              <ReviewRow
                label="Household"
                value={`${state.householdSize || "0"} people`}
                onEdit={() => goToFocusedStep("household")}
              />
              <ReviewRow
                label="Meals"
                value={state.mealsPerDay.join(", ") || "None"}
                onEdit={() => goToFocusedStep("meals")}
              />
              <ReviewRow
                label="Cooking days"
                value={daysSummary(state.cookingDays) || "None"}
                onEdit={() => goToFocusedStep("days")}
              />
              <ReviewRow
                label="Cooking time"
                value={
                  state.maxTotalMinutes === null
                    ? "No limit"
                    : `Up to ${state.maxTotalMinutes} min`
                }
                onEdit={() => goToFocusedStep("time")}
              />
              <ReviewRow
                label="Food preferences"
                value={
                  preferenceCount === 0
                    ? "No extra preferences"
                    : `${preferenceCount} selected`
                }
                onEdit={() => goToFocusedStep("preferences")}
              />
              <ReviewRow
                label="Diet & exclusions"
                value={
                  exclusionCount === 0
                    ? "No extra exclusions"
                    : `${exclusionCount} selected`
                }
                onEdit={() => goToFocusedStep("diet")}
              />
              <ReviewRow
                label="Kitchen & pantry"
                value={`${kitchenCount} selected`}
                onEdit={() => goToFocusedStep("kitchen")}
              />
            </dl>
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

        <p className="hidden text-xs text-ink-muted sm:block">
          {currentStep.id === "review"
            ? "Nothing is generated until you confirm."
            : "Your answers stay saved as you move between steps."}
        </p>

        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-on-brand shadow-brand-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating
            ? "Building your plan…"
            : currentStep.id === "review"
              ? "Generate my plan"
              : "Continue"}
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </form>
  );
}

function LegacyConstraintForm({
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
    setStep(Math.max(0, Math.min(LEGACY_STEPS.length - 1, nextStep)));
  };

  const continueToNextStep = (): void => {
    setSubmitted(true);
    if (hasLegacyStepIssues(validation.issues, step)) return;
    goToStep(step + 1);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (step < LEGACY_STEPS.length - 1) {
      continueToNextStep();
      return;
    }

    setSubmitted(true);
    if (validation.request) onSubmit(validation.request);
  };

  const isLastStep = step === LEGACY_STEPS.length - 1;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav aria-label="Planning progress" className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-ink">
            Step {step + 1} of {LEGACY_STEPS.length}
          </p>
          <p className="text-ink-muted">{LEGACY_STEPS[step]}</p>
        </div>
        <ol className="grid grid-cols-3 gap-2">
          {LEGACY_STEPS.map((label, index) => (
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
              hint="Every selected meal is planned for each day you cook."
              options={MEAL_TYPES}
              selected={state.mealsPerDay}
              onChange={(value) => update("mealsPerDay", value)}
              error={issues.mealsPerDay}
              meta={MEAL_TYPE_META}
            />

            <CookingDaysChoice
              value={state.cookingDays}
              onChange={(value) => update("cookingDays", value)}
              error={issues.cookingDays}
            />

            <CookingTimeChoice
              value={state.maxTotalMinutes}
              onChange={(value) => update("maxTotalMinutes", value)}
              error={issues.maxTotalMinutes}
            />

            <WeeklyMoodPicker
              selected={state.weeklyMoods}
              onChange={(value) => update("weeklyMoods", value)}
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

            <details className="group rounded-xl border border-line bg-surface-sunken px-4 py-3">
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

            <details className="group rounded-xl border border-line bg-surface-sunken px-4 py-3">
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

            <details className="group rounded-xl border border-line bg-surface-sunken px-4 py-3">
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

        <p className="hidden text-xs text-ink-muted sm:block">
          You can change this later.
        </p>
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

export function ConstraintForm(props: ConstraintFormProps) {
  if (props.focusedWizard) return <FocusedConstraintForm {...props} />;
  return <LegacyConstraintForm {...props} />;
}
