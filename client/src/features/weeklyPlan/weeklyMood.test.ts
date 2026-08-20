import { describe, expect, it } from "vitest";
import { MEAL_PREFERENCES } from "../../api/types";
import { WEEKLY_MOODS, applyMoods, resolveMoodSelection } from "./weeklyMood";

describe("weekly mood", () => {
  /**
   * The property this whole feature depends on. A mood chip that maps to
   * nothing the planner scores is a control that lies to the user: they say
   * they want a fast week, the plan comes back identical, and they learn their
   * input does not matter.
   */
  it("maps every mood to preferences the planner actually scores", () => {
    for (const mood of WEEKLY_MOODS) {
      const affectsSomething =
        mood.mealPreferences.length > 0 || mood.cuisinePreferences.length > 0;

      expect(affectsSomething, `${mood.id} changes nothing`).toBe(true);

      for (const preference of mood.mealPreferences) {
        expect(
          MEAL_PREFERENCES as readonly string[],
          `${mood.id} names an unknown preference`,
        ).toContain(preference);
      }
    }
  });

  it("gives every mood a distinct id", () => {
    const ids = WEEKLY_MOODS.map((mood) => mood.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a single mood to its preference", () => {
    expect(resolveMoodSelection(["in-a-rush"]).mealPreferences).toEqual(["quick"]);
  });

  it("unions two moods rather than letting the last one win", () => {
    const resolved = resolveMoodSelection(["in-a-rush", "use-it-up"]);

    expect(resolved.mealPreferences).toContain("quick");
    expect(resolved.mealPreferences).toContain("low-waste");
  });

  it("collapses a preference two moods both ask for", () => {
    const resolved = resolveMoodSelection(["cook-once", "use-it-up"]);

    expect(
      resolved.mealPreferences.filter((entry) => entry === "low-waste"),
    ).toHaveLength(1);
  });

  it("maps a cuisine mood to a cuisine preference", () => {
    expect(resolveMoodSelection(["comfort-italian"]).cuisinePreferences).toEqual([
      "italian",
    ]);
  });

  it("ignores an unknown mood id", () => {
    expect(resolveMoodSelection(["not-a-mood"])).toEqual({
      mealPreferences: [],
      cuisinePreferences: [],
    });
  });

  it("adds to the saved profile rather than replacing it", () => {
    const result = applyMoods(["vegetarian"], ["british"], ["in-a-rush"]);

    // "I fancy something fast" is not "I am no longer vegetarian".
    expect(result.mealPreferences).toContain("vegetarian");
    expect(result.mealPreferences).toContain("quick");
    expect(result.cuisinePreferences).toContain("british");
  });

  it("does not duplicate a preference the profile already holds", () => {
    const result = applyMoods(["quick"], [], ["in-a-rush"]);

    expect(result.mealPreferences).toEqual(["quick"]);
  });

  it("changes nothing when no mood is chosen", () => {
    const result = applyMoods(["vegetarian"], ["italian"], []);

    expect(result.mealPreferences).toEqual(["vegetarian"]);
    expect(result.cuisinePreferences).toEqual(["italian"]);
  });
});
