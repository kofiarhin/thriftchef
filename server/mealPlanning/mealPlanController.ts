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
import { createMealPlanEngine, ENGINE_VERSION } from "./mealPlanEngine";
import {
  ephemeralAnonymousId,
  findPlan,
  newPlanId,
  savePlan,
} from "./mealPlanRepository";
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
  CatalogueProvenance,
  EngineDiagnostics,
  MealPlanEngine,
  MealPlanRequest,
  MealPlanResponse,
  MustHaveUsage,
  SelectableProduct,
} from "./mealPlanTypes";
import type { ResolvedCatalogueScope } from "../catalogue/core/retailerTypes";
import { resolveCatalogueScope } from "../catalogue/retailerRegistry";

/** Below this a "plan" would repeat two products all week. */
const MIN_PRODUCTS_FOR_PLAN = 3;

export interface MealPlanDependencies {
  /**
   * Resolves the retailer and store a request names into the single scope
   * every catalogue read runs under. Injectable so route tests can exercise
   * planning without a database, but never optional: there is no code path
   * that reads a catalogue without one.
   */
  resolveScope: (request: MealPlanRequest) => Promise<ResolvedCatalogueScope>;
  loadProducts: (scope: ResolvedCatalogueScope) => Promise<CandidateProduct[]>;
  engine: MealPlanEngine;
  now: () => Date;
  newPlanId: () => string;
  /**
   * Persists a generated plan. Injectable so route tests exercise planning
   * without a database; a failure here is reported rather than swallowed,
   * because a plan the user cannot reopen is not a plan they were given.
   */
  savePlan: (input: {
    plan: MealPlanResponse;
    request: MealPlanRequest;
    scope: ResolvedCatalogueScope;
    anonymousId: string;
  }) => Promise<void>;
  loadPlan: (planId: string) => Promise<MealPlanResponse | null>;
}

export function defaultDependencies(config: AppConfig): MealPlanDependencies {
  return {
    resolveScope: (request) =>
      resolveCatalogueScope({
        retailer: request.retailerId ?? config.defaultRetailerSlug,
        store: request.storeId,
      }),
    loadProducts: (scope) => fetchCandidateProducts(scope, config.catalogueReadSource),
    engine: createMealPlanEngine({
      beamWidth: config.mealPlanEngine.beamWidth,
      candidateLimit: config.mealPlanEngine.candidateLimit,
      maxRecipeVariants: config.mealPlanEngine.maxRecipeVariants,
      timeoutMs: config.mealPlanEngine.timeoutMs,
    }),
    now: () => new Date(),
    newPlanId,
    savePlan: (input) =>
      savePlan({
        ...input,
        engineVersion: ENGINE_VERSION,
        retentionDays: config.planRetentionDays,
        now: new Date(),
      }),
    loadPlan: async (planId) => (await findPlan(planId))?.plan ?? null,
  };
}

/**
 * The device this request came from, for correlating its own plans.
 *
 * A client that sends none gets a throwaway id rather than an error:
 * generation is anonymous, and refusing to plan for someone who declined to
 * be correlated would defeat the point.
 */
function anonymousIdFrom(request: Request): string {
  const header = request.get("x-anonymous-id");

  return header && /^[A-Za-z0-9._:-]{8,128}$/.test(header)
    ? header
    : ephemeralAnonymousId();
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
  scope: ResolvedCatalogueScope,
): void {
  if (candidates.length === 0) {
    throw ApiError.catalogueUnavailable(
      `No ${scope.retailerName} catalogue data is available for ${scope.storeName} yet.`,
      { availableProducts: 0, retailer: scope.retailerSlug },
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
    `Not enough ${scope.retailerName} products match these constraints to build a weekly plan.`,
    {
      productsConsidered: selection.productsConsidered,
      productsAvailable: selection.products.length,
      causes,
      suggestions: [
        "Remove a disliked ingredient or an allergy filter.",
        "Reduce the number of meal types per day.",
        "Choose fewer cooking days.",
      ],
    },
  );
}

/** Reads back to the user in the order they chose the products. */
function describeMustHaveIssue(reason: string): string {
  if (reason === "allergy") return "conflicts with an allergy you declared";
  if (reason === "dislike") return "matches an ingredient you asked to avoid";
  return "is not currently available or priced in this supermarket's catalogue";
}

/**
 * A must-have id that matches no catalogue product is a malformed selection
 * rather than a planning conflict: the client sent an id that never existed,
 * so there is nothing for the user to trade off.
 */
function assertMustHaveProductsExist(
  candidates: CandidateProduct[],
  mustHaveProductIds: string[],
  scope: ResolvedCatalogueScope,
): void {
  if (mustHaveProductIds.length === 0) return;

  // A map, not a scan per id: the catalogue is thousands of products and this
  // runs on every request.
  const known = new Set(candidates.map((candidate) => candidate.retailerProductId));
  const missing = mustHaveProductIds.filter((productId) => !known.has(productId));

  if (missing.length === 0) return;

  throw ApiError.mustHaveProductNotFound(
    `Some of the products you asked to include are not in the current ${scope.retailerName} catalogue.`,
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
 * An owned product must belong to the resolved catalogue too.
 *
 * Owning something the selected supermarket does not stock is not an error the
 * planner can absorb: the id would silently never match, the product would be
 * bought anyway, and the user would be charged for something they already have.
 */
function assertOwnedProductsExist(
  candidates: CandidateProduct[],
  ownedProductIds: string[],
  scope: ResolvedCatalogueScope,
): void {
  if (ownedProductIds.length === 0) return;

  const known = new Set(candidates.map((candidate) => candidate.retailerProductId));
  const missing = ownedProductIds.filter((productId) => !known.has(productId));

  if (missing.length === 0) return;

  throw ApiError.badRequest(
    `Some of the products you marked as already owned are not in the current ${scope.retailerName} catalogue.`,
    missing.map((productId) => ({
      field: "ownedProductIds",
      message: `${productId} is not a product in this catalogue.`,
    })),
    "INVALID_MEAL_PLAN_REQUEST",
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
  scope: ResolvedCatalogueScope,
  now: Date,
): string | null {
  const seenAt = newestSeenAt(candidates);
  if (!seenAt) return null;

  // The retailer's own freshness policy, not one global number: a catalogue
  // that changes daily and one that changes weekly go stale at different rates.
  const staleAfterMs = scope.staleAfterHours * 60 * 60 * 1000;
  if (now.getTime() - seenAt.getTime() <= staleAfterMs) return null;

  return `The ${scope.retailerName} catalogue was last refreshed on ${seenAt.toISOString().slice(0, 10)}. Prices and availability may have changed since.`;
}

/**
 * Where this plan's prices came from.
 *
 * Read from the catalogue snapshot the plan was actually built on, not from
 * the request: the request says what was asked for, and only the snapshot can
 * say what answered.
 */
function provenanceFor(
  scope: ResolvedCatalogueScope,
  candidates: CandidateProduct[],
): CatalogueProvenance {
  let newest: CandidateProduct | null = null;
  for (const candidate of candidates) {
    if (!newest || candidate.lastSeenAt > newest.lastSeenAt) newest = candidate;
  }

  return {
    retailerId: scope.retailerId,
    retailerSlug: scope.retailerSlug,
    retailerName: scope.retailerName,
    storeId: scope.storeId,
    storeSlug: scope.storeSlug,
    storeName: scope.storeName,
    crawlRunId: newest?.lastCrawlRunId ?? null,
    catalogueUpdatedAt: newest?.lastSeenAt.toISOString() ?? null,
  };
}

function buildResponse(
  priced: PricedPlan,
  request: MealPlanRequest,
  selection: SelectionResult,
  warnings: string[],
  dependencies: MealPlanDependencies,
  budgetTarget: BudgetTarget,
  mustHaveUsage: MustHaveUsage[],
  catalogue: CatalogueProvenance,
): MealPlanResponse {
  return {
    planId: dependencies.newPlanId(),
    generatedAt: dependencies.now().toISOString(),
    catalogue,
    currency: "GBP",
    budgetPence: request.budgetPence,
    estimatedTotalPence: priced.estimatedTotalPence,
    budgetStatus: priced.budgetStatus,
    assumptions: [
      ...priced.assumptions,
      `Recipes are scaled for a household of ${request.householdSize}.`,
      `Prices are the ${catalogue.retailerName} shelf prices recorded at the last catalogue crawl and exclude offers.`,
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
    cookingDays: request.cookingDays,
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
    // Resolved before anything is read. A scope cannot be produced for an
    // inactive retailer or for someone else's store, so every query below is
    // confined to one catalogue by construction.
    const scope = await dependencies.resolveScope(planRequest);
    const budgetTarget = resolveBudgetTarget(
      planRequest.budgetPence,
      planRequest.budgetTargetPercent,
    );

    const candidates = await dependencies.loadProducts(scope);
    assertMustHaveProductsExist(candidates, planRequest.mustHaveProductIds, scope);
    assertOwnedProductsExist(candidates, planRequest.ownedProductIds, scope);

    const selection = selectProducts(candidates, planRequest, {
      maxProducts: config.mealPlanEngine.maxProducts,
      mustHaveProductIds: planRequest.mustHaveProductIds,
    });

    assertUsableSelection(candidates, selection, planRequest, scope);
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
    const stale = staleCatalogueWarning(candidates, scope, dependencies.now());
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
      provenanceFor(scope, candidates),
    );

    const anonymousId = anonymousIdFrom(request);

    try {
      await dependencies.savePlan({
        plan: body,
        request: planRequest,
        scope,
        anonymousId,
      });
    } catch {
      // A plan the user cannot reopen is not a plan they were given. Better a
      // typed failure they can retry than a shopping list that vanishes.
      throw ApiError.plannerInternal(
        "The plan was built but could not be saved. Try generating it again.",
      );
    }

    addLogContext(response, {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
      generator: "engine",
      cookingDays: planRequest.cookingDays.length,
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
    // The same scope the plan was built under. A swap that silently moved
    // supermarket would reprice the whole basket against a different shop.
    const scope = await dependencies.resolveScope(planRequest);
    const budgetTarget = resolveBudgetTarget(
      planRequest.budgetPence,
      planRequest.budgetTargetPercent,
    );

    const candidates = await dependencies.loadProducts(scope);
    assertMustHaveProductsExist(candidates, planRequest.mustHaveProductIds, scope);
    assertOwnedProductsExist(candidates, planRequest.ownedProductIds, scope);

    const selection = selectProducts(candidates, planRequest, {
      maxProducts: config.mealPlanEngine.maxProducts,
      mustHaveProductIds: planRequest.mustHaveProductIds,
    });
    assertUsableSelection(candidates, selection, planRequest, scope);
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
      provenanceFor(scope, candidates),
    );

    try {
      await dependencies.savePlan({
        plan: body,
        request: planRequest,
        scope,
        anonymousId: anonymousIdFrom(httpRequest),
      });
    } catch {
      throw ApiError.plannerInternal(
        "The revised plan could not be saved. Your current plan is unchanged.",
      );
    }

    addLogContext(response, {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
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

/**
 * Reopens a saved plan.
 *
 * Serves the stored snapshot rather than re-planning: the catalogue moves, and
 * a shopping list that reprices itself between the kitchen and the shop is
 * worse than none.
 */
export function createGetMealPlanHandler(
  _config: AppConfig,
  dependencies: MealPlanDependencies,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const planId = request.params.planId;

    if (typeof planId !== "string" || !/^[a-f0-9]{32}$/.test(planId)) {
      throw ApiError.badRequest(
        "That is not a plan link we recognise.",
        [{ field: "planId", message: "The plan id is not valid." }],
        "INVALID_REQUEST",
      );
    }

    const plan = await dependencies.loadPlan(planId);

    // Unknown and expired are deliberately the same answer: distinguishing
    // them would confirm that a given id once existed.
    if (!plan) {
      throw ApiError.planNotFound(
        "That plan is no longer available. Plans are kept for a limited time.",
        { suggestions: ["Generate a fresh plan for this week."] },
      );
    }

    addLogContext(response, {
      retailer: plan.catalogue.retailerSlug,
      storeId: plan.catalogue.storeSlug,
      operation: "get-plan",
      outcome: "served",
    });

    response.json(plan);
  };
}
