# Architecture Context

## Intended architecture

```text
Retailer adapter -> catalogue runner -> MongoDB catalogue
                                          |
                                          v
                               retailer/store-scoped selector
                                          |
                                          v
                              deterministic planning engine
                                          |
                                          v
                           plan + recipes + shopping basket
                                          |
                                          v
                              React/Vite customer experience
```

## Implemented application

- React 19, Vite, TypeScript, and Tailwind CSS client.
- Express and TypeScript API.
- MongoDB persistence through Mongoose.
- TanStack Query for client server-state access.
- Deterministic, bounded meal-planning engine with recipe templates, culinary-role classification, validation, and catalogue pricing.
- Shared catalogue runner with retailer adapters.
- Crawlee and Playwright for retailer catalogue collection.
- Vitest client tests and Node's TypeScript test runner for server tests.

## Client routing and shell

The client uses one routed shell rather than page-specific application chrome:

```text
QueryClientProvider
  HouseholdProfileProvider
    PlanProvider
      BrowserRouter
        AppRoutes
          pathless layout -> AppShell
            /                 WelcomePage
            /setup            OnboardingPage
            /plan             PlannerPage -> App
            /week             HomePage
            /recipe/:recipeId RecipePage
            /shopping         ShoppingPage
            /profile          ProfilePage
```

- `AppShell` owns the shared banner, route navigation, responsive mobile disclosure, and content-info footer.
- `AppShell` intentionally does not render `<main>`. Each routed page owns its own `main` landmark and top-level heading, preserving standalone page rendering and preventing duplicate landmarks.
- All routes are children of one pathless layout route, so the shell stays mounted during navigation.
- `AppRoutes` is separate from `AppRouter` so tests can exercise the real route tree with a `MemoryRouter` rather than duplicating route definitions.
- `App.tsx` is the planner screen only. Route navigation replaces the retired `#planner` hash mode and landing-page section anchors.
- Query, household-profile, and plan providers stay outside the router. Their lifetimes are therefore independent of route changes, and an active plan can survive navigation between planner, week, recipe, shopping, and settings screens.

## Catalogue boundaries

Products belong to a retailer and catalogue/store scope. The shared runner normalizes adapter output before persistence. Planner queries must carry that scope through product selection, plan generation, regeneration, meal replacement, recipes, and shopping lists.

Production is recorded as Aldi-only. On `docs/thriftchef-ai-workspace`, Tesco development support uses a national public catalogue scope and the branch bootstrap seeds Tesco as active so the development UI can exercise direct Aldi/Tesco planning. This branch-only selectable state does not imply production activation. Tesco public collection excludes sign-in, postcode selection, Clubcard prices, and conditional promotions. Bounded Tesco crawls do not reconcile missing products.

## Persistence transition

Tesco products are currently recorded in the legacy `products` collection. Historical branch evidence records 17 Tesco products and 0 Tesco `productOffers`. `productOffers` has not yet been proven with real-data backfill and comparison, so `CATALOGUE_READ_SOURCE=legacy` remains authoritative. A read-source switch is a separate migration decision, not an incidental configuration edit.

## Deployment boundaries

- Client production: Vercel.
- API production: Heroku.
- Production is recorded on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d` and remains Aldi-only.
- Catalogue crawlers run separately from trusted development operations and are not deployment steps.
- The Tesco development branch and routed-shell changes have not been merged or deployed by this documentation update.

## Architectural constraints

- Do not place a generative model in the planning request path without approval.
- Do not bypass retailer controls or weaken domain/navigation restrictions.
- Do not expose production catalogue mutation routes without approved authentication and authorization.
- Do not reconcile from partial evidence.
- Do not weaken retailer/store or catalogue-scope isolation when adding adapters or product features.
- Keep route-level UI state separate from durable provider state; do not move the plan/profile/query providers inside a route boundary without an explicit state-lifetime decision.
- Keep one shared shell and one page-owned `main` landmark per route unless an approved accessibility/architecture change requires otherwise.
