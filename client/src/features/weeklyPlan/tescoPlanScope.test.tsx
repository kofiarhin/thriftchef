/**
 * The Tesco scope a shopper chose has to reach every request that prices their
 * week — generation, regeneration and replacement alike.
 *
 * The server resolves and enforces the scope, so these are not the safety
 * boundary. They are the guard against the quieter failure: a client that
 * stops sending the scope at all, at which point every request silently falls
 * back to the default retailer and the shopper's chosen supermarket is
 * ignored without anything looking broken.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../../App";
import { renderWithProviders } from "../../testing/renderApp";
import { CATALOGUE_STATUS, MEAL_PLAN, PRODUCT_SEARCH_PAGE } from "../../testing/fixtures";

const TESCO_RETAILER_ID = "000000000000000000000e5c";
const TESCO_STORE_ID = "000000000000000000005703";

/** A plan priced from Tesco, as the server would return it. */
const TESCO_PLAN = {
  ...MEAL_PLAN,
  catalogue: {
    retailerId: TESCO_RETAILER_ID,
    retailerSlug: "tesco-uk",
    retailerName: "Tesco UK",
    storeId: TESCO_STORE_ID,
    storeSlug: "tesco-online-gb",
    storeName: "Tesco Online (delivery)",
    crawlRunId: "tesco-fixture-run",
    catalogueUpdatedAt: "2026-08-21T06:00:00.000Z",
  },
};

const generateCalls: Array<Record<string, unknown>> = [];
const replaceCalls: Array<Record<string, unknown>> = [];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockApi(catalogue: unknown = CATALOGUE_STATUS): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.includes("/api/catalogue/status")) return json(catalogue);
      if (url.includes("/api/products")) return json(PRODUCT_SEARCH_PAGE);

      if (url.includes("/api/meal-plans/generate")) {
        generateCalls.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
        return json(TESCO_PLAN);
      }

      if (url.includes("/api/meal-plans/replace")) {
        replaceCalls.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
        return json(TESCO_PLAN);
      }

      throw new Error(`Unexpected request to ${url}`);
    }),
  );
}

/** The planner seeded from a saved profile that chose Tesco. */
function renderTescoPlanner() {
  return renderWithProviders(
    <App defaults={{ retailerId: TESCO_RETAILER_ID, storeId: TESCO_STORE_ID }} />,
  );
}

async function submitForm(): Promise<void> {
  for (let step = 0; step < 2; step += 1) {
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
  }
  await userEvent.click(screen.getByRole("button", { name: /generate my plan/i }));
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
  generateCalls.length = 0;
  replaceCalls.length = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a Tesco shopper's plan requests", () => {
  it("names the Tesco retailer and scope when generating", async () => {
    mockApi();
    renderTescoPlanner();
    await submitForm();

    await waitFor(() => expect(generateCalls).toHaveLength(1));
    expect(generateCalls[0]).toMatchObject({
      retailerId: TESCO_RETAILER_ID,
      storeId: TESCO_STORE_ID,
    });
  });

  it("keeps the scope when the week is regenerated", async () => {
    mockApi();
    renderTescoPlanner();
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByRole("button", { name: /regenerate week/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm regenerate/i }));

    await waitFor(() => expect(generateCalls).toHaveLength(2));

    // Only the seed may differ: the shopper asked for a different week, not a
    // different supermarket.
    expect(generateCalls[1]).toMatchObject({
      retailerId: TESCO_RETAILER_ID,
      storeId: TESCO_STORE_ID,
    });
    expect(generateCalls[1].variationSeed).toBe(
      (generateCalls[0].variationSeed as number) + 1,
    );
  });

  it("keeps the scope when one meal is replaced", async () => {
    mockApi();
    renderTescoPlanner();
    await submitForm();
    await screen.findByRole("heading", { name: /your week is sorted/i });

    await userEvent.click(screen.getByRole("tab", { name: /^recipes$/i }));
    await userEvent.click(screen.getByRole("button", { name: /replace this meal/i }));

    await waitFor(() => expect(replaceCalls).toHaveLength(1));

    const { request } = replaceCalls[0] as { request: Record<string, unknown> };
    expect(request).toMatchObject({
      retailerId: TESCO_RETAILER_ID,
      storeId: TESCO_STORE_ID,
    });
  });

  it("shows the week it was given without repricing it", async () => {
    mockApi();
    renderTescoPlanner();
    await submitForm();

    // The plan the server priced is what the shopper takes to the shop; the
    // client never recomputes a total from its own copy of anything.
    await screen.findByRole("heading", { name: /your week is sorted/i });
    expect(screen.getAllByText(/£64.20/).length).toBeGreaterThan(0);
  });
});

describe("a Tesco catalogue that is not ready", () => {
  const TESCO_STATUS = {
    ...CATALOGUE_STATUS,
    retailer: "tesco-uk",
    retailerName: "Tesco UK",
    storeId: TESCO_STORE_ID,
    storeSlug: "tesco-online-gb",
    storeName: "Tesco Online (delivery)",
  };

  it("names Tesco rather than the retailer the app started with", async () => {
    // A Tesco shopper reading "Aldi catalogue" is being told their prices came
    // from a supermarket they did not choose.
    mockApi(TESCO_STATUS);
    renderTescoPlanner();

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    await waitFor(() => expect(card).toHaveTextContent(/Tesco UK catalogue/i));

    expect(card).not.toHaveTextContent(/Aldi/i);
  });

  it("names the fulfilment scope, not an id or a branch it is not", async () => {
    mockApi(TESCO_STATUS);
    renderTescoPlanner();

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    await waitFor(() => expect(card).toHaveTextContent(/Tesco Online \(delivery\)/));

    expect(card).not.toHaveTextContent(TESCO_STORE_ID);
  });

  it("tells the shopper when the Tesco catalogue has gone stale", async () => {
    mockApi({
      ...TESCO_STATUS,
      isStale: true,
      lastCheckedAt: "2026-08-01T00:00:00.000Z",
    });

    renderTescoPlanner();

    // Stale is said out loud rather than hidden: prices a fortnight old are
    // still usable, but the shopper is the one who decides that.
    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    await waitFor(() => expect(card).toHaveTextContent(/more than three days old/i));
  });

  it("says how to fill an empty Tesco catalogue", async () => {
    mockApi({
      ...TESCO_STATUS,
      availableProducts: 0,
      eligibleProducts: 0,
      isStale: true,
      lastCheckedAt: null,
    });

    renderTescoPlanner();

    expect(
      await screen.findByText(/no products are available yet/i),
    ).toBeInTheDocument();
    expect(screen.getByText("npm run tesco:crawl")).toBeInTheDocument();
  });
});
