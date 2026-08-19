# ThriftChef

Weekly budget meal planning for Aldi UK shoppers. Enter a budget, household
size and dietary constraints; get a seven-day plan, recipes, and one
consolidated Aldi shopping list priced from real catalogue data.

## How it works

```
Aldi crawl  ->  MongoDB catalogue  ->  product selector  ->  role classifier
                                            |                       |
                                            v                       v
                                     safety + allergy        recipe templates
                                       filtering                    |
                                            |                       v
                                            |              bounded beam search
                                            |                       |
                                            +--------> validator + pricing
                                                              |
                                                              v
                                                     7-day plan + basket
```

Planning is local, deterministic and bounded. No model sits in the request
path: no API key, no network call, no retry loop. The planner classifies every
product by culinary role, fills curated recipe templates from products that
genuinely fit those roles, builds a capped pool of complete weeks, prices each
one from catalogue records, discards anything over budget, and returns the best
of what survives.

The same catalogue, request, engine version and variation seed always produce
the same plan. "Regenerate" asks for a different week by sending a new seed.

## Requirements

- Node.js 22 or newer
- MongoDB (local or hosted)
- Playwright browsers for crawling (`npx playwright install chromium`)

No API key is required. Meal planning runs entirely on this machine.

## Setup

```bash
npm install
cp .env.example .env      # then set MONGODB_URI
npx playwright install chromium
```

## Populate the catalogue

Planning needs product data. The crawler is the only way to get it.

```bash
# Full crawl of every enabled food category. Takes a while.
npm run aldi:crawl

# Fast, bounded crawl for development:
ALDI_MAX_PRODUCTS_PER_CATEGORY=20 npm run aldi:crawl
```

By default `ALDI_HEADLESS=false` opens a visible browser. Aldi asks for a store
on first load: pick the store matching `ALDI_EXPECTED_STORE_TEXT` and the crawl
continues automatically. Products are written in batches, so an interrupted
crawl keeps whatever it finished.

Check what the crawl produced:

```bash
npm run catalogue:inspect     # product counts by food group and category
curl http://localhost:5000/api/catalogue/status
```

Categories live in `server/catalogue/aldi/aldiCategories.ts`. Only edible
grocery departments are enabled; Drinks are present but disabled because they
are part of a real basket but not of a meal plan.

## Run it

```bash
npm run dev          # API on :5000 and the web app on :5173
npm run dev:server   # API only
npm run dev:client   # web app only
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend,
so no CORS configuration is needed locally.

## Verify

```bash
npm test             # typecheck (server + client), backend tests, frontend tests
npm run typecheck
npm run test:unit    # backend only
npm run test:client  # frontend only
npm run build        # typecheck + production client build
npm run benchmark:planner   # planner latency; deliberately not part of npm test
```

`benchmark:planner` reports median, p95 and max planning time plus candidate
counts over an 80-product fixture. It sits outside `npm test` on purpose:
wall-clock thresholds vary too much between machines to gate CI on, so the
automated suites assert bounded operation counts instead.

## The planning engine

Meal plans come from `server/mealPlanning/mealPlanEngine.ts`:

1. **Select** - `productSelector.ts` removes ineligible, unpriced,
   allergen-conflicting and disliked products, then caps the rest across food
   groups so one aisle cannot take the whole selection.
2. **Classify** - `ingredientRoles.ts` assigns each product its culinary roles
   (`poultry`, `bread`, `yogurt`, and so on) from its name, description and
   category path. Anything it cannot place is `unknown`.
3. **Fill templates** - `recipeTemplates.ts` holds 36 curated templates, each
   declaring its ingredient slots by role. **A required slot is filled by a
   product carrying an accepted role, or the template is discarded.** Nothing is
   substituted across roles, and an `unknown` product can never fill a slot.
   That rule is what stops a plan pairing pasta with pate for breakfast.
4. **Search** - a deterministic beam search assembles complete weeks, bounded by
   the five configuration values below.
5. **Validate and price** - every candidate goes through `mealPlanValidator.ts`
   and `shoppingList.ts`. Prices come only from catalogue records, and weekly
   demand is consolidated before packs are rounded up, so reusing an ingredient
   costs one pack rather than one per meal. A candidate over budget cannot enter
   the scoring pool.
6. **Score and choose** - surviving weeks are scored on budget fit, ingredient
   reuse, variety, preference and cuisine match, practicality and food-group
   breadth, then ordered by a total tie-break so the winner never depends on
   input order.

The engine never loops until something scores well: it evaluates a fixed,
bounded pool and returns the best valid plan in it. Scores stay internal - they
appear in logs and diagnostics, never in a response. `foodGroupBalance` measures
breadth of shopping, not nutrition, and must not be read as dietary advice.

### Bounds

```bash
MEAL_PLAN_MAX_PRODUCTS=80         # 20-200
MEAL_PLAN_CANDIDATE_LIMIT=24      # 4-64
MEAL_PLAN_BEAM_WIDTH=32           # 8-128
MEAL_PLAN_MAX_RECIPE_VARIANTS=6   # 1-12
MEAL_PLAN_ENGINE_TIMEOUT_MS=1500  # 250-5000
```

Out-of-range values are rejected at startup. These bounds are what make the
latency guarantee hold, so a misconfiguration must not silently relax them.

### Variation seed

`variationSeed` is an optional request field: an integer from 0 to 2147483647,
defaulting to 0. It chooses between equally valid weeks. The client sends 0
first and increments it when the user regenerates. A retry after a **network**
failure re-sends the same seed, because the outcome of that request is unknown
and the user has not yet seen its plan.

### Logging

Each request logs `engineVersion`, `engineMs`, `recipesConsidered`,
`candidatesGenerated`, `candidatesValid`, `selectedScore`, `productsUsed` and
the basket total on its access log line. Counts and durations only: never a
recipe, a product name, a constraint, or a request body.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness check |
| `GET /api/catalogue/status?storeId=` | Product counts, freshness, safety breakdown |
| `POST /api/meal-plans/generate` | Generate a validated, priced seven-day plan |
| `POST /api/meal-plans/replace` | Replace one meal while preserving the other six days |

Failures share one shape and a closed set of codes, so the UI can map each to a
recovery action:

```json
{ "error": { "code": "CATALOGUE_CONSTRAINT_CONFLICT", "message": "...", "details": {} } }
```

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | `INVALID_MEAL_PLAN_REQUEST` | Bad constraints, or an invalid plan submitted for replacement; `details` lists the fields |
| 409 | `CATALOGUE_CONSTRAINT_CONFLICT` | Filters leave too little to plan from, or no recipe can be built for a requested meal type |
| 409 | `NO_AFFORDABLE_PLAN` | Valid weeks exist but all exceed the budget; `details.minimumEstimatedPence` gives the cheapest |
| 409 | `NO_REPLACEMENT_AVAILABLE` | No distinct, affordable alternative for that meal |
| 429 | `RATE_LIMITED` | Meal plan route limit exceeded |
| 500 | `PLANNER_INTERNAL_ERROR` | The planner produced a week its own validator rejected - a bug, never the user's fault |
| 503 | `CATALOGUE_UNAVAILABLE` | No catalogue data; run the crawl |
| 503 | `PLANNER_CAPACITY_EXCEEDED` | The bounded search hit its deadline; retryable |

## Allergen safety

**Aldi publishes no ingredient or allergen data on its product pages.** The
catalogue therefore cannot record allergens as fact. Allergens are *inferred*
from product names, brands and descriptions
(`server/catalogue/allergenInference.ts`), and every product carries
`catalogueSafetyStatus: "inferred"` rather than `"verified"`.

Current policy:

- Products whose inferred allergens conflict with a declared allergy are
  excluded before the generator ever sees them.
- Every plan built on inferred data carries a prominent warning, worded more
  strongly when the user declared an allergy.
- `incomplete` and `ambiguous` products are never eligible for planning.
- If Aldi ever publishes real labels, those products become `verified` with no
  code change.

Inference is a heuristic and can miss an allergen. ThriftChef must not be
presented as an allergen-safety tool.

## Deployment

- Backend: set every variable from `.env.example`, expose `PORT`, allow the
  MongoDB network path, and use `GET /api/health` as the health check. Run with
  `npm start` (`tsx server/server.ts`).
- Frontend: `npm run build:client` emits `dist/client`. Serve it statically.
  Set `CLIENT_ORIGIN` to the deployed origin — CORS is unrestricted only in
  development.
- If the frontend is served from a different origin, set `VITE_API_BASE_URL` at
  build time.

## Known limitations

- **Variety is bounded by the template library.** 36 curated templates cover
  breakfast, lunch, dinner and snacks, with vegetarian and no-cook options in
  every meal type. Adding templates widens the menu without touching the
  algorithm; a thin catalogue narrows it.
- **Role classification is keyword-based** over Aldi names, categories and
  descriptions. It is deliberately conservative: an unrecognised product stays
  `unknown` and is simply never used, rather than being guessed into a recipe.
- Single Aldi store, configured by `ALDI_STORE_ID`. Users cannot pick a store.
- Plans are generated fresh and never persisted. No accounts, no history.
- The rate limiter is in-memory, so it is per-instance. Running more than one
  API instance needs a shared store to be exact.
- Prices are the shelf prices recorded at the last crawl and exclude offers.
  Stale catalogues produce a warning, not a refusal.
- Category classification is keyword-based over Aldi's own category names and
  can mis-file an unusual product.

## Layout

```
server/
  app.ts, server.ts        Express app and entrypoint
  config/env.ts            Environment parsing and validation
  db/connect.ts            MongoDB lifecycle
  http/                    Error shape, request logging, rate limiting
  catalogue/               Aldi crawler, allergen inference, status endpoint
  mealPlanning/            Selection, roles, templates, engine, validator
    ingredientRoles.ts     Catalogue text -> culinary roles
    recipeTemplates.ts     36 curated templates + static validation
    recipeVariants.ts      Slot filling, quantity scaling, rendering
    planScorer.ts          Weighted components and tie-breaking
    mealPlanEngine.ts      Bounded beam search, budget gate, replacement
    plannerBenchmark.ts    Local latency harness
  models/Product.ts        Catalogue schema
client/src/
  api/                     HTTP client; types imported from the server
  components/              Form, results, recipes, shopping list, status
scripts/                   Operational helpers
```

The client imports its request and response types directly from
`server/mealPlanning/mealPlanTypes.ts`. They are type-only imports, erased at
build time, so a contract change breaks the typecheck instead of a user's plan.
