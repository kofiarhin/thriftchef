/**
 * Turns the frozen scenarios into the deterministic record Phase 0 compares
 * against.
 *
 * Capture happens at the HTTP seam rather than inside the engine, so the
 * record covers request parsing, product selection, the search, validation,
 * pricing, consolidation and response construction in one pass — every stage a
 * later slice could change without meaning to.
 *
 * Two response fields are not properties of the planner and would make every
 * record differ from itself: `planId` is a random UUID and `generatedAt` is a
 * clock reading. Both are pinned through the controller's existing injectable
 * dependencies rather than stripped afterwards, so the recorded response is a
 * complete response.
 */

import { createApp } from "../../app";
import { ENGINE_VERSION } from "../../mealPlanning/mealPlanEngine";
import { selectProducts } from "../../mealPlanning/productSelector";
import { startTestServer, testConfig } from "../httpTestServer";
import { ALDI_CATALOGUE } from "../planningFixtures";
import { ALDI_SCOPE } from "../scopeFixtures";
import {
  BASELINE_REPLACEMENTS,
  BASELINE_SCENARIOS,
  type BaselineReplacement,
  type BaselineScenario,
} from "./aldiBaselineRequests";
import type { MealPlanResponse } from "../../mealPlanning/mealPlanTypes";

export const BASELINE_PLAN_ID = "baseline-plan-id";
export const BASELINE_GENERATED_AT = "2026-08-20T00:00:00.000Z";

/** Matches the shipped defaults in `config/env.ts`. */
export const BASELINE_MAX_PRODUCTS = 80;

/** What `selectProducts` chose, and what each rule removed. */
export interface SelectionRecord {
  productIds: string[];
  productsConsidered: number;
  excludedForAllergies: number;
  excludedForSafety: number;
  excludedForDislikes: number;
  usesInferredProducts: boolean;
  warnings: string[];
}

export interface ScenarioRecord {
  key: string;
  selection: SelectionRecord;
  response: MealPlanResponse;
}

export interface ReplacementRecord {
  key: string;
  day: number;
  mealType: string;
  before: MealPlanResponse;
  after: MealPlanResponse;
}

export interface BaselineRecord {
  engineVersion: string;
  scenarios: ScenarioRecord[];
  replacements: ReplacementRecord[];
}

function selectionFor(scenario: BaselineScenario | BaselineReplacement): SelectionRecord {
  const selection = selectProducts(ALDI_CATALOGUE, scenario.request, {
    maxProducts: BASELINE_MAX_PRODUCTS,
    mustHaveProductIds: scenario.request.mustHaveProductIds,
  });

  return {
    productIds: selection.products.map((product) => product.productId),
    productsConsidered: selection.productsConsidered,
    excludedForAllergies: selection.excludedForAllergies,
    excludedForSafety: selection.excludedForSafety,
    excludedForDislikes: selection.excludedForDislikes,
    usesInferredProducts: selection.usesInferredProducts,
    warnings: selection.warnings,
  };
}

/**
 * The catalogue's `lastSeenAt` is a fixed date in the fixture, so the staleness
 * warning would depend on when the baseline is recorded. `now` is pinned to a
 * moment inside the freshness window, which keeps the warning list stable and
 * still exercises the staleness check.
 */
const PINNED_NOW = new Date(BASELINE_GENERATED_AT);

async function withBaselineServer<T>(
  run: (post: (path: string, body: unknown) => Promise<Response>) => Promise<T>,
): Promise<T> {
  // The matrix is larger than one window's allowance. Recording measures the
  // planner, not the limiter, so the limiter is widened here rather than the
  // matrix being cut down to fit it.
  const config = testConfig({
    throttle: { windowMs: 60_000, generate: 10_000, replace: 10_000, search: 10_000 },
  });

  const app = createApp(config, {
    mealPlanDependencies: {
      // A fixed Aldi scope rather than a database lookup: the baseline records
      // planning behaviour, and resolution is exercised by its own tests.
      resolveScope: async () => ALDI_SCOPE,
      loadProducts: async () => ALDI_CATALOGUE,
      now: () => PINNED_NOW,
      newPlanId: () => BASELINE_PLAN_ID,
      // Persistence is exercised by its own tests. The baseline records what
      // the planner produces, and a database write is not part of that.
      savePlan: async () => {},
      loadPlan: async () => null,
    },
  });

  const server = await startTestServer(app);

  try {
    return await run((path, body) =>
      server.fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  } finally {
    await server.close();
  }
}

async function expectOk(response: Response, key: string): Promise<MealPlanResponse> {
  if (!response.ok) {
    throw new Error(
      `Baseline scenario "${key}" did not produce a plan (HTTP ${response.status}): ${await response.text()}`,
    );
  }

  return (await response.json()) as MealPlanResponse;
}

export async function captureBaseline(): Promise<BaselineRecord> {
  return withBaselineServer(async (post) => {
    const scenarios: ScenarioRecord[] = [];

    for (const scenario of BASELINE_SCENARIOS) {
      const response = await expectOk(
        await post("/api/meal-plans/generate", {
          ...scenario.request,
          variationSeed: scenario.variationSeed,
        }),
        scenario.key,
      );

      scenarios.push({
        key: scenario.key,
        selection: selectionFor(scenario),
        response,
      });
    }

    const replacements: ReplacementRecord[] = [];

    for (const scenario of BASELINE_REPLACEMENTS) {
      const body = { ...scenario.request, variationSeed: scenario.variationSeed };
      const before = await expectOk(
        await post("/api/meal-plans/generate", body),
        scenario.key,
      );

      const after = await expectOk(
        await post("/api/meal-plans/replace", {
          request: body,
          plan: before,
          day: scenario.day,
          mealType: scenario.mealType,
        }),
        scenario.key,
      );

      replacements.push({
        key: scenario.key,
        day: scenario.day,
        mealType: scenario.mealType,
        before,
        after,
      });
    }

    return { engineVersion: ENGINE_VERSION, scenarios, replacements };
  });
}
