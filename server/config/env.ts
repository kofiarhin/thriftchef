/**
 * Environment parsing is a pure function over a plain record so it can be
 * tested without mutating `process.env`.
 *
 * Failure messages name the offending variable and never repeat its value:
 * a bad `MONGODB_URI` would otherwise leak a secret into logs and crash traces.
 */

import {
  CATALOGUE_READ_SOURCES,
  type CatalogueReadSource,
} from "../catalogue/core/catalogueTypes";

export type NodeEnv = "development" | "test" | "production";

/**
 * Bounds on the local planning engine. Every one of them caps work rather than
 * quality: the search is finite by construction, so no request can run away.
 */
export interface MealPlanEngineConfig {
  /** Products the selector hands the planner. */
  maxProducts: number;
  /** Complete weeks validated and priced before a winner is chosen. */
  candidateLimit: number;
  /** Partial states kept between search stages. */
  beamWidth: number;
  /** Distinct fillings enumerated per recipe template. */
  maxRecipeVariants: number;
  /** Wall-clock ceiling, checked between stages. */
  timeoutMs: number;
}

/**
 * Operational throttling, kept deliberately separate from anything the user
 * can see.
 *
 * Generation is free and anonymous: there is no quota, no credit and no
 * paywall. These numbers exist to stop automated abuse, so they are set well
 * above what a person planning their week could reach — a real user generating,
 * regenerating and swapping repeatedly must never meet them.
 *
 * Replacement has its own budget because swapping is the most repeated action
 * in the product: a shared bucket would let a handful of swaps exhaust the
 * allowance for generating at all.
 */
export interface ThrottleConfig {
  windowMs: number;
  generate: number;
  replace: number;
  search: number;
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  clientOrigin: string;
  mongodbUri: string;
  mealPlanEngine: MealPlanEngineConfig;
  /** @deprecated Read `throttle` instead; kept so existing call sites compile. */
  rateLimit: { windowMs: number; max: number };
  throttle: ThrottleConfig;
  catalogueStaleAfterHours: number;
  /** Which collection the catalogue is read from. See `catalogueReads.ts`. */
  catalogueReadSource: CatalogueReadSource;
  /** How long an anonymous plan is retained before its TTL index removes it. */
  planRetentionDays: number;
  /**
   * The retailer and store a request falls back to when it names none. Exists
   * only so the existing single-retailer deployment keeps working while
   * clients are updated; it is never a licence to skip scope resolution.
   */
  defaultRetailerSlug: string;
  mealPlanDefaultSnacks: boolean;
  logLevel: string;
  /**
   * Read-only catalogue administration. Off in production until an
   * authentication mechanism is separately approved — an unauthenticated admin
   * surface on a public origin is not a feature, it is an incident.
   */
  adminEnabled: boolean;
  aldi: {
    storeId: string;
    expectedStoreText: string;
    headless: boolean;
    maxProductsPerCategory: number | null;
  };
}

export type EnvSource = Record<string, string | undefined>;

class ConfigCollector {
  private readonly problems: string[] = [];

  constructor(private readonly source: EnvSource) {}

  private raw(key: string): string | undefined {
    const value = this.source[key]?.trim();
    return value ? value : undefined;
  }

  requiredString(key: string): string {
    const value = this.raw(key);
    if (!value) {
      this.problems.push(`${key} is required`);
      return "";
    }
    return value;
  }

  string(key: string, fallback: string): string {
    return this.raw(key) ?? fallback;
  }

  oneOf<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    const value = this.raw(key);
    if (value === undefined) return fallback;

    if (!(allowed as readonly string[]).includes(value)) {
      this.problems.push(`${key} must be one of: ${allowed.join(", ")}`);
      return fallback;
    }

    return value as T;
  }

  integer(
    key: string,
    fallback: number,
    bounds: { min: number; max: number },
  ): number {
    const value = this.raw(key);
    if (value === undefined) return fallback;

    const parsed = Number(value);
    if (
      !Number.isInteger(parsed) ||
      parsed < bounds.min ||
      parsed > bounds.max
    ) {
      this.problems.push(
        `${key} must be an integer between ${bounds.min} and ${bounds.max}`,
      );
      return fallback;
    }

    return parsed;
  }

  optionalInteger(
    key: string,
    bounds: { min: number; max: number },
  ): number | null {
    const value = this.raw(key);
    if (value === undefined) return null;

    const parsed = Number(value);
    if (
      !Number.isInteger(parsed) ||
      parsed < bounds.min ||
      parsed > bounds.max
    ) {
      this.problems.push(
        `${key} must be an integer between ${bounds.min} and ${bounds.max}`,
      );
      return null;
    }

    return parsed;
  }

  boolean(key: string, fallback: boolean): boolean {
    const value = this.raw(key)?.toLowerCase();
    if (value === undefined) return fallback;

    if (value === "true") return true;
    if (value === "false") return false;

    this.problems.push(`${key} must be "true" or "false"`);
    return fallback;
  }

  throwIfInvalid(): void {
    if (this.problems.length === 0) return;

    throw new Error(
      `Invalid environment configuration:\n  - ${this.problems.join("\n  - ")}`,
    );
  }
}

export function loadConfig(source: EnvSource): AppConfig {
  const collector = new ConfigCollector(source);

  const config: AppConfig = {
    nodeEnv: collector.oneOf<NodeEnv>(
      "NODE_ENV",
      ["development", "test", "production"],
      "development",
    ),
    port: collector.integer("PORT", 5000, { min: 1, max: 65_535 }),
    clientOrigin: collector.string("CLIENT_ORIGIN", "http://localhost:5173"),
    mongodbUri: collector.requiredString("MONGODB_URI"),
    rateLimit: {
      windowMs: collector.integer("MEAL_PLAN_RATE_LIMIT_WINDOW_MS", 60_000, {
        min: 1_000,
        max: 3_600_000,
      }),
      max: collector.integer("MEAL_PLAN_RATE_LIMIT_MAX", 10, {
        min: 1,
        max: 1_000,
      }),
    },
    // Generous by design. A person planning a week might generate a handful of
    // times and swap a dozen meals; these allow far more than that, because the
    // limit is here for scripts, not for shoppers.
    throttle: {
      windowMs: collector.integer("THROTTLE_WINDOW_MS", 60_000, {
        min: 1_000,
        max: 3_600_000,
      }),
      generate: collector.integer("THROTTLE_GENERATE_PER_WINDOW", 60, {
        min: 1,
        max: 10_000,
      }),
      // Swapping is the most repeated action in the product, so it gets the
      // largest budget and its own bucket.
      replace: collector.integer("THROTTLE_REPLACE_PER_WINDOW", 120, {
        min: 1,
        max: 10_000,
      }),
      search: collector.integer("THROTTLE_SEARCH_PER_WINDOW", 240, {
        min: 1,
        max: 20_000,
      }),
    },
    catalogueReadSource: collector.oneOf<CatalogueReadSource>(
      "CATALOGUE_READ_SOURCE",
      CATALOGUE_READ_SOURCES,
      "legacy",
    ),
    planRetentionDays: collector.integer("PLAN_RETENTION_DAYS", 30, {
      min: 1,
      max: 365,
    }),
    defaultRetailerSlug: collector.string("DEFAULT_RETAILER_SLUG", "aldi-uk"),
    catalogueStaleAfterHours: collector.integer(
      "CATALOGUE_STALE_AFTER_HOURS",
      72,
      { min: 1, max: 8_760 },
    ),
    // 80 products keeps every food group represented while keeping the search
    // small. The plan only ever shops from a handful of them.
    mealPlanEngine: {
      maxProducts: collector.integer("MEAL_PLAN_MAX_PRODUCTS", 80, {
        min: 20,
        max: 200,
      }),
      candidateLimit: collector.integer("MEAL_PLAN_CANDIDATE_LIMIT", 24, {
        min: 4,
        max: 64,
      }),
      beamWidth: collector.integer("MEAL_PLAN_BEAM_WIDTH", 32, {
        min: 8,
        max: 128,
      }),
      maxRecipeVariants: collector.integer("MEAL_PLAN_MAX_RECIPE_VARIANTS", 6, {
        min: 1,
        max: 12,
      }),
      // Generous: the engine finishes a normal week in tens of milliseconds, so
      // reaching this ceiling means something is genuinely wrong.
      timeoutMs: collector.integer("MEAL_PLAN_ENGINE_TIMEOUT_MS", 1_500, {
        min: 250,
        max: 5_000,
      }),
    },
    mealPlanDefaultSnacks: collector.boolean("MEAL_PLAN_DEFAULT_SNACKS", false),
    logLevel: collector.string("LOG_LEVEL", "info"),
    adminEnabled: collector.boolean("ADMIN_ENABLED", false),
    aldi: {
      storeId: collector.string("ALDI_STORE_ID", "belper-de56-1ar"),
      expectedStoreText: collector.string("ALDI_EXPECTED_STORE_TEXT", "DE56 1AR"),
      headless: collector.boolean("ALDI_HEADLESS", false),
      maxProductsPerCategory: collector.optionalInteger(
        "ALDI_MAX_PRODUCTS_PER_CATEGORY",
        { min: 1, max: 10_000 },
      ),
    },
  };

  collector.throwIfInvalid();
  return config;
}

let cached: AppConfig | null = null;

/** Parsed once per process; the first call decides the configuration. */
export function getConfig(): AppConfig {
  cached ??= loadConfig(process.env);
  return cached;
}
