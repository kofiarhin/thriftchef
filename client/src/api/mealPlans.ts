import { apiRequest } from "./http";
import type { CatalogueStatus, MealPlanRequest, MealPlanResponse } from "./types";

export function fetchCatalogueStatus(): Promise<CatalogueStatus> {
  return apiRequest<CatalogueStatus>("/api/catalogue/status");
}

export function generateMealPlan(
  request: MealPlanRequest,
): Promise<MealPlanResponse> {
  return apiRequest<MealPlanResponse>("/api/meal-plans/generate", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * Reopens a saved plan.
 *
 * Returns the snapshot the plan was generated from, not a fresh calculation:
 * the catalogue moves, and a shopping list that reprices itself between the
 * kitchen and the shop is worse than none.
 */
export function fetchMealPlan(planId: string): Promise<MealPlanResponse> {
  return apiRequest<MealPlanResponse>(
    `/api/meal-plans/${encodeURIComponent(planId)}`,
  );
}

export interface ReplaceMealInput {
  request: MealPlanRequest;
  plan: MealPlanResponse;
  day: number;
  mealType: MealPlanResponse["days"][number]["meals"][number]["mealType"];
}

export function replaceMeal(input: ReplaceMealInput): Promise<MealPlanResponse> {
  return apiRequest<MealPlanResponse>("/api/meal-plans/replace", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
