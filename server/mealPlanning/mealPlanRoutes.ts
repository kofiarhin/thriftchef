import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import {
  createMealPlanHandler,
  createMealReplacementHandler,
  type MealPlanDependencies,
} from "./mealPlanController";

export function createMealPlanRoutes(
  config: AppConfig,
  dependencies: MealPlanDependencies,
): Router {
  const router = Router();

  // Generation is bounded but not free: it still burns CPU and reads the
  // catalogue, so the limit stays now that the model is gone.
  router.post(
    "/generate",
    createRateLimiter({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
    }),
    asyncHandler(createMealPlanHandler(config, dependencies)),
  );

  router.post(
    "/replace",
    createRateLimiter({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
    }),
    asyncHandler(createMealReplacementHandler(config, dependencies)),
  );

  return router;
}
