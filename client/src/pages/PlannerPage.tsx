import { useEffect, useState, type ReactElement } from "react";
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
  const { setPlan, clear } = usePlan();
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const retailerId = retailer?.id ?? null;

  // Opening the planner is a fresh MVP session. Household preferences remain,
  // but an old generated week and supermarket choice never silently carry in.
  useEffect(() => clear(), [clear]);

  function chooseRetailer(nextRetailer: Retailer): void {
    setRetailer(nextRetailer);
    update({
      defaultRetailerId: nextRetailer.id,
      // Each MVP retailer has one configured catalogue. The server resolves it
      // after validating retailer ownership and active status.
      defaultStoreId: null,
    });
  }

  function startNewPlan(): void {
    clear();
    setRetailer(null);
  }

  return (
    <App
      focusedWizard
      onPlanChange={setPlan}
      onStartNewPlan={startNewPlan}
      retailerName={retailer?.name ?? null}
      retailerSelector={
        <RetailerPicker
          retailerId={retailerId}
          onRetailerChange={chooseRetailer}
        />
      }
      defaults={{
        retailerId,
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
