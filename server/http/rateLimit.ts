import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errors";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  /** Injectable so window expiry is testable without waiting. */
  now?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/** Bounds memory if a burst of distinct clients arrives. */
const MAX_TRACKED_CLIENTS = 10_000;

/**
 * A fixed-window, in-memory limiter for the AI generation route.
 *
 * In-memory is deliberate for the MVP: the API runs as a single instance and
 * this only needs to stop accidental double-submits and casual abuse. Running
 * more than one instance would need a shared store to be exact.
 */
export function createRateLimiter(options: RateLimitOptions) {
  const now = options.now ?? Date.now;
  const buckets = new Map<string, Bucket>();

  function prune(currentTime: number): void {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= currentTime) buckets.delete(key);
    }
  }

  return function rateLimit(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const currentTime = now();
    const key = request.ip ?? request.socket.remoteAddress ?? "unknown";

    if (buckets.size >= MAX_TRACKED_CLIENTS) prune(currentTime);

    const existing = buckets.get(key);
    const bucket =
      existing && existing.resetAt > currentTime
        ? existing
        : { count: 0, resetAt: currentTime + options.windowMs };

    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, options.max - bucket.count);
    response.setHeader("ratelimit-limit", String(options.max));
    response.setHeader("ratelimit-remaining", String(remaining));
    response.setHeader(
      "ratelimit-reset",
      String(Math.ceil((bucket.resetAt - currentTime) / 1000)),
    );

    if (bucket.count > options.max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((bucket.resetAt - currentTime) / 1000),
      );
      response.setHeader("retry-after", String(retryAfterSeconds));

      next(
        ApiError.rateLimited(
          `Too many meal plan requests. Try again in ${retryAfterSeconds} seconds.`,
          { retryAfterSeconds },
        ),
      );
      return;
    }

    next();
  };
}
