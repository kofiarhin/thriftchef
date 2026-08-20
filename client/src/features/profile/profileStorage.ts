/**
 * The anonymous household profile, kept on the device.
 *
 * No account, no email, no server record. The profile exists so a returning
 * user does not re-answer nine questions to plan a second week, and that is
 * the whole of its job.
 *
 * Every read is defensive. Local storage is shared with anything else on the
 * origin, can be edited by hand, can be full, and can be switched off
 * entirely — so a profile that will not parse is replaced by defaults rather
 * than allowed to break the app a user cannot otherwise recover.
 */

export const PROFILE_STORAGE_KEY = "thriftchef.household-profile";
export const PROFILE_VERSION = 1;

export interface HouseholdProfile {
  version: number;
  /**
   * A random identifier, generated once. Not derived from anything about the
   * device or the person: this correlates a user's own plans and nothing else,
   * and it must never become a fingerprint.
   */
  anonymousId: string;
  defaultRetailerId: string | null;
  defaultStoreId: string | null;
  householdSize: number;
  defaultBudgetMinor: number | null;
  defaultCookingDays: number[];
  maxTotalMinutes: number | null;
  mealPreferences: string[];
  cuisinePreferences: string[];
  appliances: string[];
  allergies: string[];
  dislikedIngredients: string[];
  pantryBasics: string[];
  updatedAt: string;
}

function randomAnonymousId(): string {
  // `randomUUID` is unavailable on insecure origins and in older browsers, so
  // the fallback is still random rather than derived from anything stable.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function createDefaultProfile(): HouseholdProfile {
  return {
    version: PROFILE_VERSION,
    anonymousId: randomAnonymousId(),
    defaultRetailerId: null,
    defaultStoreId: null,
    householdSize: 2,
    defaultBudgetMinor: null,
    defaultCookingDays: [1, 2, 3, 4, 5, 6, 7],
    maxTotalMinutes: null,
    mealPreferences: [],
    cuisinePreferences: [],
    appliances: ["hob", "oven"],
    allergies: [],
    dislikedIngredients: [],
    pantryBasics: [],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Storage that cannot throw.
 *
 * Private browsing modes and disabled-storage settings make every call to
 * `localStorage` a potential exception, including simply reading it. An
 * in-memory fallback keeps the session working — the user loses persistence
 * across a refresh, not the ability to plan.
 */
function safeStorage(): Storage | null {
  try {
    const probe = "__thriftchef_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

let memoryFallback: string | null = null;

function readRaw(): string | null {
  const storage = safeStorage();
  if (!storage) return memoryFallback;

  try {
    return storage.getItem(PROFILE_STORAGE_KEY);
  } catch {
    return memoryFallback;
  }
}

function writeRaw(value: string | null): void {
  memoryFallback = value;

  const storage = safeStorage();
  if (!storage) return;

  try {
    if (value === null) storage.removeItem(PROFILE_STORAGE_KEY);
    else storage.setItem(PROFILE_STORAGE_KEY, value);
  } catch {
    // A full quota is not a reason to lose the current session's profile;
    // the in-memory copy above still holds it.
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function numberArray(value: unknown, fallback: number[]): number[] {
  if (!Array.isArray(value)) return fallback;

  const days = value.filter(
    (entry): entry is number =>
      typeof entry === "number" && Number.isInteger(entry) && entry >= 1 && entry <= 7,
  );

  return days.length > 0 ? [...new Set(days)].sort((a, b) => a - b) : fallback;
}

/**
 * Migrates a stored profile forward.
 *
 * Field-by-field rather than wholesale: a profile written by an older build
 * legitimately lacks fields a newer one expects, and refusing the whole record
 * over one missing key would silently reset a household's settings.
 */
export function migrateProfile(stored: unknown): HouseholdProfile {
  const defaults = createDefaultProfile();

  if (typeof stored !== "object" || stored === null || Array.isArray(stored)) {
    return defaults;
  }

  const raw = stored as Record<string, unknown>;

  return {
    version: PROFILE_VERSION,
    anonymousId:
      typeof raw.anonymousId === "string" && raw.anonymousId.length > 0
        ? raw.anonymousId
        : defaults.anonymousId,
    defaultRetailerId:
      typeof raw.defaultRetailerId === "string" ? raw.defaultRetailerId : null,
    defaultStoreId: typeof raw.defaultStoreId === "string" ? raw.defaultStoreId : null,
    householdSize:
      typeof raw.householdSize === "number" &&
      Number.isInteger(raw.householdSize) &&
      raw.householdSize >= 1 &&
      raw.householdSize <= 10
        ? raw.householdSize
        : defaults.householdSize,
    defaultBudgetMinor:
      typeof raw.defaultBudgetMinor === "number" && raw.defaultBudgetMinor > 0
        ? Math.round(raw.defaultBudgetMinor)
        : null,
    defaultCookingDays: numberArray(raw.defaultCookingDays, defaults.defaultCookingDays),
    maxTotalMinutes:
      typeof raw.maxTotalMinutes === "number" && raw.maxTotalMinutes > 0
        ? Math.round(raw.maxTotalMinutes)
        : null,
    mealPreferences: isStringArray(raw.mealPreferences) ? raw.mealPreferences : [],
    cuisinePreferences: isStringArray(raw.cuisinePreferences)
      ? raw.cuisinePreferences
      : [],
    appliances: isStringArray(raw.appliances) ? raw.appliances : defaults.appliances,
    allergies: isStringArray(raw.allergies) ? raw.allergies : [],
    dislikedIngredients: isStringArray(raw.dislikedIngredients)
      ? raw.dislikedIngredients
      : [],
    pantryBasics: isStringArray(raw.pantryBasics) ? raw.pantryBasics : [],
    updatedAt:
      typeof raw.updatedAt === "string" ? raw.updatedAt : defaults.updatedAt,
  };
}

export function loadProfile(): HouseholdProfile {
  const raw = readRaw();
  if (raw === null) return createDefaultProfile();

  try {
    return migrateProfile(JSON.parse(raw));
  } catch {
    // Corrupt JSON is indistinguishable from no profile, and the user cannot
    // fix it. Defaults let them carry on.
    return createDefaultProfile();
  }
}

export function saveProfile(profile: HouseholdProfile): HouseholdProfile {
  const next: HouseholdProfile = {
    ...profile,
    version: PROFILE_VERSION,
    updatedAt: new Date().toISOString(),
  };

  writeRaw(JSON.stringify(next));
  return next;
}

/** Removes everything stored about this device. Offered in the UI, not hidden. */
export function clearProfile(): void {
  writeRaw(null);
}
