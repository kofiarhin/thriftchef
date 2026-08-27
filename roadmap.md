# ThriftChef Roadmap

## Current goal

Finish the multi-retailer/Tesco development work as a trustworthy, reviewable candidate while preserving explicit production activation gates and Aldi production safety.

## Immediate priority

Refresh verification against the exact current `main` checkpoint before using historical test/build/browser evidence as proof of the merged single-focus planner or the wider current codebase.

PR #7 is merged, so the planner outcome is no longer an unmerged implementation task. Its remaining gap is verification: the PR recorded a passing Vercel client build but `npm run typecheck`, `npm run test:client`, the full `npm run build`, and browser verification were explicitly not run before merge.

## Current finish line

The Tesco/multi-retailer work is ready for a human production/merge/release decision only when the relevant candidate checkpoint has current evidence for:

- required automated checks;
- complete Aldi and Tesco planning flows in a real browser at mobile and desktop widths;
- persisted Tesco identity, retailer/store scope, pricing, availability, category, and canonical URL integrity;
- actionable reporting for 403/detail failures without bypassing retailer controls;
- bounded crawl coverage increased cautiously with destructive reconciliation disabled until evidence is trustworthy;
- `productOffers` backfill/comparison before any read-source proposal;
- complete diff/release review against retailer-isolation, product, security, and data-safety contracts;
- explicit production activation, migration, and rollback decisions.

## Ordered outcomes

1. **Refresh exact-head verification.** Run `npm run typecheck`, `npm run test:unit`, `npm run test:client`, `npm run build`, and `npm run verify:browser` against the exact candidate checkpoint. Record results as Passed, Failed, or Not run with the commit SHA.
2. **Verify the merged single-focus `/plan` experience.** Exercise step progression, focus movement, validation, Back/Continue preservation, Review, generation, and server-field-error recovery at mobile and desktop widths. If the required evidence is satisfied, normalize the legacy ticket `tickets/001-single-focus-planner-wizard.md` under the lifecycle contract and record delivery evidence without inventing history.
3. **Complete the real Aldi/Tesco browser flow.** Verify retailer selection, generation, regeneration, Start new plan, recipe navigation, shopping-list behaviour, console state, and network state in an approved development environment.
4. **Inspect persisted Tesco records.** Record anomalies for retailer/catalogue scope, identity, price, availability, category, and canonical URL without mutating production data.
5. **Improve actionable Tesco failure reporting.** Preserve fail-closed behaviour and retailer access boundaries.
6. **Increase bounded public-crawl coverage.** Expand in controlled increments and record extraction quality; keep destructive reconciliation disabled while coverage/evidence is incomplete.
7. **Backfill and compare store/catalogue-scoped offers.** Do not change `CATALOGUE_READ_SOURCE` until real-data comparison supports a separate approved migration decision.
8. **Prepare the human production/release decision.** Review the exact candidate diff, verification, data evidence, unresolved risks, activation gates, and rollback plan.

Each product/engineering outcome should remain one reviewable ticket unless an approved plan establishes that two items form one inseparable vertical slice.

## Delivery workflow

Use `tickets/` as the durable queue:

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

The manual `/ticket` → `/spec` → `/plan` → `/implement-plan` chain remains available.

A morning brief, ticket, spec, plan, authored test, commit, push, or pull request does not by itself prove implementation verification or delivery.

`delivered` does not mean committed, pushed, merged, deployed, or released.

## Completed supporting work

- The single-focus planner implementation is merged through PR #7. Its current gap is exact-checkpoint verification, not implementation/merge status.
- The eight-skill AI delivery workspace is merged through PR #10 at `46cbb0e364dacd6c11d7f6b795f0cf10090ba826`.
- The routed application shell and retailer-scoped planner/catalogue foundation are present in the repository.
- Tesco development support, catalogue tooling, and documented safety gates exist; these do not imply production activation.

## Explicit exclusions

- No production activation of Tesco without a separate explicit decision.
- No production deployment as part of roadmap verification tickets unless separately authorized.
- No change from `CATALOGUE_READ_SOURCE=legacy` without a separate migration decision backed by real-data evidence.
- No reconciliation of missing Tesco products while coverage is bounded, incomplete, failed, interrupted, or untrusted.
- No bypass of retailer access restrictions, security challenges, authentication requirements, or usage restrictions.
- No speculative retailers, authentication, payments, admin expansion, or unrelated refactor.
- No invented customer research, verification, deployment, or success claims.

## Next recommended ticket

Run `/morning-brief` against the current `main` evidence. The expected highest-leverage candidate is exact-head verification of the merged application and single-focus planner before additional implementation work relies on historical checks.
