# Core Product Demo

## Purpose

Demonstrate that a UK household can create a retailer-coherent weekly cooking plan and understand exactly what to cook and buy. This is a review script, not evidence that every step currently passes.

## Preconditions

- Use an approved local or non-production environment.
- Confirm the API and client point to the intended non-production data source.
- Use catalogue records with known retailer scope.
- Do not run a crawler as part of the demo.

## Walkthrough

1. Open the planner in a fresh browser session.
2. Confirm no retailer is preselected and no prior plan is silently restored.
3. Select Aldi and enter a realistic household size, weekly budget, cooking days, meals, time limits, and preferences.
4. Generate the week and confirm the result names Aldi, stays within budget, and provides coherent recipes and one shopping list.
5. Regenerate the week. Confirm Aldi and the plan settings remain while the generation seed produces a different valid week.
6. Replace one meal. Confirm the remaining week and Aldi scope stay unchanged.
7. Open a recipe and the shopping list. Confirm retailer copy, ingredients, packages, and prices remain coherent.
8. Select Start new plan. Confirm the plan is cleared and retailer selection is required again while reusable household preferences may remain.
9. Select Tesco and repeat generation, regeneration, replacement, recipe, and shopping-list checks.
10. Confirm no Aldi product appears in the Tesco plan or basket and no Tesco product appears in the Aldi plan or basket.

## Expected outcome

The user understands the selected retailer, weekly meals, recipes, basket contents, and total cost. Retailer scope survives every in-session action and resets only when a new plan begins.

## Human review

- Are the plan and recipes genuinely practical for the household?
- Is retailer naming natural rather than mechanically inserted?
- Are budget and whole-package assumptions understandable?
- Does the Tesco experience make clear that availability is based on the development catalogue evidence available?

