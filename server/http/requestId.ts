import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Correlates the access log line with any error logged later in the same
 * request. Logs record the route and outcome only — never the request body,
 * which carries the user's household and dietary details.
 */
export function requestContext(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const requestId = randomUUID();
  response.locals.requestId = requestId;
  response.setHeader("x-request-id", requestId);

  const startedAt = process.hrtime.bigint();

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    console.log(
      JSON.stringify({
        level: "info",
        requestId,
        method: request.method,
        route: request.originalUrl,
        status: response.statusCode,
        durationMs: Math.round(durationMs),
        ...(response.locals.logContext as Record<string, unknown> | undefined),
      }),
    );
  });

  next();
}

/** Adds route-specific fields to the single access log line for this request. */
export function addLogContext(
  response: Response,
  fields: Record<string, unknown>,
): void {
  response.locals.logContext = {
    ...(response.locals.logContext as Record<string, unknown> | undefined),
    ...fields,
  };
}
