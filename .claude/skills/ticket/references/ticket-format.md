# Ticket Format

Use the smallest complete version of this structure.

```md
# <Outcome>

## Request
What was asked for.

## Problem
Why the change matters.

## User Outcome
What the user should be able to accomplish.

## Current Behaviour
What current repository evidence shows.

## Desired Behaviour
What should be different when the ticket is complete.

## Repository Evidence
Relevant confirmed files, flows, tests, constraints, or existing patterns.

## Scope
Included behaviour.

## Out of Scope
Explicit exclusions.

## Requirements
Product/functional requirements without inventing technical design.

## Acceptance Criteria
Observable conditions defining done.

## Constraints
Confirmed product, technical, security, accessibility, compatibility, or permission boundaries.

## Dependencies
Real prerequisites or `None identified`.

## Open Questions
Only unresolved questions that materially affect the outcome; otherwise `None`.
```

Do not include speculative affected-file lists as facts. Label recommendations clearly when they are genuinely useful, but leave solution design to `/spec`.
