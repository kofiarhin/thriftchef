import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessAllergens, inferAllergens } from "./allergenInference";

describe("assessAllergens", () => {
  it("does not inherit allergens from multi-item category names", () => {
    // Aldi's categories are labels like "Rice, Pasta & Noodles". Reading them
    // as ingredients marks plain rice as gluten.
    assert.deepEqual(
      assessAllergens({ name: "Basmati Rice Pouch" }).normalizedAllergens,
      [],
    );

    assert.deepEqual(
      assessAllergens({ name: "Unsmoked Back Bacon" }).normalizedAllergens,
      [],
    );
  });

  it("still infers allergens present in the product's own wording", () => {
    assert.deepEqual(assessAllergens({ name: "Penne Pasta" }).normalizedAllergens, [
      "gluten",
    ]);
  });
});

describe("inferAllergens", () => {
  it("returns no allergens for a plain vegetable", () => {
    assert.deepEqual(inferAllergens("Sweetcorn"), []);
    assert.deepEqual(inferAllergens("Nature's Pick Carrot Batons"), []);
  });

  it("infers milk from dairy product names", () => {
    assert.deepEqual(inferAllergens("Cheddar Cheese"), ["milk"]);
    assert.deepEqual(inferAllergens("British Semi Skimmed Milk"), ["milk"]);
    assert.deepEqual(inferAllergens("Greek Style Yogurt"), ["milk"]);
    assert.deepEqual(inferAllergens("Salted Butter"), ["milk"]);
  });

  it("infers gluten from wheat-based staples", () => {
    assert.deepEqual(inferAllergens("Penne Pasta"), ["gluten"]);
    assert.deepEqual(inferAllergens("Wholemeal Bread"), ["gluten"]);
    assert.deepEqual(inferAllergens("Plain Flour"), ["gluten"]);
  });

  it("infers fish and crustaceans separately", () => {
    assert.deepEqual(inferAllergens("Scottish Salmon Fillets"), ["fish"]);
    assert.deepEqual(inferAllergens("King Prawns"), ["crustaceans"]);
  });

  it("infers multiple allergens and returns them sorted and unique", () => {
    assert.deepEqual(inferAllergens("Cheese & Ham Pasta Bake"), [
      "gluten",
      "milk",
    ]);
  });

  it("respects free-from claims in the name", () => {
    assert.deepEqual(inferAllergens("Gluten Free Penne Pasta"), []);
    assert.deepEqual(inferAllergens("Dairy Free Cheese Alternative"), []);
  });

  it("treats vegan products as free of animal allergens but keeps gluten", () => {
    assert.deepEqual(inferAllergens("Vegan Cheese Slices"), []);
    assert.deepEqual(inferAllergens("Vegan Sausage Rolls"), ["gluten"]);
  });

  it("does not read nut and seed butters as dairy", () => {
    assert.deepEqual(inferAllergens("Smooth Peanut Butter"), ["peanuts"]);
    assert.deepEqual(inferAllergens("Almond Butter"), ["tree nuts"]);
    assert.deepEqual(inferAllergens("Cocoa Butter"), []);
    // A plain butter is still dairy.
    assert.deepEqual(inferAllergens("Salted Butter"), ["milk"]);
  });

  it("infers gluten from breadcrumbed dishes that do not say breaded", () => {
    // Breadcrumb is certain, so gluten is inferred. The butter filling is only
    // typical, and claiming milk would wrongly exclude the vegan versions from
    // a dairy-allergic user's plan.
    assert.deepEqual(inferAllergens("No Chicken Kyiv"), ["gluten"]);
    assert.deepEqual(inferAllergens("Chicken Kiev"), ["gluten"]);
    assert.deepEqual(inferAllergens("Katsu Curry"), ["gluten"]);
  });

  it("infers gluten from sausages, which conventionally contain rusk", () => {
    assert.deepEqual(inferAllergens("Pork Sausages"), ["gluten"]);
  });

  it("does not match allergen words inside unrelated words", () => {
    // "Milkshake" is genuinely milk, but "Buttercup Squash" is not butter/milk
    assert.deepEqual(inferAllergens("Buttercup Squash"), []);
    assert.deepEqual(inferAllergens("Butternut Squash"), []);
  });

  it("infers egg, soya, sesame, mustard and celery", () => {
    assert.deepEqual(inferAllergens("Free Range Eggs"), ["eggs"]);
    assert.deepEqual(inferAllergens("Soya Sauce"), ["soya"]);
    assert.deepEqual(inferAllergens("Sesame Seed Bagels"), ["gluten", "sesame"]);
    assert.deepEqual(inferAllergens("Dijon Mustard"), ["mustard"]);
    assert.deepEqual(inferAllergens("Celery Sticks"), ["celery"]);
  });

  it("infers tree nuts and peanuts distinctly", () => {
    assert.deepEqual(inferAllergens("Salted Peanuts"), ["peanuts"]);
    assert.deepEqual(inferAllergens("Ground Almonds"), ["tree nuts"]);
  });

  it("is case insensitive and tolerates punctuation", () => {
    assert.deepEqual(inferAllergens("MATURE CHEDDAR, GRATED"), ["milk"]);
  });
});

describe("assessAllergens with categories", () => {
  it("reads milk from an unambiguous dairy aisle the name does not mention", () => {
    // Live regression: a yogurt named "Little Delights Strawberry, Apricot
    // and Raspberry" survived a milk-allergy filter because nothing in its
    // name said dairy.
    assert.deepEqual(
      assessAllergens({
        name: "Little Delights Strawberry, Apricot and Raspberry",
        categoryPaths: [["Chilled Food", "Yogurts"]],
      }).normalizedAllergens,
      ["milk"],
    );

    assert.deepEqual(
      assessAllergens({
        name: "Large Free Range",
        categoryPaths: [["Chilled Food", "Eggs"]],
      }).normalizedAllergens,
      ["eggs"],
    );
  });

  it("treats 'buttery' as dairy", () => {
    // Live regression: "Beautifully Buttery" passed a milk-allergy filter
    // because the pattern only matched the exact word "butter".
    assert.deepEqual(
      assessAllergens({ name: "Beautifully Buttery" }).normalizedAllergens,
      ["milk"],
    );
  });

  it("still ignores multi-item category labels", () => {
    // "Rice, Pasta & Noodles" must not mark plain rice as gluten.
    assert.deepEqual(
      assessAllergens({
        name: "Basmati Rice",
        categoryPaths: [["Food Cupboard", "Rice, Pasta & Noodles"]],
      }).normalizedAllergens,
      [],
    );
  });

  it("lets a free-from claim override the aisle", () => {
    assert.deepEqual(
      assessAllergens({
        name: "Dairy Free Spread",
        categoryPaths: [["Chilled Food", "Dairy"]],
      }).normalizedAllergens,
      [],
    );

    assert.deepEqual(
      assessAllergens({
        name: "Vegan Coconut Alternative to Yogurt",
        categoryPaths: [["Chilled Food", "Yogurts"]],
      }).normalizedAllergens,
      [],
    );
  });

  it("combines wording and aisle without duplicating", () => {
    assert.deepEqual(
      assessAllergens({
        name: "Mature Cheddar Cheese",
        categoryPaths: [["Chilled Food", "Cheese"]],
      }).normalizedAllergens,
      ["milk"],
    );
  });
});
