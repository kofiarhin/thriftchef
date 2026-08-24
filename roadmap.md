# ThriftChef Roadmap

## Current goal

Finish the Tesco development integration as a trustworthy, reviewable candidate without changing Aldi-only production behaviour.

## Current finish line

The Tesco branch is ready for human merge consideration only when:

- final automated checks are recorded at the current branch checkpoint;
- the complete Aldi and Tesco planning flows are manually verified;
- persisted Tesco records are inspected for identity, scope, pricing, availability, category, and URL integrity;
- 403 and product-detail failures are reported clearly without bypassing access controls;
- bounded crawl coverage is increased gradually with reconciliation still disabled;
- `productOffers` is backfilled and compared before any read-source proposal;
- the complete branch diff is reviewed against the product and retailer-isolation contracts;
- remaining risks and production activation gates are documented.

## Ordered outcomes

1. ~~Record `npm run typecheck`, `npm run test:client`, and `npm run build` at checkpoint `35f095b` or its verified successor.~~ Done: all three recorded as `Passed` at `18e4231` (documentation-only successor of `35f095b`). See `context/current-state.md`.
2. Verify a fresh visit, Aldi generation, Tesco generation, regeneration, new-plan reset, recipe copy, and shopping-list copy in the real browser flow.
3. Inspect all currently persisted Tesco records and record anomalies without modifying production data.
4. Improve actionable 403/detail-request reporting while preserving fail-closed behaviour.
5. Increase bounded public-crawl coverage in controlled increments and record extraction quality.
6. Backfill and compare store-scoped offers before proposing a switch from legacy reads.
7. Review the full Tesco branch diff and prepare a human merge decision.

Each outcome is a separate ticket unless a later approved plan demonstrates that two items form one inseparable vertical slice.

## Explicit exclusions

- No production activation of Tesco.
- No merge or production deployment.
- No change from `CATALOGUE_READ_SOURCE=legacy`.
- No reconciliation of missing Tesco products while coverage is bounded or unreliable.
- No bypass of Tesco access restrictions, security challenges, sign-in, or postcode requirements.
- No speculative retailers, authentication, payments, admin dashboard, or unrelated refactor.
- No invented customer research or success claims.

## Production guardrail

Production remains Aldi-only on commit `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d`. The Tesco branch and this roadmap do not authorize a merge, deployment, retailer activation, data migration, or configuration change.

## Next recommended ticket

Verify the complete browser flow at checkpoint `18e4231`: a fresh visit starting at retailer selection, Aldi generation, Tesco generation, regeneration retaining the retailer, Start new plan resetting to retailer selection, and recipe and shopping-list copy naming the correct retailer. Check desktop and mobile widths plus console and network errors. This is Ordered Outcome 2; Outcome 1 is recorded.

