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
- `/ticket` — establish shared understanding, then define what should change and why.
- `/spec` — define the technical contract only from a shared-understanding-ready ticket.
- `/plan` — define ordered TDD implementation slices only from a plan-ready spec.
- `/implement-plan` — execute an approved plan and synchronize verified truth.
- `/deliver-ticket` — orchestrate bounded ticket intake → spec → plan → approval → implementation → verification → delivery.

### Publication

- `/publish-ticket` — after a ticket is already delivered, present a separate publish contract and, only after approval, create a scoped commit when needed, push the non-main branch without force, and create a draft PR. It never merges or deploys.

## Shared-understanding ticket intake

`/ticket` now performs a bounded Grill before writing a new `status: ready` ticket whenever repository evidence leaves a material user-owned decision unresolved.

The Grill:

- researches repository facts instead of asking the user for discoverable information;
- asks exactly one material question at a time;
- uses the visible format `Question` → `Recommended answer` → `Why`;
- asks no more than three questions by default and stops early when the request is already clear;
- limits questions to decisions that can materially change scope, acceptance criteria, environment/data, security/permissions, architecture constraints, dependencies/migrations, or verification requirements;
- leaves ordinary technical choices to `/spec`;
- never creates a misleading `status: ready` ticket while a known material intake question remains unresolved.

A ready ticket records concise confirmed decisions under `## Shared Understanding` and has `## Open Questions` set to `None` for material intake decisions. If the default Grill cap is exhausted while a material decision still blocks safe specification, the workflow stops or records the ticket as `status: blocked`; it does not guess.

`/spec` and `/plan` preserve this boundary. New material user-owned decisions discovered later route back to `/ticket`; plan-ready specs must not carry blocking open technical questions.

## Recommended operating flow

```text
/workspace-health
      ↓
/sync-project            only when durable project truth needs repair
      ↓
/morning-brief
      ↓
/ticket or /deliver-ticket freeform intake
      ↓
bounded shared-understanding Grill when needed
      ↓
status: ready with no material intake questions
      ↓
/spec → /plan
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

The ticket Grill is not an execution approval gate. Its purpose is shared understanding before ticket creation. Material changes after an execution or publication approval still invalidate the relevant approval.

## Quick command choice

```text
Need a read-only audit?                  /workspace-health
Project memory is stale?                 /sync-project
Need the next evidence-backed outcome?   /morning-brief
Need to define a request carefully?      /ticket <outcome>
Want end-to-end delivery?                /deliver-ticket <outcome or ticket>
Want manual stage-by-stage control?      /ticket → /spec → /plan → /implement-plan
Ticket delivered and needs a draft PR?   /publish-ticket
Need to rebuild operating state?         /reset-workspace
```

## Reusable source traceability

The installed reusable skills originate from `kofiarhin/ai-dev-workspace` and are vendored under `.claude/skills/`:

- `/workspace-health` — reusable source PR #7;
- `/sync-project` — reusable source PR #8;
- `/publish-ticket` — reusable source PR #9;
- bounded shared-understanding ticket intake across `/ticket`, `/spec`, `/plan`, and `/deliver-ticket` — reusable source PR #11.

The PR #11 vendored contracts are copied from `ai-dev-workspace/main` after merge commit `48747c4bd26746a966546cbe42d715d5a531ab09`.

## ThriftChef-specific precedence

All skills remain subordinate to `AGENTS.md`, including retailer/data safety rules, explicit approval boundaries, verification requirements, and human-owned production decisions. A reusable skill must stop rather than weaken a stricter ThriftChef rule.
