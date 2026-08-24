# ThriftChef Roadmap

## Current goal

Finish the Tesco development integration as a trustworthy, reviewable candidate without changing Aldi-only production behaviour.

## Current finish line

The Tesco branch is ready for human merge consideration only when:

- final automated checks are recorded at the exact merge-candidate checkpoint;
- the complete Aldi and Tesco planning flows are verified in the real browser;
- persisted Tesco records are inspected for identity, scope, pricing, availability, category, and URL integrity;
- 403 and product-detail failures are reported clearly without bypassing access controls;
- bounded crawl coverage is increased gradually with reconciliation still disabled;
- `productOffers` is backfilled and compared before any read-source proposal;
- the complete branch diff is reviewed against the product and retailer-isolation contracts;
- remaining risks and production activation gates are documented.

## Ordered outcomes

1. **Refresh exact-head automated verification.** The routed-shell implementation reported `typecheck`, 148 client tests, build, and 71/71 browser checks as passed immediately before a final comment-only `App.tsx` edit; only `typecheck:client` was rerun afterward. Run the required suite against the final merge candidate and record the exact checkpoint in `context/current-state.md`.
2. **Complete the real Aldi/Tesco browser flow.** The current browser harness verifies the routed shell and Aldi flow at mobile and desktop widths, but it does not seed or exercise Tesco. Verify Tesco selection, generation, regeneration, Start new plan, recipe navigation, and shopping-list behaviour in an approved development environment, including console and network inspection.
3. Inspect all currently persisted Tesco records and record anomalies without modifying production data.
4. Improve actionable 403/detail-request reporting while preserving fail-closed behaviour.
5. Increase bounded public-crawl coverage in controlled increments and record extraction quality.
6. Backfill and compare store/catalogue-scoped offers before proposing a switch from legacy reads.
7. Review the full Tesco branch diff and prepare a human merge decision.

Each outcome is a separate ticket unless a later approved plan demonstrates that two items form one inseparable vertical slice.

## Completed supporting work

- The development branch implements direct Aldi/Tesco retailer choice using Tesco's national public catalogue scope.
- The routed application shell is implemented at `2a7657e`: shared header/navigation/footer, route-owned `main` landmarks and headings, route navigation instead of page anchors, and providers kept above the router so plan/profile/query state survives navigation.
- The browser harness was repaired to match the current one-retailer-choice onboarding shape and extended with routed-shell assertions.

These supporting changes do not complete Outcomes 1 or 2 by themselves because verification must be tied to the exact merge candidate and Tesco is not exercised by the current automated browser fixture.

## Explicit exclusions

- No production activation of Tesco.
- No merge or production deployment as part of these tickets.
- No change from `CATALOGUE_READ_SOURCE=legacy` in production.
- No reconciliation of missing Tesco products while coverage is bounded or unreliable.
- No bypass of Tesco access restrictions, security challenges, sign-in, or postcode requirements.
- No speculative retailers, authentication, payments, admin dashboard, or unrelated refactor.
- No invented customer research or success claims.

## Production guardrail

Production remains recorded as Aldi-only on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d`. The development branch seeds Tesco as active only so the branch flow can be exercised against its national public catalogue scope. That branch state does not authorize a merge, deployment, production retailer activation, data migration, or configuration change.

## Next recommended ticket

Run the final required automated verification against the exact current merge candidate and record the checkpoint. This closes the evidence gap in Ordered Outcome 1 without changing product behaviour. After that, take Ordered Outcome 2 as a separate ticket focused specifically on the unverified Tesco browser journey.
