import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createRateLimiter } from "../http/rateLimit";
import {
  createRetailerListHandler,
  createStoreListHandler,
} from "./retailerController";

export function createRetailerRoutes(config: AppConfig): Router {
  const router = Router();

  // Discovery is read-only and cheap, but the store lookup accepts client
  // input, so it carries the same generous operational budget as search.
  const limiter = createRateLimiter({
    windowMs: config.throttle.windowMs,
    max: config.throttle.search,
  });

  router.get("/", limiter, asyncHandler(createRetailerListHandler(config)));
  router.get(
    "/:retailerId/stores",
    limiter,
    asyncHandler(createStoreListHandler(config)),
  );

  return router;
}
