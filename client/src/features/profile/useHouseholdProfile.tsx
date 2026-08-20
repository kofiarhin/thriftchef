import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import {
  clearProfile,
  createDefaultProfile,
  loadProfile,
  saveProfile,
  type HouseholdProfile,
} from "./profileStorage";

/**
 * The household profile, shared across the wizard and the results screens.
 *
 * A focused context rather than a global store: this is one small,
 * device-local object read by a handful of screens. Redux would add a
 * reducer, an action vocabulary and a provider to move the same fifteen
 * fields, and nothing here is shared widely enough to earn that.
 *
 * Server state does not live here — that is TanStack Query's job. This holds
 * only what the user told us about themselves.
 */
interface HouseholdProfileContextValue {
  profile: HouseholdProfile;
  /** Merges a partial update and persists it. */
  update: (changes: Partial<HouseholdProfile>) => void;
  reset: () => void;
  /** True once the user has chosen a supermarket, which gates the weekly flow. */
  hasCompletedSetup: boolean;
}

const HouseholdProfileContext = createContext<HouseholdProfileContextValue | null>(null);

export function HouseholdProfileProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  // Read once on mount. Re-reading per render would fight the in-memory copy
  // that keeps the app working when storage is unavailable.
  const [profile, setProfile] = useState<HouseholdProfile>(() => loadProfile());

  const update = useCallback((changes: Partial<HouseholdProfile>) => {
    setProfile((current) => saveProfile({ ...current, ...changes }));
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile(createDefaultProfile());
  }, []);

  const value = useMemo<HouseholdProfileContextValue>(
    () => ({
      profile,
      update,
      reset,
      hasCompletedSetup: profile.defaultRetailerId !== null,
    }),
    [profile, update, reset],
  );

  return (
    <HouseholdProfileContext.Provider value={value}>
      {children}
    </HouseholdProfileContext.Provider>
  );
}

export function useHouseholdProfile(): HouseholdProfileContextValue {
  const value = useContext(HouseholdProfileContext);

  if (!value) {
    throw new Error(
      "useHouseholdProfile must be used inside a HouseholdProfileProvider.",
    );
  }

  return value;
}
