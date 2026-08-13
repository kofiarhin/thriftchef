/**
 * Operational helper: prints how the live catalogue distributes across the
 * food groups planning depends on. Run with `npx tsx scripts/inspect-catalogue.ts`.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../server/models/Product";
import { classifyFoodGroup } from "../server/mealPlanning/productCategories";
import {
  fetchCandidateProducts,
  selectProducts,
} from "../server/mealPlanning/productSelector";
import { parseMealPlanRequest } from "../server/mealPlanning/mealPlanSchemas";

async function main(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI!.trim());

  const documents = await Product.find(
    { retailer: "aldi-uk", available: true },
    { categoryPaths: 1, name: 1, eligibleForPlanning: 1 },
  ).lean();

  const byPath = new Map<string, number>();
  const byGroup = new Map<string, number>();

  for (const document of documents) {
    const paths = document.categoryPaths ?? [];
    const key = paths.length === 0 ? "<none>" : JSON.stringify(paths[0]);
    byPath.set(key, (byPath.get(key) ?? 0) + 1);

    const group = classifyFoodGroup(paths);
    byGroup.set(group, (byGroup.get(group) ?? 0) + 1);
  }

  console.log(`total available products: ${documents.length}\n`);

  console.log("food groups:");
  for (const [group, count] of [...byGroup].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(5)}  ${group}`);
  }

  console.log("\ntop category paths:");
  for (const [path, count] of [...byPath].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${String(count).padStart(5)}  ${path}`);
  }

  const candidates = await fetchCandidateProducts(
    process.env.ALDI_STORE_ID?.trim() || "belper-de56-1ar",
  );
  const request = parseMealPlanRequest({
    budgetPence: 7000,
    householdSize: 2,
    mealsPerDay: ["breakfast", "dinner"],
    appliances: ["hob", "oven"],
  });
  const selection = selectProducts(candidates, request, { maxProducts: 120 });

  const selectedByGroup = new Map<string, number>();
  for (const product of selection.products) {
    const group = classifyFoodGroup(product.categoryPaths);
    selectedByGroup.set(group, (selectedByGroup.get(group) ?? 0) + 1);
  }

  console.log(
    `\nselector: considered ${selection.productsConsidered}, selected ${selection.products.length}, ` +
      `excludedForSafety ${selection.excludedForSafety}, excludedForAllergies ${selection.excludedForAllergies}`,
  );
  console.log("selection by food group:");
  for (const [group, count] of [...selectedByGroup].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(5)}  ${group}`);
  }

  await mongoose.disconnect();
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
