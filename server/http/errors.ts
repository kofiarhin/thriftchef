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
  "AI_TIMEOUT",
  "AI_INVALID_RESPONSE",
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

  static unprocessable(message: string, details?: unknown): ApiError {
    return new ApiError(422, "AI_INVALID_RESPONSE", message, details);
  }

  static rateLimited(message: string, details?: unknown): ApiError {
    return new ApiError(429, "RATE_LIMITED", message, details);
  }

  static catalogueUnavailable(message: string, details?: unknown): ApiError {
    return new ApiError(503, "CATALOGUE_UNAVAILABLE", message, details);
  }

  static gatewayTimeout(message: string): ApiError {
    return new ApiError(504, "AI_TIMEOUT", message);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, "NOT_FOUND", message);
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
