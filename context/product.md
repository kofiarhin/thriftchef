# Product Context

## Product

ThriftChef is a free, anonymous, retailer-aware weekly cooking assistant for UK households.

## Primary customer

A UK household planner who wants to decide what to cook, keep within a grocery budget, and shop from one coherent retailer-specific list without creating an account.

Specific validated customer segments, interview findings, and willingness-to-pay evidence are unresolved. Record real evidence under `customers/` when it exists.

## Problem

Weekly meal planning requires coordinating household size, budget, cooking days, meal types, time, dietary constraints, available appliances, owned ingredients, recipes, package sizes, and current retailer prices. Generic recipe lists do not solve the combined planning and shopping problem.

## Promise

Select a supported retailer, describe the week and household constraints, and receive an affordable plan, coherent recipes, and one ready-to-shop basket built from that retailer's catalogue.

## Core journey

1. Begin a fresh planning session.
2. Choose an available retailer.
3. Set household, budget, schedule, meal, dietary, appliance, pantry, and optional mood preferences.
4. Generate a bounded deterministic plan.
5. Review meals, recipes, price, and consolidated shopping list.
6. Regenerate the week or replace one meal without losing the chosen scope.
7. Start a new plan when a different retailer or planning session is required.

## Product principles

- Retailer coherence is mandatory: one plan and basket must not mix retailers.
- Budget guarantees use stored catalogue prices and whole-package purchasing.
- Planning is deterministic and bounded for the same catalogue, request, engine version, and seed.
- The request path requires no generative-model API.
- Anonymous use is the default; reusable household preferences may remain on the device.
- Catalogue uncertainty must fail clearly rather than invent prices or availability.

## Success criteria

Users can generate only the meals they intend to cook, remain at or below budget, understand what to cook and buy, regenerate or replace meals predictably, and shop from one correctly named retailer-scoped list.

Operational signals include valid-plan rate, planning latency, catalogue errors, constraint conflicts, regeneration and replacement use, usefulness feedback, catalogue freshness, and adapter health. Targets remain unresolved unless supported by product evidence.

