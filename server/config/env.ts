/**
 * Environment parsing is a pure function over a plain record so it can be
 * tested without mutating `process.env`.
 *
 * Failure messages name the offending variable and never repeat its value:
 * a bad `MONGODB_URI` or `NVIDIA_API_KEY` would otherwise leak a secret into
 * logs and crash traces.
 */

export type NodeEnv = "development" | "test" | "production";
export interface NvidiaConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  timeoutMs: number;
  maxRetries: number;
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  clientOrigin: string;
  mongodbUri: string;
  nvidia: NvidiaConfig;
  rateLimit: { windowMs: number; max: number };
  catalogueStaleAfterHours: number;
  mealPlanMaxContextProducts: number;
  mealPlanDefaultSnacks: boolean;
  logLevel: string;
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
    nvidia: {
      apiKey: collector.requiredString("NVIDIA_API_KEY"),
      apiUrl: collector.requiredString("NVIDIA_API_URL"),
      model: collector.requiredString("NVIDIA_MODEL"),
      // The total budget for one generation, not a per-attempt allowance. A
      // 49B model writing a week of recipes needs well over 30 seconds, and
      // the request is bounded by this figure however many attempts it makes.
      timeoutMs: collector.integer("AI_REQUEST_TIMEOUT_MS", 120_000, {
        min: 1_000,
        max: 120_000,
      }),
      // Transient upstream failures only. Timeouts are never retried, so this
      // cannot multiply the budget above.
      maxRetries: collector.integer("AI_MAX_RETRIES", 0, {
        min: 0,
        max: 3,
      }),
    },
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
    catalogueStaleAfterHours: collector.integer(
      "CATALOGUE_STALE_AFTER_HOURS",
      72,
      { min: 1, max: 8_760 },
    ),
    // 80 products keeps every food group represented while cutting roughly a
    // third off the prompt: fewer input tokens is less time before the model
    // starts writing, and the plan only ever shops from a handful of them.
    mealPlanMaxContextProducts: collector.integer(
      "MEAL_PLAN_MAX_CONTEXT_PRODUCTS",
      80,
      { min: 10, max: 500 },
    ),
    mealPlanDefaultSnacks: collector.boolean("MEAL_PLAN_DEFAULT_SNACKS", false),
    logLevel: collector.string("LOG_LEVEL", "info"),
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
