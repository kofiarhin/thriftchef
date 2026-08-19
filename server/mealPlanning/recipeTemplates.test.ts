import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  RECIPE_TEMPLATES,
  templatesForMealType,
  validateTemplate,
  type RecipeTemplate,
} from "./recipeTemplates";
import { APPLIANCES, MEAL_TYPES, PANTRY_BASICS, type MealType } from "./mealPlanTypes";

/** Spec §6.2 initial content target. */
const COVERAGE_TARGET: Record<MealType, number> = {
  breakfast: 8,
  lunch: 10,
  dinner: 12,
  snack: 6,
};

function valid(): RecipeTemplate {
  return {
    id: "test-valid",
    mealType: "lunch",
    titlePattern: "{filling} sandwich",
    cuisineTags: ["british"],
    preferenceTags: ["quick"],
    requiredAppliances: [],
    pantryItems: ["salt"],
    prepMinutes: 10,
    cookMinutes: 0,
    baseServings: 2,
    slots: [
      {
        key: "filling",
        acceptedRoles: ["cheese"],
        required: true,
        packagesAtBaseServings: 0.2,
        maxChoices: 2,
      },
    ],
    instructions: [{ text: "Slice the {filling} and serve." }],
  };
}

describe("the shipped recipe template library", () => {
  it("passes static validation for every template", () => {
    for (const template of RECIPE_TEMPLATES) {
      assert.deepEqual(
        validateTemplate(template),
        [],
        `template ${template.id} is invalid`,
      );
    }
  });

  it("gives every template a unique id", () => {
    const ids = RECIPE_TEMPLATES.map((template) => template.id);

    assert.equal(new Set(ids).size, ids.length);
  });

  it("meets the coverage target for every meal type", () => {
    for (const mealType of MEAL_TYPES) {
      assert.ok(
        templatesForMealType(mealType).length >= COVERAGE_TARGET[mealType],
        `${mealType} has ${templatesForMealType(mealType).length} templates, needs ${COVERAGE_TARGET[mealType]}`,
      );
    }
  });

  it("offers a no-appliance option for every meal type", () => {
    for (const mealType of MEAL_TYPES) {
      assert.ok(
        templatesForMealType(mealType).some(
          (template) => template.requiredAppliances.length === 0,
        ),
        `${mealType} has no appliance-free template, so a no-cook household cannot eat`,
      );
    }
  });

  it("offers a vegetarian option for every meal type", () => {
    for (const mealType of MEAL_TYPES) {
      assert.ok(
        templatesForMealType(mealType).some((template) =>
          template.preferenceTags.includes("vegetarian"),
        ),
        `${mealType} has no vegetarian template`,
      );
    }
  });

  it("never lets a required slot accept an unknown product", () => {
    for (const template of RECIPE_TEMPLATES) {
      for (const slot of template.slots) {
        assert.ok(
          !slot.acceptedRoles.includes("unknown"),
          `${template.id}.${slot.key} accepts unknown products`,
        );
      }
    }
  });

  it("only requires appliances and pantry items the request schema knows", () => {
    for (const template of RECIPE_TEMPLATES) {
      for (const appliance of template.requiredAppliances) {
        assert.ok(APPLIANCES.includes(appliance), `${template.id}: ${appliance}`);
      }
      for (const item of template.pantryItems) {
        assert.ok(PANTRY_BASICS.includes(item), `${template.id}: ${item}`);
      }
    }
  });

  it("gives every template at least one required slot", () => {
    for (const template of RECIPE_TEMPLATES) {
      assert.ok(
        template.slots.some((slot) => slot.required),
        `${template.id} has no required slot, so it would render an empty recipe`,
      );
    }
  });
});

describe("validateTemplate", () => {
  it("accepts a well-formed template", () => {
    assert.deepEqual(validateTemplate(valid()), []);
  });

  it("rejects an instruction token with no matching slot", () => {
    const broken = valid();
    broken.instructions = [{ text: "Add the {mystery} and stir." }];

    assert.ok(
      validateTemplate(broken).some((problem) => problem.includes("mystery")),
    );
  });

  it("rejects a title token with no matching slot", () => {
    const broken = valid();
    broken.titlePattern = "{ghost} on toast";

    assert.ok(validateTemplate(broken).some((problem) => problem.includes("ghost")));
  });

  it("rejects a template with no required slot", () => {
    const broken = valid();
    broken.slots[0].required = false;

    assert.ok(validateTemplate(broken).some((problem) => /required slot/i.test(problem)));
  });

  it("rejects a slot that accepts unknown products", () => {
    const broken = valid();
    broken.slots[0].acceptedRoles = ["unknown"];

    assert.ok(validateTemplate(broken).some((problem) => /unknown/i.test(problem)));
  });

  it("rejects a non-positive package quantity", () => {
    const broken = valid();
    broken.slots[0].packagesAtBaseServings = 0;

    assert.ok(validateTemplate(broken).some((problem) => /packages/i.test(problem)));
  });

  it("rejects base servings below one", () => {
    const broken = valid();
    broken.baseServings = 0;

    assert.ok(validateTemplate(broken).some((problem) => /servings/i.test(problem)));
  });

  it("rejects duplicate slot keys", () => {
    const broken = valid();
    broken.slots = [broken.slots[0], { ...broken.slots[0] }];

    assert.ok(validateTemplate(broken).some((problem) => /duplicate/i.test(problem)));
  });

  it("rejects a slot offering no choices", () => {
    const broken = valid();
    broken.slots[0].maxChoices = 0;

    assert.ok(validateTemplate(broken).some((problem) => /maxChoices/i.test(problem)));
  });

  it("rejects an empty accepted-role list", () => {
    const broken = valid();
    broken.slots[0].acceptedRoles = [];

    assert.ok(validateTemplate(broken).some((problem) => /role/i.test(problem)));
  });
});
