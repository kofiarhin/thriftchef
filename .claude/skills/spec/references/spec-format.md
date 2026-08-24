# Specification Format

Use only applicable sections.

```md
# <Outcome> Specification

## Source Ticket
`tickets/...`

## Objective
The technical outcome this specification must enable.

## Existing System
Relevant confirmed architecture, code paths, data flows, and tests.

## Proposed Solution
The smallest clean solution consistent with the repository and ticket.

## Architecture
Applicable boundaries and interactions.

## Data Model
Applicable persistence/schema changes and compatibility concerns.

## API Contract
Applicable requests, responses, errors, authorization, and validation.

## Frontend Behaviour
Applicable UI/data flow, including loading, empty, error, and success states.

## Backend Behaviour
Applicable routing/service/persistence behaviour.

## Validation and Error Handling
Expected validation, failure behaviour, retry, and error shape.

## Edge Cases
Important boundary conditions.

## Security / Privacy / Accessibility
Only relevant constraints and requirements.

## Affected Areas
Repository-backed modules/files or clearly labelled likely areas.

## Testing Requirements
Behaviour that must be covered; do not write the implementation plan here.

## Verification Requirements
Project checks and user-facing verification needed before completion.

## Technical Risks
Material risks and compatibility concerns.

## Open Technical Questions
Blocking unresolved issues or `None`.
```
