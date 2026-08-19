# Engine-Only Meal Planner — Implementation Plan

**Status:** Implementation plan (execution not yet authorized)
**Source spec:** `docs/thriftchef-engine-only-meal-planner-implementation-spec.md`
**Repository:** `kofiarhin/thriftchef`
**Inspected branch:** `feat/nvidia-meal-planning-ux` @ `8113305`
**Prepared:** 19 August 2026
**Working tree at inspection:** ` M notest.txt`, `?? docs/thriftchef-engine-only-meal-planner-implementation-spec.md`

This plan converts the specification into an ordered, test-first execution sequence with
concrete seams, files, commands and exit gates. It records what the specification got
wrong about the current repository, and lists the decisions that must be approved before
coding starts.

---

## 1. How to use this plan

- Sections 2–4 are corrections and locked decisions. Read before Slice 0.
- Section 6 is the execution sequence. Each slice is independently verifiable and leaves
  the application working.
- Sections 7–9 are cross-cutting migrations (errors, config, frontend) referenced by the
  slices.
- Section 11 lists blocking questions. Slices 3 and 5 must not start until they are
  answered.
- Every slice follows the global TDD cycle: confirm seams → RED → verify RED → GREEN →
  verify GREEN → regression → refactor → report. Seams are named per slice in §6.
- Committing, pushing, branch creation, dependency changes and file deletions require
  explicit approval at the point they occur.

---

## 2. Specification reconciliation

The spec was written against real code, but several anchors do not match this branch.
These corrections are binding for implementation.

| Spec says | Repository actually has | Consequence |
|---|---|---|
| `src/features/meal-planner/components/PlanSkeleton.tsx` | `client/src/components/PlanSkeleton.tsx` | Every frontend path in the spec is wrong. The client lives under `client/src` with a flat `components/` directory; there is no `features/` layer. |
| `validateAndPriceMealPlan` | `validateAndPricePlan(raw, { request, products: Map })` in `server/mealPlanning/mealPlanValidator.ts` | Engine calls must use the real signature and build the `Map<string, SelectableProduct>` context themselves. |
| `GeneratedPlan` is available for the engine contract | `GeneratedPlan`, `GeneratedRecipe`, `GeneratedIngredient` are declared in `mockPlanner.ts` — a file the spec deletes | Those three types must move to `mealPlanTypes.ts` in Slice 0, before anything is deleted. |
| Only `PlanSkeleton` and `PlanError` carry AI copy | `ConstraintForm.tsx:137`, `ConstraintForm.tsx:165` and `MealPlanResults.tsx:70` also carry NVIDIA copy; `client/src/App.test.tsx:214-230,356` asserts it | Frontend scope is larger than the spec's file list. |
| `MEAL_PLAN_MAX_CONTEXT_PRODUCTS` is a prompt-sizing knob | It is already the `selectProducts` cap (`mealPlanController.ts:246,347`) | Renaming to `MEAL_PLAN_MAX_PRODUCTS` is a rename, not a behaviour change. Only the default bounds move (10–500 → 20–200). |
| Config changes touch `server/config/env.ts` only | `server/config/env.test.ts` and `server/testing/httpTestServer.ts:16-18` both hard-code NVIDIA env values | Both must change in the same commit or the entire server suite fails to boot. |
| Budget conflict becomes a new `NO_AFFORDABLE_PLAN` code | Budget conflict currently returns `CATALOGUE_CONSTRAINT_CONFLICT` via `ApiError.conflict` (`mealPlanController.ts:222`) | This is a **client-visible error-contract change**. It needs `PlanError.tsx` mapping plus client test updates, and approval (§11, Q2). |
| — | `PlanRejectedError` hard-codes status 422 / code `AI_INVALID_RESPONSE` (`mealPlanValidator.ts:69`) | The validator is also run over the **client-submitted** plan on `/replace`. After cutover a rejection there is bad client input (400), while a rejection of engine output is an internal bug (500). One error class can no longer serve both. |
| Frontend tests are "vitest" generically | Server tests run under `tsx --test` (`node:test` + `node:assert/strict`); client tests run under `vitest` + RTL | New server test files must use `node:test`, not vitest. |
| `npm run benchmark:planner` | No such script. `test` = `typecheck && test:unit && test:client` | The benchmark is a new `tsx` entry point and must stay out of `npm test`. |
| Anchor commit hashes for 11 files | Not re-verified against this working tree | Files were read directly and their content matches the spec's descriptions. Hashes are treated as informational only. |

Additional facts this plan relies on:

- `selectProducts` already removes ineligible, unpriced, allergen-conflicting and disliked
  products and caps the result by food group via `allocateAcrossFoodGroups`. It is reused
  unchanged apart from role attachment.
- `consolidateShoppingList` sums weekly package demand *before* rounding up, so ingredient
  reuse already reduces basket cost. The reuse score must model that, not re-implement it.
- `mealPlanSchemas.ts` enforces a closed `ALLOWED_KEYS` set, so `variationSeed` is rejected
  as an unknown key until that set is extended.
- The rate-limiter comment at `mealPlanRoutes.ts:19` justifies limiting by AI cost. Rate
  limiting stays (spec §17); only the comment changes.

---

## 3. Locked design decisions

Carried from the spec, restated as implementation constraints:

1. No LLM in the request path. No network call during generation or replacement.
2. `validateAndPricePlan` + `consolidateShoppingList` remain the sole authority on validity
   and price. The engine never computes a price that reaches the response.
3. Hard constraints gate; soft scores only order candidates that already passed every gate.
4. A required ingredient slot is filled by an accepted role or the template is discarded.
   There is no "cheapest available product" fallback — that is exactly the
   `mockPlanner.ts:283-288` behaviour being removed.
5. Search is bounded by configuration (products, variants, beam width, candidate cap,
   wall-clock deadline). No open-ended improvement loop.
6. Determinism: same catalogue + request + engine version + seed ⇒ deep-equal plan.
7. Phase 1 keeps the success response shape. Only `variationSeed` is added to requests.
8. Quality scores stay internal (diagnostics and logs) and never enter the response body.

---

## 4. Ground rules for execution

- **Branch:** do not implement on `feat/nvidia-meal-planning-ux`. Create
  `feat/engine-only-meal-planner` from it once the current working tree is resolved.
  Requires approval (§11, Q4).
- **Working tree:** `notest.txt` is modified and unrelated. Preserve it; do not stage,
  stash or revert it.
- **Dependencies:** none expected. No solver, no property-testing library, no new runtime
  package. If one becomes necessary, stop and ask.
- **Deletions:** every removal in Slice 5 requires approval and a prior repository-wide
  reference search.
- **Verification vocabulary:** implementation is not verification; a passing unit test is
  not a passing suite; a passing suite is not browser verification. Report each separately.

---

## 5. Target module map

```
server/mealPlanning/
  ingredientRoles.ts        NEW  pure classifier: catalogue text -> IngredientRole[]
  recipeTemplates.ts        NEW  curated typed templates + static template validator
  recipeVariants.ts         NEW  slot filling, quantity scaling, recipe rendering
  planScorer.ts             NEW  normalized weighted components + tie-breaking
  mealPlanEngine.ts         NEW  beam search, validation pool, budget gate, replacement
  plannerBenchmark.ts       NEW  local performance harness (not in npm test)
  mealPlanTypes.ts          MOD  engine contract, roles, GeneratedPlan, seed; drop AI types
  productSelector.ts        MOD  attach roles, report role shortages
  mealPlanController.ts     MOD  single engine call, no retry loop, no shared deadline
  mealPlanSchemas.ts        MOD  accept and validate variationSeed on both routes
  mealPlanValidator.ts      MOD  split rejection mapping (client input vs engine bug)
  mealPlanRoutes.ts         MOD  comment only
server/config/env.ts        MOD  drop nvidia block, add bounded engine settings
server/app.ts               MOD  construct engine, keep test overrides
server/http/errors.ts       MOD  new codes + constructors
server/testing/httpTestServer.ts  MOD  drop NVIDIA env
client/src/...              MOD  copy, error mapping, seed handling (see §9)
```

Request flow after cutover:

```
request -> parse(+seed) -> loadProducts -> selectProducts(+roles) -> assertUsableSelection
        -> engine.generate (variants -> beam -> validate+price -> budget gate -> score)
        -> controller final validate+price -> budget assert -> response
```

---

## 6. Execution sequence

Six slices. Slices 0–2 add code behind tests without touching the running path, so the
application keeps working on NVIDIA throughout. Slice 3 is the cutover.

### Slice 0 — Type relocation and baseline capture (prerequisite)

**Why first:** the engine contract references `GeneratedPlan`, which currently lives in a
file scheduled for deletion. Moving it later forces a second refactor of every new module.

**Seams to confirm before testing:** none new. This is a pure move plus a baseline record.
Confirm with the user that the `mockPlanner.test.ts` cases are the intended baseline for
the future template and engine tests.

**Tasks**

1. Move `GeneratedPlan`, `GeneratedRecipe`, `GeneratedIngredient` from `mockPlanner.ts` to
   `mealPlanTypes.ts`; re-export them from `mockPlanner.ts` so no other file changes.
2. Record which of the nine `mockPlanner.test.ts` cases migrate where: validator
   acceptance, seven-day coverage, selection-only products, no-cook household, appliance
   subset, determinism and recipe reuse all become engine-invariant tests. The
   single-product-catalogue case (`mockPlanner.test.ts:144`) is **dropped** — it only passes
   because of the cross-role fallback this work removes.
3. No behavioural change; no new tests beyond compilation.

**Verify:** `npm run typecheck:server && npm run test:unit`
**Exit:** types relocated, suite green, migration mapping agreed.

---

### Slice 1 — Domain foundation: roles and templates

**Seams to confirm before writing tests**

- `classifyIngredientRoles(input: { name, description, categoryPaths }): IngredientRole[]`
  — pure, no `SelectableProduct` dependency, so it is testable from raw catalogue text.
- `validateTemplate(template): TemplateProblem[]` — a static checker run over the shipped
  library inside a test, not at runtime.
- `RECIPE_TEMPLATES: readonly RecipeTemplate[]` — a frozen exported constant.

**Tasks**

1. `ingredientRoles.ts`: the 22-value `IngredientRole` union from spec §6.1 plus a
   deterministic classifier. Rules ordered most-specific-first, mirroring the existing
   `productCategories.ts:28-45` pattern (which already handles the "nuts filed under dried
   fruits" trap). Case-insensitive, whitespace-normalized, multi-role permitted. Anything
   unmatched yields `["unknown"]`.
2. `recipeTemplates.ts`: the `RecipeTemplate` / `IngredientSlot` / `InstructionTemplate`
   types from spec §6.2 plus the curated library. Coverage target: **8 breakfast, 10 lunch,
   12 dinner, 6 snack**, with at least one appliance-free template per meal type and
   vegetarian coverage in every meal type.
3. `validateTemplate` asserts: unique ids; `requiredAppliances ⊆ APPLIANCES`;
   `pantryItems ⊆ PANTRY_BASICS`; at least one required slot; `packagesAtBaseServings > 0`;
   `baseServings ≥ 1`; every instruction token resolves to a declared slot key; no slot
   accepts `"unknown"`.

**Tests (RED first, `node:test`)**

- `ingredientRoles.test.ts`: real Aldi-shaped names — "Chicken Breast Fillets" ⇒ `poultry`;
  "Beef Mince" ⇒ `red_meat`; "Basmati Rice" ⇒ `rice`; "Wholemeal Bread" ⇒ `bread`;
  "Greek Style Yogurt" ⇒ `yogurt`; "Free Range Eggs" ⇒ `egg`; "Baby Spinach" ⇒
  `leafy_vegetable`; "Pâté" ⇒ **no** breakfast-capable role; ambiguous or empty input ⇒
  `unknown`; results stable under case and whitespace changes.
- `recipeTemplates.test.ts`: every shipped template passes `validateTemplate`; per-meal-type
  counts meet the coverage target; at least one zero-appliance template per meal type;
  vegetarian-tagged coverage per meal type; ids unique.

**Files:** +`ingredientRoles.ts(.test)`, +`recipeTemplates.ts(.test)`. Runtime untouched.

**Verify:** `npm run test:unit` (new suites RED then GREEN), `npm run typecheck:server`.
**Exit:** templates cannot express a cross-role fallback; ambiguous items stay `unknown`;
runtime is still NVIDIA and still green.

---

### Slice 2 — Candidate engine behind tests

**Seams to confirm before writing tests**

- `buildRecipeVariants(input: { template, products, request, seed, limit }): RecipeVariant[]`
- `scorePlan(input: { priced, request, usage }): { total: number; breakdown: ScoreBreakdown }`
- `createMealPlanEngine(options: EngineOptions): MealPlanEngine` — options carry the four
  bounds and the deadline; `validateAndPricePlan` is injected as a collaborator so tests can
  count invocations without mocking its behaviour.

**Tasks**

1. **`recipeVariants.ts`** — for one template against the selected products:
   - build a sorted candidate list per slot: selection rank → effective package price →
     normalized product id (spec §7.2);
   - take only the top-N per slot and enumerate at most `maxRecipeVariants` combinations;
   - **discard the template outright when any required slot has no accepted-role product**;
   - scale quantities by `householdSize / baseServings`, matching the validator's package
     precision (`Number(x.toFixed(2))`, `mealPlanValidator.ts:139`);
   - render title and steps from controlled patterns plus product display names;
   - emit the `GeneratedRecipe` shape so the existing validator consumes it unchanged.
2. **`planScorer.ts`** — the seven weighted components from spec §7.5 (budget 20, reuse 20,
   variety 15, preference 15, cuisine 10, practicality 10, food-group balance 10), each
   normalized to `[0, weight]`. Total rounded to an integer for diagnostics only.
   Tie-break order: total desc → basket pence asc → unique products asc → canonical
   signature asc.
3. **`mealPlanEngine.ts`** —
   - stage the week: choose two or three distinct variants per requested meal type, then
     assign them across seven days, avoiding the same recipe on consecutive days wherever
     alternatives exist and balancing primary protein/starch roles;
   - deterministic beam search: expand, sort by (partial score, approximate cost, unique
     product count, canonical signature), retain `beamWidth`;
   - cap complete candidates at `candidateLimit`; check the wall-clock deadline **between**
     expansion stages only;
   - run every retained candidate through `validateAndPricePlan`;
   - drop over-budget candidates from the scoring pool but retain the cheapest valid
     over-budget candidate solely to report `minimumEstimatedPence`;
   - score the survivors and return the deterministic winner plus `EngineResult.diagnostics`.
4. **`plannerBenchmark.ts`** plus `"benchmark:planner": "tsx server/mealPlanning/plannerBenchmark.ts"`.
   Realistic 80-product fixture, warm-up runs, at least 100 measured runs; reports median,
   p95, max, candidates generated and valid ratio. **Not** wired into `npm test`.

**Tests**

- `recipeVariants.test.ts`: an unfilled required slot yields zero variants (the
  anti-"Pasta and Pâté Breakfast" test); an omitted optional slot still yields a valid
  recipe; quantity scaling for household 1, 2 and the schema maximum; appliance subset
  enforced; pantry items ⊆ request pantry; variant count never exceeds
  `maxRecipeVariants`; identical inputs give identical ordering; a different seed rotates
  only among equally-ranked products.
- `planScorer.test.ts`: each component at zero and at full weight; a cheaper basket raises
  budget fit without touching hard gates; reusing an already-purchased pack raises reuse;
  a duplicated primary ingredient lowers variety; total never exceeds 100; the tie-break is
  a total order (no two distinct plans compare equal).
- `mealPlanEngine.test.ts` (invariants, parameterized over a constraint matrix): exactly
  seven days; exactly the requested meal types each day; every product id came from the
  selection; no allergen or disliked product appears; all appliances permitted; the price
  is catalogue-derived and equals `consolidateShoppingList`'s total; final cost ≤ budget;
  same seed ⇒ deep-equal plan; some alternate seed changes at least one recipe when
  alternatives exist; counted validator invocations ≤ `candidateLimit`; counted variants ≤
  template count × `maxRecipeVariants`; when nothing is affordable, a typed
  no-affordable-plan outcome carrying `minimumEstimatedPence` is returned.
- Migrate the Slice 0 baseline cases into these suites.

**Files:** +`recipeVariants.ts(.test)`, +`planScorer.ts(.test)`, +`mealPlanEngine.ts(.test)`,
+`plannerBenchmark.ts`; MOD `package.json` (script only); MOD `mealPlanTypes.ts` (engine
contract, `ScoreBreakdown`, `EngineDiagnostics`, `IngredientRole` re-export).

**Verify:** `npm run test:unit`, `npm run typecheck`, `npm run benchmark:planner` (record
median and p95). Investigate if engine p95 exceeds 500 ms.
**Exit:** realistic fixtures yield deterministic, valid, affordable plans inside every
configured bound. Routes are still on NVIDIA.

---

### Slice 3 — Generation cutover ⚠ contract change

**Blocked on:** §11 Q1 (capacity-error status) and Q2 (budget-conflict code change).

**Seams to confirm before writing tests**

- `MealPlanDependencies.engine: MealPlanEngine` replacing `.generate: PlanGenerator`.
- `assertUsableSelection(candidates, selection, request)` gains role-shortage reporting.
- `parseMealPlanRequest` returns `variationSeed: number` (default 0).

**Tasks**

1. `server/http/errors.ts`: add `NO_AFFORDABLE_PLAN`, `NO_REPLACEMENT_AVAILABLE`,
   `PLANNER_CAPACITY_EXCEEDED`, `PLANNER_INTERNAL_ERROR` to `API_ERROR_CODES` with matching
   static constructors (§7). Leave the `AI_*` codes in place until Slice 5.
2. `mealPlanSchemas.ts`: add `variationSeed` to `ALLOWED_KEYS`; validate as an integer in
   0…2_147_483_647; default 0; same for the `/replace` envelope.
3. `productSelector.ts`: attach `roles` in `toSelectable`; extend `SelectionResult` with a
   role histogram so shortages can be named without leaking catalogue prose.
4. `mealPlanController.ts`: delete `generateValidPlan`, `MIN_REPAIR_BUDGET_SHARE`,
   `summarize`, the timing plumbing and both deadline computations. Generation becomes
   parse → load → select and assert → **one** `engine.generate` → final
   `validateAndPricePlan` → `assertWithinBudget` (now `NO_AFFORDABLE_PLAN`) → response →
   log diagnostics. The "first plan was regenerated" warning is dropped.
5. `mealPlanValidator.ts`: `PlanRejectedError` stops hard-coding 422/`AI_INVALID_RESPONSE`.
   Two mappings replace it — rejection of a **client-submitted** plan ⇒ 400
   `INVALID_MEAL_PLAN_REQUEST`; rejection of **engine output** ⇒ 500
   `PLANNER_INTERNAL_ERROR`. Rejection reasons stay machine-readable and no generated text
   is ever reflected to the client.
6. `env.ts`: remove `NvidiaConfig` and the `nvidia` block; rename
   `mealPlanMaxContextProducts` → `mealPlanMaxProducts` (default 80, bounds 20–200); add
   `mealPlanCandidateLimit` (24, 4–64), `mealPlanBeamWidth` (32, 8–128),
   `mealPlanMaxRecipeVariants` (6, 1–12), `mealPlanEngineTimeoutMs` (1500, 250–5000).
   Update `env.test.ts` and `server/testing/httpTestServer.ts` in the same commit.
7. `app.ts` / `defaultDependencies`: construct the real engine from config; keep
   `AppOverrides.mealPlanDependencies` so route tests can still inject a fake engine.
8. Log fields (spec §12): request id, selected product count, engine version, duration,
   recipes considered, candidates generated and valid, selected score, basket pence,
   outcome code. Never product descriptions, allergy input, request bodies or full plans.
9. Frontend: `variationSeed` flows through `client/src/api/mealPlans.ts`; `App.tsx` holds a
   seed counter — `submit` sends 0, "Regenerate" increments, a retry after an unknown
   outcome re-sends the same seed. Copy changes in `PlanSkeleton.tsx` (both the `sr-only`
   text and the visible paragraph → "Building your week from current Aldi prices. This
   should take a few seconds."), `PlanError.tsx` (map the new codes, remove the two-minute
   wording), `ConstraintForm.tsx:137,165`, `MealPlanResults.tsx:70`.
10. `.env.example` and `README.md`: architecture diagram, prerequisites, NVIDIA section,
    error table, benchmark command.

**Tests**

- `mealPlanRoutes.test.ts`: rewrite. Keep and re-point the still-valid cases (priced plan,
  catalogue pricing, product coverage, allergen exclusion, inferred warning, invalid
  request, 503 empty catalogue, 409 constraint conflict, 409 minimum estimate, stale
  warning, no-cook household). **Delete** the two retry cases (`:329`, `:360`) — there is no
  retry loop any more. **Add**: real-engine success against a fixed fixture; invalid
  `variationSeed` rejected with per-field detail; role-shortage conflict; a repeated
  identical request produces an identical plan; capacity error maps safely; no test needs
  NVIDIA configuration or network mocking.
- `client/src/App.test.tsx`: loading copy asserts seconds rather than minutes
  (`:217-230`); regeneration increments the seed; retry after a network error re-sends the
  same seed; a budget conflict renders `NO_AFFORDABLE_PLAN` copy with the server's
  suggestions and both buttons; alert semantics and focus behaviour unchanged.

**Verify:** `npm test` (typecheck + server + client), `npm run build`,
`npm run benchmark:planner`. Manual browser pass with DevTools Network open: first
generation, regenerate, constraint conflict, low budget — each returning in seconds with
zero requests to `integrate.api.nvidia.com`.
**Exit:** generation is engine-only, the success response shape is unchanged, and the app
boots with no NVIDIA variables set.

---

### Slice 4 — Replacement cutover

**Seams to confirm before writing tests**

- `engine.replaceMeal({ request, currentPlan, day, mealType, products, variationSeed })`.

**Tasks**

1. Rewrite `createMealReplacementHandler`: parse → validate and price the **submitted**
   plan (rejection ⇒ 400, per Slice 3 item 5) → locate the target meal (the existing 400
   path at `mealPlanController.ts:361` is unchanged) → one `engine.replaceMeal` call →
   final validate and price → budget gate → response. The two-attempt loop, the shared
   deadline and `replacementRecipeFrom` all go.
2. Engine replacement: build variants for the target meal type only; exclude the current
   recipe and canonical duplicates; substitute into an otherwise untouched copy of the plan;
   validate and price the **whole** plan; drop over-budget results; score with incremental
   basket cost and waste weighted up; return the deterministic winner. No alternative ⇒ 409
   `NO_REPLACEMENT_AVAILABLE` with actionable suggestions (appliances, meal types, budget,
   dietary filters).
3. Preserve the recipe-pruning behaviour at `mealPlanController.ts:415-421`: recipes no
   longer referenced by any day are dropped from the response.

**Tests**

- Route: only the target meal changes and the other six days are identical; basket totals
  update; `NO_REPLACEMENT_AVAILABLE` when the catalogue offers no distinct alternative; a
  malformed submitted plan yields 400 rather than 422; deterministic for a fixed seed.
- Client: a `replaceMeal` failure renders the existing alert; `NO_REPLACEMENT_AVAILABLE`
  produces specific copy rather than the generic message; `App.test.tsx:356` is retitled off
  "NVIDIA".

**Verify:** `npm test`, `npm run build`, manual replacement in the browser.
**Exit:** neither path depends on a model; `dependencies.generate` no longer exists.

---

### Slice 5 — Removal and hardening ⚠ deletions

**Blocked on:** explicit approval for each deletion.

**Tasks**

1. Repository-wide search for `nvidia`, `NVIDIA`, `AI_`, `promptBuilder`, `contextBuilder`,
   `mockPlanner`, `generateMockPlan`, `PlanGenerator`, `GenerationTiming` and
   `maxContextProducts` across `server/`, `client/`, `scripts/`, `docs/`, `README.md` and
   `.env.example`.
2. Delete `nvidiaClient.ts`, `nvidiaClient.test.ts`, `nvidiaIntegration.test.ts`,
   `promptBuilder.ts`, `contextBuilder.ts`, `contextBuilder.test.ts`, `mockPlanner.ts` and
   `mockPlanner.test.ts` — the last two only once the Slice 0 baseline cases are
   demonstrably re-homed.
3. Remove `PlanGenerator`, `PlanGeneratorInput` and `GenerationTiming` from
   `mealPlanTypes.ts`.
4. Remove `AI_TIMEOUT` and `AI_INVALID_RESPONSE` from `API_ERROR_CODES`, from
   `PlanError.tsx`'s switch and from the `README.md` error table.
5. Update the `mealPlanRoutes.ts:19` comment: rate limiting now protects CPU and catalogue
   access, not model spend.
6. Confirm `.env.example` and `README.md` carry no NVIDIA key, URL, model, timeout or retry
   variable.

**Verify:** `npm test`, `npm run build`, `npm run benchmark:planner`, the full manual pass,
and `grep -ri "nvidia" server client scripts README.md .env.example` returning nothing.
**Exit:** no runtime import, configuration requirement, UI string or test depends on an LLM.

---

## 7. Error-contract migration

| Situation | Today | After | Status |
|---|---|---|---|
| Bad request fields | `INVALID_MEAL_PLAN_REQUEST` | unchanged | 400 |
| Catalogue never crawled | `CATALOGUE_UNAVAILABLE` | unchanged | 503 |
| Constraints filter the catalogue away | `CATALOGUE_CONSTRAINT_CONFLICT` | unchanged, plus role-shortage causes | 409 |
| No affordable plan | `CATALOGUE_CONSTRAINT_CONFLICT` | **`NO_AFFORDABLE_PLAN`** + `minimumEstimatedPence` | 409 |
| No valid replacement | 422 `AI_INVALID_RESPONSE` | **`NO_REPLACEMENT_AVAILABLE`** | 409 |
| Client submitted an invalid plan to `/replace` | 422 `AI_INVALID_RESPONSE` | **`INVALID_MEAL_PLAN_REQUEST`** | 400 |
| Engine hit its deadline with no candidate | 504 `AI_TIMEOUT` | **`PLANNER_CAPACITY_EXCEEDED`** | see Q1 |
| Engine output the validator rejected | 422 `AI_INVALID_RESPONSE` | **`PLANNER_INTERNAL_ERROR`** | 500 |
| Rate limited | `RATE_LIMITED` | unchanged | 429 |

`ApiRequestError.isRetryable` (`client/src/api/http.ts:37`) returns true for status ≥ 500,
429 and 422. After migration nothing returns 422, so the capacity-error status alone
decides whether the user is offered "Try again" — hence Q1.

## 8. Configuration migration

| Variable | Today | After |
|---|---|---|
| `NVIDIA_API_KEY` / `NVIDIA_API_URL` / `NVIDIA_MODEL` | required | removed |
| `AI_REQUEST_TIMEOUT_MS` (1 000–120 000, default 120 000) | present | removed |
| `AI_MAX_RETRIES` (0–3, default 0) | present | removed |
| `MEAL_PLAN_MAX_CONTEXT_PRODUCTS` (10–500, default 80) | present | → `MEAL_PLAN_MAX_PRODUCTS` (20–200, default 80) |
| — | — | `MEAL_PLAN_CANDIDATE_LIMIT` 24 (4–64) |
| — | — | `MEAL_PLAN_BEAM_WIDTH` 32 (8–128) |
| — | — | `MEAL_PLAN_MAX_RECIPE_VARIANTS` 6 (1–12) |
| — | — | `MEAL_PLAN_ENGINE_TIMEOUT_MS` 1500 (250–5 000) |
| `MEAL_PLAN_RATE_LIMIT_*`, `CATALOGUE_STALE_AFTER_HOURS`, `ALDI_*`, `MONGODB_URI` | unchanged | unchanged |

Touch points: `server/config/env.ts`, `server/config/env.test.ts`,
`server/testing/httpTestServer.ts`, `.env.example`, `README.md`.

**Independent of this work:** the exposed NVIDIA key must be revoked at the provider.
Removing the integration does not revoke it.

## 9. Frontend inventory (corrected paths)

| File | Change | Slice |
|---|---|---|
| `client/src/App.tsx` | seed counter; regenerate increments; retry preserves the seed | 3 |
| `client/src/components/PlanSkeleton.tsx` | seconds-scale copy in both `sr-only` and visible text | 3 |
| `client/src/components/PlanError.tsx` | map the new codes; drop two-minute and AI wording | 3, 4 |
| `client/src/components/ConstraintForm.tsx` | NVIDIA copy at lines 137 and 165 | 3 |
| `client/src/components/MealPlanResults.tsx` | "Your NVIDIA-planned week" at line 70 | 3 |
| `client/src/api/mealPlans.ts` | carry `variationSeed` | 3 |
| `client/src/api/types.ts` | re-exports server types — confirm no manual edit needed | 3 |
| `client/src/App.test.tsx` | lines 214-230, 260-283, 328-340, 356 | 3, 4 |
| `client/src/testing/fixtures.ts` | check for AI-shaped fixtures | 3 |

## 10. Acceptance-criteria traceability

| Spec §15 criterion | Proven by | Slice |
|---|---|---|
| 1. Boots without NVIDIA config | `env.test.ts` minimal-env case; `httpTestServer` | 3 |
| 2. Zero external LLM requests | no client module exists; manual DevTools pass | 5 |
| 3. Valid plan or defined conflict | route integration matrix | 3, 4 |
| 4. Always within budget | engine invariant + controller `assertWithinBudget` | 2, 3 |
| 5. No cross-role slot filling | `recipeVariants.test.ts` discard case | 1, 2 |
| 6. Determinism | engine deep-equal invariant; route repeat test | 2, 3 |
| 7. Regeneration varies | alternate-seed invariant; client seed-increment test | 2, 3 |
| 8. Bounds respected | counted validator and variant invocations | 2 |
| 9. Suite and build pass | `npm test`, `npm run build` | 3–5 |
| 10. p95 ≤ 500 ms | `npm run benchmark:planner`, recorded in the PR | 2, 5 |
| 11. UI no longer promises two minutes | `App.test.tsx` copy assertions | 3 |
| 12. No NVIDIA references remain | repository-wide grep | 5 |

## 11. Blocking questions

**Q1 — What HTTP status should `PLANNER_CAPACITY_EXCEEDED` carry?**
Why it matters: `isRetryable` keys off status, so this decides whether the user is offered
"Try again". Recommended default: **503**, treating an exhausted deadline as a transient
service condition and keeping the retry button. Trade-off: 503 also reads as "the server is
unhealthy" in monitoring, which overstates a bounded search that simply ran out of room;
500 would be more honest but non-retryable, and 422 would preserve semantics Slice 5 is
retiring.

**Q2 — Is changing the budget-conflict code from `CATALOGUE_CONSTRAINT_CONFLICT` to
`NO_AFFORDABLE_PLAN` approved?**
Why it matters: it is a client-visible API contract change, and breaking changes need
approval. The spec calls for it (§9.2) and no consumer other than this repository's own
client is known. Recommended default: **yes** — the two conditions need different recovery
copy. Trade-off: any third-party consumer keying on the old code silently falls through to
a generic message.

**Q3 — Who authors the 36 recipe templates?**
Why it matters: Slice 1's exit gate is content, not code, and 36 templates with correct
role slots and instruction tokens is the largest hand-written artifact in this work.
Recommended default: **generate them in-repo during Slice 1**, reviewed by the user before
Slice 2 depends on them. Trade-off: the user may prefer to author or source real recipes,
which lengthens Slice 1 but improves quality.

**Q4 — Is `feat/engine-only-meal-planner` branched off the current branch the right base?**
Recommended default: **yes**, branching from `feat/nvidia-meal-planning-ux` once the
modified `notest.txt` is resolved. Trade-off: basing on `main` instead would discard the
NVIDIA UX work this replaces.

## 12. Risks specific to this repository

| Risk | Why it bites here | Mitigation |
|---|---|---|
| The Aldi catalogue is too sparse for 36 templates | Roles are inferred from names alone; Aldi publishes no ingredient data | Slice 1's exit gate runs the classifier over a real catalogue dump and reports role coverage before templates are finalized |
| The `PlanRejectedError` split quietly breaks `/replace` | One class currently serves two very different callers | Route tests for both directions land in the same commit as the split |
| The config rename breaks every server test at once | `httpTestServer.ts` seeds env for the whole suite | Rename config, `env.test.ts` and `httpTestServer.ts` atomically in Slice 3 |
| Beam search runs the validator more often than expected | `validateAndPricePlan` is the hot path and is not cheap | Inject and count it; assert invocations ≤ `candidateLimit` |
| The benchmark becomes a flaky CI gate | Timing varies across machines | `benchmark:planner` stays out of `npm test`; CI asserts operation counts only |
| Scores leak into the UI | Diagnostics travel alongside the response body | `MealPlanResponse` gains no score field and is typechecked by the client |

## 13. Definition of done

- Generation and replacement are engine-only; `dependencies.generate` no longer exists.
- All twelve spec §15 acceptance criteria are demonstrated per §10.
- `npm test` and `npm run build` pass, reported as actually run rather than assumed.
- `npm run benchmark:planner` numbers (median, p95, max, candidate counts) are recorded in
  the pull-request description.
- Manual browser verification is recorded for first generation, regenerate, constraint
  conflict, low budget and meal replacement — each in seconds, each with zero NVIDIA
  requests.
- `grep -ri nvidia` over `server/`, `client/`, `scripts/`, `README.md` and `.env.example`
  returns nothing.
- README describes the deterministic planner, its five bounds, its error codes and the
  benchmark command.
- The exposed NVIDIA API key has been revoked at the provider (tracked separately).
