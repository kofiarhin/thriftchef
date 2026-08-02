import "dotenv/config";
import mongoose from "mongoose";
import { runAldiCatalogueCrawl } from "./aldiCrawler";

function parseOptionalPositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

async function main(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(mongoUri);

  try {
    const summary = await runAldiCatalogueCrawl({
      storeId: process.env.ALDI_STORE_ID?.trim() || "belper-de56-1ar",
      expectedStoreText: process.env.ALDI_EXPECTED_STORE_TEXT?.trim() || "DE56 1AR",
      headless: process.env.ALDI_HEADLESS === "true",
      maxProductsPerCategory: parseOptionalPositiveInteger(
        process.env.ALDI_MAX_PRODUCTS_PER_CATEGORY,
      ),
    });

    console.log("\nAldi catalogue crawl complete");
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error("\nAldi catalogue crawl failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
