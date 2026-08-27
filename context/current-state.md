# Current State

Repository truth reconciled against `main` at `46cbb0e364dacd6c11d7f6b795f0cf10090ba826` on 2026-08-27.

This document separates current repository state from historical verification and production records. A merge, authored test, plan, or historical checkpoint is not treated as current verification unless the executed evidence is tied to the stated code checkpoint.

## Current main

### Single-focus weekly planner

The single-focus `/plan` wizard is now **implemented and merged** on `main` through PR #7 (`feat: add single-focus planner wizard`), merged as `d11f8847ad891b27dca1326737dd656263b2c6cf` from exact feature head `242585399bf57262ea5ad588cf0a04fc26944abd`.

Implemented behaviour includes:

- one focused planning decision at a time;
- ordered Supermarket → Budget → Household → Meals → Cooking days → Cooking time → Food preferences → Diet & exclusions → Kitchen & pantry → Review flow;
- Back/Continue value preservation;
- final Review before generation;
- retailer selection preserved without remounting the planner state;
- server field errors routed back to the owning wizard step;
- retailer-neutral must-have search wording;
- unchanged backend request shape, retailer isolation, regeneration, replacement, profile persistence, and `/setup` behaviour.

The ticket/spec/plan artifacts remain:

- `tickets/001-single-focus-planner-wizard.md`;
- `spec/001-single-focus-planner-wizard.md`;
- `plans/001-single-focus-planner-wizard.md`.

`tickets/001-single-focus-planner-wizard.md` is still a legacy ticket without lifecycle frontmatter. Current evidence classifies the work conceptually as **verifying**, not delivered: implementation is merged, but the required exact-checkpoint verification suite has not been fully observed.

### Verification debt for the merged planner

PR #7 recorded:

| Check | Result | Evidence |
| --- | --- | --- |
| Vercel client preview build | Passed | Passed on exact feature head `242585399bf57262ea5ad588cf0a04fc26944abd`. |
| `npm run typecheck` | Not run | Explicitly not run before merge. |
| `npm run test:client` | Not run | Explicitly not run before merge. |
| `npm run build` | Not run | Full repository build not run before merge. |
| `npm run verify:browser` | Not run | Browser verification not run before merge. |

The merge was explicitly approved with this verification exception. That approval allowed the merge; it does not convert missing checks into Passed results.

The current main checkpoint therefore still needs fresh exact-head verification before the planner ticket may be normalized to `delivered`.

## AI software-delivery workspace

PR #10 (`chore: upgrade AI delivery workspace`) is **merged** on `main` at `46cbb0e364dacd6c11d7f6b795f0cf10090ba826`.

The repository-local `.claude/skills/` set currently contains eight installed skills:

- `/setup-workspace`;
- `/morning-brief`;
- `/reset-workspace`;
- `/ticket`;
- `/spec`;
- `/plan`;
- `/implement-plan`;
- `/deliver-ticket`.

The active operating loop is:

```text
/morning-brief
      ↓
create/reuse one evidence-backed ticket
      ↓
/deliver-ticket
      ↓
spec → TDD plan → consolidated execution contract
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

`.claude/workspace-manifest.json` remains the reset ownership source and still excludes `.claude/skills/` from reset ownership. The PR #10 merge changed delivery tooling and operating documentation only; it did not change runtime code, dependencies, lockfiles, catalogue data, deployment configuration, or production behaviour.

## Application architecture

Current repository architecture remains:

- React 19 + Vite + TypeScript + Tailwind CSS client;
- Express + TypeScript API;
- MongoDB through Mongoose;
- TanStack Query for client server state;
- deterministic meal planning rather than a generative model in the request path;
- retailer/store-scoped catalogue selection and planning;
- Crawlee + Playwright retailer catalogue collection;
- Vitest client tests and Node TypeScript server tests.

`context/architecture.md` remains the architecture source of truth. No architecture change is inferred from the documentation-only AI workspace upgrade.

## Tesco development state

The repository contains the multi-retailer/Tesco development lineage, including Tesco adapter/catalogue work and retailer-scoped planner support documented in `context/architecture.md`, historical specs, and plans.

Current production truth is deliberately not inferred from those development artifacts. Production remains historically recorded as Aldi-only, with `CATALOGUE_READ_SOURCE=legacy`, until current deployment/configuration evidence is inspected separately.

The remaining Tesco readiness work is tracked in `roadmap.md` and still includes exact-head verification, complete Aldi/Tesco browser validation, persisted-record inspection, controlled crawl coverage, offer backfill/comparison, and human merge/release decisions where applicable.

## Current verification priorities

Before describing the current merged planner state as fully verified/delivered, run against the exact final `main` checkpoint:

```bash
npm run typecheck
npm run test:unit
npm run test:client
npm run build
npm run verify:browser
```

For the browser run, inspect `/plan` at mobile and desktop widths and cover step progression, focus movement, validation, Back/Continue value preservation, retailer choice, Review, generation, and server-field-error recovery.

For Tesco work, separately verify the real development flow and data integrity before any production activation decision.

## Production and deployment boundary

No fresh production deployment inspection was performed by this reconciliation. Historical production/deployment statements remain historical evidence only until rechecked.

Do not infer any of the following from a merged branch alone:

- production deployment;
- Tesco production activation;
- catalogue read-source migration;
- release to users.

## Status vocabulary

- **Proposed:** requested outcome without an approved technical contract.
- **Specified:** an approved technical specification exists.
- **Planned:** an approved implementation plan exists.
- **Awaiting approval:** the current execution contract is ready for explicit approval.
- **In progress:** approved implementation work has started.
- **Implemented:** behaviour exists in repository code.
- **Verifying:** implementation exists and required final verification/review is incomplete.
- **Verified:** supported by an identified executed check at the stated checkpoint.
- **Delivered:** ticket acceptance criteria, required verification/review, project-truth synchronization, and delivery evidence are complete.
- **Committed:** present in a Git commit.
- **Pushed:** commit/branch is present on a remote.
- **Merged:** incorporated into the target branch.
- **Deployed:** running in an identified environment.
- **Released:** deliberately available to the intended production audience.

Never promote an outcome to a later state without evidence.
