import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlannerPage } from "../../pages/PlannerPage";
import { HouseholdProfileProvider } from "../profile/useHouseholdProfile";
import { loadProfile } from "../profile/profileStorage";
import { PlanProvider } from "../weeklyPlan/usePlan";
import { CATALOGUE_STATUS } from "../../testing/fixtures";

const ALDI = {
  id: "000000000000000000000a1d",
  slug: "aldi-uk",
  name: "Aldi UK",
  countryCode: "GB",
  currency: "GBP",
  logoUrl: null,
  catalogueScope: "store",
  selectable: true,
  requiresStoreSelection: true,
};

const TESCO = {
  id: "000000000000000000000e5c",
  slug: "tesco-uk",
  name: "Tesco UK",
  countryCode: "GB",
  currency: "GBP",
  logoUrl: null,
  catalogueScope: "national",
  selectable: true,
  requiresStoreSelection: false,
};

const requestedUrls: string[] = [];

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function renderPlanner() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HouseholdProfileProvider>
        <PlanProvider>
          <PlannerPage />
        </PlanProvider>
      </HouseholdProfileProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  requestedUrls.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url.includes("/stores")) throw new Error("The MVP must not request stores");
      if (url.includes("/api/retailers")) return json({ retailers: [ALDI, TESCO] });
      if (url.includes("/api/catalogue/status")) return json(CATALOGUE_STATUS);
      throw new Error(`Unexpected request to ${url}`);
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("planner supermarket choice", () => {
  it("shows Aldi and Tesco before the constraints", async () => {
    renderPlanner();

    expect(await screen.findByRole("radio", { name: /Aldi UK/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Tesco UK/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /plan your week/i })).toBeInTheDocument();
  });

  it("remembers Tesco without opening a store flow", async () => {
    renderPlanner();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));

    await waitFor(() => {
      expect(loadProfile().defaultRetailerId).toBe(TESCO.id);
      expect(screen.getByRole("radio", { name: /Tesco UK/ })).toBeChecked();
    });

    expect(loadProfile().defaultStoreId).toBeNull();
    expect(requestedUrls.some((url) => url.includes("/stores"))).toBe(false);
  });

  it("switches directly from Tesco to Aldi", async () => {
    renderPlanner();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));
    await userEvent.click(await screen.findByRole("radio", { name: /Aldi UK/ }));

    await waitFor(() => expect(loadProfile().defaultRetailerId).toBe(ALDI.id));
    expect(loadProfile().defaultStoreId).toBeNull();
  });
});
