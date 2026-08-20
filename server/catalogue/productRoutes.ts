import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import type { ScopeResolver } from "./catalogueController";
import { createProductSearchHandler } from "./productSearchController";
import type { ProductSearchPort } from "./productSearchService";

/**
 * Catalogue search gets its own generous budget. A picker legitimately issues
 * many searches while a user makes one decision, and a shared bucket would let
 * browsing for products exhaust the allowance for generating a plan.
 */
export function createProductRoutes(
  config: AppConfig,
  search: ProductSearchPort,
  resolveScope?: ScopeResolver,
): Router {
  const router = Router();

  router.get(
    "/",
    createRateLimiter({
      windowMs: config.throttle.windowMs,
      max: config.throttle.search,
    }),
    asyncHandler(createProductSearchHandler(config, search, resolveScope)),
  );

  return router;
}
