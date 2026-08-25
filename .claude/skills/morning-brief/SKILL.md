---
name: morning-brief
description: Produce a concise read-only operator brief by reconciling project context, repository and GitHub state, roadmap priorities, verification evidence, risks, and available customer signals, then recommend one next ticket outcome without making changes.
---

# Morning Brief

Produce a read-only operating brief for the current project. The purpose is orientation and prioritization, not execution.

Do not edit files, create tickets, modify GitHub state, run persistent jobs, change data, install dependencies, commit, push, merge, deploy, or activate routines.

## Context to read

Always read when present:

1. `AGENTS.md`.
2. `CLAUDE.md`.
3. `roadmap.md`.
4. `review.md`.
5. `context/current-state.md`.
6. `context/lessons.md`.

Read when relevant:

- `context/product.md`;
- `context/decisions.md`;
- `context/architecture.md`;
- recent files under `customers/`;
- active files under `tickets/`, `spec/`, and `plans/`.

Project-specific instructions and repository evidence override generic assumptions.

## Repository and GitHub inspection

Inspect the current repository state and recent history available in the environment. When GitHub access is available, inspect relevant recent commits, recently merged pull requests, open pull requests, open issues, and available verification or check results.

Prefer observable repository and GitHub evidence over stale planning statements. If external GitHub state cannot be inspected, say so clearly and do not infer it.

## Application routes and AI commands

Slash-prefixed names may refer to product/application routes, AI workspace commands, or both. Do not treat the leading `/` as enough evidence to decide which one is meant.

When a brief mentions a slash-prefixed name and there is any realistic ambiguity, identify its role explicitly. Prefer wording such as:

- `Application route /plan` runs the product's planner experience.
- `AI command /plan` creates an implementation plan from an approved specification.
- `Application route /setup` is unchanged.
- `AI command /setup-workspace` initializes the operating workspace.

Inspect application routing and installed workspace skills when necessary to resolve the distinction. If the same token is used by both the application and the AI workspace, keep both meanings separate and mention only the one supported by the statement being made.

Never write an ambiguous statement such as `/plan runs the ten-step wizard` when `/plan` is also an installed AI command. Use an explicit role label instead.

## Responsibilities

Reconcile what project documents claim with what current evidence supports.

Explicitly flag truth drift such as:

- documentation describing work as unmerged when it is merged;
- roadmap items marked incomplete when completion evidence exists;
- plans or tickets being mistaken for implementation evidence;
- verification claims that belong to an older checkpoint;
- deployed or production claims without current evidence.

Distinguish proposed, specified, planned, in-progress, implemented, verified, committed, pushed, merged, deployed, and released states when relevant.

Identify the single highest-leverage next outcome. Prefer, in order:

1. roadmap blockers;
2. material verification gaps;
3. customer-backed problems;
4. the smallest evidence-backed product or engineering improvement.

Do not invent work merely to fill the brief. If no useful next ticket is supported, say so.

## Customer evidence

Use only real customer notes, interviews, feedback, support records, or equivalent evidence present in the project. Surface the strongest recent signal when it materially affects priority. If there is no customer evidence, state that explicitly.

## Recommended ticket handoff

End with at most one recommended ticket outcome that can be passed to `/ticket`.

The recommendation must include:

- **Outcome:** what should change or be established;
- **Why now:** why it is the highest-leverage next move;
- **Evidence:** the repository, roadmap, verification, GitHub, or customer evidence supporting it;
- **Expected finish line:** the observable condition that would make the ticket complete;
- **Suggested command:** `/ticket <concise outcome>`.

Do not create the ticket automatically. `/ticket` must independently re-read current evidence before creating an artifact.

## Output

Keep the brief under 500 words unless the user explicitly requests more detail.

Use this structure:

```text
# Morning Brief — YYYY-MM-DD

## Since last session

## Current state

## Truth drift

## Verification debt

## Today's focus

## Risks

## Customer signal

## Recommended next ticket

## Decision needed
```

Use `None detected`, `No current evidence`, or `None` rather than inventing content when a section has no supported finding.

## Rules

- Read-only.
- No repository writes.
- No GitHub writes.
- No automatic ticket creation.
- No invented customer feedback.
- No production or deployment claims without current evidence.
- Label application routes and AI commands explicitly when slash-prefixed names could be confused.
- Recommend no more than one next ticket outcome.
- A morning brief is a recommendation, not approval to execute consequential work.
