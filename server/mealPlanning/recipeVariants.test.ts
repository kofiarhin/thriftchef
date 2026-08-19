import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALDI_CATALOGUE,
  planRequest,
  selectedProducts,
} from "../testing/planningFixtures";
import { classifyIngredientRoles } from "./ingredientRoles";
import { buildRecipeVariants, buildVariantsForMealType } from "./recipeVariants";
import { RECIPE_TEMPLATES, type RecipeTemplate } from "./recipeTemplates";
import { selectProducts } from "./productSelector";
import type { MealPlanRequest, SelectableProduct } from "./mealPlanTypes";

function template(id: string): RecipeTemplate {
  const found = RECIPE_TEMPLATES.find((entry) => entry.id === id);
  assert.ok(found, `fixture expects template ${id}`);
  return found;
}

function build(
  templateId: string,
  options: {
    request?: MealPlanRequest;
    products?: SelectableProduct[];
    seed?: number;
    maxVariants?: number;
  } = {},
) {
  const request = options.request ?? planRequest();
  return buildRecipeVariants({
    template: template(templateId),
    products: options.products ?? selectedProducts(request),
    request,
    seed: options.seed ?? 0,
    maxVariants: options.maxVariants ?? 6,
  });
}

/** A catalogue with no bread at all, to starve a required slot. */
function catalogueWithout(pattern: RegExp): SelectableProduct[] {
  const request = planRequest();
  return selectProducts(
    ALDI_CATALOGUE.filter((product) => !pattern.test(product.name)),
    request,
    { maxProducts: 80 },
  ).products;
}

describe("buildRecipeVariants", () => {
  it("builds usable variants from a real catalogue", () => {
    const variants = build("lunch-filled-sandwich");

    assert.ok(variants.length > 0);
    for (const variant of variants) {
      assert.equal(variant.recipe.mealType, "lunch");
      assert.ok(variant.recipe.ingredients.length > 0);
      assert.ok(variant.recipe.steps.length > 0);
      assert.ok(variant.recipe.title.length > 0);
    }
  });

  it("discards the template when a required slot cannot be filled", () => {
    // The anti-"Pasta and Pâté Breakfast" rule: a missing bread must kill the
    // sandwich, never borrow a product from an unrelated role.
    const variants = build("lunch-filled-sandwich", {
      products: catalogueWithout(/bread|wrap/i),
    });

    assert.deepEqual(variants, []);
  });

  it("never fills a slot with a product lacking an accepted role", () => {
    for (const variant of build("breakfast-porridge")) {
      for (const filled of variant.filledSlots) {
        const slot = template("breakfast-porridge").slots.find(
          (entry) => entry.key === filled.slotKey,
        );
        assert.ok(slot);
        assert.ok(
          filled.product.roles.some((role) => slot.acceptedRoles.includes(role)),
          `${filled.product.name} cannot fill ${filled.slotKey}`,
        );
      }
    }
  });

  it("still builds a recipe when only an optional slot is unfillable", () => {
    const variants = build("breakfast-porridge", {
      products: catalogueWithout(/banana|apple|blueberr/i),
    });

    assert.ok(variants.length > 0, "porridge needs only cereal and milk");
    for (const variant of variants) {
      assert.ok(!variant.filledSlots.some((slot) => slot.slotKey === "fruit"));
    }
  });

  it("drops instruction steps that reference an omitted optional slot", () => {
    const [variant] = build("breakfast-porridge", {
      products: catalogueWithout(/banana|apple|blueberr/i),
    });

    assert.ok(variant);
    assert.ok(
      !variant.recipe.steps.some((step) => /\{fruit\}/.test(step)),
      "an unrendered token must never reach the user",
    );
    assert.ok(
      !variant.recipe.steps.some((step) => /chopped \.|\bthe \./.test(step)),
      "a step about the omitted ingredient must be dropped, not left dangling",
    );
  });

  it("leaves no unresolved token in any title or step", () => {
    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id)) {
        assert.ok(!/\{|\}/.test(variant.recipe.title), variant.recipe.title);
        for (const step of variant.recipe.steps) {
          assert.ok(!/\{|\}/.test(step), `${template_.id}: ${step}`);
        }
      }
    }
  });

  it("scales package quantities with household size", () => {
    const forOne = build("breakfast-porridge", {
      request: planRequest({ householdSize: 1 }),
    })[0];
    const forFour = build("breakfast-porridge", {
      request: planRequest({ householdSize: 4 }),
    })[0];

    const cerealOne = forOne.recipe.ingredients.find((entry) =>
      forOne.filledSlots.some(
        (slot) => slot.slotKey === "cereal" && slot.product.productId === entry.productId,
      ),
    );
    const cerealFour = forFour.recipe.ingredients.find((entry) =>
      forFour.filledSlots.some(
        (slot) => slot.slotKey === "cereal" && slot.product.productId === entry.productId,
      ),
    );

    assert.ok(cerealOne && cerealFour);
    // baseServings is 2, so four people need four times what one person does.
    assert.ok(
      Math.abs(cerealFour.packages - cerealOne.packages * 4) < 0.02,
      `${cerealOne.packages} -> ${cerealFour.packages}`,
    );
  });

  it("reports servings as the household size", () => {
    const [variant] = build("breakfast-porridge", {
      request: planRequest({ householdSize: 5 }),
    });

    assert.equal(variant.recipe.servings, 5);
  });

  it("keeps every package quantity inside the validator's limits", () => {
    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id, {
        request: planRequest({ householdSize: 10 }),
      })) {
        for (const ingredient of variant.recipe.ingredients) {
          assert.ok(ingredient.packages > 0, `${template_.id}: non-positive packages`);
          assert.ok(ingredient.packages <= 20, `${template_.id}: ${ingredient.packages}`);
        }
      }
    }
  });

  it("refuses a template needing an appliance the household lacks", () => {
    const variants = build("breakfast-porridge", {
      request: planRequest({ appliances: [] }),
    });

    assert.deepEqual(variants, []);
  });

  it("only claims appliances and pantry items the request allows", () => {
    const request = planRequest({ appliances: ["hob"], pantryBasics: ["salt"] });

    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id, { request })) {
        for (const appliance of variant.recipe.appliances) {
          assert.ok(request.appliances.includes(appliance));
        }
        for (const item of variant.recipe.pantryItems) {
          assert.ok(request.pantryBasics.includes(item));
        }
      }
    }
  });

  it("never uses the same product twice inside one recipe", () => {
    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id)) {
        const ids = variant.recipe.ingredients.map((entry) => entry.productId);
        assert.equal(new Set(ids).size, ids.length, template_.id);
      }
    }
  });

  it("respects the variant cap", () => {
    for (const maxVariants of [1, 2, 6]) {
      for (const template_ of RECIPE_TEMPLATES) {
        assert.ok(build(template_.id, { maxVariants }).length <= maxVariants);
      }
    }
  });

  it("is deterministic for identical inputs", () => {
    const first = build("dinner-bolognese");
    const second = build("dinner-bolognese");

    assert.deepEqual(first, second);
  });

  it("gives every variant a distinct, stable, validator-sized id", () => {
    const variants = build("dinner-bolognese");
    const ids = variants.map((variant) => variant.recipe.id);

    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) assert.ok(id.length <= 80, id);
    assert.deepEqual(build("dinner-bolognese").map((entry) => entry.recipe.id), ids);
  });

  it("varies the chosen products with the seed", () => {
    const seeds = [0, 1, 2, 3].map((seed) =>
      build("dinner-bolognese", { seed }).map((variant) => variant.recipe.id).join("|"),
    );

    assert.ok(new Set(seeds).size > 1, "a different seed must be able to change a recipe");
  });

  it("keeps the seed reproducible", () => {
    assert.deepEqual(build("dinner-bolognese", { seed: 7 }), build("dinner-bolognese", { seed: 7 }));
  });

  it("only draws products from the supplied selection", () => {
    const products = selectedProducts();
    const allowed = new Set(products.map((product) => product.productId));

    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id, { products })) {
        for (const ingredient of variant.recipe.ingredients) {
          assert.ok(allowed.has(ingredient.productId), ingredient.productId);
        }
      }
    }
  });

  it("never reaches for an unclassified product", () => {
    const products = selectedProducts();
    const unknownIds = new Set(
      products
        .filter((product) => product.roles.includes("unknown"))
        .map((product) => product.productId),
    );

    for (const template_ of RECIPE_TEMPLATES) {
      for (const variant of build(template_.id, { products })) {
        for (const ingredient of variant.recipe.ingredients) {
          assert.ok(!unknownIds.has(ingredient.productId), ingredient.productId);
        }
      }
    }
  });
});

describe("buildVariantsForMealType", () => {
  it("gathers variants across every usable template for the meal type", () => {
    const request = planRequest();
    const variants = buildVariantsForMealType({
      mealType: "dinner",
      products: selectedProducts(request),
      request,
      seed: 0,
      maxVariants: 4,
    });

    assert.ok(variants.length > 0);
    assert.ok(new Set(variants.map((entry) => entry.templateId)).size > 1);
    for (const variant of variants) assert.equal(variant.recipe.mealType, "dinner");
  });

  it("returns nothing when no template survives the constraints", () => {
    const request = planRequest({ appliances: [] });
    const variants = buildVariantsForMealType({
      mealType: "dinner",
      products: catalogueWithout(/bread|wrap|cheese|chicken|beef|salmon|tuna|bean|lentil|chickpea|houmous/i),
      request,
      seed: 0,
      maxVariants: 4,
    });

    assert.deepEqual(variants, []);
  });

  it("classifies fixture products the way the templates expect", () => {
    // Guards the fixture itself: a mis-shaped catalogue would silently make
    // every other test in this file weaker.
    const roles = classifyIngredientRoles({
      name: "Soft White Medium Bread",
      description: null,
      categoryPaths: [["Bakery", "Bread"]],
    });

    assert.ok(roles.includes("bread"));
  });
});
