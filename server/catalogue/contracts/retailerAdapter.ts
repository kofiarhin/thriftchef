/**
 * The boundary between "how this shop's website works" and "how ThriftChef
 * collects a catalogue".
 *
 * An adapter knows about selectors, cookie banners, postcode forms and
 * pagination. It knows nothing about MongoDB, crawl runs, retries, batching,
 * allergen inference or availability. Everything on that side belongs to the
 * shared runner, and keeping it there is what stops the second retailer from
 * becoming a second copy of the first one's persistence bugs.
 */

import type { Page } from "playwright";
import type { NormalizedCatalogueProduct } from "./normalizedCatalogueProduct";
import type { RetailerCategory } from "./retailerCategory";

/** What the runner hands an adapter for one page of work. */
export interface AdapterContext {
  page: Page;
  /** The store the run is collecting, in the retailer's own vocabulary. */
  externalStoreId: string;
  /** Text the adapter should find on the page to prove the store is selected. */
  expectedStoreText: string;
  log: (message: string) => void;
}

/** A product seen on a listing page, before its detail page is read. */
export interface RetailerListingProduct {
  retailerProductId: string;
  productUrl: string;
  name: string | null;
  brand: string | null;
  packageSizeRaw: string | null;
  comparisonPriceRaw: string | null;
  priceText: string | null;
  imageUrl: string | null;
  categoryPaths: string[][];
}

export interface ListingPageResult {
  products: RetailerListingProduct[];
  /** Further listing URLs discovered here; the runner deduplicates them. */
  nextPages: string[];
  /** Tiles the adapter saw but could not read. Feeds the failure-rate check. */
  skipped: number;
}

export interface RetailerCatalogueAdapter {
  /** Chosen by the retailer record's `adapterKey`. */
  readonly adapterKey: string;
  /** Bumped when extraction changes, so a crawl run records what produced it. */
  readonly adapterVersion: string;

  /**
   * Hosts this adapter is allowed to visit.
   *
   * The runner enforces it. An adapter that could be handed an arbitrary URL
   * is a server-side request forgery waiting to happen, so the allowed hosts
   * are declared by the adapter and never taken from a crawl request.
   */
  readonly allowedHosts: readonly string[];

  /**
   * Script injected before every navigation, if the retailer needs one.
   *
   * Aldi prompts for geolocation to pick a store, and an unanswered native
   * prompt blocks a crawl indefinitely — so it denies geolocation up front.
   * A retailer needing nothing simply omits this.
   */
  readonly initScript?: string;

  /** Cookie banners, consent, and selecting the requested store. */
  prepareSession(context: AdapterContext): Promise<void>;

  /**
   * Whether the adapter could confirm it is looking at the requested store.
   *
   * Load-bearing: availability reconciliation refuses to run without it,
   * because an unverified session may have been reading a different branch.
   */
  verifyStoreSelection(context: AdapterContext): Promise<boolean>;

  /**
   * The sections of the catalogue worth crawling.
   *
   * Takes no page: both current adapters use a curated registry, because a
   * meal planner wants edible-grocery departments in a deliberate order rather
   * than whatever the site's navigation happens to list. A retailer that needs
   * live discovery will need this contract extended — which is a smaller
   * change than inventing a discovery mechanism now for a retailer that may
   * never need one.
   */
  discoverCategories(): Promise<RetailerCategory[]>;

  extractListingPage(input: {
    context: AdapterContext;
    category: RetailerCategory;
    page: number;
  }): Promise<ListingPageResult>;

  extractProduct(input: {
    context: AdapterContext;
    listing: RetailerListingProduct;
  }): Promise<NormalizedCatalogueProduct | null>;
}

/**
 * The adapters this build can run.
 *
 * A registry rather than a switch: a retailer record names an `adapterKey`,
 * and activating a supermarket is a database row plus an entry here — never a
 * change to planning logic or collection topology.
 */
export class RetailerAdapterRegistry {
  private readonly adapters = new Map<string, RetailerCatalogueAdapter>();

  register(adapter: RetailerCatalogueAdapter): this {
    if (this.adapters.has(adapter.adapterKey)) {
      throw new Error(`Adapter "${adapter.adapterKey}" is already registered.`);
    }

    this.adapters.set(adapter.adapterKey, adapter);
    return this;
  }

  get(adapterKey: string): RetailerCatalogueAdapter {
    const adapter = this.adapters.get(adapterKey);

    if (!adapter) {
      throw new Error(
        `No catalogue adapter is registered for "${adapterKey}". ` +
          `Registered adapters: ${[...this.adapters.keys()].join(", ") || "none"}.`,
      );
    }

    return adapter;
  }

  has(adapterKey: string): boolean {
    return this.adapters.has(adapterKey);
  }

  keys(): string[] {
    return [...this.adapters.keys()].sort();
  }
}
