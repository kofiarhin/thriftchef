# ThriftChef Tickets

Tickets define **what should change and why** before technical design begins.

Use `/ticket` for one roadmap outcome, bug, product request, or review finding at a time. Each ticket should contain one visible finish line, repository evidence, included scope, explicit exclusions, acceptance criteria, constraints, dependencies, verification expectations, and unresolved material questions.

Do not design endpoints, data models, component trees, or implementation order in the ticket unless those details are already established repository facts or explicit requirements. Technical solution details belong in `spec/`.

Use a stable basename that downstream artifacts can reuse, for example:

```text
tickets/001-exact-head-verification.md
spec/001-exact-head-verification.md
plans/001-exact-head-verification.md
```
