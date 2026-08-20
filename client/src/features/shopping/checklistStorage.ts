/**
 * Which shopping-list items have been ticked, per plan.
 *
 * Device-local and keyed by plan id, so a plan's progress survives a refresh
 * and two plans never share a checklist. Ticking an item records progress and
 * nothing else — it must never rewrite the plan's prices or quantities, which
 * are a historical snapshot of what the catalogue said when it was generated.
 */

const KEY_PREFIX = "thriftchef.shopping.";

function keyFor(planId: string): string {
  return `${KEY_PREFIX}${planId}`;
}

export function loadCheckedItems(planId: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(keyFor(planId));
    if (!raw) return new Set();

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();

    return new Set(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    // Unavailable or corrupt storage means "nothing ticked yet", which is a
    // usable state; throwing here would break the shopping screen entirely.
    return new Set();
  }
}

export function saveCheckedItems(planId: string, productIds: Set<string>): void {
  try {
    window.localStorage.setItem(keyFor(planId), JSON.stringify([...productIds]));
  } catch {
    // Losing progress is survivable; losing the screen is not.
  }
}

export function clearCheckedItems(planId: string): void {
  try {
    window.localStorage.removeItem(keyFor(planId));
  } catch {
    // As above.
  }
}
