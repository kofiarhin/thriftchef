/**
 * The frozen request matrix Phase 0 records current behaviour from.
 *
 * Every entry pins a request *and* a variation seed, because the planner is
 * deterministic only for a fixed pair. These scenarios are the regression
 * oracle for the whole multi-retailer migration: a later slice that changes
 * one of these outputs has changed planning behaviour, whether it meant to or
 * not.
 *
 * Deliberately drawn from `planningFixtures.ALDI_CATALOGUE` rather than a live
 * crawl. A fixture baseline is reproducible on any machine and in CI; a live
 * catalogue baseline would drift with every Aldi price change and prove
 * nothing about the code.
 */

import { planRequest } from "../planningFixtures";
import type { MealPlanRequest, MealType } from "../../mealPlanning/mealPlanTypes";

export interface BaselineScenario {
  key: string;
  request: MealPlanRequest;
  variationSeed: number;
}

/** The meal a replacement scenario targets. */
export interface BaselineReplacement {
  key: string;
  request: MealPlanRequest;
  variationSeed: number;
  day: number;
  mealType: MealType;
}

const RICE = "p-basmati-rice";
const CHICKEN = "p-chicken-breast";
const PASSATA = "p-passata";

export const BASELINE_SCENARIOS: BaselineScenario[] = [
  { key: "standard-seed-0", request: planRequest(), variationSeed: 0 },
  { key: "standard-seed-1", request: planRequest(), variationSeed: 1 },
  { key: "standard-seed-7", request: planRequest(), variationSeed: 7 },

  // Matches the client's INITIAL_FORM_STATE, so the baseline covers the shape
  // a first-time user actually submits.
  {
    key: "dinner-only-seed-0",
    request: planRequest({ mealsPerDay: ["dinner"], budgetPence: 7_000 }),
    variationSeed: 0,
  },
  {
    key: "dinner-only-seed-1",
    request: planRequest({ mealsPerDay: ["dinner"], budgetPence: 7_000 }),
    variationSeed: 1,
  },

  {
    key: "every-meal-type",
    request: planRequest({
      mealsPerDay: ["breakfast", "lunch", "dinner", "snack"],
      householdSize: 8,
      budgetPence: 20_000,
    }),
    variationSeed: 0,
  },

  { key: "no-cook", request: planRequest({ appliances: [] }), variationSeed: 0 },

  {
    key: "milk-allergy",
    request: planRequest({ allergies: ["milk"], budgetPence: 9_000 }),
    variationSeed: 0,
  },

  {
    key: "dislikes",
    request: planRequest({ dislikedIngredients: ["broccoli", "salmon"] }),
    variationSeed: 0,
  },

  // The three budget presets against one budget: the spread between them is
  // the behaviour `budgetTargetPercent` exists to produce.
  {
    key: "budget-target-50",
    request: planRequest({ budgetTargetPercent: 50 }),
    variationSeed: 0,
  },
  {
    key: "budget-target-65",
    request: planRequest({ budgetTargetPercent: 65 }),
    variationSeed: 0,
  },
  {
    key: "budget-target-80",
    request: planRequest({ budgetTargetPercent: 80 }),
    variationSeed: 0,
  },

  {
    key: "must-have-single",
    request: planRequest({ mealsPerDay: ["dinner"], mustHaveProductIds: [RICE] }),
    variationSeed: 0,
  },
  {
    key: "must-have-three",
    request: planRequest({
      mealsPerDay: ["lunch", "dinner"],
      budgetPence: 12_000,
      mustHaveProductIds: [RICE, CHICKEN, PASSATA],
    }),
    variationSeed: 0,
  },
];

export const BASELINE_REPLACEMENTS: BaselineReplacement[] = [
  {
    key: "replace-standard-day-3-dinner",
    request: planRequest(),
    variationSeed: 0,
    day: 3,
    mealType: "dinner",
  },
  {
    key: "replace-dinner-only-day-1",
    request: planRequest({ mealsPerDay: ["dinner"], budgetPence: 7_000 }),
    variationSeed: 0,
    day: 1,
    mealType: "dinner",
  },
];
