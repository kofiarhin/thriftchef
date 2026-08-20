import { Router } from "express";
import type { AppConfig } from "../config/env";
import { asyncHandler } from "../http/errors";
import {
  createCatalogueQualityHandler,
  createCrawlRunsHandler,
  createRetailerOverviewHandler,
  requireAdminEnabled,
} from "./adminController";

/**
 * Read-only, and off unless deliberately enabled.
 *
 * There is no route here that changes anything, and there will not be one
 * until an authentication mechanism is chosen and approved: state-changing
 * admin operations need an identity to attribute them to and an audit trail
 * to write them into, and neither exists yet.
 */
export function createAdminRoutes(config: AppConfig): Router {
  const router = Router();

  router.use(requireAdminEnabled(config));

  router.get("/retailers", asyncHandler(createRetailerOverviewHandler()));
  router.get("/crawl-runs", asyncHandler(createCrawlRunsHandler()));
  router.get("/catalogue-quality", asyncHandler(createCatalogueQualityHandler()));

  return router;
}
