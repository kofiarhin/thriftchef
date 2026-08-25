/**
 * Read-only catalogue diagnostic for one retailer/store scope.
 *
 * Examples:
 *   npm run catalogue:inspect
 *   npm run catalogue:inspect -- --retailer tesco-uk --store tesco-online-gb
 *   npm run catalogue:inspect -- --retailer tesco-uk --meal-type dinner
 */
import "dotenv/config";
import mongoose from "mongoose";
import { resolveCatalogueScope } from "../server/catalogue/retailerRegistry";
import { getConfig } from "../server/config/env";
import { classifyIngredientRoles } from "../server/mealPlanning/ingredientRoles";
import { parseMealPlanRequest } from "../server/mealPlanning/mealPlanSchemas";
import {
  APPLIANCES,
  MEAL_TYPES,
  PANTRY_BASICS,
  type MealType,
} from "../server/mealPlanning/mealPlanTypes";
import { classifyFoodGroup } from "../server/mealPlanning/productCategories";
import {
  fetchCandidateProducts,
  selectProducts,
} from "../server/mealPlanning/productSelector";
import { buildVariantsForMealType } from "../server/mealPlanning/recipeVariants";

function argument(name: string): string | null {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value?.trim() || null;
}

function requestedMealType(): MealType {
  const value = argument("--meal-type") ?? "dinner";
  if (!MEAL_TYPES.includes(value as MealType)) {
    throw new Error(
      `--meal-type must be one of: ${MEAL_TYPES.join(", ")}. Received ${value}.`,
    );
  }
  return value as MealType;
}

function printCounts(title: string, counts: Map<string, number>): void {
  console.log(`\n${title}:`);
  for (const [key, count] of [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`  ${String(count).padStart(5)}  ${key}`);
  }
}

async function main(): Promise<void> {
  const config = getConfig();
  const retailer = argument("--retailer") ?? config.defaultRetailerSlug;
  const store = argument("--store") ?? undefined;
  const mealType = requestedMealType();

  await mongoose.connect(config.mongodbUri);

  try {
    const scope = await resolveCatalogueScope(
      { retailer, store },
      { requireSelectable: false },
    );
    const candidates = await fetchCandidateProducts(scope, config.catalogueReadSource);

    const byPath = new Map<string, number>();
    const byGroup = new Map<string, number>();
    const candidateRoles = new Map<string, number>();

    for (const product of candidates) {
      const key =
        product.categoryPaths.length === 0
          ? "<none>"
          : JSON.stringify(product.categoryPaths[0]);
      byPath.set(key, (byPath.get(key) ?? 0) + 1);

      const group = classifyFoodGroup(product.categoryPaths);
      byGroup.set(group, (byGroup.get(group) ?? 0) + 1);

      for (const role of classifyIngredientRoles({
        name: product.name,
        description: product.description,
        categoryPaths: product.categoryPaths,
      })) {
        candidateRoles.set(role, (candidateRoles.get(role) ?? 0) + 1);
      }
    }

    const request = parseMealPlanRequest({
      budgetPence: 50_000,
      householdSize: 2,
      mealsPerDay: [mealType],
      appliances: [...APPLIANCES],
      allergies: [],
      dislikedIngredients: [],
      pantryBasics: [...PANTRY_BASICS],
      retailerId: scope.retailerSlug,
      storeId: scope.storeSlug,
    });
    const selection = selectProducts(candidates, request, {
      maxProducts: config.mealPlanEngine.maxProducts,
    });

    const selectedByGroup = new Map<string, number>();
    const selectedRoles = new Map<string, number>();
    for (const product of selection.products) {
      const group = classifyFoodGroup(product.categoryPaths);
      selectedByGroup.set(group, (selectedByGroup.get(group) ?? 0) + 1);
      for (const role of product.roles) {
        selectedRoles.set(role, (selectedRoles.get(role) ?? 0) + 1);
      }
    }

    const variants = buildVariantsForMealType({
      mealType,
      products: selection.products,
      request,
      seed: 0,
      maxVariants: config.mealPlanEngine.maxRecipeVariants,
      mustHaveProductIds: [],
    });

    console.log(`${scope.retailerName} — ${scope.storeName}`);
    console.log(`retailer: ${scope.retailerSlug}`);
    console.log(`store: ${scope.storeSlug}`);
    console.log(`status: ${scope.status}`);
    console.log(`read source: ${config.catalogueReadSource}`);
    console.log(`available catalogue products: ${candidates.length}`);

    printCounts("food groups", byGroup);
    printCounts("ingredient roles", candidateRoles);

    console.log("\nselection:");
    console.log(`  considered: ${selection.productsConsidered}`);
    console.log(`  selected: ${selection.products.length}`);
    console.log(`  excluded for safety: ${selection.excludedForSafety}`);
    console.log(`  excluded for allergies: ${selection.excludedForAllergies}`);
    console.log(`  excluded for dislikes: ${selection.excludedForDislikes}`);

    printCounts("selected food groups", selectedByGroup);
    printCounts("selected ingredient roles", selectedRoles);

    console.log(`\n${mealType} planner readiness:`);
    console.log(`  recipe variants: ${variants.length}`);
    console.log(`  ready: ${variants.length > 0 ? "yes" : "no"}`);

    if (variants.length === 0) {
      console.log(
        "  action: widen or repair this catalogue until at least one required recipe-slot combination can be filled.",
      );
    }

    console.log("\ntop category paths:");
    for (const [path, count] of [...byPath].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
      console.log(`  ${String(count).padStart(5)}  ${path}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
