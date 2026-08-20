import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PROFILE_STORAGE_KEY,
  PROFILE_VERSION,
  clearProfile,
  createDefaultProfile,
  loadProfile,
  migrateProfile,
  saveProfile,
} from "./profileStorage";

describe("household profile storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts from defaults when nothing is stored", () => {
    const profile = loadProfile();

    expect(profile.version).toBe(PROFILE_VERSION);
    expect(profile.householdSize).toBe(2);
    expect(profile.defaultCookingDays).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(profile.anonymousId).toBeTruthy();
  });

  it("round-trips a saved profile", () => {
    const saved = saveProfile({
      ...createDefaultProfile(),
      householdSize: 4,
      defaultRetailerId: "aldi-uk",
      defaultCookingDays: [1, 3, 5],
      allergies: ["milk"],
    });

    const loaded = loadProfile();

    expect(loaded.householdSize).toBe(4);
    expect(loaded.defaultRetailerId).toBe("aldi-uk");
    expect(loaded.defaultCookingDays).toEqual([1, 3, 5]);
    expect(loaded.allergies).toEqual(["milk"]);
    expect(loaded.anonymousId).toBe(saved.anonymousId);
  });

  it("survives a refresh with the same anonymous id", () => {
    const first = saveProfile({ ...createDefaultProfile(), householdSize: 5 });

    // A reload is exactly this: a fresh read of the same storage.
    const afterReload = loadProfile();

    expect(afterReload.anonymousId).toBe(first.anonymousId);
    expect(afterReload.householdSize).toBe(5);
  });

  it("falls back to defaults for unparseable JSON", () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, "{not json");

    expect(loadProfile().householdSize).toBe(2);
  });

  it("falls back to defaults when the stored value is not an object", () => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, '"a string"');

    expect(loadProfile().householdSize).toBe(2);
  });

  it("keeps the fields an older profile did have", () => {
    // A version-0 profile: correct household size, none of the newer fields.
    const migrated = migrateProfile({
      version: 0,
      anonymousId: "kept-id",
      householdSize: 6,
    });

    expect(migrated.version).toBe(PROFILE_VERSION);
    expect(migrated.anonymousId).toBe("kept-id");
    expect(migrated.householdSize).toBe(6);
    expect(migrated.defaultCookingDays).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(migrated.allergies).toEqual([]);
  });

  it("discards values outside their supported range", () => {
    const migrated = migrateProfile({
      anonymousId: "x",
      householdSize: 99,
      defaultCookingDays: [0, 8, 3],
      defaultBudgetMinor: -50,
    });

    expect(migrated.householdSize).toBe(2);
    expect(migrated.defaultCookingDays).toEqual([3]);
    expect(migrated.defaultBudgetMinor).toBeNull();
  });

  it("de-duplicates and sorts stored cooking days", () => {
    expect(migrateProfile({ defaultCookingDays: [5, 1, 5] }).defaultCookingDays).toEqual([
      1, 5,
    ]);
  });

  it("keeps working when local storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    // Private browsing must degrade to a working session, not a broken app.
    const saved = saveProfile({ ...createDefaultProfile(), householdSize: 3 });
    expect(saved.householdSize).toBe(3);
    expect(() => loadProfile()).not.toThrow();
  });

  it("clears everything stored about the device", () => {
    saveProfile({ ...createDefaultProfile(), householdSize: 7 });
    clearProfile();

    expect(window.localStorage.getItem(PROFILE_STORAGE_KEY)).toBeNull();
    expect(loadProfile().householdSize).toBe(2);
  });

  it("gives each device a distinct anonymous id", () => {
    const first = createDefaultProfile().anonymousId;
    const second = createDefaultProfile().anonymousId;

    expect(first).not.toBe(second);
  });

  it("does not record anything identifying", () => {
    const profile = createDefaultProfile();

    // The profile is a planning convenience, not a user record. If a field
    // that could identify a person ever appears here, it needs a decision,
    // not a default.
    for (const key of ["email", "name", "userId", "fingerprint", "ip"]) {
      expect(profile).not.toHaveProperty(key);
    }
  });
});
