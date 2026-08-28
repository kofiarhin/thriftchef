# ThriftChef AI Delivery Operating System

This is the practical operator guide for using ThriftChef's repository-local AI delivery workspace.

`AGENTS.md` remains the canonical safety and project-policy source. This guide explains which command to use, in what order, where the shared-understanding Grill runs, and where approvals occur.

## Daily workflow

```text
/workspace-health
      ↓
/morning-brief
      ↓
/ticket or /deliver-ticket freeform intake
      ↓
bounded shared-understanding Grill when needed
      ↓
status: ready with no material intake questions
      ↓
/spec
      ↓
/plan
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
| Define a request carefully before technical design | `/ticket <outcome>` |
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

It is strictly read-only and compares repository/Git state, available GitHub evidence, `context/current-state.md`, `roadmap.md`, lifecycle-aware tickets, ticket → spec → plan links, verification evidence, and `.claude/workspace-manifest.json`.

Possible overall results:

```text
HEALTHY
DEGRADED
BLOCKED
UNKNOWN
```

If the result is `DEGRADED` because durable project truth is stale, use `/sync-project` before starting new work when the drift could affect prioritization or execution.

## 2. Reconcile stale project truth

When repository/Git/GitHub/verification reality changed outside the normal delivery flow, run:

```text
/sync-project
```

Before writing, the command must show the exact proposed documentation/lifecycle changes. Unless a stricter ThriftChef rule applies, approve only with:

```text
Approve sync
```

It may update supported project-truth files and evidence-backed ticket lifecycle fields. It does not edit runtime code, dependencies, lockfiles, specs/plans, Git/GitHub state, production catalogue data, deployments, or releases.

## 3. Pick the next outcome

Run:

```text
/morning-brief
```

The brief reconciles current evidence and identifies at most one highest-leverage outcome. It may reuse an equivalent active ticket, create at most one safely scoped `status: ready` ticket, or create no ticket if a material decision is unresolved or evidence is insufficient. It never implements the outcome.

When morning-brief delegates ticket creation, the same `/ticket` readiness invariant applies: a new `status: ready` ticket must not carry a known material intake question.

## 4. Shared-understanding ticket intake

Use `/ticket` when you want to define **what should change and why** before technical design:

```text
/ticket Add shopping-list CSV export
```

Before writing a new ready ticket, `/ticket` inspects repository and project evidence and separates facts from user-owned decisions.

### Facts are researched

The agent should inspect code, tests, routes, configuration, project context, active tickets/specs/plans, and other available evidence rather than asking you for facts it can establish itself.

### Material decisions use the Grill

When a decision remains that can materially change scope, acceptance criteria, environment/data, security/permissions, architecture constraints, dependencies/migrations, or verification requirements, `/ticket` asks exactly one question at a time using:

```text
Question
<one material question>

Recommended answer
<one concrete recommendation>

Why
<why this recommendation best fits the evidence, goal, risk, and trade-offs>
```

The Grill is intentionally bounded:

- zero questions when the request is already clear;
- one question should be common;
- two for moderately ambiguous work;
- three is the default maximum;
- stop early as soon as shared understanding is sufficient;
- do not ask about naming preferences, ordinary implementation style, file placement, or technical choices that `/spec` can safely determine.

After each answer, `/ticket` recomputes what remains materially ambiguous. It does not manufacture questions merely to reach the limit.

### Ready means ready for specification

A new ticket may use:

```yaml
status: ready
```

only when no known material user-owned intake decision remains.

Ready tickets record concise confirmed decisions under:

```text
## Shared Understanding
```

and use:

```text
## Open Questions
None
```

for material intake decisions.

If the default three-question cap is exhausted while a material decision still prevents safe specification, the workflow must not guess. It either stops and reports the blocker or records a `status: blocked` ticket with the exact unresolved decision.

This prevents the old failure mode:

```text
ticket created as ready
      ↓
/spec discovers a known product/scope question
```

The intended flow is:

```text
repository inspection
      ↓
minimum necessary Grill questions
      ↓
shared understanding
      ↓
ready ticket
      ↓
/spec
```

## 5. Create the technical specification

For manual stage-by-stage control:

```text
/spec tickets/NNN-outcome.md
```

A current-contract ready ticket should already contain sufficient shared understanding. `/spec` defines **how** the requested behaviour fits the current repository.

It should resolve repository-answerable technical choices itself rather than asking you to choose file names or ordinary implementation patterns.

A specification is ready for `/plan` only when:

```text
Open Technical Questions: None
```

If specification discovers a genuinely new user-owned material decision, it stops and returns that decision to `/ticket` shared-understanding intake instead of silently redesigning scope. If the problem is technical and can be resolved from repository evidence, `/spec` should make the smallest justified proposal.

## 6. Create the implementation plan

Run:

```text
/plan spec/NNN-outcome.md
```

The plan defines **implementation order**, not new product decisions or a new technical design.

If planning reveals:

- a missing/conflicting user decision → return to `/ticket`;
- a material technical-contract problem → return to `/spec`;
- a repository fact that can be looked up → inspect the repository rather than asking the user.

A successful plan must not carry a known decision that blocks `/implement-plan`.

## 7. Deliver work end to end

For ordinary work, `/deliver-ticket` remains the recommended orchestration command.

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

Known freeform task:

```text
/deliver-ticket Add CSV export for shopping lists
```

Freeform `/deliver-ticket` intake applies the complete `/ticket` contract, including the bounded shared-understanding Grill, before specification. It must not move into `/spec` until the resulting ticket is genuinely ready.

The orchestrated path is:

```text
ticket intake + Grill when needed
  ↓
spec
  ↓
TDD plan
  ↓
consolidated execution contract
```

At the execution-contract stage, no runtime/application changes are authorized yet.

Review the contract for exact goal/scope, exclusions, technical approach, affected areas, TDD slices, verification plan, dependency/migration/auth/security/data checkpoints, risks/assumptions, human-review items, and excluded external actions.

When correct, approve runtime execution with:

```text
Approve plan
```

Approval is scoped to that exact contract. Material scope, architecture, dependency, migration, authentication, payments, permissions, security, destructive behaviour, deployment, acceptance, or verification changes invalidate it.

## 8. TDD execution

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

## 9. Understand `delivered`

A ticket reaches `status: delivered` only when evidence supports implemented acceptance criteria, required verification, final review, project-truth synchronization, and ticket delivery evidence.

These states remain intentionally different:

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

A delivered ticket may still be uncommitted and local. A merged PR does not automatically prove delivery if required acceptance/verification evidence is missing.

## 10. Publish delivered work

Only after the source ticket is already `status: delivered`, run:

```text
/publish-ticket tickets/004-something.md
```

It validates the current non-main branch, base branch, exact diff/commit range, unrelated changes, unexpected secret/protected files, existing remote/PR state, and recorded delivery evidence.

Approve the exact publication contract with:

```text
Approve publish
```

After approval it may create one scoped commit when required, push the approved branch normally without force, and create exactly one draft PR.

It never force-pushes, rewrites history, merges, deploys/releases, activates retailers, mutates production catalogue data, changes `CATALOGUE_READ_SOURCE`, or deletes branches.

## 11. Review and merge

The draft PR is a human-review boundary. Review findings should be classified as:

```text
Must fix
Should fix
Okay to ship
```

Merging remains separate from `/publish-ticket` and requires explicit authorization under `AGENTS.md`.

After an approved merge, run `/workspace-health` or `/sync-project` if current-state/roadmap/ticket evidence does not yet reflect the observed merge/check state.

## Manual delivery mode

The manual path is now especially useful when you want to inspect each contract boundary:

```text
/ticket <outcome>
      ↓
shared-understanding Grill when needed
      ↓
/spec tickets/NNN-outcome.md
      ↓
/plan spec/NNN-outcome.md
      ↓
/implement-plan plans/NNN-outcome.md
```

Use it when product scope needs review before technical design, architecture needs review before planning, a plan needs review by another person, different agents/people own separate stages, or you want to validate the operating system one stage at a time.

For ordinary scoped work, `/deliver-ticket` is still the preferred default.

## Ticket lifecycle

| State | Meaning |
| --- | --- |
| `ready` | Scoped, unblocked, and no known material intake question remains |
| `awaiting-approval` | Spec/plan and execution contract are ready; approval pending |
| `in-progress` | Approved runtime implementation has started |
| `verifying` | Implementation is complete enough for final verification/review |
| `delivered` | Acceptance, verification/review, project truth, and delivery evidence complete |
| `blocked` | A material decision/prerequisite prevents progress |
| `failed-verification` | An observed required verification failure remains unresolved |
| `superseded` | Another identified ticket intentionally replaces this one |

`delivered` and `superseded` are terminal historical states. A regression after delivery becomes a new ticket referencing the original.

## Common recipes

Start the day:

```text
/workspace-health
/morning-brief
/deliver-ticket
```

Manual feature flow:

```text
/ticket <outcome>
/spec tickets/NNN-outcome.md
/plan spec/NNN-outcome.md
/implement-plan plans/NNN-outcome.md
```

Known request, fully orchestrated:

```text
/deliver-ticket Add meal-plan CSV export
Approve plan
```

Publish completed work:

```text
/publish-ticket
Approve publish
```

Return after several days away:

```text
/workspace-health
/sync-project        # when evidence shows durable project truth is stale
/morning-brief
```

After a manual/outside merge:

```text
/workspace-health
/sync-project
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
/ticket              reach shared understanding, then define WHAT + WHY
/spec                define HOW from a ready ticket
/plan                define implementation order from a plan-ready spec
/implement-plan      execute approved implementation slices
/deliver-ticket      orchestrate bounded intake through delivery
/publish-ticket      publish delivered work to a draft PR
/reset-workspace     reset manifest-owned operating state
/setup-workspace     initialize/reconcile the operating layer
```

For exact permissions and precedence, read `AGENTS.md`. For the installed command registry, read `.claude/README.md`.
