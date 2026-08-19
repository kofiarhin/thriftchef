/**
 * Soft scoring. Every plan reaching this module has already passed the hard
 * gates — validation, allergies, appliances, catalogue pricing and the budget —
 * so nothing here can admit a plan that should have been rejected. Scores only
 * decide which of several acceptable weeks is returned.
 *
 * The score is an internal diagnostic. It is never shown to a user, because a
 * "72/100 meal plan" invites a nutritional reading these components cannot
 * support: `foodGroupBalance` measures breadth of shopping, not health.
 */

import { isWithinPreferredRange } from "./budgetTarget";
import type { BudgetTarget, ScoreBreakdown } from "./mealPlanTypes";

export const SCORE_WEIGHTS = {
  // Budget fit outweighs reuse. Reuse at parity is what let a thrifty,
  // narrow basket beat every richer week: the cheapest plan wastes least
  // almost by definition, so an equal weight made "spend nothing" the
  // reliable winner however generous the target.
  budgetFit: 25,
  ingredientReuse: 15,
  recipeVariety: 15,
  preferenceMatch: 15,
  cuisineMatch: 10,
  practicality: 10,
  foodGroupBalance: 10,
} as const satisfies Record<keyof ScoreBreakdown, number>;

/**
 * Everything the scorer needs, already measured. Keeping the scorer pure over a
 * plain record makes each component testable at its boundaries without building
 * a whole priced plan.
 */
export interface PlanFacts {
  /** What the basket costs. Measured against the hard maximum. */
  totalPence: number;
  /**
   * Catalogue value of the packs the week actually consumes. Never above
   * `totalPence`, because packs are bought whole.
   *
   * Budget fit is judged on this rather than on the basket, which is what
   * makes "buy something and leave it in the cupboard" incapable of improving
   * a score: unused stock raises `totalPence` alone.
   */
  consumedPence: number;
  budgetTarget: BudgetTarget;
  /** Packs the recipes consume across the week. */
  packagesUsed: number;
  /** Whole packs the shopping list actually buys. */
  packagesBought: number;
  distinctRecipesByMealType: number[];
  distinctRecipeCount: number;
  recipesMatchingPreference: number;
  recipesMatchingCuisine: number;
  hasPreferenceRequest: boolean;
  hasCuisineRequest: boolean;
  averageMinutes: number;
  foodGroupsCovered: number;
  uniqueProductCount: number;
}

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, value));
}

/**
 * Shortfall is squared; overshoot is linear. Underspending is the failure mode
 * users actually hit — a £90 budget answered with a £20 basket — while
 * overshooting the target is harmless as long as the hard maximum holds,
 * because the maximum is the real promise.
 *
 * A curve rather than a clamped penalty on purpose: when a thin catalogue puts
 * every candidate far below the target, a clamped penalty scores them all zero
 * and the component stops discriminating exactly when it is needed most. This
 * one only reaches zero at an empty basket, so the richest affordable week is
 * still preferred over the poorest.
 */
const UNDERSPEND_EXPONENT = 2;

/**
 * Share of the component earned by landing inside the preferred band at all,
 * as opposed to merely being near the target. The band is the thing the user
 * chose, so it is worth naming in the score rather than leaving implicit in a
 * distance curve.
 */
const BAND_SHARE = 0.25;

/**
 * Distance from the chosen target, not cheapness.
 *
 * The budget is a maximum and the target is an aim inside it. A plan over the
 * maximum is not scored down, it is rejected before it reaches here; a plan far
 * under the target is scored down, because a week that leaves two thirds of the
 * budget unspent is a week that could have fed the household better.
 *
 * Only spend the week consumes counts. Buying a pack no recipe opens raises the
 * basket without raising this component, so padding the basket toward the
 * target can never pay.
 */
function budgetFit(facts: PlanFacts): number {
  const target = facts.budgetTarget;
  if (target.hardMaximumPence <= 0 || target.targetPence <= 0) return 0;

  // Belt and braces: the validator already rejects this plan.
  if (facts.totalPence > target.hardMaximumPence) return 0;

  const effectivePence = Math.min(facts.consumedPence, facts.totalPence);

  // Both directions are measured against the target itself, so a pound either
  // side is comparable and the shape alone decides which hurts more.
  // Normalising overshoot against the remaining headroom instead would make a
  // pound over cost more than a pound under whenever the target sits near the
  // maximum — the opposite of what a soft target means.
  const ratio = effectivePence / target.targetPence;
  const proximity =
    ratio <= 1 ? clamp(ratio, 1) ** UNDERSPEND_EXPONENT : clamp(2 - ratio, 1);

  const band = isWithinPreferredRange(target, effectivePence) ? 1 : 0;

  return clamp(
    SCORE_WEIGHTS.budgetFit * ((1 - BAND_SHARE) * proximity + BAND_SHARE * band),
    SCORE_WEIGHTS.budgetFit,
  );
}

/**
 * How much of the shopping the week actually eats. Packs are bought whole, so
 * a plan that reuses an open bag of rice wastes less than one that buys a
 * second bag for a single meal.
 */
function ingredientReuse(facts: PlanFacts): number {
  if (facts.packagesBought <= 0) return 0;

  const consumed = facts.packagesUsed / facts.packagesBought;

  return clamp(SCORE_WEIGHTS.ingredientReuse * consumed, SCORE_WEIGHTS.ingredientReuse);
}

/**
 * Two or three distinct recipes per meal type is the target. Beyond three there
 * is no further credit: more one-off recipes means more one-off products, which
 * the reuse component is trying to avoid.
 */
const USEFUL_RECIPES_PER_MEAL_TYPE = 3;

function recipeVariety(facts: PlanFacts): number {
  const perType = facts.distinctRecipesByMealType;
  if (perType.length === 0) return 0;

  const average =
    perType.reduce(
      (total, distinct) =>
        total + Math.min(distinct, USEFUL_RECIPES_PER_MEAL_TYPE) / USEFUL_RECIPES_PER_MEAL_TYPE,
      0,
    ) / perType.length;

  return clamp(SCORE_WEIGHTS.recipeVariety * average, SCORE_WEIGHTS.recipeVariety);
}

/** A request that stated nothing cannot be missed, so it scores full marks. */
function matchShare(
  matched: number,
  total: number,
  requested: boolean,
  weight: number,
): number {
  if (!requested) return weight;
  if (total <= 0) return 0;

  return clamp(weight * (matched / total), weight);
}

/** Full marks up to ten minutes, nothing beyond seventy. */
const EASY_MINUTES = 10;
const HARD_MINUTES = 70;

function practicality(facts: PlanFacts): number {
  const span = HARD_MINUTES - EASY_MINUTES;
  const excess = Math.max(0, facts.averageMinutes - EASY_MINUTES);

  return clamp(SCORE_WEIGHTS.practicality * (1 - excess / span), SCORE_WEIGHTS.practicality);
}

/**
 * Breadth of the basket across the catalogue's food groups. This is a shopping
 * measure, not a medical one, and is labelled as such wherever it surfaces.
 */
const TARGET_FOOD_GROUPS = 6;

function foodGroupBalance(facts: PlanFacts): number {
  return clamp(
    SCORE_WEIGHTS.foodGroupBalance * (facts.foodGroupsCovered / TARGET_FOOD_GROUPS),
    SCORE_WEIGHTS.foodGroupBalance,
  );
}

export interface ScoredPlan {
  /** Rounded, for diagnostics and logs. */
  total: number;
  /**
   * Unrounded, for ordering candidates.
   *
   * Rounding before comparing throws away up to a whole point, which is more
   * than the gap between two weeks that differ only in how well they use the
   * budget. Candidates are ordered on this; only what gets reported is rounded.
   */
  exact: number;
  breakdown: ScoreBreakdown;
}

export function scorePlan(facts: PlanFacts): ScoredPlan {
  const breakdown: ScoreBreakdown = {
    budgetFit: budgetFit(facts),
    ingredientReuse: ingredientReuse(facts),
    recipeVariety: recipeVariety(facts),
    preferenceMatch: matchShare(
      facts.recipesMatchingPreference,
      facts.distinctRecipeCount,
      facts.hasPreferenceRequest,
      SCORE_WEIGHTS.preferenceMatch,
    ),
    cuisineMatch: matchShare(
      facts.recipesMatchingCuisine,
      facts.distinctRecipeCount,
      facts.hasCuisineRequest,
      SCORE_WEIGHTS.cuisineMatch,
    ),
    practicality: practicality(facts),
    foodGroupBalance: foodGroupBalance(facts),
  };

  const exact = Object.values(breakdown).reduce((running, value) => running + value, 0);

  return { total: Math.round(exact), exact, breakdown };
}

export interface PlanCandidateOrdering {
  score: number;
  /** Absolute distance from the chosen target, in pence. */
  targetDistancePence: number;
  totalPence: number;
  uniqueProductCount: number;
  /** Canonical, so two structurally identical plans can never tie. */
  signature: string;
}

/**
 * A total order. Sorting must not depend on the input order of the candidate
 * pool, or the same request could return different plans on different runs.
 */
export function comparePlanCandidates(
  a: PlanCandidateOrdering,
  b: PlanCandidateOrdering,
): number {
  return (
    b.score - a.score ||
    // Ties break toward the target rather than toward the cheapest basket:
    // the cheapest tie-break is what let a £90 request settle for £20.
    a.targetDistancePence - b.targetDistancePence ||
    a.totalPence - b.totalPence ||
    a.uniqueProductCount - b.uniqueProductCount ||
    a.signature.localeCompare(b.signature)
  );
}
