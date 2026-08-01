# ThriftChef Product Requirements Document (PRD)

**Version:** 0.1 (Draft)\
**Status:** MVP Planning

------------------------------------------------------------------------

# 1. Executive Summary

ThriftChef is a budget-focused meal planning application that helps
households create affordable weekly meal plans using **Aldi UK**
products.

Users provide their weekly budget, household size, meal preferences,
cuisine preferences, available kitchen appliances, and allergies. The
application generates:

-   A 7-day meal plan
-   Recipes
-   An Aldi shopping list
-   Estimated basket total

The MVP focuses on validating a single end-to-end workflow before
expanding to additional supermarkets and advanced functionality.

------------------------------------------------------------------------

# 2. Problem Statement

Planning affordable meals each week is repetitive and time-consuming.

People often need to:

-   Decide what to cook
-   Stay within a grocery budget
-   Search for recipes
-   Build a shopping list
-   Consider available appliances
-   Avoid allergens
-   Minimise food waste

Existing applications typically solve only part of this problem by
offering recipes without integrating budgeting and shopping into one
workflow.

------------------------------------------------------------------------

# 3. Proposed Solution

ThriftChef generates a complete weekly meal plan based on the user's
constraints.

Instead of searching for recipes manually, users answer a short series
of questions and receive a ready-to-shop weekly plan.

------------------------------------------------------------------------

# 4. Vision

Make affordable meal planning effortless for every household.

------------------------------------------------------------------------

# 5. MVP Scope

## Included

-   Aldi UK only
-   Weekly meal planning
-   Shopping list generation
-   Budget-aware planning
-   Cuisine preferences
-   Meal preferences
-   Appliance awareness
-   Allergy filtering
-   AI-generated recipes

## Excluded

-   Multiple supermarkets
-   Authentication
-   Pantry management
-   Nutrition tracking
-   Mobile apps
-   Delivery integrations
-   Saved meal history

------------------------------------------------------------------------

# 6. Target Audience

-   Families
-   Students
-   Couples
-   Busy professionals
-   Budget-conscious households

------------------------------------------------------------------------

# 7. User Journey

1.  User lands on the application.
2.  Enters weekly grocery budget.
3.  Selects household size.
4.  Selects meal preferences (Quick Meals, Family Friendly, High
    Protein, Vegetarian).
5.  Selects cuisine preferences.
6.  Selects available kitchen appliances.
7.  Selects allergies.
8.  Reviews all selections.
9.  Clicks **Generate Plan**.
10. Receives:

-   Estimated basket total
-   7-day meal plan
-   Recipes
-   Categorised Aldi shopping list

------------------------------------------------------------------------

# 8. Functional Requirements

The application must:

-   Accept all user constraints.
-   Retrieve relevant Aldi products.
-   Generate a valid weekly meal plan.
-   Stay within budget.
-   Respect allergies.
-   Respect appliance limitations.
-   Produce recipes.
-   Generate a consolidated shopping list.

------------------------------------------------------------------------

# 9. AI Workflow

Frontend collects user inputs.

↓

Backend validates the request.

↓

Backend retrieves only relevant Aldi products from MongoDB.

↓

Backend builds a compact AI context.

↓

Context is sent to the NVIDIA API.

↓

The AI returns:

-   Meal plan
-   Recipes
-   Shopping list

↓

Backend validates the AI response.

↓

Frontend displays results.

------------------------------------------------------------------------

# 10. Context Strategy

The entire product catalogue is **never** sent to the AI.

Instead:

1.  Validate constraints.
2.  Query only relevant Aldi products.
3.  Build a compact context.
4.  Send only the filtered context to the AI.

This keeps responses fast, accurate, and inexpensive.

------------------------------------------------------------------------

# 11. Product Data

Each product should include:

-   Name
-   Brand
-   Category
-   Description
-   Package size
-   Unit
-   Price
-   Ingredients
-   Allergens
-   Dietary tags
-   Availability
-   Last updated

------------------------------------------------------------------------

# 12. High-Level Architecture

Frontend (React)

↓

Express API

↓

MongoDB

↓

Context Builder

↓

NVIDIA AI API

↓

Validation Layer

↓

Frontend Results

------------------------------------------------------------------------

# 13. Edge Cases

-   Budget too low
-   Conflicting preferences
-   Allergy removes all meal options
-   Missing or stale product catalogue
-   AI suggests unavailable products
-   Incorrect serving calculations
-   Duplicate shopping list items
-   Invalid AI JSON
-   NVIDIA timeout
-   Empty product database

------------------------------------------------------------------------

# 14. Future Enhancements

-   Multiple supermarkets
-   Pantry tracking
-   Saved meal plans
-   Nutrition tracking
-   Ingredient substitutions
-   Product availability checks
-   User accounts
-   Mobile apps

------------------------------------------------------------------------

# 15. Success Metrics

A successful MVP allows users to:

-   Generate a weekly meal plan in under 30 seconds.
-   Stay within budget.
-   Produce a ready-to-shop Aldi shopping list.
-   Complete weekly planning in under two minutes.

------------------------------------------------------------------------

# 16. MVP Guiding Principle

> A user provides a budget and household preferences, and ThriftChef
> generates a practical, affordable Aldi meal plan with a ready-to-shop
> grocery list.
