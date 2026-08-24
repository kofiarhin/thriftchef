# Single-focus weekly planner wizard Implementation Plan

## Sources
- Ticket: `tickets/001-single-focus-planner-wizard.md`
- Spec: `spec/001-single-focus-planner-wizard.md`

## Goal
Deliver the approved `/plan` single-focus wizard while preserving retailer scope, form values, request semantics, error recovery, and existing plan-generation behavior.

## Preconditions
- Base: current `main` at `264d1ec6799554a5696ce36df1af47aa4bb218d7`.
- Branch: `agent/planner-single-focus-wizard`.
- User approval covers the `/plan` wizard implementation only; `/setup`, backend behavior, merge, and deployment are excluded.
- No new dependency is required.

## Implementation Strategy
Refactor the existing planner form in vertical behavior slices. Keep `ConstraintFormState` and `validateConstraints` authoritative, move the existing retailer picker inside the form as the first routed step, remove the retailer-keyed remount, and finish with a review step before the existing generation mutation.

Because this execution environment cannot clone the repository or run local commands, RED/GREEN command evidence may be unavailable. Tests must still be authored before or alongside the behavior they specify, and unavailable execution must be reported as `Not run` rather than inferred.

## Slice 1 — Routed planner shows one focused step at a time

### Outcome
Opening `/plan` starts on Supermarket, then advances through focused Budget, Household, Meals, Cooking days, and Cooking time steps without showing unrelated controls.

### Affected Areas
- `client/src/components/ConstraintForm.tsx`
- focused planner tests

### RED
Add/update assertions proving only the active step's controls are visible and current-step validation blocks Next.

Expected failure before implementation: the current form exposes multiple unrelated controls on each of three grouped steps and retailer selection sits outside the form.

### GREEN
Replace grouped step definitions with the approved focused step configuration, render only the active step, add compact progress text/bar, and preserve Back/Next plus heading focus behavior.

### REFACTOR
Centralize step metadata and field ownership so navigation, validation, server-error recovery, and review editing use one definition.

### VERIFY
Run focused client tests if an executor is available; otherwise inspect the committed tests and final component contract and report execution as not run.

## Slice 2 — Retailer selection participates in the wizard without resetting answers

### Outcome
The Supermarket step uses the existing selectable-retailer UI, requires a choice in routed planning, and changing retailer after Back preserves all other form values.

### Affected Areas
- `client/src/pages/PlannerPage.tsx`
- `client/src/App.tsx`
- `client/src/components/ConstraintForm.tsx`
- `client/src/features/retailers/tescoSelection.test.tsx`

### RED
Add/update a routed-planner regression proving supermarket is the first step and that selecting/switching retailer does not reset values already entered on later steps.

Expected failure before implementation: `PlannerPage` keys `App` by retailer ID, remounting planner state when retailer changes.

### GREEN
Remove the keyed remount, pass retailer name/selector into the form, and synchronize retailer/store defaults into existing `ConstraintFormState` without replacing unrelated fields.

### REFACTOR
Keep retailer persistence in `PlannerPage`; do not move server-state fetching or profile ownership into presentation controls.

### VERIFY
Preserve tests proving Aldi/Tesco selection is fresh per planning session, persists the chosen default, and never requests the store flow.

## Slice 3 — Preferences, exclusions, kitchen, and review remain focused and complete

### Outcome
The final focused steps expose all existing planner inputs and Review summarizes the request before generation.

### Affected Areas
- `client/src/components/ConstraintForm.tsx`
- `client/src/App.test.tsx` and/or focused wizard tests

### RED
Add/update assertions proving preference/exclusion/kitchen controls appear only on their owning steps, Review contains accumulated values, and Generate is not offered before Review.

Expected failure before implementation: current generation occurs on the third Kitchen step and no separate review screen exists.

### GREEN
Render Food preferences, Diet & exclusions, Kitchen & pantry, and Review steps using the existing input primitives and add concise review rows with edit navigation.

### REFACTOR
Reuse existing option metadata, warning components, and formatting helpers; do not introduce duplicate form state or request construction.

### VERIFY
Check request payload assertions remain unchanged for budget, household, meal types, appliances, retailer, and other existing fields.

## Slice 4 — Server validation returns to the owning step

### Outcome
A field-level API validation failure reopens the form at the step containing the invalid field instead of leaving the error hidden behind Review.

### Affected Areas
- `client/src/components/ConstraintForm.tsx`
- `client/src/constraints.ts`
- client validation/error tests

### RED
Add/update a test where generation returns a `budgetPence` field error after Review and assert the Budget step becomes active with the error visible.

Expected failure before implementation: `App` reopens the form but the existing step state remains at the final step.

### GREEN
Use `serverIssues` plus shared step-field metadata to navigate to the first owning step. Extend server-field mapping for retailer/store fields where applicable.

### REFACTOR
Avoid a second error-routing table; derive navigation from the same field ownership metadata used by step validation.

### VERIFY
Preserve existing network retry, server retry, and generation error behavior.

## Final Verification
When execution is available:

```bash
npm run typecheck
npm run test:client
npm run build
npm run verify:browser
```

Browser checks:
- `/plan` desktop and 390px mobile widths;
- one visible current step at a time;
- supermarket required;
- Back/Next preserves state;
- keyboard focus follows step transitions;
- Review summary and Generate;
- server validation recovery;
- loading/error/success states;
- no console or failed-network regressions beyond intentionally mocked failures.

If command/browser execution remains unavailable, report each item as `Not run` and do not convert Vercel deployment/build status into test evidence unless it actually covers that check.

## Risks and Checkpoints
- Stop if implementation requires an API, backend, profile schema, dependency, router/provider, or `/setup` change beyond the approved scope.
- Stop if retailer synchronization cannot be made safe without changing fresh-session semantics.
- Do not merge or deploy.

## Completion Criteria
- `/plan` uses the approved focused sequence and only the active step's controls are visible.
- Back/Next preserves answers.
- Retailer selection does not remount/reset the planner.
- Review precedes generation.
- Existing request semantics and retailer scope are preserved.
- Server field errors return to the owning step.
- Relevant tests are updated; execution evidence is reported accurately.
- Final diff is reviewed against the ticket, spec, plan, and `review.md`.
