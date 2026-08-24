# Current State

Snapshot source: development checkpoint `2a7657e10cd3251fdcb7a6730fae6a6a138defbe` on branch `docs/thriftchef-ai-workspace`. This checkpoint adds the routed application shell on top of the previous documentation checkpoint. Catalogue figures below remain recorded handoff evidence supplied on 23 August 2026; they were not refreshed by the shell work.

## Production

- Vercel and Heroku remain recorded on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d`.
- Production remains Aldi-only.
- `CATALOGUE_READ_SOURCE=legacy` remains the production read path.
- Tesco from this development branch has not been merged, deployed, or activated in production.

## Software delivery workspace

On branch `docs/adopt-delivery-workspace`, the repository contains the project-local delivery skills `/setup-workspace`, `/ticket`, `/spec`, `/plan`, and `/implement-plan` under `.claude/skills/`. Work artifacts are separated into `tickets/`, `spec/`, and `plans/`, and `context/lessons.md` provides lightweight repository-specific long-term memory.

The historical full multi-retailer implementation plan has moved from `plan/` to `plans/` and remains historical planning context. This workspace migration changes documentation and delivery tooling only; it does not change ThriftChef runtime code, catalogue data, deployment configuration, or production behaviour.

## Implemented on the development branch

### Retailer and catalogue work

- Tesco adapter, public category routes, product selectors, category registry, failure detection, captured and authored fixtures, and tests.
- Shared bounded public crawl command: `npm run tesco:public-crawl`.
- Additive Tesco retailer/catalogue bootstrap alongside preserved Aldi data.
- Retailer-scoped persistence and planner-query boundaries.
- The branch bootstrap seeds Tesco as `active` against the national public catalogue scope so Aldi and Tesco can both be exercised in development. This is branch-only application state, not production activation.
- Direct Aldi/Tesco choice with no postcode or store-selection step for the current national-catalogue development flow.
- Retailer propagation through generation, regeneration, replacement, recipes, shopping lists, and displayed copy.
- Fresh-session behaviour for planner visits and Start new plan.

### Routed client shell

- `AppShell` is the single routed frame and owns the shared header, primary navigation, mobile disclosure, and footer.
- All seven application routes are children of one pathless layout route, so the shell remains mounted while route content changes.
- `AppShell` deliberately does not render a `main` landmark. Each route continues to own its own `main` and top-level heading so pages remain valid when rendered independently.
- `App.tsx` is now only the planner screen. The old `#planner` hash mode, landing-page marketing chrome, and planner enter/exit state are removed.
- `QueryClientProvider`, `HouseholdProfileProvider`, and `PlanProvider` remain outside the router. Query cache, reusable profile state, and the current plan therefore survive route navigation.
- `AppHeader`, `AppFooter`, `HeroSection`, and `HowItWorks` were retired after their routed responsibilities moved into the shell or became obsolete.

## Recorded catalogue evidence

- 148 product tiles observed.
- 147 valid listing products.
- 17 Tesco products persisted.
- 0 Tesco product offers persisted.
- Verified sample: `Tesco Parsnips 500G`, 74 pence, with canonical Tesco product URL.
- No availability reconciliation performed.
- Recorded anomalies: one HTTP 403 detail request, eight route-not-found rejections, and one missing-standard-price rejection.

This is historical catalogue evidence, not a fresh verification run.

## Recorded verification

### Routed-shell implementation

The implementation handoff reported the following full checks immediately before the final `App.tsx` documentation-comment edit:

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | Passed | Server and client typechecks reported green. |
| `npm run test:client` | Passed | Vitest: 10 files, 148 tests. |
| `npm run build` | Passed | Production build reported green. |
| `npm run verify:browser` | Passed | 71/71 checks at 390×844 and 1440×900; no console errors, page errors, or failed requests were reported. |

After the final comment-only `App.tsx` edit, `npm run typecheck:client` was rerun and passed. The complete four-command suite was not rerun after that edit, so the table above must not be described as an exact-head run for `2a7657e`.

The browser harness now verifies the routed shell, route navigation, landmarks, responsive navigation, and the Aldi planning flow against an in-memory MongoDB catalogue. It does **not** seed or exercise Tesco generation, so the Tesco browser journey remains unverified by that harness.

### Earlier checkpoint evidence

At `18e4231` / application code `35f095b`, the recorded checks were:

- `npm run typecheck`: passed.
- `npm run test:client`: 9 files, 128 tests passed.
- `npm run build`: passed.
- Earlier server unit evidence: 766/766 passed.
- Earlier targeted catalogue-runner evidence: 18/18 passed.

These figures describe older checkpoints and must not be cited as current-head verification.

## Remaining verification

- Run the required automated suite against the final merge candidate and record it at that exact checkpoint.
- Exercise the complete Tesco browser path in an approved development environment: selection, generation, regeneration, Start new plan, recipe route, and shopping list.
- Inspect all 17 recorded Tesco products for retailer scope, identity, price, availability, category, and canonical URL integrity.
- Continue the remaining catalogue coverage, failure-reporting, offer-backfill, and merge-readiness work in `roadmap.md`.

## Documentation boundary

The root README and historical specifications contain statements written for earlier baselines, including Aldi-only or Tesco-store-selection assumptions. Production is still Aldi-only, but this development branch now implements direct Aldi/Tesco planning against Tesco's national public catalogue scope. Current repository behaviour is described by this file, `context/decisions.md`, `context/architecture.md`, and `roadmap.md`; historical specifications should not be treated as proof of current implementation state.

## Status vocabulary

- **Proposed:** requested outcome without an approved technical contract.
- **Specified:** an approved technical specification exists.
- **Planned:** an approved implementation plan exists.
- **In progress:** implementation work has started against the approved plan.
- **Implemented:** present in branch code.
- **Verified:** supported by a named check run against the stated code checkpoint.
- **Committed/pushed:** present in Git history/remote branch.
- **Merged:** incorporated into the target branch.
- **Deployed:** running in an identified environment.

Never promote an item to a later state without evidence.
