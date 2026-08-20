import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMealPlan } from "../../api/mealPlans";
import type { MealPlanRequest, MealPlanResponse } from "../../api/types";
import {
  clearCurrentPlanId,
  loadCurrentPlanId,
  saveCurrentPlanId,
} from "./planStorage";

/** The seed is a signed 32-bit integer server-side, so it wraps rather than grows. */
const MAX_VARIATION_SEED = 2_147_483_647;

/**
 * The planner is deterministic, so repeating a request unchanged repeats the
 * week exactly. Asking for a different week means asking for a different seed
 * — that is what "Regenerate" is, and why it lives here rather than in a
 * component that might forget to advance it.
 */
export function withNextSeed(request: MealPlanRequest): MealPlanRequest {
  return {
    ...request,
    variationSeed:
      request.variationSeed >= MAX_VARIATION_SEED ? 0 : request.variationSeed + 1,
  };
}

interface PlanContextValue {
  plan: MealPlanResponse | null;
  /** The request that produced `plan`, kept so regeneration can repeat it. */
  request: MealPlanRequest | null;
  setPlan: (plan: MealPlanResponse, request: MealPlanRequest) => void;
  clear: () => void;
  /** True while a bookmarked plan is being fetched back after a refresh. */
  isRestoring: boolean;
  /** Set when the remembered plan could not be restored. */
  restoreError: unknown;
}

const PlanContext = createContext<PlanContextValue | null>(null);

/**
 * The plan the user is currently looking at.
 *
 * Held in memory during a session and re-fetched by id after a refresh, so a
 * bookmarked recipe URL opens the right week rather than an empty page. What
 * is deliberately *not* done is re-planning: the saved snapshot is served
 * back, because the catalogue moves and the basket must not move with it.
 */
export function PlanProvider({ children }: { children: ReactNode }): ReactElement {
  const [plan, setPlanState] = useState<MealPlanResponse | null>(null);
  const [request, setRequest] = useState<MealPlanRequest | null>(null);

  // Read once, on mount. A plan already in memory always wins: it is the one
  // the user just generated, and it may be newer than what was saved.
  const [rememberedPlanId] = useState(() => loadCurrentPlanId());

  const restored = useQuery({
    queryKey: ["meal-plan", rememberedPlanId],
    queryFn: () => fetchMealPlan(rememberedPlanId as string),
    enabled: rememberedPlanId !== null && plan === null,
    retry: false,
    staleTime: Infinity,
  });

  const setPlan = useCallback(
    (nextPlan: MealPlanResponse, nextRequest: MealPlanRequest) => {
      setPlanState(nextPlan);
      setRequest(nextRequest);
      saveCurrentPlanId(nextPlan.planId);
    },
    [],
  );

  const clear = useCallback(() => {
    setPlanState(null);
    setRequest(null);
    clearCurrentPlanId();
  }, []);

  const value = useMemo<PlanContextValue>(
    () => ({
      plan: plan ?? restored.data ?? null,
      // A restored plan carries no request: it was generated in an earlier
      // session. Regeneration needs the form again, and the UI says so rather
      // than pretending it can repeat a request it never saw.
      request,
      setPlan,
      clear,
      isRestoring: restored.isLoading,
      restoreError: restored.error,
    }),
    [plan, request, restored.data, restored.isLoading, restored.error, setPlan, clear],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const value = useContext(PlanContext);

  if (!value) throw new Error("usePlan must be used inside a PlanProvider.");

  return value;
}
