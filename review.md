# ThriftChef Review Standard

Use this checklist before calling a ticket complete or ready for human review.

## Product fit

- Does the change directly satisfy the approved ticket and current roadmap?
- Does it help UK households create an affordable, coherent, retailer-scoped cooking plan?
- Are exclusions preserved, with no speculative scope added?
- Are production and development behaviour described accurately?

## Retailer and catalogue integrity

- Are product, offer, plan, recipe, and shopping-list operations scoped to the selected retailer and store/catalogue?
- Can Aldi and Tesco records mix anywhere in selection, pricing, regeneration, replacement, recipes, or shopping lists?
- Is the normal shelf price used, with Clubcard and conditional promotions excluded unless separately approved?
- Are product IDs, integer-pence prices, availability evidence, categories, and canonical URLs validated?
- Do bounded or incomplete crawls remain unable to reconcile or retire missing products?
- Are access restrictions handled transparently without bypass attempts?

## User experience

- Can a fresh visitor understand the next action?
- Is the selected retailer named consistently across planning, recipes, and shopping lists?
- Does regeneration preserve retailer and constraints while varying the generation seed?
- Does Start new plan clear the current plan and require retailer selection again?
- Are loading, empty, validation, catalogue-unavailable, constraint-conflict, and success states clear?
- Does the flow work at mobile and desktop widths with keyboard-accessible controls and visible focus?

## Engineering quality

- Is the change the smallest complete slice?
- Does it follow existing architecture and avoid unnecessary dependencies or abstractions?
- Are API and catalogue concerns kept out of presentation components?
- Are security, secrets, origin restrictions, and environment boundaries preserved?
- Are regression tests focused on observable behaviour and failure modes?
- Does the diff contain surprising, unrelated, generated, or secret material?
- For testable implementation work, does the evidence show RED → GREEN → REFACTOR → VERIFY rather than tests being added only after the implementation?

## Delivery traceability and document alignment

- Does the change trace back to one source ticket, approved spec, and implementation plan when those artifacts are required?
- Does the implementation remain inside the approved ticket/spec/plan scope?
- Is a plan being treated only as intended work rather than proof that code exists?
- Does `context/current-state.md` reflect only observed implementation and verification evidence?
- Was `context/architecture.md` changed only if architecture truth changed?
- Was `context/decisions.md` changed only for confirmed decisions?
- Was `roadmap.md` advanced only when its completion evidence was satisfied?
- Are additions to `context/lessons.md` concise, ThriftChef-specific, and supported by actual implementation, testing, debugging, or review evidence?

## Evidence

- Were relevant typechecks, tests, builds, and browser flows actually run and inspected?
- Are commands and results recorded without relying on older checkpoint evidence?
- Are console and network failures reported?
- For catalogue work, is the target database identified safely and are crawl/database results recorded without exposing secrets?
- Are unverified areas and human-review steps explicit?

## Finding classes

### Must fix

Blocks the ticket or creates material correctness, retailer-isolation, pricing, security, data, accessibility, or production risk. Failed required verification and unsupported completion claims are also `Must fix`.

### Should fix

Important quality, maintainability, clarity, or coverage issue that does not block the approved outcome.

### Okay to ship

The approved outcome is implemented, relevant checks pass, the user flow is inspected where applicable, the diff is scoped, project documents are aligned with verified reality, and remaining limitations are disclosed. This classification is not permission to merge or deploy.
