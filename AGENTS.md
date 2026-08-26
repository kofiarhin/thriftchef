# ThriftChef Operating Guide

This file is the canonical operating guide for humans and AI agents working on ThriftChef. Read it with `roadmap.md`, `review.md`, the active ticket, specification, plan, and relevant project context before consequential work.

## Product contract

ThriftChef is a free, anonymous, retailer-aware weekly cooking assistant for UK households. A user chooses a supported retailer, sets household and cooking constraints, and receives a coherent meal plan, recipes, and one whole-package shopping list priced from that retailer's catalogue.

The deterministic planner is authoritative. Do not introduce a model into the request path without an approved product and architecture decision.

## Source-of-truth order

1. Safety, security, legal, and explicit permission boundaries.
2. The user's latest explicit instruction and the approved ticket for the current outcome.
3. This operating guide.
4. `roadmap.md` for current priorities and exclusions.
5. The source ticket under `tickets/` for what should change and why.
6. The active file under `spec/` for the approved technical contract.
7. The active file under `plans/` for implementation order.
8. `review.md` for completion standards.
9. `context/` for product, architecture, decisions, current state, and repository-specific lessons.
10. Historical specifications, plans, and documentation.

The PRD describes intended product direction. The repository describes current implementation. Production state must be recorded separately from development-branch state. Never collapse proposed, specified, planned, awaiting-approval, in-progress, implemented, verifying, verified, delivered, committed, pushed, merged, deployed, or released into one status.

## Operator and workspace lifecycle

Use the repository-local operator skills in `.claude/skills/`:

- `/morning-brief` reconciles project context, repository and available GitHub state, roadmap priorities, verification evidence, risks, active tickets/specs/plans, and real customer signals. It identifies at most one highest-leverage next outcome and may create at most one evidence-backed ticket under `tickets/` when no equivalent active ticket exists and no material decision blocks safe scoping. It never implements the ticket.
- `/reset-workspace` resets only AI operating state explicitly owned by `.claude/workspace-manifest.json`. It must show the exact deletion set and receive explicit approval before deleting anything. It preserves application/runtime files, source product documents, Git metadata, secrets and configuration, dependencies, deployment files, unknown project files, and `.claude/skills/`.

Invoking `/morning-brief` authorizes only its narrow queue write: creation of at most one new evidence-backed ticket under `tickets/`. It does not authorize edits to existing tickets, runtime code, specs, plans, GitHub state, dependencies, data, commits, pushes, merges, deployments, or routines.

If the workspace manifest is missing, invalid, unsafe, or conflicts with the repository, `/reset-workspace` must fail closed and delete nothing. The manifest is ownership evidence for the operating layer; it never grants authority over protected application or project files.

## Software delivery workflow

Use `/deliver-ticket` as the default end-to-end delivery command:

```text
/morning-brief
      ↓
create/reuse one evidence-backed ticket
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
final verification → review → project truth sync
      ↓
source-ticket delivery evidence
      ↓
status: delivered
```

`/deliver-ticket` supports:

- no argument: select the highest-numbered eligible unfinished numeric ticket;
- an exact ticket path;
- a unique ticket number or basename;
- freeform task text, which creates or reuses a ticket before continuing.

Automatic selection skips `delivered`, `superseded`, and blocked tickets. Interrupted or failed work must be revalidated before continuation. Repository and verification evidence outrank stale lifecycle metadata.

Invoking `/deliver-ticket` authorizes the documentation work needed to resolve/create the ticket and generate or revalidate the matching `spec/` and `plans/` artifacts up to the consolidated execution contract. It does not authorize runtime/application edits. Runtime work begins only after explicit execution approval; when no stronger project phrase applies, the required phrase is `Approve plan`. Material scope, architecture, dependency, migration, authentication, payment, permission, security, deployment, destructive-behaviour, acceptance, or verification changes invalidate prior approval.

For manual/expert control, the lower-level skills remain independently available:

```text
/ticket → /spec → /plan → /implement-plan
```

- `/ticket` creates one evidence-backed request under `tickets/` and defines **what should change and why**.
- `/spec` turns an approved ticket into the technical contract under `spec/`.
- `/plan` turns an approved specification into ordered implementation slices under `plans/`.
- `/implement-plan` executes the approved plan using **RED → GREEN → REFACTOR → VERIFY**, then verifies, reviews, synchronizes project truth, and updates lifecycle-aware source-ticket evidence/status.

Keep the same work-item basename across ticket, spec, and plan when practical so implementation can be traced back to its source. Do not skip an artifact when doing so would force the next stage to guess material product or technical decisions.

## Ticket lifecycle

New tickets use `ticket_schema: 1` and a canonical lifecycle state:

- `ready` — scoped, unblocked, and waiting for delivery;
- `awaiting-approval` — spec and plan are valid and execution approval is pending;
- `in-progress` — approved runtime implementation has started;
- `verifying` — implementation slices are complete and final verification/review is underway;
- `delivered` — acceptance criteria, required verification, review, project-truth synchronization, and ticket delivery evidence are complete;
- `blocked` — a material unresolved decision or prerequisite prevents safe progress;
- `failed-verification` — implementation was attempted but required verification remains failed;
- `superseded` — another identified ticket intentionally replaces this one.

`delivered` and `superseded` are terminal historical states. A delivered ticket is not silently reopened; a later regression becomes a new ticket referencing the historical work. `delivered` does not mean committed, pushed, merged, deployed, or released.

Legacy tickets without lifecycle metadata remain valid historical artifacts. When selected for delivery, classify them against current repository evidence before normalization or execution. Do not invent historical dates or delivery evidence.

## Working style

- One ticket must produce one outcome, one visible finish line, and one reviewable diff.
- Inspect the active branch, repository instructions, relevant code, tests, documentation, active tickets/specs/plans, and applicable lessons before proposing edits.
- Present a concise execution contract before runtime product-behaviour, architecture, data, permission, dependency, deployment, or other consequential changes.
- Wait for explicit approval before runtime state-changing work. Approval covers only the presented scope.
- Prefer the smallest complete vertical slice. Do not add unrelated features, abstractions, dependencies, services, or refactors.
- Preserve unrelated user changes. Never discard, overwrite, or hide them.
- Correct documentation when implementation evidence changes, but never manufacture evidence.
- A morning brief, ticket, specification, or plan is not implementation evidence.
- Add to `context/lessons.md` only when actual repository work, tests, debugging, or review produced a useful repository-specific lesson.

## Engineering conventions

- Follow the existing React, Vite, TypeScript, Tailwind CSS, Node, Express, MongoDB, Vitest, and Node test-runner conventions.
- Keep API logic outside React components.
- Use TanStack Query for server state. Add Redux Toolkit only when true global client state requires it.
- Keep secrets in `.env`; expose only safe names and examples in `.env.example`.
- Use Crawlee for catalogue crawling. Never bypass retailer access controls, security challenges, authentication requirements, or usage restrictions.
- Scope every catalogue and planner query by retailer and store/catalogue as required. Cross-retailer mixing is a release blocker.
- Keep destructive catalogue reconciliation disabled for bounded, incomplete, failed, interrupted, or untrusted crawls.
- For testable implementation work, default to TDD: write the smallest RED test, run it and confirm the intended failure, make the minimum GREEN change, REFACTOR without expanding behaviour, then VERIFY relevant regression coverage.

## Ticket contract

Every consequential ticket must define:

- Goal and primary user.
- Included scope and explicit exclusions.
- Expected user experience.
- Constraints and dependencies.
- Observable acceptance criteria.
- Automated and browser verification.
- Human-review items.

New tickets also carry lifecycle metadata. Acceptance criteria may be checked and `## Delivery Evidence` may be written only from observed implementation/verification evidence.

If a material assumption remains, ask exactly one decision question with a recommended answer and consequence. If scope changes materially after approval, stop and request approval for a revised execution contract.

## Permission levels

### Safe and read-only

Inspect files and history, analyze sources, explain findings, compare states, propose plans, and recommend checks.

### Command-scoped documentation writes

- Invoking `/morning-brief` authorizes at most one new evidence-backed queue ticket under `tickets/`, with duplicate prevention and no implementation.
- Invoking `/deliver-ticket` authorizes ticket normalization/intake plus matching ticket/spec/plan documentation updates required to reach the consolidated execution contract.

These narrow authorizations do not extend to runtime/application edits, dependency or lockfile changes, migrations, catalogue mutation, GitHub writes, commits, pushes, pull requests, merges, deployments, or destructive operations.

### Approval required

Create, edit, move, or delete files outside the command-scoped documentation writes above; reset manifest-owned operating state through `/reset-workspace`; change runtime/application files, dependencies, lockfiles, migrations, authentication, payments, permissions, external services, Git state, schedules, routines, or catalogue data; run persistent crawls; commit or push changes; and create previews or pull requests.

For `/deliver-ticket`, the consolidated execution contract is the approval boundary for in-scope runtime/application edits. Material changes invalidate that approval and require a revised contract.

### Human-owned

Production deployment, merging, destructive data operations, live billing or customer-data decisions, credential sharing, retailer-access authorization, and security-policy decisions. Provide guidance unless the user explicitly authorizes the action and the environment permits it.

For the Tesco integration, do not merge, deploy, activate Tesco in production, enable reconciliation, or change `CATALOGUE_READ_SOURCE` without separate explicit approval and completion of the documented gates.

## Verification and evidence

Use the repository's configured commands where relevant:

```bash
npm run typecheck
npm run test:unit
npm run test:client
npm run build
```

For user-facing changes, also run the application and inspect the actual flow at desktop and mobile widths. Check loading, empty, error, success, and accessibility states plus console and network errors.

Report checks as `Passed`, `Failed`, or `Not run`, including the exact command and relevant result. Never claim a test, build, preview, crawl, database inspection, commit, push, merge, deployment, or external action succeeded unless it was run and inspected.

## Document alignment and persistent lessons

After verified implementation, update only documents whose truth actually changed:

- `context/current-state.md` for observed implementation and verification state;
- `context/architecture.md` only when architecture actually changed;
- `context/decisions.md` only for decisions explicitly confirmed during the work;
- `roadmap.md` only when an outcome's completion evidence is satisfied;
- `context/lessons.md` only for concise, reusable ThriftChef-specific lessons supported by observed evidence;
- the lifecycle-aware source ticket for acceptance-criteria evidence, final checks, review findings, artifact paths, and final status.

If no useful lesson was learned, leave `context/lessons.md` unchanged. Do not promote a predicted plan detail into project truth merely because it was intended.

## Review and handoff

Review the final diff against the ticket, specification, plan, `roadmap.md`, and `review.md`. Classify findings as `Must fix`, `Should fix`, or `Okay to ship`. Report:

- delivered outcome and affected files;
- RED/GREEN/REFACTOR/VERIFY evidence when implementation was testable;
- verification evidence and limitations;
- synchronized project documents and source-ticket evidence/status;
- unresolved risks and assumptions;
- human-review items;
- whether the work is implemented, verified, delivered, committed, pushed, merged, deployed, or released.
