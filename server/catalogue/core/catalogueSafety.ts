/**
 * Deciding what a catalogue record can honestly claim about allergens.
 *
 * Shared by every retailer, deliberately. The temptation with a new adapter is
 * to let it decide its own products are safe because its pages "look fine";
 * this is the one judgement that must be made the same way for everyone, since
 * it is the judgement a user with an allergy relies on.
 *
 * The rule is conservative in one direction only: published label data can
 * make a product `verified`, but nothing an adapter does can promote an
 * inference to a fact.
 */

import type { CatalogueSafetyStatus } from "../../models/Product";
import {
  assessAllergens,
  type AllergenAssessmentInput,
} from "../allergenInference";

export interface SafetyVerdict {
  normalizedAllergens: string[];
  catalogueSafetyStatus: CatalogueSafetyStatus;
  eligibleForPlanning: boolean;
  safetyIssues: string[];
}

/**
 * The 14 allergens UK law requires to be declared, read out of published
 * label text.
 *
 * Only used when a retailer actually publishes ingredients *and* allergen
 * advice. Where it does not, the inference engine runs against product names
 * and descriptions instead, and the result is marked `inferred` so nothing
 * downstream can mistake it for a label.
 */
export function normalizeAllergens(
  ingredientsRaw: string | null,
  allergenAdviceRaw: string | null,
): string[] {
  const source =
    `${ingredientsRaw ?? ""} ${allergenAdviceRaw ?? ""}`.toLowerCase();

  const matchers: Array<[string, RegExp]> = [
    ["celery", /\bcelery\b/],
    ["gluten", /\b(gluten|wheat|barley|rye|oats?)\b/],
    ["crustaceans", /\b(crustaceans?|prawn|shrimp|crab|lobster)\b/],
    ["eggs", /\beggs?\b/],
    ["fish", /\bfish\b/],
    ["lupin", /\blupin\b/],
    ["milk", /\b(milk|dairy)\b/],
    ["molluscs", /\b(molluscs?|mussel|oyster|squid|octopus)\b/],
    ["mustard", /\bmustard\b/],
    ["peanuts", /\bpeanuts?\b/],
    ["sesame", /\bsesame\b/],
    ["soya", /\b(soya|soy)\b/],
    ["sulphites", /\b(sulphites?|sulfites?|sulphur dioxide|sulfur dioxide)\b/],
    [
      "tree nuts",
      /\b(almond|hazelnut|walnut|cashew|pecan|brazil nut|pistachio|macadamia|tree nuts?)\b/,
    ],
  ];

  return matchers
    .filter(([, pattern]) => pattern.test(source))
    .map(([name]) => name);
}

/**
 * Aldi publishes neither ingredients nor allergen advice, so in practice every
 * Aldi product takes the inferred branch. The retailer-data branch is kept
 * because it is the only trustworthy one: a retailer that does publish labels
 * yields `verified` products with no code change, and Aldi would upgrade
 * automatically if it ever started.
 */
export function evaluateCatalogueSafety(
  ingredientsRaw: string | null,
  allergenAdviceRaw: string | null,
  inferenceInput: AllergenAssessmentInput,
): SafetyVerdict {
  const combined =
    `${ingredientsRaw ?? ""} ${allergenAdviceRaw ?? ""}`.toLowerCase();

  if (ingredientsRaw && allergenAdviceRaw) {
    // A label that says "check the packaging" is not a label. Treating it as
    // one would turn an explicit refusal to answer into a claim of safety.
    const ambiguous =
      /information unavailable|not available|see packaging|check pack/i.test(
        combined,
      );

    return {
      normalizedAllergens: normalizeAllergens(ingredientsRaw, allergenAdviceRaw),
      catalogueSafetyStatus: ambiguous ? "ambiguous" : "verified",
      eligibleForPlanning: !ambiguous,
      safetyIssues: ambiguous ? ["AMBIGUOUS_SAFETY_DATA"] : [],
    };
  }

  const safetyIssues = ["NO_RETAILER_ALLERGEN_DATA", "ALLERGENS_INFERRED"];
  if (!ingredientsRaw) safetyIssues.push("MISSING_INGREDIENTS");

  return {
    normalizedAllergens: assessAllergens(inferenceInput).normalizedAllergens,
    catalogueSafetyStatus: "inferred",
    eligibleForPlanning: true,
    safetyIssues,
  };
}
