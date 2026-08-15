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
