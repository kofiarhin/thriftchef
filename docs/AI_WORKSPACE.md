# ThriftChef AI Delivery Operating System

This is the practical operator guide for using ThriftChef's repository-local AI delivery workspace.

`AGENTS.md` remains the canonical safety and project-policy source. This guide explains which command to use, in what order, and where approvals occur.

## Daily workflow

```text
/workspace-health
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
      ↓
/sync-project          when project memory needs reconciliation
```

Use `/sync-project` earlier whenever `/workspace-health` finds stale durable project truth that could affect prioritization or execution.

## Command selector

| Need | Command |
| --- | --- |
| Check whether docs/lifecycle match repository reality | `/workspace-health` |
| Repair stale project memory from current evidence | `/sync-project` |
| Decide the single highest-leverage next outcome | `/morning-brief` |
| Deliver the next eligible queued ticket | `/deliver-ticket` |
| Deliver a specific ticket | `/deliver-ticket 004` |
| Deliver a known freeform task | `/deliver-ticket Add saved meals` |
| Stop between ticket/spec/plan/implementation stages | `/ticket` → `/spec` → `/plan` → `/implement-plan` |
| Publish an already-delivered ticket to a draft PR | `/publish-ticket` |
| Rebuild manifest-owned operating state | `/reset-workspace` |

## 1. Audit first when state may be stale

Run:

```text
/workspace-health
```

It is strictly read-only and compares:

- repository and Git state;
- available GitHub branch/PR/commit/check evidence;
- `context/current-state.md`;
- `roadmap.md`;
- lifecycle-aware tickets;
- ticket → spec → plan links;
- verification evidence;
- `.claude/workspace-manifest.json`.

Possible overall results:

```text
HEALTHY
DEGRADED
BLOCKED
UNKNOWN
```

Examples of issues it should find:

- a document says a PR is open but GitHub says merged;
- a ticket says delivered but required checks are missing;
- an interrupted approval is stale after repository changes;
- a spec/plan points at architecture that materially changed;
- project docs claim deployment/release state without evidence.

The command never fixes findings.

## 2. Reconcile stale project truth

When evidence changed outside the normal delivery flow, run:

```text
/sync-project
```

Typical cases:

- a PR was merged manually;
- a verification check completed later;
- code changed outside `/deliver-ticket`;
- roadmap/current-state is stale;
- ticket lifecycle metadata needs evidence-backed correction.

Before writing anything, the command must show the exact proposed documentation/lifecycle changes. Unless a stricter ThriftChef rule applies, approve only with:

```text
Approve sync
```

It may update supported project-truth files such as:

```text
context/current-state.md
context/architecture.md        only if implemented architecture changed
context/decisions.md           only for explicit confirmed decisions
context/lessons.md             only for observed reusable lessons
roadmap.md
lifecycle/evidence fields in tickets
```

It does not edit runtime code, dependencies, lockfiles, specs/plans, Git/GitHub state, production catalogue data, deployments, or releases.

## 3. Pick the next outcome

Run:

```text
/morning-brief
```

The brief reconciles current evidence and identifies at most one highest-leverage outcome.

It may:

- reuse/reference an equivalent active ticket;
- create one evidence-backed `status: ready` ticket;
- create no ticket if a material decision is unresolved or evidence is insufficient.

It never implements the outcome.

## 4. Deliver work end to end

Default:

```text
/deliver-ticket
```

Specific ticket:

```text
/deliver-ticket tickets/004-something.md
/deliver-ticket 004
/deliver-ticket 004-something
```

Known task without a ticket:

```text
/deliver-ticket Add CSV export for shopping lists
```

The command coordinates:

```text
ticket
  ↓
spec
  ↓
TDD plan
  ↓
consolidated execution contract
```

At the execution-contract stage, no runtime/application changes are authorized yet.

Review the contract for:

- exact goal and scope;
- exclusions;
- technical approach;
- files/areas likely to change;
- TDD slices;
- verification plan;
- migrations/dependencies/auth/security/data checkpoints;
- risks and assumptions;
- human-review items;
- explicitly excluded external actions.

When the plan is correct, approve with:

```text
Approve plan
```

Approval is scoped to that exact contract. Material scope, architecture, dependency, migration, authentication, payments, permissions, security, destructive behaviour, deployment, acceptance, or verification changes invalidate it.

## 5. TDD execution

Testable work defaults to:

```text
RED
smallest meaningful failing test
      ↓
GREEN
minimum implementation to pass
      ↓
REFACTOR
clean without expanding behaviour
      ↓
VERIFY
relevant regressions + type/build/browser checks
```

ThriftChef's common verification commands include:

```bash
npm run typecheck
npm run test:unit
npm run test:client
npm run build
```

For user-facing work, browser verification should also inspect desktop/mobile behaviour, console errors, network errors, and relevant loading/empty/error/success/accessibility states.

Checks must be reported as:

```text
Passed
Failed
Not run
```

Do not claim a check succeeded unless it was executed and inspected.

## 6. Understand `delivered`

A ticket reaches `status: delivered` only when evidence supports:

- implemented acceptance criteria;
- required verification;
- final review;
- project-truth synchronization;
- ticket delivery evidence.

These states are intentionally different:

```text
implemented
verified
delivered
committed
pushed
merged
deployed
released
```

A delivered ticket may still be uncommitted and only local.

A merged PR does not automatically prove delivery if required acceptance/verification evidence is missing.

## 7. Publish delivered work

Only after the source ticket is already `status: delivered`, run:

```text
/publish-ticket tickets/004-something.md
```

Before Git/GitHub writes, it validates:

- current non-main branch;
- base branch;
- exact diff or commit range;
- unrelated changes;
- unexpected secret/protected files;
- existing remote state;
- existing PRs;
- recorded delivery evidence.

It then presents a publish contract including the exact commit/push/draft-PR actions.

Approve with:

```text
Approve publish
```

After approval it may:

1. create one scoped commit when required;
2. push the approved branch normally without force;
3. create exactly one draft PR.

It never:

- force-pushes;
- rebases/amends or rewrites history as part of the default workflow;
- merges;
- deploys/releases;
- activates retailers;
- mutates production catalogue data;
- changes `CATALOGUE_READ_SOURCE`;
- deletes branches.

## 8. Review and merge

The draft PR is a human-review boundary.

Review findings should be classified:

```text
Must fix
Should fix
Okay to ship
```

Merging remains separate from `/publish-ticket` and requires explicit authorization under `AGENTS.md`.

After an approved merge, run `/workspace-health` or `/sync-project` if current-state/roadmap/ticket evidence does not yet reflect the observed merge/check state.

## Manual delivery mode

Use the lower-level chain when you want deliberate stops between stages:

```text
/ticket <outcome>
/spec tickets/NNN-outcome.md
/plan spec/NNN-outcome.md
/implement-plan plans/NNN-outcome.md
```

This is useful when:

- product scope needs review before technical design;
- architecture needs review before planning;
- a plan needs review by another person;
- separate agents/people own separate stages;
- you want to inspect/edit artifacts before continuing.

For ordinary scoped work, `/deliver-ticket` is the preferred default.

## Ticket lifecycle

Canonical states:

| State | Meaning |
| --- | --- |
| `ready` | Scoped and waiting for delivery |
| `awaiting-approval` | Spec/plan and execution contract are ready; approval pending |
| `in-progress` | Approved runtime implementation has started |
| `verifying` | Implementation is complete enough for final verification/review |
| `delivered` | Acceptance, verification/review, project truth, and delivery evidence complete |
| `blocked` | A material decision/prerequisite prevents progress |
| `failed-verification` | An observed required verification failure remains unresolved |
| `superseded` | Another identified ticket intentionally replaces this one |

`delivered` and `superseded` are terminal historical states. A regression after delivery becomes a new ticket referencing the original.

## Common recipes

### Start the day

```text
/workspace-health
/morning-brief
/deliver-ticket
```

### Implement a known request

```text
/deliver-ticket Add meal-plan CSV export
Approve plan
```

### Publish completed work

```text
/publish-ticket
Approve publish
```

### Return after several days away

```text
/workspace-health
/sync-project        # when evidence shows durable project truth is stale
/morning-brief
```

### After a manual/outside merge

```text
/workspace-health
/sync-project
```

### Investigate without changing anything

```text
/workspace-health
```

## ThriftChef-specific hard boundaries

The reusable workspace never overrides `AGENTS.md`.

In particular:

- retailer/store isolation must remain intact;
- deterministic planner behaviour remains authoritative unless an explicit product/architecture decision changes it;
- catalogue crawling must use Crawlee and respect retailer access/authorization restrictions;
- bounded/incomplete/failed crawls must not enable destructive reconciliation;
- production deployment is human-owned unless explicitly authorized;
- Tesco activation, reconciliation, production read-source changes, and production catalogue writes remain separately gated;
- secrets stay protected and must not be surfaced into tickets/specs/plans/logs.

## Command summary

```text
/workspace-health    inspect truth, no writes
/sync-project        repair durable project truth after approval
/morning-brief       choose/queue one next outcome
/ticket              define WHAT + WHY
/spec                define HOW
/plan                define implementation order
/implement-plan      execute approved implementation slices
/deliver-ticket      orchestrate delivery end to end
/publish-ticket      publish delivered work to a draft PR
/reset-workspace     reset manifest-owned operating state
/setup-workspace     initialize/reconcile the operating layer
```

For exact permissions and precedence, read `AGENTS.md`. For the installed command registry, read `.claude/README.md`.
