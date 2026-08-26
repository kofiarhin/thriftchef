# ThriftChef Tickets

Tickets define **what should change and why** and form the durable work queue between `/morning-brief` and `/deliver-ticket`.

Use `/ticket` for one roadmap outcome, bug, product request, or review finding at a time. `/morning-brief` may also create at most one ticket when it identifies one clear highest-leverage outcome, no equivalent active ticket exists, and no material decision blocks safe scoping. Freeform `/deliver-ticket` input may create or reuse a ticket using the same evidence/scoping contract.

Each ticket should contain one visible finish line, repository evidence, included scope, explicit exclusions, acceptance criteria, constraints, dependencies, verification expectations, and unresolved material questions.

Do not design endpoints, data models, component trees, or implementation order in the ticket unless those details are already established repository facts or explicit requirements. Technical solution details belong in `spec/`.

Use a stable numeric basename that downstream artifacts can reuse, for example:

```text
tickets/002-exact-head-verification.md
spec/002-exact-head-verification.md
plans/002-exact-head-verification.md
```

## Lifecycle metadata

New tickets use YAML frontmatter:

```yaml
---
ticket_schema: 1
status: ready
source: manual
created: YYYY-MM-DD
---
```

Allowed `source` values:

- `manual` — direct `/ticket` creation;
- `morning-brief` — created by `/morning-brief`;
- `deliver-ticket` — created from freeform `/deliver-ticket` input.

Optional lifecycle fields are added only when applicable: `spec`, `plan`, `delivered_at`, `superseded_by`, and `blocked_reason`.

Canonical statuses:

- `ready` — scoped and waiting for delivery;
- `awaiting-approval` — spec/plan are valid and execution approval is pending;
- `in-progress` — approved runtime work has started;
- `verifying` — implementation slices are complete and final verification/review is underway;
- `blocked` — a material unresolved decision or prerequisite prevents progress;
- `failed-verification` — required verification remains failed after implementation was attempted;
- `delivered` — acceptance criteria, required verification/review, project-truth synchronization, and delivery evidence are complete;
- `superseded` — another identified ticket intentionally replaces this one.

`delivered` and `superseded` are terminal historical states.

## Queue selection

`/deliver-ticket` with no argument sorts numeric ticket prefixes descending and selects the highest-numbered eligible unfinished ticket. It skips `delivered`, `superseded`, and blocked tickets during automatic selection. Interrupted `in-progress`/`verifying` work and `failed-verification` tickets must be revalidated before continuation.

A delivered ticket is not silently reopened. If the verified behaviour later regresses, create a new regression ticket that references the historical ticket.

Legacy tickets without lifecycle metadata remain readable. When selected, classify them against current repository and verification evidence before normalization or implementation. Do not invent historical dates or delivery evidence.

## Acceptance and delivery evidence

Prefer acceptance criteria as observable checkboxes. Check them only when observed implementation/verification evidence proves them.

A ticket may reach `delivered` only after:

- acceptance criteria are evidenced;
- required checks are `Passed`, or explicitly `Not run` only where the approved ticket/plan allows that limitation;
- no in-scope `Must fix` remains;
- relevant project truth is synchronized;
- a concise `## Delivery Evidence` section records checks, review, spec/plan paths, human-review items, and external actions not performed.

`delivered` does not mean committed, pushed, pull-requested, merged, deployed, or released.
