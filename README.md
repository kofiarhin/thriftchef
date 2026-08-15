# ThriftChef

Weekly budget meal planning for Aldi UK shoppers. Enter a budget, household
size and dietary constraints; get a seven-day plan, recipes, and one
consolidated Aldi shopping list priced from real catalogue data.

## How it works

```
Aldi crawl  ->  MongoDB catalogue  ->  product selector  ->  AI context
                                            |                    |
                                            v                    v
                                     safety + allergy      NVIDIA generator
                                       filtering
                                            |                    |
                                            +--------> validator + pricing
                                                              |
                                                              v
                                                     7-day plan + basket
```

The generator proposes recipes and product IDs. It never decides prices.
The server validates every plan against the approved product set and computes
the basket total itself, so a model cannot invent a product or a price.

## Requirements

- Node.js 22 or newer
- MongoDB (local or hosted)
- Playwright browsers for crawling (`npx playwright install chromium`)
- An NVIDIA API key for meal generation

## Setup

```bash
npm install
cp .env.example .env      # then fill in MongoDB and NVIDIA values
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
```

## NVIDIA generation

All user-facing meal generation uses NVIDIA. Supply these credentials:

```bash
NVIDIA_API_KEY=...
NVIDIA_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_MODEL=nvidia/llama-3.3-nemotron-super-49b-v1.5
```

Missing credentials fail at startup with a message naming the variables —
never their values. The deterministic mock planner is test-only and is never a
runtime fallback.

Live output goes through exactly the same validator as the mock planner. If a
plan is invalid or over budget the server regenerates once, then returns a
controlled error rather than a bad plan.

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
| 400 | `INVALID_MEAL_PLAN_REQUEST` | Bad constraints; `details` lists the fields |
| 409 | `CATALOGUE_CONSTRAINT_CONFLICT` | Budget or filters cannot be satisfied |
| 422 | `AI_INVALID_RESPONSE` | Generator failed twice |
| 429 | `RATE_LIMITED` | AI route limit exceeded |
| 503 | `CATALOGUE_UNAVAILABLE` | No catalogue data; run the crawl |
| 504 | `AI_TIMEOUT` | Upstream did not respond in time |

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

- **Mock planner recipes are structural, not culinary.** It fills templates
  with the cheapest product in each food group, so combinations can be odd
  (the shape, pricing and shopping list are correct). It exists to make the
  pipeline testable without AI; use `nvidia` mode for realistic recipes.
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
  mealPlanning/            Selection, context, prompt, AI client, validator
  models/Product.ts        Catalogue schema
client/src/
  api/                     HTTP client; types imported from the server
  components/              Form, results, recipes, shopping list, status
scripts/                   Operational helpers
```

The client imports its request and response types directly from
`server/mealPlanning/mealPlanTypes.ts`. They are type-only imports, erased at
build time, so a contract change breaks the typecheck instead of a user's plan.
