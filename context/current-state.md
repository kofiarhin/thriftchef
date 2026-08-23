# Current State

Snapshot source: development checkpoint `35f095b4bc1a9f8e6b8d4f4fc4f573e85239cec2` and recorded handoff evidence supplied on 23 August 2026.

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

- Server unit tests: 766/766 passed at the recorded Tesco checkpoint.
- Client tests: 138/138 passed before the latest planner-session follow-up.
- Typecheck: passed at that earlier checkpoint.
- Targeted catalogue-runner tests: 18/18 passed.

The latest planner-session checkpoint still requires an exact recorded run of:

```bash
npm run typecheck
npm run test:client
npm run build
```

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

