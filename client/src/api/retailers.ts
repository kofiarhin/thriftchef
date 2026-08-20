import { apiRequest } from "./http";

export interface Retailer {
  id: string;
  slug: string;
  name: string;
  countryCode: string;
  currency: string;
  logoUrl: string | null;
  catalogueScope: string;
  /** Whether a plan may be generated against it right now. */
  selectable: boolean;
  requiresStoreSelection: boolean;
}

export interface RetailStore {
  id: string;
  externalStoreId: string;
  name: string;
  postcode: string | null;
  scope: string;
  lastSuccessfulCrawlAt: string | null;
}

export function fetchRetailers(countryCode = "GB"): Promise<{ retailers: Retailer[] }> {
  return apiRequest<{ retailers: Retailer[] }>(
    `/api/retailers?countryCode=${encodeURIComponent(countryCode)}`,
  );
}

export function fetchStores(
  retailerId: string,
): Promise<{ retailerId: string; stores: RetailStore[] }> {
  return apiRequest<{ retailerId: string; stores: RetailStore[] }>(
    `/api/retailers/${encodeURIComponent(retailerId)}/stores`,
  );
}
