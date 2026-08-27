# ThriftChef AI Workspace Skills

`AGENTS.md` remains the canonical project operating guide and safety boundary. This file records the repository-local skill set installed under `.claude/skills/`.

## Installed command architecture on this integration branch

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
/workspace-health        optional read-only audit
      ↓
/sync-project            optional approved truth repair
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
/publish-ticket          optional separate approval
      ↓
commit if needed → push branch → draft PR
```

`delivered`, `committed`, `pushed`, `merged`, `deployed`, and `released` remain distinct states.

## Reusable source traceability

The three extension skills are vendored from the stacked draft implementation in `kofiarhin/ai-dev-workspace`:

- `/workspace-health` — source head `e18b10543cf367729d0de96ec4dca3e25f801353`;
- `/sync-project` — source head `73b9aea1fcd2ae59e86c4b1194c5f7b4ad58bb77`;
- `/publish-ticket` — source head `314c0b6e5b38eba2732e18a151be43bd9ee37b0c`.

The reusable source PRs are intentionally draft. Vendoring them here does not merge those source PRs and does not authorize runtime, production, merge, or deployment actions.

## ThriftChef-specific precedence

All new skills remain subordinate to `AGENTS.md`, including ThriftChef's retailer/data safety rules, explicit approval boundaries, verification requirements, and human-owned production decisions. A reusable skill must stop rather than weaken a stricter ThriftChef rule.
