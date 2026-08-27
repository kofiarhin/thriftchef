# Claude Compatibility Guide

Read and follow [`AGENTS.md`](AGENTS.md) as the canonical ThriftChef operating guide. Read [`.claude/README.md`](.claude/README.md) for the installed command registry; it supplements but never overrides `AGENTS.md`.

Before consequential work, also read:

- [`roadmap.md`](roadmap.md) for current priorities and exclusions;
- [`review.md`](review.md) for the definition of acceptable work;
- [`context/lessons.md`](context/lessons.md) plus other relevant files under [`context/`](context/);
- the source ticket under [`tickets/`](tickets/README.md);
- the active specification under [`spec/`](spec/README.md);
- the active implementation plan under [`plans/`](plans/README.md).

Use `/workspace-health` when current project truth, lifecycle metadata, artifact linkage, or verification evidence may have drifted. It is strictly read-only.

Use `/sync-project` when repository/Git/GitHub/verification reality changed outside the normal delivery workflow and operating documents need evidence-backed reconciliation. Unless a stronger ThriftChef rule grants a narrow command-scoped write, it must present the exact documentation/lifecycle change plan and wait for `Approve sync`. It cannot change runtime code, dependencies/data, Git/GitHub state, merge, deployment, or release state.

Use `/morning-brief` for project orientation, truth reconciliation, prioritization, and safe queue intake. It may create at most one evidence-backed ticket under `tickets/` when no equivalent active ticket exists and no material decision blocks scoping. It never implements the ticket.

Use `/deliver-ticket` as the default end-to-end delivery command. It can select the latest eligible unfinished numeric ticket, resolve an explicit ticket path or unique number/basename, or create/reuse a ticket from freeform task text. It generates or revalidates the matching spec and TDD plan, then stops at one consolidated execution contract before runtime changes.

Runtime/application edits require explicit approval of that execution contract; when no stronger project phrase applies, use `Approve plan`. Material scope, architecture, dependency, migration, authentication, payment, permission, security, deployment, destructive-behaviour, acceptance, or verification changes invalidate prior approval.

The manual delivery chain `/ticket` → `/spec` → `/plan` → `/implement-plan` remains available for step-by-step control. Testable implementation slices default to RED → GREEN → REFACTOR → VERIFY. Repository state overrides historical plans and stale ticket metadata, and a morning brief/ticket/spec/plan does not prove implementation.

After a lifecycle-aware ticket is already `delivered`, use `/publish-ticket` only when Git publication is explicitly requested. It must validate the exact non-main branch/diff, present one publish contract, and wait for `Approve publish` before a scoped commit when needed, normal non-force push, and draft PR creation. It never force-pushes, merges, deploys, releases, deletes branches, or mutates production/catalogue data.

Ticket lifecycle states are `ready`, `awaiting-approval`, `in-progress`, `verifying`, `delivered`, `blocked`, `failed-verification`, and `superseded`. `delivered` and `superseded` are terminal historical states. `delivered` does not mean committed, pushed, merged, deployed, or released.

Use `/reset-workspace` only with a valid `.claude/workspace-manifest.json`, an exact deletion preview, and explicit approval. It resets manifest-owned operating state while preserving application/runtime files, source product documents, Git metadata, protected configuration, unknown project files, and `.claude/skills/`; missing or unsafe ownership evidence must fail closed.

Separate proposed, specified, planned, awaiting-approval, in-progress, implemented, verifying, verified, delivered, committed, pushed, merged, deployed, and released states. Never merge, deploy, activate a retailer, mutate live catalogue data, or change the production read source without explicit approval.
