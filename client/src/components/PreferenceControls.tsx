import { useId, type ReactNode } from "react";
import { labelForSlug } from "../format";
import { Icon, type IconName } from "./Icon";
import type { OptionMeta } from "./optionMeta";

interface CheckboxGroupProps<T extends string> {
  legend: string;
  hint?: string;
  options: readonly T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  error?: string;
  /** Overrides the derived label for options whose slug reads badly. */
  labels?: Partial<Record<T, string>>;
  /** Icon and one-line meaning per option, keyed by the option's own value. */
  meta?: Record<string, OptionMeta>;
  /** Denser grid for long lists such as the fourteen declarable allergens. */
  dense?: boolean;
  /** Extra detail that belongs with the group but not in its hint. */
  footnote?: ReactNode;
}

/**
 * A fieldset with a real legend rather than a styled div, so screen readers
 * announce the group's purpose before each checkbox. Errors are linked with
 * `aria-describedby` and carry a text marker, never colour alone.
 *
 * Each option is drawn as a card, but the control inside it is an ordinary
 * checkbox: the card is the label, so clicking anywhere on it toggles, focus
 * lands on a real input, and space still works. Selection is signalled three
 * ways at once — a tick, a border and `data-selected` — so it survives both
 * colour blindness and forced-colours mode.
 */
export function CheckboxGroup<T extends string>({
  legend,
  hint,
  options,
  selected,
  onChange,
  error,
  labels,
  meta,
  dense = false,
  footnote,
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
        <p id={hintId} className="mt-1 max-w-prose text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div
        className={`mt-3 grid gap-2.5 ${
          dense
            ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const entry = meta?.[option];

          return (
            <OptionCard
              key={option}
              label={labels?.[option] ?? labelForSlug(option)}
              description={dense ? undefined : entry?.description}
              icon={entry?.icon}
              selected={isSelected}
              onToggle={() => toggle(option)}
            />
          );
        })}
      </div>

      {footnote ? <div className="mt-3">{footnote}</div> : null}

      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-danger-ink">
          Error: {error}
        </p>
      ) : null}
    </fieldset>
  );
}

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: IconName;
  selected: boolean;
  onToggle: () => void;
}

function OptionCard({
  label,
  description,
  icon,
  selected,
  onToggle,
}: OptionCardProps) {
  return (
    <label
      data-selected={selected ? "true" : "false"}
      className="option-card group relative flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-raised p-3 transition duration-150 hover:border-ink-muted hover:bg-surface-sunken data-[selected=true]:border-brand data-[selected=true]:bg-brand-soft focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand"
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="sr-only"
      />

      {icon ? (
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 rounded-lg bg-surface-sunken p-1.5 text-ink-muted transition group-hover:text-ink group-data-[selected=true]:bg-brand/15 group-data-[selected=true]:text-brand"
        >
          <Icon name={icon} size={18} />
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-semibold text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
            {description}
          </span>
        ) : null}
      </span>

      <span
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-line text-on-brand transition group-data-[selected=true]:border-brand group-data-[selected=true]:bg-brand"
      >
        {selected ? (
          <span data-testid="option-check" className="flex">
            <Icon name="check" size={13} strokeWidth={2.6} />
          </span>
        ) : null}
      </span>
    </label>
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
  /** Drawn as a raised card with a large value: for the two headline numbers. */
  icon?: IconName;
  emphasis?: boolean;
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
  icon,
  emphasis = false,
}: TextFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div
      className={
        emphasis
          ? "rounded-2xl border border-line bg-surface-raised p-5 transition focus-within:border-brand"
          : undefined
      }
    >
      <div className="flex items-center gap-2">
        {icon ? (
          <span aria-hidden="true" className="text-brand">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-ink"
        >
          {label}
        </label>
      </div>

      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div
        className={`mt-3 flex items-center rounded-xl border bg-surface-sunken transition ${
          error ? "border-danger-strong" : "border-line focus-within:border-brand"
        }`}
      >
        {prefix ? (
          <span
            className={`pl-3 text-ink-muted ${emphasis ? "text-2xl" : "text-sm"}`}
            aria-hidden="true"
          >
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
          className={`w-full bg-transparent px-3 text-ink outline-none ${
            emphasis
              ? "py-2.5 text-2xl font-semibold tabular-nums"
              : "py-2 text-sm"
          }`}
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
