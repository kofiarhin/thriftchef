import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OnboardingPage } from "./OnboardingPage";
import { HouseholdProfileProvider } from "../features/profile/useHouseholdProfile";
import { loadProfile } from "../features/profile/profileStorage";

const RETAILERS = {
  retailers: [
    {
      id: "000000000000000000000a1d",
      slug: "aldi-uk",
      name: "Aldi UK",
      countryCode: "GB",
      currency: "GBP",
      logoUrl: null,
      catalogueScope: "store",
      selectable: true,
      requiresStoreSelection: true,
    },
    {
      id: "000000000000000000000c3f",
      slug: "second-uk",
      name: "Second UK",
      countryCode: "GB",
      currency: "GBP",
      logoUrl: null,
      catalogueScope: "national",
      selectable: true,
      requiresStoreSelection: false,
    },
    {
      id: "000000000000000000000b2e",
      slug: "pending-uk",
      name: "Pending UK",
      countryCode: "GB",
      currency: "GBP",
      logoUrl: null,
      catalogueScope: "national",
      selectable: false,
      requiresStoreSelection: false,
    },
  ],
};

const STORES = {
  retailerId: "000000000000000000000a1d",
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

describe("first-time setup", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/stores")) return json(STORES);
        if (url.includes("/api/retailers")) return json(RETAILERS);
        return new Response("not found", { status: 404 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks for a supermarket first", async () => {
    renderPage();

    expect(
      await screen.findByRole("radio", { name: /Aldi UK/ }),
    ).toBeInTheDocument();
  });

  it("never asks for an account, an email or a payment method", async () => {
    renderPage();
    await screen.findByRole("radio", { name: /Aldi UK/ });

    const text = document.body.textContent ?? "";
    for (const forbidden of ["sign up", "sign in", "email", "card", "trial", "subscribe"]) {
      expect(text.toLowerCase()).not.toContain(forbidden);
    }
  });

  it("will not let an unavailable supermarket be chosen", async () => {
    renderPage();

    const pending = await screen.findByRole("radio", { name: /Pending UK/ });

    // Shown, not hidden: a shopper looking for their usual shop needs to know
    // it exists and is temporarily off.
    expect(pending).toBeDisabled();
  });

  it("refuses to continue until a supermarket is chosen", async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole("radio", { name: /Aldi UK/ });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /choose a supermarket/i,
    );
  });

  it("asks for a store once a store-scoped retailer is chosen", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("radio", { name: /Aldi UK/ }));

    expect(
      await screen.findByRole("radio", { name: /Aldi Belper/ }),
    ).toBeInTheDocument();
  });

  it("saves the chosen supermarket to the device", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("radio", { name: /Aldi UK/ }));

    await waitFor(() => {
      expect(loadProfile().defaultRetailerId).toBe("000000000000000000000a1d");
    });
  });

  it("clears the store when the supermarket changes", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("radio", { name: /Aldi UK/ }));
    await user.click(await screen.findByRole("radio", { name: /Aldi Belper/ }));
    await waitFor(() => expect(loadProfile().defaultStoreId).toBeTruthy());

    // A branch of one shop is not a branch of another, so switching
    // supermarket must invalidate the store rather than carry it across.
    await user.click(screen.getByRole("radio", { name: /Second UK/ }));
    await waitFor(() => expect(loadProfile().defaultStoreId).toBeNull());
    expect(loadProfile().defaultRetailerId).toBe("000000000000000000000c3f");
  });

  it("moves focus to the new step heading", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("radio", { name: /Aldi UK/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Household" })).toHaveFocus();
    });
  });

  it("shows the label-check warning beside the allergy controls", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("radio", { name: /Aldi UK/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const warning = await screen.findByRole("note");
    expect(warning).toHaveTextContent(/always check the packaging/i);
    expect(warning).toHaveTextContent(/inferred/i);
  });

  it("is completable with the keyboard alone", async () => {
    const user = userEvent.setup();
    renderPage();

    const aldi = await screen.findByRole("radio", { name: /Aldi UK/ });
    aldi.focus();
    await user.keyboard(" ");

    expect(loadProfile().defaultRetailerId).toBe("000000000000000000000a1d");
  });

  it("reports a failure to load supermarkets with a way to retry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load/i);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
