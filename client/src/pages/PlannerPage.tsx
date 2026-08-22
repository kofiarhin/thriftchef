import type { ReactElement } from "react";
import { App } from "../App";
import type { Retailer } from "../api/retailers";
import type { Allergen, Appliance, MealPreference, PantryBasic } from "../api/types";
import { useHouseholdProfile } from "../features/profile/useHouseholdProfile";
import { RetailerPicker } from "../features/retailers/RetailerPicker";
import { usePlan } from "../features/weeklyPlan/usePlan";

/**
 * Household settings seed the planner, while the supermarket remains visible
 * and changeable for every new plan.
 */
export function PlannerPage(): ReactElement {
  const { profile, update } = useHouseholdProfile();
  const { setPlan } = usePlan();

  function chooseRetailer(retailer: Retailer): void {
    update({
      defaultRetailerId: retailer.id,
      // Each MVP retailer has one configured catalogue. The server resolves it
      // after validating retailer ownership and active status.
      defaultStoreId: null,
    });
  }

  return (
    <App
      key={profile.defaultRetailerId ?? "no-retailer"}
      onPlanChange={setPlan}
      retailerSelector={
        <RetailerPicker
          retailerId={profile.defaultRetailerId}
          onRetailerChange={chooseRetailer}
        />
      }
      defaults={{
        retailerId: profile.defaultRetailerId,
        // Store selection is deliberately absent from the MVP.
        storeId: null,
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
