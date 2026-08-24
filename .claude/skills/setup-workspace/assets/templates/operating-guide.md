# Project Operating Guide

## Product

Summarize the product, customer, problem, promise, and current goal from supported project evidence.

## Operator workflow

Use `/morning-brief` for read-only project orientation before deciding what deserves attention.

The morning brief may inspect current project context, repository and available GitHub state, roadmap priorities, verification evidence, and real customer signals. It may identify truth drift, verification debt, risks, and recommend exactly one next ticket outcome.

The morning brief must not edit files, modify GitHub state, create tickets automatically, run persistent jobs, change data, install dependencies, commit, push, merge, deploy, or activate routines. Its recommendation is not approval to execute consequential work.

## Software delivery workflow

Use `/ticket` → `/spec` → `/plan` → `/implement-plan` after a human selects or refines the next outcome.

- `/ticket` defines what should change and why.
- `/spec` defines the approved technical contract.
- `/plan` defines the implementation order.
- `/implement-plan` executes the approved plan and verifies the result.

## Working rules

- Read the product source, roadmap, review standard, relevant context, lessons, and current repository evidence before changing work.
- Keep one ticket to one outcome and one reviewable change.
- Keep morning brief, ticket, spec, plan, and implementation responsibilities separate.
- Preserve unrelated work and existing project conventions.
- Distinguish proposed, specified, planned, in-progress, implemented, verified, committed, pushed, merged, deployed, and released states when relevant.
- Prefer TDD for implementation: RED → GREEN → REFACTOR → VERIFY.
- Never treat a morning brief, ticket, specification, or plan as implementation evidence.
- Add lessons only when they are repository-specific and supported by observed work.

## Permissions

Define safe/read-only, approval-required, and human-owned actions for this project. Material scope, dependency, migration, authentication, payment, permission, security, deployment, or destructive changes require the appropriate human decision.

## Document alignment

After verified implementation, update only documents whose truth actually changed: current state, architecture, confirmed decisions, roadmap status, and concise lessons.

## Completion

Define the evidence required before work may be described as implemented, verified, merged, deployed, or released.
