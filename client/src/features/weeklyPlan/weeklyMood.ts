/**
 * "How do you feel about cooking this week?", expressed as planner input.
 *
 * The rule this file exists to enforce: **every mood maps to something the
 * planner actually scores.** A mood chip that changed no field would be a
 * decoration that lies — the user tells us they want a quick week, the plan
 * comes back identical, and the control has quietly taught them their input
 * does not matter.
 *
 * So each option below resolves to real `mealPreferences` and
 * `cuisinePreferences` values, both of which the scorer reads
 * (`planScorer.preferenceMatch` and `.cuisineMatch`). Nothing here invents a
 * new planner concept.
 *
 * Moods are *this week only*. They supplement the saved household profile and
 * never rewrite it: wanting a fast week in August is not a change to how a
 * household usually cooks.
 */

import type { MealPreference } from "../../api/types";

export interface WeeklyMood {
  id: string;
  label: string;
  /** Shown to the user, and true: it says what the plan will actually do. */
  description: string;
  mealPreferences: MealPreference[];
  cuisinePreferences: string[];
}

/**
 * Each entry names only values the planner already understands.
 *
 * `MEAL_PREFERENCES` is the closed set the request schema validates against,
 * so a typo here fails the client typecheck rather than being silently dropped
 * by the server as an unknown preference.
 */
export const WEEKLY_MOODS: WeeklyMood[] = [
  {
    id: "in-a-rush",
    label: "In a rush",
    description: "Prefers faster recipes with fewer steps.",
    mealPreferences: ["quick"],
    cuisinePreferences: [],
  },
  {
    id: "feeding-everyone",
    label: "Feeding everyone",
    description: "Prefers crowd-pleasing meals that scale well.",
    mealPreferences: ["family-friendly"],
    cuisinePreferences: [],
  },
  {
    id: "cook-once",
    label: "Cook once, eat twice",
    description: "Prefers batch-friendly meals that reuse ingredients.",
    mealPreferences: ["batch-cook", "low-waste"],
    cuisinePreferences: [],
  },
  {
    id: "keep-it-light",
    label: "Keep it light",
    description: "Leans vegetarian and vegetable-forward.",
    mealPreferences: ["vegetarian"],
    cuisinePreferences: [],
  },
  {
    id: "protein-focus",
    label: "Protein focus",
    description: "Prefers higher-protein meals.",
    mealPreferences: ["high-protein"],
    cuisinePreferences: [],
  },
  {
    id: "use-it-up",
    label: "Waste nothing",
    description: "Prefers meals that share ingredients across the week.",
    mealPreferences: ["low-waste"],
    cuisinePreferences: [],
  },
  {
    id: "comfort-italian",
    label: "Italian comfort",
    description: "Leans towards Italian dishes.",
    mealPreferences: [],
    cuisinePreferences: ["italian"],
  },
  {
    id: "something-spiced",
    label: "Something spiced",
    description: "Leans towards Indian dishes.",
    mealPreferences: [],
    cuisinePreferences: ["indian"],
  },
];

export interface MoodSelection {
  mealPreferences: MealPreference[];
  cuisinePreferences: string[];
}

/**
 * Folds the chosen moods into planner preferences.
 *
 * Unioned rather than last-wins: "in a rush" and "waste nothing" are not in
 * conflict, and a user picking both means both. Duplicates are collapsed
 * because the scorer counts a preference once however many moods asked for it.
 */
export function resolveMoodSelection(moodIds: string[]): MoodSelection {
  const chosen = WEEKLY_MOODS.filter((mood) => moodIds.includes(mood.id));

  return {
    mealPreferences: [
      ...new Set(chosen.flatMap((mood) => mood.mealPreferences)),
    ],
    cuisinePreferences: [
      ...new Set(chosen.flatMap((mood) => mood.cuisinePreferences)),
    ],
  };
}

/**
 * This week's request preferences: the saved profile, plus the moods.
 *
 * Additive by design. A mood can add a preference for one week; it cannot
 * remove one the household has told us it always wants, because "I fancy
 * something fast" is not "I am no longer vegetarian".
 */
export function applyMoods(
  profilePreferences: MealPreference[],
  profileCuisines: string[],
  moodIds: string[],
): MoodSelection {
  const mood = resolveMoodSelection(moodIds);

  return {
    mealPreferences: [...new Set([...profilePreferences, ...mood.mealPreferences])],
    cuisinePreferences: [
      ...new Set([...profileCuisines, ...mood.cuisinePreferences]),
    ],
  };
}
