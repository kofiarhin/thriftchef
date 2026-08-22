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
import { TescoAdapter, type TescoAdapterOptions } from "./tesco/tescoAdapter";

export const catalogueAdapters = new RetailerAdapterRegistry()
  .register(new AldiAdapter())
  // Registered while the Tesco retailer record is still `development`: the
  // adapter has to exist for a diagnostic to run at all, and registration is
  // not selectability. Nothing a customer can reach resolves it until the
  // record reaches `active`.
  .register(new TescoAdapter());

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

/**
 * A bounded Tesco adapter for a diagnostic or capped run.
 *
 * The cap is the only difference: extraction, selectors and verification are
 * identical, because a diagnostic that reads the site differently proves
 * nothing about the crawl it is standing in for.
 */
export function boundedTescoAdapter(
  maxProductsPerCategory: number,
  options: Omit<TescoAdapterOptions, "maxProductsPerCategory"> = {},
): TescoAdapter {
  return new TescoAdapter({ ...options, maxProductsPerCategory });
}

/** A full Tesco adapter carrying the scope's session configuration. */
export function configuredTescoAdapter(options: TescoAdapterOptions): TescoAdapter {
  return new TescoAdapter(options);
}
