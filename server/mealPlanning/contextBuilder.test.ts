import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAiContext } from "./contextBuilder";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import type { MealPlanRequest, SelectableProduct } from "./mealPlanTypes";

function product(
  productId: string,
  categoryPath: string[],
  overrides: Partial<SelectableProduct> = {},
): SelectableProduct {
  return {
    productId,
    name: `Product ${productId}`,
    brand: "Aldi",
    category: categoryPath[0],
    categoryPaths: [categoryPath],
    pricePence: 100,
    packageSize: "500g",
    allergens: [],
    dietaryInfo: null,
    safetyStatus: "inferred",
    productUrl: `https://www.aldi.co.uk/product/${productId}`,
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
    ...overrides,
  };
}

function manyOf(group: string[], count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) =>
    product(`${prefix}${index}`, group),
  );
}

function request(overrides: Record<string, unknown> = {}): MealPlanRequest {
  return parseMealPlanRequest({
    budgetPence: 7000,
    householdSize: 2,
    mealsPerDay: ["dinner"],
    appliances: ["hob"],
    ...overrides,
  });
}

describe("buildAiContext", () => {
  it("sends only the documented compact fields", () => {
    const context = buildAiContext(
      [product("p1", ["Fresh Food", "Poultry"], { dietaryInfo: "Halal" })],
      request(),
      { maxProducts: 120 },
    );

    assert.deepEqual(Object.keys(context.products[0]).sort(), [
      "allergens",
      "brand",
      "category",
      "dietaryInfo",
      "id",
      "name",
      "packageSize",
      "pricePence",
      "safetyStatus",
    ]);
  });

  it("never leaks crawl metadata or product URLs into the prompt", () => {
    const serialized = JSON.stringify(
      buildAiContext(
        [product("p1", ["Fresh Food", "Poultry"])],
        request(),
        { maxProducts: 120 },
      ).products,
    );

    assert.ok(!serialized.includes("aldi.co.uk"));
    assert.ok(!serialized.includes("lastSeenAt"));
    assert.ok(!serialized.includes("categoryPaths"));
  });

  it("caps the number of products sent", () => {
    const context = buildAiContext(
      manyOf(["Fresh Food", "Poultry"], 300, "prot"),
      request(),
      { maxProducts: 40 },
    );

    assert.equal(context.products.length, 40);
  });

  it("spreads the cap across food groups instead of sending one aisle", () => {
    const context = buildAiContext(
      [
        ...manyOf(["Fresh Food", "Poultry"], 100, "prot"),
        ...manyOf(["Fresh Food", "Vegetables"], 100, "veg"),
        ...manyOf(["Food Cupboard", "Rice, Pasta & Noodles"], 100, "stap"),
        ...manyOf(["Chilled Food", "Cheese"], 100, "dairy"),
      ],
      request(),
      { maxProducts: 40 },
    );

    const prefixes = new Set(
      context.products.map((entry) => entry.id.replace(/\d+$/, "")),
    );

    assert.deepEqual([...prefixes].sort(), ["dairy", "prot", "stap", "veg"]);
    for (const prefix of prefixes) {
      const count = context.products.filter((entry) =>
        entry.id.startsWith(prefix),
      ).length;
      assert.ok(count >= 3, `${prefix} should keep a usable share, got ${count}`);
    }
  });

  it("gives an under-represented group's unused quota to the others", () => {
    const context = buildAiContext(
      [
        ...manyOf(["Fresh Food", "Poultry"], 50, "prot"),
        ...manyOf(["Fresh Food", "Vegetables"], 2, "veg"),
      ],
      request(),
      { maxProducts: 30 },
    );

    assert.equal(context.products.length, 30, "the cap should still be filled");
  });

  it("preserves the product ids the plan must shop from", () => {
    const products = manyOf(["Fresh Food", "Poultry"], 5, "prot");
    const context = buildAiContext(products, request(), { maxProducts: 120 });

    assert.deepEqual(
      context.products.map((entry) => entry.id).sort(),
      products.map((entry) => entry.productId).sort(),
    );
  });

  it("is deterministic for the same input", () => {
    const products = [
      ...manyOf(["Fresh Food", "Poultry"], 30, "prot"),
      ...manyOf(["Fresh Food", "Vegetables"], 30, "veg"),
    ];

    assert.deepEqual(
      buildAiContext(products, request(), { maxProducts: 25 }),
      buildAiContext([...products], request(), { maxProducts: 25 }),
    );
  });

  it("flags that the context rests on inferred allergen data", () => {
    const inferred = buildAiContext(
      [product("p1", ["Fresh Food", "Poultry"], { safetyStatus: "inferred" })],
      request(),
      { maxProducts: 120 },
    );
    const verified = buildAiContext(
      [product("p1", ["Fresh Food", "Poultry"], { safetyStatus: "verified" })],
      request(),
      { maxProducts: 120 },
    );

    assert.equal(inferred.containsInferredAllergens, true);
    assert.equal(verified.containsInferredAllergens, false);
  });

  it("drops snack products unless snacks were requested", () => {
    const products = [
      ...manyOf(["Fresh Food", "Poultry"], 5, "prot"),
      ...manyOf(["Food Cupboard", "Chocolate & Sweets"], 5, "snack"),
    ];

    const withoutSnacks = buildAiContext(products, request(), { maxProducts: 120 });
    assert.ok(
      withoutSnacks.products.every((entry) => !entry.id.startsWith("snack")),
    );

    const withSnacks = buildAiContext(
      products,
      request({ mealsPerDay: ["dinner", "snack"] }),
      { maxProducts: 120 },
    );
    assert.ok(withSnacks.products.some((entry) => entry.id.startsWith("snack")));
  });

  it("shortens long dietary text rather than shipping an essay", () => {
    const context = buildAiContext(
      [
        product("p1", ["Fresh Food", "Poultry"], {
          dietaryInfo: "x".repeat(500),
        }),
      ],
      request(),
      { maxProducts: 120 },
    );

    assert.ok((context.products[0].dietaryInfo ?? "").length <= 80);
  });

  it("returns an empty context for an empty selection", () => {
    const context = buildAiContext([], request(), { maxProducts: 120 });

    assert.deepEqual(context.products, []);
    assert.equal(context.containsInferredAllergens, false);
  });
});
