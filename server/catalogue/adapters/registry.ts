/**
 * The adapters this build can run.
 *
 * Registration is the whole of "adding a supermarket to the code": a retailer
 * record names an `adapterKey`, and the registry resolves it. Nothing about
 * planning, the database, or the crawl pipeline changes.
 *
 * A retailer whose adapter is registered but whose record is not `active` is
 * visible and unselectable — which is exactly how a new integration is meant
 * to sit while it is being validated.
 */

import { RetailerAdapterRegistry } from "../contracts/retailerAdapter";
import { AldiAdapter } from "./aldi/aldiAdapter";

export const catalogueAdapters = new RetailerAdapterRegistry().register(
  new AldiAdapter(),
);

/**
 * A bounded adapter instance for diagnostic runs.
 *
 * Constructed with a per-category cap, which makes every run using it
 * `bounded` in the runner and therefore permanently ineligible to retire a
 * product.
 */
export function boundedAldiAdapter(maxProductsPerCategory: number): AldiAdapter {
  return new AldiAdapter(maxProductsPerCategory);
}
