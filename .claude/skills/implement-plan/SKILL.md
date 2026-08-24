---
name: implement-plan
description: Execute an approved implementation plan against the current repository using a strict RED → GREEN → REFACTOR → VERIFY loop, then review the work and keep project context and lessons aligned with verified reality.
---

# Implement Plan

Execute one approved plan. This is the state-changing boundary of the delivery workflow.

## Required input and approval

Require an explicit plan path or one clearly selected plan. Read its source spec and ticket. Do not infer implementation approval merely because a plan file exists. Require the approval model defined by `AGENTS.md` or higher-priority project instructions before changing code; when no project-specific gate exists, present a concise execution summary and wait for explicit approval.

## Revalidate before editing

1. Read `AGENTS.md`, `CLAUDE.md`, `review.md`, the plan, source spec, source ticket, and relevant `context/*.md`, including `context/lessons.md`.
2. Inspect Git/worktree state and relevant current code/tests.
3. Confirm the plan still matches the repository.
4. Stop for renewed approval when current evidence introduces a material scope, architecture, dependency, migration, authentication, payment, permission, security, deployment, or destructive change not covered by the approved plan.
5. Preserve unrelated and uncommitted work.

## TDD execution

Follow [references/tdd-cycle.md](references/tdd-cycle.md) for every testable slice.

Execute one slice at a time:

```text
RED → GREEN → REFACTOR → VERIFY
```

Do not batch all tests first and then implement the entire feature.

## Final verification

After all slices:

- run the project's relevant automated checks actually available for the changed areas;
- run lint/type-check/build when configured and relevant;
- for user-facing work, inspect the real flow at relevant desktop and mobile widths when browser tooling is available;
- check relevant loading, empty, error, success, console, network, and accessibility states;
- report unavailable checks as `Not run`, never as passed.

## Review

Review the final diff against the ticket, spec, plan, `roadmap.md`, and `review.md`. Classify findings as:

- `Must fix`: blocks completion or creates material risk;
- `Should fix`: important but does not block the stated outcome;
- `Okay to ship`: verified and within scope.

Resolve in-scope `Must fix` findings before describing the implementation as complete. A fix that materially changes approved scope must stop for renewed approval.

## Keep project memory aligned

After verification, update only documents whose truth actually changed:

- `context/current-state.md`: reflect implemented and verified state from observed evidence;
- `context/architecture.md`: update only when architecture actually changed;
- `context/decisions.md`: record only decisions that were explicitly confirmed during the work;
- `roadmap.md`: mark an outcome complete only when its completion evidence is satisfied;
- `context/lessons.md`: add concise repository-specific lessons learned from actual implementation, test failures, debugging, or review.

Do not add generic advice to `context/lessons.md`. Do not create a lesson merely because the plan predicted something. If no useful repository-specific lesson was learned, leave the file unchanged.

## Completion report

Report:

- plan executed;
- affected files;
- RED/GREEN/REFACTOR/VERIFY evidence by slice;
- final checks as `Passed`, `Failed`, or `Not run`, including commands/results when available;
- review findings;
- synchronized project documents;
- lessons added, if any;
- unresolved and human-review items.

Never claim merge, deployment, release, or external actions occurred unless they were actually performed and verified.
