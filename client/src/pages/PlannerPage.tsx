import type { ReactElement } from "react";
import { App } from "../App";
import { useHouseholdProfile } from "../features/profile/useHouseholdProfile";
import { usePlan } from "../features/weeklyPlan/usePlan";
import type { Allergen, Appliance, MealPreference, PantryBasic } from "../api/types";

/**
 * The planner, seeded from the saved household profile.
 *
 * The profile supplies defaults; it is not re-written by what happens here. A
 * user tightening this week's budget has not changed what they usually spend,
 * and quietly editing their saved settings would make the profile untrustworthy.
 */
export function PlannerPage(): ReactElement {
  const { profile } = useHouseholdProfile();
  const { setPlan } = usePlan();

  return (
    <App
      // Publishes each plan to the router's context, so the week, recipe and
      // shopping routes show the week the user just generated.
      onPlanChange={setPlan}
      defaults={{
        retailerId: profile.defaultRetailerId,
        storeId: profile.defaultStoreId,
        householdSize: String(profile.householdSize),
        cookingDays: profile.defaultCookingDays,
        maxTotalMinutes: profile.maxTotalMinutes,
        appliances: profile.appliances as Appliance[],
        allergies: profile.allergies as Allergen[],
        mealPreferences: profile.mealPreferences as MealPreference[],
        pantryBasics: profile.pantryBasics as PantryBasic[],
        ...(profile.defaultBudgetMinor
          ? { budgetPounds: String(Math.round(profile.defaultBudgetMinor / 100)) }
          : {}),
      }}
    />
  );
}
