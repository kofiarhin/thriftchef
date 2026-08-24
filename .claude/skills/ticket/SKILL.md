---
name: ticket
description: Turn a roadmap outcome, bug report, idea, or product request into one evidence-backed implementation ticket that defines what should change and why, without designing or implementing the technical solution.
---

# Ticket

Create one clear assignment with a visible finish line and save it under `tickets/`.

## Input

Accept a user request, bug report, roadmap item, customer problem, or equivalent description. If no request is supplied, use the first clearly incomplete roadmap outcome only when it is unambiguous. Ask one material question when the requested outcome cannot be scoped safely from available context.

## Context to read

Before writing the ticket:

1. Read `AGENTS.md` and `CLAUDE.md` when present.
2. Read `roadmap.md`, `review.md`, `context/product.md`, `context/current-state.md`, and `context/lessons.md` when present.
3. Read relevant architecture/decision/customer evidence when it materially affects the request.
4. Inspect relevant repository code and tests enough to describe current behaviour accurately.
5. Inspect relevant existing tickets/specs to avoid duplication or conflicting scope.

Repository evidence overrides assumptions. Do not invent implementation status, customer evidence, or technical constraints.

## Ticket responsibility

A ticket defines **what should change and why**. It should not prescribe a new architecture, endpoint shape, class list, component tree, or implementation sequence unless those are already established repository facts or explicit requirements.

Use [references/ticket-format.md](references/ticket-format.md).

## Scope rules

- One ticket = one outcome = one reviewable change.
- Split oversized requests into ordered proposed tickets instead of creating one giant assignment.
- Make the finish line observable through acceptance criteria.
- Separate scope from out-of-scope work.
- Preserve unresolved material questions instead of guessing.

## Output

Save the ticket under `tickets/` using the project's existing naming convention. Otherwise use the next available zero-padded numeric prefix plus a concise slug, such as `004-saved-products.md`.

Return the saved path, a one-line outcome, and any unresolved issue that blocks `/spec`.

Do not implement code, generate the technical spec, or change dependencies while creating the ticket.
