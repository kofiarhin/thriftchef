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

The PRD describes intended product direction. The repository describes current implementation. Production state must be recorded separately from development-branch state. Never collapse proposed, specified, planned, implemented, verified, merged, deployed, or released into one status.

## Software delivery workflow

Use the repository-local skills in `.claude/skills/`:

```text
/ticket → /spec → /plan → /implement-plan
```

- `/ticket` creates one evidence-backed request under `tickets/` and defines **what should change and why**.
- `/spec` turns an approved ticket into the technical contract under `spec/`.
- `/plan` turns an approved specification into ordered implementation slices under `plans/`.
- `/implement-plan` executes the approved plan against the current repository using **RED → GREEN → REFACTOR → VERIFY**, then reviews the result and synchronizes project truth.

Keep the same work-item basename across ticket, spec, and plan when practical so implementation can be traced back to its source. Do not skip an artifact when doing so would force the next stage to guess material product or technical decisions.

## Working style

- One ticket must produce one outcome, one visible finish line, and one reviewable diff.
- Inspect the active branch, repository instructions, relevant code, tests, documentation, and applicable lessons before proposing edits.
- Present a concise plan before product-behaviour, architecture, data, permission, dependency, deployment, or other consequential changes.
- Wait for explicit approval before state-changing work. Approval covers only the presented scope.
- Prefer the smallest complete vertical slice. Do not add unrelated features, abstractions, dependencies, services, or refactors.
- Preserve unrelated user changes. Never discard, overwrite, or hide them.
- Correct documentation when implementation evidence changes, but never manufacture evidence.
- A ticket, specification, or plan is not implementation evidence.
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

If a material assumption remains, ask exactly one decision question with a recommended answer and consequence. If scope changes materially after approval, stop and request approval for a revised plan.

## Permission levels

### Safe and read-only

Inspect files and history, analyze sources, explain findings, compare states, propose plans, and recommend checks.

### Approval required

Create or edit files; change dependencies, lockfiles, migrations, authentication, payments, permissions, external services, Git state, schedules, routines, or catalogue data; run persistent crawls; commit or push changes; and create previews or pull requests.

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
- `context/lessons.md` only for concise, reusable ThriftChef-specific lessons supported by observed evidence.

If no useful lesson was learned, leave `context/lessons.md` unchanged. Do not promote a predicted plan detail into project truth merely because it was intended.

## Review and handoff

Review the final diff against the ticket, specification, plan, `roadmap.md`, and `review.md`. Classify findings as `Must fix`, `Should fix`, or `Okay to ship`. Report:

- delivered outcome and affected files;
- RED/GREEN/REFACTOR/VERIFY evidence when implementation was testable;
- verification evidence and limitations;
- synchronized project documents and any lessons added;
- unresolved risks and assumptions;
- human-review items;
- whether the work is implemented, verified, committed, pushed, merged, or deployed.
