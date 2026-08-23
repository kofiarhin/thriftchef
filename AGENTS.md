# ThriftChef Operating Guide

This file is the canonical operating guide for humans and AI agents working on ThriftChef. Read it with `roadmap.md`, `review.md`, and the active specification before proposing or changing work.

## Product contract

ThriftChef is a free, anonymous, retailer-aware weekly cooking assistant for UK households. A user chooses a supported retailer, sets household and cooking constraints, and receives a coherent meal plan, recipes, and one whole-package shopping list priced from that retailer's catalogue.

The deterministic planner is authoritative. Do not introduce a model into the request path without an approved product and architecture decision.

## Source-of-truth order

1. Safety, security, legal, and explicit permission boundaries.
2. The approved ticket and latest user instruction.
3. This operating guide.
4. `roadmap.md` for current priorities and exclusions.
5. The active file under `spec/`.
6. `review.md` for completion standards.
7. `context/` for product, architecture, decisions, and current state.
8. Historical plans and documentation.

The PRD describes intended product direction. The repository describes current implementation. Production state must be recorded separately from development-branch state. Never collapse implemented, verified, merged, and deployed into one status.

## Working style

- One ticket must produce one outcome, one visible finish line, and one reviewable diff.
- Inspect the active branch, repository instructions, relevant code, tests, and documentation before proposing edits.
- Present a concise plan before product-behaviour, architecture, data, permission, dependency, deployment, or other consequential changes.
- Wait for explicit approval before state-changing work. Approval covers only the presented scope.
- Prefer the smallest complete vertical slice. Do not add unrelated features, abstractions, dependencies, services, or refactors.
- Preserve unrelated user changes. Never discard, overwrite, or hide them.
- Correct documentation when implementation evidence changes, but never manufacture evidence.

## Engineering conventions

- Follow the existing React, Vite, TypeScript, Tailwind CSS, Node, Express, MongoDB, Vitest, and Node test-runner conventions.
- Keep API logic outside React components.
- Use TanStack Query for server state. Add Redux Toolkit only when true global client state requires it.
- Keep secrets in `.env`; expose only safe names and examples in `.env.example`.
- Use Crawlee for catalogue crawling. Never bypass retailer access controls, security challenges, authentication requirements, or usage restrictions.
- Scope every catalogue and planner query by retailer and store/catalogue as required. Cross-retailer mixing is a release blocker.
- Keep destructive catalogue reconciliation disabled for bounded, incomplete, failed, interrupted, or untrusted crawls.

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

## Review and handoff

Review the final diff against the ticket, `roadmap.md`, and `review.md`. Classify findings as `Must fix`, `Should fix`, or `Okay to ship`. Report:

- delivered outcome and affected files;
- verification evidence and limitations;
- unresolved risks and assumptions;
- human-review items;
- whether the work is implemented, verified, committed, pushed, merged, or deployed.

