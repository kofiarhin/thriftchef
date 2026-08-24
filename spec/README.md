# ThriftChef Specifications

This directory contains technical product and implementation contracts. New specifications should be generated from an approved source ticket under `tickets/`; repository evidence and `context/current-state.md` identify what is actually implemented. Older specifications remain useful design history but must not be treated as current-state evidence when implementation has deliberately changed.

## Delivery contract

A specification defines **how the approved ticket should fit the existing system**. It should reference its source ticket, inspect the relevant current code/tests, stay inside ticket scope, and capture applicable architecture, data, API, UI, validation, error, security, accessibility, testing, verification, risk, and unresolved technical details.

After the specification is approved, `/plan` creates the ordered TDD implementation plan under `plans/`. Do not implement runtime code while generating a specification.

## Current product and architecture contract

- `thriftchef-multi-retailer-product-spec.md`: retailer-aware product and architecture contract. Its conditional catalogue-scope model remains the broad target contract.

## Historical implementation contract

- `thriftchef-tesco-store-integration-spec.md`: the original approved Tesco store-scoped implementation specification. It was written before the development branch moved to a national public catalogue scope and direct Aldi/Tesco choice. Its identity, price, isolation, crawl-safety, read-source, authorization, and production-gate requirements remain relevant where they do not conflict with later approved branch decisions, but its store/postcode selection flow and `development`/non-selectable baseline do **not** describe the current branch.

For current Tesco development behaviour and evidence, read:

- `../context/current-state.md`;
- `../context/decisions.md`;
- `../context/architecture.md`;
- `../context/lessons.md`;
- `../roadmap.md`.

The canonical product direction remains in `docs/ThriftChef-PRD-v0.1 (1).md`. Historical implementation documents remain under `docs/`, `spec/`, and `plans/`.

## Organisation rules

- Each new specification references one source ticket and keeps the same basename when practical.
- Prefer updating an active specification over creating a competing source of truth.
- Mark obsolete or superseded material as historical; do not silently rewrite history.
- Separate proposed, specified, planned, implemented, verified, committed/pushed, merged, deployed, and unresolved states.
- Record material conflicts between the PRD, ticket, specification, and repository instead of resolving them silently.
- Repository implementation evidence overrides an older specification for current-state claims; changing the intended product contract still requires an explicit decision.
- Do not put credentials, live customer data, or unredacted retailer captures in specifications.
