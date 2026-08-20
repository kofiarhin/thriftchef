import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import { selectProducts, type CandidateProduct } from "./productSelector";
import type { MealPlanRequest } from "./mealPlanTypes";

function request(overrides: Partial<MealPlanRequest> = {}): MealPlanRequest {
  return parseMealPlanRequest({
    budgetPence: 7000,
    householdSize: 2,
    mealsPerDay: ["dinner"],
    appliances: ["hob"],
    ...overrides,
  });
}

let sequence = 0;

function candidate(overrides: Partial<CandidateProduct> = {}): CandidateProduct {
  sequence += 1;

  return {
    retailerProductId: `40000000000${sequence}`,
    name: `Product ${sequence}`,
    brand: null,
    description: null,
    categoryPaths: [["Food Cupboard", "Rice, Pasta & Noodles"]],
    pricePence: 100,
    packageSizeRaw: "500g",
    dietaryInformationRaw: null,
    normalizedAllergens: [],
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    productUrl: "https://www.aldi.co.uk/product/x",
    lastSeenAt: new Date("2026-08-13T00:00:00.000Z"),
    lastCheckedAt: new Date("2026-08-13T00:00:00.000Z"),
    lastCrawlRunId: "selector-test-run",
    ...overrides,
  };
}

const OPTIONS = { maxProducts: 120 };

describe("selectProducts", () => {
  it("keeps planning-eligible products and reports what it considered", () => {
    const result = selectProducts([candidate(), candidate()], request(), OPTIONS);

    assert.equal(result.products.length, 2);
    assert.equal(result.productsConsidered, 2);
    assert.equal(result.excludedForAllergies, 0);
    assert.equal(result.excludedForSafety, 0);
  });

  it("excludes products the catalogue could not verify or infer", () => {
    const result = selectProducts(
      [
        candidate({ catalogueSafetyStatus: "incomplete" }),
        candidate({ catalogueSafetyStatus: "ambiguous" }),
        candidate({ eligibleForPlanning: false }),
        candidate(),
      ],
      request(),
      OPTIONS,
    );

    assert.equal(result.products.length, 1);
    assert.equal(result.excludedForSafety, 3);
  });

  it("excludes unpriced products", () => {
    const result = selectProducts([candidate({ pricePence: 0 })], request(), OPTIONS);
    assert.equal(result.products.length, 0);
  });

  it("excludes products whose allergens conflict with the request", () => {
    const result = selectProducts(
      [
        candidate({ normalizedAllergens: ["milk", "gluten"] }),
        candidate({ normalizedAllergens: ["gluten"] }),
        candidate({ normalizedAllergens: [] }),
      ],
      request({ allergies: ["milk"] }),
      OPTIONS,
    );

    assert.equal(result.products.length, 2);
    assert.equal(result.excludedForAllergies, 1);
  });

  it("uses inferred products freely when no allergies are declared", () => {
    const result = selectProducts(
      [candidate({ catalogueSafetyStatus: "inferred" })],
      request({ allergies: [] }),
      OPTIONS,
    );

    assert.equal(result.products.length, 1);
    assert.equal(result.usesInferredProducts, true);
  });

  it("warns prominently when inferred products back an allergy-sensitive plan", () => {
    const result = selectProducts(
      [
        candidate({ catalogueSafetyStatus: "inferred", normalizedAllergens: [] }),
        candidate({
          catalogueSafetyStatus: "inferred",
          normalizedAllergens: ["milk"],
        }),
      ],
      request({ allergies: ["milk"] }),
      OPTIONS,
    );

    assert.equal(result.products.length, 1, "the conflicting product is dropped");
    assert.equal(result.excludedForAllergies, 1);
    assert.ok(
      result.warnings.some((warning) => /inferred/i.test(warning)),
      "an inferred-allergen warning must reach the user",
    );
    assert.ok(
      result.warnings.some((warning) => /check the label|packaging/i.test(warning)),
      "the warning must tell the user to check the actual label",
    );
  });

  it("does not warn about inference when a verified product backs the plan", () => {
    const result = selectProducts(
      [candidate({ catalogueSafetyStatus: "verified" })],
      request({ allergies: ["milk"] }),
      OPTIONS,
    );

    assert.equal(result.usesInferredProducts, false);
    assert.deepEqual(result.warnings, []);
  });

  it("excludes disliked ingredients by whole word only", () => {
    const result = selectProducts(
      [
        candidate({ name: "Green Olives" }),
        candidate({ name: "Olive Oil" }),
        candidate({ name: "Tomato Passata" }),
      ],
      request({ dislikedIngredients: ["olives"] }),
      OPTIONS,
    );

    assert.deepEqual(
      result.products.map((product) => product.name).sort(),
      ["Olive Oil", "Tomato Passata"],
    );
    assert.equal(result.excludedForDislikes, 1);
  });

  it("caps the selection at the configured maximum", () => {
    const candidates = Array.from({ length: 40 }, () => candidate());
    const result = selectProducts(candidates, request(), { maxProducts: 10 });

    assert.equal(result.products.length, 10);
    assert.equal(result.productsConsidered, 40);
  });

  it("ranks deterministically for identical input", () => {
    const candidates = Array.from({ length: 30 }, () => candidate());

    const first = selectProducts(candidates, request(), { maxProducts: 12 });
    const second = selectProducts([...candidates], request(), { maxProducts: 12 });

    assert.deepEqual(
      first.products.map((product) => product.productId),
      second.products.map((product) => product.productId),
    );
  });

  it("prefers cheaper products within the same food group", () => {
    const result = selectProducts(
      [
        candidate({ name: "Expensive Pasta", pricePence: 400 }),
        candidate({ name: "Cheap Pasta", pricePence: 60 }),
      ],
      request(),
      { maxProducts: 1 },
    );

    assert.equal(result.products[0].name, "Cheap Pasta");
  });

  it("prefers staples and proteins over confectionery", () => {
    const result = selectProducts(
      [
        candidate({
          name: "Milk Chocolate Bar",
          categoryPaths: [["Food Cupboard", "Chocolate & Sweets"]],
          pricePence: 50,
        }),
        candidate({
          name: "Chicken Breast Fillets",
          categoryPaths: [["Fresh Food", "Poultry"]],
          pricePence: 350,
        }),
      ],
      request(),
      { maxProducts: 1 },
    );

    assert.equal(result.products[0].name, "Chicken Breast Fillets");
  });

  it("keeps every food group represented when the cap is reached", () => {
    // Regression: ranking favours cheap cupboard staples, so a straight top-N
    // cap returned 120 tins and left the planner with no protein or veg.
    const candidates = [
      ...Array.from({ length: 200 }, () =>
        candidate({
          categoryPaths: [["Food Cupboard", "Tins, Cans & Packets"]],
          pricePence: 40,
        }),
      ),
      ...Array.from({ length: 40 }, () =>
        candidate({
          categoryPaths: [["Fresh Food", "Poultry"]],
          pricePence: 350,
        }),
      ),
      ...Array.from({ length: 40 }, () =>
        candidate({
          categoryPaths: [["Fresh Food", "Vegetables"]],
          pricePence: 90,
        }),
      ),
      ...Array.from({ length: 40 }, () =>
        candidate({ categoryPaths: [["Chilled Food", "Cheese"]], pricePence: 240 }),
      ),
    ];

    const result = selectProducts(candidates, request(), { maxProducts: 40 });
    const departments = result.products.map((product) => product.category);

    for (const department of ["Fresh Food", "Chilled Food", "Food Cupboard"]) {
      assert.ok(
        departments.includes(department),
        `${department} must survive the cap`,
      );
    }
    assert.equal(result.products.length, 40);
  });

  it("returns an empty selection rather than throwing when nothing qualifies", () => {
    const result = selectProducts(
      [candidate({ normalizedAllergens: ["milk"] })],
      request({ allergies: ["milk"] }),
      OPTIONS,
    );

    assert.deepEqual(result.products, []);
    assert.equal(result.excludedForAllergies, 1);
  });

  it("projects only planning-relevant fields", () => {
    const result = selectProducts(
      [candidate({ name: "Basmati Rice", packageSizeRaw: "1kg" })],
      request(),
      OPTIONS,
    );

    assert.deepEqual(Object.keys(result.products[0]).sort(), [
      "allergens",
      "brand",
      "category",
      "categoryPaths",
      "dietaryInfo",
      "imageUrl",
      "lastSeenAt",
      "name",
      "packageSize",
      "pricePence",
      "productId",
      "productUrl",
      "roles",
      "safetyStatus",
    ]);
  });

  it("retains cheap, mid and dearer options inside one culinary role", () => {
    // Twelve chicken products spanning the whole price range, in a selection
    // far too small to hold them all. Cheapness ranking alone would take the
    // twelve cheapest and leave the planner nothing to spend a budget on.
    const chicken = [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700].map(
      (pricePence, index) =>
        candidate({
          retailerProductId: `chicken-${index}`,
          name: `Chicken Breast Fillets ${index}`,
          categoryPaths: [["Fresh Food", "Poultry"]],
          pricePence,
        }),
    );

    const selected = selectProducts(chicken, request(), { maxProducts: 6 }).products;
    const prices = selected.map((product) => product.pricePence).sort((a, b) => a - b);

    assert.ok(prices.length > 0, "no poultry survived selection");
    assert.ok(
      prices[0] <= 250,
      `selection kept no cheap option: ${prices.join(", ")}`,
    );
    assert.ok(
      prices[prices.length - 1] >= 450,
      `selection kept no dearer option: ${prices.join(", ")}`,
    );
    assert.ok(
      new Set(prices).size >= 3,
      `selection collapsed onto one price band: ${prices.join(", ")}`,
    );
  });

  it("is deterministic across identical inputs", () => {
    const catalogue = [200, 900, 350].map((pricePence, index) =>
      candidate({
        retailerProductId: `stable-${index}`,
        name: `Chicken Breast Fillets ${index}`,
        categoryPaths: [["Fresh Food", "Poultry"]],
        pricePence,
      }),
    );

    assert.deepEqual(
      selectProducts(catalogue, request(), { maxProducts: 2 }).products,
      selectProducts(catalogue, request(), { maxProducts: 2 }).products,
    );
  });

  it("forces a must-have product past the selection cap", () => {
    const filler = Array.from({ length: 40 }, (_, index) =>
      candidate({ retailerProductId: `filler-${index}`, name: `Fusilli Pasta ${index}` }),
    );
    const wanted = candidate({
      retailerProductId: "wanted-1",
      name: "Luxury Scottish Salmon Fillets",
      categoryPaths: [["Fresh Food", "Fish & Seafood"]],
      pricePence: 1_200,
    });

    const result = selectProducts([...filler, wanted], request(), {
      maxProducts: 5,
      mustHaveProductIds: ["wanted-1"],
    });

    assert.ok(
      result.products.some((product) => product.productId === "wanted-1"),
      "the must-have product was dropped by the selection cap",
    );
    assert.equal(result.products.length, 5, "the cap must still bound the selection");
    assert.deepEqual(result.mustHaveIssues, []);
  });

  it("does not let a must-have product bypass an allergy filter", () => {
    const unsafe = candidate({
      retailerProductId: "unsafe-1",
      name: "Peanut Butter",
      normalizedAllergens: ["peanuts"],
    });

    const result = selectProducts(
      [unsafe, candidate()],
      request({ allergies: ["peanuts"] } as Partial<MealPlanRequest>),
      { maxProducts: 20, mustHaveProductIds: ["unsafe-1"] },
    );

    assert.ok(!result.products.some((product) => product.productId === "unsafe-1"));
    assert.deepEqual(result.mustHaveIssues, [
      { productId: "unsafe-1", productName: "Peanut Butter", reason: "allergy" },
    ]);
  });

  it("does not let a must-have product bypass a dislike or a safety exclusion", () => {
    const disliked = candidate({
      retailerProductId: "disliked-1",
      name: "Mushroom Soup",
    });
    const unsafe = candidate({
      retailerProductId: "unpriced-1",
      name: "Mystery Item",
      pricePence: 0,
    });

    const result = selectProducts(
      [disliked, unsafe, candidate()],
      request({ dislikedIngredients: ["mushroom"] } as Partial<MealPlanRequest>),
      { maxProducts: 20, mustHaveProductIds: ["disliked-1", "unpriced-1"] },
    );

    assert.deepEqual(result.mustHaveIssues, [
      { productId: "disliked-1", productName: "Mushroom Soup", reason: "dislike" },
      { productId: "unpriced-1", productName: "Mystery Item", reason: "unavailable" },
    ]);
  });
});
