/**
 * The deterministic planning engine.
 *
 * A bounded search, not an agent and not a loop that retries until something
 * scores well. It builds a fixed pool of candidate weeks, prices every one of
 * them through the authoritative validator, discards anything that fails a hard
 * gate, and returns the best of what survives. Same catalogue, request, seed and
 * engine version always give the same week.
 *
 * Hard constraints — allergies, appliances, catalogue membership, seven-day
 * coverage and the budget — decide what *may* be returned. Scores only order
 * what already passed.
 */

import { ApiError } from "../http/errors";
import { resolveBudgetTarget } from "./budgetTarget";
import { classifyFoodGroup, type FoodGroup } from "./productCategories";
import {
  comparePlanCandidates,
  scorePlan,
  type PlanFacts,
} from "./planScorer";
import { buildVariantsForMealType, type RecipeVariant } from "./recipeVariants";
import {
  PlanRejectedError,
  validateAndPricePlan,
  type PlanValidationContext,
  type PricedPlan,
} from "./mealPlanValidator";
import {
  type BudgetTarget,
  type GenerateEngineInput,
  type GeneratedPlan,
  type EngineResult,
  type MealPlanEngine,
  type ScoreBreakdown,
  type MealPlanRequest,
  type MealType,
  type ReplaceMealEngineInput,
  type SelectableProduct,
} from "./mealPlanTypes";

export const ENGINE_VERSION = "1.0.0";

/** Two or three recipes per meal type: enough variety, little waste. */
const RECIPES_PER_MEAL_TYPE = 3;

/** How many distinct recipe sets each surviving state may branch into. */
const BRANCHES_PER_STAGE = 6;

/**
 * Price bands the variant pool and the beam are spread across.
 *
 * Both were previously ordered cheapest-first and then cut, which meant every
 * survivor was cheap and no amount of scoring could raise the spend afterwards.
 * Banding costs nothing: the pool and the beam are the same size as before,
 * they simply are not all drawn from the bottom of the price range.
 */
const COST_BANDS = 3;

/** Projected-cost bands the beam retains states across. */
const BEAM_COST_BANDS = 4;

export type PlanValidator = (
  raw: unknown,
  context: PlanValidationContext,
) => PricedPlan;

export interface EngineOptions {
  beamWidth: number;
  candidateLimit: number;
  maxRecipeVariants: number;
  timeoutMs: number;
  /** Injected so tests can count invocations and simulate an engine bug. */
  validate?: PlanValidator;
  now?: () => number;
}

interface MealTypeChoice {
  mealType: MealType;
  variants: RecipeVariant[];
}

interface BeamState {
  choices: MealTypeChoice[];
  /** Weekly pack demand, already accounting for how often each recipe is cooked. */
  usage: Map<string, number>;
  partialScore: number;
  approxCostPence: number;
  /** Must-have products this partial week has not bought yet. */
  outstandingMustHaves: number;
  signature: string;
}

/**
 * How many times each recipe is cooked when `count` recipes are spread over the
 * week. Computed here rather than after scheduling so a state's basket cost is
 * known before it is expanded.
 */
function cookCounts(count: number, days: number): number[] {
  const base = Math.floor(days / count);
  const remainder = days % count;

  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

/**
 * Rotates through the chosen recipes so the same dish never lands on
 * consecutive days. With two or more alternatives `(day + offset) % count`
 * cannot repeat; with only one there is nothing to alternate with.
 */
function recipeForDay(variants: RecipeVariant[], day: number, offset: number): RecipeVariant {
  return variants[(day - 1 + offset) % variants.length];
}

/**
 * The ingredient a dish is built around — the first slot the template declares.
 * Two recipes sharing it are the same meal wearing a different hat, however
 * different their titles look.
 */
function primaryProductId(variant: RecipeVariant): string {
  return variant.filledSlots[0]?.product.productId ?? "";
}

function costOf(variant: RecipeVariant): number {
  return variant.filledSlots.reduce(
    (total, slot) => total + slot.product.pricePence * slot.packages,
    0,
  );
}

function matchesPreference(variant: RecipeVariant, request: MealPlanRequest): boolean {
  return variant.preferenceTags.some((tag) => request.mealPreferences.includes(tag));
}

function matchesCuisine(variant: RecipeVariant, request: MealPlanRequest): boolean {
  const wanted = request.cuisinePreferences.map((entry) => entry.toLowerCase());
  return variant.cuisineTags.some((tag) => wanted.includes(tag.toLowerCase()));
}

/**
 * Ranks the variants of one meal type before the beam ever sees them. Ordering
 * is total: equally good recipes are separated by signature so the pool a state
 * branches into never depends on input order.
 */
function rankVariants(
  variants: RecipeVariant[],
  request: MealPlanRequest,
): RecipeVariant[] {
  return [...variants].sort((a, b) => {
    const preference =
      Number(matchesPreference(b, request)) - Number(matchesPreference(a, request));
    if (preference !== 0) return preference;

    const cuisine = Number(matchesCuisine(b, request)) - Number(matchesCuisine(a, request));
    if (cuisine !== 0) return cuisine;

    return (
      costOf(a) - costOf(b) ||
      a.totalMinutes - b.totalMinutes ||
      a.signature.localeCompare(b.signature)
    );
  });
}

/**
 * The shortlist one meal type branches from, drawn evenly across the cost
 * range rather than off the cheap end of it.
 *
 * The pool is the same size it always was. Taking its members from three cost
 * bands is what lets a generous budget target actually reach a richer week:
 * with a cheapest-first shortlist there is no dearer candidate left to pick,
 * whatever the score says.
 */
function variantPool(ranked: RecipeVariant[], poolSize: number): RecipeVariant[] {
  if (ranked.length <= poolSize) return ranked;

  const byCost = [...ranked].sort(
    (a, b) => costOf(a) - costOf(b) || a.signature.localeCompare(b.signature),
  );
  const bandSize = Math.ceil(byCost.length / COST_BANDS);
  const perBand = Math.ceil(poolSize / COST_BANDS);
  const picked = new Set<string>();

  for (let band = 0; band < COST_BANDS; band += 1) {
    const inBand = new Set(
      byCost
        .slice(band * bandSize, (band + 1) * bandSize)
        .map((variant) => variant.signature),
    );

    // Ranking still decides which members of a band are worth having.
    let taken = 0;
    for (const variant of ranked) {
      if (taken >= perBand || picked.size >= poolSize) break;
      if (!inBand.has(variant.signature) || picked.has(variant.signature)) continue;

      picked.add(variant.signature);
      taken += 1;
    }
  }

  return ranked.filter((variant) => picked.has(variant.signature));
}

/**
 * The smallest set of variants that buys every must-have product assigned to
 * this meal type, or null when no such set exists.
 *
 * Built before the branching pool is consulted, so must-have coverage is a
 * property of how the sets are *constructed* rather than something the search
 * is left to stumble on. One variant may satisfy several must-haves at once.
 */
function coveringCore(
  ranked: RecipeVariant[],
  required: string[],
  size: number,
): RecipeVariant[] | null {
  if (required.length === 0) return [];

  const core: RecipeVariant[] = [];
  const titles = new Set<string>();
  const primaries = new Set<string>();
  const covered = new Set<string>();

  for (const productId of required) {
    if (covered.has(productId)) continue;
    if (core.length >= size) return null;

    const variant = ranked.find(
      (candidate) =>
        candidate.productIds.includes(productId) &&
        !titles.has(candidate.recipe.title) &&
        !primaries.has(primaryProductId(candidate)),
    );
    if (!variant) return null;

    core.push(variant);
    titles.add(variant.recipe.title);
    primaries.add(primaryProductId(variant));
    for (const id of variant.productIds) covered.add(id);
  }

  return core;
}

/**
 * The recipe sets one meal type may contribute. Combinations are drawn from a
 * shortlist of the best variants and capped, which is what keeps the search
 * bounded as the catalogue grows.
 *
 * Every set begins with the variants that buy this meal type's must-have
 * products, so no branch can lose them.
 */
function recipeSetsFor(
  ranked: RecipeVariant[],
  seed: number,
  limit: number,
  required: string[] = [],
): RecipeVariant[][] {
  const size = Math.min(RECIPES_PER_MEAL_TYPE, ranked.length);
  const core = coveringCore(ranked, required, size);
  if (core === null) return [];

  const pool = variantPool(ranked, Math.min(ranked.length, size + BRANCHES_PER_STAGE));
  const sets: RecipeVariant[][] = [];
  const seenSets = new Set<string>();

  // Sliding windows over the shortlist: deterministic, cheap, and it keeps the
  // strongest variants in play rather than exploring every combination.
  for (let start = 0; start < pool.length && sets.length < limit; start += 1) {
    const window = [...core];

    // Two variants of one template can differ only in an optional ingredient
    // and still render the same title, which reads as the planner serving the
    // identical meal twice. Distinct titles and distinct primary ingredients
    // are what make a week look varied to the person eating it.
    const signatures = new Set(window.map((variant) => variant.signature));
    const titles = new Set(window.map((variant) => variant.recipe.title));
    const primaries = new Set(window.map(primaryProductId));

    for (let step = 0; step < pool.length && window.length < size; step += 1) {
      const variant = pool[(start + step) % pool.length];

      if (signatures.has(variant.signature)) continue;
      if (titles.has(variant.recipe.title)) continue;
      if (primaries.has(primaryProductId(variant))) continue;

      window.push(variant);
      signatures.add(variant.signature);
      titles.add(variant.recipe.title);
      primaries.add(primaryProductId(variant));
    }

    if (window.length !== size) continue;

    const key = [...signatures].sort().join("+");
    if (seenSets.has(key)) continue;

    seenSets.add(key);
    sets.push(window);
  }

  if (sets.length === 0) {
    // Nothing in the pool was distinct enough to complete a set. A shorter week
    // built around the must-have core is still a valid week.
    const fallback = [...core];
    const chosen = new Set(fallback.map((variant) => variant.signature));

    for (const variant of ranked) {
      if (fallback.length >= size) break;
      if (chosen.has(variant.signature)) continue;

      fallback.push(variant);
      chosen.add(variant.signature);
    }

    if (fallback.length === 0) return [];
    sets.push(fallback);
  }

  // The seed rotates which set is tried first, so regeneration explores a
  // different corner of the same bounded pool.
  const offset = ((seed % sets.length) + sets.length) % sets.length;
  return [...sets.slice(offset), ...sets.slice(0, offset)];
}

/**
 * Decides which meal type is responsible for buying each must-have product.
 *
 * Spread rather than piled: a week that pushes every chosen product into
 * dinner is not the week the user asked for. A product no variant of any
 * requested meal type can use is reported, never quietly dropped into an
 * unrelated recipe slot.
 */
export function assignMustHaves(
  productIds: string[],
  stages: MealTypeChoice[],
): { assigned: Map<MealType, string[]>; unusable: string[] } {
  const assigned = new Map<MealType, string[]>();
  const unusable: string[] = [];

  for (const productId of productIds) {
    const usable = stages.filter((stage) =>
      stage.variants.some((variant) => variant.productIds.includes(productId)),
    );

    if (usable.length === 0) {
      unusable.push(productId);
      continue;
    }

    const target = usable.reduce((best, stage) =>
      (assigned.get(stage.mealType)?.length ?? 0) <
      (assigned.get(best.mealType)?.length ?? 0)
        ? stage
        : best,
    );

    assigned.set(target.mealType, [
      ...(assigned.get(target.mealType) ?? []),
      productId,
    ]);
  }

  return { assigned, unusable };
}

function addUsage(
  usage: Map<string, number>,
  variants: RecipeVariant[],
  cookingDays: number,
): Map<string, number> {
  const next = new Map(usage);
  const counts = cookCounts(variants.length, cookingDays);

  variants.forEach((variant, index) => {
    for (const slot of variant.filledSlots) {
      next.set(
        slot.product.productId,
        (next.get(slot.product.productId) ?? 0) + slot.packages * counts[index],
      );
    }
  });

  return next;
}

/**
 * Trims the beam while keeping states from every projected-cost band.
 *
 * Sorting on cost and cutting is what made every surviving branch cheap: the
 * dearer half of the search was pruned before its score was ever measured.
 * Bands are filled round-robin, so any prefix of the beam — including the slice
 * the candidate limit takes — spans the whole cost range.
 */
function trimBeam(
  states: BeamState[],
  beamWidth: number,
  hardMaximumPence: number,
): BeamState[] {
  const ordered = [...states].sort(
    (a, b) =>
      a.outstandingMustHaves - b.outstandingMustHaves ||
      b.partialScore - a.partialScore ||
      a.approxCostPence - b.approxCostPence ||
      a.usage.size - b.usage.size ||
      a.signature.localeCompare(b.signature),
  );

  // Pack demand only grows as stages are added, so a partial week already over
  // the maximum can never come back under it.
  const affordable = ordered.filter(
    (state) => state.approxCostPence <= hardMaximumPence,
  );
  // Never empty the beam: an unaffordable pool still has to reach `assess`,
  // which is what turns it into an actionable NO_AFFORDABLE_PLAN.
  const pool = affordable.length > 0 ? affordable : ordered;

  const bandWidth = Math.max(1, hardMaximumPence / BEAM_COST_BANDS);
  const bands: BeamState[][] = Array.from({ length: BEAM_COST_BANDS }, () => []);

  for (const state of pool) {
    const index = Math.min(
      BEAM_COST_BANDS - 1,
      Math.floor(state.approxCostPence / bandWidth),
    );
    bands[Math.max(0, index)].push(state);
  }

  const kept: BeamState[] = [];
  const cursors = bands.map(() => 0);

  while (kept.length < beamWidth) {
    let added = false;

    for (let band = 0; band < bands.length && kept.length < beamWidth; band += 1) {
      const cursor = cursors[band];
      if (cursor >= bands[band].length) continue;

      kept.push(bands[band][cursor]);
      cursors[band] = cursor + 1;
      added = true;
    }

    if (!added) break;
  }

  return kept;
}

/** Whole packs the basket must buy for the accumulated usage. */
function basketPence(
  usage: Map<string, number>,
  products: Map<string, SelectableProduct>,
): number {
  let total = 0;

  for (const [productId, packages] of usage) {
    const product = products.get(productId);
    if (!product) continue;

    total += product.pricePence * Math.max(1, Math.ceil(Number(packages.toFixed(4))));
  }

  return total;
}

/**
 * The part of the score that does not depend on the finished basket. Budget fit
 * and waste can only be judged once every meal type has contributed, so the
 * beam ranks on what it can already measure and leaves the rest to final
 * scoring.
 */
function partialScoreOf(choices: MealTypeChoice[], request: MealPlanRequest): number {
  const variants = choices.flatMap((choice) => choice.variants);
  if (variants.length === 0) return 0;

  const preference = variants.filter((variant) => matchesPreference(variant, request)).length;
  const cuisine = variants.filter((variant) => matchesCuisine(variant, request)).length;
  const averageMinutes =
    variants.reduce((total, variant) => total + variant.totalMinutes, 0) / variants.length;

  const preferenceShare = request.mealPreferences.length === 0 ? 1 : preference / variants.length;
  const cuisineShare = request.cuisinePreferences.length === 0 ? 1 : cuisine / variants.length;
  const varietyShare =
    choices.reduce(
      (total, choice) =>
        total + Math.min(choice.variants.length, RECIPES_PER_MEAL_TYPE) / RECIPES_PER_MEAL_TYPE,
      0,
    ) / choices.length;
  const timeShare = Math.max(0, 1 - Math.max(0, averageMinutes - 10) / 60);

  // Without this the beam collapses onto whichever cheap product fits the most
  // slots — a week of one cheese, technically valid and genuinely miserable.
  // Cost pressure still applies, but only between equally varied weeks.
  const distinctPrimaries = new Set(variants.map(primaryProductId)).size;
  const primaryShare = distinctPrimaries / variants.length;

  return (
    preferenceShare * 15 +
    cuisineShare * 10 +
    varietyShare * 15 +
    timeShare * 10 +
    primaryShare * 25
  );
}

function stateSignature(choices: MealTypeChoice[]): string {
  return choices
    .map(
      (choice) =>
        `${choice.mealType}:${choice.variants.map((variant) => variant.signature).sort().join("+")}`,
    )
    .join("|");
}

/**
 * Turns a completed state into the untrusted plan shape the validator reads.
 *
 * Days come from the request rather than from a fixed week. A household that
 * cooks on Monday, Wednesday and Saturday gets three days numbered 1, 3 and 6
 * — not a seven-day plan with four blanks in it, which would then have to be
 * priced and explained away everywhere downstream.
 */
function toPlan(state: BeamState, seed: number, cookingDays: number[]): GeneratedPlan {
  const days = cookingDays.map((day, index) => {
    // Rotation is driven by position in the selected list, not by the calendar
    // date, so three cooking days alternate across three recipes rather than
    // landing on whatever the weekday number happens to be modulo the count.
    const slot = index + 1;

    return {
      day,
      meals: state.choices.map((choice) => ({
        mealType: choice.mealType,
        recipeId: recipeForDay(
          choice.variants,
          slot,
          seed % Math.max(1, choice.variants.length),
        ).recipe.id,
      })),
    };
  });

  const referenced = new Set(days.flatMap((day) => day.meals.map((meal) => meal.recipeId)));
  const recipes = state.choices
    .flatMap((choice) => choice.variants)
    .filter((variant) => referenced.has(variant.recipe.id))
    .map((variant) => variant.recipe);

  // A recipe served twice must still appear once, or the validator rejects the
  // plan for a duplicate id.
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  return { days, recipes: [...byId.values()] };
}

function factsFor(
  priced: PricedPlan,
  variantsById: Map<string, RecipeVariant>,
  request: MealPlanRequest,
  products: Map<string, SelectableProduct>,
  budgetTarget: BudgetTarget,
): PlanFacts {
  const timesCooked = new Map<string, number>();
  for (const day of priced.days) {
    for (const meal of day.meals) {
      timesCooked.set(meal.recipeId, (timesCooked.get(meal.recipeId) ?? 0) + 1);
    }
  }

  const packagesUsed = priced.recipes.reduce(
    (total, recipe) =>
      total +
      recipe.ingredients.reduce((sum, item) => sum + item.packages, 0) *
        (timesCooked.get(recipe.id) ?? 0),
    0,
  );

  const packagesBought = priced.shoppingList.reduce(
    (total, group) =>
      total + group.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  // Catalogue value of what the week eats, as opposed to what it buys. The
  // difference is waste, and the scorer must never mistake waste for spending
  // the budget well.
  const consumedPence = priced.recipes.reduce(
    (total, recipe) =>
      total +
      recipe.ingredients.reduce((sum, item) => sum + item.estimatedCostPence, 0) *
        (timesCooked.get(recipe.id) ?? 0),
    0,
  );

  const distinctByMealType = request.mealsPerDay.map(
    (mealType) => priced.recipes.filter((recipe) => recipe.mealType === mealType).length,
  );

  const groups = new Set<FoodGroup>();
  for (const group of priced.shoppingList) {
    for (const item of group.items) {
      const product = products.get(item.productId);
      if (product) groups.add(classifyFoodGroup(product.categoryPaths));
    }
  }

  const variants = priced.recipes
    .map((recipe) => variantsById.get(recipe.id))
    .filter((variant): variant is RecipeVariant => variant !== undefined);

  return {
    totalPence: priced.estimatedTotalPence,
    consumedPence,
    budgetTarget,
    packagesUsed,
    packagesBought,
    distinctRecipesByMealType: distinctByMealType,
    distinctRecipeCount: priced.recipes.length,
    recipesMatchingPreference: variants.filter((variant) =>
      matchesPreference(variant, request),
    ).length,
    recipesMatchingCuisine: variants.filter((variant) => matchesCuisine(variant, request))
      .length,
    hasPreferenceRequest: request.mealPreferences.length > 0,
    hasCuisineRequest: request.cuisinePreferences.length > 0,
    averageMinutes:
      priced.recipes.reduce(
        (total, recipe) => total + recipe.prepMinutes + recipe.cookMinutes,
        0,
      ) / Math.max(1, priced.recipes.length),
    foodGroupsCovered: groups.size,
    uniqueProductCount: priced.productsUsed,
  };
}

/** Every product a priced plan's recipes actually put in the basket. */
function productsBoughtBy(priced: PricedPlan): Set<string> {
  return new Set(
    priced.shoppingList.flatMap((group) => group.items.map((item) => item.productId)),
  );
}

/**
 * The engine invariant: a plan is only a candidate if it buys, and cooks with,
 * every product the user committed to. Checked against the priced plan rather
 * than the raw one, so the shopping list is what proves it.
 */
function buysEveryMustHave(priced: PricedPlan, mustHaveIds: string[]): boolean {
  if (mustHaveIds.length === 0) return true;

  const bought = productsBoughtBy(priced);
  const cooked = new Set(priced.recipes.flatMap((recipe) => recipe.productIds));

  return mustHaveIds.every(
    (productId) => bought.has(productId) && cooked.has(productId),
  );
}

/** The same check over an unpriced candidate, to spend the candidate limit well. */
function referencesEveryMustHave(
  plan: GeneratedPlan,
  mustHaveIds: string[],
): boolean {
  if (mustHaveIds.length === 0) return true;

  const referencedRecipeIds = new Set(
    plan.days.flatMap((day) => day.meals.map((meal) => meal.recipeId)),
  );
  const used = new Set(
    plan.recipes
      .filter((recipe) => referencedRecipeIds.has(recipe.id))
      .flatMap((recipe) => recipe.ingredients.map((item) => item.productId)),
  );

  return mustHaveIds.every((productId) => used.has(productId));
}

interface ScoredCandidate {
  plan: GeneratedPlan;
  priced: PricedPlan;
  /** Rounded, reported in diagnostics. */
  score: number;
  /** Unrounded, used to order candidates. */
  exactScore: number;
  breakdown: ScoreBreakdown;
  signature: string;
}

export function createMealPlanEngine(options: EngineOptions): MealPlanEngine {
  const validate = options.validate ?? validateAndPricePlan;
  const now = options.now ?? (() => Date.now());

  /**
   * Validates and prices a pool of candidate plans, splitting them into what a
   * user may be shown and what merely proves the week is unaffordable.
   */
  function assess(
    plans: GeneratedPlan[],
    variantsById: Map<string, RecipeVariant>,
    request: MealPlanRequest,
    products: Map<string, SelectableProduct>,
    budgetTarget: BudgetTarget,
  ): {
    affordable: ScoredCandidate[];
    cheapestOverBudget: number | null;
    validCount: number;
    missingMustHaveCount: number;
  } {
    const context: PlanValidationContext = { request, products };
    const affordable: ScoredCandidate[] = [];
    let cheapestOverBudget: number | null = null;
    let validCount = 0;
    let missingMustHaveCount = 0;

    for (const plan of plans) {
      let priced: PricedPlan;

      try {
        priced = validate(plan, context);
      } catch (error) {
        // The engine built this plan, so a rejection is an engine defect. It is
        // counted and swallowed here; if nothing survives, the caller reports
        // an internal error rather than blaming the user's constraints.
        if (error instanceof PlanRejectedError || error instanceof ApiError) continue;
        throw error;
      }

      validCount += 1;

      // Must-have products are a hard gate, not a preference: a week that does
      // not buy one is not a cheaper week, it is the wrong week.
      if (!buysEveryMustHave(priced, request.mustHaveProductIds)) {
        missingMustHaveCount += 1;
        continue;
      }

      if (priced.budgetStatus === "over-budget") {
        cheapestOverBudget =
          cheapestOverBudget === null
            ? priced.estimatedTotalPence
            : Math.min(cheapestOverBudget, priced.estimatedTotalPence);
        continue;
      }

      const { total, exact, breakdown } = scorePlan(
        factsFor(priced, variantsById, request, products, budgetTarget),
      );

      affordable.push({
        plan,
        priced,
        score: total,
        exactScore: exact,
        breakdown,
        signature: priced.recipes
          .map((recipe) => recipe.id)
          .sort()
          .join(","),
      });
    }

    const ordering = (candidate: ScoredCandidate) => ({
      score: candidate.exactScore,
      targetDistancePence: Math.abs(
        candidate.priced.estimatedTotalPence - budgetTarget.targetPence,
      ),
      totalPence: candidate.priced.estimatedTotalPence,
      uniqueProductCount: candidate.priced.productsUsed,
      signature: candidate.signature,
    });

    affordable.sort((a, b) => comparePlanCandidates(ordering(a), ordering(b)));

    return { affordable, cheapestOverBudget, validCount, missingMustHaveCount };
  }

  async function generate(input: GenerateEngineInput): Promise<EngineResult> {
    const started = now();
    const deadlineAt = started + options.timeoutMs;
    const { request, products, variationSeed } = input;
    const productsById = new Map(products.map((product) => [product.productId, product]));
    const budgetTarget = resolveBudgetTarget(
      request.budgetPence,
      request.budgetTargetPercent,
    );
    const mustHaveIds = request.mustHaveProductIds;

    const variantsById = new Map<string, RecipeVariant>();
    const byMealType: MealTypeChoice[] = [];
    let recipesConsidered = 0;

    for (const mealType of request.mealsPerDay) {
      const variants = buildVariantsForMealType({
        mealType,
        products,
        request,
        seed: variationSeed,
        maxVariants: options.maxRecipeVariants,
        mustHaveProductIds: mustHaveIds,
      });

      if (variants.length === 0) {
        throw ApiError.conflict(
          `No ${mealType} recipe can be built from the Aldi products these constraints allow.`,
          {
            mealType,
            causes: [
              `No product in the selection can fill a required ingredient of any ${mealType} recipe.`,
            ],
            suggestions: [
              "Remove a disliked ingredient or an allergy filter.",
              "Add a cooking appliance, such as a hob or an oven.",
              `Remove ${mealType} from the meals you want each day.`,
              "Re-run the Aldi crawl to widen the catalogue.",
            ],
          },
        );
      }

      recipesConsidered += variants.length;
      for (const variant of variants) variantsById.set(variant.recipe.id, variant);
      byMealType.push({ mealType, variants: rankVariants(variants, request) });
    }

    const { assigned, unusable } = assignMustHaves(mustHaveIds, byMealType);

    if (unusable.length > 0) {
      throw ApiError.mustHaveProductUnusable(
        "Some of the products you asked to include cannot be used by any recipe for the meals you selected.",
        {
          productIds: unusable,
          suggestions: [
            "Add another meal type, so more recipes become available.",
            "Add a cooking appliance, such as a hob or an oven.",
            "Remove the product from your must-have list and pick a similar one.",
          ],
        },
      );
    }

    // Beam search, one meal type per stage. The beam is re-sorted and trimmed
    // after every stage, so the work per stage is bounded by the beam width
    // however large the catalogue is.
    let beam: BeamState[] = [
      {
        choices: [],
        usage: new Map(),
        partialScore: 0,
        approxCostPence: 0,
        outstandingMustHaves: mustHaveIds.length,
        signature: "",
      },
    ];

    for (const stage of byMealType) {
      const next: BeamState[] = [];
      const sets = recipeSetsFor(
        stage.variants,
        variationSeed,
        BRANCHES_PER_STAGE,
        assigned.get(stage.mealType) ?? [],
      );

      if (sets.length === 0) {
        throw ApiError.mustHaveConstraintConflict(
          `The products you asked to include cannot all be fitted into the ${stage.mealType} recipes these constraints allow.`,
          {
            mealType: stage.mealType,
            productIds: assigned.get(stage.mealType) ?? [],
            suggestions: [
              "Choose fewer must-have products.",
              "Add another meal type, so the products can be spread across the week.",
              "Remove a disliked ingredient or an allergy filter.",
            ],
          },
        );
      }

      for (const state of beam) {
        for (const variants of sets) {
          const choices = [...state.choices, { mealType: stage.mealType, variants }];
          const usage = addUsage(state.usage, variants, request.cookingDays.length);

          next.push({
            choices,
            usage,
            partialScore: partialScoreOf(choices, request),
            approxCostPence: basketPence(usage, productsById),
            outstandingMustHaves: mustHaveIds.filter((id) => !usage.has(id)).length,
            signature: stateSignature(choices),
          });
        }
      }

      beam = trimBeam(next, options.beamWidth, budgetTarget.hardMaximumPence);

      // Checked between stages, never mid-expansion, so a state is always left
      // whole and the deadline cannot corrupt the search.
      if (now() >= deadlineAt) {
        throw ApiError.plannerCapacity(
          "The planner ran out of time before it finished building a week. Try again.",
        );
      }
    }

    const plans = beam
      .slice(0, options.candidateLimit)
      .map((state) => toPlan(state, variationSeed, request.cookingDays));
    const { affordable, cheapestOverBudget, validCount, missingMustHaveCount } = assess(
      plans,
      variantsById,
      request,
      productsById,
      budgetTarget,
    );

    if (affordable.length === 0) {
      if (cheapestOverBudget !== null) {
        throw ApiError.noAffordablePlan(
          "The cheapest week we could build for these constraints costs more than the budget.",
          {
            budgetPence: request.budgetPence,
            minimumEstimatedPence: cheapestOverBudget,
            suggestions: [
              `Increase the budget to at least £${(cheapestOverBudget / 100).toFixed(2)}.`,
              "Reduce the number of meal types per day.",
              "Reduce the household size if it was entered too high.",
            ],
          },
        );
      }

      if (missingMustHaveCount > 0) {
        throw ApiError.mustHaveConstraintConflict(
          "No week that uses every product you asked to include also fits your other constraints.",
          {
            productIds: mustHaveIds,
            suggestions: [
              "Choose fewer must-have products.",
              "Add another meal type, so the products can be spread across the week.",
              "Increase the budget a little.",
            ],
          },
        );
      }

      throw ApiError.plannerInternal(
        "The planner could not complete a valid week for this request.",
      );
    }

    const winner = affordable[0];

    return {
      plan: winner.plan,
      diagnostics: {
        engineVersion: ENGINE_VERSION,
        durationMs: now() - started,
        recipesConsidered,
        candidatesGenerated: plans.length,
        candidatesValid: validCount,
        selectedScore: winner.score,
        scoreBreakdown: winner.breakdown,
      },
    };
  }

  async function replaceMeal(input: ReplaceMealEngineInput): Promise<EngineResult> {
    const started = now();
    const { request, currentPlan, products, variationSeed, day, mealType } = input;
    const productsById = new Map(products.map((product) => [product.productId, product]));
    const budgetTarget = resolveBudgetTarget(
      request.budgetPence,
      request.budgetTargetPercent,
    );
    const mustHaveIds = request.mustHaveProductIds;

    const targetDay = currentPlan.days.find((entry) => entry.day === day);
    const target = targetDay?.meals.find((meal) => meal.mealType === mealType);

    if (!target) {
      throw ApiError.badRequest(
        `Day ${day} does not contain a ${mealType} to replace.`,
        [{ field: "mealType", message: "Choose a meal that exists in the current plan." }],
        "INVALID_MEAL_PLAN_REQUEST",
      );
    }

    const variants = buildVariantsForMealType({
      mealType,
      products,
      request,
      seed: variationSeed,
      maxVariants: options.maxRecipeVariants,
      mustHaveProductIds: mustHaveIds,
    });

    // The meal being replaced, and anything already on the plan, cannot be the
    // answer: the user asked for something different.
    const inUse = new Set(
      currentPlan.days
        .flatMap((entry) => entry.meals)
        .filter((meal) => meal.mealType === mealType)
        .map((meal) => meal.recipeId),
    );
    const alternatives = rankVariants(variants, request).filter(
      (variant) => !inUse.has(variant.recipe.id),
    );

    // Replacing a meal must not quietly un-buy a product the user insisted on.
    // Candidates that would are dropped here rather than after pricing, so the
    // candidate limit is spent on replacements that could actually be returned.
    const preserving = alternatives
      .map((variant) => ({
        variant,
        plan: substitute(currentPlan, day, mealType, variant),
      }))
      .filter((candidate) => referencesEveryMustHave(candidate.plan, mustHaveIds))
      .slice(0, options.candidateLimit);

    const variantsById = new Map(
      preserving.map(({ variant }) => [variant.recipe.id, variant]),
    );
    const plans = preserving.map(({ plan }) => plan);

    const { affordable, validCount } = assess(
      plans,
      variantsById,
      request,
      productsById,
      budgetTarget,
    );

    if (affordable.length === 0) {
      throw ApiError.noReplacementAvailable(
        "No different meal fits this day within your constraints and budget.",
        {
          day,
          mealType,
          suggestions: [
            "Increase the budget a little.",
            "Add a cooking appliance so more recipes become possible.",
            "Remove a disliked ingredient or an allergy filter.",
            ...(mustHaveIds.length > 0
              ? ["Remove a must-have product, so this meal has more alternatives."]
              : []),
          ],
        },
      );
    }

    const winner = affordable[0];

    return {
      plan: winner.plan,
      diagnostics: {
        engineVersion: ENGINE_VERSION,
        durationMs: now() - started,
        recipesConsidered: variants.length,
        candidatesGenerated: plans.length,
        candidatesValid: validCount,
        selectedScore: winner.score,
        scoreBreakdown: winner.breakdown,
      },
    };
  }

  return { generate, replaceMeal };
}

/** Swaps one meal, leaving every other day byte-identical. */
function substitute(
  plan: GeneratedPlan,
  day: number,
  mealType: MealType,
  variant: RecipeVariant,
): GeneratedPlan {
  const days = plan.days.map((entry) => ({
    day: entry.day,
    meals: entry.meals.map((meal) =>
      entry.day === day && meal.mealType === mealType
        ? { mealType: meal.mealType, recipeId: variant.recipe.id }
        : { mealType: meal.mealType, recipeId: meal.recipeId },
    ),
  }));

  const referenced = new Set(days.flatMap((entry) => entry.meals.map((meal) => meal.recipeId)));
  const recipes = [
    ...plan.recipes.filter((recipe) => referenced.has(recipe.id) && recipe.id !== variant.recipe.id),
    variant.recipe,
  ];

  return { days, recipes };
}
