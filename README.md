# ThriftChef

A free, anonymous, retailer-aware weekly cooking assistant for UK households.
Choose a supported supermarket, set the days and constraints for the week, and get a practical meal plan, coherent recipes, and one consolidated whole-package shopping list priced from that retailer's catalogue.

[Try ThriftChef](https://thriftchef.vercel.app)

## Production and development status

**Production remains Aldi-only.** The deployed Vercel client and Heroku API are recorded on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d`, and production still reads `CATALOGUE_READ_SOURCE=legacy`.

On the development branch `docs/thriftchef-ai-workspace`, Aldi and Tesco are both selectable so the retailer-aware flow can be exercised before any production decision. Tesco uses a national public catalogue scope in this branch; there is no postcode or store-selection step for the current Tesco development flow. Branch selectability is not production activation, merge approval, deployment approval, or authorization to expand catalogue collection.

For the authoritative branch snapshot and remaining gates, read [`context/current-state.md`](context/current-state.md) and [`roadmap.md`](roadmap.md).

## Current product experience

- Start anonymously; no account or payment is required.
- Select a supported retailer. A separate store step is only required when the chosen catalogue model requires one; the current Aldi/Tesco development flow does not show an extra store picker.
- Set household size, budget, cooking days, meal types, time limits, preferences, allergies, dislikes, appliances, owned ingredients, and an optional weekly mood.
- Generate meals only for the selected days.
- Regenerate the whole plan or replace one meal while preserving the rest.
- Open recipe details and use one consolidated shopping checklist.
- Move between Plan, My week, Shopping, recipes, and Settings without losing the current in-memory plan.
- Start a new plan to clear the active plan and retailer choice while reusable household preferences may remain on the device.

Household preferences and shopping checklist state are stored locally. Generated plans have bounded anonymous server-side persistence. Core planning has no user-facing generation quota.

## Client application shell

The client is route-based. `client/src/app/AppShell.tsx` is the single shared frame for every route and owns the header, primary navigation, responsive mobile menu, and footer. It deliberately does not render `<main>`; each page owns its own `main` landmark and top-level heading.

`client/src/app/AppRouter.tsx` keeps the query client, household profile, and current plan providers outside `BrowserRouter`, so route navigation does not recreate those stores. The route tree is:

```text
/                 Welcome
/setup            Onboarding
/plan             Planner
/week             My week
/recipe/:recipeId Recipe
/shopping         Shopping
/profile          Settings
```

Unknown routes redirect to `/`. The old `#planner` mode and landing-page anchor navigation are retired.

## How planning works

```text
Retailer crawl -> MongoDB catalogue -> scoped product selector -> role classifier
                                               |                        |
                                               v                        v
                                        safety filtering         recipe templates
                                               |                        |
                                               +------> bounded search -+
                                                          |
                                                          v
                                                  validator + pricing
                                                          |
                                                          v
                                                   plan + basket
```

Planning is deterministic and bounded. No generative model sits in the request path. For the same catalogue, request, engine version, and variation seed, the engine returns the same result. Regeneration changes the variation seed while retaining the request.

The planner classifies products by culinary role, fills curated recipe templates only with compatible products, evaluates a bounded pool of candidate weeks, prices complete baskets from catalogue records, rejects over-budget candidates, validates the survivors, and chooses the best valid plan.

## Requirements

- Node.js 22 or newer
- MongoDB (local or hosted)
- Playwright Chromium for crawler and browser-verification work

```bash
npm install
cp .env.example .env      # then set MONGODB_URI and other local values
npx playwright install chromium
```

Secrets belong in `.env`. Do not commit credentials, live database URIs, cookies, or retailer session data.

## Run locally

```bash
npm run dev          # API on :5000 and Vite client on :5173
npm run dev:server   # API only
npm run dev:client   # client only
```

Open `http://localhost:5173`. Locally, Vite proxies `/api` to the API server.

## Software delivery workflow

ThriftChef vendors eight project-local AI delivery skills under `.claude/skills/`:

```text
/setup-workspace
/morning-brief
/reset-workspace
/ticket
/spec
/plan
/implement-plan
/deliver-ticket
```

The default operating loop is:

```text
/morning-brief
      ↓
create or reuse one evidence-backed ticket
      ↓
tickets/NNN-outcome.md
status: ready
      ↓
/deliver-ticket
      ↓
spec → TDD plan → consolidated execution contract
      ↓
Approve plan
      ↓
RED → GREEN → REFACTOR → VERIFY
      ↓
final verification + review
      ↓
project truth + ticket delivery evidence
      ↓
status: delivered
```

`/morning-brief` reconciles roadmap, current repository/GitHub evidence, verification debt, risks, customer signals, and the existing ticket/spec/plan queue. It may create **at most one** new evidence-backed ticket when no equivalent active ticket exists and no material decision blocks safe scoping. Otherwise it reuses an existing ticket or creates no ticket. It never implements the outcome.

`/deliver-ticket` orchestrates the full lifecycle while preserving the lower-level skill responsibilities. Supported entry forms are:

```text
/deliver-ticket
/deliver-ticket tickets/004-saved-products.md
/deliver-ticket 004
/deliver-ticket 004-saved-products
/deliver-ticket Add saved products to the catalogue
```

With no argument, it sorts numeric ticket prefixes descending and selects the highest-numbered eligible unfinished ticket. It skips `delivered`, `superseded`, and blocked tickets during automatic selection, and it revalidates interrupted or failed work before continuation. It never uses filesystem modification time as queue priority.

Before runtime/application edits, `/deliver-ticket` creates or revalidates the matching spec and TDD plan, then presents one consolidated execution contract. Runtime work begins only after explicit approval; when no stronger project phrase applies, use:

```text
Approve plan
```

Material scope, architecture, dependency, migration, authentication, payment, permission, security, deployment, destructive-behaviour, acceptance, or verification changes invalidate prior approval.

New tickets use lifecycle metadata:

```yaml
---
ticket_schema: 1
status: ready
source: manual
created: YYYY-MM-DD
---
```

Canonical states are `ready`, `awaiting-approval`, `in-progress`, `verifying`, `delivered`, `blocked`, `failed-verification`, and `superseded`. `delivered` and `superseded` are terminal historical states. A delivered ticket is not silently reopened; regressions become new tickets referencing the historical work.

`delivered` means acceptance criteria, required verification/review, project-truth synchronization, and ticket delivery evidence are complete from observed evidence. It does **not** mean committed, pushed, pull-requested, merged, deployed, or released.

For manual step-by-step control, the original lower-level chain remains available:

```text
/ticket → /spec → /plan → /implement-plan
```

Tickets define **what should change and why**. Specifications define the technical contract. Plans define implementation order and TDD slices. `/implement-plan` executes an approved plan, verifies and reviews the result, synchronizes project truth, and updates lifecycle-aware source-ticket evidence/status.

After verified implementation, update only project truth that actually changed: `context/current-state.md`, architecture when applicable, confirmed decisions, roadmap status, concise repository-specific lessons in `context/lessons.md`, and the source ticket's acceptance/delivery evidence. A morning brief, ticket, specification, or plan is never proof that code is implemented, verified, or delivered.

The older full multi-retailer implementation plan is retained as historical context at [`plans/thriftchef-full-implementation-plan.md`](plans/thriftchef-full-implementation-plan.md). New work should prefer one focused ticket/spec/plan chain per roadmap outcome.

## Catalogue ownership and migration

Products and offers are retailer-scoped and catalogue/store-scoped. A plan must never mix scopes.

Bootstrap catalogue ownership records with:

```bash
npm run catalogue:bootstrap
```

The development branch bootstrap currently seeds:

- Aldi UK as an active store-scoped retailer;
- Tesco UK as an active **development-branch** national public catalogue scope named `Tesco Public Catalogue`.

That Tesco seed exists so branch behaviour can be tested. It does not change the recorded Aldi-only production deployment.

The offer migration remains additive and reversible:

```bash
npm run catalogue:backfill
npm run catalogue:backfill -- --compare
npm run catalogue:backfill -- --rollback
```

Production remains on:

```text
CATALOGUE_READ_SOURCE=legacy
```

Do not propose `offers` as the production read source until real-data backfill and equivalence checks have been recorded and approved.

### Availability reconciliation

Retiring products that appear to have left the shelf is destructive catalogue behaviour. Reconciliation is refused unless a run has trustworthy full-coverage evidence. Bounded, failed, cancelled, interrupted, or otherwise untrusted crawls never reconcile missing products.

If an approved reconciliation run must be reversed:

```bash
npm run catalogue:undo-reconciliation <crawlRunId>
```

## Aldi catalogue

Aldi remains the only production retailer.

```bash
npm run aldi:crawl
ALDI_MAX_PRODUCTS_PER_CATEGORY=20 npm run aldi:crawl
```

Aldi crawling is store-scoped and must verify the configured store/session before trusted reconciliation. Check the resulting catalogue with:

```bash
npm run catalogue:inspect
curl http://localhost:5000/api/catalogue/status
```

Only approved meal-relevant grocery categories are enabled for planning.

## Tesco development integration

Tesco is implemented on the development branch and is selectable there against a national public catalogue scope. Production remains Aldi-only.

Useful commands:

```bash
npm run tesco:diagnostic
npm run tesco:public-crawl
```

`tesco:diagnostic` is the bounded, no-write selector/extraction check. `tesco:public-crawl` is a bounded persistent development crawl of approved public catalogue paths. Before a persistent run:

1. confirm the target branch and intended non-production database;
2. run `npm run catalogue:bootstrap` so the retailer/catalogue records exist;
3. inspect the redacted database target printed by the command;
4. keep the configured bounds conservative while extraction quality is still being evaluated;
5. do not enable reconciliation for bounded or incomplete Tesco evidence.

The public crawl does not sign in, set a shopper postcode, reuse personal browser state, submit forms, claim store-specific availability, or intentionally touch Aldi records.

### Tesco extraction rules

- **Identity:** use the numeric Tesco product ID from `/shop/en-GB/products/<id>`, never the product name. Conflicting tile and URL IDs are rejected.
- **Price:** normal shelf price is authoritative for planning. Clubcard, multibuy, coupon, and other conditional prices are excluded from basket totals.
- **Money:** parse prices into integer pence rather than relying on floating-point arithmetic.
- **Availability:** record observed evidence; do not invent availability from a successful page load.
- **Navigation:** crawler navigation is restricted to the approved Tesco host/path boundary. Image-host validation is separate from page-navigation permission.
- **Selector drift:** a page that claims products but yields no valid tiles is a failure, not an empty catalogue.
- **Reconciliation:** bounded public Tesco crawls do not retire missing products.

### Tesco evidence currently recorded

The branch documentation records historical development evidence of:

- 148 product tiles observed;
- 147 valid listing products;
- 17 Tesco products persisted;
- 0 Tesco `productOffers` persisted;
- a sample `Tesco Parsnips 500G` at 74 pence with a canonical Tesco product URL;
- one HTTP 403 detail request, eight route-not-found rejections, and one missing-standard-price rejection;
- no availability reconciliation.

These are recorded handoff figures, not a fresh database inspection. See [`context/current-state.md`](context/current-state.md) before citing them.

The Tesco fixture suite contains authored parsing fixtures plus a captured listing fixture. Fixtures test parser behaviour; they do not by themselves prove current live-site coverage or production authorization.

### Tesco activation boundary

The development seed currently marks Tesco `active` so the branch UI and scoped planner can exercise it. **Do not treat that seed value as production activation.** Production activation still requires the remaining roadmap and specification gates, an explicit merge decision, deployment/configuration approval, and current catalogue/authorization evidence. `CATALOGUE_READ_SOURCE=legacy` remains unchanged unless a separate approved migration proves otherwise.

The original store-scoped Tesco implementation specification is retained as historical design context under [`spec/thriftchef-tesco-store-integration-spec.md`](spec/thriftchef-tesco-store-integration-spec.md). Its current-state differences are called out in [`spec/README.md`](spec/README.md).

## Verification

Use the checks relevant to the ticket and report only what was actually run:

```bash
npm run typecheck
npm run test:unit
npm run test:client
npm run build
npm run verify:browser
npm run benchmark:planner
```

`npm run verify:browser` drives the built application in Chromium against `mongodb-memory-server` and a fixture catalogue, not the configured development or production database. It checks real routing, API integration, navigation, plan behaviour, console errors, page errors, and failed requests at mobile and desktop widths.

At routed-shell checkpoint `2a7657e`, the handoff reported the full typecheck, 10 client-test files / 148 tests, build, and 71/71 browser checks as passing immediately before a final comment-only `App.tsx` edit. Only `typecheck:client` was rerun after that edit. Treat those results as implementation evidence, not as an exact-head full-suite run. The current browser fixture exercises the shell and Aldi flow; it does not yet prove the Tesco browser journey.

The planner benchmark reports timing information but is intentionally not a CI-style wall-clock gate; deterministic operation bounds are tested separately.

## Planning engine

Meal plans are produced from `server/mealPlanning/`:

1. **Select** eligible, priced, retailer/catalogue-scoped products.
2. **Classify** products into conservative culinary roles.
3. **Fill templates** only when required ingredient roles can be satisfied.
4. **Search** a deterministic bounded candidate space.
5. **Validate and price** complete candidates, consolidating package demand before budget comparison.
6. **Score and choose** among valid candidates using deterministic tie-breaking.

Important bounds are configured through environment variables such as:

```bash
MEAL_PLAN_MAX_PRODUCTS=80
MEAL_PLAN_CANDIDATE_LIMIT=24
MEAL_PLAN_BEAM_WIDTH=32
MEAL_PLAN_MAX_RECIPE_VARIANTS=6
MEAL_PLAN_ENGINE_TIMEOUT_MS=1500
```

Out-of-range values are rejected at startup rather than silently relaxing the planner's bounded-search contract.

### Variation seed

`variationSeed` is an integer from 0 through 2147483647. The first request uses 0 and regeneration advances it. A retry after an unknown network outcome resends the same seed so the client does not silently request a different week.

### Logging

Planning logs may include engine version, timing, candidate counts, product counts, score, and basket total. Do not log full request bodies, allergies, dislikes, recipe details, or product names.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness check |
| `GET /api/retailers?countryCode=GB` | List retailer availability |
| `GET /api/retailers/:retailerId/stores` | List scopes/stores owned by one retailer |
| `GET /api/catalogue/status?retailerId=&storeId=` | Catalogue readiness and freshness |
| `GET /api/products?search=` | Scoped catalogue search |
| `POST /api/meal-plans/generate` | Generate a validated, priced plan |
| `GET /api/meal-plans/:planId` | Reopen a retained anonymous plan |
| `POST /api/meal-plans/:planId/replace` | Replace one meal while preserving the rest |
| `POST /api/meal-plans/replace` | Compatibility replacement route with plan in body |

Failures use the shared error envelope:

```json
{ "error": { "code": "CATALOGUE_CONSTRAINT_CONFLICT", "message": "...", "details": {} } }
```

Important failure classes include invalid requests, retailer/store not found, inactive retailer, stale/unavailable catalogue, constraint conflict, no affordable plan, no replacement, rate limiting, planner capacity, and internal planner validation failure. The UI must map failures to explicit recovery actions and must never fall back across retailers.

## Allergen safety

Catalogue allergen data may be incomplete or inferred. Products whose inferred allergens conflict with a declared allergy are excluded before planning, but inference is a heuristic and can miss information. The UI must preserve the packaging warning. ThriftChef must not be presented as an allergen-safety or medical tool.

## Deployment

The API and client deploy separately:

- Express API: Heroku
- Vite client: Vercel

Production configuration ties them together with the exact allowed client origin and client API base URL. Never widen production CORS to `*` as a convenience.

Useful scripts include:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local API + Vite client |
| `npm run build:server` | Compile the Express server |
| `npm run build:client` | Build the Vite client |
| `npm run build` | Production build |
| `npm test` | Configured test suite |
| `npm run typecheck` | Server + client typechecking |
| `npm run catalogue:bootstrap` | Seed retailer/catalogue ownership records |
| `npm run catalogue:backfill` | Backfill/compare/rollback offer records |
| `npm run aldi:diagnostic` | Bounded Aldi diagnostic |
| `npm run tesco:diagnostic` | Bounded Tesco diagnostic |
| `npm run tesco:public-crawl` | Bounded Tesco public crawl |
| `npm run catalogue:verify` | Rehearse catalogue migration behaviour |
| `npm run verify:browser` | Real-browser application verification against throwaway data |
| `npm start` | Start compiled server |

Crawler execution is an operational task, not a deployment step. Do not run catalogue crawlers as part of production web-process startup.

## Catalogue adapter boundary

`server/catalogue/core/catalogueRunner.ts` owns behaviour shared by retailers: browser lifecycle, queueing, concurrency, retries, normalization, persistence, crawl-run state, price history, coverage, and trusted reconciliation decisions.

A retailer adapter owns only retailer-specific browsing and extraction: allowed hosts, consent/session handling, catalogue scope verification when required, categories, pagination, selectors, product identity, prices, availability, and detail parsing. An adapter does not write directly to MongoDB or reimplement the runner.

Adapters are registered in `server/catalogue/adapters/registry.ts` and resolved by the retailer record's `adapterKey`.

### Proving an adapter still works

Adapter and selector tests use saved HTML with a real Chromium page so selector logic, tile parsing, pagination, and drift handling can run without depending on a live retailer site during every test. A drift fixture must fail loudly rather than allowing an empty catalogue to look healthy.

## Planner regression baseline

`server/testing/baseline/aldiBaselineSnapshot.ts` records deterministic planner outputs for frozen requests and seeds. A ticket that does not intend to change planning should leave that baseline unchanged; an intentional planning change must justify the diff.

```bash
npm run baseline:record
```

Benchmark timing is recorded separately because wall-clock performance varies by machine.

## Current delivery status

Production:

- Vercel client is deployed.
- Heroku API is deployed.
- Aldi UK is the only production retailer.
- The deterministic planner and stored Aldi catalogue are the live planning path.
- `CATALOGUE_READ_SOURCE=legacy` remains the production read source.
- Catalogue crawls run separately from deployment.

Development branch `docs/thriftchef-ai-workspace`:

- Tesco adapter and national public catalogue development flow are implemented.
- Aldi/Tesco selection is implemented on the branch.
- Routed shared application shell is implemented at `2a7657e`.
- Tesco has not been merged or deployed to production.
- Remaining verification and catalogue gates are tracked in [`roadmap.md`](roadmap.md).

For product direction see [`docs/ThriftChef-PRD-v0.1 (1).md`](docs/ThriftChef-PRD-v0.1%20(1).md). For the retailer-aware target contract see [`spec/thriftchef-multi-retailer-product-spec.md`](spec/thriftchef-multi-retailer-product-spec.md).

## Known limitations

- Recipe variety is bounded by the curated template library and available catalogue roles.
- Product-role classification is intentionally conservative and keyword-based; unknown products are excluded rather than guessed into recipes.
- Tesco development coverage is still incomplete. Historical evidence records 17 persisted Tesco products and no `productOffers`; current full-catalogue reliability is not established.
- The current automated browser fixture does not exercise Tesco end to end.
- Tesco production authorization, coverage thresholds, offer equivalence, monitoring, and rollback evidence remain open gates.
- Plans are anonymous and retained for the configured bounded period; there are no accounts or cross-device sync.
- Operational rate limiting is per configured server process unless backed by a shared store.
- Shelf-price snapshots can differ from a shopper's current store price or promotions.
- Allergen inference is not equivalent to official label data.

## Repository layout

```text
.claude/skills/           project-local setup, morning-brief, reset, ticket, spec, plan, implement-plan, and deliver-ticket skills

tickets/                  lifecycle-aware queued work items defining what and why
spec/                     technical contracts
plans/                    ordered implementation plans and historical plan context

context/                  current product, architecture, decisions, state, and lessons
customers/                real customer evidence when available
demos/                    human/browser review scripts
routines/                 proposed automation contracts

client/src/
  app/                    AppRouter, AppRoutes, AppShell, query client
  pages/                  Welcome, onboarding, planner, week, recipe, shopping, settings
  features/               profile, retailers, weekly plan, shopping state
  api/                    typed HTTP access
  components/             planner/result presentation components

server/
  app.ts, server.ts       Express app and entry point
  config/                 environment validation
  catalogue/              shared catalogue core + retailer adapters
  mealPlanning/           deterministic planner, templates, validation, pricing
  models/                 catalogue and plan persistence
  testing/                fixtures, baselines, test helpers

scripts/                  operational and verification helpers
```

The repository is the source of truth for current implementation. Historical plans and specifications remain useful context, but they must not be used to claim a feature is implemented, verified, delivered, merged, or deployed without current evidence.
