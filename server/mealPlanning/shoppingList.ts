import type {
  SelectableProduct,
  ShoppingListGroup,
  ShoppingListItem,
} from "./mealPlanTypes";

/**
 * One recipe's claim on a product, expressed in packages. Fractions are
 * expected and wanted: a stir fry using a fifth of a rice bag should not bill
 * the user for a whole bag every time it appears in the week.
 */
export interface ProductUsage {
  productId: string;
  packages: number;
}

export interface ConsolidatedShoppingList {
  groups: ShoppingListGroup[];
  totalPence: number;
  /** Products a generator asked for that the catalogue does not contain. */
  unknownProductIds: string[];
}

/** "Other" is a bucket, not a department, so it sorts to the bottom. */
function compareCategories(a: string, b: string): number {
  if (a === b) return 0;
  if (a === "Other") return 1;
  if (b === "Other") return -1;
  return a.localeCompare(b);
}

export interface ConsolidateOptions {
  /**
   * Catalogue products the household already has.
   *
   * They stay on the list — a recipe that silently drops an ingredient is a
   * recipe you cannot cook — but they are marked and contribute nothing to the
   * total. Removing them entirely would also break the promise that the
   * shopping list explains the whole week.
   */
  ownedProductIds?: string[];
}

/**
 * Turns per-recipe product usage into the basket the user actually buys.
 *
 * Every price comes from the catalogue record; nothing a generator claimed
 * about cost is read here. Weekly demand for a product is summed first and
 * rounded up once, so reusing an ingredient across meals costs one pack rather
 * than one pack per meal.
 */
export function consolidateShoppingList(
  usages: ProductUsage[],
  products: Map<string, SelectableProduct>,
  options: ConsolidateOptions = {},
): ConsolidatedShoppingList {
  const owned = new Set(options.ownedProductIds ?? []);
  const packagesByProduct = new Map<string, number>();
  const unknownProductIds: string[] = [];

  for (const usage of usages) {
    if (!Number.isFinite(usage.packages) || usage.packages <= 0) continue;

    if (!products.has(usage.productId)) {
      if (!unknownProductIds.includes(usage.productId)) {
        unknownProductIds.push(usage.productId);
      }
      continue;
    }

    packagesByProduct.set(
      usage.productId,
      (packagesByProduct.get(usage.productId) ?? 0) + usage.packages,
    );
  }

  const itemsByCategory = new Map<string, ShoppingListItem[]>();
  let totalPence = 0;

  for (const [productId, packages] of packagesByProduct) {
    const product = products.get(productId);
    if (!product) continue;

    const quantity = Math.max(1, Math.ceil(Number(packages.toFixed(4))));
    const alreadyOwned = owned.has(productId);
    // An owned product is priced at zero rather than omitted, so the line still
    // shows what the week needs while the basket only charges for what is
    // actually being bought.
    const totalPricePence = alreadyOwned ? 0 : product.pricePence * quantity;
    totalPence += totalPricePence;

    const items = itemsByCategory.get(product.category) ?? [];
    items.push({
      productId,
      name: product.name,
      brand: product.brand,
      packageSize: product.packageSize,
      quantity,
      unitPricePence: product.pricePence,
      totalPricePence,
      productUrl: product.productUrl,
      imageUrl: product.imageUrl ?? null,
      alreadyOwned,
    });
    itemsByCategory.set(product.category, items);
  }

  const groups = [...itemsByCategory.entries()]
    .sort(([a], [b]) => compareCategories(a, b))
    .map(([category, items]) => ({
      category,
      items: items.sort(
        (a, b) => a.name.localeCompare(b.name) || a.productId.localeCompare(b.productId),
      ),
    }));

  return { groups, totalPence, unknownProductIds };
}
