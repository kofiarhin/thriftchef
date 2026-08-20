import type { NextFunction, Request, Response } from "express";

/**
 * Every failure the client can see is one of these codes. Keeping the set
 * closed lets the frontend map failures to recovery actions without parsing
 * prose, and stops incidental server detail reaching the browser.
 */
export const API_ERROR_CODES = [
  "INVALID_MEAL_PLAN_REQUEST",
  "INVALID_REQUEST",
  "CATALOGUE_UNAVAILABLE",
  "CATALOGUE_CONSTRAINT_CONFLICT",
  // Catalogue ownership. Added as a superset: every code that existed before
  // multi-retailer support still exists, because the client already maps each
  // of them to a specific recovery action.
  "RETAILER_NOT_FOUND",
  "RETAILER_NOT_ACTIVE",
  "STORE_NOT_FOUND",
  "CATALOGUE_STALE",
  "PLAN_NOT_FOUND",
  "NO_AFFORDABLE_PLAN",
  "NO_REPLACEMENT_AVAILABLE",
  "MUST_HAVE_PRODUCT_NOT_FOUND",
  "MUST_HAVE_CONSTRAINT_CONFLICT",
  "MUST_HAVE_PRODUCTS_OVER_BUDGET",
  "MUST_HAVE_PRODUCT_UNUSABLE",
  "PLANNER_CAPACITY_EXCEEDED",
  "PLANNER_INTERNAL_ERROR",
  "RATE_LIMITED",
  "PAYLOAD_TOO_LARGE",
  "NOT_FOUND",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

/**
 * `details` is sent to the client, so it must only ever carry data the client
 * supplied or data derived from the catalogue — never internal state.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  toBody(): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details === undefined ? {} : { details: this.details }),
      },
    };
  }

  static badRequest(
    message: string,
    details?: unknown,
    code: ApiErrorCode = "INVALID_REQUEST",
  ): ApiError {
    return new ApiError(400, code, message, details);
  }

  static conflict(message: string, details?: unknown): ApiError {
    return new ApiError(409, "CATALOGUE_CONSTRAINT_CONFLICT", message, details);
  }

  /** Valid weeks exist, but every one of them costs more than the budget. */
  static noAffordablePlan(message: string, details?: unknown): ApiError {
    return new ApiError(409, "NO_AFFORDABLE_PLAN", message, details);
  }

  /** No distinct, affordable alternative exists for the meal being replaced. */
  static noReplacementAvailable(message: string, details?: unknown): ApiError {
    return new ApiError(409, "NO_REPLACEMENT_AVAILABLE", message, details);
  }

  /**
   * A must-have product id is not in the catalogue snapshot this request was
   * planned against. Malformed input rather than a planning conflict, so 400:
   * the client sent an id no product has.
   */
  static mustHaveProductNotFound(message: string, details?: unknown): ApiError {
    return new ApiError(400, "MUST_HAVE_PRODUCT_NOT_FOUND", message, details);
  }

  /**
   * The product exists and the selection is well formed, but honouring it
   * would break a rule the user set — an allergy, a dislike, or a catalogue
   * safety exclusion. A conflict between two valid choices, so 409.
   */
  static mustHaveConstraintConflict(message: string, details?: unknown): ApiError {
    return new ApiError(409, "MUST_HAVE_CONSTRAINT_CONFLICT", message, details);
  }

  /** The chosen products cost more than the whole week's budget by themselves. */
  static mustHaveProductsOverBudget(message: string, details?: unknown): ApiError {
    return new ApiError(409, "MUST_HAVE_PRODUCTS_OVER_BUDGET", message, details);
  }

  /**
   * No recipe in the library can use this product for the meals requested.
   * Never resolved by dropping it into an unrelated recipe slot: that is how a
   * planner ends up serving pate for breakfast.
   */
  static mustHaveProductUnusable(message: string, details?: unknown): ApiError {
    return new ApiError(409, "MUST_HAVE_PRODUCT_UNUSABLE", message, details);
  }

  /**
   * The bounded search ran out of time before completing a candidate. This
   * should be exceptional; 503 marks it retryable, because the same request a
   * moment later will usually succeed.
   */
  static plannerCapacity(message: string, details?: unknown): ApiError {
    return new ApiError(503, "PLANNER_CAPACITY_EXCEEDED", message, details);
  }

  /**
   * The planner produced something its own validator rejected. That is a bug in
   * the engine, never something the user can act on, so nothing about the
   * offending plan is returned.
   */
  static plannerInternal(message: string): ApiError {
    return new ApiError(500, "PLANNER_INTERNAL_ERROR", message);
  }

  static rateLimited(message: string, details?: unknown): ApiError {
    return new ApiError(429, "RATE_LIMITED", message, details);
  }

  static catalogueUnavailable(message: string, details?: unknown): ApiError {
    return new ApiError(503, "CATALOGUE_UNAVAILABLE", message, details);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, "NOT_FOUND", message);
  }

  /* --------------------------------------------------- catalogue ownership */

  static retailerNotFound(message: string, details?: unknown): ApiError {
    return new ApiError(404, "RETAILER_NOT_FOUND", message, details);
  }

  /**
   * The retailer exists but its integration is not in a state a customer may
   * plan against — still validating, degraded, or switched off. A 409 rather
   * than a 404: the retailer is real, the request is simply not answerable
   * right now, and the client should offer another supermarket.
   */
  static retailerNotActive(message: string, details?: unknown): ApiError {
    return new ApiError(409, "RETAILER_NOT_ACTIVE", message, details);
  }

  static storeNotFound(message: string, details?: unknown): ApiError {
    return new ApiError(404, "STORE_NOT_FOUND", message, details);
  }

  /**
   * The catalogue is real but older than the retailer's freshness policy, so
   * its prices can no longer be stood behind for a *new* plan. Plans already
   * generated stay readable; this only refuses to build another one.
   */
  static catalogueStale(message: string, details?: unknown): ApiError {
    return new ApiError(409, "CATALOGUE_STALE", message, details);
  }

  static planNotFound(message: string, details?: unknown): ApiError {
    return new ApiError(404, "PLAN_NOT_FOUND", message, details);
  }
}

interface BodyParserError extends Error {
  type?: string;
  status?: number;
}

/**
 * Express's JSON parser rejects oversized and malformed bodies before any route
 * runs, so those failures arrive here as raw parser errors and must be
 * translated into the shared shape.
 */
function fromUnknown(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const candidate = error as BodyParserError | undefined;

  if (candidate?.type === "entity.too.large") {
    return new ApiError(
      413,
      "PAYLOAD_TOO_LARGE",
      "The request body is larger than the 100kb limit.",
    );
  }

  if (candidate?.type === "entity.parse.failed") {
    return ApiError.badRequest("The request body is not valid JSON.");
  }

  return new ApiError(
    500,
    "INTERNAL_ERROR",
    "The server could not complete the request.",
  );
}

export function notFoundHandler(_request: Request, response: Response): void {
  response.status(404).json(ApiError.notFound("Route not found.").toBody());
}

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (response.headersSent) {
    next(error);
    return;
  }

  const apiError = fromUnknown(error);

  // Unexpected failures are the only ones worth a stack trace, and it stays
  // server-side. Everything else is an intentional, already-described outcome.
  if (apiError.status >= 500) {
    console.error(
      JSON.stringify({
        level: "error",
        requestId: response.locals.requestId,
        method: request.method,
        route: request.originalUrl,
        code: apiError.code,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
    );
  }

  response.status(apiError.status).json(apiError.toBody());
}

/** Express 5 forwards rejected promises, but only for handlers it knows are async. */
export function asyncHandler<T extends Request>(
  handler: (request: T, response: Response) => Promise<void>,
) {
  return (request: T, response: Response, next: NextFunction): void => {
    handler(request, response).catch(next);
  };
}
