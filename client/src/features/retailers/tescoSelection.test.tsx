/**
 * What a shopper sees while Tesco is being integrated, and what they see when
 * it is finished.
 *
 * The retailer's lifecycle is a product decision expressed as one field, and
 * these pin down both halves of it: a Tesco in `development` is visible and
 * unselectable, and a Tesco that is `active` behaves like a real supermarket —
 * its scopes load, choosing one replaces any store from another shop, and the
 * choice reaches the plan request rather than being decided again in the UI.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { HouseholdProfileProvider } from "../profile/useHouseholdProfile";
import { loadProfile } from "../profile/profileStorage";

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

/**
 * Tesco as the bootstrap seeds it: `development`, so the API reports it
 * unselectable.
 */
const TESCO_IN_DEVELOPMENT = {
  id: "000000000000000000000e5c",
  slug: "tesco-uk",
  name: "Tesco UK",
  countryCode: "GB",
  currency: "GBP",
  logoUrl: null,
  catalogueScope: "store",
  selectable: false,
  requiresStoreSelection: true,
};

const TESCO_ACTIVE = { ...TESCO_IN_DEVELOPMENT, selectable: true };

const ALDI_STORES = {
  retailerId: ALDI.id,
  stores: [
    {
      id: "000000000000000000005702",
      externalStoreId: "belper-de56-1ar",
      name: "Aldi Belper",
      postcode: "DE56 1AR",
      scope: "physical",
      lastSuccessfulCrawlAt: null,
    },
  ],
};

const TESCO_STORES = {
  retailerId: TESCO_ACTIVE.id,
  stores: [
    {
      id: "000000000000000000005703",
      externalStoreId: "tesco-online-gb",
      name: "Tesco Online (delivery)",
      postcode: null,
      scope: "online",
      lastSuccessfulCrawlAt: "2026-08-21T06:00:00.000Z",
    },
    {
      id: "000000000000000000005704",
      externalStoreId: "tesco-online-north",
      name: "Tesco Online (north)",
      postcode: null,
      scope: "online",
      lastSuccessfulCrawlAt: null,
    },
  ],
};

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function mockRetailers(tesco: typeof TESCO_IN_DEVELOPMENT): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes(`${TESCO_ACTIVE.id}/stores`)) return json(TESCO_STORES);
      if (url.includes(`${ALDI.id}/stores`)) return json(ALDI_STORES);
      if (url.includes("/api/retailers")) return json({ retailers: [ALDI, tesco] });

      throw new Error(`Unexpected request to ${url}`);
    }),
  );
}

function renderOnboarding() {
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
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Tesco while it is still in development", () => {
  it("is shown but cannot be chosen", async () => {
    // Shown rather than hidden: a shopper looking for their usual supermarket
    // needs to know it exists and is not ready, not wonder whether they
    // misremembered which shops this works with.
    mockRetailers(TESCO_IN_DEVELOPMENT);
    renderOnboarding();

    const tesco = await screen.findByRole("radio", { name: /Tesco UK/ });

    expect(tesco).toBeInTheDocument();
    expect(tesco).toBeDisabled();
  });

  it("says why, rather than failing silently", async () => {
    mockRetailers(TESCO_IN_DEVELOPMENT);
    renderOnboarding();

    const label = (await screen.findByRole("radio", { name: /Tesco UK/ })).closest(
      "label",
    );

    expect(label).toHaveTextContent(/not available for planning/i);
  });

  it("never loads a catalogue nobody may plan from", async () => {
    mockRetailers(TESCO_IN_DEVELOPMENT);
    renderOnboarding();

    const tesco = await screen.findByRole("radio", { name: /Tesco UK/ });
    await userEvent.click(tesco).catch(() => undefined);

    expect(loadProfile().defaultRetailerId).not.toBe(TESCO_IN_DEVELOPMENT.id);
    expect(
      screen.queryByRole("radio", { name: /Tesco Online/ }),
    ).not.toBeInTheDocument();
  });
});

describe("Tesco once it is active", () => {
  it("loads its own scopes when it is chosen", async () => {
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));

    expect(
      await screen.findByRole("radio", { name: /Tesco Online \(delivery\)/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Tesco Online \(north\)/ }),
    ).toBeInTheDocument();
  });

  it("does not offer a Tesco scope as a named branch", async () => {
    // The label has to match what was verified. An online fulfilment
    // catalogue presented as a high-street branch is a claim about where the
    // prices came from that nobody checked.
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));
    const scope = await screen.findByRole("radio", { name: /Tesco Online \(delivery\)/ });

    expect(scope.closest("label")).toHaveTextContent(/online/i);
  });

  it("saves the chosen Tesco retailer and scope to the device", async () => {
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));
    await userEvent.click(
      await screen.findByRole("radio", { name: /Tesco Online \(delivery\)/ }),
    );

    await waitFor(() => {
      expect(loadProfile().defaultRetailerId).toBe(TESCO_ACTIVE.id);
      expect(loadProfile().defaultStoreId).toBe(TESCO_STORES.stores[0].id);
    });
  });

  it("clears an Aldi store when the shopper switches to Tesco", async () => {
    // A branch of one shop is not a branch of another. Carrying the store
    // across would price a Tesco plan against an Aldi store id.
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    await userEvent.click(await screen.findByRole("radio", { name: /Aldi UK/ }));
    await userEvent.click(await screen.findByRole("radio", { name: /Aldi Belper/ }));
    await waitFor(() => expect(loadProfile().defaultStoreId).toBeTruthy());

    await userEvent.click(screen.getByRole("radio", { name: /Tesco UK/ }));

    await waitFor(() => {
      expect(loadProfile().defaultStoreId).toBeNull();
      expect(loadProfile().defaultRetailerId).toBe(TESCO_ACTIVE.id);
    });
  });

  it("clears a Tesco scope when the shopper switches back to Aldi", async () => {
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    await userEvent.click(await screen.findByRole("radio", { name: /Tesco UK/ }));
    await userEvent.click(
      await screen.findByRole("radio", { name: /Tesco Online \(delivery\)/ }),
    );
    await waitFor(() => expect(loadProfile().defaultStoreId).toBeTruthy());

    await userEvent.click(screen.getByRole("radio", { name: /Aldi UK/ }));

    await waitFor(() => expect(loadProfile().defaultStoreId).toBeNull());
  });

  it("is choosable with the keyboard alone", async () => {
    mockRetailers(TESCO_ACTIVE);
    renderOnboarding();

    const tesco = await screen.findByRole("radio", { name: /Tesco UK/ });
    tesco.focus();
    await userEvent.keyboard(" ");

    await waitFor(() =>
      expect(loadProfile().defaultRetailerId).toBe(TESCO_ACTIVE.id),
    );
  });
});
