# Product and Engineering Decisions

## Confirmed decisions

| Decision | Status | Consequence |
| --- | --- | --- |
| Planning is deterministic and bounded | Confirmed | No model/API call is required in the request path. |
| Users remain anonymous for the MVP | Confirmed | Household preferences and checklist state may be local; plans have bounded anonymous persistence. |
| Retailer scope is end-to-end | Confirmed | Catalogue, planning, regeneration, replacement, recipe, and shopping-list flows cannot mix retailers. |
| Production remains Aldi-only | Confirmed | Tesco development work does not change live availability until separately merged, deployed, and activated. |
| Tesco development uses a public national catalogue | Confirmed for the development branch | The branch flow uses direct Aldi/Tesco choice with no postcode or store-selection UI. |
| Tesco may be seeded `active` on the development branch for branch-only verification | Confirmed for development | Selectability in development is not evidence of production activation or authorization. |
| Normal shelf prices drive totals | Confirmed | Clubcard and conditional promotional prices are excluded. |
| Bounded crawls never reconcile | Confirmed | Missing records are not retired from incomplete evidence. |
| Legacy catalogue reads remain active | Confirmed | `productOffers` must be backfilled and compared before a switch. |
| One routed shell owns shared application chrome | Confirmed | `AppShell` owns the header, route navigation, mobile disclosure, and footer across all routes. |
| Each routed page owns its own `main` and top-level heading | Confirmed | The shell does not add a second `main`; pages remain valid when rendered independently. |
| Planner navigation is route-based, not hash-mode based | Confirmed | `/plan` is the planning destination; `#planner`, planner enter/exit state, and landing-page anchor navigation are retired. |
| Query, household-profile, and plan providers outlive route navigation | Confirmed | Providers remain outside the router so navigation does not recreate query cache, profile state, or the active plan. |
| Software delivery uses ticket → spec → plan → implementation | Confirmed | Product intent, technical design, execution order, and code changes remain separate reviewable artifacts under `tickets/`, `spec/`, and `plans/`. |
| Testable implementation defaults to RED → GREEN → REFACTOR → VERIFY | Confirmed | `/plan` defines test-first slices and `/implement-plan` must prove the intended RED failure before the minimum GREEN implementation. |
| Repository-specific delivery lessons live in `context/lessons.md` | Confirmed | Future work may reuse observed ThriftChef lessons without introducing a separate memory service or treating generic advice as project truth. |
| Production deployment and merge are human-owned | Confirmed | Each requires separate explicit approval. |

## Current implementation decision

On `docs/thriftchef-ai-workspace`, users choose Aldi or Tesco directly against the branch's configured catalogue scopes. Tesco is represented by a national public catalogue rather than a postcode-selected store. Regeneration retains the selected retailer and constraints while changing the generation seed. Start new plan clears the active plan and retailer choice. A fresh planner visit starts with no retailer selected while reusable household preferences may remain saved.

The routed client uses one pathless layout route with `AppShell` around all seven pages. The shell remains mounted while route content changes, and the query/profile/plan providers sit above `BrowserRouter`. `App.tsx` is now the planner screen rather than the owner of the whole application.

## Verification interpretation

- A passing routed-shell/Aldi browser harness does not prove the Tesco browser journey because the current harness does not seed or select Tesco.
- Verification recorded before a later comment-only source edit remains useful implementation evidence but is not an exact-head full-suite result. Exact merge-candidate verification must be recorded separately.
- Development branch selectability must never be described as merged, deployed, or production-active without corresponding evidence.
- A ticket, specification, or plan does not prove implementation or verification; status advances only from current repository/check evidence.

## Unresolved questions

- What crawl coverage and observed quality thresholds are sufficient to call Tesco catalogue coverage reliable?
- What level of product-detail 403 frequency is acceptable before activation consideration?
- Which real-data equivalence thresholds must `productOffers` meet before changing the read source?
- What customer evidence should determine whether Tesco becomes the next production retailer?
- What production monitoring and rollback evidence is required for a future Tesco activation?

Resolve these through separate approved tickets. Do not infer answers from implementation convenience.
