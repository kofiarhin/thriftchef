import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import { parseMealPlanRequest } from "./mealPlanSchemas";
import {
  PlanRejectedError,
  validateAndPricePlan,
  type PricedPlan,
} from "./mealPlanValidator";
import { generateMockPlan } from "./mockPlanner";
import { createNvidiaGenerator } from "./nvidiaClient";
import {
  fetchCandidateProducts,
  selectProducts,
  type CandidateProduct,
  type SelectionResult,
} from "./productSelector";
import type {
  MealPlanRequest,
  MealPlanResponse,
  PlanGenerator,
  PlanGeneratorInput,
  SelectableProduct,
} from "./mealPlanTypes";

/** Below this a "plan" would repeat two products all week. */
const MIN_PRODUCTS_FOR_PLAN = 3;

export interface MealPlanDependencies {
  loadProducts: (storeId: string) => Promise<CandidateProduct[]>;
  generate: PlanGenerator;
  now: () => Date;
  newPlanId: () => string;
}

export function createMockGenerator(): PlanGenerator {
  return async ({ request, products }) => generateMockPlan(request, products);
}

/**
 * Live AI is opt-in. Without `MEAL_PLAN_GENERATOR=nvidia` and credentials, the
 * app runs the deterministic planner, so local development and tests never
 * depend on an external service.
 */
export function defaultDependencies(config: AppConfig): MealPlanDependencies {
  const generate =
    config.mealPlanGenerator === "nvidia" && config.nvidia
      ? createNvidiaGenerator({
          config: config.nvidia,
          maxContextProducts: config.mealPlanMaxContextProducts,
        })
      : createMockGenerator();

  return {
    loadProducts: fetchCandidateProducts,
    generate,
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

interface GenerationOutcome {
  priced: PricedPlan;
  attempts: number;
  regenerated: boolean;
}

/**
 * Runs the generator, validates, and allows exactly one retry — for invalid
 * output or for an over-budget basket. A second failure is reported rather
 * than retried, so a broken generator cannot loop at the user's expense.
 */
async function generateValidPlan(
  dependencies: MealPlanDependencies,
  request: MealPlanRequest,
  products: SelectableProduct[],
): Promise<GenerationOutcome> {
  const productsById = new Map(products.map((product) => [product.productId, product]));
  const context = { request, products: productsById };

  let firstRejection: PlanRejectedError | null = null;
  let retry: PlanGeneratorInput["retry"];

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let priced: PricedPlan;

    try {
      priced = validateAndPricePlan(
        await dependencies.generate({ request, products, retry }),
        context,
      );
    } catch (error) {
      if (!(error instanceof PlanRejectedError) || attempt === 2) throw error;

      firstRejection = error;
      retry = { reason: error.reason };
      continue;
    }

    if (priced.budgetStatus !== "over-budget" || attempt === 2) {
      return { priced, attempts: attempt, regenerated: attempt > 1 };
    }

    retry = {
      reason: "OVER_BUDGET",
      previousTotalPence: priced.estimatedTotalPence,
    };
  }

  /* c8 ignore next */
  throw firstRejection ?? ApiError.unprocessable("Plan generation did not settle.");
}

function assertWithinBudget(priced: PricedPlan, request: MealPlanRequest): void {
  if (priced.budgetStatus !== "over-budget") return;

  throw ApiError.conflict(
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

export function createMealPlanHandler(
  config: AppConfig,
  dependencies: MealPlanDependencies,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const planRequest = parseMealPlanRequest(request.body);
    const storeId = planRequest.storeId ?? config.aldi.storeId;

    const candidates = await dependencies.loadProducts(storeId);
    const selection = selectProducts(candidates, planRequest, {
      maxProducts: config.mealPlanMaxContextProducts,
    });

    assertUsableSelection(candidates, selection, planRequest);

    const started = Date.now();
    const { priced, attempts, regenerated } = await generateValidPlan(
      dependencies,
      planRequest,
      selection.products,
    );

    assertWithinBudget(priced, planRequest);

    const warnings = [...selection.warnings];

    const seenAt = newestSeenAt(candidates);
    const staleAfterMs = config.catalogueStaleAfterHours * 60 * 60 * 1000;
    if (seenAt && dependencies.now().getTime() - seenAt.getTime() > staleAfterMs) {
      warnings.push(
        `The Aldi catalogue was last refreshed on ${seenAt.toISOString().slice(0, 10)}. Prices and availability may have changed since.`,
      );
    }

    if (regenerated) {
      warnings.push(
        "The first generated plan did not meet the constraints, so it was regenerated.",
      );
    }

    const assumptions = [
      ...priced.assumptions,
      `Recipes are scaled for a household of ${planRequest.householdSize}.`,
      "Prices are the Aldi shelf prices recorded at the last catalogue crawl and exclude offers.",
    ];

    const body: MealPlanResponse = {
      planId: dependencies.newPlanId(),
      generatedAt: dependencies.now().toISOString(),
      currency: "GBP",
      budgetPence: planRequest.budgetPence,
      estimatedTotalPence: priced.estimatedTotalPence,
      budgetStatus: priced.budgetStatus,
      assumptions,
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
    };

    addLogContext(response, {
      storeId,
      generator: config.mealPlanGenerator,
      generationMs: Date.now() - started,
      generationAttempts: attempts,
      productsConsidered: selection.productsConsidered,
      productsUsed: priced.productsUsed,
      estimatedTotalPence: priced.estimatedTotalPence,
    });

    response.json(body);
  };
}
