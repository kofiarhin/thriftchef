# ThriftChef Lessons

Use this file as lightweight persistent project memory. Keep only concise lessons supported by observed ThriftChef implementation, testing, debugging, or review evidence.

## Verification

- Verification belongs to an exact code checkpoint. The routed-shell handoff had a full passing suite immediately before a final comment-only `App.tsx` edit, so those results remained useful evidence but did not become exact-head verification for the later commit.
- Browser coverage is flow-specific. The current browser harness proves the routed shell and Aldi journey but does not prove the Tesco journey because Tesco is not seeded or selected by that fixture.

## Retailer and catalogue boundaries

- Retailer/catalogue scope must survive generation, regeneration, meal replacement, recipes, and shopping lists; cross-retailer mixing is a release blocker.
- Bounded, incomplete, failed, cancelled, interrupted, or otherwise untrusted crawls must not reconcile missing products.
- Tesco development selectability is not evidence of production activation, deployment approval, or authorization to broaden catalogue access.

## Client architecture

- Keep query, household-profile, and active-plan providers outside the router when route navigation must preserve those lifetimes. The routed-shell implementation relies on that boundary to keep the active plan and reusable state across pages.

Refine an existing lesson instead of duplicating it. Remove or change a lesson only when current repository evidence clearly supersedes it.
