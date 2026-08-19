import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import { createProductSearchHandler } from "./productSearchController";
import type { ProductSearchPort } from "./productSearchService";

/**
 * Catalogue search runs a regex query per keystroke-debounced request, so it
 * gets the same fixed-window limiter the planning routes use. The window is
 * shared configuration; the allowance is larger because a picker legitimately
 * issues several searches while a user makes one decision.
 */
const SEARCHES_PER_PLAN_REQUEST = 6;

export function createProductRoutes(
  config: AppConfig,
  search: ProductSearchPort,
): Router {
  const router = Router();

  router.get(
    "/",
    createRateLimiter({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max * SEARCHES_PER_PLAN_REQUEST,
    }),
    asyncHandler(createProductSearchHandler(config, search)),
  );

  return router;
}
