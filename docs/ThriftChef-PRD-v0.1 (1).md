# ThriftChef Product Requirements Document

**Version:** 1.0  
**Status:** Active product direction  
**Last updated:** 2026-08-22

## 1. Product Summary

ThriftChef is a free, anonymous, retailer-aware weekly cooking assistant for UK households.

A shopper selects a supported supermarket and store, describes their household, budget, dietary needs, available appliances, and the days they want to cook. ThriftChef then creates:

- a practical plan for the selected cooking days;
- coherent recipes using products suited to their culinary roles;
- one consolidated whole-package shopping list;
- an estimated basket total priced from that store's catalogue.

ThriftChef currently supports Aldi UK at the configured Belper store. The product and catalogue architecture support additional retailers, but they remain unavailable until their adapters and catalogue data have been independently verified.

## 2. Problem

Weekly meal planning forces households to solve several connected problems:

- decide what to cook;
- fit meals around the days they will actually cook;
- stay within a grocery budget;
- account for household size, allergies, dislikes, preferences, time, and appliances;
- translate recipes into purchasable pack quantities;
- avoid duplicate shopping-list items and unnecessary waste;
- verify that suggested products are sold by the chosen retailer.

Recipe apps usually stop at inspiration. Retailer apps usually stop at product discovery. ThriftChef joins planning, recipes, catalogue selection, and basket pricing into one workflow.

## 3. Product Goal

Help a UK shopper turn their weekly constraints into a realistic, affordable cooking plan and a ready-to-shop basket from one selected retailer.

## 4. Product Principles

1. **Useful before personalised accounts.** Core planning remains free and anonymous.
2. **Plan only what the shopper needs.** Generate meals for selected cooking days rather than forcing a seven-day schedule.
3. **Use one retailer and store per plan.** Products and prices must never be mixed across catalogues.
4. **Catalogue evidence over invented ingredients.** Plans use eligible products from the selected store's stored catalogue.
5. **Deterministic and bounded.** The planning engine has predictable behaviour and latency without an external model in the request path.
6. **Whole-package budgeting.** Basket totals reflect the packs the shopper must buy, with shared ingredients consolidated across meals.
7. **Safety is explicit.** Inferred allergen information is treated as a warning, never as verified packaging data.
8. **Activate retailers only after verification.** A retailer may appear in the system before it becomes selectable.

## 5. Target Users

- budget-conscious households;
- families and couples;
- students;
- busy professionals;
- people planning around limited time or kitchen equipment;
- shoppers who want one coherent list for a chosen supermarket.

## 6. Current Product Scope

### Included

- free, anonymous use;
- retailer and store selection;
- Aldi UK as the only active retailer;
- one-time household preferences stored locally;
- selected cooking days;
- household size and weekly budget;
- meal types, cuisine preferences, weekly mood, dislikes, and dietary preferences;
- allergy input with inferred-data warnings;
- appliance and cooking-time constraints;
- owned-ingredient input;
- deterministic plan generation;
- regeneration with a different variation seed;
- replacement of a single meal while preserving the rest of the plan;
- recipe detail views;
- a consolidated, categorised whole-package shopping list;
- locally persisted checklist state;
- anonymously persisted plans with time-limited retention;
- catalogue freshness and availability reporting;
- retailer and store provenance for generated plans;
- optional closed end-of-week feedback.

### Not currently included

- user accounts or authentication;
- paid plans or user-facing generation quotas;
- cross-device history or synchronisation;
- nutrition or medical guidance;
- verified allergen guarantees;
- live stock guarantees;
- grocery ordering or delivery;
- pantry inventory management;
- native mobile applications;
- active retailers beyond Aldi;
- an external generative-AI model in the planning request path.

## 7. Core User Journey

1. The shopper opens ThriftChef without creating an account.
2. They select an active retailer and store.
3. They provide household size and weekly budget.
4. They select the days they intend to cook and the meal types required.
5. They add time limits, dietary preferences, allergies, dislikes, cuisines, appliances, owned ingredients, and an optional weekly mood.
6. ThriftChef validates the request and selected catalogue.
7. The planner selects eligible store products, fills coherent recipe templates, assembles bounded candidate plans, consolidates required packs, and rejects over-budget candidates.
8. The shopper receives their plan, recipes, estimated basket total, and shopping list.
9. They may regenerate the week or replace one meal.
10. The plan can be reopened on the same device while its anonymous record remains within the retention period.
11. The shopper checks items off while shopping and may optionally submit closed feedback at the end of the week.

## 8. Functional Requirements

### Retailer and catalogue

The application must:

- expose supported retailers while clearly marking inactive ones;
- allow selection only when a retailer and store are active and usable;
- scope every catalogue query and plan to exactly one retailer and store;
- use current stored catalogue prices and package sizes;
- prevent unavailable, unsafe, ambiguous, or ineligible products from entering plans;
- record catalogue and planning provenance;
- surface stale or unavailable catalogue states clearly.

### Planning

The application must:

- validate all material household and weekly constraints;
- generate meals only for selected cooking days;
- respect requested meal types, budget, dietary rules, allergies, dislikes, appliances, and time limits;
- use products only in coherent culinary roles;
- calculate quantities for household size;
- consolidate repeated ingredients before rounding to purchasable packs;
- exclude any candidate whose estimated basket exceeds the budget;
- return a deterministic result for the same catalogue, request, engine version, and variation seed;
- stop within configured search and timeout bounds;
- support whole-plan regeneration and single-meal replacement.

### Recipes and shopping

The application must:

- provide ingredients, quantities, method steps, time estimates, and appliance requirements;
- produce one categorised shopping list for the full plan;
- show package quantities, catalogue prices, and an estimated total;
- preserve shopping checklist state locally;
- display allergen and catalogue-data warnings prominently.

### Persistence and privacy

The application must:

- work without registration;
- avoid collecting email addresses or account credentials;
- persist generated plans anonymously for a configurable period;
- associate plans with a hashed device identifier;
- store household preferences and checklist state locally where practical;
- avoid logging request bodies, recipes, product names, or household constraints.

## 9. Planning Approach

ThriftChef does not use an external AI model to generate plans.

The backend:

1. validates the request and retailer/store scope;
2. retrieves eligible products from the selected catalogue;
3. filters unsafe, unavailable, disliked, incompatible, or unpriced products;
4. classifies products into conservative culinary roles;
5. fills curated recipe templates only when every required role can be satisfied;
6. uses bounded deterministic search to assemble complete candidate plans;
7. validates recipes, constraints, quantities, and budget;
8. scores valid plans for practicality, variety, preference fit, ingredient reuse, and budget fit;
9. returns the best valid result and its catalogue provenance.

Unknown products are not guessed into recipes. If no safe, coherent, affordable plan exists, the application returns a specific recoverable error.

## 10. Retailer Expansion

The platform uses a shared catalogue runner and retailer-specific adapters.

The shared runner owns crawling lifecycle, queueing, retries, normalisation, run records, safety processing, batched persistence, price history, coverage checks, and trusted availability reconciliation. Each adapter owns only retailer-specific navigation, consent, store selection, categories, pagination, and selectors.

A retailer becomes selectable only after:

- an authorised product source is confirmed;
- real fixtures and selector-drift tests pass;
- a bounded diagnostic crawl succeeds;
- a trusted full crawl meets coverage and failure thresholds;
- retailer/store isolation is proven;
- catalogue status and freshness are acceptable;
- generated plans pass coherence, safety, and budget checks.

The planned expansion path is retailer-by-retailer rather than simultaneous activation.

## 11. Data and Safety Requirements

Each catalogue offer should retain:

- retailer and store identifiers;
- product identity, name, brand, description, and category path;
- package size and unit;
- current price and price history;
- availability and last-seen timestamps;
- source URL and crawl-run provenance;
- inferred or verified allergen status;
- dietary and eligibility classifications.

Aldi product pages do not provide complete ingredient or allergen labels. ThriftChef therefore treats Aldi allergen data as inferred. Conflicting inferred allergens are filtered, incomplete or ambiguous products are ineligible, and shoppers must be told to check the product packaging.

ThriftChef is not a medical, nutrition, or allergen-safety tool.

## 12. Non-Functional Requirements

- Planning should complete within the configured 1.5-second engine ceiling under supported catalogue sizes.
- Search work must remain bounded by product, candidate, beam-width, and recipe-variant limits.
- API failures must use stable error codes with actionable recovery guidance.
- Direct client routes must survive refresh.
- Production CORS must be restricted to the canonical client origin.
- Catalogue crawlers must run only from a trusted machine, never as part of application deployment.
- Production admin catalogue routes remain disabled until authentication is designed and approved.
- New retailers must not weaken retailer/store isolation.
- Changes to planning behaviour must be covered by regression baselines and tests.

## 13. Success Measures

The product direction is succeeding when users can:

- configure a week and receive a usable plan without creating an account;
- generate only the days and meals they intend to cook;
- stay at or below their stated basket budget;
- understand what to cook and what packages to buy;
- regenerate or replace a meal without rebuilding the week manually;
- shop from a single coherent list tied to their selected retailer and store.

Operational measures include:

- valid-plan generation rate;
- median and p95 planning latency;
- frequency of catalogue-unavailable or constraint-conflict errors;
- regeneration and replacement usage;
- optional end-of-week completion and usefulness feedback;
- catalogue freshness and retailer-adapter health.

## 14. Current Delivery State

- The retailer-aware foundation is implemented and deployed.
- Aldi UK is the only active retailer.
- The deterministic planner is authoritative.
- Plans, recipes, regeneration, replacement, shopping persistence, and anonymous plan reopening are available.
- The production read path still uses legacy product fields while store-scoped offers await a real-data backfill and equivalence comparison.
- Additional retailer adapters remain future work and must be activated independently.

## 15. Near-Term Priorities

1. Separate local development data from production data.
2. Refresh and verify the Aldi catalogue safely.
3. Backfill store-scoped offers and prove equivalence before switching read paths.
4. Improve recipe variety without weakening coherence, determinism, or budget guarantees.
5. Add and verify the next retailer only after authorised catalogue access is established.
6. Continue retailer expansion one adapter at a time.

## 16. Guiding Statement

> Select your store, tell ThriftChef when and how your household wants to cook, and receive an affordable plan, coherent recipes, and one ready-to-shop basket built from that store's catalogue.
