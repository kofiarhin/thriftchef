# Claude Compatibility Guide

Read and follow [`AGENTS.md`](AGENTS.md) as the canonical ThriftChef operating guide.

Before consequential work, also read:

- [`roadmap.md`](roadmap.md) for current priorities and exclusions;
- [`review.md`](review.md) for the definition of acceptable work;
- [`context/lessons.md`](context/lessons.md) plus other relevant files under [`context/`](context/);
- the source ticket under [`tickets/`](tickets/README.md);
- the active specification under [`spec/`](spec/README.md);
- the active implementation plan under [`plans/`](plans/README.md).

Use `/morning-brief` for read-only orientation and one evidence-backed recommended next outcome. It does not create a ticket or authorize execution.

Use `/reset-workspace` only with a valid `.claude/workspace-manifest.json`, an exact deletion preview, and explicit approval. It resets manifest-owned operating state while preserving application/runtime files, source product documents, Git metadata, protected configuration, unknown project files, and `.claude/skills/`; missing or unsafe ownership evidence must fail closed.

Use the delivery chain `/ticket` → `/spec` → `/plan` → `/implement-plan`. Testable implementation slices default to RED → GREEN → REFACTOR → VERIFY. Repository state overrides historical plans, and a ticket/spec/plan does not prove implementation.

Separate proposed, specified, planned, implemented, verified, merged, deployed, and released states. Never merge, deploy, activate a retailer, mutate live catalogue data, or change the production read source without explicit approval.
