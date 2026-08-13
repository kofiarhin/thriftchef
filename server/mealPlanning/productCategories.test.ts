import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyFoodGroup, primaryCategory } from "./productCategories";

describe("classifyFoodGroup", () => {
  it("reads the Aldi department as the food group", () => {
    const cases: Array<[string[][], string]> = [
      [[["Fresh Food", "Poultry"]], "protein"],
      [[["Fresh Food", "Beef"]], "protein"],
      [[["Fresh Food", "Fish"]], "protein"],
      [[["Chilled Food", "Meat Substitutes"]], "protein"],
      [[["Fresh Food", "Vegetables"]], "vegetable"],
      [[["Frozen Food", "Vegetables & Sides"]], "vegetable"],
      [[["Fresh Food", "Fruit"]], "fruit"],
      [[["Food Cupboard", "Rice, Pasta & Noodles"]], "staple"],
      [[["Frozen Food", "Chips & Potato"]], "staple"],
      [[["Chilled Food", "Cheese"]], "dairy"],
      [[["Chilled Food", "Eggs"]], "dairy"],
      [[["Bakery", "Bread"]], "bakery"],
      [[["Food Cupboard", "Sauces, Oils & Dressings"]], "sauce"],
      [[["Food Cupboard", "Herbs & Spices"]], "sauce"],
      [[["Food Cupboard", "Crisps & Snacks"]], "snack"],
      [[["Food Cupboard", "Chocolate & Sweets"]], "snack"],
    ];

    for (const [paths, expected] of cases) {
      assert.equal(
        classifyFoodGroup(paths),
        expected,
        `${JSON.stringify(paths)} should be ${expected}`,
      );
    }
  });

  it("does not read a nuts aisle as fruit", () => {
    // Aldi files nuts under "Seeds, Nuts & Dried Fruits"; treating that as
    // fruit put roasted peanuts in a breakfast fruit bowl.
    assert.equal(
      classifyFoodGroup([["Food Cupboard", "Seeds, Nuts & Dried Fruits"]]),
      "snack",
    );
    assert.equal(classifyFoodGroup([["Fresh Food", "Fruit"]]), "fruit");
  });

  it("falls back to other for an unrecognized category", () => {
    assert.equal(classifyFoodGroup([["Home", "Kitchenware"]]), "other");
    assert.equal(classifyFoodGroup([]), "other");
  });

  it("prefers the most specific matching path when a product spans categories", () => {
    // Products merged across categories keep every path; a chicken that also
    // appears under a Ready Meals promotion is still a protein.
    assert.equal(
      classifyFoodGroup([
        ["Chilled Food", "Ready Meals"],
        ["Fresh Food", "Poultry"],
      ]),
      "protein",
    );
  });
});

describe("primaryCategory", () => {
  it("groups by the store department", () => {
    assert.equal(primaryCategory([["Fresh Food", "Poultry"]]), "Fresh Food");
  });

  it("uses Other when a product has no category at all", () => {
    assert.equal(primaryCategory([]), "Other");
    assert.equal(primaryCategory([[]]), "Other");
  });
});
