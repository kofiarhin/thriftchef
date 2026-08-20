import { useQuery } from "@tanstack/react-query";
import { fetchRetailers, fetchStores } from "../../api/retailers";

/**
 * Retailer and store lookups.
 *
 * Kept out of the components that render them so a screen never owns a fetch,
 * and so the same data can back the onboarding cards, the weekly review and
 * the plan header without three copies of the request.
 */
export function useRetailers(countryCode = "GB") {
  return useQuery({
    queryKey: ["retailers", countryCode],
    queryFn: () => fetchRetailers(countryCode),
    select: (data) => data.retailers,
  });
}

export function useStores(retailerId: string | null) {
  return useQuery({
    queryKey: ["stores", retailerId],
    queryFn: () => fetchStores(retailerId as string),
    // A store list is meaningless without the retailer that owns it.
    enabled: retailerId !== null,
    select: (data) => data.stores,
  });
}
