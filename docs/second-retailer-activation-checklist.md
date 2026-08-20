# Second retailer: activation checklist

**Status:** Blocked on external evidence. No second retailer is implemented,
and none should be until every item in section 1 is answered with evidence.

Discovery was attempted on 2026-08-20 and could not reach any UK grocery
catalogue page. What was checked, what it showed, and the exact blocker are
recorded in [`second-retailer-discovery-record.md`](./second-retailer-discovery-record.md).
Read that first — several boxes below already have partial answers.

The adapter platform is complete and a second retailer needs an adapter plus a
row — not a change to planning logic, the database topology, or the crawl
pipeline. What is deliberately *not* done is choosing one.

## Why this is a checklist and not an adapter

Picking a supermarket to scrape is a legal and technical decision, not a
coding one. It requires reading a specific retailer's terms, robots policy and
feed options, and confirming that their catalogue is accessible and stably
identified. None of that can be established from inside this repository, and
guessing produces an adapter that is either unlawful to run or breaks on the
first layout change.

So the platform is finished and the second retailer is left disabled.

## 1. Go / no-go, before any code

Each of these must be answered with a link or a document, not an assumption.

- [ ] Does the retailer publish an official or licensed product feed? Prefer it
      over crawling in every case.
- [ ] What do the site's terms of use say about automated access?
- [ ] What does `robots.txt` disallow, and at what crawl rate?
- [ ] Is the catalogue readable without an account?
- [ ] Does pricing require a postcode or store selection? If so, the retailer is
      `catalogueScope: "store"`.
- [ ] Is there a stable per-product identifier that is **not** derived from the
      product name?
- [ ] Are ingredients and allergen advice published? If not, products will be
      `inferred` at best, exactly as Aldi's are.
- [ ] What request rate is acceptable? This becomes `crawlPolicy`.

**Do not proceed while any box is unticked.**

## 2. Bounded diagnostic

The first run is deliberately tiny, and writes nothing:

- one retailer, one store or catalogue;
- one category;
- five products;
- a visible browser;
- JSON to stdout;
- **no database writes**, or an isolated test database only.

`npm run aldi:diagnostic` is the shape to copy. It is bounded by construction
and its crawl run is recorded as `mode: "bounded"`, which permanently disqualifies
it from retiring any product.

## 3. Adapter

Implement `RetailerCatalogueAdapter` in
`server/catalogue/adapters/<retailer>/`. The adapter owns only:

- allowed hosts (the SSRF boundary — never taken from a crawl request);
- cookie and consent handling;
- postcode or store selection, and `verifyStoreSelection`;
- categories, pagination, listing and detail selectors;
- stable product identity extraction.

It must **not** touch MongoDB, retries, batching, allergen inference or
availability. Those belong to the shared runner, and duplicating them is how
the second retailer inherits the first one's bugs instead of its fixes.

Save HTML fixtures under `server/testing/fixtures/<retailer>/` and pass
`server/catalogue/contracts/adapterContract.test.ts` **unmodified**. If a
contract test needs changing to accommodate the adapter, the adapter is wrong.

## 4. Registration

Add to the seed in `scripts/bootstrap-retailers.ts` with `status: "development"`,
then `npm run catalogue:bootstrap`. A non-`active` retailer is visible in the
picker but not selectable, so nothing user-facing changes.

## 5. Activation gates

Promote to `active` only when all of these hold:

- [ ] A trusted **full** crawl has completed with `storeSelectionVerified: true`,
      every category completed, and a failure rate under 10%.
- [ ] Minimum eligible-product coverage is met, with every culinary role the
      recipe templates require represented.
- [ ] `npm run benchmark:planner` shows no unacceptable regression against
      `server/testing/baseline/BENCHMARK.md`.
- [ ] Cross-retailer integrity tests pass with **zero** failures.
- [ ] Availability reconciliation has run once and been verified, with the undo
      path (`npm run catalogue:undo-reconciliation <runId>`) rehearsed.
- [ ] Customer-facing name, logo and any data-quality warnings are complete.

Then change `status` to `"active"` in the seed and re-run the bootstrap. That is
the whole activation: a seed change and a re-run, auditable in version control.

## 6. What has not been done

To be explicit, so nobody reads this document as a report of completed work:

- No second retailer has been chosen.
- No second adapter exists, disabled or otherwise.
- No retailer other than Aldi has been activated.
- No production crawl has been run, for any retailer.

## 7. Rollback

1. Set `status: "degraded"` or `"disabled"` in the seed; re-run the bootstrap.
2. New generation for that scope stops immediately; **saved plans stay readable**.
3. The last trusted catalogue is left intact.
4. If a bad crawl retired products, undo it by run id.
5. Repair the adapter, re-run the bounded diagnostic, then a full crawl.
6. Re-activate only after section 5 passes again.
