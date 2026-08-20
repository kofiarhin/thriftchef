# Planner benchmark — Phase 0 baseline

Recorded before any multi-retailer work, from the fixture catalogue in
`server/testing/planningFixtures.ts` padded to 80 products.

Wall-clock figures are **recorded, never asserted**. They vary by an order of
magnitude across machines, which is why `plannerBenchmark.ts` is deliberately
not a test. The candidate counts beside them *are* deterministic and are
asserted by `server/mealPlanning/aldiBaseline.test.ts`.

## Environment

| | |
| --- | --- |
| Node | v22.20.0 |
| Platform | win32 (Windows 10 Pro 19042) |
| Engine version | 1.0.0 |
| Bounds | beamWidth 32, candidateLimit 24, maxRecipeVariants 6, timeoutMs 1500 |
| Catalogue | 80 fixture products |
| Runs | 20 warm-up + 100 measured per scenario |

## Results

| Scenario | median | p95 | max | candidates generated | valid |
| --- | ---: | ---: | ---: | ---: | ---: |
| standard (3 meals, 2 people) | 17.1 ms | 32.6 ms | 49.6 ms | 24.0 | 24.0 (100%) |
| worst supported (4 meals, 8 people, all preferences) | 19.9 ms | 27.2 ms | 37.6 ms | 24.0 | 24.0 (100%) |
| constrained (hob only, vegetarian) | 9.7 ms | 11.1 ms | 15.2 ms | 24.0 | 24.0 (100%) |

## What counts as a regression

- Any change in **candidates generated** or **candidates valid**: these are a
  property of the search, not the machine, and a change means the bounded
  search explores a different space.
- A median above the 1500 ms engine timeout, or within an order of magnitude of
  it, on comparable hardware.

A slice that changes catalogue selection, planner input or search must re-run
`npm run benchmark:planner` and quote the numbers against this table.
