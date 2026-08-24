# Claude Compatibility Guide

Read and follow [`AGENTS.md`](AGENTS.md) as the canonical ThriftChef operating guide.

Before consequential work, also read:

- [`roadmap.md`](roadmap.md) for current priorities and exclusions;
- [`review.md`](review.md) for the definition of acceptable work;
- [`context/lessons.md`](context/lessons.md) plus other relevant files under [`context/`](context/);
- the source ticket under [`tickets/`](tickets/README.md);
- the active specification under [`spec/`](spec/README.md);
- the active implementation plan under [`plans/`](plans/README.md).

Use the delivery chain `/ticket` → `/spec` → `/plan` → `/implement-plan`. Testable implementation slices default to RED → GREEN → REFACTOR → VERIFY. Repository state overrides historical plans, and a ticket/spec/plan does not prove implementation.

Separate proposed, specified, planned, implemented, verified, merged, deployed, and released states. Never merge, deploy, activate a retailer, mutate live catalogue data, or change the production read source without explicit approval.
