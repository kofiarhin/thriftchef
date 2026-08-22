import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { OnboardingPage } from "./OnboardingPage";
import { HouseholdProfileProvider } from "../features/profile/useHouseholdProfile";
import { loadProfile } from "../features/profile/profileStorage";

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

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HouseholdProfileProvider>
        <MemoryRouter initialEntries={["/setup"]}>
          <OnboardingPage />
        </MemoryRouter>
      </HouseholdProfileProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/stores")) throw new Error("The MVP must not request stores");
      if (url.includes("/api/retailers")) return json({ retailers: [ALDI, TESCO] });
      throw new Error(`Unexpected request to ${url}`);
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MVP supermarket setup", () => {
  it("asks for Aldi or Tesco first", async () => {
    renderPage();

    expect(await screen.findByRole("radio", { name: /Aldi UK/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Tesco UK/ })).toBeInTheDocument();
  });

  it("requires one supermarket", async () => {
    renderPage();
    await screen.findByRole("radio", { name: /Aldi UK/ });
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/choose a supermarket/i);
  });

  it.each([
    ["Aldi UK", ALDI.id],
    ["Tesco UK", TESCO.id],
  ])("saves %s without asking for a store", async (name, id) => {
    renderPage();

    await userEvent.click(
      await screen.findByRole("radio", { name: new RegExp(name) }),
    );

    await waitFor(() => expect(loadProfile().defaultRetailerId).toBe(id));
    expect(loadProfile().defaultStoreId).toBeNull();
    expect(screen.queryByText(/which .* store/i)).not.toBeInTheDocument();
  });
});
