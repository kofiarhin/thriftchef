import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import {
  createCatalogueStatusHandler,
  type ScopeResolver,
} from "./catalogueController";

export function createCatalogueRoutes(
  config: AppConfig,
  resolveScope?: ScopeResolver,
): Router {
  const router = Router();

  router.get(
    "/status",
    asyncHandler(createCatalogueStatusHandler(config, resolveScope)),
  );

  return router;
}
