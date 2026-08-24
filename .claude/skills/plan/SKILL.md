---
name: plan
description: Turn an approved technical specification into a small, ordered TDD implementation plan using RED, GREEN, REFACTOR, and VERIFY slices without implementing code.
---

# Plan

Create an implementation sequence for one approved spec and save it under `plans/`.

## Required input

Require an explicit spec path or one clearly selected spec. Read its source ticket as well. Stop when the spec is missing, unreadable, materially ambiguous, or blocked by an unresolved technical decision.

## Context to read

1. Read the complete source spec and ticket.
2. Read `AGENTS.md`, `review.md`, `context/current-state.md`, `context/architecture.md`, `context/decisions.md`, and `context/lessons.md` when present.
3. Inspect relevant current code and tests so steps are grounded in the repository as it exists now.

## Planning responsibility

The plan defines **the order of implementation**, not a new technical design. If planning reveals that the approved spec is materially wrong or stale, stop and return to `/spec`.

Prefer the smallest complete vertical slices. Each testable slice uses:

```text
RED → GREEN → REFACTOR → VERIFY
```

Use [references/plan-format.md](references/plan-format.md).

### RED

Define the smallest test that proves the desired behaviour is missing. The implementation phase must run it and confirm it fails for the intended reason.

### GREEN

Define only the minimum production change needed to make the RED test pass.

### REFACTOR

Define the cleanup boundary without adding unrequested behaviour. Tests must remain green.

### VERIFY

Define targeted regression checks for the slice.

If a slice cannot reasonably be test-first, say why and define the strongest available verification instead. Do not use this exception to bypass normal TDD for testable behaviour.

## Output

Save under `plans/` using the same basename as the source spec when possible, for example `plans/004-saved-products.md`.

Return the saved path, slice count, and any issue that blocks `/implement-plan`.

Do not edit runtime code while generating the plan.
