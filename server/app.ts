import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { createCatalogueRoutes } from "./catalogue/catalogueRoutes";
import type { AppConfig } from "./config/env";
import { errorHandler, notFoundHandler } from "./http/errors";
import { requestContext } from "./http/requestId";
import {
  defaultDependencies,
  type MealPlanDependencies,
} from "./mealPlanning/mealPlanController";
import { createMealPlanRoutes } from "./mealPlanning/mealPlanRoutes";

export const SERVICE_NAME = "thriftchef-api";
export const SERVICE_VERSION = "1.0.0";

export interface AppOverrides {
  /**
   * Lets tests substitute the catalogue loader and plan generator, so the
   * route can be exercised end to end without MongoDB or an AI call.
   */
  mealPlanDependencies?: Partial<MealPlanDependencies>;
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

  app.use("/api/catalogue", createCatalogueRoutes(config));
  app.use(
    "/api/meal-plans",
    createMealPlanRoutes(config, {
      ...defaultDependencies(config),
      ...overrides.mealPlanDependencies,
    }),
  );

  app.use("/api", notFoundHandler);
  app.use(errorHandler);

  return app;
}
