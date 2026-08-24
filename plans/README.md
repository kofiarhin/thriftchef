# ThriftChef Implementation Plans

Plans define **the ordered execution of an approved specification**. Use `/plan` after the source ticket and technical specification are approved.

Prefer small vertical slices. Every testable slice should specify:

```text
RED → GREEN → REFACTOR → VERIFY
```

RED defines the smallest failing behavioural test and expected failure reason. GREEN defines only the minimum implementation needed to pass it. REFACTOR allows cleanup without new behaviour. VERIFY defines targeted regression evidence before the next slice.

A plan does not redesign its source specification and does not prove implementation. If current repository evidence materially invalidates the spec, return to `/spec` rather than silently adapting the plan.

`thriftchef-full-implementation-plan.md` is retained here as historical multi-retailer planning context from the earlier workflow. New work should use focused plans tied to one source ticket/spec and the current roadmap.
