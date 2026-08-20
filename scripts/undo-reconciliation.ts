/**
 * Puts back everything one reconciliation run retired.
 *
 *   npx tsx scripts/undo-reconciliation.ts <crawlRunId>
 *
 * The safety net that makes availability reconciliation an acceptable risk:
 * a bad sweep is reversible by run id, without touching offers retired by any
 * other run and without a database restore.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { getConfig } from "../server/config/env";
import { undoReconciliation } from "../server/catalogue/core/availabilityReconciliation";
import { resolveCatalogueScope } from "../server/catalogue/retailerRegistry";

async function main(): Promise<void> {
  const crawlRunId = process.argv[2];

  if (!crawlRunId) {
    throw new Error("Usage: npx tsx scripts/undo-reconciliation.ts <crawlRunId>");
  }

  const config = getConfig();
  await mongoose.connect(config.mongodbUri);

  try {
    const scope = await resolveCatalogueScope(
      { retailer: config.defaultRetailerSlug, store: config.aldi.storeId },
      { requireSelectable: false },
    );

    const result = await undoReconciliation(crawlRunId, scope);
    console.log(`Restored ${result.offersRestored} offers retired by run ${crawlRunId}.`);
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("Undo failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
