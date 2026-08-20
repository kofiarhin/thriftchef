/**
 * Rehearses the whole catalogue migration against a throwaway database.
 *
 *   npm run catalogue:verify
 *
 * The unit tests prove each step in isolation. This proves the *sequence* an
 * operator actually runs — bootstrap, backfill, compare, switch reads,
 * reconcile, undo — in order, on one dataset, and prints the evidence at each
 * stage so a human can check it before doing any of it for real.
 *
 * It never reads `MONGODB_URI`. The database is created by
 * `mongodb-memory-server` on an ephemeral port and discarded at the end, so
 * there is no configuration under which this can touch development or
 * production data.
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  assessCrawlTrust,
  reconcileAvailability,
  undoReconciliation,
} from "../server/catalogue/core/availabilityReconciliation";
import {
  backfillProductOffers,
  bootstrapRetailers,
  rollbackProductOffers,
} from "../server/catalogue/core/catalogueMigrations";
import {
  compareCatalogueReads,
  loadCandidateProducts,
} from "../server/catalogue/core/catalogueReads";
import { toScope } from "../server/catalogue/retailerRegistry";
import { CrawlRun } from "../server/models/CrawlRun";
import { PriceHistory } from "../server/models/PriceHistory";
import { Product } from "../server/models/Product";
import { ProductOffer } from "../server/models/ProductOffer";
import { RetailStore } from "../server/models/RetailStore";
import { Retailer } from "../server/models/Retailer";
import type { ResolvedCatalogueScope } from "../server/catalogue/core/retailerTypes";

const SCOPE = { retailerSlug: "aldi-uk", storeSlug: "belper-de56-1ar" };
const LEGACY_PRODUCTS = 120;

const checks: Array<{ name: string; passed: boolean; detail: string }> = [];

function check(name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
  console.log(`  ${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

/** A catalogue as it exists before any of this ran: legacy fields only. */
async function seedLegacyCatalogue(): Promise<void> {
  const seenAt = new Date("2026-08-18T06:00:00.000Z");

  await Product.insertMany(
    Array.from({ length: LEGACY_PRODUCTS }, (_, index) => ({
      retailer: SCOPE.retailerSlug,
      storeId: SCOPE.storeSlug,
      retailerProductId: `legacy-${String(index).padStart(4, "0")}`,
      canonicalKey: `${SCOPE.retailerSlug}:${SCOPE.storeSlug}:legacy-${index}`,
      name: `Legacy Product ${index}`,
      categoryPaths: [["Food Cupboard", "Tins"]],
      pricePence: 100 + index,
      catalogueSafetyStatus: "inferred",
      eligibleForPlanning: index % 7 !== 0,
      available: true,
      productUrl: `https://www.aldi.co.uk/product/legacy-${index}`,
      lastCheckedAt: seenAt,
      lastSeenAt: seenAt,
      lastCrawlRunId: "pre-migration-run",
    })),
  );
}

async function scopeFor(): Promise<ResolvedCatalogueScope> {
  const retailer = await Retailer.findOne({ slug: SCOPE.retailerSlug }).orFail();
  const store = await RetailStore.findOne({
    retailerId: retailer._id,
    externalStoreId: SCOPE.storeSlug,
  }).orFail();

  return toScope(retailer.toObject(), store.toObject());
}

async function main(): Promise<void> {
  const server = await MongoMemoryServer.create();

  console.log("Isolated MongoDB started on an ephemeral port.");
  console.log("MONGODB_URI is deliberately not read by this script.\n");

  await mongoose.connect(server.getUri(), { dbName: "thriftchef-migration-rehearsal" });

  try {
    for (const model of [Retailer, RetailStore, CrawlRun, Product, ProductOffer, PriceHistory]) {
      await model.createIndexes();
    }

    await seedLegacyCatalogue();
    console.log(`Seeded ${LEGACY_PRODUCTS} legacy products.\n`);

    /* ---------------------------------------------------------- bootstrap */
    console.log("1. Bootstrap");

    const first = await bootstrapRetailers([
      {
        slug: "aldi-uk",
        name: "Aldi UK",
        adapterKey: "aldi",
        catalogueScope: "store",
        status: "active",
        stores: [
          {
            externalStoreId: SCOPE.storeSlug,
            name: "Aldi Belper",
            postcode: "DE56 1AR",
            scope: "physical",
          },
        ],
      },
    ]);

    check(
      "creates the retailer and store",
      first.retailersCreated === 1 && first.storesCreated === 1,
      `${first.retailersCreated} retailer, ${first.storesCreated} store`,
    );

    const second = await bootstrapRetailers([
      {
        slug: "aldi-uk",
        name: "Aldi UK",
        adapterKey: "aldi",
        catalogueScope: "store",
        status: "active",
        stores: [
          {
            externalStoreId: SCOPE.storeSlug,
            name: "Aldi Belper",
            postcode: "DE56 1AR",
            scope: "physical",
          },
        ],
      },
    ]);

    check(
      "bootstrap is idempotent",
      second.retailersCreated === 0 &&
        second.storesCreated === 0 &&
        (await Retailer.countDocuments({})) === 1,
      "a second run created nothing",
    );

    /* ----------------------------------------------------------- backfill */
    console.log("\n2. Backfill");

    const priceBefore = await Product.find({})
      .sort({ retailerProductId: 1 })
      .lean();

    // A small batch size on purpose: this is the interrupted-run shape, and a
    // migration that only works in one pass is not restartable.
    const backfill = await backfillProductOffers(SCOPE, { batchSize: 25 });

    check(
      "creates one offer per product",
      backfill.offersCreated === LEGACY_PRODUCTS &&
        (await ProductOffer.countDocuments({})) === LEGACY_PRODUCTS,
      `${backfill.offersCreated} offers`,
    );

    const repeat = await backfillProductOffers(SCOPE, { batchSize: 40 });

    check(
      "backfill is idempotent",
      repeat.offersCreated === 0 &&
        (await ProductOffer.countDocuments({})) === LEGACY_PRODUCTS,
      `re-run created ${repeat.offersCreated}, updated ${repeat.offersUpdated}`,
    );

    const priceAfter = await Product.find({}).sort({ retailerProductId: 1 }).lean();
    const legacyUntouched = priceBefore.every(
      (product, index) =>
        product.pricePence === priceAfter[index].pricePence &&
        product.available === priceAfter[index].available,
    );

    check(
      "no legacy field was modified",
      legacyUntouched,
      "prices and availability unchanged",
    );

    /* ------------------------------------------------------------ compare */
    console.log("\n3. Legacy versus offer comparison");

    const scope = await scopeFor();
    const comparison = await compareCatalogueReads(scope);

    check(
      "both read paths agree",
      comparison.matches &&
        comparison.legacyCount === comparison.offerCount &&
        comparison.legacyCount === LEGACY_PRODUCTS,
      `legacy ${comparison.legacyCount}, offers ${comparison.offerCount}`,
    );

    const legacyRead = await loadCandidateProducts(scope, "legacy");
    const offerRead = await loadCandidateProducts(scope, "offers");

    check(
      "both readers return identical candidates",
      JSON.stringify(legacyRead) === JSON.stringify(offerRead),
      `${legacyRead.length} candidates`,
    );

    // A deliberate divergence must be *reported*, not smoothed over: this is
    // the check that decides whether the read switch is safe to move.
    await ProductOffer.updateOne(
      { retailerProductId: "legacy-0000" },
      { $set: { priceMinor: 9_999 } },
    );
    const drifted = await compareCatalogueReads(scope);

    check(
      "a drift between the paths is reported",
      !drifted.matches && drifted.differences.length > 0,
      drifted.differences[0] ?? "",
    );

    await ProductOffer.updateOne(
      { retailerProductId: "legacy-0000" },
      { $set: { priceMinor: 100 } },
    );

    /* ----------------------------------------------------- reconciliation */
    console.log("\n4. Reconciliation, on bounded data");

    // Half the catalogue was seen by this run; the rest was not.
    const trustedRun = await CrawlRun.create({
      retailerId: scope.retailerId,
      storeId: scope.storeId,
      adapterKey: "aldi",
      adapterVersion: "1.0.0",
      mode: "full",
      status: "completed",
      startedAt: new Date(),
      completedAt: new Date(),
      categoriesRequested: 4,
      categoriesCompleted: 4,
      productsDiscovered: 60,
      failures: 0,
      storeSelectionVerified: true,
    });

    await ProductOffer.updateMany(
      { retailerProductId: { $lt: "legacy-0060" } },
      { $set: { lastCrawlRunId: trustedRun._id.toString() } },
    );

    const bounded = await CrawlRun.create({
      retailerId: scope.retailerId,
      storeId: scope.storeId,
      adapterKey: "aldi",
      adapterVersion: "1.0.0",
      mode: "bounded",
      status: "completed",
      categoriesRequested: 4,
      categoriesCompleted: 4,
      productsDiscovered: 60,
      failures: 0,
      storeSelectionVerified: true,
    });

    const refusedResult = await reconcileAvailability(bounded.toObject(), scope);

    check(
      "a bounded crawl retires nothing",
      !refusedResult.reconciled &&
        refusedResult.offersRetired === 0 &&
        (await ProductOffer.countDocuments({ available: true })) === LEGACY_PRODUCTS,
      refusedResult.refusals.join(", "),
    );

    const trust = assessCrawlTrust(trustedRun.toObject());
    check("the full crawl is judged trustworthy", trust.trusted, "");

    const reconciled = await reconcileAvailability(trustedRun.toObject(), scope);

    check(
      "a trusted full crawl retires what it did not see",
      reconciled.reconciled && reconciled.offersRetired === LEGACY_PRODUCTS - 60,
      `${reconciled.offersRetired} offers retired`,
    );

    check(
      "retired offers leave planning",
      (await loadCandidateProducts(scope, "offers")).length === 60,
      "60 candidates remain",
    );

    /* --------------------------------------------------------------- undo */
    console.log("\n5. Run-scoped undo");

    const undone = await undoReconciliation(trustedRun._id.toString(), scope);

    check(
      "undo restores exactly that run's retirements",
      undone.offersRestored === LEGACY_PRODUCTS - 60 &&
        (await ProductOffer.countDocuments({ available: true })) === LEGACY_PRODUCTS,
      `${undone.offersRestored} offers restored`,
    );

    check(
      "the catalogue is whole again",
      (await loadCandidateProducts(scope, "offers")).length === LEGACY_PRODUCTS,
      `${LEGACY_PRODUCTS} candidates`,
    );

    /* ----------------------------------------------------------- rollback */
    console.log("\n6. Migration rollback");

    const rolledBack = await rollbackProductOffers(SCOPE);

    check(
      "rollback removes the derived offers",
      rolledBack.offersRemoved === LEGACY_PRODUCTS &&
        (await ProductOffer.countDocuments({})) === 0,
      `${rolledBack.offersRemoved} offers removed`,
    );

    const afterRollback = await loadCandidateProducts(scope, "legacy");

    check(
      "the legacy read path still answers correctly",
      afterRollback.length === LEGACY_PRODUCTS,
      `${afterRollback.length} candidates from legacy fields`,
    );

    /* --------------------------------------------------------------- done */
    const failed = checks.filter((entry) => !entry.passed);

    console.log(
      `\n${checks.length - failed.length}/${checks.length} checks passed.`,
    );

    if (failed.length > 0) {
      console.error("\nFAILED:");
      for (const entry of failed) console.error(`  - ${entry.name}`);
      process.exitCode = 1;
    } else {
      console.log("\nThe migration sequence is safe to run against a real database.");
      console.log("Production activation has NOT been performed by this script.");
    }
  } finally {
    await mongoose.disconnect();
    await server.stop();
    console.log("\nIsolated MongoDB stopped and discarded.");
  }
}

void main().catch((error: unknown) => {
  console.error("Migration rehearsal failed");
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
