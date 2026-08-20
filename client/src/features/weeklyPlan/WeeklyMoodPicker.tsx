import type { ReactElement } from "react";
import { WEEKLY_MOODS, resolveMoodSelection } from "./weeklyMood";

interface WeeklyMoodPickerProps {
  selected: string[];
  onChange: (moodIds: string[]) => void;
}

/**
 * This week's mood.
 *
 * Every chip states what it will actually do to the plan, and the summary
 * underneath names the preferences that will be sent. That honesty is the
 * point: a preference control the user cannot verify is one they stop
 * believing the first time the plan looks unchanged.
 */
export function WeeklyMoodPicker({
  selected,
  onChange,
}: WeeklyMoodPickerProps): ReactElement {
  const resolved = resolveMoodSelection(selected);
  const applied = [...resolved.mealPreferences, ...resolved.cuisinePreferences];

  function toggle(moodId: string): void {
    onChange(
      selected.includes(moodId)
        ? selected.filter((entry) => entry !== moodId)
        : [...selected, moodId],
    );
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">
        How does this week feel?
      </legend>
      <p className="mt-1 text-xs text-ink-muted">
        Optional, and just for this week — your saved settings are not changed.
      </p>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {WEEKLY_MOODS.map((mood) => {
          const isSelected = selected.includes(mood.id);

          return (
            <li key={mood.id}>
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-sm ${
                  isSelected
                    ? "border-brand bg-brand-surface"
                    : "border-line hover:border-brand"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(mood.id)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium text-ink">{mood.label}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {mood.description}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-ink-muted" data-testid="mood-summary">
        {applied.length === 0
          ? "No weekly mood chosen. The plan will use your saved preferences only."
          : `This week the planner will also prefer: ${applied.join(", ")}.`}
      </p>
    </fieldset>
  );
}
