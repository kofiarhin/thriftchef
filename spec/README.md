# ThriftChef Specifications

This directory contains product and implementation contracts. Repository evidence and the current-state documents identify what is actually implemented; older specifications remain useful design history but must not be treated as current-state evidence when the implementation has deliberately changed.

## Current product and architecture contract

- `thriftchef-multi-retailer-product-spec.md`: retailer-aware product and architecture contract. Its conditional catalogue-scope model remains the broad target contract.

## Historical implementation contract

- `thriftchef-tesco-store-integration-spec.md`: the original approved Tesco store-scoped implementation specification. It was written before the development branch moved to a national public catalogue scope and direct Aldi/Tesco choice. Its identity, price, isolation, crawl-safety, read-source, authorization, and production-gate requirements remain relevant where they do not conflict with later approved branch decisions, but its store/postcode selection flow and `development`/non-selectable baseline do **not** describe the current branch.

For current Tesco development behaviour and evidence, read:

- `../context/current-state.md`;
- `../context/decisions.md`;
- `../context/architecture.md`;
- `../roadmap.md`.

The canonical product direction remains in `docs/ThriftChef-PRD-v0.1 (1).md`. Historical implementation documents also remain under `docs/` and `plan/`.

## Organisation rules

- Give each new ticket one outcome and one visible finish line.
- Prefer updating an active specification over creating a competing source of truth.
- Mark obsolete or superseded material as historical; do not silently rewrite history.
- Separate intended, implemented, verified, committed/pushed, merged, deployed, and unresolved states.
- Include scope, exclusions, experience, constraints, acceptance criteria, verification, and human-review items.
- Record material conflicts between the PRD, specifications, and repository instead of resolving them silently.
- Repository implementation evidence overrides an older specification for current-state claims; changing the intended product contract still requires an explicit decision.
- Do not put credentials, live customer data, or unredacted retailer captures in specifications.
