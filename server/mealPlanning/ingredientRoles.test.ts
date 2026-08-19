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
