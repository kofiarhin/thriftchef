import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import { createCatalogueStatusHandler } from "./catalogueController";

export function createCatalogueRoutes(config: AppConfig): Router {
  const router = Router();

  router.get("/status", asyncHandler(createCatalogueStatusHandler(config)));

  return router;
}
