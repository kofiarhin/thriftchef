/**
 * Remembers which plan this device is currently looking at.
 *
 * Only the id. The plan itself is fetched back from the server, because the
 * server holds the snapshot it was generated from — and a second copy in local
 * storage would be one more thing that could disagree about what the shopping
 * list says.
 *
 * This is what makes a bookmarked recipe URL survive a refresh.
 */

const CURRENT_PLAN_KEY = "thriftchef.current-plan-id";

export function loadCurrentPlanId(): string | null {
  try {
    return window.localStorage.getItem(CURRENT_PLAN_KEY);
  } catch {
    // Storage can be switched off entirely. Losing the pointer means the user
    // re-plans; it must not mean the page fails to render.
    return null;
  }
}

export function saveCurrentPlanId(planId: string): void {
  try {
    window.localStorage.setItem(CURRENT_PLAN_KEY, planId);
  } catch {
    // As above.
  }
}

export function clearCurrentPlanId(): void {
  try {
    window.localStorage.removeItem(CURRENT_PLAN_KEY);
  } catch {
    // As above.
  }
}
