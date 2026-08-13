/**
 * Maps Aldi's category paths onto the handful of food groups a meal plan
 * reasons about. Selection ranking, AI context allocation and shopping-list
 * grouping all read from here so they cannot drift apart.
 */

export const FOOD_GROUPS = [
  "protein",
  "vegetable",
  "fruit",
  "staple",
  "dairy",
  "bakery",
  "sauce",
  "snack",
  "other",
] as const;

export type FoodGroup = (typeof FOOD_GROUPS)[number];

/**
 * Matched against the leaf category. Ordered most specific first: "Frozen
 * Vegetarian Food" must read as protein before "Vegetables & Sides" claims it
 * as a vegetable.
 */
const LEAF_PATTERNS: Array<[FoodGroup, RegExp]> = [
  [
    "protein",
    /poultry|beef|pork|gammon|bacon|sausage|lamb|fish|seafood|prawn|game|venison|meat|vegetarian|vegan|substitute|black pudding|haggis/i,
  ],
  ["dairy", /milk|dairy|egg|cheese|yogurt|yoghurt/i],
  ["bakery", /bread|roll|wrap|naan|pitta|thin|bagel|pastr|scone|teacake|crumpet/i],
  ["staple", /rice|pasta|noodle|chips|potato|tins|cans|packets|cereal|flour|baking|grain/i],
  ["vegetable", /vegetable|salad|stir fry/i],
  // Must precede "fruit": Aldi files nuts under "Seeds, Nuts & Dried Fruits",
  // which otherwise reads as fruit and puts peanuts in a fruit bowl.
  ["snack", /seeds|nuts/i],
  ["fruit", /fruit|smoothie/i],
  ["sauce", /sauce|oil|dressing|herb|spice|condiment|stock|jam|spread|syrup/i],
  ["snack", /crisp|snack|chocolate|sweet|biscuit|cracker|dessert|cake|ice cream|treat/i],
];

/** Used only when no leaf pattern matches — a coarse department-level guess. */
const DEPARTMENT_FALLBACK: Array<[FoodGroup, RegExp]> = [
  ["bakery", /^bakery$/i],
  ["staple", /^food cupboard$/i],
  ["protein", /vegetarian|plant based/i],
];

function scorePath(path: string[]): { group: FoodGroup; specific: boolean } {
  const leaf = path.at(-1) ?? "";

  for (const [group, pattern] of LEAF_PATTERNS) {
    if (pattern.test(leaf)) return { group, specific: true };
  }

  const department = path[0] ?? "";
  for (const [group, pattern] of DEPARTMENT_FALLBACK) {
    if (pattern.test(department)) return { group, specific: false };
  }

  return { group: "other", specific: false };
}

/**
 * A product merged across several categories carries every path it was seen
 * under, so the most specific match wins over a promotional placement.
 */
export function classifyFoodGroup(categoryPaths: string[][]): FoodGroup {
  let fallback: FoodGroup = "other";

  for (const path of categoryPaths) {
    if (path.length === 0) continue;

    const { group, specific } = scorePath(path);
    if (specific) return group;
    if (fallback === "other") fallback = group;
  }

  return fallback;
}

/**
 * Share of a capped selection each food group should get. Without an explicit
 * split, ranking alone hands the whole cap to whichever aisle is cheapest —
 * a week of tinned tomatoes ranks above any week containing meat.
 */
const GROUP_SHARE: Record<FoodGroup, number> = {
  protein: 0.24,
  staple: 0.2,
  vegetable: 0.2,
  dairy: 0.12,
  sauce: 0.1,
  bakery: 0.07,
  fruit: 0.05,
  snack: 0.02,
  other: 0,
};

const GROUP_ORDER: FoodGroup[] = [
  "protein",
  "staple",
  "vegetable",
  "dairy",
  "sauce",
  "bakery",
  "fruit",
  "snack",
  "other",
];

export interface AllocationOptions<T> {
  maxItems: number;
  groupOf: (item: T) => FoodGroup;
  /** Snacks are dead weight in a plan that did not ask for them. */
  includeSnacks: boolean;
}

/**
 * Trims a ranked list to `maxItems` while keeping every food group
 * represented. Input order is preserved inside each group, so the caller's
 * ranking still decides which items within a group survive.
 *
 * Quota a group cannot fill is handed to the others, so a catalogue thin on
 * vegetables still fills the cap rather than returning short.
 */
export function allocateAcrossFoodGroups<T>(
  items: T[],
  options: AllocationOptions<T>,
): T[] {
  const byGroup = new Map<FoodGroup, T[]>();

  for (const item of items) {
    const group = options.groupOf(item);
    if (group === "snack" && !options.includeSnacks) continue;

    const entries = byGroup.get(group) ?? [];
    entries.push(item);
    byGroup.set(group, entries);
  }

  const selected: T[] = [];
  const taken = new Map<FoodGroup, number>();

  for (const group of GROUP_ORDER) {
    const entries = byGroup.get(group) ?? [];
    const slice = entries.slice(0, Math.floor(options.maxItems * GROUP_SHARE[group]));

    selected.push(...slice);
    taken.set(group, slice.length);
  }

  for (const group of GROUP_ORDER) {
    if (selected.length >= options.maxItems) break;

    for (const item of (byGroup.get(group) ?? []).slice(taken.get(group) ?? 0)) {
      if (selected.length >= options.maxItems) break;
      selected.push(item);
    }
  }

  return selected.slice(0, options.maxItems);
}

/**
 * The heading a shopping-list item is filed under. The spec calls for the
 * first category segment, which is the Aldi department and matches how the
 * store is actually laid out.
 */
export function primaryCategory(categoryPaths: string[][]): string {
  for (const path of categoryPaths) {
    const department = path[0]?.trim();
    if (department) return department;
  }

  return "Other";
}
