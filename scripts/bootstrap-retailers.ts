/**
 * Creates the retailer and store records the catalogue is keyed by.
 *
 *   npx tsx scripts/bootstrap-retailers.ts
 *
 * Idempotent: run it as often as you like. Promoting a retailer to `active`
 * is a change to the seed below plus a re-run, which keeps activation an
 * auditable, repeatable operation rather than a hand-typed database edit.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { getConfig, type AppConfig } from "../server/config/env";
import {
  bootstrapRetailers,
  type RetailerSeed,
} from "../server/catalogue/core/catalogueMigrations";
import { CrawlRun } from "../server/models/CrawlRun";
import { PriceHistory } from "../server/models/PriceHistory";
import { Product } from "../server/models/Product";
import { ProductOffer } from "../server/models/ProductOffer";
import { RetailStore } from "../server/models/RetailStore";
import { Retailer } from "../server/models/Retailer";

/**
 * The Tesco scope this bootstrap seeds.
 *
 * The anonymous public Tesco catalogue, not a named branch or postcode.
 * Products and standard shelf prices are collected from public pages, so the
 * seed must not claim they came from a fulfilment location nobody selected.
 */
const TESCO_DEFAULT_STORE_ID = "tesco-online-gb";
const TESCO_DEFAULT_STORE_NAME = "Tesco Public Catalogue";

function seeds(config: AppConfig): RetailerSeed[] {
  const { storeId, expectedStoreText } = config.aldi;

  return [
    {
      slug: "aldi-uk",
      name: "Aldi UK",
      adapterKey: "aldi",
      catalogueScope: "store",
      // The only retailer that has passed its catalogue and planner gates.
      status: "active",
      crawlPolicy: { staleAfterHours: 72, maxConcurrency: 1, requestsPerMinute: 30 },
      stores: [
        {
          externalStoreId: storeId,
          name: `Aldi ${storeId.split("-")[0].replace(/^\w/, (c) => c.toUpperCase())}`,
          postcode: expectedStoreText,
          scope: "physical",
        },
      ],
    },
    {
      slug: "tesco-uk",
      name: "Tesco UK",
      adapterKey: "tesco",
      catalogueScope: "national",
      // `development`, and this line is the activation gate. Tesco becomes
      // selectable by changing it to `active` and re-running this script,
      // which keeps activation an auditable, repeatable, reviewable operation
      // rather than a hand-typed database edit. Do not change it until the
      // gates in the integration specification have been met and approved.
      status: "development",
      crawlPolicy: { staleAfterHours: 72, maxConcurrency: 1, requestsPerMinute: 20 },
      stores: [
        {
          externalStoreId: config.tesco.storeId ?? TESCO_DEFAULT_STORE_ID,
          name: TESCO_DEFAULT_STORE_NAME,
          // Public catalogue data is deliberately not attributed to a
          // postcode or a signed-in fulfilment session.
          postcode: null,
          scope: "online",
        },
      ],
    },
  ];
}

async function main(): Promise<void> {
  const config = getConfig();
  await mongoose.connect(config.mongodbUri);

  try {
    // Indexes are created explicitly here rather than on the crawl write path:
    // a unique index built mid-crawl over a collection with duplicates fails
    // half way and leaves a partial state.
    for (const model of [Retailer, RetailStore, CrawlRun, Product, ProductOffer, PriceHistory]) {
      await model.createIndexes();
    }

    const result = await bootstrapRetailers(seeds(config));

    console.log(JSON.stringify(result, null, 2));
    console.log("\nBootstrap complete. Next: npx tsx scripts/backfill-product-offers.ts");
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("Bootstrap failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
