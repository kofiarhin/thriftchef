import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import {
  createMealPlanHandler,
  type MealPlanDependencies,
} from "./mealPlanController";

export function createMealPlanRoutes(
  config: AppConfig,
  dependencies: MealPlanDependencies,
): Router {
  const router = Router();

  // Only the generation route is limited: it is the one that costs an AI call.
  router.post(
    "/generate",
    createRateLimiter({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
    }),
    asyncHandler(createMealPlanHandler(config, dependencies)),
  );

  return router;
}
