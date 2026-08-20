/**
 * Runs an Aldi catalogue collection through the shared runner.
 *
 *   npm run aldi:crawl                  # full crawl, may reconcile
 *   npm run aldi:diagnostic             # one category, five products, no writes
 *
 * Never against a production database from a developer machine, and never on a
 * web dyno: a crawl runs for hours and holds a browser open.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { getConfig } from "../../../config/env";
import { runCatalogueCrawl } from "../../core/catalogueRunner";
import { resolveCatalogueScope } from "../../retailerRegistry";
import { boundedAldiAdapter, catalogueAdapters } from "../registry";

/** The bounded shape a first look at a retailer is allowed to take. */
const DIAGNOSTIC_PRODUCTS = 5;
const DIAGNOSTIC_CATEGORIES = 1;

function parseOptionalPositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

async function main(): Promise<void> {
  const config = getConfig();
  const diagnostic = process.argv.includes("--diagnostic");

  await mongoose.connect(config.mongodbUri);

  try {
    const scope = await resolveCatalogueScope(
      { retailer: config.defaultRetailerSlug, store: config.aldi.storeId },
      // A crawl may legitimately fill a catalogue that is not yet selectable —
      // that is how a retailer reaches `active` in the first place.
      { requireSelectable: false },
    );

    const adapter = diagnostic
      ? boundedAldiAdapter(DIAGNOSTIC_PRODUCTS)
      : catalogueAdapters.get("aldi");

    const categories = diagnostic
      ? (await adapter.discoverCategories()).slice(0, DIAGNOSTIC_CATEGORIES)
      : undefined;

    const summary = await runCatalogueCrawl({
      scope,
      adapter,
      expectedStoreText: config.aldi.expectedStoreText,
      headless: config.aldi.headless,
      mode: diagnostic ? "diagnostic" : "full",
      maxProductsPerCategory: diagnostic
        ? DIAGNOSTIC_PRODUCTS
        : parseOptionalPositiveInteger(process.env.ALDI_MAX_PRODUCTS_PER_CATEGORY),
      categories,
      // A diagnostic writes nothing and retires nothing. It exists to prove
      // the selectors still match, and that needs no database at all.
      persist: !diagnostic,
      reconcile: !diagnostic,
    });

    console.log("\nCatalogue crawl complete");
    console.log(JSON.stringify(summary, null, 2));

    if (summary.reconciled) {
      console.log(`\nRetired ${summary.offersRetired} offers no longer on sale.`);
      console.log(
        `Undo with: npm run catalogue:undo-reconciliation ${summary.crawlRunId}`,
      );
    } else {
      console.log(
        `\nAvailability was left untouched: ${summary.reconciliationRefusals.join(", ")}`,
      );
    }
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("\nCatalogue crawl failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
