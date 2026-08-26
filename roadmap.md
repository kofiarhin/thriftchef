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

## Delivery workflow

Use `tickets/` as the durable queue between prioritization and delivery:

```text
/morning-brief
      ↓
create/reuse one evidence-backed ticket
      ↓
status: ready
      ↓
/deliver-ticket
      ↓
spec → plan → consolidated execution contract
      ↓
Approve plan
      ↓
RED → GREEN → REFACTOR → VERIFY
      ↓
final verification → review → project truth sync
      ↓
status: delivered
```

`/morning-brief` may create at most one new ticket when no equivalent active ticket exists and no material decision blocks safe scoping. `/deliver-ticket` with no argument selects the highest-numbered eligible unfinished numeric ticket; explicit path, number/basename, and freeform task inputs are also supported.

The manual `/ticket` → `/spec` → `/plan` → `/implement-plan` chain remains available for step-by-step control. A morning brief, ticket, specification, or plan does not advance an outcome to implemented, verified, or delivered. Testable implementation plans use RED → GREEN → REFACTOR → VERIFY by default, and verified work must synchronize `context/current-state.md` plus any genuinely changed architecture, decisions, roadmap status, repository-specific lessons, and lifecycle-aware source-ticket evidence.

`delivered` means the ticket's acceptance criteria, required verification, review, project-truth synchronization, and delivery evidence are complete. It does not mean committed, pushed, merged, deployed, or released.

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

Run `/morning-brief` to reconcile current evidence and create or reuse the single highest-leverage queued ticket. Based on the current roadmap, the expected first candidate is the exact-head automated verification outcome; after the ticket is ready, run `/deliver-ticket` to carry it through spec, plan, approval, implementation/verification, review, and delivery evidence.
