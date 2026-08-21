import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyIngredientRoles,
  hasRole,
  type IngredientRole,
  type RoleClassifierInput,
} from "./ingredientRoles";

function product(
  name: string,
  categoryPath: string[] = [],
  description: string | null = null,
): RoleClassifierInput {
  return { name, description, categoryPaths: categoryPath.length ? [categoryPath] : [] };
}

/** Roles a breakfast template would ever put in a required slot. */
const BREAKFAST_ROLES: IngredientRole[] = [
  "egg",
  "breakfast_cereal",
  "bread",
  "yogurt",
  "milk",
  "fruit",
];

describe("classifyIngredientRoles", () => {
  it("reads the primary role from real Aldi product names", () => {
    const cases: Array<[string, IngredientRole]> = [
      ["Chicken Breast Fillets", "poultry"],
      ["British Turkey Mince", "poultry"],
      ["Beef Mince 500g", "red_meat"],
      ["Pork Loin Steaks", "red_meat"],
      ["Unsmoked Back Bacon", "red_meat"],
      ["Scottish Salmon Fillets", "fish"],
      ["Tuna Chunks In Brine", "fish"],
      ["Basmati Rice", "rice"],
      ["Fusilli Pasta", "pasta"],
      ["Maris Piper Potatoes", "potato"],
      ["Wholemeal Medium Bread", "bread"],
      ["Plain Tortilla Wraps", "wrap"],
      ["Scottish Porridge Oats", "breakfast_cereal"],
      ["Free Range Large Eggs", "egg"],
      ["Greek Style Natural Yogurt", "yogurt"],
      ["British Semi Skimmed Milk", "milk"],
      ["Mature Cheddar Cheese", "cheese"],
      ["Baby Spinach", "leafy_vegetable"],
      ["Broccoli", "other_vegetable"],
      ["Bananas", "fruit"],
      ["Red Lentils", "plant_protein"],
      ["Tomato Ketchup", "sauce"],
      ["Ground Cumin", "seasoning"],
      ["Ready Salted Crisps", "snack"],
    ];

    for (const [name, expected] of cases) {
      assert.ok(
        hasRole(classifyIngredientRoles(product(name)), expected),
        `${name} should classify as ${expected}, got ${classifyIngredientRoles(product(name)).join(", ")}`,
      );
    }
  });

  it("does not let a compound name borrow an unrelated role", () => {
    const traps: Array<[string, IngredientRole]> = [
      ["Milk Chocolate Digestives", "milk"],
      ["Baked Cheesecake", "cheese"],
      ["Egg Fried Rice", "egg"],
      ["Golden Breadcrumbs", "bread"],
      ["All Butter Shortbread", "bread"],
      ["Creamy Rice Pudding", "rice"],
      ["Tomato & Basil Pasta Sauce", "pasta"],
      ["Chicken Stock Cubes", "poultry"],
      ["Salted Potato Crisps", "potato"],
    ];

    for (const [name, forbidden] of traps) {
      const roles = classifyIngredientRoles(product(name));
      assert.ok(
        !hasRole(roles, forbidden),
        `${name} must not claim the ${forbidden} role, got ${roles.join(", ")}`,
      );
    }
  });

  it("gives a product every role it can genuinely fill", () => {
    const roles = classifyIngredientRoles(product("Chopped Tomatoes"));

    assert.ok(hasRole(roles, "other_vegetable"));
    assert.ok(hasRole(roles, "sauce"));
  });

  it("keeps pâté out of every breakfast slot", () => {
    const roles = classifyIngredientRoles(
      product("Brussels Pâté", ["Fresh Food", "Cooked Meats & Deli"]),
    );

    for (const role of BREAKFAST_ROLES) {
      assert.ok(!hasRole(roles, role), `pâté must not fill the ${role} slot`);
    }
  });

  it("falls back to unknown rather than guessing", () => {
    assert.deepEqual(classifyIngredientRoles(product("Scented Candle")), ["unknown"]);
    assert.deepEqual(classifyIngredientRoles(product("")), ["unknown"]);
    assert.deepEqual(classifyIngredientRoles(product("   ")), ["unknown"]);
  });

  it("ignores case, punctuation and surrounding whitespace", () => {
    const plain = classifyIngredientRoles(product("Chicken Breast Fillets"));
    const shouted = classifyIngredientRoles(product("  CHICKEN   BREAST-FILLETS  "));

    assert.deepEqual(shouted, plain);
  });

  it("reads the category path when the name alone is uninformative", () => {
    const roles = classifyIngredientRoles(
      product("Everyday Essentials Fillets", ["Fresh Food", "Poultry"]),
    );

    assert.ok(hasRole(roles, "poultry"));
  });

  it("reads the description when name and category are uninformative", () => {
    const roles = classifyIngredientRoles(
      product("Village Bakery Sliced", [], "Soft white bread, thick sliced"),
    );

    assert.ok(hasRole(roles, "bread"));
  });

  it("returns roles in a stable, de-duplicated order", () => {
    const input = product("Cheese & Tomato Pizza Topped With Cheese");
    const first = classifyIngredientRoles(input);
    const second = classifyIngredientRoles(input);

    assert.deepEqual(first, second);
    assert.equal(new Set(first).size, first.length);
  });

  it("never returns unknown alongside a real role", () => {
    const roles = classifyIngredientRoles(product("Mature Cheddar Cheese"));

    assert.ok(roles.length > 0);
    assert.ok(!hasRole(roles, "unknown"));
  });
});

/**
 * Regression cases taken from real Aldi catalogue products that reached a
 * generated plan and produced an incoherent recipe — a pâté "fruit" bowl, a
 * fish steak filling a red-meat slot, and a biscuit poured out as yogurt.
 */
describe("classifyIngredientRoles — real catalogue regressions", () => {
  it("folds accented characters instead of destroying the word", () => {
    const roles = classifyIngredientRoles(product("Apple Cider Pâté"));

    assert.ok(
      !hasRole(roles, "fruit"),
      `pâté must not fill a fruit slot, got ${roles.join(", ")}`,
    );
  });

  it("keeps a fish steak out of the red meat slot", () => {
    const roles = classifyIngredientRoles(
      product("Fish Steaks in a Cheese & Spinach Sauce 2 Pack"),
    );

    assert.ok(hasRole(roles, "fish"), "a fish steak is still fish");
    assert.ok(
      !hasRole(roles, "red_meat"),
      `a fish steak must not fill the red meat slot, got ${roles.join(", ")}`,
    );
  });

  it("keeps a yogurt-flavoured biscuit out of the yogurt slot", () => {
    const roles = classifyIngredientRoles(
      product("Strawberry & Yogurt Breakfast Biscuits 5 Pack"),
    );

    assert.ok(hasRole(roles, "snack"), "a breakfast biscuit is a snack");
    assert.ok(
      !hasRole(roles, "yogurt"),
      `a biscuit must not fill the yogurt slot, got ${roles.join(", ")}`,
    );
  });

  it("does not let a compound aisle name grant every role it lists", () => {
    const roles = classifyIngredientRoles(
      product("Classic Soba Noodles Pot", ["Food Cupboard", "Rice, Pasta & Noodles"]),
    );

    assert.ok(hasRole(roles, "other_starch"), "soba noodles are a starch");
    assert.ok(
      !hasRole(roles, "rice"),
      `soba noodles must not fill the rice slot, got ${roles.join(", ")}`,
    );
    assert.ok(
      !hasRole(roles, "pasta"),
      `soba noodles must not fill the pasta slot, got ${roles.join(", ")}`,
    );
  });

  it("still reads an unambiguous aisle when the name says nothing", () => {
    const roles = classifyIngredientRoles(
      product("Everyday Essentials Fillets", ["Fresh Food", "Poultry"]),
    );

    assert.ok(hasRole(roles, "poultry"));
  });

  it("does not let an ambiguous aisle override what the name already said", () => {
    const roles = classifyIngredientRoles(
      product("Scottish Salmon Fillets", ["Frozen Food", "Meat & Poultry"]),
    );

    assert.ok(hasRole(roles, "fish"));
    assert.ok(
      !hasRole(roles, "poultry"),
      `salmon must not fill the poultry slot, got ${roles.join(", ")}`,
    );
  });
});

/**
 * A product that names a meat, fish, egg or pulse *is* that protein. Every
 * other food word in its name describes how it was prepared or flavoured —
 * "Bramley Apple Pork Sausages" is sausages, not apples, and "Fish Steaks in a
 * Cheese & Spinach Sauce" is fish, not cheese, spinach or sauce. Without this
 * a sausage filled the fruit slot of a breakfast yogurt bowl.
 */
describe("classifyIngredientRoles — a named protein wins its own name", () => {
  const cases: Array<[string, IngredientRole, IngredientRole[]]> = [
    ["Bramley Apple Pork Sausages 6 Pack", "red_meat", ["fruit"]],
    ["Mango & Coconut Marinated Chicken Breast Sizzlers", "poultry", ["fruit"]],
    ["Fish Steaks in a Cheese & Spinach Sauce 2 Pack", "fish", ["cheese", "leafy_vegetable", "sauce", "red_meat"]],
    ["Salmon in Teriyaki Sauce", "fish", ["sauce"]],
    ["Spinach & Pepper Egg Bites", "egg", ["leafy_vegetable", "other_vegetable"]],
    ["Chicken Katsu Dragon Roll", "poultry", ["bread"]],
    ["Baked Beans in Tomato Sauce", "plant_protein", ["sauce", "other_vegetable"]],
    ["Hot Smoked Sweet Chilli Scottish Salmon Fillets", "fish", ["snack"]],
  ];

  for (const [name, kept, forbidden] of cases) {
    it(`reads ${name} as ${kept} alone`, () => {
      const roles = classifyIngredientRoles(product(name));

      assert.ok(hasRole(roles, kept), `${name} should still be ${kept}, got ${roles.join(", ")}`);
      for (const role of forbidden) {
        assert.ok(
          !hasRole(roles, role),
          `${name} must not also claim ${role}, got ${roles.join(", ")}`,
        );
      }
    });
  }

  it("leaves a product with no protein in its name alone", () => {
    const roles = classifyIngredientRoles(product("Chopped Tomatoes"));

    assert.ok(hasRole(roles, "other_vegetable"));
    assert.ok(hasRole(roles, "sauce"));
  });
});

/**
 * The fixture catalogue is 45 tidy products; the real Aldi catalogue is 2801
 * and names things the rules had never seen — cuts ("Ribeye", "Brisket
 * Joint"), prepared savouries ("Cheese & Onion Crispbakes") and desserts
 * ("Banana Blonde Sponge Pudding"). Each of these reached a generated plan.
 */
describe("classifyIngredientRoles — real catalogue vocabulary", () => {
  it("recognises cuts and prepared meat as red meat", () => {
    const cuts = [
      "Sweet Garlic Butter Ribeye",
      "100% British Beef Brisket Joint",
      "Red Wine Gravy Lamb Shanks 2 Pack",
      "Caramelised Red Onion Burgers",
      "Cheese & Onion Quarter Pounders 4 Pack",
    ];

    for (const name of cuts) {
      const roles = classifyIngredientRoles(product(name));
      assert.ok(
        hasRole(roles, "red_meat"),
        `${name} should be red meat, got ${roles.join(", ")}`,
      );
    }
  });

  it("keeps a dessert out of the fruit slot", () => {
    const desserts = [
      "Banana Blonde Sponge Pudding",
      "Strawberry Trifle",
      "Apple Crumble",
      "Lemon Cheesecake",
    ];

    for (const name of desserts) {
      const roles = classifyIngredientRoles(product(name));
      assert.ok(
        !hasRole(roles, "fruit"),
        `${name} must not fill a fruit slot, got ${roles.join(", ")}`,
      );
    }
  });

  it("refuses to read a prepared savoury as its flavour", () => {
    const roles = classifyIngredientRoles(product("Cheese & Onion Crispbakes 4 Pack"));

    assert.ok(
      !hasRole(roles, "cheese"),
      `a crispbake is not cheese, got ${roles.join(", ")}`,
    );
    assert.ok(
      !hasRole(roles, "other_vegetable"),
      `a crispbake is not a vegetable, got ${roles.join(", ")}`,
    );
  });

  it("still reads a plain vegan burger as plant protein, not meat", () => {
    const roles = classifyIngredientRoles(product("Vegan Quarter Pounder Burgers"));

    assert.ok(hasRole(roles, "plant_protein"));
    assert.ok(!hasRole(roles, "red_meat"), `got ${roles.join(", ")}`);
  });
});
