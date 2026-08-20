import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * The path, with the query string removed.
 *
 * `originalUrl` carries the query, and the query carries product searches and
 * postcodes: `/api/products?search=gluten%20free%20bread` puts a dietary
 * requirement into an access log. The route is what diagnostics need; the
 * values are not.
 */
export function safeRoute(originalUrl: string): string {
  const separator = originalUrl.indexOf("?");
  return separator === -1 ? originalUrl : originalUrl.slice(0, separator);
}

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
        route: safeRoute(request.originalUrl),
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
