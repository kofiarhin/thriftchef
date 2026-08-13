# ThriftChef Vertical Implementation Plan

**Status:** Implementation planning artifact  
**Related spec:** `docs/ThriftChef-Full-Implementation-Spec.md`  
**Planning style:** vertical slices that each produce testable user or operational value  
**Current baseline:** Node/TypeScript backend, MongoDB/Mongoose product model, Aldi Crawlee/Playwright catalogue crawler, allergen inference helper and tests, empty API entrypoints, no frontend yet.

## 1. Goal

Build ThriftChef as one working MVP flow:

1. Aldi catalogue data is available in MongoDB.
2. A user enters budget, household, meal, cuisine, appliance, and allergy constraints.
3. The backend selects safe planning products.
4. The backend builds a compact AI context.
5. The NVIDIA API generates a structured 7-day meal plan.
6. The backend validates and prices the plan.
7. The frontend displays the plan, recipes, and Aldi shopping list.

This plan avoids a horizontal "build all backend, then all frontend" approach. Each slice should leave the product in a more demonstrable state, with clear verification before moving on.

## 2. Planning Principles

- Keep each slice releasable or locally demoable.
- Preserve the current crawler and allergen work unless a slice explicitly changes it.
- Use server-side validation for budget, allergens, appliance constraints, AI output, and pricing.
- Do not send the full product catalogue to the AI.
- Do not treat inferred allergens as a safety guarantee.
- Keep authentication, saved history, multi-retailer support, and pantry tracking out of MVP.
- Prefer deterministic backend behavior and tests around uncertain AI behavior.
- Mock NVIDIA responses before depending on the live API.
- Verify after every slice with the narrowest useful command.

## 3. Baseline Inventory

### 3.1 Existing Product Assets

- `docs/ThriftChef-PRD-v0.1 (1).md`
  - Defines the MVP product intent.
- `docs/ThriftChef-Full-Implementation-Spec.md`
  - Defines detailed implementation requirements.
- `server/models/Product.ts`
  - Product catalogue schema.
  - Current working-tree version includes `catalogueSafetyStatus: "inferred"`.
- `server/catalogue/aldi/aldiCrawler.ts`
  - Aldi crawler and persistence logic.
  - Current working tree includes test-facing helper exports such as `extractHighestPageNumber`.
- `server/catalogue/allergenInference.ts`
  - Heuristic UK-regulated allergen inference from product text.
- `server/catalogue/*.test.ts`
  - Node test-runner tests for allergen inference and crawler helpers.
- `server/app.js` and `server/server.js`
  - Empty and ready to be replaced by TypeScript API entrypoints.

### 3.2 Key Technical Gaps

- No Express app implementation.
- No Mongo connection module.
- No environment validation.
- No route structure.
- No catalogue status endpoint.
- No meal-plan request validation.
- No product selector.
- No AI context builder.
- No NVIDIA client.
- No AI response schema/validator.
- No shopping-list consolidator.
- No rate limiting.
- No frontend.
- No end-to-end local workflow.
- Test command currently only runs typecheck; Node test-runner tests are not yet wired into `npm test`.

## 4. Target Vertical Slices

### Slice 0: Repo Stabilization And Test Harness

**User value:** none directly, but it prevents future slices from being built on unclear tooling.  
**Operational value:** developers can run one command that proves current TypeScript and unit tests pass.

#### Scope

- Confirm current TypeScript module settings and Node test-runner compatibility.
- Wire existing tests into the project test command.
- Keep existing crawler/allergen tests passing.
- Add a small test script if needed rather than introducing a large test stack immediately.

#### Backend Work

- Review `tsconfig.json` after the current `module: "node18"` and `moduleResolution: "node16"` changes.
- Decide whether tests run directly through `tsx --test` or Node's native runner with TypeScript transpilation.
- Update `package.json` scripts:
  - `typecheck`: keep `tsc --noEmit`.
  - `test:unit`: run TypeScript unit tests.
  - `test`: run `typecheck` and `test:unit`.
- Keep `aldi:crawl` unchanged unless the TypeScript module settings require a command adjustment.

#### Tests

- Existing `server/catalogue/allergenInference.test.ts`.
- Existing `server/catalogue/aldi/aldiCrawler.test.ts`.

#### Acceptance Criteria

- `npm run typecheck` passes.
- `npm run test:unit` passes.
- `npm test` passes.
- No product behavior changes are introduced.

#### Files Likely Touched

- `package.json`
- `package-lock.json`
- `tsconfig.json` only if required

#### Dependencies

- Existing TypeScript tests must compile under the selected module mode.

## 5. Slice 1: API Walking Skeleton

**User value:** the application has a running API surface.  
**Operational value:** local and deployed environments can prove the service is alive.

#### Scope

- Replace empty server entrypoints with a minimal TypeScript Express app.
- Add health check.
- Add environment parsing.
- Add database connection lifecycle.
- Add standard error shape.

#### Backend Work

- Create `server/app.ts`.
- Create `server/server.ts`.
- Create `server/config/env.ts`.
- Create `server/db/connect.ts`.
- Create `server/http/errors.ts`.
- Create `server/http/requestId.ts` if request IDs are wanted in logs.
- Configure:
  - `express.json({ limit: "100kb" })`.
  - CORS using `CLIENT_ORIGIN`.
  - `GET /api/health`.
  - 404 handler for API routes.
  - centralized error middleware.

#### API Contract

`GET /api/health`

```json
{
  "ok": true,
  "service": "thriftchef-api",
  "version": "1.0.0"
}
```

#### Tests

- Unit test env parsing with valid and missing values.
- Integration-style test for `GET /api/health` if a request test library is added.
- If no request test library is added yet, manually verify with `curl`.

#### Acceptance Criteria

- API starts locally with valid `.env`.
- Missing required env values fail fast with safe messages.
- `GET /api/health` returns `200`.
- Typecheck and tests pass.

#### Files Likely Touched

- `server/app.ts`
- `server/server.ts`
- `server/config/env.ts`
- `server/db/connect.ts`
- `server/http/errors.ts`
- `package.json`
- `tsconfig.json` if include paths need adjustment

#### Dependencies

- MongoDB connection string for full startup.
- For health-only local testing, decide whether DB connection is required before `listen`.

## 6. Slice 2: Catalogue Status Read Path

**User value:** the app can tell whether it has enough product data to generate plans.  
**Operational value:** crawler output becomes inspectable through the API.

#### Scope

- Add read-only catalogue status endpoint.
- Do not trigger crawls from the API in this slice.
- Use current `Product` model and current safety statuses, including `inferred`.

#### Backend Work

- Create `server/catalogue/catalogueRoutes.ts`.
- Create `server/catalogue/catalogueController.ts`.
- Create `server/catalogue/catalogueService.ts`.
- Implement `GET /api/catalogue/status`.
- Count products by:
  - retailer.
  - store ID.
  - availability.
  - eligibility.
  - `catalogueSafetyStatus`.
- Calculate:
  - `availableProducts`.
  - `eligibleProducts`.
  - `lastCheckedAt`.
  - `isStale`.
  - safety breakdown.

#### API Contract

`GET /api/catalogue/status?storeId=belper-de56-1ar`

```json
{
  "retailer": "aldi-uk",
  "storeId": "belper-de56-1ar",
  "availableProducts": 238,
  "eligibleProducts": 164,
  "lastCheckedAt": "2026-08-13T00:00:00.000Z",
  "isStale": false,
  "safetyBreakdown": {
    "verified": 0,
    "inferred": 164,
    "incomplete": 55,
    "ambiguous": 19
  }
}
```

#### Tests

- Service test with mocked model calls or an isolated test database.
- Controller test for empty catalogue response.
- Test stale calculation.

#### Acceptance Criteria

- Endpoint returns controlled status for empty catalogue.
- Endpoint returns counts for populated catalogue.
- `inferred` safety status is included in the breakdown.
- No AI or frontend work is introduced.

#### Files Likely Touched

- `server/app.ts`
- `server/catalogue/catalogueRoutes.ts`
- `server/catalogue/catalogueController.ts`
- `server/catalogue/catalogueService.ts`
- catalogue tests

#### Dependencies

- Product model indexes should already exist.
- Stale threshold from env, defaulting to 72 hours.

## 7. Slice 3: Product Selector And Planning Eligibility

**User value:** the system can find candidate Aldi products for a user's constraints.  
**Operational value:** allergy and safety filtering are deterministic before AI is involved.

#### Scope

- Implement request-independent product selection utilities.
- Build safe product filtering and ranking.
- Decide how `inferred` products are handled in MVP.

#### Safety Decision

Recommended MVP rule:

- Products with `catalogueSafetyStatus: "verified"` are eligible for allergy-sensitive planning.
- Products with `catalogueSafetyStatus: "inferred"` may be used only when the user has not selected allergies, and the UI/API must show a warning that allergen status is inferred.
- Products with `incomplete` or `ambiguous` are not eligible.

If the product owner wants strict allergen safety for every plan, then use only `verified` products. Since Aldi currently appears not to publish full allergen data, strict verified-only planning may result in too few usable products.

#### Backend Work

- Create `server/mealPlanning/mealPlanTypes.ts`.
- Create `server/mealPlanning/mealPlanSchemas.ts`.
- Create `server/mealPlanning/productSelector.ts`.
- Normalize request allergies to UK allergen slugs.
- Filter products by:
  - `retailer: "aldi-uk"`.
  - selected/default `storeId`.
  - `available: true`.
  - `eligibleForPlanning: true`.
  - positive price.
  - safety status.
  - allergy intersection.
- Rank products by:
  - staple usefulness.
  - low price.
  - latest crawl.
  - preference/category match.
- Return coverage metrics:
  - products considered.
  - products selected.
  - excluded for allergies.
  - excluded for safety.

#### Tests

- Request allergy normalization.
- Product selection excludes direct allergen conflicts.
- Product selection treats inferred products according to the chosen rule.
- Ranking is stable and deterministic.
- Empty result returns a typed domain error.

#### Acceptance Criteria

- Product selector can be called without AI.
- Allergy conflicts are removed before context building.
- Unknown allergies are rejected or normalized consistently.
- Empty/insufficient catalogues produce a controlled error.

#### Files Likely Touched

- `server/mealPlanning/mealPlanTypes.ts`
- `server/mealPlanning/mealPlanSchemas.ts`
- `server/mealPlanning/productSelector.ts`
- product selector tests

#### Dependencies

- Catalogue status/read path from Slice 2.
- Clear decision on `inferred` product usage.

## 8. Slice 4: Meal Plan API With Deterministic Mock Generator

**User value:** a client can submit constraints and receive a valid meal-plan-shaped response.  
**Operational value:** route validation, product selection, pricing, and shopping-list consolidation can be tested before live AI.

#### Scope

- Add `POST /api/meal-plans/generate`.
- Use a deterministic mock planner instead of NVIDIA.
- Build the full response shape.
- Validate request and response.
- Compute shopping list and budget server-side.

#### Backend Work

- Create `server/mealPlanning/mealPlanRoutes.ts`.
- Create `server/mealPlanning/mealPlanController.ts`.
- Create `server/mealPlanning/mockPlanner.ts`.
- Create `server/mealPlanning/shoppingList.ts`.
- Create `server/mealPlanning/mealPlanValidator.ts`.
- Implement request validation:
  - budget integer range.
  - household size range.
  - meal types.
  - preferences.
  - cuisine text length.
  - appliances.
  - allergies.
  - disliked ingredients.
- Implement deterministic mock plan:
  - use selected product IDs only.
  - generate 7 days.
  - generate selected meal types only.
  - keep recipe/product structure plausible.
- Compute:
  - recipe product usage.
  - shopping-list quantities.
  - total price.
  - budget status.

#### API Contract

`POST /api/meal-plans/generate`

Request:

```json
{
  "budgetPence": 7000,
  "householdSize": 2,
  "mealsPerDay": ["dinner"],
  "mealPreferences": ["quick", "low-waste"],
  "cuisinePreferences": ["Italian", "British"],
  "appliances": ["hob", "oven"],
  "allergies": [],
  "dislikedIngredients": []
}
```

Response:

```json
{
  "planId": "local-generated-id",
  "generatedAt": "2026-08-13T00:00:00.000Z",
  "currency": "GBP",
  "budgetPence": 7000,
  "estimatedTotalPence": 6420,
  "budgetStatus": "within-budget",
  "assumptions": [],
  "warnings": [],
  "days": [],
  "recipes": [],
  "shoppingList": [],
  "productCoverage": {
    "productsConsidered": 80,
    "productsUsed": 18,
    "excludedForAllergies": 0,
    "excludedForSafety": 12
  }
}
```

#### Tests

- Invalid request returns `400`.
- Empty catalogue returns `503` or `409` depending cause.
- Allergy over-filtering returns `409`.
- Unknown product IDs are rejected by validator.
- Shopping list consolidates duplicates.
- Server recomputes totals and ignores generator-provided prices.

#### Acceptance Criteria

- Route returns a complete meal-plan response without live AI.
- Response uses only selected product IDs.
- Shopping list is grouped and priced server-side.
- Over-budget mock output is rejected or marked according to policy.
- Typecheck and tests pass.

#### Files Likely Touched

- `server/app.ts`
- `server/mealPlanning/mealPlanRoutes.ts`
- `server/mealPlanning/mealPlanController.ts`
- `server/mealPlanning/mockPlanner.ts`
- `server/mealPlanning/shoppingList.ts`
- `server/mealPlanning/mealPlanValidator.ts`
- meal planning tests

#### Dependencies

- Slice 3 product selector.

## 9. Slice 5: Compact AI Context Builder

**User value:** plans can become more relevant while still grounded in real Aldi products.  
**Operational value:** the AI payload is controlled, bounded, and testable.

#### Scope

- Convert selected product records into compact AI context.
- Keep token/cost risk bounded.
- Create prompt inputs without calling NVIDIA yet.

#### Backend Work

- Create `server/mealPlanning/contextBuilder.ts`.
- Define `AiContextProduct`.
- Include:
  - product ID.
  - name.
  - brand.
  - category.
  - price.
  - package size.
  - normalized allergens.
  - dietary text only if compact.
  - safety status if inferred products are allowed.
- Exclude:
  - raw Mongo documents.
  - long descriptions.
  - crawl metadata.
  - raw prompt-debug noise.
- Add maximum product cap, default 120.
- Add budget-aware category allocation:
  - proteins.
  - carbohydrates/staples.
  - vegetables.
  - dairy/eggs or substitutes.
  - sauces/flavour.

#### Tests

- Context omits disallowed fields.
- Context caps product count.
- Context preserves product IDs.
- Context includes warnings when inferred products are present.
- Context is deterministic for the same product input.

#### Acceptance Criteria

- Context builder produces compact JSON.
- Product count cap is enforced.
- No full catalogue is sent.
- No secret or environment value appears in context.

#### Files Likely Touched

- `server/mealPlanning/contextBuilder.ts`
- context builder tests

#### Dependencies

- Product selector output from Slice 3.
- Mock route from Slice 4 can keep using mock planner while this lands.

## 10. Slice 6: NVIDIA AI Integration Behind A Feature Switch

**User value:** the app can generate richer plans using AI.  
**Operational value:** live AI can be enabled only after deterministic validation is already in place.

#### Scope

- Add NVIDIA client.
- Add prompt builder.
- Keep mock generator available for tests and local fallback.
- Route can choose live AI when configured.

#### Backend Work

- Create `server/mealPlanning/nvidiaClient.ts`.
- Create `server/mealPlanning/promptBuilder.ts`.
- Add env variables:
  - `NVIDIA_API_KEY`.
  - `NVIDIA_API_URL`.
  - `NVIDIA_MODEL`.
  - `AI_REQUEST_TIMEOUT_MS`.
  - `AI_MAX_RETRIES`.
  - `MEAL_PLAN_GENERATOR=mock|nvidia`.
- Implement:
  - timeout with `AbortController`.
  - one retry for transient failures.
  - strict JSON output instruction.
  - safe logging without prompts or secrets by default.
  - parse failure handling.
- Ensure live AI output flows through the same validator and shopping-list consolidator from Slice 4.

#### Prompt Requirements

Prompt must require:

- exactly 7 days.
- only requested meal types.
- only supplied product IDs.
- no made-up Aldi products.
- no allergy conflicts.
- no unavailable appliances.
- budget below `budgetPence`.
- strict JSON only.

#### Tests

- NVIDIA client sends expected request shape with mocked fetch.
- Timeout maps to `504`.
- Invalid JSON maps to retry then `422`.
- Unknown product ID in AI response is rejected.
- Model-provided prices are ignored.

#### Acceptance Criteria

- Mock generator remains testable.
- Live generator is environment-controlled.
- Live AI responses are validated before client response.
- Failure responses are controlled and do not expose secrets.

#### Files Likely Touched

- `server/config/env.ts`
- `server/mealPlanning/nvidiaClient.ts`
- `server/mealPlanning/promptBuilder.ts`
- `server/mealPlanning/mealPlanController.ts`
- AI integration tests

#### Dependencies

- Slice 4 validator and response assembly.
- Slice 5 context builder.
- NVIDIA API credentials for manual live verification.

## 11. Slice 7: AI Route Rate Limiting And Hardening

**User value:** better reliability during retries and accidental repeated submissions.  
**Operational value:** sensitive AI route is protected server-side.

#### Scope

- Rate limit `POST /api/meal-plans/generate`.
- Harden errors and request limits.
- Add route-level resilience.

#### Backend Work

- Add a simple in-memory rate limiter for MVP or install a small dependency only if justified.
- Configure:
  - `MEAL_PLAN_RATE_LIMIT_WINDOW_MS`.
  - `MEAL_PLAN_RATE_LIMIT_MAX`.
- Apply limiter only to AI generation route.
- Add idempotency consideration:
  - frontend should disable duplicate submit.
  - backend should tolerate repeated identical requests.
- Add structured error codes:
  - `INVALID_MEAL_PLAN_REQUEST`.
  - `CATALOGUE_UNAVAILABLE`.
  - `CATALOGUE_CONSTRAINT_CONFLICT`.
  - `AI_TIMEOUT`.
  - `AI_INVALID_RESPONSE`.
  - `RATE_LIMITED`.

#### Tests

- Exceeding limit returns `429`.
- Limit resets after window.
- Error response shape is consistent.
- Request body limit rejects oversized requests.

#### Acceptance Criteria

- AI route cannot be spammed freely.
- Client receives useful retry information.
- Error responses use the common API shape.

#### Files Likely Touched

- `server/http/rateLimit.ts`
- `server/mealPlanning/mealPlanRoutes.ts`
- `server/http/errors.ts`
- rate-limit tests

#### Dependencies

- Slice 4 route.

## 12. Slice 8: Frontend Walking Skeleton

**User value:** users can open the app and see the ThriftChef planning interface.  
**Operational value:** frontend build/dev workflow is established.

#### Scope

- Add React/Vite/TypeScript/Tailwind frontend.
- Render application shell and empty state.
- Connect to health/catalogue status endpoints.

#### Frontend Work

- Create `client/` or root-integrated Vite setup.
- Install frontend dependencies:
  - `react`.
  - `react-dom`.
  - `vite`.
  - `@vitejs/plugin-react`.
  - `tailwindcss` and related setup appropriate to selected Tailwind version.
- Add:
  - `client/src/main.tsx`.
  - `client/src/App.tsx`.
  - `client/src/api/http.ts`.
  - `client/src/components/StatusPanel.tsx`.
  - `client/src/styles/index.css`.
- Show:
  - application title.
  - catalogue readiness.
  - empty plan state.
  - API connectivity error state.

#### Design Direction

- Use a practical meal-planning tool layout, not a marketing landing page.
- First screen should be the actual planning workflow.
- Use responsive layout.
- Keep cards restrained; use grouped sections and clear form structure.
- No emojis.

#### Tests

- Build check.
- Optional basic component test if Vitest is added now.
- Manual browser verification.

#### Acceptance Criteria

- `npm run dev:client` starts the frontend.
- App loads locally.
- Health/catalogue status is visible or gracefully errors.
- Mobile and desktop layouts are usable.

#### Files Likely Touched

- `client/*`
- root `package.json` scripts or `client/package.json`
- Tailwind config files
- Vite config

#### Dependencies

- Slice 1 health endpoint.
- Slice 2 catalogue status endpoint.

## 13. Slice 9: Constraint Form And Request Validation UI

**User value:** users can enter the required meal-planning constraints.  
**Operational value:** client request shape is aligned with backend validation.

#### Scope

- Build the complete form.
- Validate obvious client-side errors.
- Do not require live AI for this slice.

#### Frontend Work

- Create `ConstraintForm.tsx`.
- Create `PreferenceControls.tsx`.
- Fields:
  - weekly budget.
  - household size.
  - meal types.
  - meal preferences.
  - cuisine preferences.
  - appliances.
  - allergies.
  - disliked ingredients.
- Add inline errors:
  - budget below minimum.
  - household size outside range.
  - no meal type selected.
  - no cooking method selected unless no-cook is supported.
  - overlong free text.
- Normalize request payload before submit.

#### Backend Work

- Confirm backend schema rejects the same invalid shapes.
- Add error details that the frontend can map to fields.

#### Tests

- Form disables submit for invalid inputs.
- Form builds expected request body.
- Backend still rejects invalid requests.

#### Acceptance Criteria

- User can complete all MVP inputs.
- Invalid inputs are caught before submit where practical.
- Backend remains authoritative.
- No generated plan display is required yet.

#### Files Likely Touched

- `client/src/components/ConstraintForm.tsx`
- `client/src/components/PreferenceControls.tsx`
- `client/src/api/mealPlans.ts`
- backend request schema tests if gaps are found

#### Dependencies

- Slice 8 frontend skeleton.
- Slice 4 meal plan route.

## 14. Slice 10: Generate Plan End-To-End With Mock Planner

**User value:** users can generate and view a complete weekly plan locally without AI credentials.  
**Operational value:** the whole app flow is testable deterministically.

#### Scope

- Wire form submit to `POST /api/meal-plans/generate`.
- Use mock generator mode.
- Render results.

#### Frontend Work

- Create `MealPlanResults.tsx`.
- Create `RecipeCard.tsx`.
- Create `ShoppingList.tsx`.
- Add loading skeletons.
- Add error state with retry.
- Add edit constraints action.
- Add regenerate action using same request.
- Display:
  - budget vs total.
  - warnings.
  - 7-day calendar.
  - recipe cards.
  - grouped shopping list.
  - product links.

#### Backend Work

- Ensure `MEAL_PLAN_GENERATOR=mock` produces stable responses.
- Ensure response warnings include inferred allergen caveats if applicable.

#### Tests

- Frontend renders loading state.
- Frontend renders API errors.
- Frontend renders a plan response.
- Backend endpoint works with mock generator.

#### Acceptance Criteria

- User can submit constraints from the browser.
- User sees a generated 7-day plan.
- User sees a grouped Aldi shopping list.
- Total is shown in GBP.
- Retry/edit flows work.

#### Files Likely Touched

- `client/src/App.tsx`
- `client/src/api/mealPlans.ts`
- `client/src/components/MealPlanResults.tsx`
- `client/src/components/RecipeCard.tsx`
- `client/src/components/ShoppingList.tsx`
- backend mock generator if response shape gaps appear

#### Dependencies

- Slice 4 mock route.
- Slice 9 form.

## 15. Slice 11: Live NVIDIA Plan Generation

**User value:** users get more realistic, varied recipe plans.  
**Operational value:** live AI behavior is integrated after deterministic flow works.

#### Scope

- Enable `MEAL_PLAN_GENERATOR=nvidia`.
- Run manual live requests with a seeded/crawled catalogue.
- Tighten prompt and validation based on observed failures.

#### Backend Work

- Use compact context builder.
- Use NVIDIA client.
- Add regeneration-on-invalid behavior:
  - one retry for invalid JSON.
  - one retry for over-budget or unknown product IDs only if failure is likely recoverable.
- Preserve final server-side validation.
- Add warnings for inferred allergen planning.

#### Frontend Work

- Surface AI timeout and invalid-response errors cleanly.
- Keep UI copy practical:
  - "Could not generate a valid plan with these constraints."
  - "Try increasing the budget or reducing meal types."

#### Tests

- Mocked AI response success.
- Mocked AI invalid JSON.
- Mocked AI unknown product.
- Mocked AI over-budget result.
- Manual live run with credentials.

#### Acceptance Criteria

- Live NVIDIA mode returns a validated plan.
- Invalid live responses fail safely.
- Prompt does not leak secrets.
- Full user flow still works in mock mode.

#### Files Likely Touched

- `server/mealPlanning/nvidiaClient.ts`
- `server/mealPlanning/promptBuilder.ts`
- `server/mealPlanning/mealPlanController.ts`
- frontend error rendering if needed

#### Dependencies

- Slice 6 AI integration.
- Slice 10 end-to-end mock flow.
- Valid NVIDIA credentials.

## 16. Slice 12: Catalogue Crawl Expansion And Freshness Workflow

**User value:** generated plans have enough Aldi products to be useful.  
**Operational value:** catalogue maintenance is documented and less manual.

#### Scope

- Expand and verify food category coverage.
- Improve crawler persistence rules.
- Add freshness behavior into planning.

#### Backend Work

- Confirm each enabled Aldi URL in `aldiCategories.ts`.
- Keep non-food categories out.
- Decide whether disabled Drinks categories stay disabled.
- Mark products unavailable only after successful category crawl completion.
- Ensure crawl summary reports:
  - categories requested.
  - links discovered.
  - products scraped.
  - inserts.
  - updates.
  - price changes.
  - skipped.
  - issues.
- Add docs section for running:
  - `npm run aldi:crawl`.
  - bounded crawl using `ALDI_MAX_PRODUCTS_PER_CATEGORY`.
  - headless/manual store selection mode.

#### Tests

- Crawler helper tests remain passing.
- Persistence merge test if model layer is testable without live Aldi.
- Manual bounded crawl with low product count.

#### Acceptance Criteria

- Catalogue has enough food products for a basic weekly plan.
- Catalogue status reflects latest crawl.
- Planning blocks or warns on stale catalogue according to configured policy.

#### Files Likely Touched

- `server/catalogue/aldi/aldiCategories.ts`
- `server/catalogue/aldi/aldiCrawler.ts`
- `docs/` runbook section or separate crawl doc
- tests for crawler/persistence helpers

#### Dependencies

- Live Aldi page behavior.
- MongoDB connection.
- Manual store selection if required by Aldi.

## 17. Slice 13: UX Polish And Accessibility

**User value:** the app is easier to use and trust.  
**Operational value:** fewer support issues from unclear failures.

#### Scope

- Improve visual hierarchy.
- Improve mobile layout.
- Ensure accessibility basics.
- Add trust-building warning copy for inferred allergens and catalogue freshness.

#### Frontend Work

- Audit form labels and error associations.
- Add accessible loading skeletons.
- Add empty and error states with concrete recovery actions.
- Ensure buttons have stable text and disabled states.
- Ensure product links are obvious and open safely.
- Ensure long recipe/shopping-list text wraps correctly.
- Add print-friendly shopping list styling if low effort.

#### Tests

- Keyboard tab-through manual check.
- Mobile viewport manual check.
- Build passes.
- Component tests for key states if test harness exists.

#### Acceptance Criteria

- Form works by keyboard.
- Error messages are readable and actionable.
- Layout does not overlap at mobile widths.
- All major states are visually distinct.

#### Files Likely Touched

- `client/src/components/*`
- `client/src/styles/index.css`

#### Dependencies

- Slice 10 frontend results flow.

## 18. Slice 14: Production Build And Deployment Readiness

**User value:** the MVP can be hosted and shared.  
**Operational value:** deployment is repeatable and verifiable.

#### Scope

- Add production build flow.
- Document environment setup.
- Verify API and frontend builds.
- Prepare deploy target but do not deploy without explicit approval.

#### Backend Work

- Decide production server strategy:
  - compile TypeScript to `dist`, or
  - run through platform-supported TypeScript loader.
- If compiling:
  - add `tsconfig.build.json`.
  - add `build:server`.
  - add `start`.
- Configure static frontend serving only if deploying backend and frontend together.

#### Frontend Work

- Add production API base URL configuration.
- Ensure Vite build emits expected assets.

#### Documentation Work

- Add setup docs:
  - install.
  - env vars.
  - crawl.
  - dev server.
  - test.
  - build.
  - known limitations.

#### Tests

- `npm run typecheck`.
- `npm test`.
- `npm run build`.
- Manual smoke test against production build if feasible.

#### Acceptance Criteria

- Clean install/build path is documented.
- Production build passes.
- Required env vars are known.
- Deployment can proceed as a separate approved action.

#### Files Likely Touched

- `package.json`
- `tsconfig.build.json`
- deployment docs
- Vite config

#### Dependencies

- Frontend project structure.
- Chosen deployment platform.

## 19. Slice 15: Final End-To-End Verification

**User value:** confidence that the MVP works as promised.  
**Operational value:** clear release-readiness evidence.

#### Scope

- Verify the complete flow against real or seeded catalogue data.
- Capture known limitations.
- Fix blocking defects only.

#### Verification Matrix

| Area | Command Or Check | Expected Result |
| --- | --- | --- |
| TypeScript | `npm run typecheck` | Pass |
| Unit tests | `npm run test:unit` | Pass |
| Full tests | `npm test` | Pass |
| Backend dev | `npm run dev:server` | API starts |
| Frontend dev | `npm run dev:client` | UI starts |
| Health | `GET /api/health` | 200 OK |
| Catalogue | `GET /api/catalogue/status` | Counts returned |
| Mock generation | Submit form in mock mode | Plan displayed |
| Live generation | Submit form in NVIDIA mode | Validated plan displayed |
| Allergy handling | Select milk/gluten allergy | Conflicting products excluded or safe conflict error |
| Low budget | Submit too-low budget | Controlled 409 response |
| AI timeout | Mock timeout | Controlled 504 response |
| Mobile UI | Browser mobile viewport | No overlap, usable form/results |

#### Acceptance Criteria

- Manual end-to-end flow succeeds.
- Blocking failures are fixed.
- Non-blocking limitations are documented.
- No secrets appear in logs or client responses.

#### Files Likely Touched

- Any defect-specific files.
- Docs for limitations and setup.

#### Dependencies

- All prior slices.
- Live credentials if live AI is part of release verification.

## 20. Suggested Execution Order

1. Slice 0: Repo Stabilization And Test Harness.
2. Slice 1: API Walking Skeleton.
3. Slice 2: Catalogue Status Read Path.
4. Slice 3: Product Selector And Planning Eligibility.
5. Slice 4: Meal Plan API With Deterministic Mock Generator.
6. Slice 5: Compact AI Context Builder.
7. Slice 6: NVIDIA AI Integration Behind A Feature Switch.
8. Slice 7: AI Route Rate Limiting And Hardening.
9. Slice 8: Frontend Walking Skeleton.
10. Slice 9: Constraint Form And Request Validation UI.
11. Slice 10: Generate Plan End-To-End With Mock Planner.
12. Slice 11: Live NVIDIA Plan Generation.
13. Slice 12: Catalogue Crawl Expansion And Freshness Workflow.
14. Slice 13: UX Polish And Accessibility.
15. Slice 14: Production Build And Deployment Readiness.
16. Slice 15: Final End-To-End Verification.

## 21. Parallelization Opportunities

Some work can proceed in parallel after the API contract is stable:

- Frontend skeleton can start after Slice 1 and use mocked API responses.
- Catalogue crawl expansion can continue while meal-planning API work proceeds, as long as the `Product` model contract stays stable.
- UX polish can begin after the first working frontend results state.
- Deployment docs can start once the package/script strategy is chosen.

Avoid parallel changes to:

- `Product.ts` safety semantics.
- meal plan response schema.
- request validation enums.
- package/module configuration.

Those contracts affect several slices and should be changed deliberately.

## 22. Key Decisions To Confirm Before Implementation

### 22.1 Inferred Allergen Policy

Recommended:

- Permit inferred products only when the user selects no allergies.
- Block inferred products for allergy-sensitive requests.
- Always display a warning when inferred products influence a plan.

Reason:

- Aldi product pages may not expose full allergen data.
- Inference is useful for likely exclusions but cannot guarantee safety.

### 22.2 Frontend Package Layout

Recommended:

- Use `client/` with Vite and integrate root scripts for convenience.

Reason:

- Keeps backend and frontend concerns separate while preserving a simple root workflow.

### 22.3 Test Runner

Recommended:

- Keep Node test runner for current backend unit tests initially.
- Add Vitest only when frontend tests are introduced.

Reason:

- Existing tests already use `node:test`.
- Avoid dependency churn before frontend exists.

### 22.4 Meal Generator Switch

Recommended:

- Use `MEAL_PLAN_GENERATOR=mock|nvidia`.

Reason:

- Keeps local development and tests deterministic.
- Allows live AI issues to be isolated from application flow issues.

## 23. Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Aldi category selectors change | Catalogue crawl breaks | Keep crawler helper tests and bounded manual crawl checks |
| Aldi lacks verified allergen data | Allergy-safe planning may be impossible | Treat inferred allergens as warnings, block allergy-sensitive inferred use |
| AI invents products | Shopping list becomes invalid | Validate product IDs against selected catalogue records |
| AI exceeds budget | User promise fails | Recompute totals server-side and retry/reject |
| Token/context size grows | Slow or expensive AI calls | Cap context products and project compact fields only |
| Empty or stale catalogue | No valid plan | Catalogue status endpoint and controlled `503`/warning behavior |
| Frontend/backend schema drift | Broken submissions | Shared TypeScript types or explicit contract tests |
| Duplicate submissions | Repeated AI costs | Frontend disabled state plus server-side rate limiting |
| Secrets leak in logs | Security incident | Central env handling and no prompt/API-key logging |

## 24. Definition Of Complete MVP

The MVP is complete when:

- `npm test` passes.
- API health works.
- Catalogue status works.
- Aldi catalogue has enough usable food products.
- User can submit planning constraints in the browser.
- Backend can generate a plan in mock mode.
- Backend can generate a validated plan in NVIDIA mode when credentials are present.
- Shopping list uses real product records and server-computed prices.
- Allergy and safety policies are enforced server-side.
- AI route is rate limited.
- Frontend displays loading, empty, error, and success states.
- Manual end-to-end verification passes for a realistic household profile.
- Setup, crawl, test, and build instructions are documented.

## 25. First Implementation Task Recommendation

Start with Slice 0.

Reason:

- The worktree already contains new TypeScript tests and module-configuration changes.
- Locking down the test command first gives every later slice a reliable verification baseline.
- It is small, low risk, and produces immediate feedback before API and frontend work begins.
