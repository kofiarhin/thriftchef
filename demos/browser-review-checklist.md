# Browser Review Checklist

Use this for every user-facing ticket. Record the commit, environment, viewport, data source, and result.

## Viewports

- Mobile: approximately 390 x 844.
- Desktop: approximately 1440 x 900.

## Core states

- Fresh visit with no retailer selected.
- Form validation and missing constraints.
- Loading during plan generation.
- Aldi generation success.
- Tesco generation success in the approved development environment.
- Catalogue unavailable.
- Constraint conflict or no valid plan.
- Whole-week regeneration.
- Single-meal replacement.
- Recipe detail.
- Shopping-list interaction and persistence.
- Start new plan.

## Behaviour checks

- Retailer choice is clear, keyboard accessible, and visibly selected.
- Fresh visits do not silently inherit a previous retailer or plan.
- Regeneration preserves retailer and settings but changes the week.
- Replacement preserves unaffected meals and retailer scope.
- Start new plan clears plan and retailer selection.
- Aldi/Tesco names are correct across status, recipes, instructions, and shopping list.
- Budget, totals, quantities, and unavailable states are understandable.
- Browser back/forward and refresh do not create contradictory state.

## Accessibility

- Navigate all controls with a keyboard.
- Confirm visible focus, logical heading order, useful labels, and announced errors.
- Check colour contrast and that meaning is not conveyed by colour alone.
- Confirm loading and error states are exposed to assistive technology.

## Technical inspection

- Record console errors and warnings.
- Record failed or unexpected network requests.
- Confirm API requests carry the expected retailer/store scope.
- Confirm no secret or internal database identifier is exposed unnecessarily.
- Capture screenshots only when they contain no sensitive data.

## Result format

For every check use `Passed`, `Failed`, or `Not run`. Include defects, screenshots or logs, and the exact human-review items that remain.

