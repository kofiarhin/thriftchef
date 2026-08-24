# Single-focus weekly planner wizard

## Request
Replace the dense weekly `/plan` configuration flow with a true step-by-step wizard where only the current planning decision is shown, followed by Back/Next navigation and a final review before generation.

## Problem
The current weekly planner groups many decisions into three large form steps. The first step alone presents budget, household size, budget target, meal types, cooking days, cooking time, and weekly mood, which makes the planner feel cluttered and forces several unrelated decisions to compete for attention.

## User Outcome
A household planner can configure the week by answering one focused planning step at a time, move backward without losing answers, review the complete request, and generate the same retailer-scoped meal plan as before.

## Current Behaviour
- `/plan` renders `PlannerPage`, which renders `App` as the planner screen.
- `ConstraintForm` currently has three steps: Basics, Preferences, and Kitchen.
- `ConstraintFormState` already holds the complete in-progress request and survives navigation between the three existing steps.
- `PlannerPage` currently renders retailer selection before the constraint form and keys `App` by retailer selection.
- Existing validation, request mapping, plan generation, regeneration, replacement, profile defaults, and retailer scoping are already implemented.
- `/setup` is a separate first-time onboarding flow and already presents one onboarding topic at a time.

## Desired Behaviour
- `/plan` presents a single-focus wizard.
- Only the current wizard step's controls are visible.
- The weekly flow is ordered as: Supermarket, Budget, Household, Meals, Cooking days, Cooking time, Food preferences, Diet & exclusions, Kitchen & pantry, Review.
- Back and Next preserve all previously entered values.
- The Review step summarizes the request and is the only normal step that offers the final Generate action.
- Invalid values block forward navigation on the relevant step and show the existing field-level validation message.
- Server field validation returned after generation takes the user back to the relevant wizard step.
- Existing household profile defaults still seed the weekly planner.
- Existing plan request shape and retailer isolation remain unchanged.

## Repository Evidence
- `client/src/components/ConstraintForm.tsx` already owns wizard step state, current-step validation, Back/Continue controls, and focus movement.
- `client/src/constraints.ts` owns the complete form state, request conversion, and server-field mapping.
- `client/src/pages/PlannerPage.tsx` owns the fresh retailer selection for a new planning session and persists the selected retailer as a profile default.
- `client/src/App.tsx` owns form state, generation mutations, regeneration, replacement, and error recovery.
- `client/src/pages/OnboardingPage.tsx` demonstrates the existing repository pattern for one-topic-at-a-time navigation.
- Existing client tests cover form validation, focus movement, generation payloads, retailer selection, regeneration, and server validation errors.

## Scope
- Redesign the weekly `/plan` constraint collection flow into the approved single-focus wizard.
- Preserve the existing dark visual language and routed application shell.
- Preserve all currently exposed weekly planner inputs.
- Preserve fresh retailer choice for each new plan.
- Preserve field validation, server-error recovery, profile defaults, generation, regeneration, and meal replacement behaviour.
- Update focused client tests for the new flow.

## Out of Scope
- Changes to `/setup` onboarding.
- Backend, planner algorithm, MongoDB, catalogue crawler, API contract, or retailer activation changes.
- Redesign of `/week`, recipe, shopping, or settings routes.
- New dependencies.
- Merge or deployment.

## Requirements
- Render only one wizard step's primary controls at a time.
- Show clear progress such as `Step X of 10` and the current step name.
- Provide keyboard-accessible Back and Next actions.
- Move focus to the new step heading after navigation.
- Prevent Next when the current step contains a validation error.
- Require a supermarket in the routed weekly planner before moving beyond the supermarket step.
- Preserve entered values when moving backward and forward.
- Show a final review summary before generation.
- Keep generation payload semantics unchanged.
- Keep the selected retailer named or otherwise clearly represented in the planning flow.

## Acceptance Criteria
- Opening `/plan` shows the Supermarket step and does not simultaneously show budget, household, preference, or kitchen controls.
- Advancing through each step hides the previous step's controls and shows only the next focused group.
- Back returns to the previous step with its values intact.
- Invalid budget, household, meal, preference, or kitchen values prevent progression on the step that owns them.
- The Review step reflects the accumulated answers and provides the final Generate action.
- A generated request preserves the existing `MealPlanRequest` shape and selected retailer.
- A server field error reopens the wizard at the step containing that field.
- Existing retailer selection remains fresh per planning session and does not open a store-selection flow.
- `/setup` remains unchanged.
- Relevant client tests, type checking, build, and desktop/mobile browser checks are run when an executor is available; unavailable checks are reported as not run.

## Constraints
- Keep `ConstraintFormState` as the canonical in-progress weekly form state unless repository evidence requires otherwise.
- Do not move query/profile/plan providers inside route boundaries.
- Do not weaken retailer/catalogue isolation.
- Maintain visible focus and keyboard accessibility.
- No new package dependency is required for the wizard.

## Dependencies
None identified.

## Open Questions
None.
