# Product and Engineering Decisions

## Confirmed decisions

| Decision | Status | Consequence |
| --- | --- | --- |
| Planning is deterministic and bounded | Confirmed | No model/API call is required in the request path. |
| Users remain anonymous for the MVP | Confirmed | Household preferences and checklist state may be local; plans have bounded anonymous persistence. |
| Retailer scope is end-to-end | Confirmed | Catalogue, planning, regeneration, replacement, recipe, and shopping-list flows cannot mix retailers. |
| Production remains Aldi-only | Confirmed | Tesco development work does not change live availability. |
| Tesco MVP uses a public national catalogue | Confirmed for development | No sign-in, postcode, or store-selection UI is required for the branch flow. |
| Normal shelf prices drive totals | Confirmed | Clubcard and conditional promotional prices are excluded. |
| Bounded crawls never reconcile | Confirmed | Missing records are not retired from incomplete evidence. |
| Legacy catalogue reads remain active | Confirmed | `productOffers` must be backfilled and compared before a switch. |
| Production deployment and merge are human-owned | Confirmed | Each requires separate explicit approval. |

## Current implementation decision

On the Tesco development branch, users choose Aldi or Tesco directly. Regeneration retains the selected retailer and constraints while changing the generation seed. Start new plan clears the active plan and retailer choice. A fresh planner visit starts with no retailer selected while reusable household preferences may remain saved.

## Unresolved questions

- What crawl coverage and observed quality thresholds are sufficient to call Tesco catalogue coverage reliable?
- What level of product-detail 403 frequency is acceptable before activation consideration?
- Which real-data equivalence thresholds must `productOffers` meet before changing the read source?
- What customer evidence should determine whether Tesco becomes the next production retailer?
- What production monitoring and rollback evidence is required for a future Tesco activation?

Resolve these through separate approved tickets. Do not infer answers from implementation convenience.

