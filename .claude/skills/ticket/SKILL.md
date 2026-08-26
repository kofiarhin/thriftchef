---
name: ticket
description: Turn a roadmap outcome, bug report, idea, or product request into one evidence-backed implementation ticket with durable lifecycle metadata, defining what should change and why without designing or implementing the technical solution.
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
5. Inspect active files under `tickets/`, `spec/`, and `plans/` to avoid duplicate or conflicting work.

Repository evidence overrides assumptions. Do not invent implementation status, customer evidence, or technical constraints.

## Ticket responsibility

A ticket defines **what should change and why**. It should not prescribe a new architecture, endpoint shape, class list, component tree, or implementation sequence unless those are already established repository facts or explicit requirements.

Use [references/ticket-format.md](references/ticket-format.md).

## Scope and duplicate rules

- One ticket = one outcome = one reviewable change.
- Split oversized requests into ordered proposed tickets instead of creating one giant assignment.
- Make the finish line observable through acceptance criteria.
- Separate scope from out-of-scope work.
- Preserve unresolved material questions instead of guessing.
- Do not create a duplicate when an existing active ticket materially covers the same outcome. Reuse/reference the existing ticket instead.
- A delivered historical ticket is not reopened silently. If current evidence shows a regression or materially new problem, create a new ticket that references the prior outcome.

## Lifecycle contract

Every newly created ticket uses `ticket_schema: 1` and starts with `status: ready` once it is scoped and unblocked.

Canonical statuses:

- `ready` — scoped, unblocked, waiting for delivery;
- `awaiting-approval` — spec and plan are valid and the execution contract is waiting for explicit approval;
- `in-progress` — approved runtime/application implementation has started;
- `verifying` — implementation slices are complete and final verification/review is underway;
- `delivered` — acceptance criteria, required verification, review, and project-truth synchronization are complete from observed evidence;
- `blocked` — a material unresolved decision or prerequisite prevents safe progress;
- `failed-verification` — implementation was attempted but required verification remains failed;
- `superseded` — the ticket was intentionally replaced by another identified ticket.

`delivered` and `superseded` are terminal queue states. Delivery status must never be treated as equivalent to committed, pushed, merged, deployed, or released.

Allowed `source` values:

- `manual` for direct `/ticket` creation;
- `morning-brief` when created by `/morning-brief`;
- `deliver-ticket` when created from freeform `/deliver-ticket` input.

When `/ticket` is invoked directly, use `source: manual`. When another approved workflow delegates ticket creation, preserve the caller-specific source value.

Only implementation/delivery workflows may mark acceptance criteria complete or write `## Delivery Evidence`, and only from observed evidence.

## Output

Save the ticket under `tickets/` using the project's existing naming convention. Otherwise use the next available zero-padded numeric prefix plus a concise slug, such as `004-saved-products.md`.

Return the saved path, lifecycle status, a one-line outcome, and any unresolved issue that blocks `/spec`.

Do not implement code, generate the technical spec, create an implementation plan, or change dependencies while creating the ticket.
