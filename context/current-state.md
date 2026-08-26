# Current State

Repository baseline inspected for this workspace upgrade: `main` at `ef17cd487aabf5e35411d1b0d3ccba5d07226f2a`. The `chore/upgrade-ai-workspace-v2` change is delivery-tooling and operating-documentation only. Runtime, catalogue, and verification sections below retain their own stated checkpoints and historical evidence and were not re-verified by this workspace upgrade.

## Active implementation — single-focus planner wizard

Branch: `agent/planner-single-focus-wizard`  
Runtime checkpoint: `463884f95be2dbcd0035d6e93650f5bad5b1b75d`

The weekly `/plan` route now implements the approved single-focus planning flow while `/setup` remains unchanged. The routed planner presents one focused stage at a time: Supermarket, Budget, Household, Meals, Cooking days, Cooking time, Food preferences, Diet & exclusions, Kitchen & pantry, then Review before generation.

Implemented behaviour at the runtime checkpoint:

- only the active weekly-planner step is rendered;
- Back/Continue navigation preserves the shared `ConstraintFormState`;
- the retailer picker is the first routed planner step and is embedded without a second outer card;
- switching retailer no longer remounts `App`, so previously entered answers remain intact;
- the Review step summarizes the accumulated request and is the normal location of the final Generate action;
- server field errors can return the wizard to the step that owns the invalid field;
- retailer/store API-field names map back to the client form state;
- the old developer-oriented catalogue status panel is not shown in the focused customer wizard;
- must-have product search wording is retailer-neutral rather than Aldi-specific;
- the existing `MealPlanRequest`, planner mutation, regeneration, replacement, profile persistence, router/provider boundaries, and backend behaviour are unchanged.

Focused regression coverage was added in `client/src/components/ConstraintForm.focused.test.tsx`, and retailer-selection coverage was extended to assert that a retailer switch after navigating backward preserves an edited budget.

### Verification for this implementation

| Check | Result | Evidence |
| --- | --- | --- |
| Vercel Git preview install | Passed | `npm ci` installed 555 packages with 0 vulnerabilities for runtime checkpoint `463884f`. |
| Vercel client production build | Passed | Vite 8.2.1 transformed 111 modules and completed `npm run build:client` successfully for `463884f`. |
| `npm run typecheck` | Not run | The available execution container could not resolve GitHub/Vercel hosts, so an executable repository checkout was unavailable. Vercel's configured build does not run TypeScript `--noEmit`. |
| `npm run test:client` | Not run | Same executor limitation; no claim is made from authored tests alone. |
| `npm run build` | Not run | Vercel ran `build:client`, not the repository's full `npm run build` chain. |
| `npm run verify:browser` | Not run | The preview is reachable through Vercel's fetch connector, but no interactive browser executor is available in this environment. |

The branch is therefore **implemented and preview-build verified only**. It is not yet fully verified against the repository's required client tests, typecheck, full build, or desktop/mobile browser flow. It has not been merged or production-deployed.

## Production

- Vercel and Heroku remain recorded on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d` in the historical handoff material below; later deployment records must be checked independently before using this line as current production evidence.
- Production remains recorded as Aldi-only in the project documentation.
- `CATALOGUE_READ_SOURCE=legacy` remains the recorded production read path.
- Tesco development state does not by itself authorize production activation.

## Software delivery workspace

Branch `chore/upgrade-ai-workspace-v2` upgrades the project-local AI delivery workspace to the ticket-queue and `/deliver-ticket` model from `kofiarhin/ai-dev-workspace` source commit `89c33c09702d7032381bbaa2724e07f576e51d16`.

The repository-local `.claude/skills/` set now contains eight skills:

- `/setup-workspace`
- `/morning-brief`
- `/reset-workspace`
- `/ticket`
- `/spec`
- `/plan`
- `/implement-plan`
- `/deliver-ticket`

The default operating loop is now `/morning-brief` → create/reuse one evidence-backed queued ticket → `/deliver-ticket` → spec → TDD plan → consolidated execution approval → RED/GREEN/REFACTOR/VERIFY → final verification/review → project truth and ticket delivery evidence → `status: delivered`.

`/morning-brief` may create at most one new ticket when no equivalent active ticket exists and no material decision blocks safe scoping. `/deliver-ticket` supports no-argument latest eligible ticket selection, explicit ticket path, unique number/basename, and freeform task input. Runtime/application edits remain gated by explicit approval of the consolidated execution contract. The manual `/ticket` → `/spec` → `/plan` → `/implement-plan` path remains available.

New tickets use lifecycle metadata with canonical states `ready`, `awaiting-approval`, `in-progress`, `verifying`, `delivered`, `blocked`, `failed-verification`, and `superseded`. Historical delivered tickets are not silently reopened, and repository/verification evidence remains authoritative when lifecycle metadata conflicts with current reality. `delivered` does not imply committed, pushed, merged, deployed, or released.

The existing `tickets/001-single-focus-planner-wizard.md` remains a legacy ticket without forced lifecycle normalization as part of this workspace upgrade. Its state must be classified against current repository evidence if selected by `/deliver-ticket`.

`.claude/workspace-manifest.json` remains unchanged and continues to exclude `.claude/skills/` from reset ownership. This workspace upgrade changes delivery tooling and operating documentation only; it does not change ThriftChef runtime code, catalogue data, dependency/lockfile state, deployment configuration, or production behaviour.

The historical full multi-retailer implementation plan moved from `plan/` to `plans/` and remains historical planning context.

## Implemented on the multi-retailer development lineage

### Retailer and catalogue work

- Tesco adapter, public category routes, product selectors, category registry, failure detection, captured and authored fixtures, and tests.
- Shared bounded public crawl command: `npm run tesco:public-crawl`.
- Additive Tesco retailer/catalogue bootstrap alongside preserved Aldi data.
- Retailer-scoped persistence and planner-query boundaries.
- The development bootstrap seeds Tesco as `active` against the national public catalogue scope so Aldi and Tesco can both be exercised in development. This development state is not production activation.
- Direct Aldi/Tesco choice with no postcode or store-selection step for the current national-catalogue development flow.
- Retailer propagation through generation, regeneration, replacement, recipes, shopping lists, and displayed copy.
- Fresh-session behaviour for planner visits and Start new plan.

### Routed client shell

- `AppShell` is the single routed frame and owns the shared header, primary navigation, mobile disclosure, and footer.
- All seven application routes are children of one pathless layout route, so the shell remains mounted while route content changes.
- `AppShell` deliberately does not render a `main` landmark. Each route continues to own its own `main` and top-level heading so pages remain valid when rendered independently.
- `App.tsx` is the planner screen. The old `#planner` hash mode, landing-page marketing chrome, and planner enter/exit state are removed.
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

The routed-shell implementation handoff reported the following full checks immediately before its final `App.tsx` documentation-comment edit:

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | Passed | Server and client typechecks reported green. |
| `npm run test:client` | Passed | Vitest: 10 files, 148 tests. |
| `npm run build` | Passed | Production build reported green. |
| `npm run verify:browser` | Passed | 71/71 checks at 390×844 and 1440×900; no console errors, page errors, or failed requests were reported. |

After the final comment-only `App.tsx` edit, `npm run typecheck:client` was rerun and passed. The complete four-command suite was not rerun after that edit, so this table must not be described as verification of the current single-focus-wizard branch.

The historical browser harness verified the routed shell, route navigation, landmarks, responsive navigation, and Aldi planning flow against an in-memory MongoDB catalogue. It did **not** seed or exercise the newer focused wizard implementation recorded above.

### Earlier checkpoint evidence

At `18e4231` / application code `35f095b`, the recorded checks were:

- `npm run typecheck`: passed.
- `npm run test:client`: 9 files, 128 tests passed.
- `npm run build`: passed.
- Earlier server unit evidence: 766/766 passed.
- Earlier targeted catalogue-runner evidence: 18/18 passed.

These figures describe older checkpoints and must not be cited as current-head verification.

## Remaining verification

For the single-focus planner branch:

- run `npm run typecheck` against the exact final branch checkpoint;
- run `npm run test:client` against that checkpoint;
- run the repository's full `npm run build` chain;
- run `npm run verify:browser` and inspect `/plan` at mobile and desktop widths, including focus movement, validation, Back/Continue value preservation, Review, generation, and server-field-error recovery.

For the wider Tesco work:

- exercise the complete Tesco browser path in an approved development environment: selection, generation, regeneration, Start new plan, recipe route, and shopping list;
- inspect the recorded Tesco products for retailer scope, identity, price, availability, category, and canonical URL integrity;
- continue the remaining catalogue coverage, failure-reporting, offer-backfill, and merge-readiness work in `roadmap.md`.

## Documentation boundary

The root README and historical specifications contain statements written for earlier baselines, including Aldi-only or Tesco-store-selection assumptions. Production is still recorded separately from development behaviour. Current repository behaviour should be established from live repository/deployment evidence first, then reconciled into this file, `context/decisions.md`, `context/architecture.md`, and `roadmap.md` when appropriate; historical specifications are not proof of current implementation state.

## Status vocabulary

- **Proposed:** requested outcome without an approved technical contract.
- **Specified:** an approved technical specification exists.
- **Planned:** an approved implementation plan exists.
- **Awaiting approval:** the current execution contract is ready for explicit approval.
- **In progress:** implementation work has started against the approved plan.
- **Implemented:** present in branch code.
- **Verifying:** implementation is complete enough for final required verification/review.
- **Verified:** supported by a named check run against the stated code checkpoint.
- **Delivered:** the ticket's acceptance criteria, required verification/review, project-truth synchronization, and delivery evidence are complete.
- **Committed/pushed:** present in Git history/remote branch.
- **Merged:** incorporated into the target branch.
- **Deployed:** running in an identified environment.
- **Released:** deliberately made available to the intended users/production audience.

Never promote an item to a later state without evidence.
