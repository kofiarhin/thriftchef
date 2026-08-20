import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogueCoverageTracker } from "./catalogueCoverage";

describe("catalogue listing coverage", () => {
  it("does not complete a category when a later page fails", () => {
    const coverage = new CatalogueCoverageTracker();

    coverage.expect("vegetables", "page-1");
    coverage.expect("vegetables", "page-2");
    coverage.complete("vegetables", "page-1");

    assert.equal(coverage.completedCategoryCount(), 0);
  });

  it("completes a category only after every expected page succeeds", () => {
    const coverage = new CatalogueCoverageTracker();

    coverage.expect("vegetables", "page-1");
    coverage.expect("vegetables", "page-2");
    coverage.complete("vegetables", "page-1");
    coverage.complete("vegetables", "page-2");

    assert.equal(coverage.completedCategoryCount(), 1);
  });

  it("does not count unexpected completions", () => {
    const coverage = new CatalogueCoverageTracker();

    coverage.complete("vegetables", "unknown-page");

    assert.equal(coverage.completedCategoryCount(), 0);
  });
});
