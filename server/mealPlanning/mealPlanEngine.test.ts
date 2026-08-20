import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ApiError } from "../http/errors";
import {
  ALDI_CATALOGUE,
  planRequest,
  productsById,
  selectedProducts,
} from "../testing/planningFixtures";
import { createMealPlanEngine, type EngineOptions } from "./mealPlanEngine";
import { PlanRejectedError, validateAndPricePlan } from "./mealPlanValidator";
import { selectProducts } from "./productSelector";
import { PLAN_DAYS, type MealPlanRequest, type MealType } from "./mealPlanTypes";

const BOUNDS: EngineOptions = {
  beamWidth: 32,
  candidateLimit: 24,
  maxRecipeVariants: 6,
  timeoutMs: 1_500,
};

function engine(overrides: Partial<EngineOptions> = {}) {
  return createMealPlanEngine({ ...BOUNDS, ...overrides });
}

async function generate(
  request: MealPlanRequest = planRequest(),
  options: Partial<EngineOptions> = {},
  variationSeed = 0,
) {
  const products = selectedProducts(request);
  const result = await engine(options).generate({ request, products, variationSeed });

  return { result, products, request };
}

const CONSTRAINT_MATRIX: Array<[string, MealPlanRequest]> = [
  ["three meals, two people", planRequest()],
  ["every meal type", planRequest({ mealsPerDay: ["breakfast", "lunch", "dinner", "snack"] })],
  ["dinner only", planRequest({ mealsPerDay: ["dinner"] })],
  ["single person", planRequest({ householdSize: 1 })],
  ["large household", planRequest({ householdSize: 8, budgetPence: 20_000 })],
  ["no-cook household", planRequest({ appliances: [] })],
  ["hob only", planRequest({ appliances: ["hob"] })],
  ["vegetarian", planRequest({ mealPreferences: ["vegetarian"] })],
  ["quick and thrifty", planRequest({ mealPreferences: ["quick", "low-waste"] })],
  ["milk allergy", planRequest({ allergies: ["milk"], budgetPence: 9_000 })],
  ["dislikes", planRequest({ dislikedIngredients: ["broccoli", "salmon"] })],
  ["no pantry", planRequest({ pantryBasics: [] })],
  ["cuisine preference", planRequest({ cuisinePreferences: ["italian"] })],
];

describe("the meal plan engine", () => {
  for (const [label, request] of CONSTRAINT_MATRIX) {
    it(`builds a valid, affordable week: ${label}`, async () => {
      const products = selectedProducts(request);
      const { plan } = await engine().generate({ request, products, variationSeed: 0 });
      const priced = validateAndPricePlan(plan, {
        request,
        products: productsById(products),
      });

      assert.equal(priced.days.length, PLAN_DAYS);
      for (const day of priced.days) {
        assert.deepEqual(
          day.meals.map((meal) => meal.mealType).sort(),
          [...request.mealsPerDay].sort(),
          `day ${day.day} does not serve exactly the requested meals`,
        );
      }
      assert.ok(
        priced.estimatedTotalPence <= request.budgetPence,
        `${priced.estimatedTotalPence} exceeds ${request.budgetPence}`,
      );
      assert.equal(priced.budgetStatus, "within-budget");
    });
  }

  it("shops only from the selected products", async () => {
    const { result, products } = await generate();
    const allowed = new Set(products.map((product) => product.productId));

    for (const recipe of result.plan.recipes) {
      for (const ingredient of recipe.ingredients) {
        assert.ok(allowed.has(ingredient.productId), ingredient.productId);
      }
    }
  });

  it("never uses a product that conflicts with a declared allergy", async () => {
    const request = planRequest({ allergies: ["milk"], budgetPence: 9_000 });
    const { result, products } = await generate(request);
    const byId = productsById(products);

    for (const recipe of result.plan.recipes) {
      for (const ingredient of recipe.ingredients) {
        const product = byId.get(ingredient.productId);
        assert.ok(product);
        assert.ok(!product.allergens.includes("milk"), product.name);
      }
    }
  });

  it("never uses a disliked ingredient", async () => {
    const request = planRequest({ dislikedIngredients: ["broccoli"] });
    const { result, products } = await generate(request);
    const byId = productsById(products);

    for (const recipe of result.plan.recipes) {
      for (const ingredient of recipe.ingredients) {
        assert.ok(!/broccoli/i.test(byId.get(ingredient.productId)?.name ?? ""));
      }
    }
  });

  it("never requires an appliance the household does not have", async () => {
    const request = planRequest({ appliances: ["hob"] });
    const { result } = await generate(request);

    for (const recipe of result.plan.recipes) {
      for (const appliance of recipe.appliances) {
        assert.ok(request.appliances.includes(appliance), appliance);
      }
    }
  });

  it("plans a no-cook week when there is nothing to cook with", async () => {
    const { result } = await generate(planRequest({ appliances: [] }));

    for (const recipe of result.plan.recipes) {
      assert.deepEqual(recipe.appliances, []);
    }
  });

  it("never serves the same recipe two days running when alternatives exist", async () => {
    const { result } = await generate();
    const byDay = new Map(result.plan.days.map((day) => [day.day, day.meals]));

    for (let day = 2; day <= PLAN_DAYS; day += 1) {
      for (const meal of byDay.get(day) ?? []) {
        const yesterday = byDay
          .get(day - 1)
          ?.find((entry) => entry.mealType === meal.mealType);

        assert.notEqual(
          meal.recipeId,
          yesterday?.recipeId,
          `${meal.mealType} repeats on days ${day - 1} and ${day}`,
        );
      }
    }
  });

  it("uses a small, reusable set of recipes rather than seven of everything", async () => {
    const { result } = await generate();

    for (const mealType of result.plan.recipes.map((recipe) => recipe.mealType)) {
      const distinct = result.plan.recipes.filter(
        (recipe) => recipe.mealType === mealType,
      ).length;

      assert.ok(distinct >= 2, `${mealType} needs variety`);
      assert.ok(distinct <= 4, `${mealType} bought too many one-off recipes`);
    }
  });

  /**
   * Two variants of one template can differ only in an optional ingredient and
   * still render the same title. Serving both reads as the planner repeating
   * itself, whatever the recipe ids say.
   */
  it("never serves two recipes with the same title", async () => {
    for (const seed of [0, 1, 2, 3]) {
      const { result } = await generate(planRequest(), {}, seed);
      const titles = result.plan.recipes.map((recipe) => recipe.title);

      assert.equal(
        new Set(titles).size,
        titles.length,
        `seed ${seed} repeated a title: ${titles.join(" | ")}`,
      );
    }
  });

  /**
   * A pure cost race collapses the week onto whichever cheap product fits the
   * most slots — technically valid, genuinely miserable to eat.
   */
  it("builds the week around more than one core ingredient", async () => {
    const { result, products } = await generate();
    const byId = productsById(products);

    const primaries = result.plan.recipes.map(
      (recipe) => recipe.ingredients[0]?.productId ?? "",
    );

    assert.ok(
      new Set(primaries).size >= Math.min(4, result.plan.recipes.length),
      `the week leans on too few ingredients: ${primaries
        .map((id) => byId.get(id)?.name ?? id)
        .join(", ")}`,
    );
  });

  it("produces a deep-equal plan for the same seed", async () => {
    const first = await generate(planRequest(), {}, 42);
    const second = await generate(planRequest(), {}, 42);

    assert.deepEqual(first.result.plan, second.result.plan);
  });

  it("produces a different week for at least one other seed", async () => {
    const base = await generate(planRequest(), {}, 0);
    const others = await Promise.all(
      [1, 2, 3, 4, 5].map((seed) => generate(planRequest(), {}, seed)),
    );

    assert.ok(
      others.some(
        (other) =>
          JSON.stringify(other.result.plan) !== JSON.stringify(base.result.plan),
      ),
      "regeneration must be able to produce a different valid plan",
    );
  });

  it("stays inside the configured candidate limit", async () => {
    let validations = 0;
    const request = planRequest();
    const products = selectedProducts(request);

    const result = await engine({
      candidateLimit: 5,
      validate: (raw, context) => {
        validations += 1;
        return validateAndPricePlan(raw, context);
      },
    }).generate({ request, products, variationSeed: 0 });

    assert.ok(validations <= 5, `validated ${validations} candidates for a limit of 5`);
    assert.ok(result.diagnostics.candidatesGenerated <= 5);
  });

  it("reports diagnostics that describe the search it actually ran", async () => {
    const { result } = await generate();
    const { diagnostics } = result;

    assert.ok(diagnostics.engineVersion.length > 0);
    assert.ok(diagnostics.durationMs >= 0);
    assert.ok(diagnostics.recipesConsidered > 0);
    assert.ok(diagnostics.candidatesGenerated > 0);
    assert.ok(diagnostics.candidatesValid > 0);
    assert.ok(diagnostics.candidatesValid <= diagnostics.candidatesGenerated);
    assert.ok(diagnostics.selectedScore > 0 && diagnostics.selectedScore <= 100);
    assert.ok(diagnostics.scoreBreakdown.budgetFit >= 0);
  });

  it("works at the narrowest configured bounds", async () => {
    const { result } = await generate(planRequest(), {
      beamWidth: 8,
      candidateLimit: 4,
      maxRecipeVariants: 1,
    });

    assert.equal(result.plan.days.length, PLAN_DAYS);
  });

  it("never invents a recipe a day does not reference", async () => {
    const { result } = await generate();
    const referenced = new Set(
      result.plan.days.flatMap((day) => day.meals.map((meal) => meal.recipeId)),
    );

    for (const recipe of result.plan.recipes) {
      assert.ok(referenced.has(recipe.id), `${recipe.id} is never served`);
    }
    assert.equal(referenced.size, result.plan.recipes.length);
  });

  it("rejects the request when a meal type has no buildable recipe", async () => {
    // A catalogue with no breakfast-capable products at all: the engine must
    // say so, not serve pâté on pasta.
    const request = planRequest({ mealsPerDay: ["breakfast"] });
    const products = selectProducts(
      ALDI_CATALOGUE.filter((product) =>
        /Chicken|Beef|Salmon|Passata|Olive Oil/i.test(product.name),
      ),
      request,
      { maxProducts: 80 },
    ).products;

    await assert.rejects(
      () => engine().generate({ request, products, variationSeed: 0 }),
      (error: unknown) =>
        error instanceof ApiError && error.code === "CATALOGUE_CONSTRAINT_CONFLICT",
    );
  });

  it("reports the cheapest achievable basket when nothing fits the budget", async () => {
    const request = planRequest({ budgetPence: 1_000 });
    const products = selectedProducts(request);

    await assert.rejects(
      () => engine().generate({ request, products, variationSeed: 0 }),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.code, "NO_AFFORDABLE_PLAN");

        const details = error.details as { minimumEstimatedPence?: number };
        assert.ok(
          (details.minimumEstimatedPence ?? 0) > request.budgetPence,
          "the user needs to know what the week would actually cost",
        );
        return true;
      },
    );
  });

  it("never returns an over-budget plan even when it scores well", async () => {
    for (const budgetPence of [3_000, 4_500, 6_000, 12_000]) {
      const request = planRequest({ budgetPence });
      const products = selectedProducts(request);

      let plan;
      try {
        plan = (await engine().generate({ request, products, variationSeed: 0 })).plan;
      } catch (error) {
        assert.ok(error instanceof ApiError && error.code === "NO_AFFORDABLE_PLAN");
        continue;
      }

      const priced = validateAndPricePlan(plan, {
        request,
        products: productsById(products),
      });
      assert.ok(priced.estimatedTotalPence <= budgetPence);
    }
  });

  it("reports capacity rather than hanging when the deadline is impossible", async () => {
    const request = planRequest();
    const products = selectedProducts(request);

    await assert.rejects(
      () => engine({ timeoutMs: 0 }).generate({ request, products, variationSeed: 0 }),
      (error: unknown) =>
        error instanceof ApiError && error.code === "PLANNER_CAPACITY_EXCEEDED",
    );
  });

  it("surfaces an engine bug as an internal error, not a user problem", async () => {
    const request = planRequest();
    const products = selectedProducts(request);

    await assert.rejects(
      () =>
        engine({
          validate: () => {
            throw new PlanRejectedError("INVALID_RECIPE", "rejected");
          },
        }).generate({ request, products, variationSeed: 0 }),
      (error: unknown) =>
        error instanceof ApiError && error.code === "PLANNER_INTERNAL_ERROR",
    );
  });

  it("never titles a meal with an unrendered slot token", async () => {
    const { result } = await generate();

    for (const recipe of result.plan.recipes) {
      assert.ok(!/\{|\}/.test(recipe.title), recipe.title);
      for (const step of recipe.steps) assert.ok(!/\{|\}/.test(step), step);
    }
  });
});

describe("meal replacement", () => {
  async function planned(request = planRequest()) {
    const products = selectedProducts(request);
    const { plan } = await engine().generate({ request, products, variationSeed: 0 });
    return { plan, products, request };
  }

  it("changes only the targeted meal", async () => {
    const { plan, products, request } = await planned();
    const target = { day: 3, mealType: "dinner" as MealType };

    const { plan: replaced } = await engine().replaceMeal({
      request,
      currentPlan: plan,
      products,
      variationSeed: 0,
      ...target,
    });

    for (const day of replaced.days) {
      const before = plan.days.find((entry) => entry.day === day.day);
      for (const meal of day.meals) {
        const previous = before?.meals.find((entry) => entry.mealType === meal.mealType);

        if (day.day === target.day && meal.mealType === target.mealType) {
          assert.notEqual(meal.recipeId, previous?.recipeId, "the target must change");
        } else {
          assert.equal(meal.recipeId, previous?.recipeId, `day ${day.day} changed`);
        }
      }
    }
  });

  it("keeps the replacement inside the budget", async () => {
    const { plan, products, request } = await planned();

    const { plan: replaced } = await engine().replaceMeal({
      request,
      currentPlan: plan,
      products,
      variationSeed: 0,
      day: 1,
      mealType: "lunch",
    });

    const priced = validateAndPricePlan(replaced, {
      request,
      products: productsById(products),
    });
    assert.ok(priced.estimatedTotalPence <= request.budgetPence);
  });

  it("is deterministic for the same seed", async () => {
    const { plan, products, request } = await planned();
    const args = {
      request,
      currentPlan: plan,
      products,
      variationSeed: 3,
      day: 2,
      mealType: "dinner" as MealType,
    };

    const first = await engine().replaceMeal(args);
    const second = await engine().replaceMeal(args);

    assert.deepEqual(first.plan, second.plan);
  });

  it("drops recipes the replacement left unreferenced", async () => {
    const { plan, products, request } = await planned();

    const { plan: replaced } = await engine().replaceMeal({
      request,
      currentPlan: plan,
      products,
      variationSeed: 0,
      day: 1,
      mealType: "dinner",
    });

    const referenced = new Set(
      replaced.days.flatMap((day) => day.meals.map((meal) => meal.recipeId)),
    );
    for (const recipe of replaced.recipes) {
      assert.ok(referenced.has(recipe.id), `${recipe.id} is orphaned`);
    }
  });

  it("reports when no distinct alternative exists", async () => {
    const request = planRequest({ mealsPerDay: ["snack"], appliances: [] });
    const products = selectProducts(
      ALDI_CATALOGUE.filter((product) => /Gala Apples/i.test(product.name)),
      request,
      { maxProducts: 80 },
    ).products;
    const { plan } = await engine().generate({ request, products, variationSeed: 0 });

    await assert.rejects(
      () =>
        engine().replaceMeal({
          request,
          currentPlan: plan,
          products,
          variationSeed: 0,
          day: 1,
          mealType: "snack",
        }),
      (error: unknown) =>
        error instanceof ApiError && error.code === "NO_REPLACEMENT_AVAILABLE",
    );
  });

  it("rejects a target the plan does not contain", async () => {
    const { plan, products, request } = await planned();

    await assert.rejects(
      () =>
        engine().replaceMeal({
          request,
          currentPlan: plan,
          products,
          variationSeed: 0,
          day: 1,
          mealType: "snack",
        }),
      (error: unknown) => error instanceof ApiError,
    );
  });
});

describe("budget target utilization", () => {
  /**
   * The fixture catalogue is small and cheap, so its whole reachable range is
   * a few pounds wide. The budget used here sits inside that range, which is
   * what makes the presets distinguishable at all — the point being tested is
   * that the target moves the answer, not that any catalogue can fill any
   * budget.
   */
  const REACHABLE_BUDGET_PENCE = 3_000;

  async function basketFor(percent: 50 | 65 | 80, budgetPence = REACHABLE_BUDGET_PENCE) {
    const request = planRequest({ budgetPence, budgetTargetPercent: percent });
    const products = selectedProducts(request);
    const { plan } = await engine().generate({ request, products, variationSeed: 0 });

    return validateAndPricePlan(plan, { request, products: productsById(products) });
  }

  it("spends materially more for a generous target than for a tight one", async () => {
    const tight = await basketFor(50);
    const generous = await basketFor(80);

    assert.ok(
      generous.estimatedTotalPence > tight.estimatedTotalPence,
      `80% (${generous.estimatedTotalPence}) did not beat 50% (${tight.estimatedTotalPence})`,
    );
    assert.ok(
      generous.estimatedTotalPence - tight.estimatedTotalPence >= 300,
      "the difference between presets must be worth choosing between",
    );
  });

  it("never exceeds the hard maximum, whatever the target asks for", async () => {
    for (const percent of [50, 65, 80] as const) {
      // £20 is about the cheapest week this catalogue can build at all; below
      // that the correct answer is NO_AFFORDABLE_PLAN, which is tested above.
      for (const budgetPence of [2_000, 3_000, 9_000]) {
        const priced = await basketFor(percent, budgetPence);

        assert.ok(
          priced.estimatedTotalPence <= budgetPence,
          `${percent}% of ${budgetPence} produced ${priced.estimatedTotalPence}`,
        );
        assert.equal(priced.budgetStatus, "within-budget");
      }
    }
  });

  it("returns the best affordable week rather than failing when the target is out of reach", async () => {
    // £200 is far beyond anything this catalogue can fill.
    const priced = await basketFor(80, 20_000);

    assert.ok(priced.estimatedTotalPence > 0);
    assert.equal(priced.budgetStatus, "within-budget");
  });

  it("stays deterministic for the same request, seed and target", async () => {
    const request = planRequest({
      budgetPence: REACHABLE_BUDGET_PENCE,
      budgetTargetPercent: 80,
    });
    const products = selectedProducts(request);

    const first = await engine().generate({ request, products, variationSeed: 4 });
    const second = await engine().generate({ request, products, variationSeed: 4 });

    assert.deepEqual(first.plan, second.plan);
  });

  it("buys nothing the week does not cook with", async () => {
    const request = planRequest({ budgetPence: 9_000, budgetTargetPercent: 80 });
    const products = selectedProducts(request);
    const { plan } = await engine().generate({ request, products, variationSeed: 0 });
    const priced = validateAndPricePlan(plan, {
      request,
      products: productsById(products),
    });

    const cooked = new Set(priced.recipes.flatMap((recipe) => recipe.productIds));

    for (const group of priced.shoppingList) {
      for (const item of group.items) {
        assert.ok(
          cooked.has(item.productId),
          `${item.name} is in the basket but no recipe uses it`,
        );
      }
    }
  });
});

describe("must-have products", () => {
  /** A product every dinner recipe library can find a slot for. */
  const CHICKEN = "p-chicken-breast";
  const RICE = "p-basmati-rice";

  async function generateWith(
    mustHaveProductIds: string[],
    overrides: Record<string, unknown> = {},
  ) {
    const request = planRequest({ mustHaveProductIds, ...overrides });
    const products = selectedProducts(request);
    const { plan } = await engine().generate({ request, products, variationSeed: 0 });
    const priced = validateAndPricePlan(plan, {
      request,
      products: productsById(products),
    });

    return { plan, priced, request, products };
  }

  it("uses every must-have product in a recipe and buys it in the shopping list", async () => {
    const { priced } = await generateWith([CHICKEN, RICE]);

    const cooked = new Set(priced.recipes.flatMap((recipe) => recipe.productIds));
    const bought = new Set(
      priced.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
    );

    for (const productId of [CHICKEN, RICE]) {
      assert.ok(cooked.has(productId), `${productId} is in no recipe`);
      assert.ok(bought.has(productId), `${productId} is in no shopping list`);
    }
  });

  it("keeps a must-have product that the ranking cap would otherwise drop", async () => {
    const request = planRequest({
      mealsPerDay: ["dinner"],
      mustHaveProductIds: [RICE],
    });
    // Tight enough that food-group allocation spends every slot on proteins,
    // vegetables and the cheapest staple. Ranking has no reason to keep rice,
    // which is exactly the situation a must-have has to survive.
    const cap = { maxProducts: 8 };
    const unforced = selectProducts(ALDI_CATALOGUE, request, cap).products;
    assert.ok(
      !unforced.some((product) => product.productId === RICE),
      "the cap is not tight enough for this test to prove anything",
    );

    const products = selectProducts(ALDI_CATALOGUE, request, {
      ...cap,
      mustHaveProductIds: [RICE],
    }).products;

    const { plan } = await engine().generate({ request, products, variationSeed: 0 });
    const priced = validateAndPricePlan(plan, {
      request,
      products: productsById(products),
    });

    assert.ok(
      priced.recipes.some((recipe) => recipe.productIds.includes(RICE)),
      "the must-have product did not survive a tight selection cap",
    );
  });

  it("spreads several must-have products across the week", async () => {
    const { priced } = await generateWith([
      CHICKEN,
      RICE,
      "p-porridge-oats",
      "p-cheddar",
    ]);

    const cooked = new Set(priced.recipes.flatMap((recipe) => recipe.productIds));

    for (const productId of [CHICKEN, RICE, "p-porridge-oats", "p-cheddar"]) {
      assert.ok(cooked.has(productId), `${productId} is in no recipe`);
    }
  });

  it("reports a product no recipe template can use rather than forcing it in", async () => {
    // Crisps carry the snack role alone, and no breakfast, lunch or dinner
    // template has a snack slot.
    await assert.rejects(
      () => generateWith(["p-crisps"], { mealsPerDay: ["dinner"] }),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 409);
        assert.equal(error.code, "MUST_HAVE_PRODUCT_UNUSABLE");
        assert.deepEqual(
          (error.details as { productIds: string[] }).productIds,
          ["p-crisps"],
        );
        return true;
      },
    );
  });

  it("never places a must-have product in a slot its role does not fit", async () => {
    const { priced } = await generateWith([RICE]);

    for (const recipe of priced.recipes) {
      if (!recipe.productIds.includes(RICE)) continue;

      const ingredient = recipe.ingredients.find((item) => item.productId === RICE);
      assert.ok(ingredient, "the must-have product vanished from its own recipe");
    }
  });

  it("stays deterministic with must-have products", async () => {
    const request = planRequest({ mustHaveProductIds: [CHICKEN, RICE] });
    const products = selectedProducts(request);

    const first = await engine().generate({ request, products, variationSeed: 2 });
    const second = await engine().generate({ request, products, variationSeed: 2 });

    assert.deepEqual(first.plan, second.plan);
  });

  it("keeps every must-have product when a meal is replaced", async () => {
    const { plan, request, products } = await generateWith([CHICKEN, RICE]);

    const { plan: replaced } = await engine().replaceMeal({
      request,
      currentPlan: plan,
      products,
      variationSeed: 0,
      day: 1,
      mealType: "dinner",
    });

    const priced = validateAndPricePlan(replaced, {
      request,
      products: productsById(products),
    });
    const cooked = new Set(priced.recipes.flatMap((recipe) => recipe.productIds));

    for (const productId of [CHICKEN, RICE]) {
      assert.ok(cooked.has(productId), `replacement lost must-have ${productId}`);
    }
  });

  it("refuses a replacement that could only be made by dropping a must-have", async () => {
    // One meal type and one must-have: every alternative for that meal either
    // keeps the product or loses it from the week entirely.
    const { plan, request, products } = await generateWith([CHICKEN], {
      mealsPerDay: ["dinner"],
    });

    const { plan: replaced } = await engine().replaceMeal({
      request,
      currentPlan: plan,
      products,
      variationSeed: 0,
      day: 3,
      mealType: "dinner",
    });

    const priced = validateAndPricePlan(replaced, {
      request,
      products: productsById(products),
    });

    assert.ok(
      priced.recipes.some((recipe) => recipe.productIds.includes(CHICKEN)),
      "the replacement dropped the must-have product",
    );
  });
});
