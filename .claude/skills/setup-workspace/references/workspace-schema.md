# Workspace Schema

Create the smallest applicable form of this structure. Reuse equivalent existing files or directories.

| Path | Responsibility |
| --- | --- |
| `AGENTS.md` | Canonical operating guide: working style, permissions, delivery flow, verification, learning, and reporting |
| `CLAUDE.md` | Thin compatibility entry point that directs Claude-compatible tools to the canonical operating guide |
| `roadmap.md` | Current goal, priorities, exclusions, ordered outcomes, lifecycle status, and definition of done |
| `review.md` | Product, UX, code, security, accessibility, evidence, scope, and document-alignment review standard |
| `context/product.md` | Product, customer, problem, promise, scope, journeys, and success criteria |
| `context/architecture.md` | Intended architecture plus clearly separated implemented and verified state |
| `context/decisions.md` | Confirmed decisions and unresolved questions; never fabricated decisions |
| `context/current-state.md` | Proposed, specified, planned, in-progress, implemented, verified, released, and unresolved status where applicable |
| `context/lessons.md` | Concise repository-specific lessons learned from observed implementation/review evidence; never generic advice |
| `customers/README.md` | Format and rules for future real customer evidence; no invented notes |
| `tickets/README.md` | Tickets define what should change and why; one ticket, one outcome, one visible finish line |
| `spec/README.md` | Specs define the technical contract for an approved ticket |
| `plans/README.md` | Plans define ordered TDD implementation slices for an approved spec |
| `demos/core-flow.md` | PRD-derived buyer/user walkthrough and expected outcome |
| `demos/browser-review-checklist.md` | Desktop/mobile states, console/network, accessibility, and human review checks |
| `routines/README.md` | Safe routine format and activation boundary; define no active schedule |

Use the templates in `assets/templates/` as content guides, not text to copy blindly. Replace every placeholder with supported project facts or `Unresolved`.

Do not create empty `interviews/`, `feedback/`, `evidence/`, or similar directories. Create them later when real content exists.
