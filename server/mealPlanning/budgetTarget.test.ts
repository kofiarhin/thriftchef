import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BUDGET_TARGET_PERCENTS,
  DEFAULT_BUDGET_TARGET_PERCENT,
  describeUtilization,
  isMateriallyBelowTarget,
  resolveBudgetTarget,
} from "./budgetTarget";

describe("resolveBudgetTarget", () => {
  it("defaults to 80 percent", () => {
    assert.equal(DEFAULT_BUDGET_TARGET_PERCENT, 80);
  });

  it("offers exactly the three documented presets", () => {
    assert.deepEqual([...BUDGET_TARGET_PERCENTS], [50, 65, 80]);
  });

  it("computes the target as a share of the hard maximum", () => {
    const target = resolveBudgetTarget(9_000, 80);

    assert.equal(target.percent, 80);
    assert.equal(target.targetPence, 7_200);
    assert.equal(target.hardMaximumPence, 9_000);
  });

  it("puts the preferred band five points either side of the target", () => {
    const tight = resolveBudgetTarget(9_000, 50);
    const balanced = resolveBudgetTarget(9_000, 65);
    const full = resolveBudgetTarget(9_000, 80);

    assert.deepEqual(
      [tight.lowerPreferredPence, tight.upperPreferredPence],
      [4_050, 4_950],
    );
    assert.deepEqual(
      [balanced.lowerPreferredPence, balanced.upperPreferredPence],
      [5_400, 6_300],
    );
    assert.deepEqual(
      [full.lowerPreferredPence, full.upperPreferredPence],
      [6_750, 7_650],
    );
  });

  it("never lets the preferred band reach past the hard maximum", () => {
    const target = resolveBudgetTarget(1_000, 80);

    assert.ok(target.upperPreferredPence <= target.hardMaximumPence);
  });
});

describe("describeUtilization", () => {
  it("reports actual spend as a whole percentage of the maximum", () => {
    const utilization = describeUtilization(resolveBudgetTarget(9_000, 80), 7_200);

    assert.deepEqual(utilization, {
      targetPercent: 80,
      targetPence: 7_200,
      actualPence: 7_200,
      actualPercent: 80,
      withinPreferredRange: true,
    });
  });

  it("marks a basket outside the preferred band", () => {
    const utilization = describeUtilization(resolveBudgetTarget(9_000, 80), 2_008);

    assert.equal(utilization.withinPreferredRange, false);
    assert.equal(utilization.actualPercent, 22);
  });
});

describe("isMateriallyBelowTarget", () => {
  it("is true for a basket far under the target", () => {
    assert.equal(isMateriallyBelowTarget(resolveBudgetTarget(9_000, 80), 2_008), true);
  });

  it("is false just under the preferred band", () => {
    assert.equal(isMateriallyBelowTarget(resolveBudgetTarget(9_000, 80), 6_700), false);
  });

  it("is never true for a basket above the target", () => {
    assert.equal(isMateriallyBelowTarget(resolveBudgetTarget(9_000, 80), 8_000), false);
  });
});
