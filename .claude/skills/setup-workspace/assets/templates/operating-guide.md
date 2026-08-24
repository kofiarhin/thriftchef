# Project Operating Guide

## Product

Summarize the product, customer, problem, promise, and current goal from supported project evidence.

## Working rules

- Read the product source, roadmap, review standard, relevant context, lessons, and current repository evidence before changing work.
- Use the delivery flow: `/ticket` → `/spec` → `/plan` → `/implement-plan`.
- Keep one ticket to one outcome and one reviewable change.
- Keep ticket, spec, plan, and implementation responsibilities separate.
- Preserve unrelated work and existing project conventions.
- Distinguish proposed, specified, planned, in-progress, implemented, verified, merged, deployed, and released states when relevant.
- Prefer TDD for implementation: RED → GREEN → REFACTOR → VERIFY.
- Never treat a plan as implementation evidence.
- Add lessons only when they are repository-specific and supported by observed work.

## Permissions

Define safe/read-only, approval-required, and human-owned actions for this project. Material scope, dependency, migration, authentication, payment, permission, security, deployment, or destructive changes require the appropriate human decision.

## Document alignment

After verified implementation, update only documents whose truth actually changed: current state, architecture, confirmed decisions, roadmap status, and concise lessons.

## Completion

Define the evidence required before work may be described as implemented, verified, merged, deployed, or released.
