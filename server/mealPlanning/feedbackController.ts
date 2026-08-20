/**
 * Optional end-of-week feedback.
 *
 * Two rules shape everything here. It must never block or delay generation —
 * a user who declines to rate their week loses nothing. And it must never
 * become a channel for personal data: the payload is a rating and a closed set
 * of tags, and there is no free-text field to fill in.
 */

import type { Request, Response } from "express";
import type { AppConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { addLogContext } from "../http/requestId";
import {
  FEEDBACK_ISSUES,
  FEEDBACK_RATINGS,
  PlanFeedback,
  type FeedbackIssue,
  type FeedbackRating,
} from "../models/PlanFeedback";
import { findPlan } from "./mealPlanRepository";

export interface FeedbackDependencies {
  loadPlanScope: (
    planId: string,
  ) => Promise<{ retailerSlug: string; storeSlug: string } | null>;
  record: (input: {
    planId: string;
    retailerSlug: string;
    storeSlug: string;
    rating: FeedbackRating;
    issues: FeedbackIssue[];
  }) => Promise<void>;
}

export function defaultFeedbackDependencies(
  config: AppConfig,
): FeedbackDependencies {
  return {
    loadPlanScope: async (planId) => {
      const stored = await findPlan(planId);
      if (!stored) return null;

      return {
        retailerSlug: stored.record.retailerSlug,
        storeSlug: stored.record.storeSlug,
      };
    },
    record: async (input) => {
      const now = new Date();

      await PlanFeedback.updateOne(
        { planId: input.planId },
        {
          $set: {
            retailerSlug: input.retailerSlug,
            storeSlug: input.storeSlug,
            rating: input.rating,
            issues: input.issues,
            createdAt: now,
            // Feedback expires with the plan it is about. Keeping it longer
            // would outlive the thing that gives it meaning.
            expiresAt: new Date(
              now.getTime() + config.planRetentionDays * 24 * 60 * 60 * 1000,
            ),
          },
        },
        { upsert: true },
      );
    },
  };
}

export function createFeedbackHandler(
  _config: AppConfig,
  dependencies: FeedbackDependencies,
) {
  return async (request: Request, response: Response): Promise<void> => {
    const body = request.body as Record<string, unknown> | undefined;

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw ApiError.badRequest(
        "The feedback request must be a JSON object.",
        [{ field: "body", message: "Send a rating and optional issue tags." }],
        "INVALID_REQUEST",
      );
    }

    const planId = request.params.planId;
    if (typeof planId !== "string" || !/^[a-f0-9]{32}$/.test(planId)) {
      throw ApiError.badRequest(
        "That is not a plan we recognise.",
        [{ field: "planId", message: "The plan id is not valid." }],
        "INVALID_REQUEST",
      );
    }

    const rating = body.rating;
    if (
      typeof rating !== "string" ||
      !(FEEDBACK_RATINGS as readonly string[]).includes(rating)
    ) {
      throw ApiError.badRequest(
        "The feedback rating is not valid.",
        [
          {
            field: "rating",
            message: `rating must be one of: ${FEEDBACK_RATINGS.join(", ")}.`,
          },
        ],
        "INVALID_REQUEST",
      );
    }

    // Unknown tags are rejected rather than dropped: silently discarding them
    // would hide a client/server drift until the data was already useless.
    const rawIssues = body.issues === undefined ? [] : body.issues;
    if (!Array.isArray(rawIssues) || rawIssues.length > FEEDBACK_ISSUES.length) {
      throw ApiError.badRequest(
        "The feedback issues are not valid.",
        [{ field: "issues", message: "issues must be a short array of tags." }],
        "INVALID_REQUEST",
      );
    }

    const issues: FeedbackIssue[] = [];
    for (const entry of rawIssues) {
      if (
        typeof entry !== "string" ||
        !(FEEDBACK_ISSUES as readonly string[]).includes(entry)
      ) {
        throw ApiError.badRequest(
          "The feedback issues are not valid.",
          [
            {
              field: "issues",
              message: `issues may only contain: ${FEEDBACK_ISSUES.join(", ")}.`,
            },
          ],
          "INVALID_REQUEST",
        );
      }

      if (!issues.includes(entry as FeedbackIssue)) issues.push(entry as FeedbackIssue);
    }

    const scope = await dependencies.loadPlanScope(planId);
    if (!scope) {
      throw ApiError.planNotFound(
        "That plan is no longer available, so feedback cannot be recorded.",
      );
    }

    await dependencies.record({
      planId,
      ...scope,
      rating: rating as FeedbackRating,
      issues,
    });

    addLogContext(response, {
      retailer: scope.retailerSlug,
      storeId: scope.storeSlug,
      operation: "plan-feedback",
      rating,
      issueCount: issues.length,
    });

    response.status(204).end();
  };
}
