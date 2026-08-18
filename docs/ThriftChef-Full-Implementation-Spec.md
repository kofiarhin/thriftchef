# ThriftChef Full Implementation Spec

**Status:** Implementation-ready draft  
**Source product brief:** `docs/ThriftChef-PRD-v0.1 (1).md`  
**Current implementation baseline:** TypeScript Node backend with Express, Mongoose, Crawlee, Playwright, one Aldi UK catalogue crawler, and a `Product` MongoDB model.

## 1. Purpose

ThriftChef is an MVP budget meal-planning application for Aldi UK shoppers.
The product must let a user enter household and food constraints, then generate a practical 7-day meal plan, recipes, estimated Aldi basket total, and consolidated shopping list using only eligible Aldi catalogue products.

The full implementation must deliver one complete end-to-end flow:

1. Crawl and store Aldi UK product catalogue data.
2. Filter product data based on budget, allergies, preferences, and planning safety.
3. Build a compact AI context from filtered products.
4. Generate a structured weekly meal plan through the NVIDIA AI API.
5. Validate the AI output against budget, product availability, allergies, and schema rules.
6. Display the generated plan in a usable React frontend.

## 2. Product Scope

### 2.1 In Scope

- Aldi UK only.
- Single-store planning using configured Aldi store metadata.
- Anonymous, one-session weekly meal planning.
- 7-day meal plan generation.
- Breakfast, lunch, dinner, and optional snack support, configurable from the request.
- Budget-aware recipe and basket generation.
- Household size and serving scaling.
- Meal preference filtering.
- Cuisine preference guidance.
- Appliance-aware recipe generation.
- Allergy filtering using verified catalogue allergen fields.
- Consolidated shopping list grouped by store category.
- Estimated total basket cost in pounds and pence.
- AI output validation and repair failure handling.
- Basic catalogue admin/status endpoints.
- Responsive web UI.
- Local development setup and verification commands.

### 2.2 Out Of Scope For MVP

- Authentication and user accounts.
- Saved plans or plan history.
- Multiple retailers.
- Pantry inventory.
- Nutrition tracking beyond optional future data fields.
- Delivery checkout integration.
- Payments.
- Mobile apps.
- Social sharing.
- Real-time Aldi stock guarantees.

## 3. Users And Core Jobs

### 3.1 Primary Users

- Budget-conscious families.
- Students.
- Couples.
- Busy professionals.
- Small households trying to reduce food waste.

### 3.2 User Jobs

- "I need a weekly meal plan that fits my food budget."
- "I need meals my household can actually cook with our appliances."
- "I need to avoid allergens without checking every product manually."
- "I need one Aldi shopping list instead of disconnected recipes."

## 4. Current Repository Baseline

### 4.1 Existing Files

- `server/models/Product.ts`
  - Defines `ProductRecord`.
  - Stores Aldi product identity, category paths, price, package text, ingredient text, allergen text, normalized allergens, planning eligibility, image URL, availability, and crawl metadata.
- `server/catalogue/aldi/aldiCrawler.ts`
  - Crawls configured Aldi category pages.
  - Extracts listing and detail product data.
  - Normalizes allergen signals.
  - Marks catalogue safety as `verified`, `incomplete`, or `ambiguous`.
  - Persists product records with idempotent upserts.
- `server/catalogue/aldi/aldiCategories.ts`
  - Contains one enabled Aldi category.
- `server/catalogue/aldi/runAldiCrawl.ts`
  - Connects to MongoDB and runs the Aldi crawl.
- `server/app.js` and `server/server.js`
  - Currently empty and must be replaced or migrated into TypeScript application entrypoints.
- `scripts/test-aldi-crawler.js`
  - Manual test crawler script.
- `package.json`
  - Uses `npm`.
  - Scripts: `test`, `typecheck`, `aldi:crawl`.
  - Dependencies: `express`, `mongoose`, `cors`, `dotenv`, `crawlee`, `playwright`.

### 4.2 Required Structural Direction

The implementation should migrate runtime backend files to TypeScript and keep JavaScript scripts only when they are intentionally manual tooling. The recommended backend source layout is:

```text
server/
  app.ts
  server.ts
  config/
    env.ts
  db/
    connect.ts
  catalogue/
    aldi/
      aldiCategories.ts
      aldiCrawler.ts
      runAldiCrawl.ts
  mealPlanning/
    mealPlanController.ts
    mealPlanRoutes.ts
    mealPlanSchemas.ts
    productSelector.ts
    contextBuilder.ts
    nvidiaClient.ts
    mealPlanValidator.ts
    mealPlanTypes.ts
  models/
    Product.ts
```

The recommended frontend source layout is:

```text
client/
  index.html
  package.json or root-integrated Vite config
  src/
    main.tsx
    App.tsx
    api/
      mealPlans.ts
    components/
      ConstraintForm.tsx
      PreferenceControls.tsx
      MealPlanResults.tsx
      ShoppingList.tsx
      RecipeCard.tsx
      StatusPanel.tsx
    styles/
      index.css
```

For a small MVP, the frontend can be added as `client/` with its own Vite setup or integrated into the root package scripts. Use one package-management style consistently.

## 5. Technology Requirements

### 5.1 Backend

- Node.js.
- TypeScript.
- Express.
- Mongoose.
- MongoDB.
- Crawlee and Playwright for catalogue ingestion.
- Built-in `fetch` or a small HTTP client for NVIDIA API calls.
- No new backend framework unless explicitly approved.

### 5.2 Frontend

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- TanStack Query for server state if async client state grows beyond one direct request.
- Local component state for the form.
- No authentication framework in MVP.

### 5.3 Testing

- Backend unit tests should use the repository's selected test runner.
- If adding a test runner, use Jest for backend and Vitest for frontend.
- Integration tests should use an isolated test database or mocked Mongoose layer.
- Frontend behavior tests should focus on form validation, API states, and result rendering.

## 6. Configuration

### 6.1 Required Environment Variables

```text
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=<mongo connection string>
NVIDIA_API_KEY=<secret>
NVIDIA_API_URL=<chat completions endpoint>
NVIDIA_MODEL=<model id>
AI_REQUEST_TIMEOUT_MS=120000
AI_MAX_RETRIES=0
MEAL_PLAN_RATE_LIMIT_WINDOW_MS=60000
MEAL_PLAN_RATE_LIMIT_MAX=10
ALDI_STORE_ID=belper-de56-1ar
ALDI_EXPECTED_STORE_TEXT=DE56 1AR
ALDI_HEADLESS=false
ALDI_MAX_PRODUCTS_PER_CATEGORY=50
```

Secrets must stay in `.env` or the deployment platform secret manager and must never be logged.

`AI_REQUEST_TIMEOUT_MS` is the total budget for one generation request, shared by
every attempt, and is capped at 120000. A timeout is never retried regardless of
`AI_MAX_RETRIES`, which covers transient upstream failures only; the validation
repair attempt shares the same deadline. A measured live generation of a
seven-day dinner plan took ~37.6s upstream, so the former 30000 default failed
systematically.

### 6.2 Optional Environment Variables

```text
CATALOGUE_STALE_AFTER_HOURS=72
MEAL_PLAN_MAX_CONTEXT_PRODUCTS=80
MEAL_PLAN_DEFAULT_SNACKS=false
LOG_LEVEL=info
```

## 7. Data Model

### 7.1 Product

Keep the existing `ProductRecord` as the canonical catalogue model. Add fields only when needed by planning:

```ts
interface ProductRecord {
  retailer: "aldi-uk";
  storeId: string;
  retailerProductId: string;
  canonicalKey: string;
  name: string;
  brand: string | null;
  description: string | null;
  categoryPaths: string[][];
  pricePence: number;
  previousPricePence: number | null;
  priceChangedAt: Date | null;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  ingredientsRaw: string | null;
  allergenAdviceRaw: string | null;
  dietaryInformationRaw: string | null;
  normalizedAllergens: string[];
  catalogueSafetyStatus: "verified" | "incomplete" | "ambiguous";
  eligibleForPlanning: boolean;
  safetyIssues: string[];
  imageUrl: string | null;
  productUrl: string;
  available: boolean;
  lastCheckedAt: Date;
  lastSeenAt: Date;
  lastCrawlRunId: string;
}
```

### 7.2 Meal Plan Request

```ts
interface MealPlanRequest {
  budgetPence: number;
  householdSize: number;
  mealsPerDay: Array<"breakfast" | "lunch" | "dinner" | "snack">;
  mealPreferences: Array<
    "quick" |
    "family-friendly" |
    "high-protein" |
    "vegetarian" |
    "low-waste" |
    "batch-cook"
  >;
  cuisinePreferences: string[];
  appliances: Array<
    "hob" |
    "oven" |
    "microwave" |
    "air-fryer" |
    "slow-cooker" |
    "toaster" |
    "kettle" |
    "blender"
  >;
  allergies: string[];
  dislikedIngredients: string[];
  storeId?: string;
}
```

Validation rules:

- `budgetPence` must be an integer between 1000 and 50000.
- `householdSize` must be an integer between 1 and 10.
- `mealsPerDay` must include at least one meal type.
- `appliances` must include at least one cooking method or explicitly allow no-cook meals.
- `allergies` must be normalized to supported allergen slugs.
- Unknown cuisine strings must be trimmed and length-limited.
- Request body size must be limited.

### 7.3 Meal Plan Response

```ts
interface MealPlanResponse {
  planId: string;
  generatedAt: string;
  currency: "GBP";
  budgetPence: number;
  estimatedTotalPence: number;
  budgetStatus: "within-budget" | "over-budget" | "insufficient-products";
  assumptions: string[];
  warnings: string[];
  days: MealPlanDay[];
  recipes: Recipe[];
  shoppingList: ShoppingListGroup[];
  productCoverage: {
    productsConsidered: number;
    productsUsed: number;
    excludedForAllergies: number;
    excludedForSafety: number;
  };
}

interface MealPlanDay {
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  meals: MealPlanMeal[];
}

interface MealPlanMeal {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId: string;
  title: string;
  servings: number;
  estimatedCostPence: number;
}

interface Recipe {
  id: string;
  title: string;
  mealType: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  appliances: string[];
  ingredients: RecipeIngredient[];
  steps: string[];
  allergenWarnings: string[];
  productIds: string[];
}

interface RecipeIngredient {
  productId: string;
  name: string;
  quantity: string;
  estimatedCostPence: number;
}

interface ShoppingListGroup {
  category: string;
  items: ShoppingListItem[];
}

interface ShoppingListItem {
  productId: string;
  name: string;
  brand: string | null;
  packageSize: string | null;
  quantity: number;
  unitPricePence: number;
  totalPricePence: number;
  productUrl: string;
}
```

The response must be generated fresh and not persisted in MVP unless lightweight request logging is explicitly added later.

## 8. Backend API

### 8.1 Health

`GET /api/health`

Response:

```json
{
  "ok": true,
  "service": "thriftchef-api",
  "version": "1.0.0"
}
```

### 8.2 Catalogue Status

`GET /api/catalogue/status?storeId=belper-de56-1ar`

Response:

```json
{
  "retailer": "aldi-uk",
  "storeId": "belper-de56-1ar",
  "availableProducts": 238,
  "eligibleProducts": 164,
  "lastCheckedAt": "2026-08-13T00:00:00.000Z",
  "isStale": false,
  "safetyBreakdown": {
    "verified": 164,
    "incomplete": 55,
    "ambiguous": 19
  }
}
```

### 8.3 Generate Meal Plan

`POST /api/meal-plans/generate`

Responsibilities:

1. Validate request.
2. Rate limit the route.
3. Query eligible Aldi products.
4. Exclude unavailable products.
5. Exclude products with unsupported or matching allergens.
6. Build compact AI context.
7. Call NVIDIA API.
8. Validate AI JSON.
9. Reconcile recipe ingredients with product records.
10. Consolidate shopping list.
11. Confirm total cost.
12. Return structured response or actionable error.

Success status: `200 OK`.

Client errors:

- `400 Bad Request` for invalid inputs.
- `409 Conflict` for constraints that cannot be satisfied with the current catalogue.
- `422 Unprocessable Entity` for valid inputs that repeatedly produce invalid AI output.
- `429 Too Many Requests` for rate limit violations.

Server errors:

- `503 Service Unavailable` for missing or stale catalogue when no safe fallback exists.
- `504 Gateway Timeout` for NVIDIA timeout.
- `500 Internal Server Error` for unexpected failures.

### 8.4 Error Shape

```ts
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

Never include secrets, raw API keys, full AI prompts, or raw stack traces in client errors.

## 9. Product Selection

### 9.1 Query Rules

The product selector must query MongoDB using:

- `retailer: "aldi-uk"`.
- `storeId` from request or default config.
- `available: true`.
- `eligibleForPlanning: true`.
- `catalogueSafetyStatus: "verified"`.
- `pricePence > 0`.

Then it must exclude:

- Products with `normalizedAllergens` intersecting requested allergies.
- Products with ambiguous or missing safety fields.
- Products that are obviously non-food if future categories include household items.

### 9.2 Ranking Rules

Products should be ranked before building AI context:

1. Low price per package.
2. Useful staple categories.
3. Products with complete names, package sizes, and ingredients.
4. Products matching preference signals.
5. Products seen in the latest crawl.

### 9.3 Context Budget

The context builder must cap products sent to AI. Default maximum: 120 products.

Include only compact product fields:

```ts
interface AiContextProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  pricePence: number;
  packageSize: string | null;
  allergens: string[];
  dietaryInfo: string | null;
}
```

Do not send the entire catalogue or raw MongoDB documents.

## 10. AI Integration

### 10.1 NVIDIA Client

Create `server/mealPlanning/nvidiaClient.ts`.

Responsibilities:

- Read endpoint, model, and API key from environment.
- Enforce timeout with `AbortController`.
- Send a deterministic JSON-focused prompt.
- Retry at most once for transient network errors.
- Return parsed JSON candidate and metadata.
- Never log the API key.

### 10.2 Prompt Requirements

The AI prompt must instruct the model to:

- Use only product IDs present in the supplied context.
- Produce exactly 7 days.
- Use only requested meal types.
- Respect allergies.
- Respect appliance constraints.
- Keep the total estimated basket cost at or below budget.
- Prefer ingredient reuse to reduce waste.
- Return strict JSON only.

The prompt must include:

- Household size.
- Budget.
- Meal types.
- Preferences.
- Cuisines.
- Appliances.
- Allergies.
- Product context.
- Required output schema.

### 10.3 AI Output Handling

The backend must not trust AI output directly. It must validate:

- JSON parseability.
- Required top-level fields.
- Exactly 7 days.
- Valid meal types.
- Recipe references exist.
- Ingredient product IDs exist in the selected product set.
- No allergy-conflicting product IDs.
- Appliances are allowed.
- Shopping list quantities are positive integers.
- Prices match product records, not model-provided prices.
- Total is recomputed server-side.

If AI output includes unknown products or invalid prices, the server must reject or repair by removing model prices and recomputing from product records. It must not invent product records.

## 11. Meal Plan Validation

### 11.1 Budget Validation

Budget enforcement is server-side:

1. AI proposes recipes and product IDs.
2. Server builds shopping list from product IDs.
3. Server computes quantity and total.
4. If total exceeds budget, the backend either:
   - Attempts one regeneration with stricter budget instruction, or
   - Returns `409 Conflict` with a clear message.

### 11.2 Allergy Validation

Allergy validation must use `Product.normalizedAllergens`. A product with incomplete or ambiguous allergen data must not be eligible for planning.

### 11.3 Appliance Validation

The backend must reject recipes that require an appliance absent from the request. If no appliance is selected, only no-cook recipes are valid.

### 11.4 Duplicate Consolidation

Shopping list consolidation rules:

- Same `productId` must become one list item.
- Quantity must be the number of packages needed.
- `totalPricePence = unitPricePence * quantity`.
- Category should use the first available category path segment or `Other`.

## 12. Frontend UX

### 12.1 Pages

The MVP can be a single-page app with two primary states:

1. Constraint form.
2. Generated plan results.

### 12.2 Constraint Form

Fields:

- Weekly budget.
- Household size.
- Meal types.
- Meal preferences.
- Cuisine preferences.
- Appliances.
- Allergies.
- Disliked ingredients.

Validation:

- Inline validation before submit.
- Disable submit while generating.
- Show clear error state if catalogue is unavailable or AI generation fails.

### 12.3 Results View

Display:

- Budget vs estimated total.
- Warnings and assumptions.
- 7-day plan grouped by day.
- Recipe cards with time, appliances, ingredients, and steps.
- Consolidated shopping list grouped by category.
- Product links to Aldi pages.
- Regenerate action using the same constraints.
- Edit constraints action.

### 12.4 Frontend States

The UI must include:

- Initial form state.
- Loading state with skeleton sections.
- Empty state when no plan has been generated.
- Error state with retry guidance.
- Success state.

### 12.5 Accessibility

- All form controls must have labels.
- Keyboard navigation must work across controls.
- Buttons must expose clear text labels.
- Error messages must be associated with fields where possible.
- Color must not be the only indicator of validation or warnings.

## 13. Security And Safety

### 13.1 Secrets

- Store NVIDIA and MongoDB secrets in environment variables.
- Never expose secrets to the frontend.
- Never log full environment values.

### 13.2 Rate Limiting

`POST /api/meal-plans/generate` is an AI route and must be rate limited server-side.

Default:

- Window: 60 seconds.
- Max: 10 requests per IP.
- Response: `429 Too Many Requests`.

### 13.3 Input Limits

- Use `express.json({ limit: "100kb" })`.
- Trim and length-limit user text fields.
- Reject unexpected object shapes.

### 13.4 CORS

- Allow only configured `CLIENT_ORIGIN` in non-development environments.
- Do not use unrestricted CORS in production.

## 14. Catalogue Pipeline

### 14.1 Crawler Completion

The existing Aldi crawler should be kept and extended.

Required improvements:

- Add more manually confirmed Aldi food category URLs.
- Keep category URLs in `aldiCategories.ts`.
- Persist crawl summaries to logs or a future `crawl_runs` collection if operational visibility is needed.
- Mark products not seen in the latest crawl as unavailable only after a successful category crawl.
- Add unit tests for pure helpers:
  - `parsePricePence`.
  - `extractProductId`.
  - allergen normalization.
  - catalogue safety evaluation.

### 14.2 Catalogue Freshness

Meal planning should check catalogue freshness:

- If no eligible products exist, return `503`.
- If catalogue is stale, return a warning or block generation depending on configured strictness.
- Default stale threshold: 72 hours.

### 14.3 Store Assumption

MVP planning uses one configured Aldi store. The UI may display the current store label, but users do not select arbitrary stores in MVP.

## 15. Development Workflow

### 15.1 Scripts

Add or update root scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "tsx watch server/server.ts",
    "dev:client": "vite --host 0.0.0.0",
    "build": "npm run build:client && npm run typecheck",
    "build:client": "vite build",
    "start": "node dist/server/server.js",
    "typecheck": "tsc --noEmit",
    "test": "npm run typecheck",
    "aldi:crawl": "tsx server/catalogue/aldi/runAldiCrawl.ts"
  }
}
```

If the project uses separate root and client package manifests, mirror these scripts appropriately and document the chosen workflow.

### 15.2 Build Output

If compiling the backend for production, update `tsconfig.json` to support emit or create a separate `tsconfig.build.json`. The current `noEmit: true` configuration is sufficient for typechecking only.

## 16. Implementation Phases

### Phase 1: Backend Foundation

Deliverables:

- Convert empty app/server entrypoints into TypeScript.
- Load and validate environment.
- Connect to MongoDB.
- Register JSON parsing, CORS, health route, API routes, and error middleware.
- Add typed API error helper.

Acceptance criteria:

- `GET /api/health` returns `ok: true`.
- Server starts locally with valid environment.
- Missing required environment variables fail fast with safe messages.
- Typecheck passes.

### Phase 2: Catalogue Readiness

Deliverables:

- Expand Aldi categories.
- Add catalogue status endpoint.
- Add tests for crawler helper functions.
- Add freshness calculation.
- Add clear documentation for running `npm run aldi:crawl`.

Acceptance criteria:

- Catalogue status endpoint reports available and eligible product counts.
- Product selection uses only eligible, verified, available products.
- Empty catalogue returns a controlled API error.

### Phase 3: Meal Planning Core

Deliverables:

- Request schema and validation.
- Product selector.
- Context builder.
- NVIDIA client.
- AI prompt builder.
- AI response parser.
- Meal plan validator.
- Shopping list consolidator.

Acceptance criteria:

- Invalid requests return `400`.
- Allergy conflicts are excluded before AI context construction.
- AI context is capped and compact.
- AI output using unknown product IDs is rejected.
- Shopping list totals are recomputed server-side.

### Phase 4: Frontend MVP

Deliverables:

- Vite React TypeScript frontend.
- Tailwind CSS setup.
- Constraint form.
- API integration.
- Loading, empty, error, and success states.
- Results display.

Acceptance criteria:

- User can submit valid constraints.
- User receives readable generated plan results.
- User can retry or edit constraints after errors.
- Layout works on mobile and desktop.

### Phase 5: Verification And Hardening

Deliverables:

- Backend unit tests.
- Frontend component or integration tests.
- Manual end-to-end test checklist.
- Production environment documentation.
- Rate limiting on AI route.

Acceptance criteria:

- Typecheck passes.
- Relevant tests pass.
- Manual flow works against a seeded or crawled catalogue.
- API failures produce controlled UI errors.

## 17. Testing Strategy

### 17.1 Backend Unit Tests

Test:

- Request validation.
- Price parsing.
- Product ID extraction.
- Allergen normalization.
- Product selector filtering.
- Context builder caps and field projection.
- Meal plan validator rejection cases.
- Shopping list consolidation.

### 17.2 Backend Integration Tests

Test:

- Health endpoint.
- Catalogue status endpoint.
- Meal plan endpoint with mocked NVIDIA response.
- AI timeout handling.
- Empty catalogue handling.
- Over-budget generation handling.

### 17.3 Frontend Tests

Test:

- Form validation.
- Submit button disabled during loading.
- Error rendering.
- Results rendering.
- Shopping list grouping.

### 17.4 Manual E2E Checklist

1. Start MongoDB with catalogue data.
2. Start API.
3. Start frontend.
4. Open app.
5. Submit a realistic budget and household profile.
6. Confirm response returns under 30 seconds.
7. Confirm total is within budget.
8. Confirm allergens are absent from products used.
9. Confirm shopping list product links open Aldi pages.
10. Confirm refresh/edit/retry flows work.

## 18. Failure Behavior

### 18.1 Budget Too Low

Return `409 Conflict` with:

- Minimum viable budget estimate if calculable.
- Suggestion to reduce meal count, increase budget, or simplify preferences.

### 18.2 Allergy Removes All Products

Return `409 Conflict` with:

- List of constraints causing exclusion.
- Explanation that unsafe or ambiguous products cannot be used.

### 18.3 Catalogue Missing Or Stale

Return `503 Service Unavailable` with:

- Catalogue status.
- Instruction to run the Aldi crawl.

### 18.4 NVIDIA Timeout

Return `504 Gateway Timeout` with retry guidance.

### 18.5 Invalid AI JSON

Attempt one retry. If retry fails, return `422 Unprocessable Entity`.

## 19. Observability

Log:

- Request ID.
- Route.
- Response status.
- Duration.
- Product count considered.
- AI latency.
- Validation failure code.

Do not log:

- API keys.
- Full prompts.
- Full user request bodies.
- Full AI responses unless explicitly in local debug mode and secrets are excluded.

## 20. Deployment Requirements

### 20.1 Backend

- Environment variables configured in deployment platform.
- MongoDB network access configured.
- Node runtime supports the selected TypeScript build output.
- Health endpoint available.

### 20.2 Frontend

- Static Vite build deployed to chosen host.
- API base URL configured through environment.
- CORS configured to allow deployed frontend origin.

### 20.3 Pre-Deploy Verification

Run:

```bash
npm run typecheck
npm test
npm run build
```

If tests are split between server and client, run all relevant commands and document any skipped command with the reason.

## 21. Open Product Decisions

These decisions can be made during implementation without blocking the MVP if defaults are accepted:

- Whether snacks are enabled by default. Recommended default: disabled.
- Whether breakfast is required daily. Recommended default: user selectable.
- Whether the app blocks stale catalogues or warns. Recommended default: block when no eligible products exist, warn when stale but usable.
- Whether generated plans are persisted. Recommended MVP default: do not persist.
- Whether cuisine preferences are free text or fixed chips. Recommended default: fixed chips plus optional free-text "other".

## 22. Definition Of Done

The full implementation is complete when:

- Aldi catalogue data can be crawled and stored.
- API health and catalogue status endpoints work.
- Meal plan generation accepts validated constraints.
- Product context sent to AI is filtered, compact, and allergy-safe.
- AI output is validated before returning to the client.
- Shopping list totals are computed by the server.
- React frontend supports the complete generate-plan workflow.
- Loading, empty, error, and success UI states are present.
- AI route is rate limited.
- Typecheck and relevant tests pass.
- Manual end-to-end generation succeeds against real or seeded Aldi catalogue data.
