/**
 * Repeatable local performance harness for the planning engine.
 *
 * Deliberately not a test. Wall-clock thresholds vary far too much across
 * machines to gate CI on; the automated suites assert bounded operation counts
 * instead, and this reports the numbers a pull request should quote.
 *
 *   npm run benchmark:planner
 */

import {
  paddedCatalogue,
  planRequest,
  selectedProducts,
} from "../testing/planningFixtures";
import { createMealPlanEngine, type EngineOptions } from "./mealPlanEngine";
import type { MealPlanRequest } from "./mealPlanTypes";

const WARMUP_RUNS = 20;
const MEASURED_RUNS = 100;
const FIXTURE_PRODUCTS = 80;

const BOUNDS: EngineOptions = {
  beamWidth: 32,
  candidateLimit: 24,
  maxRecipeVariants: 6,
  timeoutMs: 1_500,
};

interface Scenario {
  label: string;
  request: MealPlanRequest;
}

const SCENARIOS: Scenario[] = [
  { label: "standard (3 meals, 2 people)", request: planRequest() },
  {
    label: "worst supported (4 meals, 8 people, all preferences)",
    request: planRequest({
      mealsPerDay: ["breakfast", "lunch", "dinner", "snack"],
      householdSize: 8,
      budgetPence: 20_000,
      mealPreferences: ["quick", "family-friendly", "high-protein", "low-waste", "batch-cook"],
      cuisinePreferences: ["italian", "indian", "british"],
    }),
  },
  { label: "constrained (hob only, vegetarian)", request: planRequest({ appliances: ["hob"], mealPreferences: ["vegetarian"] }) },
];

function percentile(sorted: number[], fraction: number): number {
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return sorted[Math.max(0, index)];
}

function format(value: number): string {
  return `${value.toFixed(1)} ms`.padStart(10);
}

async function run(): Promise<void> {
  const engine = createMealPlanEngine(BOUNDS);
  const catalogue = paddedCatalogue(FIXTURE_PRODUCTS);

  console.log(
    `ThriftChef planner benchmark — ${FIXTURE_PRODUCTS} catalogue products, ` +
      `${WARMUP_RUNS} warm-up + ${MEASURED_RUNS} measured runs per scenario\n`,
  );

  for (const scenario of SCENARIOS) {
    const products = selectedProducts(scenario.request, catalogue, FIXTURE_PRODUCTS);
    let candidatesGenerated = 0;
    let candidatesValid = 0;

    for (let run = 0; run < WARMUP_RUNS; run += 1) {
      await engine.generate({ request: scenario.request, products, variationSeed: run });
    }

    const durations: number[] = [];

    for (let run = 0; run < MEASURED_RUNS; run += 1) {
      const started = performance.now();
      const result = await engine.generate({
        request: scenario.request,
        products,
        variationSeed: run,
      });
      durations.push(performance.now() - started);

      candidatesGenerated += result.diagnostics.candidatesGenerated;
      candidatesValid += result.diagnostics.candidatesValid;
    }

    durations.sort((a, b) => a - b);

    console.log(`${scenario.label}`);
    console.log(`  median      ${format(percentile(durations, 0.5))}`);
    console.log(`  p95         ${format(percentile(durations, 0.95))}`);
    console.log(`  max         ${format(durations[durations.length - 1])}`);
    console.log(
      `  candidates  ${(candidatesGenerated / MEASURED_RUNS).toFixed(1)} generated, ` +
        `${(candidatesValid / MEASURED_RUNS).toFixed(1)} valid ` +
        `(${((candidatesValid / Math.max(1, candidatesGenerated)) * 100).toFixed(0)}%)\n`,
    );
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
