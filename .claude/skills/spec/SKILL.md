---
name: spec
description: Turn an approved implementation ticket into a repository-grounded technical specification that defines how the requested behaviour should fit the existing system without implementing it.
---

# Spec

Create the technical contract for one ticket and save it under `spec/`.

## Required input

Require an explicit ticket path or one clearly selected ticket. Stop when the source ticket is missing, unreadable, materially ambiguous, or blocked by an unresolved product decision.

## Context to read

1. Read the complete source ticket.
2. Read `AGENTS.md`, `CLAUDE.md`, `review.md`, relevant `context/*.md`, and `context/lessons.md`.
3. Inspect the relevant application code, data models, APIs, components, configuration, and tests deeply enough to understand the existing architecture and conventions.
4. Inspect related specs when they establish a current contract or prevent duplication.

## Spec responsibility

The spec defines **the technical solution** for the ticket. It must remain inside the ticket's approved scope.

Use [references/spec-format.md](references/spec-format.md).

Distinguish:

- **Existing:** confirmed repository behaviour.
- **Required:** behaviour demanded by the ticket.
- **Proposed:** the smallest clean technical approach not already established as fact.
- **Unresolved:** a material question that still requires a decision.

Do not silently turn recommendations into established architecture.

## Conflict handling

If repository evidence shows that the ticket cannot be implemented as written without materially changing scope, architecture, dependencies, migrations, authentication, payments, permissions, or security posture, stop and report the conflict instead of redesigning the ticket silently.

## Output

Save under `spec/` using the same basename as the ticket when possible, for example `spec/004-saved-products.md`.

Return the saved path, the core technical approach, and unresolved issues that block `/plan`.

Do not modify runtime code while generating the specification.
