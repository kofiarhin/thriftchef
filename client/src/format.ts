const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPence(pence: number): string {
  return GBP.format(pence / 100);
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "no cooking";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

const DAY_NAMES = [
  "Day 1",
  "Day 2",
  "Day 3",
  "Day 4",
  "Day 5",
  "Day 6",
  "Day 7",
];

export function formatDay(day: number): string {
  return DAY_NAMES[day - 1] ?? `Day ${day}`;
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Turns a slug such as "air-fryer" into the label "Air fryer". */
export function labelForSlug(slug: string): string {
  return titleCase(slug.replace(/-/g, " "));
}
