/**
 * Gives every existing product an ObjectId dual key and a store-scoped offer.
 *
 *   npx tsx scripts/backfill-product-offers.ts
 *   npx tsx scripts/backfill-product-offers.ts --compare
 *   npx tsx scripts/backfill-product-offers.ts --rollback
 *
 * Additive and restartable. No legacy field is written, so `--rollback`
 * genuinely returns the catalogue to its pre-migration state and the read
 * switch (`CATALOGUE_READ_SOURCE`) can be moved back at any point.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { getConfig } from "../server/config/env";
import {
  backfillProductOffers,
  rollbackProductOffers,
} from "../server/catalogue/core/catalogueMigrations";
import { compareCatalogueReads } from "../server/catalogue/core/catalogueReads";
import { resolveCatalogueScope } from "../server/catalogue/retailerRegistry";

async function main(): Promise<void> {
  const config = getConfig();
  await mongoose.connect(config.mongodbUri);

  try {
    const scope = await resolveCatalogueScope(
      { retailer: config.defaultRetailerSlug, store: config.aldi.storeId },
      { requireSelectable: false },
    );
    const slugs = { retailerSlug: scope.retailerSlug, storeSlug: scope.storeSlug };

    if (process.argv.includes("--rollback")) {
      console.log(JSON.stringify(await rollbackProductOffers(slugs), null, 2));
      console.log("\nSet CATALOGUE_READ_SOURCE=legacy before restarting the API.");
      return;
    }

    if (process.argv.includes("--compare")) {
      const comparison = await compareCatalogueReads(scope);
      console.log(JSON.stringify(comparison, null, 2));

      if (!comparison.matches) {
        console.error("\nThe two read paths disagree. Do not switch reads to offers.");
        process.exitCode = 1;
      } else {
        console.log("\nBoth read paths agree. CATALOGUE_READ_SOURCE=offers is safe.");
      }
      return;
    }

    console.log(JSON.stringify(await backfillProductOffers(slugs), null, 2));
    console.log("\nNext: re-run with --compare before switching reads.");
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("Backfill failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
