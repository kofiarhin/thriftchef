/**
 * A realistic Aldi-shaped catalogue for planner tests and the benchmark.
 *
 * Products go through the real `selectProducts`, so roles, ranking and
 * food-group allocation are exercised exactly as they are in production rather
 * than hand-stubbed. Prices are plausible 2026 Aldi shelf prices in pence.
 */

import { parseMealPlanRequest } from "../mealPlanning/mealPlanSchemas";
import { selectProducts, type CandidateProduct } from "../mealPlanning/productSelector";
import type { MealPlanRequest, SelectableProduct } from "../mealPlanning/mealPlanTypes";

const SEEN_AT = new Date("2026-08-18T06:00:00.000Z");

/** Fixed so plan provenance is reproducible in the baseline snapshot. */
export const FIXTURE_CRAWL_RUN_ID = "fixture-crawl-run";

function item(
  id: string,
  name: string,
  categoryPath: string[],
  pricePence: number,
  packageSizeRaw: string | null = null,
  overrides: Partial<CandidateProduct> = {},
): CandidateProduct {
  return {
    retailerProductId: id,
    name,
    brand: null,
    description: null,
    categoryPaths: [categoryPath],
    pricePence,
    packageSizeRaw,
    dietaryInformationRaw: null,
    normalizedAllergens: [],
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    productUrl: `https://www.aldi.co.uk/product/${id}`,
    imageUrl: null,
    lastSeenAt: SEEN_AT,
    lastCheckedAt: SEEN_AT,
    lastCrawlRunId: FIXTURE_CRAWL_RUN_ID,
    ...overrides,
  };
}

const FRESH = ["Fresh Food"];
const CHILLED = ["Chilled Food"];
const CUPBOARD = ["Food Cupboard"];
const BAKERY = ["Bakery"];

/** Roughly one aisle-representative product per culinary role, plus depth. */
export const ALDI_CATALOGUE: CandidateProduct[] = [
  // Poultry
  item("p-chicken-breast", "Chicken Breast Fillets", [...FRESH, "Poultry"], 389, "650g"),
  item("p-chicken-thighs", "Chicken Thigh Fillets", [...FRESH, "Poultry"], 299, "600g"),
  item("p-turkey-mince", "British Turkey Mince", [...FRESH, "Poultry"], 249, "500g"),

  // Red meat
  item("p-beef-mince", "Beef Mince 5% Fat", [...FRESH, "Beef"], 349, "500g"),
  item("p-pork-sausages", "Pork Sausages", [...FRESH, "Sausages"], 189, "454g"),
  item("p-back-bacon", "Unsmoked Back Bacon", [...FRESH, "Bacon"], 209, "300g"),

  // Fish
  item("p-salmon", "Scottish Salmon Fillets", [...FRESH, "Fish & Seafood"], 429, "240g"),
  item("p-tuna", "Tuna Chunks In Brine", [...CUPBOARD, "Tins, Cans & Packets"], 129, "145g"),

  // Plant protein
  item("p-baked-beans", "Baked Beans In Tomato Sauce", [...CUPBOARD, "Tins, Cans & Packets"], 45, "410g"),
  item("p-red-lentils", "Red Lentils", [...CUPBOARD, "Rice, Pasta & Noodles"], 129, "500g"),
  item("p-chickpeas", "Chickpeas In Water", [...CUPBOARD, "Tins, Cans & Packets"], 49, "400g"),
  item("p-hummus", "Classic Houmous", [...CHILLED, "Dips & Snacks"], 95, "200g"),

  // Starches
  item("p-basmati-rice", "Basmati Rice", [...CUPBOARD, "Rice, Pasta & Noodles"], 179, "1kg"),
  item("p-long-grain-rice", "Long Grain Rice", [...CUPBOARD, "Rice, Pasta & Noodles"], 99, "1kg"),
  item("p-fusilli", "Fusilli Pasta", [...CUPBOARD, "Rice, Pasta & Noodles"], 75, "500g"),
  item("p-spaghetti", "Spaghetti", [...CUPBOARD, "Rice, Pasta & Noodles"], 75, "500g"),
  item("p-couscous", "Couscous", [...CUPBOARD, "Rice, Pasta & Noodles"], 89, "500g"),
  item("p-egg-noodles", "Medium Egg Noodles", [...CUPBOARD, "Rice, Pasta & Noodles"], 89, "375g"),
  item("p-potatoes", "Maris Piper Potatoes", [...FRESH, "Vegetables & Sides"], 149, "2kg"),

  // Bakery
  item("p-white-bread", "Soft White Medium Bread", [...BAKERY, "Bread"], 79, "800g"),
  item("p-wholemeal-bread", "Wholemeal Medium Bread", [...BAKERY, "Bread"], 79, "800g"),
  item("p-tortilla-wraps", "Plain Tortilla Wraps", [...BAKERY, "Wraps & Thins"], 105, "8 pack"),

  // Breakfast
  item("p-porridge-oats", "Scottish Porridge Oats", [...CUPBOARD, "Cereals"], 145, "1kg"),
  item("p-cornflakes", "Corn Flakes", [...CUPBOARD, "Cereals"], 119, "500g"),

  // Dairy and eggs
  item("p-eggs", "Free Range Large Eggs", [...CHILLED, "Eggs"], 219, "12 pack"),
  item("p-milk", "British Semi Skimmed Milk", [...CHILLED, "Milk"], 145, "2 pints"),
  item("p-cheddar", "Mature Cheddar Cheese", [...CHILLED, "Cheese"], 279, "400g"),
  item("p-mozzarella", "Mozzarella Cheese", [...CHILLED, "Cheese"], 105, "125g"),
  item("p-yogurt", "Greek Style Natural Yogurt", [...CHILLED, "Yogurt"], 129, "500g"),

  // Vegetables
  item("p-carrots", "Carrots", [...FRESH, "Vegetables & Sides"], 55, "1kg"),
  item("p-broccoli", "Broccoli", [...FRESH, "Vegetables & Sides"], 69, "350g"),
  item("p-onions", "Brown Onions", [...FRESH, "Vegetables & Sides"], 89, "1kg"),
  item("p-peppers", "Mixed Peppers", [...FRESH, "Vegetables & Sides"], 149, "3 pack"),
  item("p-spinach", "Baby Spinach", [...FRESH, "Salad"], 89, "240g"),
  item("p-mixed-salad", "Mixed Salad Leaves", [...FRESH, "Salad"], 79, "160g"),

  // Fruit
  item("p-bananas", "Bananas", [...FRESH, "Fruit"], 89, "5 pack"),
  item("p-apples", "Gala Apples", [...FRESH, "Fruit"], 129, "6 pack"),
  item("p-berries", "Blueberries", [...FRESH, "Fruit"], 179, "200g"),

  // Sauces and seasoning
  item("p-chopped-tomatoes", "Chopped Tomatoes", [...CUPBOARD, "Tins, Cans & Packets"], 45, "400g"),
  item("p-passata", "Tomato Passata", [...CUPBOARD, "Cooking Sauces"], 55, "500g"),
  item("p-curry-sauce", "Tikka Masala Cooking Sauce", [...CUPBOARD, "Cooking Sauces"], 115, "500g"),
  item("p-soy-sauce", "Soy Sauce", [...CUPBOARD, "Condiments & Dressings"], 89, "150ml"),
  item("p-olive-oil", "Olive Oil", [...CUPBOARD, "Oils & Vinegars"], 329, "500ml"),

  // Snacks
  item("p-crackers", "Cream Crackers", [...CUPBOARD, "Biscuits & Crackers"], 59, "200g"),
  item("p-crisps", "Ready Salted Crisps", [...CUPBOARD, "Crisps & Snacks"], 129, "6 pack"),
];

export function planRequest(overrides: Record<string, unknown> = {}): MealPlanRequest {
  return parseMealPlanRequest({
    budgetPence: 7_000,
    householdSize: 2,
    mealsPerDay: ["breakfast", "lunch", "dinner"],
    appliances: ["hob", "oven", "toaster", "kettle", "microwave"],
    pantryBasics: ["salt", "pepper", "cooking oil", "basic herbs and spices", "stock cubes"],
    ...overrides,
  });
}

/** The selected product set a planner actually receives. */
export function selectedProducts(
  request: MealPlanRequest = planRequest(),
  catalogue: CandidateProduct[] = ALDI_CATALOGUE,
  maxProducts = 80,
): SelectableProduct[] {
  return selectProducts(catalogue, request, { maxProducts }).products;
}

export function productsById(
  products: SelectableProduct[],
): Map<string, SelectableProduct> {
  return new Map(products.map((product) => [product.productId, product]));
}

/** Grows the fixture to `count` products for benchmark realism. */
export function paddedCatalogue(count: number): CandidateProduct[] {
  const padded = [...ALDI_CATALOGUE];
  let index = 0;

  while (padded.length < count) {
    const source = ALDI_CATALOGUE[index % ALDI_CATALOGUE.length];
    index += 1;
    padded.push({
      ...source,
      retailerProductId: `${source.retailerProductId}-x${index}`,
      name: `${source.name} Value ${index}`,
      pricePence: source.pricePence + (index % 7) * 5,
    });
  }

  return padded.slice(0, count);
}
