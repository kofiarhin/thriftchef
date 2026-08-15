import { useId, type ReactNode } from "react";
import { labelForSlug } from "../format";

interface CheckboxGroupProps<T extends string> {
  legend: string;
  hint?: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  error?: string;
  /** Overrides the derived label for options whose slug reads badly. */
  labels?: Partial<Record<T, string>>;
}

/**
 * A fieldset with a real legend rather than a styled div, so screen readers
 * announce the group's purpose before each checkbox. Errors are linked with
 * `aria-describedby` and carry a text marker, never colour alone.
 */
export function CheckboxGroup<T extends string>({
  legend,
  hint,
  options,
  selected,
  onChange,
  error,
  labels,
}: CheckboxGroupProps<T>) {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const hintId = `${groupId}-hint`;

  const toggle = (option: T): void => {
    onChange(
      selected.includes(option)
        ? selected.filter((entry) => entry !== option)
        : [...selected, option],
    );
  };

  return (
    <fieldset
      aria-describedby={[hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-sm font-semibold text-ink">{legend}</legend>

      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                isSelected
                  ? "border-brand bg-brand-soft font-medium text-ink"
                  : "border-line bg-surface-raised text-ink-muted hover:border-ink-muted"
              }`}
            >
              <input
                type="checkbox"
                className="size-4 accent-brand"
                checked={isSelected}
                onChange={() => toggle(option)}
              />
              {labels?.[option] ?? labelForSlug(option)}
            </label>
          );
        })}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger-ink">
          Error: {error}
        </p>
      ) : null}
    </fieldset>
  );
}

interface TextFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "number";
  inputMode?: "numeric" | "decimal" | "text";
  min?: number;
  max?: number;
  step?: string;
  prefix?: ReactNode;
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  min,
  max,
  step,
  prefix,
}: TextFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
        {label}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div
        className={`mt-2 flex items-center rounded-md border bg-surface-raised ${
          error ? "border-danger-strong" : "border-line"
        }`}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-ink-muted" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          type={type}
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined}
          className="w-full bg-transparent px-3 py-2 text-sm text-ink outline-none"
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger-ink">
          Error: {error}
        </p>
      ) : null}
    </div>
  );
}
