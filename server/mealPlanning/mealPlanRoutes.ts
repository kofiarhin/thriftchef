import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import {
  createFeedbackHandler,
  defaultFeedbackDependencies,
  type FeedbackDependencies,
} from "./feedbackController";
import {
  createGetMealPlanHandler,
  createMealPlanHandler,
  createMealReplacementHandler,
  type MealPlanDependencies,
} from "./mealPlanController";

export function createMealPlanRoutes(
  config: AppConfig,
  dependencies: MealPlanDependencies,
  feedback?: Partial<FeedbackDependencies>,
): Router {
  const router = Router();

  // Generation stays free and anonymous. These limits are an operational
  // guard against automation, set well above anything a person planning their
  // week could reach — they are deliberately not a quota the user can see.
  router.post(
    "/generate",
    createRateLimiter({
      windowMs: config.throttle.windowMs,
      max: config.throttle.generate,
    }),
    asyncHandler(createMealPlanHandler(config, dependencies)),
  );

  // Its own bucket, and a larger one: swapping is the most repeated action in
  // the product, and sharing a bucket would let a few swaps block generating.
  router.post(
    "/replace",
    createRateLimiter({
      windowMs: config.throttle.windowMs,
      max: config.throttle.replace,
    }),
    asyncHandler(createMealReplacementHandler(config, dependencies)),
  );

  // The spec's plan-scoped replacement route. The body-carrying `/replace`
  // above is kept alongside it: it is the shape the shipped client sends, and
  // removing it would break every open tab.
  router.post(
    "/:planId/replace",
    createRateLimiter({
      windowMs: config.throttle.windowMs,
      max: config.throttle.replace,
    }),
    asyncHandler(createMealReplacementHandler(config, dependencies)),
  );

  router.get("/:planId", asyncHandler(createGetMealPlanHandler(config, dependencies)));

  // Optional, and never on the path to a plan. Feedback that could delay or
  // fail generation would be a cost imposed on users who did not ask to give
  // it.
  router.post(
    "/:planId/feedback",
    createRateLimiter({
      windowMs: config.throttle.windowMs,
      max: config.throttle.replace,
    }),
    asyncHandler(
      createFeedbackHandler(config, {
        ...defaultFeedbackDependencies(config),
        ...feedback,
      }),
    ),
  );

  return router;
}
