# Project Operating Guide

## Product

Summarize the product, customer, problem, promise, and current goal from supported project evidence.

## Operator workflow

Use `/morning-brief` to reconcile project truth, identify the single highest-leverage next outcome, and maintain the ticket queue.

The morning brief may inspect current project context, repository and available GitHub state, roadmap priorities, verification evidence, existing tickets/specs/plans, and real customer signals. It may identify truth drift, verification debt, and risks.

Its only write permission is creating at most one evidence-backed ticket under `tickets/` when no equivalent active ticket exists and no material decision blocks safe scoping. A created ticket must satisfy the normal `/ticket` contract and start with `status: ready` and `source: morning-brief`.

If an equivalent active ticket exists, reuse/reference it. If a material decision is unresolved or evidence is insufficient, create no ticket. The morning brief must not implement code, create specs or plans, modify GitHub state, change dependencies/data, commit, push, merge, deploy, or activate routines.

## Software delivery workflow

Use `/deliver-ticket` as the default end-to-end delivery command.

```text
/morning-brief
      ↓
create/reuse one ready ticket
      ↓
/deliver-ticket
      ↓
spec → TDD plan → consolidated execution review
      ↓
explicit approval
      ↓
RED → GREEN → REFACTOR → VERIFY
      ↓
final verification → review → project truth sync
      ↓
status: delivered
```

`/deliver-ticket` may also be called with an explicit ticket path, a unique ticket number/basename, or a freeform task. With no argument it selects the highest-numbered eligible unfinished numeric ticket. It skips delivered/superseded tickets and revalidates interrupted work before continuation.

Runtime implementation begins only after the consolidated execution contract receives the approval phrase required by project instructions. Material changes invalidate prior approval.

For step-by-step/manual control, the lower-level commands remain available:

```text
/ticket → /spec → /plan → /implement-plan
```

- `/ticket` defines what should change and why.
- `/spec` defines the technical contract.
- `/plan` defines the implementation order.
- `/implement-plan` executes an approved plan, verifies it, reviews it, and synchronizes project/ticket truth from observed evidence.

## Ticket lifecycle

Canonical states are:

- `ready`
- `awaiting-approval`
- `in-progress`
- `verifying`
- `delivered`
- `blocked`
- `failed-verification`
- `superseded`

`delivered` and `superseded` are terminal historical states. A delivered ticket is not silently reopened; a later regression becomes a new ticket referencing the historical work.

`delivered` means the ticket outcome was implemented, acceptance criteria were evidenced, required verification/review completed, and project truth was synchronized. It does not mean committed, pushed, merged, deployed, or released.

## Working rules

- Read the product source, roadmap, review standard, relevant context, lessons, and current repository evidence before changing work.
- Keep one ticket to one outcome and one reviewable change.
- Keep morning-brief intake, ticket, spec, plan, and implementation responsibilities separate even when `/deliver-ticket` orchestrates them.
- Preserve unrelated work and existing project conventions.
- Distinguish proposed, specified, planned, awaiting-approval, in-progress, implemented, verifying, verified, committed, pushed, merged, deployed, and released states when relevant.
- Prefer TDD for implementation: RED → GREEN → REFACTOR → VERIFY.
- Never treat a morning brief, ticket, specification, or plan as implementation evidence.
- Add lessons only when they are repository-specific and supported by observed work.
- Repository/verification evidence outranks stale lifecycle metadata when completion is evaluated.

## Permissions

Define safe/read-only, approval-required, and human-owned actions for this project. Material scope, dependency, migration, authentication, payment, permission, security, deployment, or destructive changes require the appropriate human decision.

`/morning-brief` has one narrow write permission: create one queued ticket. `/deliver-ticket` may create/update ticket/spec/plan documentation to reach execution review when project rules allow, but runtime changes require explicit execution approval. Push, merge, deploy, destructive data operations, billing/customer-data decisions, and security-policy decisions are not implied by delivery.

## Document alignment

After verified implementation, update only documents whose truth actually changed: current state, architecture, confirmed decisions, roadmap status, concise lessons, and lifecycle-aware source-ticket acceptance/evidence/status.

## Completion

Define the evidence required before work may be described as implemented, verified, delivered, committed, pushed, merged, deployed, or released. Do not collapse these states into one another.
