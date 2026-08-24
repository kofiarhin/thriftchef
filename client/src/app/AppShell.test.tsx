import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "./AppRouter";
import { HouseholdProfileProvider } from "../features/profile/useHouseholdProfile";
import { PlanProvider } from "../features/weeklyPlan/usePlan";
import { CATALOGUE_STATUS, MEAL_PLAN } from "../testing/fixtures";

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

/** Every route the router confirms, with the heading that route owns. */
const ROUTES = [
  ["/", /a week of meals/i],
  ["/setup", /supermarket|household|allergies|equipment/i],
  ["/plan", /plan your week/i],
  ["/week", /no plan yet/i],
  ["/recipe/anything", /no plan open/i],
  ["/shopping", /no shopping list yet/i],
  ["/profile", /your settings/i],
] as const;

const generateCalls: unknown[] = [];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HouseholdProfileProvider>
        <PlanProvider>
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
        </PlanProvider>
      </HouseholdProfileProvider>
    </QueryClientProvider>,
  );
}

/** Basics and preferences lead to the final kitchen step. */
async function generatePlan(): Promise<void> {
  await userEvent.click(await screen.findByRole("radio", { name: /Aldi UK/ }));
  for (let step = 0; step < 2; step += 1) {
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
  }
  await userEvent.click(screen.getByRole("button", { name: /generate my plan/i }));
}

beforeEach(() => {
  window.localStorage.clear();
  generateCalls.length = 0;

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.includes("/api/retailers")) return json({ retailers: [ALDI, TESCO] });
      if (url.includes("/api/catalogue/status")) return json(CATALOGUE_STATUS);
      if (url.includes("/api/meal-plans/generate")) {
        generateCalls.push(JSON.parse(String(init?.body)));
        return json(MEAL_PLAN);
      }
      if (url.includes("/api/meal-plans/")) return json(MEAL_PLAN);

      throw new Error(`Unexpected request to ${url}`);
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the routed application shell", () => {
  it.each(ROUTES)("gives %s exactly one header, main and footer", async (path) => {
    renderAt(path);

    await waitFor(() => expect(screen.getAllByRole("banner")).toHaveLength(1));
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it.each(ROUTES)("gives %s a single top-level heading", async (path, heading) => {
    renderAt(path);

    await waitFor(() => {
      const headings = screen.getAllByRole("heading", { level: 1 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(heading);
    });
  });

  it("points primary navigation at routes rather than page anchors", async () => {
    renderAt("/week");

    const nav = await screen.findByRole("navigation", { name: /^primary$/i });
    const destinations = [
      [/^plan$/i, "/plan"],
      [/^my week$/i, "/week"],
      [/^shopping$/i, "/shopping"],
      [/^settings$/i, "/profile"],
    ] as const;

    for (const [label, href] of destinations) {
      expect(within(nav).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("moves between destinations without a full page load", async () => {
    renderAt("/week");

    const nav = await screen.findByRole("navigation", { name: /^primary$/i });
    await userEvent.click(within(nav).getByRole("link", { name: /^settings$/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /your settings/i }),
    ).toBeInTheDocument();
  });

  it("returns an unknown path to the welcome route", async () => {
    renderAt("/nowhere");

    expect(
      await screen.findByRole("heading", { level: 1, name: /a week of meals/i }),
    ).toBeInTheDocument();
  });

  it("keeps the shell chrome off printed output", async () => {
    renderAt("/week");

    await waitFor(() => expect(screen.getByRole("banner")).toHaveClass("print-hidden"));
    expect(screen.getByRole("contentinfo")).toHaveClass("print-hidden");
  });

  it("exposes the mobile navigation as a keyboard-operable disclosure", async () => {
    renderAt("/week");

    const toggle = await screen.findByRole("button", { name: /^menu$/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls");

    toggle.focus();
    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const mobileNav = screen.getByRole("navigation", { name: /primary, mobile/i });
    expect(within(mobileNav).getByRole("link", { name: /^shopping$/i })).toHaveAttribute(
      "href",
      "/shopping",
    );

    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile navigation once a destination is chosen", async () => {
    renderAt("/week");

    const toggle = await screen.findByRole("button", { name: /^menu$/i });
    await userEvent.click(toggle);

    const mobileNav = screen.getByRole("navigation", { name: /primary, mobile/i });
    await userEvent.click(within(mobileNav).getByRole("link", { name: /^settings$/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /your settings/i }),
    ).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("carries both disclaimers in the one shared footer", async () => {
    renderAt("/week");

    const footer = await screen.findByRole("contentinfo");
    expect(within(footer).getByText(/not affiliated/i)).toBeInTheDocument();
    expect(
      within(footer).getByText(/inferred from product wording/i),
    ).toBeInTheDocument();
    expect(
      within(footer).getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });
});

describe("opening the planner directly", () => {
  it("starts with the supermarket and the planning task", async () => {
    renderAt("/plan");

    expect(
      await screen.findByRole("heading", { level: 1, name: /plan your week/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("radio", { name: /Aldi UK/ }),
    ).toBeInTheDocument();
  });

  it("shows none of the landing page's marketing sections", async () => {
    renderAt("/plan");

    await screen.findByRole("heading", { level: 1, name: /plan your week/i });

    expect(
      screen.queryByRole("heading", { name: /how it works/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: /seven days of aldi meals/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /exit planner/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps catalogue readiness visible where the plan is generated", async () => {
    renderAt("/plan");

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    expect(await within(card).findByText(/^ready$/i)).toBeInTheDocument();
  });

  it("depends on no location hash to reach the planning controls", async () => {
    renderAt("/plan");

    await screen.findByRole("heading", { level: 1, name: /plan your week/i });

    const anchors = screen.getAllByRole("link");
    for (const anchor of anchors) {
      expect(anchor.getAttribute("href") ?? "").not.toMatch(/^#/);
    }
  });
});

describe("a generated plan across routes", () => {
  it("is shown on the week route without being generated again", async () => {
    renderAt("/plan");
    await generatePlan();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    const nav = screen.getByRole("navigation", { name: /^primary$/i });
    await userEvent.click(within(nav).getByRole("link", { name: /^my week$/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /your week/i }),
    ).toBeInTheDocument();
    expect(generateCalls).toHaveLength(1);
  });

  it("survives a move to the shopping route unchanged", async () => {
    renderAt("/plan");
    await generatePlan();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    const nav = screen.getByRole("navigation", { name: /^primary$/i });
    await userEvent.click(within(nav).getByRole("link", { name: /^shopping$/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /shopping list/i }),
    ).toBeInTheDocument();
    expect(generateCalls).toHaveLength(1);
  });
});
