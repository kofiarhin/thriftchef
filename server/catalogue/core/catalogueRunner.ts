/**
 * The shared catalogue runner.
 *
 * Owns everything that is the same for every supermarket: the Crawlee and
 * Playwright lifecycle, the request queue, concurrency and retries, run
 * identity and status, normalisation, allergen safety, batched persistence,
 * price history, and the decision about whether the run earned the right to
 * retire missing products.
 *
 * Adapters own only what a particular shop's website does. That split is what
 * makes a second retailer an adapter plus a row, rather than a second copy of
 * every bug fixed here.
 */

import { randomUUID } from "node:crypto";
import { PlaywrightCrawler, Request, log } from "crawlee";
import { Types } from "mongoose";
import { CrawlRun, type CrawlMode, type CrawlRunError } from "../../models/CrawlRun";
import { Product } from "../../models/Product";
import { ProductOffer } from "../../models/ProductOffer";
import type {
  AdapterContext,
  RetailerCatalogueAdapter,
  RetailerListingProduct,
} from "../contracts/retailerAdapter";
import type { RetailerCategory } from "../contracts/retailerCategory";
import {
  reconcileAvailability,
  type ReconciliationRefusal,
} from "./availabilityReconciliation";
import { mergeCategoryPaths, normalizeCatalogueProduct } from "./catalogueNormalization";
import { CatalogueCoverageTracker } from "./catalogueCoverage";
import { evaluateCatalogueSafety } from "./catalogueSafety";
import { persistCatalogueBatch, type AssessedProduct } from "./cataloguePersistence";
import type { CatalogueScopeKind, ResolvedCatalogueScope } from "./retailerTypes";

/** Products are written in batches so an interrupted crawl keeps its work. */
const PERSIST_BATCH_SIZE = 50;

/** Bounded so a wholesale failure cannot write a million-row error array. */
const MAX_RECORDED_ERRORS = 50;

export interface CrawlOptions {
  scope: ResolvedCatalogueScope;
  adapter: RetailerCatalogueAdapter;
  expectedStoreText: string;
  headless: boolean;
  /**
   * `full` is the only mode that may later retire missing products. A capped
   * or single-category run must declare itself `bounded`: it did not look at
   * the whole shop and cannot tell "gone" from "not visited".
   */
  mode: CrawlMode;
  /** Restricts the sweep. Present means the run is not `full` by definition. */
  maxProductsPerCategory?: number;
  categories?: RetailerCategory[];
  /** Off for a diagnostic: nothing is written and nothing is retired. */
  persist?: boolean;
  reconcile?: boolean;
  /**
   * Off only for a no-write public-catalogue diagnostic. This lets an adapter
   * inspect public product pages without pretending that an anonymous session
   * proved a store scope. Persistent crawls may never disable verification.
   */
  verifyStoreSelection?: boolean;
}

export interface CrawlSummary {
  crawlRunId: string;
  retailer: string;
  store: string;
  adapterKey: string;
  adapterVersion: string;
  mode: CrawlMode;
  status: "completed" | "completed_with_warnings" | "failed";
  storeSelectionVerified: boolean;
  /** True only when a no-write run actually returned public product data. */
  publicCatalogueExtracted: boolean;
  categoriesRequested: number;
  categoriesCompleted: number;
  productLinksDiscovered: number;
  productsScraped: number;
  inserted: number;
  updated: number;
  priceChanges: number;
  skipped: number;
  issues: CrawlRunError[];
  reconciled: boolean;
  reconciliationRefusals: ReconciliationRefusal[];
  offersRetired: number;
  /** Populated only for a no-write diagnostic, for inspection by a human. */
  sample?: AssessedProduct[];
}

/**
 * Why a run is not allowed to write products.
 *
 * `STORE_SCOPE_UNVERIFIED` is the one that matters: a store-scoped session
 * that could not prove which store it was reading may have been reading a
 * different branch's prices and availability, and once those are written they
 * are indistinguishable from correct ones.
 */
export type WritePreconditionRefusal = "NOT_PERSISTING" | "STORE_SCOPE_UNVERIFIED";

export interface WritePrecondition {
  mayWrite: boolean;
  refusal: WritePreconditionRefusal | null;
}

/**
 * Whether this run may write products yet.
 *
 * Expressed as scope policy rather than as a rule about any one retailer: a
 * store-scoped catalogue has per-branch prices, so the branch must be proven
 * before anything is written; a national catalogue has one set of prices and
 * nothing to confuse them with.
 *
 * Checked before the first batch rather than rolled back afterwards. A partial
 * write followed by a failed rollback is exactly the state that cannot be
 * distinguished from a good crawl later.
 */
export function assessWritePrecondition(input: {
  persist: boolean;
  catalogueScope: CatalogueScopeKind;
  storeSelectionVerified: boolean;
}): WritePrecondition {
  if (!input.persist) return { mayWrite: false, refusal: "NOT_PERSISTING" };

  if (input.catalogueScope === "store" && !input.storeSelectionVerified) {
    return { mayWrite: false, refusal: "STORE_SCOPE_UNVERIFIED" };
  }

  return { mayWrite: true, refusal: null };
}

interface ListRequestData {
  label: "LIST";
  category: RetailerCategory;
  page: number;
}

interface DetailRequestData {
  label: "DETAIL";
  retailerProductId: string;
}

/**
 * A detail request belongs to one crawl, even when Crawlee keeps its handled
 * request queue on disk between processes. Without the run id, a product read
 * yesterday is silently skipped by today's diagnostic or refresh.
 */
export function detailRequestKey(
  adapterKey: string,
  retailerProductId: string,
  crawlRunId: string,
): string {
  return `${adapterKey}-product:${retailerProductId}:${crawlRunId}`;
}

/**
 * Runs one catalogue collection, start to finish.
 *
 * The shape of this function is dictated by one fact: a full crawl runs for
 * hours and can be interrupted at any point. Products are therefore flushed in
 * batches as they complete rather than accumulated, the run's status records
 * what actually happened rather than what was intended, and reconciliation is
 * a separate decision made after the fact from the recorded evidence.
 */
export async function runCatalogueCrawl(
  options: CrawlOptions,
): Promise<CrawlSummary> {
  const { scope, adapter } = options;
  const persist = options.persist ?? true;

  if (persist && options.verifyStoreSelection === false) {
    throw new Error("A persistent crawl cannot skip store verification.");
  }

  // A capped run is bounded whatever the caller says. Letting it call itself
  // `full` would let it retire products it never had a chance to see.
  const mode: CrawlMode = options.maxProductsPerCategory ? "bounded" : options.mode;

  if (persist) {
    // Explicit, before any write. A unique index built mid-crawl over a
    // collection with duplicates fails half way and leaves a partial state.
    await Product.createIndexes();
    await ProductOffer.createIndexes();
  }

  // Diagnostics are deliberately database-free. They still get an in-memory
  // run id so request keys and the returned summary remain traceable, but no
  // CrawlRun document is created or updated.
  let runId: Types.ObjectId | null = null;
  let crawlRunId: string = randomUUID();

  if (persist) {
    const run = await CrawlRun.create({
      retailerId: new Types.ObjectId(scope.retailerId),
      storeId: new Types.ObjectId(scope.storeId),
      adapterKey: adapter.adapterKey,
      adapterVersion: adapter.adapterVersion,
      mode,
      status: "running",
      startedAt: new Date(),
    });

    runId = run._id;
    crawlRunId = run._id.toString();
  }

  const listingById = new Map<string, RetailerListingProduct>();
  const scrapedById = new Map<string, AssessedProduct>();
  const issues: CrawlRunError[] = [];
  const coverage = new CatalogueCoverageTracker();
  const sample: AssessedProduct[] = [];

  let skipped = 0;
  let storeSelectionVerified = false;
  let sessionPrepared = false;
  /** Set when a store-scoped persistent run failed to prove its store. */
  let scopeUnverified = false;
  let categoriesRequested = 0;

  const unpersisted: AssessedProduct[] = [];
  const totals = { inserted: 0, updated: 0, priceChanges: 0 };

  function note(type: string, url: string, message: string): void {
    if (issues.length < MAX_RECORDED_ERRORS * 4) issues.push({ type, url, message });
  }

  async function flush(force = false): Promise<void> {
    if (!persist || unpersisted.length === 0) return;
    if (!force && unpersisted.length < PERSIST_BATCH_SIZE) return;

    // The last gate before the database, checked on every batch rather than
    // once at the start: a run that lost its verified session mid-crawl must
    // stop writing at that point, not carry on with what it staged earlier.
    const precondition = assessWritePrecondition({
      persist,
      catalogueScope: scope.catalogueScope,
      storeSelectionVerified,
    });

    if (!precondition.mayWrite) {
      unpersisted.length = 0;
      return;
    }

    const batch = unpersisted.splice(0, unpersisted.length);
    const result = await persistCatalogueBatch(batch, scope, crawlRunId);

    totals.inserted += result.inserted;
    totals.updated += result.updated;
    totals.priceChanges += result.priceChanges;

    log.info(
      `Persisted ${batch.length} products (running totals: ${totals.inserted} inserted, ${totals.updated} updated).`,
    );
  }

  function contextFor(page: AdapterContext["page"]): AdapterContext {
    return {
      page,
      externalStoreId: scope.storeSlug,
      expectedStoreText: options.expectedStoreText,
      log: (message) => log.info(message),
    };
  }

  const crawler = new PlaywrightCrawler({
    // Deliberately serial. A retailer's pacing policy is a courtesy and a
    // condition of access, not a performance knob.
    maxConcurrency: 1,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 180,
    navigationTimeoutSecs: 90,
    launchContext: {
      launchOptions: {
        headless: options.headless,
        args: [
          "--disable-blink-features=AutomationControlled",
          "--disable-dev-shm-usage",
          "--lang=en-GB",
        ],
      },
    },
    preNavigationHooks: [
      async ({ page }) => {
        page.setDefaultTimeout(60_000);
        page.setDefaultNavigationTimeout(90_000);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setExtraHTTPHeaders({ "accept-language": "en-GB,en;q=0.9" });

        // Adapter-supplied, so a retailer that needs different preparation
        // gets it without the runner knowing why.
        if (adapter.initScript) await page.addInitScript(adapter.initScript);
      },
    ],
    async requestHandler({ page, request }) {
      const context = contextFor(page);
      const data = request.userData as ListRequestData | DetailRequestData;

      // Once verification has failed on a run that needs it, every remaining
      // request is pointless: nothing it extracts may be written.
      if (scopeUnverified) return;

      if (!sessionPrepared) {
        await adapter.prepareSession(context);
        sessionPrepared = true;

        // Verified here, before any writable work is queued, rather than after
        // the first listing. Staging products and hoping to write them later
        // makes the failure a rollback problem; refusing up front makes it a
        // run that did nothing.
        if (options.verifyStoreSelection !== false) {
          storeSelectionVerified = await adapter
            .verifyStoreSelection(context)
            .catch(() => false);
        }

        const precondition = assessWritePrecondition({
          persist,
          catalogueScope: scope.catalogueScope,
          storeSelectionVerified,
        });

        if (persist && precondition.refusal === "STORE_SCOPE_UNVERIFIED") {
          scopeUnverified = true;
          note(
            "STORE_SCOPE_UNVERIFIED",
            request.url,
            `The ${scope.retailerSlug} session could not prove it was reading ${scope.storeSlug}. No products were written.`,
          );
          return;
        }
      }

      if (data.label === "LIST") {
        const result = await adapter.extractListingPage({
          context,
          category: data.category,
          page: data.page,
        });

        skipped += result.skipped;

        const nextRequests = result.nextPages.map((url, index) => ({
          url,
          uniqueKey: `${adapter.adapterKey}-category:${data.category.key}:${index + 2}:${crawlRunId}`,
          userData: {
            label: "LIST",
            category: data.category,
            page: index + 2,
          } satisfies ListRequestData,
        }));

        for (const nextRequest of nextRequests) {
          coverage.expect(data.category.key, nextRequest.uniqueKey);
        }

        if (nextRequests.length > 0) {
          await crawler.addRequests(nextRequests);
        }

        for (const product of result.products) {
          const existing = listingById.get(product.retailerProductId);
          listingById.set(product.retailerProductId, {
            ...(existing ?? product),
            ...product,
            categoryPaths: mergeCategoryPaths(
              existing?.categoryPaths ?? [],
              product.categoryPaths,
            ),
          });
        }

        await crawler.addRequests(
          result.products.map((product) => ({
            url: product.productUrl,
            uniqueKey: detailRequestKey(
              adapter.adapterKey,
              product.retailerProductId,
              crawlRunId,
            ),
            userData: {
              label: "DETAIL",
              retailerProductId: product.retailerProductId,
            } satisfies DetailRequestData,
          })),
        );

        // A category is complete only when every page it disclosed completed.
        // Marking page 1 as the category would let a failed later page retire
        // products that were never observed.
        coverage.complete(data.category.key, request.uniqueKey);

        log.info(
          `${adapter.adapterKey} ${data.category.key} (page ${data.page}): ${result.products.length} product links.`,
        );
        return;
      }

      const listing = listingById.get(data.retailerProductId);
      if (!listing) {
        skipped += 1;
        note(
          "MISSING_LISTING_CONTEXT",
          request.url,
          `No listing data for ${data.retailerProductId}.`,
        );
        return;
      }

      const candidate = await adapter.extractProduct({ context, listing });
      if (!candidate) {
        skipped += 1;
        note(
          "INVALID_PRODUCT_DATA",
          request.url,
          "The product was missing a stable id, a name, or a price.",
        );
        return;
      }

      // The runner validates every adapter's output the same way. An adapter
      // that has started matching the wrong element returns plausible-looking
      // rubbish rather than throwing, and this is where that is caught.
      const normalized = normalizeCatalogueProduct(
        { ...candidate, categoryPaths: mergeCategoryPaths(candidate.categoryPaths, listing.categoryPaths) },
        adapter.allowedHosts,
      );

      if (!normalized.product) {
        skipped += 1;
        note(
          "NORMALIZATION_REJECTED",
          request.url,
          normalized.issues.join(", "),
        );
        return;
      }

      // Safety is the runner's judgement, never the adapter's: it is the one
      // verdict a user with an allergy relies on.
      const assessed: AssessedProduct = {
        ...normalized.product,
        ...evaluateCatalogueSafety(
          normalized.product.ingredientsRaw,
          normalized.product.allergenAdviceRaw,
          {
            name: normalized.product.name,
            brand: normalized.product.brand,
            description: normalized.product.description,
            categoryPaths: normalized.product.categoryPaths,
          },
        ),
      };

      scrapedById.set(assessed.retailerProductId, assessed);

      if (persist) {
        unpersisted.push(assessed);
        await flush();
      } else if (sample.length < 20) {
        sample.push(assessed);
      }
    },
    failedRequestHandler({ request }, error) {
      note(
        "REQUEST_FAILED",
        request.url,
        error instanceof Error ? error.message : String(error),
      );
    },
  });

  let crawlFailed = false;

  try {
    const categories = options.categories ?? (await adapter.discoverCategories());
    categoriesRequested = categories.length;

    if (categories.length === 0) {
      throw new Error(`No enabled categories are configured for ${adapter.adapterKey}.`);
    }

    const initialRequests = categories.map(
      (category) =>
        new Request({
          url: category.url,
          uniqueKey: `${adapter.adapterKey}-category:${category.key}:1:${crawlRunId}`,
          userData: {
            label: "LIST",
            category,
            page: 1,
          } satisfies ListRequestData,
        }),
    );

    for (const request of initialRequests) {
      const data = request.userData as ListRequestData;
      coverage.expect(data.category.key, request.uniqueKey);
    }

    await crawler.run(initialRequests);
  } catch (error) {
    crawlFailed = true;
    note(
      "CRAWL_FAILED",
      "",
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    // Keep whatever completed, even if the crawl threw part way through.
    await flush(true);
  }

  const categoriesCompleted = coverage.completedCategoryCount();

  const publicCatalogueExtracted = !persist && scrapedById.size > 0;

  // A diagnostic exists to prove that public catalogue data can actually be
  // returned. An empty shell, delayed challenge page or selector miss must not
  // report success merely because it produced no explicit browser error.
  if (!persist && !publicCatalogueExtracted) {
    crawlFailed = true;
    note(
      "PUBLIC_CATALOGUE_EMPTY",
      "",
      "The public diagnostic completed without extracting any products.",
    );
  }

  // A run that refused to write is a failed run, not a quiet one. Recording it
  // as completed would leave an operator reading zero products as an empty
  // shop rather than an unverified session.
  if (scopeUnverified) crawlFailed = true;

  const status: CrawlSummary["status"] = crawlFailed
    ? "failed"
    : issues.length > 0
      ? "completed_with_warnings"
      : "completed";

  if (runId) {
    await CrawlRun.updateOne(
      { _id: runId },
      {
        $set: {
          status,
          completedAt: new Date(),
          categoriesRequested,
          categoriesCompleted,
          productsDiscovered: scrapedById.size,
          productsInserted: totals.inserted,
          productsUpdated: totals.updated,
          priceChanges: totals.priceChanges,
          failures: skipped + issues.length,
          storeSelectionVerified,
          errors: issues.slice(0, MAX_RECORDED_ERRORS),
        },
      },
    );
  }

  // Reconciliation reads the recorded run rather than the in-memory totals, so
  // it judges what was actually written down — the same evidence an operator
  // would see afterwards.
  let reconciled = false;
  let reconciliationRefusals: ReconciliationRefusal[] = [];
  let offersRetired = 0;

  if (persist && runId && (options.reconcile ?? true)) {
    const recorded = await CrawlRun.findById(runId).orFail();
    const result = await reconcileAvailability(recorded.toObject(), scope);

    reconciled = result.reconciled;
    reconciliationRefusals = result.refusals;
    offersRetired = result.offersRetired;

    if (reconciled) {
      await CrawlRun.updateOne(
        { _id: runId },
        { $set: { availabilityReconciled: true, offersRetired } },
      );
    }
  } else {
    reconciliationRefusals = ["NOT_A_FULL_CRAWL"];
  }

  return {
    crawlRunId,
    retailer: scope.retailerSlug,
    store: scope.storeSlug,
    adapterKey: adapter.adapterKey,
    adapterVersion: adapter.adapterVersion,
    mode,
    status,
    storeSelectionVerified,
    publicCatalogueExtracted,
    categoriesRequested,
    categoriesCompleted,
    productLinksDiscovered: listingById.size,
    productsScraped: scrapedById.size,
    inserted: totals.inserted,
    updated: totals.updated,
    priceChanges: totals.priceChanges,
    skipped,
    issues,
    reconciled,
    reconciliationRefusals,
    offersRetired,
    ...(persist ? {} : { sample }),
  };
}
