# ThriftChef Specifications

This directory contains active product and implementation contracts.

## Current specifications

- `thriftchef-multi-retailer-product-spec.md`: retailer-aware product and architecture contract.
- `thriftchef-tesco-store-integration-spec.md`: Tesco development integration, crawl, validation, and activation gates.

The canonical product direction is in `docs/ThriftChef-PRD-v0.1 (1).md`. Historical implementation documents remain under `docs/` and `plan/`.

## Organisation rules

- Give each new ticket one outcome and one visible finish line.
- Prefer updating an active specification over creating a competing source of truth.
- Mark obsolete material as historical; do not silently rewrite history.
- Separate intended, implemented, verified, merged, deployed, and unresolved states.
- Include scope, exclusions, experience, constraints, acceptance criteria, verification, and human-review items.
- Record material conflicts between the PRD and repository instead of resolving them silently.
- Do not put credentials, live customer data, or unredacted retailer captures in specifications.

