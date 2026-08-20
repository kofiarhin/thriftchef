# Second retailer: discovery record

**Date:** 2026-08-20
**Outcome:** **No retailer selected. No adapter written.**
**Reason:** The evidence required to choose one could not be obtained.

This is a record of what was actually checked and what it showed, so the
decision can be re-taken later without repeating the work — and so that nobody
mistakes "not done" for "not attempted".

## What was checked

Read-only. No crawl was run, no product page was harvested, and no retailer
was contacted.

### 1. Official or licensed feeds

Searched for official public product APIs from the major UK grocers.

**Finding: none exist.** No major UK supermarket — Tesco, Sainsbury's,
Waitrose, Morrisons — publishes an official public product-data API. What
exists commercially is third-party aggregation and scraping services
(Pepesto, Actowiz, and similar), and a shared product-description catalogue
(productDNA) used by some retailers for their own supply chain.

This matters more than it first appears. The plan's preference is explicit:
**prefer an official or licensed feed over crawling in every case.** With no
official feed available, every candidate falls back to crawling, which makes
the terms and robots position decisive rather than incidental.

A commercial aggregator is a real option but a different decision: it is a paid
dependency with its own licence terms, and it is outside the scope approved
here.

### 2. Robots policy

| Retailer | `robots.txt` | Result |
| --- | --- | --- |
| Tesco | `https://www.tesco.com/robots.txt` | **HTTP 403** — could not read |
| Sainsbury's | `https://www.sainsburys.co.uk/robots.txt` | **HTTP 403** — could not read |
| Waitrose | `https://www.waitrose.com/robots.txt` | **HTTP 403** — could not read |
| Morrisons (main) | `https://www.morrisons.com/robots.txt` | Readable: `Allow: /`, `Disallow: /draft/` |
| Morrisons (groceries) | `https://groceries.morrisons.com/robots.txt` | Readable — see below |

Morrisons groceries, verbatim directives observed:

```
User-agent: *
Disallow: /sso-login
Disallow: /previewer/*
Disallow: /api/
Disallow: /events/
```

No `Crawl-delay` is specified, and `/products/` and `/browse/` are not
disallowed.

**The `Disallow: /api/` line is the important one.** Modern grocery sites are
single-page applications whose catalogue arrives over an internal JSON API. If
Morrisons' product data is served from `/api/`, then the only efficient way to
read it is the one path their robots policy explicitly disallows — and the
permissive `/browse/` rule would be of no practical use. Establishing which is
the case requires observing a real category page, which is where discovery
stopped (below).

**Note on the three 403s:** a 403 on `robots.txt` tells us this fetcher was
blocked at the edge. It is *not* evidence of those retailers' crawling policy,
and it must not be recorded as such. It does mean their policy could not be
read, which is itself disqualifying: proceeding without having read the robots
file is not a decision anyone should sign off.

### 3. Terms of use

Morrisons' published **Terms & Conditions of Sale** contain no clause about
automated access, robots, spiders, scraping, data mining or systematic
retrieval.

That is a weaker finding than it sounds, for two reasons. Terms *of sale*
govern purchases, not site access; a separate website terms-of-use or
acceptable-use document may exist and was not located. And the absence of a
clause in one document is not permission — it is the absence of evidence either
way.

### 4. Catalogue accessibility, product identity, pagination, allergen data

**Not established. This is where discovery failed.**

Every attempt to observe a real Morrisons catalogue page was refused:

| URL | Result |
| --- | --- |
| `groceries.morrisons.com/browse` | HTTP 404 |
| `groceries.morrisons.com/browse/fresh-176738` | HTTP 404 |
| `groceries.morrisons.com/products/<slug>-<id>` | HTTP 404 |

Because no page could be observed, **none** of the following could be
determined:

- whether product data is server-rendered or loaded via the disallowed `/api/`;
- whether a postcode or delivery slot is required before prices appear;
- whether a stable product identifier exists that is not derived from the name;
- how categories and pagination are structured;
- what request rate is acceptable;
- whether ingredients and allergen advice are published at all.

Those six items are exactly the go/no-go criteria in the activation checklist.
Five of the eight boxes cannot be ticked.

## Why no adapter was written

An adapter is selectors, pagination logic, product-identity extraction and
allergen handling. Every one of those is a factual claim about a website that
could not be observed. Writing one now would mean inventing:

- a URL structure;
- a product-id format;
- a set of CSS selectors;
- a pagination mechanism;
- an allergen-data assumption.

Fixtures built from invented markup would pass their own tests and prove
nothing. Worse, they would *look* like evidence — a green contract suite
against fabricated HTML is more dangerous than no adapter at all, because it
invites someone to trust it.

The platform is finished and demonstrably works: the Aldi adapter runs entirely
behind `RetailerCatalogueAdapter`, and its fixture suite drives real Chromium
against saved HTML. A second adapter is a day's work **once there is a page to
write it against.**

## The exact blocker

> Read-only discovery could not reach any UK grocery catalogue page. Three of
> four candidate retailers refuse `robots.txt` to this client (HTTP 403), and
> the one whose robots policy is readable — Morrisons — returns HTTP 404 for
> every catalogue URL tried, while disallowing `/api/`, the path its
> single-page storefront most likely uses.

## What would unblock it

Any one of these, in preference order:

1. **A licensed feed.** Removes the terms and robots question entirely and is
   the plan's stated preference. Needs a commercial decision and a budget.
2. **A human-run observation session.** Someone opens one category page and one
   product page in a normal browser from a normal connection and saves the HTML.
   Two files are enough to write the adapter and its fixtures — and saving two
   pages by hand is not a crawl.
3. **Written confirmation from the retailer** that bounded automated access is
   permitted, together with an acceptable rate.

Option 2 is the cheapest and needs no budget. It is the recommended next step,
and it is a task for a person rather than for this agent.

## Sources

- [Do any UK supermarkets have an API? — Quora](https://www.quora.com/Do-any-UK-supermarkets-have-an-API)
- [Supermarket Sweep: How APIs Are Shaking up Grocery Store Business Models — Nordic APIs](https://nordicapis.com/supermarket-sweep-how-apis-are-shaking-up-grocery-store-business-models/)
- [Morrisons Terms & Conditions](https://groceries.morrisons.com/content/terms-and-conditions)
- `https://groceries.morrisons.com/robots.txt`, `https://www.morrisons.com/robots.txt` (fetched directly)
