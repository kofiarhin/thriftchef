# ThriftChef AI Workspace Skills

`AGENTS.md` is the canonical ThriftChef operating guide and safety boundary. This file records the repository-local skill set installed under `.claude/skills/`.

For the practical day-to-day workflow, command selection, approval boundaries, lifecycle states, and examples, read [`docs/AI_WORKSPACE.md`](../docs/AI_WORKSPACE.md).

## Installed command architecture

### Workspace

- `/setup-workspace` — create/reconcile the persistent operating workspace from a PRD/specification.
- `/workspace-health` — read-only evidence and consistency audit.
- `/sync-project` — approval-gated documentation/lifecycle reconciliation from current repository/Git/GitHub/verification evidence.
- `/reset-workspace` — manifest-backed reset of workspace-owned operating state.

### Intake and delivery

- `/morning-brief` — orientation/prioritization and at most one evidence-backed queued ticket.
- `/ticket` — define what should change and why.
- `/spec` — define the technical contract.
- `/plan` — define ordered TDD implementation slices.
- `/implement-plan` — execute an approved plan and synchronize verified truth.
- `/deliver-ticket` — orchestrate ticket → spec → plan → approval → implementation → verification → delivery.

### Publication

- `/publish-ticket` — after a ticket is already delivered, present a separate publish contract and, only after approval, create a scoped commit when needed, push the non-main branch without force, and create a draft PR. It never merges or deploys.

## Recommended operating flow

```text
/workspace-health
      ↓
/sync-project            only when durable project truth needs repair
      ↓
/morning-brief
      ↓
/deliver-ticket
      ↓
Approve plan
      ↓
RED → GREEN → REFACTOR → VERIFY
      ↓
status: delivered
      ↓
/publish-ticket
      ↓
Approve publish
      ↓
commit if needed → push branch → draft PR
      ↓
human review / explicit merge
```

`delivered`, `committed`, `pushed`, `merged`, `deployed`, and `released` remain distinct states.

## Approval boundaries

Fallback phrases when no stricter ThriftChef rule applies:

```text
Approve plan
Approve sync
Approve publish
```

- `Approve plan` covers only the presented runtime execution contract.
- `Approve sync` covers only the presented documentation/lifecycle reconciliation.
- `Approve publish` covers only the presented commit/push/draft-PR contract.

Material changes invalidate the relevant prior approval.

## Quick command choice

```text
Need a read-only audit?                  /workspace-health
Project memory is stale?                 /sync-project
Need the next evidence-backed outcome?   /morning-brief
Want end-to-end delivery?                /deliver-ticket
Want manual stage-by-stage control?      /ticket → /spec → /plan → /implement-plan
Ticket delivered and needs a draft PR?   /publish-ticket
Need to rebuild operating state?         /reset-workspace
```

## Reusable source traceability

The installed extension skills originate from `kofiarhin/ai-dev-workspace` and were merged into that repository's `main` before this usage-guide refresh:

- `/workspace-health` — reusable source PR #7;
- `/sync-project` — reusable source PR #8;
- `/publish-ticket` — reusable source PR #9.

ThriftChef vendors the repository-local copies under `.claude/skills/`; project-specific `AGENTS.md` rules remain authoritative and may be stricter than the reusable command contracts.

## ThriftChef-specific precedence

All skills remain subordinate to `AGENTS.md`, including retailer/data safety rules, explicit approval boundaries, verification requirements, and human-owned production decisions. A reusable skill must stop rather than weaken a stricter ThriftChef rule.
