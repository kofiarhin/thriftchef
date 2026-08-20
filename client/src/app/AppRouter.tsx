import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo,
  type ReactElement,
} from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { HouseholdProfileProvider } from "../features/profile/useHouseholdProfile";
import { HomePage } from "../pages/HomePage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { PlannerPage } from "../pages/PlannerPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RecipePage } from "../pages/RecipePage";
import { ShoppingPage } from "../pages/ShoppingPage";
import { WelcomePage } from "../pages/WelcomePage";
import { PlanProvider } from "../features/weeklyPlan/usePlan";
import { createQueryClient } from "./queryClient";

/**
 * The application shell.
 *
 * Routes rather than a single stateful page: the plan, the recipes and the
 * shopping list are separate destinations a user moves between and links to,
 * and expressing that as component state made `App.tsx` the owner of every
 * screen at once.
 *
 * Nothing here fetches. Providers supply the query client, the device-local
 * profile and the current plan; the pages ask for what they need.
 */
export function AppRouter(): ReactElement {
  // One client for the app's lifetime. Recreating it per render would discard
  // every cache entry on any state change.
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <HouseholdProfileProvider>
        <PlanProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/setup" element={<OnboardingPage />} />
              <Route path="/plan" element={<PlannerPage />} />
              <Route path="/week" element={<HomePage />} />
              <Route path="/recipe/:recipeId" element={<RecipePage />} />
              <Route path="/shopping" element={<ShoppingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* An unknown path is a mistyped link, not an error state. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </PlanProvider>
      </HouseholdProfileProvider>
    </QueryClientProvider>
  );
}
