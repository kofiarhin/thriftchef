# ThriftChef

A free, anonymous, retailer-aware weekly cooking assistant for UK households.
Select a supported supermarket and store, choose the days you intend to cook,
and get a practical plan, coherent recipes, and one consolidated whole-package
shopping list priced from that store's catalogue.

[Try ThriftChef](https://thriftchef.vercel.app)

Aldi UK is currently the only active retailer. The catalogue and planning
foundation supports additional retailers, but each one remains unavailable
until its adapter and real catalogue have been independently verified.

## Current product experience

- Select an active retailer and store.
- Set household size, budget, cooking days, meal types, time limits, preferences,
  allergies, dislikes, appliances, owned ingredients, and an optional weekly mood.
- Generate meals only for the selected days.
- Regenerate the whole plan or replace one meal while preserving the rest.
- Open recipe details and use one consolidated shopping checklist.
- Reopen an anonymously saved plan on the same device during its retention window.

Core planning is free and has no user-facing generation quota. No account is
required. Household preferences and shopping checklist state are stored locally;
generated plans are stored anonymously with time-limited retention.

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

## Catalogue ownership and migration

Products belong to a **retailer** and a **store**. Every catalogue query is
scoped by both, so a plan cannot contain products from two supermarkets.

Set the records up once:

```bash
npm run catalogue:bootstrap      # creates the retailer + store records
npm run catalogue:backfill       # gives every product a store-scoped offer
npm run catalogue:backfill -- --compare   # proves both read paths agree
```

Then move `CATALOGUE_READ_SOURCE=offers` in `.env`. Every step is additive,
idempotent and restartable; no legacy field is dropped, so rolling back is a
configuration change:

```bash
# back to reading legacy product fields
CATALOGUE_READ_SOURCE=legacy
npm run catalogue:backfill -- --rollback   # optional: remove the offers too
```

### Availability reconciliation

Retiring products that have left the shelf is the only destructive write in the
catalogue, and it is refused unless the crawl that triggered it can show it saw
the whole shop: a `full` run, a trusted completion, a verified store selection,
every category finished, and a failure rate under 10%. A bounded, failed,
cancelled or interrupted crawl **never** reconciles.

If a sweep goes wrong it is reversible by run id, without a database restore:

```bash
npm run catalogue:undo-reconciliation <crawlRunId>
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

## Tesco (development integration)

Tesco is implemented but **not active**. Its retailer record is seeded as
`development`, so it is not selectable, no plan can be built from it, and no
customer can reach it. Everything below is a development and validation
operation, not a deployment step.

```bash
# One curated category, five products, a visible browser, and no database
# writes at all. This is the only Tesco command that is safe to run casually.
npm run tesco:diagnostic

# A bounded persistent crawl of public pages. Visits every curated category,
# reads at most 20 products from each, and upserts them under Tesco.
npm run tesco:public-crawl
```

Before the first public crawl:

1. Run `npm run catalogue:bootstrap`. This records Tesco as a national public
   catalogue while keeping it in `development` status.
2. Confirm `MONGODB_URI` points to the intended non-production database. The
   command prints the redacted target before connecting.
3. Keep `TESCO_MAX_PRODUCTS_PER_CATEGORY=20` while validating the integration.

The public crawl does not sign in, set a postcode, claim store-specific
availability, reconcile missing products, clear collections, or touch Aldi
records. Numeric Tesco product ids make repeated runs idempotent upserts.

The older `tesco:crawl` command remains store-scoped and fail-closed. It cannot
write without a verified fulfilment session.

Configuration lives in `.env` (see `.env.example`): `TESCO_STORE_ID`,
`TESCO_POSTCODE`, `TESCO_EXPECTED_LOCATION_TEXT`, `TESCO_FULFILMENT_MODE`,
`TESCO_HEADLESS`, `TESCO_MAX_PRODUCTS_PER_CATEGORY`. The run script prefers the
seeded catalogue record and treats the environment as an override. The public
crawl does not use the configured postcode.

### What Tesco extraction guarantees

- **Identity is the numeric Tesco product id** from
  `/shop/en-GB/products/<id>`, never the product name. A tile id that
  disagrees with its link id is rejected rather than repaired.
- **The normal shelf price is the only basket price.** A Clubcard, multibuy or
  coupon price is a price for a different shopper; a product with no
  unambiguous shelf price is rejected rather than priced optimistically.
- **Prices are integer pence**, parsed as strings. `8.29 * 100` is
  `828.999…` in binary floating point.
- **Availability is evidence, not an assumption.** It travels from the tile
  through normalisation into both the legacy product and the store offer.
- **Navigation is restricted to exactly `www.tesco.com`.** Images may come
  from Tesco's content host, which is validated by a separate rule and never
  navigated to.
- **An empty page that claims products is a failure**, not an empty shop.
  Selector drift raises `TESCO_SELECTOR_DRIFT` and the run cannot retire
  anything.

### Fixtures are evidence, and these ones are not captures

`server/testing/fixtures/tesco/*.html` were **authored** from the discovery
evidence recorded in `spec/thriftchef-tesco-store-integration-spec.md`, not
sanitised from a live Tesco session — no such session has been established.
They pin the parsing rules, not Tesco's current markup. Before any persistent
crawl, capture and sanitise real listing and detail pages, replace these, and
re-run the suite. The curated browse paths in `tescoCategories.ts` need the
same confirmation.

### Activating Tesco

Activation is a change of one line — the `status` in
`scripts/bootstrap-retailers.ts` — plus a re-run of `npm run catalogue:bootstrap`.
It is deliberately that visible. The gates that must be met first, including
authorisation for the data source itself, are in section 22 of the
specification. `CATALOGUE_READ_SOURCE` stays `legacy` throughout.

## Run it

```bash
npm run dev          # API on :5000 and the web app on :5173
npm run dev:server   # API only
npm run dev:client   # web app only
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend,
so no CORS configuration is needed locally.

## Current delivery status

The retailer-aware MVP is implemented and deployed:

- The client is live at https://thriftchef.vercel.app.
- The Express API is deployed to Heroku.
- Aldi UK is the only active retailer; other retailer records remain disabled.
- Planning, regeneration, single-meal replacement, anonymous plan reopening,
  recipe routes, and shopping-list persistence are available.
- Production uses the deterministic planner and real stored Aldi catalogue data.
- The deployed application has been verified at mobile and desktop sizes.
- `CATALOGUE_READ_SOURCE=legacy` remains the production read path because the
  store-scoped offer collection still needs a real-data backfill and equivalence
  comparison before activation.
- Catalogue crawls must be run separately from a trusted machine and are never
  part of deployment.

For the authoritative product direction, see
[`docs/ThriftChef-PRD-v0.1 (1).md`](docs/ThriftChef-PRD-v0.1%20(1).md). For
the multi-retailer contract and rollout gates, see
[`spec/thriftchef-multi-retailer-product-spec.md`](spec/thriftchef-multi-retailer-product-spec.md).

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
| `GET /api/retailers?countryCode=GB` | Supermarkets, and whether each is selectable |
| `GET /api/retailers/:retailerId/stores` | Stores, always scoped to their retailer |
| `GET /api/catalogue/status?retailerId=&storeId=` | Product counts, freshness, safety breakdown |
| `GET /api/products?search=` | Catalogue search, scoped to one retailer and store |
| `POST /api/meal-plans/generate` | Generate a validated, priced plan for the selected days |
| `GET /api/meal-plans/:planId` | Reopen a saved plan from its stored snapshot |
| `POST /api/meal-plans/:planId/replace` | Replace one meal, preserving the others |
| `POST /api/meal-plans/replace` | The same, with the plan in the body (kept for shipped clients) |

Admin routes under `/api/admin` are read-only and disabled by default; see
**Deployment**.

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
| 404 | `RETAILER_NOT_FOUND` / `STORE_NOT_FOUND` | Unknown supermarket, or a store that retailer does not own |
| 404 | `PLAN_NOT_FOUND` | The plan is unknown or past its retention period |
| 409 | `RETAILER_NOT_ACTIVE` | The supermarket exists but is not selectable right now |
| 409 | `CATALOGUE_STALE` | The catalogue is past this retailer's freshness policy |
| 429 | `RATE_LIMITED` | Operational abuse throttle, not a user quota |
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

The API and the client deploy separately: a Node process for Express, a static
bundle for the Vite client. They talk over CORS, so exactly two variables tie
them together — `CLIENT_ORIGIN` on the API and `VITE_API_BASE_URL` on the client.

### Build scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Server watcher and Vite dev server together |
| `npm run build:server` | Compiles `server/` to `dist/server` (`tsconfig.server.json`) |
| `npm run build:client` | Emits the static client to `dist/client` |
| `npm run build` | Complete production build: client typecheck, then both builds |
| `npm test` | Typecheck, server tests, client tests |
| `npm run typecheck` | Server and client typechecking |
| `npm run baseline:record` | Re-records the planner regression snapshot |
| `npm run catalogue:bootstrap` | Creates retailer and store records (idempotent) |
| `npm run catalogue:backfill` | Backfills store-scoped offers; `--compare`, `--rollback` |
| `npm run catalogue:undo-reconciliation` | Reverses one reconciliation run |
| `npm run aldi:diagnostic` | Bounded, one-category, five-product crawl, no writes |
| `npm run catalogue:verify` | Rehearses the whole migration on a throwaway database |
| `npm run verify:browser` | Drives the real app in Chromium against a throwaway database |
| `npm start` | Runs the compiled server with Node (`dist/server/server.js`) |

`tsx` is a development dependency only. It runs the watcher, the benchmark and
the crawler; it is never a production runtime. Tests and testing fixtures are
excluded from the emitted server build.

### Backend (Heroku)

`Procfile` declares `web: npm start`, and `heroku-postbuild` compiles the server
before the dyno starts. `engines.node` pins Node 22.x. Use the Node.js buildpack
and `GET /api/health` as the health check.

Config variables to set:

- `NODE_ENV=production`
- `MONGODB_URI` — set through the Heroku dashboard or an interactive prompt, so
  the credential never lands in a shell history or a build log
- `CLIENT_ORIGIN` — the exact deployed client origin, no trailing slash
- any optional meal-planner tuning variables from `.env.example`

Do **not** set `PORT`; Heroku supplies it and the server reads it.

Do not run the Aldi crawler on a production dyno. Populate the catalogue from a
trusted machine against the same database.

`ADMIN_ENABLED` must stay `false`. The admin surface is read-only and is refused
outright when `NODE_ENV=production`, regardless of that variable, until an
authentication mechanism is chosen and approved.

### Frontend (Vercel)

`vercel.json` pins the static deployment: framework `vite`, install `npm ci`,
build `npm run build:client`, output `dist/client`. The Express API is **not**
deployed as a Vercel Function.

Set one production variable:

- `VITE_API_BASE_URL` — the API origin, with no trailing slash and no `/api`
  suffix. The client appends `/api/...` itself.

Leave it unset locally: the Vite dev server proxies `/api` to the local API, so
no deployment URL is ever compiled into the source.

Because CORS names exactly one origin in production, set the API's
`CLIENT_ORIGIN` to the canonical client origin once it is known, and restart the
API. It is never widened to `*`.

## Collecting a catalogue

Catalogue collection is split in two, and the split is the point.

**The shared runner** (`server/catalogue/core/catalogueRunner.ts`) owns
everything that is the same for every supermarket: the Crawlee and Playwright
lifecycle, the request queue, concurrency and retries, run identity and status,
normalisation, allergen safety, batched persistence, price history, and the
decision about whether a run earned the right to retire missing products.

**An adapter** (`server/catalogue/adapters/<retailer>/`) owns only what a
particular shop's website does: allowed hosts, cookie and consent handling,
store selection, categories, pagination and selectors.

That is what makes a second retailer an adapter plus a database row, rather
than a second copy of every bug fixed in the first one. An adapter never
touches MongoDB, retries, batching or availability.

Adapters are registered in `server/catalogue/adapters/registry.ts` and resolved
by the `adapterKey` on a retailer record.

### Proving an adapter still works

`aldiAdapter.test.ts` and `tescoAdapter.test.ts` serve saved HTML from
`server/testing/fixtures/<retailer>/` to a real Chromium page. The selectors, the
tile loop, the pager and the disclosure expansion all run exactly as they do
against the live site; only the network is absent.

This is what catches selector drift. A selector that stops matching does not
throw — it returns nothing, and a crawl "succeeds" with an empty catalogue.
One fixture (`listing-drifted.html`) is a redesigned page that no longer
matches, and the suite asserts that this surfaces as a failure.

## The planner regression baseline

`server/testing/baseline/aldiBaselineSnapshot.ts` records what the planner
currently produces for a frozen set of requests and seeds. It is the regression
oracle: a diff in that file is a change in planning behaviour, and there is no
other reading of it.

A slice that did not intend to change planning must re-record to an empty diff.
One that did must re-record and justify the diff line by line.

```bash
npm run baseline:record   # then check `git diff`
```

Wall-clock benchmark figures are recorded in
`server/testing/baseline/BENCHMARK.md` but never asserted — they vary by an
order of magnitude across machines. The candidate counts beside them *are*
deterministic and are asserted.

## Known limitations

- **Variety is bounded by the template library.** 36 curated templates cover
  breakfast, lunch, dinner and snacks, with vegetarian and no-cook options in
  every meal type. Adding templates widens the menu without touching the
  algorithm; a thin catalogue narrows it.
- **Role classification is keyword-based** over Aldi names, categories and
  descriptions. It is deliberately conservative: an unrecognised product stays
  `unknown` and is simply never used, rather than being guessed into a recipe.
- **Aldi is the only active retailer.** Tesco is implemented and registered
  but sits in `development`: no catalogue has been collected, its fixtures are
  authored rather than captured, and its data source is not authorised. The
  adapter platform, contracts and registry support more. Choosing a second retailer is a legal and technical
  decision: what was actually checked, and why it could not be concluded, is
  recorded in `docs/second-retailer-discovery-record.md`; the steps to take
  once a source is confirmed are in
  `docs/second-retailer-activation-checklist.md`.
- Plans are persisted anonymously for `PLAN_RETENTION_DAYS` (30 by default),
  keyed by a hashed device id. No accounts, no email, no cross-device sync.
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
