/**
 * Runs a Tesco catalogue collection through the shared runner.
 *
 *   npm run tesco:diagnostic            # one category, five products, no writes
 *   npm run tesco:public-crawl           # public categories, 20 each, writes
 *   npm run tesco:crawl -- --store <id> # full crawl, may reconcile
 *
 * Two rules this script exists to enforce, both of which a crawl would
 * otherwise get wrong quietly:
 *
 *   - a persistent run must name its scope explicitly. Falling back to a
 *     default would write one shop's prices under another shop's name.
 *   - a persistent run must be pointed at a database somebody has looked at.
 *     The target is printed, redacted, before anything is written.
 *
 * Never against a production database from a developer machine, and never on a
 * web dyno: a crawl runs for hours and holds a browser open.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { getConfig, type AppConfig } from "../../../config/env";
import { runCatalogueCrawl } from "../../core/catalogueRunner";
import type { ResolvedCatalogueScope } from "../../core/retailerTypes";
import { resolveCatalogueScope } from "../../retailerRegistry";
import { RetailStore } from "../../../models/RetailStore";
import { Retailer } from "../../../models/Retailer";
import { boundedTescoAdapter, configuredTescoAdapter } from "../registry";
import { TESCO_DIAGNOSTIC_CATEGORY } from "./tescoCategories";
import { redactPostcode } from "./tescoSelectors";
import type { TescoAdapter } from "./tescoAdapter";

/** The bounded shape a first look at a retailer is allowed to take. */
const DIAGNOSTIC_PRODUCTS = 5;
const PUBLIC_CRAWL_PRODUCTS_PER_CATEGORY = 20;

const TESCO_RETAILER_SLUG = "tesco-uk";

interface Options {
  diagnostic: boolean;
  publicCatalogue: boolean;
  store: string | null;
  limit: number | null;
}

function parseOptions(argv: string[], config: AppConfig): Options {
  const flagIndex = argv.indexOf("--store");
  const fromFlag = flagIndex >= 0 ? argv[flagIndex + 1] : undefined;
  const limitIndex = argv.indexOf("--limit");
  const limitText = limitIndex >= 0 ? argv[limitIndex + 1] : undefined;
  const limit = limitText ? Number(limitText) : null;

  if (limit !== null && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    throw new Error("--limit must be an integer between 1 and 100.");
  }

  const diagnostic = argv.includes("--diagnostic");
  const publicCatalogue = argv.includes("--public");

  if (diagnostic && publicCatalogue) {
    throw new Error("Choose either --diagnostic or --public, not both.");
  }

  return {
    diagnostic,
    publicCatalogue,
    store: fromFlag ?? config.tesco.storeId,
    limit,
  };
}

/**
 * A connection string reduced to what identifies the target and nothing that
 * authenticates to it.
 *
 * Printed before every persistent run: the failure this prevents is a local
 * command pointed at production, and the only reliable defence is a person
 * reading the target before it is written to.
 */
function describeDatabase(uri: string): string {
  try {
    const parsed = new URL(uri);
    const database = parsed.pathname.replace(/^\//, "") || "(default)";

    return `${parsed.protocol}//${parsed.hostname}/${database}`;
  } catch {
    return "(unparseable MONGODB_URI)";
  }
}

/**
 * Valid but deliberately synthetic ids. A diagnostic never persists them, and
 * they are obviously not real if one ever appeared in a record.
 */
function diagnosticScope(config: AppConfig, store: string): ResolvedCatalogueScope {
  return {
    retailerId: "000000000000000000000003",
    retailerSlug: TESCO_RETAILER_SLUG,
    retailerName: "Tesco UK",
    storeId: "000000000000000000000004",
    storeSlug: store,
    storeName: "Tesco diagnostic scope",
    currency: "GBP",
    countryCode: "GB",
    catalogueScope: "store",
    status: "development",
    staleAfterHours: config.catalogueStaleAfterHours,
  };
}

/**
 * The session configuration for the scope being crawled.
 *
 * Read from the seeded store record rather than from the environment wherever
 * possible: the store row is what the catalogue is written under, so a crawl
 * configured from anywhere else can disagree with the data it produces. The
 * environment supplies operational overrides only.
 */
async function sessionOptionsFor(
  config: AppConfig,
  scope: ResolvedCatalogueScope,
): Promise<{ postcode: string | null; expectedLocationText: string }> {
  const retailer = await Retailer.findOne({ slug: TESCO_RETAILER_SLUG }).lean();
  const store = retailer
    ? await RetailStore.findOne({
        retailerId: retailer._id,
        externalStoreId: scope.storeSlug,
      }).lean()
    : null;

  return {
    postcode: config.tesco.postcode ?? store?.postcode ?? null,
    expectedLocationText:
      config.tesco.expectedLocationText ?? store?.name ?? scope.storeName,
  };
}

function printDiagnosticSummary(adapter: TescoAdapter): void {
  console.log("\nTesco extraction diagnostics");
  console.log(JSON.stringify(adapter.diagnostics, null, 2));
}

async function main(): Promise<void> {
  const config = getConfig();
  const options = parseOptions(process.argv.slice(2), config);

  // A crawl that guesses its scope writes one shop's prices under another
  // shop's name, and nothing downstream can tell afterwards.
  if (!options.store) {
    throw new Error(
      "No Tesco scope was named. Pass --store <externalStoreId> or set TESCO_STORE_ID. " +
        "There is deliberately no default: a crawl must say which catalogue it is collecting.",
    );
  }

  let connected = false;

  if (!options.diagnostic) {
    console.log(`Tesco crawl target database: ${describeDatabase(config.mongodbUri)}`);
    console.log(
      "This run writes products. Confirm the target is not production before continuing.",
    );

    await mongoose.connect(config.mongodbUri);
    connected = true;
  }

  try {
    const scope = options.diagnostic
      ? diagnosticScope(config, options.store)
      : await resolveCatalogueScope(
          { retailer: TESCO_RETAILER_SLUG, store: options.store },
          // A crawl may legitimately fill a catalogue that is not yet
          // selectable — that is how a retailer reaches `active` at all.
          { requireSelectable: false },
        );

    if (options.publicCatalogue && scope.catalogueScope !== "national") {
      throw new Error(
        "Tesco public persistence requires catalogueScope=national. Run npm run catalogue:bootstrap first.",
      );
    }

    const session = options.diagnostic || options.publicCatalogue
      ? {
          postcode: null,
          expectedLocationText: "Tesco public catalogue",
        }
      : await sessionOptionsFor(config, scope);

    console.log(
      `Tesco scope: store=${scope.storeSlug}, mode=${config.tesco.fulfilmentMode}, area=${redactPostcode(session.postcode)}.`,
    );

    // A public diagnostic reads only what the anonymous page publishes. It
    // neither tries to establish a postcode session nor claims that it proved
    // a store. Persistent crawls keep the full session configuration and the
    // runner's fail-closed store gate.
    const adapterOptions = options.diagnostic || options.publicCatalogue
      ? {}
      : {
          postcode: session.postcode,
          fulfilmentMode: config.tesco.fulfilmentMode,
          expectedLocationText: session.expectedLocationText,
        };

    const productLimit = options.diagnostic
      ? DIAGNOSTIC_PRODUCTS
      : options.publicCatalogue
        ? (options.limit ?? PUBLIC_CRAWL_PRODUCTS_PER_CATEGORY)
        : config.tesco.maxProductsPerCategory;

    const adapter = options.diagnostic || options.publicCatalogue
      ? boundedTescoAdapter(
          productLimit ?? PUBLIC_CRAWL_PRODUCTS_PER_CATEGORY,
          adapterOptions,
        )
      : configuredTescoAdapter({
          ...adapterOptions,
          ...(productLimit
            ? { maxProductsPerCategory: productLimit }
            : {}),
        });

    // One named department rather than whichever category happens to sort
    // first: a diagnostic proves the selectors still match, so it has to open
    // the route that has actually been confirmed to render.
    const categories = options.diagnostic ? [TESCO_DIAGNOSTIC_CATEGORY] : undefined;

    const summary = await runCatalogueCrawl({
      scope,
      adapter,
      expectedStoreText: session.expectedLocationText,
      // Visible by default while the fulfilment-location step is still being
      // confirmed by a person.
      headless: config.tesco.headless,
      mode: options.diagnostic
        ? "diagnostic"
        : options.publicCatalogue
          ? "bounded"
          : "full",
      maxProductsPerCategory: productLimit ?? undefined,
      categories,
      // A diagnostic writes nothing and retires nothing. It exists to prove
      // the selectors still match, and that needs no database at all.
      persist: !options.diagnostic,
      reconcile: !options.diagnostic && !options.publicCatalogue,
      verifyStoreSelection: !options.diagnostic && !options.publicCatalogue,
      requireProducts: options.diagnostic || options.publicCatalogue,
    });

    console.log("\nCatalogue crawl complete");
    console.log(JSON.stringify(summary, null, 2));
    printDiagnosticSummary(adapter);

    if (
      !summary.storeSelectionVerified &&
      !options.diagnostic &&
      !options.publicCatalogue
    ) {
      console.log(
        "\nTESCO_SCOPE_UNVERIFIED: the session could not prove which Tesco scope it was reading.",
      );
      console.log(
        "Nothing was written. Re-run with a visible browser and confirm the fulfilment location.",
      );
    }

    if (options.publicCatalogue) {
      console.log(
        `\nSaved ${summary.inserted + summary.updated} Tesco public-catalogue products without postcode attribution.`,
      );
    }

    if (summary.reconciled) {
      console.log(`\nRetired ${summary.offersRetired} offers no longer on sale.`);
      console.log(
        `Undo with: npm run catalogue:undo-reconciliation ${summary.crawlRunId}`,
      );
    } else {
      console.log(
        `\nAvailability was left untouched: ${summary.reconciliationRefusals.join(", ") || "not reconciled"}`,
      );
    }
  } finally {
    if (connected) await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("\nCatalogue crawl failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
