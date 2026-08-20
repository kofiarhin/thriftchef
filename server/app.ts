import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import type { ScopeResolver } from "./catalogue/catalogueController";
import { createCatalogueRoutes } from "./catalogue/catalogueRoutes";
import { createProductRoutes } from "./catalogue/productRoutes";
import { createRetailerRoutes } from "./catalogue/retailerRoutes";
import { createAdminRoutes } from "./admin/adminRoutes";
import {
  searchCatalogueProducts,
  type ProductSearchPort,
} from "./catalogue/productSearchService";
import type { AppConfig } from "./config/env";
import { errorHandler, notFoundHandler } from "./http/errors";
import { requestContext } from "./http/requestId";
import type { FeedbackDependencies } from "./mealPlanning/feedbackController";
import {
  defaultDependencies,
  type MealPlanDependencies,
} from "./mealPlanning/mealPlanController";
import { createMealPlanRoutes } from "./mealPlanning/mealPlanRoutes";

export const SERVICE_NAME = "thriftchef-api";
export const SERVICE_VERSION = "1.0.0";

export interface AppOverrides {
  /**
   * Lets tests substitute the catalogue loader and the planning engine, so the
   * route can be exercised end to end without MongoDB.
   */
  mealPlanDependencies?: Partial<MealPlanDependencies>;
  /** Lets tests drive catalogue search from a fixture instead of MongoDB. */
  searchProducts?: ProductSearchPort;
  /**
   * Lets tests resolve a catalogue scope without a database. Production always
   * resolves through the retailer registry; there is no unscoped path either
   * way.
   */
  resolveScope?: ScopeResolver;
  /** Lets tests record feedback without a database. */
  feedbackDependencies?: Partial<FeedbackDependencies>;
}

/**
 * The app is built from an explicit config rather than reading `process.env`,
 * so tests can drive it with a fixed configuration.
 */
export function createApp(config: AppConfig, overrides: AppOverrides = {}): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestContext);
  app.use(
    cors({
      // Local development uses several dev-server ports; deployed environments
      // must name exactly one allowed origin.
      origin:
        config.nodeEnv === "development" ? true : [config.clientOrigin],
      methods: ["GET", "POST"],
    }),
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request: Request, response: Response) => {
    response.json({
      ok: true,
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
    });
  });

  app.use("/api/catalogue", createCatalogueRoutes(config, overrides.resolveScope));
  app.use("/api/retailers", createRetailerRoutes(config));
  app.use(
    "/api/products",
    createProductRoutes(
      config,
      overrides.searchProducts ?? searchCatalogueProducts,
      overrides.resolveScope,
    ),
  );
  app.use(
    "/api/meal-plans",
    createMealPlanRoutes(
      config,
      { ...defaultDependencies(config), ...overrides.mealPlanDependencies },
      overrides.feedbackDependencies,
    ),
  );

  // Read-only, and refused entirely unless ADMIN_ENABLED is set and the
  // environment is not production. See `adminController.requireAdminEnabled`.
  app.use("/api/admin", createAdminRoutes(config));

  app.use("/api", notFoundHandler);
  app.use(errorHandler);

  return app;
}
