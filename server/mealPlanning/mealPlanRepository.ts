/**
 * Saving and reopening anonymous plans.
 *
 * The repository owns two privacy decisions that the rest of the code should
 * not have to remember: anonymous ids are hashed before they are stored, and
 * plan ids are unguessable. Both would be easy to get wrong at a call site,
 * and neither is recoverable once a plan has been written the wrong way.
 */

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Types } from "mongoose";
import { MealPlan, type MealPlanRecord } from "../models/MealPlan";
import type { ResolvedCatalogueScope } from "../catalogue/core/retailerTypes";
import type { MealPlanRequest, MealPlanResponse } from "./mealPlanTypes";

/**
 * Plan ids are random, not sequential.
 *
 * A plan is readable by anyone holding its id, so a guessable id is a way to
 * read other people's weeks. 32 hex characters is far past enumeration.
 */
export function newPlanId(): string {
  return randomBytes(16).toString("hex");
}

/**
 * A stable, non-reversible identifier for one device.
 *
 * Correlating a person's own plans needs stability, not recoverability.
 * Storing the raw browser-generated id would leave a join key that could be
 * matched against anything else holding the same value.
 */
export function hashAnonymousId(anonymousId: string): string {
  return createHash("sha256").update(`thriftchef:${anonymousId}`).digest("hex");
}

export interface SavePlanInput {
  plan: MealPlanResponse;
  request: MealPlanRequest;
  scope: ResolvedCatalogueScope;
  engineVersion: string;
  anonymousId: string;
  retentionDays: number;
  now: Date;
}

export async function savePlan(input: SavePlanInput): Promise<void> {
  const expiresAt = new Date(
    input.now.getTime() + input.retentionDays * 24 * 60 * 60 * 1000,
  );

  await MealPlan.updateOne(
    { planId: input.plan.planId },
    {
      $set: {
        anonymousIdHash: hashAnonymousId(input.anonymousId),
        retailerId: new Types.ObjectId(input.scope.retailerId),
        storeId: new Types.ObjectId(input.scope.storeId),
        retailerSlug: input.scope.retailerSlug,
        storeSlug: input.scope.storeSlug,
        crawlRunId: input.plan.catalogue.crawlRunId,
        engineVersion: input.engineVersion,
        variationSeed: input.request.variationSeed,
        // Both snapshots, verbatim. The request so a regeneration can repeat
        // it; the response because that, not the live catalogue, is what the
        // user was shown and will shop from.
        requestSnapshot: input.request,
        responseSnapshot: input.plan,
        estimatedTotalMinor: input.plan.estimatedTotalPence,
        currency: input.plan.currency,
        createdAt: input.now,
        expiresAt,
      },
    },
    { upsert: true },
  );
}

export interface StoredPlan {
  plan: MealPlanResponse;
  request: MealPlanRequest;
  record: MealPlanRecord;
}

/**
 * Reopens a plan by id.
 *
 * Returns null for an unknown *or* expired plan. Distinguishing them would
 * confirm that a given id once existed, which is exactly the signal an
 * enumeration attempt is looking for.
 */
export async function findPlan(
  planId: string,
  now: Date = new Date(),
): Promise<StoredPlan | null> {
  const record = await MealPlan.findOne({ planId }).lean<MealPlanRecord>();

  // TTL removal is periodic rather than instant, so an expired plan can still
  // be present. The check here is what makes retention mean something.
  if (!record || record.expiresAt <= now) return null;

  return {
    plan: record.responseSnapshot as MealPlanResponse,
    request: record.requestSnapshot as MealPlanRequest,
    record,
  };
}

/** Plans belonging to one device, newest first. Never another device's. */
export async function findPlansForDevice(
  anonymousId: string,
  limit = 10,
): Promise<MealPlanRecord[]> {
  return MealPlan.find({ anonymousIdHash: hashAnonymousId(anonymousId) })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 50))
    .lean<MealPlanRecord[]>();
}

/** Used when a client supplies no anonymous id at all. */
export function ephemeralAnonymousId(): string {
  return randomUUID();
}
