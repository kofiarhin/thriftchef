import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import {
  describeUtilization,
  isMateriallyBelowTarget,
  resolveBudgetTarget,
  underTargetWarning,
} from "./budgetTarget";
import { createMealPlanEngine } from "./mealPlanEngine";
import {
  parseMealPlanRequest,
  parseMealReplacementRequest,
} from "./mealPlanSchemas";
import {
  PlanRejectedError,
  validateAndPricePlan,
  type PricedPlan,
} from "./mealPlanValidator";
import {
  fetchCandidateProducts,
  selectProducts,
  type CandidateProduct,
  type SelectionResult,
} from "./productSelector";
import type {
  BudgetTarget,
  EngineDiagnostics,
  MealPlanEngine,
  MealPlanRequest,
  MealPlanResponse,
  MustHaveUsage,
  SelectableProduct,
} from "./mealPlanTypes";

/** Below this a "plan" would repeat two products all week. */
const MIN_PRODUCTS_FOR_PLAN = 3;

export interface MealPlanDependencies {
  loadProducts: (storeId: string) => Promise<CandidateProduct[]>;
  engine: MealPlanEngine;
  now: () => Date;
  newPlanId: () => string;
}

export function defaultDependencies(config: AppConfig): MealPlanDependencies {
  return {
    loadProducts: fetchCandidateProducts,
    engine: createMealPlanEngine({
      beamWidth: config.mealPlanEngine.beamWidth,
      candidateLimit: config.mealPlanEngine.candidateLimit,
      maxRecipeVariants: config.mealPlanEngine.maxRecipeVariants,
      timeoutMs: config.mealPlanEngine.timeoutMs,
    }),
    now: () => new Date(),
    newPlanId: () => randomUUID(),
  };
}

function newestSeenAt(candidates: CandidateProduct[]): Date | null {
  let newest: Date | null = null;

  for (const candidate of candidates) {
    if (!newest || candidate.lastSeenAt > newest) newest = candidate.lastSeenAt;
  }

  return newest;
}

/**
 * An empty catalogue is an operational failure the user cannot fix (503),
 * while a catalogue emptied by this request's own constraints is a conflict
 * the user can act on (409). Keeping them apart is what makes the error
 * message actionable.
 */
function assertUsableSelection(
  candidates: CandidateProduct[],
  selection: SelectionResult,
  request: MealPlanRequest,
): void {
  if (candidates.length === 0) {
    throw ApiError.catalogueUnavailable(
      "No Aldi catalogue data is available for this store yet. Run the Aldi crawl before generating a plan.",
      { availableProducts: 0 },
    );
  }

  if (selection.products.length >= MIN_PRODUCTS_FOR_PLAN) return;

  const causes: string[] = [];
  if (selection.excludedForAllergies > 0) {
    causes.push(
      `${selection.excludedForAllergies} products were removed because their allergens conflict with: ${request.allergies.join(", ")}`,
    );
  }
  if (selection.excludedForDislikes > 0) {
    causes.push(
      `${selection.excludedForDislikes} products were removed for disliked ingredients: ${request.dislikedIngredients.join(", ")}`,
    );
  }
  if (selection.excludedForSafety > 0) {
    causes.push(
      `${selection.excludedForSafety} products were removed because the catalogue could not establish their allergen status`,
    );
  }

  throw ApiError.conflict(
    "Not enough Aldi products match these constraints to build a weekly plan.",
    {
      productsConsidered: selection.productsConsidered,
      productsAvailable: selection.products.length,
      causes,
      suggestions: [
        "Remove a disliked ingredient or an allergy filter.",
        "Reduce the number of meal types per day.",
        "Re-run the Aldi crawl to widen the catalogue.",
      ],
    },
  );
}

/** Reads back to the user in the order they chose the products. */
function describeMustHaveIssue(reason: string): string {
  if (reason === "allergy") return "conflicts with an allergy you declared";
  if (reason === "dislike") return "matches an ingredient you asked to avoid";
  return "is not currently available or priced in the Aldi catalogue";
}

/**
 * A must-have id that matches no catalogue product is a malformed selection
 * rather than a planning conflict: the client sent an id that never existed,
 * so there is nothing for the user to trade off.
 */
function assertMustHaveProductsExist(
  candidates: CandidateProduct[],
  mustHaveProductIds: string[],
): void {
  if (mustHaveProductIds.length === 0) return;

  // A map, not a scan per id: the catalogue is thousands of products and this
  // runs on every request.
  const known = new Set(candidates.map((candidate) => candidate.retailerProductId));
  const missing = mustHaveProductIds.filter((productId) => !known.has(productId));

  if (missing.length === 0) return;

  throw ApiError.mustHaveProductNotFound(
    "Some of the products you asked to include are not in the current Aldi catalogue.",
    {
      productIds: missing,
      suggestions: [
        "Search for the product again and re-select it.",
        "The catalogue may have been refreshed since you chose it.",
      ],
    },
  );
}

/**
 * A must-have the user's own constraints forbid. Never silently dropped: the
 * user has to decide which of the two choices they meant.
 */
function assertMustHavesAreAllowed(selection: SelectionResult): void {
  if (selection.mustHaveIssues.length === 0) return;

  throw ApiError.mustHaveConstraintConflict(
    "Some of the products you asked to include cannot be used with your other choices.",
    {
      products: selection.mustHaveIssues.map((issue) => ({
        productId: issue.productId,
        productName: issue.productName,
        reason: issue.reason,
      })),
      causes: selection.mustHaveIssues.map(
        (issue) => `${issue.productName} ${describeMustHaveIssue(issue.reason)}.`,
      ),
      suggestions: [
        "Remove the product from your must-have list.",
        "Remove the allergy or disliked ingredient it conflicts with.",
      ],
    },
  );
}

/**
 * Checked before the search runs. A selection that already costs more than the
 * whole week is unanswerable, and spending a search proving it wastes the
 * user's time as well as the server's.
 */
function assertMustHavesFitBudget(
  products: SelectableProduct[],
  request: MealPlanRequest,
): void {
  if (request.mustHaveProductIds.length === 0) return;

  const byId = new Map(products.map((product) => [product.productId, product]));
  const subtotalPence = request.mustHaveProductIds.reduce(
    (total, productId) => total + (byId.get(productId)?.pricePence ?? 0),
    0,
  );

  if (subtotalPence <= request.budgetPence) return;

  throw ApiError.mustHaveProductsOverBudget(
    "The products you asked to include cost more than your whole weekly budget.",
    {
      budgetPence: request.budgetPence,
      mustHaveSubtotalPence: subtotalPence,
      suggestions: [
        `Increase the budget to at least £${(subtotalPence / 100).toFixed(2)}.`,
        "Remove one of the must-have products.",
      ],
    },
  );
}

/**
 * Where each must-have product ended up. Resolved entirely from the priced
 * plan and the catalogue snapshot — nothing the client said about a product's
 * name or price is read here.
 */
function mustHaveUsageFor(
  priced: PricedPlan,
  products: SelectableProduct[],
  mustHaveProductIds: string[],
): MustHaveUsage[] {
  if (mustHaveProductIds.length === 0) return [];

  const productsById = new Map(products.map((product) => [product.productId, product]));
  const recipesById = new Map(priced.recipes.map((recipe) => [recipe.id, recipe]));

  return mustHaveProductIds.map((productId) => ({
    productId,
    productName: productsById.get(productId)?.name ?? productId,
    usedIn: priced.days.flatMap((day) =>
      day.meals
        .filter((meal) => recipesById.get(meal.recipeId)?.productIds.includes(productId))
        .map((meal) => ({
          day: day.day,
          mealType: meal.mealType,
          recipeId: meal.recipeId,
        })),
    ),
  }));
}

/**
 * The engine already treats must-have coverage as a hard gate, so a failure
 * here is an engine defect rather than anything the user can act on. Re-checked
 * anyway: the promise that a chosen product is in the basket is the whole
 * feature, and a promise is worth re-reading.
 */
function assertMustHavesWereUsed(
  usage: MustHaveUsage[],
  priced: PricedPlan,
): void {
  const bought = new Set(
    priced.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
  );

  const missing = usage.filter(
    (entry) => entry.usedIn.length === 0 || !bought.has(entry.productId),
  );

  if (missing.length === 0) return;

  throw ApiError.plannerInternal(
    "The planner produced a week that left out a product you asked to include.",
  );
}

/**
 * The final validation pass over the engine's own output. Defence in depth: the
 * engine already validates every candidate, so a rejection here means an engine
 * regression slipped past its own gate, and the response contract must not
 * carry it to the browser.
 */
function validateEngineOutput(
  plan: unknown,
  request: MealPlanRequest,
  products: SelectableProduct[],
): PricedPlan {
  try {
    return validateAndPricePlan(plan, {
      request,
      products: new Map(products.map((product) => [product.productId, product])),
    });
  } catch (error) {
    if (error instanceof PlanRejectedError) {
      throw ApiError.plannerInternal(
        "The planner produced a week that failed its own validation.",
      );
    }
    throw error;
  }
}

/**
 * The engine gates the budget internally, so reaching this with an over-budget
 * basket would be a bug rather than a user problem. It is still checked: the
 * displayed total is a promise, and a promise is worth re-reading.
 */
function assertWithinBudget(priced: PricedPlan, request: MealPlanRequest): void {
  if (priced.budgetStatus !== "over-budget") return;

  throw ApiError.noAffordablePlan(
    "The cheapest plan we could build for these constraints costs more than the budget.",
    {
      budgetPence: request.budgetPence,
      minimumEstimatedPence: priced.estimatedTotalPence,
      suggestions: [
        `Increase the budget to at least £${(priced.estimatedTotalPence / 100).toFixed(2)}.`,
        "Reduce the number of meal types per day.",
        "Reduce the household size if it was entered too high.",
      ],
    },
  );
}

function staleCatalogueWarning(
  candidates: CandidateProduct[],
  config: AppConfig,
  now: Date,
): string | null {
  const seenAt = newestSeenAt(candidates);
  if (!seenAt) return null;

  const staleAfterMs = config.catalogueStaleAfterHours * 60 * 60 * 1000;
  if (now.getTime() - seenAt.getTime() <= staleAfterMs) return null;

  return `The Aldi catalogue was last refreshed on ${seenAt.toISOString().slice(0, 10)}. Prices and availability may have changed since.`;
}

function buildResponse(
  priced: PricedPlan,
  request: MealPlanRequest,
  selection: SelectionResult,
  warnings: string[],
  dependencies: MealPlanDependencies,
  budgetTarget: BudgetTarget,
  mustHaveUsage: MustHaveUsage[],
): MealPlanResponse {
  return {
    planId: dependencies.newPlanId(),
    generatedAt: dependencies.now().toISOString(),
    currency: "GBP",
    budgetPence: request.budgetPence,
    estimatedTotalPence: priced.estimatedTotalPence,
    budgetStatus: priced.budgetStatus,
    assumptions: [
      ...priced.assumptions,
      `Recipes are scaled for a household of ${request.householdSize}.`,
      "Prices are the Aldi shelf prices recorded at the last catalogue crawl and exclude offers.",
    ],
    warnings,
    days: priced.days,
    recipes: priced.recipes,
    shoppingList: priced.shoppingList,
    productCoverage: {
      productsConsidered: selection.productsConsidered,
      productsUsed: priced.productsUsed,
      excludedForAllergies: selection.excludedForAllergies,
      excludedForSafety: selection.excludedForSafety,
    },
    budgetUtilization: describeUtilization(budgetTarget, priced.estimatedTotalPence),
    mustHaveUsage,
  };
}

/** Counts and durations only — never a recipe, a product name or a constraint. */
function engineLogFields(
  diagnostics: EngineDiagnostics,
): Record<string, string | number> {
  return {
    engineVersion: diagnostics.engineVersion,
    engineMs: diagnostics.durationMs,
    recipesConsidered: diagnostics.recipesConsidered,
    candidatesGenerated: diagnostics.candidatesGenerated,
    candidatesValid: diagnostics.candidatesValid,
    selectedScore: diagnostics.selectedScore,
  };
}

export function createMealPlanHandler(
  config: AppConfig,
  dependencies: MealPlanDependencies,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const planRequest = parseMealPlanRequest(request.body);
    const storeId = planRequest.storeId ?? config.aldi.storeId;
    const budgetTarget = resolveBudgetTarget(
      planRequest.budgetPence,
      planRequest.budgetTargetPercent,
    );

    const candidates = await dependencies.loadProducts(storeId);
    assertMustHaveProductsExist(candidates, planRequest.mustHaveProductIds);

    const selection = selectProducts(candidates, planRequest, {
      maxProducts: config.mealPlanEngine.maxProducts,
      mustHaveProductIds: planRequest.mustHaveProductIds,
    });

    assertUsableSelection(candidates, selection, planRequest);
    assertMustHavesAreAllowed(selection);
    assertMustHavesFitBudget(selection.products, planRequest);

    // One call. The engine evaluates a bounded internal pool of complete weeks,
    // so there is nothing here to retry: a second identical call would search
    // exactly the same space and reach the same answer.
    const started = Date.now();
    const { plan, diagnostics } = await dependencies.engine.generate({
      request: planRequest,
      products: selection.products,
      variationSeed: planRequest.variationSeed,
    });

    const priced = validateEngineOutput(plan, planRequest, selection.products);
    assertWithinBudget(priced, planRequest);

    const mustHaveUsage = mustHaveUsageFor(
      priced,
      selection.products,
      planRequest.mustHaveProductIds,
    );
    assertMustHavesWereUsed(mustHaveUsage, priced);

    const warnings = [...selection.warnings];
    const stale = staleCatalogueWarning(candidates, config, dependencies.now());
    if (stale) warnings.push(stale);

    // Non-blocking: the plan is valid and affordable, the user simply asked for
    // a richer week than the catalogue and their constraints could build.
    if (isMateriallyBelowTarget(budgetTarget, priced.estimatedTotalPence)) {
      warnings.push(underTargetWarning(budgetTarget, priced.estimatedTotalPence));
    }

    const body = buildResponse(
      priced,
      planRequest,
      selection,
      warnings,
      dependencies,
      budgetTarget,
      mustHaveUsage,
    );

    addLogContext(response, {
      storeId,
      generator: "engine",
      generationMs: Date.now() - started,
      ...engineLogFields(diagnostics),
      productsConsidered: selection.productsConsidered,
      productsUsed: priced.productsUsed,
      estimatedTotalPence: priced.estimatedTotalPence,
      budgetTargetPercent: planRequest.budgetTargetPercent,
      mustHaveCount: planRequest.mustHaveProductIds.length,
      outcome: "generated",
    });

    response.json(body);
  };
}

function rawPlanFromResponse(plan: MealPlanResponse): unknown {
  return { days: plan.days, recipes: plan.recipes };
}

/**
 * Replaces one meal. The submitted plan is untrusted client input, so it is
 * validated before anything is changed — and a rejection there is a bad request
 * rather than a planner failure.
 */
export function createMealReplacementHandler(
  config: AppConfig,
  dependencies: MealPlanDependencies,
) {
  return async (httpRequest: Request, response: Response): Promise<void> => {
    const replacementRequest = parseMealReplacementRequest(httpRequest.body);
    const { request: planRequest, plan, day, mealType } = replacementRequest;
    const storeId = planRequest.storeId ?? config.aldi.storeId;
    const budgetTarget = resolveBudgetTarget(
      planRequest.budgetPence,
      planRequest.budgetTargetPercent,
    );

    const candidates = await dependencies.loadProducts(storeId);
    assertMustHaveProductsExist(candidates, planRequest.mustHaveProductIds);

    const selection = selectProducts(candidates, planRequest, {
      maxProducts: config.mealPlanEngine.maxProducts,
      mustHaveProductIds: planRequest.mustHaveProductIds,
    });
    assertUsableSelection(candidates, selection, planRequest);
    assertMustHavesAreAllowed(selection);
    assertMustHavesFitBudget(selection.products, planRequest);

    const products = new Map(
      selection.products.map((product) => [product.productId, product]),
    );

    let current: PricedPlan;
    try {
      current = validateAndPricePlan(rawPlanFromResponse(plan), {
        request: planRequest,
        products,
      });
    } catch (error) {
      if (error instanceof PlanRejectedError) {
        throw ApiError.badRequest(
          "The plan submitted for replacement is not a valid plan for these constraints.",
          [{ field: "plan", message: "Generate a fresh plan, then replace a meal in it." }],
          "INVALID_MEAL_PLAN_REQUEST",
        );
      }
      throw error;
    }

    const started = Date.now();
    const { plan: replacedPlan, diagnostics } = await dependencies.engine.replaceMeal({
      request: planRequest,
      currentPlan: { days: current.days, recipes: current.recipes },
      products: selection.products,
      variationSeed: planRequest.variationSeed,
      day,
      mealType,
    });

    const priced = validateEngineOutput(replacedPlan, planRequest, selection.products);
    assertWithinBudget(priced, planRequest);

    const mustHaveUsage = mustHaveUsageFor(
      priced,
      selection.products,
      planRequest.mustHaveProductIds,
    );
    assertMustHavesWereUsed(mustHaveUsage, priced);

    const body = buildResponse(
      priced,
      planRequest,
      selection,
      [...selection.warnings],
      dependencies,
      budgetTarget,
      mustHaveUsage,
    );

    addLogContext(response, {
      storeId,
      generator: "engine",
      operation: "replace-meal",
      generationMs: Date.now() - started,
      ...engineLogFields(diagnostics),
      productsConsidered: selection.productsConsidered,
      productsUsed: priced.productsUsed,
      outcome: "replaced",
    });

    response.json(body);
  };
}
