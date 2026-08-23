# Routines

No ThriftChef routine is active by default. Defining a routine here does not authorize scheduling or execution.

## Required routine contract

Every proposed routine must state:

- trigger or schedule;
- inputs and source-of-truth files;
- exact output and destination;
- read and write permissions;
- limits, timeout, and cancellation behaviour;
- failure and retry behaviour;
- notification conditions;
- human-review and activation owner.

## Safe starting candidates

### Read-only branch readiness brief

- Trigger: manually or on an approved schedule.
- Inputs: `roadmap.md`, `context/current-state.md`, open GitHub issues/PRs, and recorded check results.
- Output: one concise readiness summary with blockers and the next smallest ticket.
- Permissions: read-only; no comments, labels, branches, commits, merges, or deployments.
- Failure: report unavailable inputs and produce no readiness claim.

### Weekly catalogue-health review

- Trigger: manually or on an approved weekly schedule.
- Inputs: approved non-production crawl summaries and adapter test results.
- Output: trend summary for extraction failures, selector drift, 403s, missing prices, and coverage.
- Permissions: read-only; never starts crawls or mutates catalogue data.
- Failure: mark missing or stale evidence rather than inferring health.

### Pull-request review

- Trigger: an approved GitHub pull-request event.
- Inputs: ticket, diff, `roadmap.md`, `review.md`, and check results.
- Output: `Must fix`, `Should fix`, and `Okay to ship` findings plus human-review status.
- Permissions: read-only unless separate approval allows posting comments; never approves, merges, or deploys.
- Failure: leave no readiness claim when the diff or checks cannot be inspected.

## Activation boundary

Scheduling, enabling connectors, posting externally, or granting write permissions requires a separate approved ticket. Start with read-only behaviour and validate outputs before adding any automation.

