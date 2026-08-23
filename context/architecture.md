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

## Catalogue boundaries

Products belong to a retailer and catalogue/store scope. The shared runner normalizes adapter output before persistence. Planner queries must carry that scope through product selection, plan generation, regeneration, meal replacement, recipes, and shopping lists.

Aldi is the production retailer. Tesco development support uses public national-category pages and excludes sign-in, postcode selection, Clubcard prices, and conditional promotions. Bounded Tesco crawls do not reconcile missing products.

## Persistence transition

Tesco products are currently persisted in the legacy `products` collection. `productOffers` has not yet been proven with real-data backfill and comparison, so `CATALOGUE_READ_SOURCE=legacy` remains authoritative. A read-source switch is a separate migration decision, not an incidental configuration edit.

## Deployment boundaries

- Client production: Vercel.
- API production: Heroku.
- Production currently runs commit `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d` and remains Aldi-only.
- Catalogue crawlers run separately from trusted development operations and are not deployment steps.
- The Tesco branch has not been merged or deployed.

## Architectural constraints

- Do not place a generative model in the planning request path without approval.
- Do not bypass retailer controls or weaken domain/navigation restrictions.
- Do not expose production catalogue mutation routes without approved authentication and authorization.
- Do not reconcile from partial evidence.
- Do not weaken retailer/store isolation when adding adapters or product features.

