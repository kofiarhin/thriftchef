/**
 * A section of a retailer's catalogue worth crawling.
 *
 * Adapters may hard-code these or discover them at run time; the runner only
 * needs a stable key for deduplication, a URL to start at, and the breadcrumb
 * the products found there belong to.
 */
export interface RetailerCategory {
  /** Stable across runs, so a resumed crawl matches up with an earlier one. */
  key: string;
  url: string;
  categoryPath: string[];
  enabled: boolean;
}
