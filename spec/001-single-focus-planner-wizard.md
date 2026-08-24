# Single-focus weekly planner wizard Specification

## Source Ticket
`tickets/001-single-focus-planner-wizard.md`

## Objective
Convert the routed weekly `/plan` experience from three dense grouped constraint screens into a single-focus wizard while preserving the existing planner request, retailer scope, profile defaults, mutation behavior, and accessibility conventions.

## Existing System
- `PlannerPage` owns fresh retailer choice for each planning session, persists that choice to the device profile, and passes defaults into `App`.
- `App` owns `ConstraintFormState`, plan-generation state, retry/regeneration/replacement mutations, and whether the form or results are visible.
- `ConstraintForm` already owns step navigation, current-step validation, Back/Continue controls, and focus movement after a step transition.
- `ConstraintFormState` already contains retailer/store scope plus every planner control and is converted to `MealPlanRequest` only by `validateConstraints`.
- `mapServerFieldToFormField` maps API field failures back to client form fields.
- `RetailerPicker` exposes only selectable retailers and keeps store selection out of the current MVP flow.
- `HouseholdProfileProvider`, `PlanProvider`, and TanStack Query providers live above the router and must remain there.

## Proposed Solution
Use the existing `ConstraintFormState` as the single source of in-progress planner answers and replace the three grouped step definitions inside `ConstraintForm` with a ten-step configuration:

1. Supermarket
2. Budget
3. Household
4. Meals
5. Cooking days
6. Cooking time
7. Food preferences
8. Diet & exclusions
9. Kitchen & pantry
10. Review

`ConstraintForm` will accept the already-created retailer selector as wizard content rather than `App` rendering it above the form. The routed planner will therefore show retailer selection as step 1 instead of a separate card.

`PlannerPage` will stop keying `App` by retailer ID. Instead, `App` will synchronize only retailer/store defaults into its existing form state when the selected retailer changes, preserving answers already entered on other steps.

The final Review step will summarize the accumulated request and expose the Generate action. Existing request creation remains in `validateConstraints`; the wizard does not create a new request model.

## Architecture
No routing, provider, backend, persistence, or API architecture changes.

The data flow remains:

```text
PlannerPage retailer/profile defaults
        ↓
App ConstraintFormState
        ↓
ConstraintForm focused step UI
        ↓
validateConstraints
        ↓
existing MealPlanRequest mutation
```

The only state-lifetime adjustment is removal of the keyed `App` remount on retailer selection. Retailer changes update `ConstraintFormState.retailerId` without resetting unrelated answers.

## Data Model
No persistence or schema changes.

`HouseholdProfile` and `ConstraintFormState` remain unchanged. No profile version bump is required.

## API Contract
No API changes.

Generated requests must preserve the current `MealPlanRequest` fields, variation seed behavior, retailer/store scope, integer-pence budget, preferences, allergies, appliances, pantry basics, must-have products, cooking days, and optional maximum time.

## Frontend Behaviour
### Progress
- The routed planner shows `Step X of 10` plus the current step name.
- A compact progress indicator replaces the current three large clickable progress segments.
- Back moves one step backward.
- Next validates and moves one step forward.
- Step-heading focus and scroll behavior are preserved.

### Supermarket
- The existing `RetailerPicker` is rendered only on the Supermarket step.
- A routed planner cannot progress without a selected retailer.
- Selecting a retailer continues to update the device profile and does not request a store-selection flow.

### Budget
Show weekly budget and budget-target choice only.

### Household
Show household size only.

### Meals
Show meal types to plan per cooking day only.

### Cooking days
Show the existing weekday selection only.

### Cooking time
Show the existing maximum total recipe time choices only.

### Food preferences
Show weekly mood, meal preferences, and optional cuisine preferences as one focused preference stage.

### Diet & exclusions
Show allergies, disliked ingredients, and optional must-have products. Allergy safety guidance remains visible where allergies are edited.

### Kitchen & pantry
Show appliances and pantry basics.

### Review
Show a concise summary of supermarket, budget, household, meals, cooking days/time, preferences/exclusions, and kitchen/pantry selections. The final Generate action appears here. Previously entered steps remain editable through Back/progress navigation and review edit controls where practical.

### Existing success/error flow
After submission, `App` continues to show the existing skeleton, `PlanError`, and `MealPlanResults` behavior.

## Validation and Error Handling
- `validateConstraints` remains authoritative for client request validation.
- Each step owns a list of `ConstraintFormState` fields. Next is blocked when the current step contains a validation issue.
- The routed Supermarket step adds a local required-selection check because the existing generic validator still supports standalone/legacy invocation without a retailer.
- `serverIssues` are inspected by `ConstraintForm`; when an API field error maps to an earlier field, the wizard moves to the first step containing that field so the error is visible.
- `mapServerFieldToFormField` should also map `retailerId` and `storeId` if the server reports those fields.
- Network/server retry, variation-seed increment, and replacement failures remain unchanged.

## Edge Cases
- Switching retailer after navigating backward must not reset budget, household, preference, or kitchen answers.
- Starting a new plan still clears the active plan and retailer choice while reseeding other reusable defaults.
- A direct/standalone `App` render without a retailer selector should not introduce a broken mandatory retailer screen; the Supermarket step is included only when the selector is supplied.
- Empty appliance selection remains valid and means no-cook only, consistent with current validation.
- A server validation error received from the Review submission must not leave the user on Review while the invalid control is hidden.

## Security / Privacy / Accessibility
- No new data leaves the browser beyond the existing request.
- Device-local profile behavior remains unchanged.
- Use native form controls and existing accessible checkbox/radio groups.
- Keep visible focus behavior and move focus to the active step heading after transitions.
- Progress must expose current/total step semantics without requiring color alone.

## Affected Areas
Confirmed runtime areas:
- `client/src/components/ConstraintForm.tsx`
- `client/src/App.tsx`
- `client/src/pages/PlannerPage.tsx`
- `client/src/constraints.ts`

Confirmed test areas:
- `client/src/App.test.tsx`
- `client/src/features/retailers/tescoSelection.test.tsx`
- Additional focused wizard tests may be added if that reduces churn in broad integration tests.

No backend area is expected to change.

## Testing Requirements
- Prove the routed planner starts on Supermarket with unrelated controls hidden.
- Prove each Next transition hides the previous control group and shows the next group.
- Prove Back preserves entered values.
- Prove current-step validation prevents navigation.
- Prove retailer changes do not reset previously entered values.
- Prove Review renders accumulated answers and only Review performs normal generation.
- Prove generated request shape and retailer ID remain unchanged.
- Prove server field errors move to the owning step.
- Preserve existing regeneration, network retry, replacement, and retailer-isolation coverage.

## Verification Requirements
When an executor is available:

```bash
npm run typecheck
npm run test:client
npm run build
npm run verify:browser
```

Browser verification must inspect the `/plan` wizard at mobile and desktop widths, keyboard focus, retailer selection, validation, Back/Next value preservation, Review, generation, and error states, plus console/network failures.

## Technical Risks
- Removing the retailer-keyed remount can accidentally leave stale retailer scope in form state if synchronization is incomplete.
- Broad `App.test.tsx` helpers currently assume three steps and will need careful updates without weakening unrelated behavior assertions.
- Ten progress segments would add visual clutter on narrow screens; use one compact progress bar/text treatment rather than ten equally prominent controls.

## Open Technical Questions
None.
