import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { consolidateShoppingList } from "./shoppingList";
import { classifyIngredientRoles } from "./ingredientRoles";
import type { SelectableProduct } from "./mealPlanTypes";

function product(
  productId: string,
  overrides: Partial<SelectableProduct> = {},
): SelectableProduct {
  return {
    productId,
    name: `Product ${productId}`,
    brand: null,
    category: "Food Cupboard",
    categoryPaths: [["Food Cupboard", "Rice, Pasta & Noodles"]],
    pricePence: 100,
    packageSize: "500g",
    allergens: [],
    dietaryInfo: null,
    safetyStatus: "inferred",
    roles: classifyIngredientRoles({
      name: `Product ${productId}`,
      description: null,
      categoryPaths: [["Food Cupboard", "Rice, Pasta & Noodles"]],
    }),
    productUrl: `https://www.aldi.co.uk/product/${productId}`,
    imageUrl: `https://cdn.aldi.test/${productId}.jpg`,
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
    ...overrides,
  };
}

function catalogue(...products: SelectableProduct[]): Map<string, SelectableProduct> {
  return new Map(products.map((entry) => [entry.productId, entry]));
}

describe("consolidateShoppingList", () => {
  it("merges repeated uses of a product into one line", () => {
    const result = consolidateShoppingList(
      [
        { productId: "a", packages: 1 },
        { productId: "a", packages: 1 },
      ],
      catalogue(product("a")),
    );

    const items = result.groups.flatMap((group) => group.items);
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 2);
  });

  it("rounds partial packages up, because a shop sells whole packs", () => {
    const result = consolidateShoppingList(
      [
        { productId: "a", packages: 0.2 },
        { productId: "a", packages: 0.3 },
      ],
      catalogue(product("a", { pricePence: 250 })),
    );

    const item = result.groups[0].items[0];
    assert.equal(item.quantity, 1, "half a bag of rice still costs one bag");
    assert.equal(item.totalPricePence, 250);
  });

  it("prices from the product record, never from the caller", () => {
    const result = consolidateShoppingList(
      [{ productId: "a", packages: 3 }],
      catalogue(product("a", { pricePence: 149 })),
    );

    const item = result.groups[0].items[0];
    assert.equal(item.unitPricePence, 149);
    assert.equal(item.totalPricePence, 447);
    assert.equal(result.totalPence, 447);
  });

  it("totals every group into the basket total", () => {
    const result = consolidateShoppingList(
      [
        { productId: "a", packages: 1 },
        { productId: "b", packages: 2 },
      ],
      catalogue(
        product("a", { pricePence: 100 }),
        product("b", {
          pricePence: 250,
          categoryPaths: [["Fresh Food", "Poultry"]],
          category: "Fresh Food",
        }),
      ),
    );

    assert.equal(result.totalPence, 600);
  });

  it("groups by store department and sorts deterministically", () => {
    const result = consolidateShoppingList(
      [
        { productId: "rice", packages: 1 },
        { productId: "chicken", packages: 1 },
        { productId: "apples", packages: 1 },
      ],
      catalogue(
        product("rice", { name: "Basmati Rice", category: "Food Cupboard" }),
        product("chicken", { name: "Chicken Breast", category: "Fresh Food" }),
        product("apples", { name: "Apples", category: "Fresh Food" }),
      ),
    );

    assert.deepEqual(
      result.groups.map((group) => group.category),
      ["Food Cupboard", "Fresh Food"],
    );
    assert.deepEqual(
      result.groups[1].items.map((item) => item.name),
      ["Apples", "Chicken Breast"],
    );
  });

  it("files an uncategorized product under Other, listed last", () => {
    const result = consolidateShoppingList(
      [
        { productId: "x", packages: 1 },
        { productId: "rice", packages: 1 },
      ],
      catalogue(
        product("x", { category: "Other", categoryPaths: [] }),
        product("rice", { category: "Food Cupboard" }),
      ),
    );

    assert.deepEqual(
      result.groups.map((group) => group.category),
      ["Food Cupboard", "Other"],
    );
  });

  it("ignores a product that is not in the catalogue rather than inventing a price", () => {
    const result = consolidateShoppingList(
      [
        { productId: "known", packages: 1 },
        { productId: "ghost", packages: 4 },
      ],
      catalogue(product("known", { pricePence: 100 })),
    );

    assert.equal(result.totalPence, 100);
    assert.deepEqual(result.unknownProductIds, ["ghost"]);
  });

  it("drops non-positive package counts", () => {
    const result = consolidateShoppingList(
      [
        { productId: "a", packages: 0 },
        { productId: "a", packages: -2 },
      ],
      catalogue(product("a")),
    );

    assert.deepEqual(result.groups, []);
    assert.equal(result.totalPence, 0);
  });

  it("carries the fields a shopper needs to find the item", () => {
    const result = consolidateShoppingList(
      [{ productId: "a", packages: 1 }],
      catalogue(
        product("a", {
          name: "Basmati Rice",
          brand: "Worldwide Foods",
          packageSize: "1kg",
        }),
      ),
    );

    assert.deepEqual(result.groups[0].items[0], {
      productId: "a",
      name: "Basmati Rice",
      brand: "Worldwide Foods",
      packageSize: "1kg",
      quantity: 1,
      unitPricePence: 100,
      totalPricePence: 100,
      productUrl: "https://www.aldi.co.uk/product/a",
      imageUrl: "https://cdn.aldi.test/a.jpg",
      alreadyOwned: false,
    });
  });

  it("keeps an owned product on the list but charges nothing for it", () => {
    const result = consolidateShoppingList(
      [
        { productId: "a", packages: 1 },
        { productId: "b", packages: 1 },
      ],
      catalogue(product("a"), product("b")),
      { ownedProductIds: ["a"] },
    );

    const items = result.groups.flatMap((group) => group.items);
    const owned = items.find((item) => item.productId === "a");
    const bought = items.find((item) => item.productId === "b");

    assert.ok(owned, "an owned product must still appear, or the recipe cannot be cooked");
    assert.equal(owned.alreadyOwned, true);
    assert.equal(owned.totalPricePence, 0);
    assert.equal(owned.quantity, 1, "the quantity the week needs is still shown");

    assert.ok(bought);
    assert.equal(bought.alreadyOwned, false);

    assert.equal(
      result.totalPence,
      bought.totalPricePence,
      "only what is actually bought counts toward the basket",
    );
  });
});
