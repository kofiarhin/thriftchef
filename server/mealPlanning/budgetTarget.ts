/**
 * The weekly budget is a hard maximum that a plan may never exceed. The target
 * is a soft aim *inside* that maximum, because "spend as little as possible"
 * and "feed a household well" are different requests: a £90 budget answered
 * with a £20 basket is technically within budget and practically useless.
 *
 * Only the maximum is enforced. Everything here shapes preference between
 * plans that are already affordable.
 */

import type { BudgetTarget, BudgetTargetPercent, BudgetUtilization } from "./mealPlanTypes";

export { BUDGET_TARGET_PERCENTS, DEFAULT_BUDGET_TARGET_PERCENT } from "./mealPlanTypes";

/**
 * Half the width of the preferred band, in percentage points of the maximum.
 * Five points either side gives the documented 45–55, 60–70 and 75–85 bands.
 */
const PREFERRED_BAND_POINTS = 5;

export function resolveBudgetTarget(
  hardMaximumPence: number,
  percent: BudgetTargetPercent,
): BudgetTarget {
  const targetPence = Math.round(hardMaximumPence * (percent / 100));

  return {
    percent,
    targetPence,
    lowerPreferredPence: Math.max(
      0,
      Math.round(hardMaximumPence * ((percent - PREFERRED_BAND_POINTS) / 100)),
    ),
    // The band is a preference, never a second ceiling, but it must not
    // describe spending the user has forbidden.
    upperPreferredPence: Math.min(
      hardMaximumPence,
      Math.round(hardMaximumPence * ((percent + PREFERRED_BAND_POINTS) / 100)),
    ),
    hardMaximumPence,
  };
}

export function isWithinPreferredRange(
  target: BudgetTarget,
  actualPence: number,
): boolean {
  return (
    actualPence >= target.lowerPreferredPence &&
    actualPence <= target.upperPreferredPence
  );
}

export function describeUtilization(
  target: BudgetTarget,
  actualPence: number,
): BudgetUtilization {
  return {
    targetPercent: target.percent,
    targetPence: target.targetPence,
    actualPence,
    actualPercent:
      target.hardMaximumPence > 0
        ? Math.round((actualPence / target.hardMaximumPence) * 100)
        : 0,
    withinPreferredRange: isWithinPreferredRange(target, actualPence),
  };
}

/**
 * How far under the band counts as worth telling the user about. A basket a
 * few pence short of the band is the search doing its job; one that misses by
 * a tenth of the whole target means the catalogue or the constraints, not the
 * preference, decided the spend.
 */
const MATERIAL_SHORTFALL_SHARE = 0.1;

export function isMateriallyBelowTarget(
  target: BudgetTarget,
  actualPence: number,
): boolean {
  return (
    actualPence <
    target.lowerPreferredPence - target.targetPence * MATERIAL_SHORTFALL_SHARE
  );
}

export function underTargetWarning(
  target: BudgetTarget,
  actualPence: number,
): string {
  return (
    `This plan comes to £${(actualPence / 100).toFixed(2)} against a target of about ` +
    `£${(target.targetPence / 100).toFixed(2)} (${target.percent}% of your £${(
      target.hardMaximumPence / 100
    ).toFixed(2)} maximum). The Aldi catalogue and the constraints you set did not ` +
    `offer a richer week that still fits every rule. Nothing was added to the basket ` +
    `just to spend more.`
  );
}
