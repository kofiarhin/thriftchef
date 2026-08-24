# Current State

Snapshot source: development checkpoint `18e4231eec31198fac4c6196da209d90f752020e` on branch `docs/thriftchef-ai-workspace`. That commit is documentation-only, so its application code is identical to `35f095b4bc1a9f8e6b8d4f4fc4f573e85239cec2`. Catalogue figures below remain recorded handoff evidence supplied on 23 August 2026.

## Production

- Vercel and Heroku remain on `3eeaef07e408cf5bb44a9f87a4f077cbea348c7d`.
- Production is Aldi-only.
- `CATALOGUE_READ_SOURCE=legacy` remains active.
- Tesco has not been merged, deployed, or activated in production.

## Implemented on the Tesco branch

- Tesco adapter, current public category routes, product selectors, category registry, failure detection, fixtures, and tests.
- Shared bounded public crawl command: `npm run tesco:public-crawl`.
- Additive Tesco retailer/catalogue bootstrap alongside preserved Aldi data.
- Retailer-scoped persistence and planner-query boundaries.
- Direct Aldi/Tesco choice with no additional postcode or store-selection UI.
- Retailer propagation through generation, regeneration, replacement, recipes, shopping lists, and displayed copy.
- Fresh-session behaviour for planner visits and Start new plan.

## Recorded catalogue evidence

- 148 product tiles observed.
- 147 valid listing products.
- 17 Tesco products persisted.
- 0 Tesco product offers persisted.
- Verified sample: `Tesco Parsnips 500G`, 74 pence, with canonical Tesco product URL.
- No availability reconciliation performed.
- Recorded anomalies: one HTTP 403 detail request, eight route-not-found rejections, and one missing-standard-price rejection.

This is historical evidence, not a fresh verification run.

## Recorded automated verification

### Current checkpoint `18e4231` (code identical to `35f095b`)

Run on 23 August 2026, on branch `docs/thriftchef-ai-workspace`, against a clean working tree (`git status --porcelain` empty before and after), Node v22.20.0.

| Command | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | Passed | `tsc --noEmit` (server) and `tsc --noEmit -p client/tsconfig.json` (client) both exited 0 with no diagnostics. |
| `npm run test:client` | Passed | Vitest 4.1.10: 9 test files passed (9), 128 tests passed (128), duration 47.69s. |
| `npm run build` | Passed | `typecheck:client`, `build:server` (`tsc -p tsconfig.server.json`), and `build:client` (`vite build`) all exited 0. Vite 8.2.1 transformed 114 modules and emitted `dist/client/index.html` 0.70 kB, `assets/index-CQAksfoP.css` 35.53 kB, `assets/index-D2h17YsO.js` 374.12 kB. |

Not run at this checkpoint: `npm run test:unit`, targeted catalogue-runner tests, and every browser/manual flow check.

Recorded anomaly: the client-test count is **128**, not the 138 carried in the earlier evidence below. Two commits deliberately rewrote and shrank client test files after that figure was taken — `7ccecbc` ("test: lock MVP onboarding retailer flow", `OnboardingPage.test.tsx` +52/-178) and `0382ea5` ("test: lock planner retailer choice", `tescoSelection.test.tsx` +41/-189) — while `35f095b` added 3 tests back. A net reduction is therefore consistent with the history, but no per-commit test count has been run to confirm that 138 → 128 is fully explained. This is an open observation, not a confirmed explanation. All 128 tests currently pass across 9 files.

### Earlier checkpoint evidence (superseded for the three commands above)

- Server unit tests: 766/766 passed at the recorded Tesco checkpoint.
- Client tests: 138/138 passed before the latest planner-session follow-up. See the anomaly note above.
- Typecheck: passed at that earlier checkpoint.
- Targeted catalogue-runner tests: 18/18 passed.

These figures describe an older commit and must not be cited as evidence for the current checkpoint.

## Remaining verification

- Fresh website visit starts at retailer selection.
- Aldi and Tesco generation each remain retailer-scoped.
- Regeneration keeps the same retailer.
- Start new plan returns to retailer selection.
- Recipe and shopping-list copy name the correct retailer.
- All 17 Tesco records have valid retailer scope, product ID, price, availability, category, and canonical URL.

## Documentation conflict

Some existing PRD and README language describes Aldi as the only active/selectable retailer. That remains correct for production, but the Tesco development branch now implements a direct Tesco planning flow. Future edits must label production and branch state explicitly instead of treating either statement as globally true.

## Status vocabulary

- **Implemented:** present in branch code.
- **Verified:** supported by a named check run against the stated commit.
- **Committed/pushed:** present in Git history/remote branch.
- **Merged:** incorporated into the target branch.
- **Deployed:** running in an identified environment.

Never promote an item to a later state without evidence.

