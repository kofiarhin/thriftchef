import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { renderWithProviders } from "./testing/renderApp";
import {
  CATALOGUE_STATUS,
  LARGE_PRODUCT_SEARCH_PAGE,
  MEAL_PLAN,
  PRODUCT_SEARCH_PAGE,
} from "./testing/fixtures";

interface RouteHandlers {
  catalogue?: () => Response | Promise<Response>;
  products?: (url: string) => Response | Promise<Response>;
  generate?: (body: unknown) => Response | Promise<Response>;
  replace?: (body: unknown) => Response | Promise<Response>;
}

const generateCalls: unknown[] = [];
const replaceCalls: unknown[] = [];
const productSearchCalls: string[] = [];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockApi(handlers: RouteHandlers = {}): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.includes("/api/catalogue/status")) {
        return handlers.catalogue?.() ?? json(CATALOGUE_STATUS);
      }

      if (url.includes("/api/products")) {
        productSearchCalls.push(url);
        return handlers.products?.(url) ?? json(PRODUCT_SEARCH_PAGE);
      }

      if (url.includes("/api/meal-plans/generate")) {
        const body = JSON.parse(String(init?.body)) as unknown;
        generateCalls.push(body);
        return handlers.generate?.(body) ?? json(MEAL_PLAN);
      }

      if (url.includes("/api/meal-plans/replace")) {
        const body = JSON.parse(String(init?.body)) as unknown;
        replaceCalls.push(body);
        return handlers.replace?.(body) ?? json(MEAL_PLAN);
      }

      throw new Error(`Unexpected request to ${url}`);
    }),
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  generateCalls.length = 0;
  replaceCalls.length = 0;
  productSearchCalls.length = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Basics and preferences lead to the final kitchen step. */
async function submitForm(): Promise<void> {
  for (let step = 0; step < 2; step += 1) {
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
  }
  await userEvent.click(screen.getByRole("button", { name: /generate my plan/i }));
}

describe("App", () => {
  it("shows the planning form as the first screen", () => {
    mockApi();
    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", { name: /plan your week/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
  });

  it("reports catalogue readiness once loaded", async () => {
    mockApi();
    renderWithProviders(<App />);

    expect(await screen.findByText("164")).toBeInTheDocument();
    // The scope's name, not its id: the card tells a shopper which shop these
    // prices came from.
    expect(screen.getByText("Aldi Belper")).toBeInTheDocument();
  });

  it("shows a recoverable message when the catalogue cannot be read", async () => {
    mockApi({
      catalogue: () =>
        json(
          { error: { code: "CATALOGUE_UNAVAILABLE", message: "No data." } },
          503,
        ),
    });
    renderWithProviders(<App />);

    expect(
      await screen.findByText(/could not read the catalogue status/i),
    ).toBeInTheDocument();
  });

  it("blocks submission and marks the field when the budget is invalid", async () => {
    mockApi();
    renderWithProviders(<App />);

    const budget = screen.getByLabelText(/weekly budget/i);
    await userEvent.clear(budget);
    await userEvent.type(budget, "5");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/enter a weekly budget between/i)).toBeInTheDocument();
    expect(budget).toHaveAttribute("aria-invalid", "true");
    expect(generateCalls).toHaveLength(0);
  });

  it("requires at least one meal type", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("checkbox", { name: /dinner/i }));
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/choose at least one meal to plan/i),
    ).toBeInTheDocument();
    expect(generateCalls).toHaveLength(0);
  });

  it("sends the constraints as pence and renders the returned plan", async () => {
    mockApi();
    renderWithProviders(<App />);

    await submitForm();

    expect(
      await screen.findByRole("heading", { name: /your week is sorted/i }),
    ).toBeInTheDocument();

    expect(generateCalls[0]).toMatchObject({
      budgetPence: 7000,
      householdSize: 2,
      mealsPerDay: ["dinner"],
      appliances: ["hob", "oven"],
    });

    const summary = screen.getByRole("region", { name: /your week is sorted/i });
    expect(within(summary).getByText("£70.00")).toBeInTheDocument();
    expect(within(summary).getAllByText("£64.20")).not.toHaveLength(0);
    expect(within(summary).getByText("£5.80")).toBeInTheDocument();
  });

  it("renders all seven days and the grouped shopping list", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    // Days are ISO weekdays and are labelled by name, so a plan's days
    // obviously match the days the household ticked.
    for (const day of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]) {
      expect(screen.getAllByText(day)).not.toHaveLength(0);
    }

    await userEvent.click(screen.getByRole("tab", { name: /shopping list/i }));
    const shoppingList = screen.getByRole("region", { name: /shopping list/i });
    expect(within(shoppingList).getByText("Fresh Food")).toBeInTheDocument();
    expect(within(shoppingList).getByText("Food Cupboard")).toBeInTheDocument();

    const productLink = within(shoppingList).getByRole("link", {
      name: /chicken breast fillets/i,
    });
    expect(productLink).toHaveAttribute(
      "href",
      "https://www.aldi.co.uk/product/prot1",
    );
    expect(productLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("surfaces the inferred-allergen warning with the plan", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    expect(
      await screen.findByText(/allergens were inferred/i),
    ).toBeInTheDocument();
  });

  it("shows a loading state and disables submit while generating", async () => {
    // Held in an object so TypeScript keeps the callable type across the
    // closure boundary.
    const pending: { release: () => void } = { release: () => {} };

    mockApi({
      generate: () =>
        new Promise<Response>((resolve) => {
          pending.release = () => resolve(json(MEAL_PLAN));
        }),
    });

    renderWithProviders(<App />);
    await submitForm();

    expect(await screen.findByRole("status")).toHaveTextContent(
      /building your week from current aldi prices/i,
    );
    expect(
      screen.queryByRole("button", { name: /generate my plan/i }),
    ).not.toBeInTheDocument();

    pending.release();
    await screen.findByRole("heading", { name: /your week is sorted/i });
  });

  /**
   * Planning is a local bounded search, not a model call. Quoting minutes would
   * train people to expect a wait that no longer exists.
   */
  it("tells the user planning takes seconds, not minutes", async () => {
    const pending: { release: () => void } = { release: () => {} };

    mockApi({
      generate: () =>
        new Promise<Response>((resolve) => {
          pending.release = () => resolve(json(MEAL_PLAN));
        }),
    });

    renderWithProviders(<App />);
    await submitForm();

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/a few seconds/i);
    expect(status).not.toHaveTextContent(/minute/i);

    pending.release();
    await screen.findByRole("heading", { name: /your week is sorted/i });
  });

  it("explains a constraint conflict and offers the server's suggestions", async () => {
    mockApi({
      generate: () =>
        json(
          {
            error: {
              code: "CATALOGUE_CONSTRAINT_CONFLICT",
              message: "The cheapest plan costs more than the budget.",
              details: { suggestions: ["Increase the budget to at least £80.00."] },
            },
          },
          409,
        ),
    });

    renderWithProviders(<App />);
    await submitForm();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/could not build a plan/i);
    expect(alert).toHaveTextContent(/increase the budget to at least/i);
  });

  it("asks for a different week when a retry follows a server failure", async () => {
    let attempts = 0;

    mockApi({
      generate: () => {
        attempts += 1;
        return attempts === 1
          ? json(
              {
                error: {
                  code: "PLANNER_CAPACITY_EXCEEDED",
                  message: "The planner ran out of time.",
                },
              },
              503,
            )
          : json(MEAL_PLAN);
      },
    });

    renderWithProviders(<App />);
    await submitForm();

    expect(await screen.findByText(/planner is busy/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    await screen.findByRole("heading", { name: /your week is sorted/i });

    expect(generateCalls).toHaveLength(2);
    const [first, second] = generateCalls as Array<{ variationSeed: number }>;
    expect(second.variationSeed).toBe(first.variationSeed + 1);
  });

  /**
   * A request that never reached the server produced no plan for that seed, so
   * repeating it is exactly what the user asked for. Bumping the seed here
   * would silently discard the week they were waiting on.
   */
  it("repeats the same request when a retry follows a network failure", async () => {
    let attempts = 0;

    mockApi({
      generate: () => {
        attempts += 1;
        if (attempts === 1) throw new TypeError("Failed to fetch");
        return json(MEAL_PLAN);
      },
    });

    renderWithProviders(<App />);
    await submitForm();

    expect(await screen.findByText(/cannot reach the thriftchef api/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    await screen.findByRole("heading", { name: /your week is sorted/i });

    expect(generateCalls).toHaveLength(2);
    expect(generateCalls[0]).toEqual(generateCalls[1]);
  });

  it("maps server field errors back onto the form", async () => {
    mockApi({
      generate: () =>
        json(
          {
            error: {
              code: "INVALID_MEAL_PLAN_REQUEST",
              message: "The meal plan request is not valid.",
              details: [
                { field: "budgetPence", message: "Budget is out of range." },
              ],
            },
          },
          400,
        ),
    });

    renderWithProviders(<App />);
    await submitForm();

    expect(await screen.findByText(/budget is out of range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly budget/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("returns to the form when the user chooses to edit constraints", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    expect(
      screen.queryByRole("heading", { name: /plan your week/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /edit plan/i }));

    expect(
      await screen.findByRole("heading", { name: /plan your week/i }),
    ).toBeInTheDocument();
  });

  it("regenerates the same constraints with a new variation seed", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByRole("button", { name: /regenerate week/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm regenerate/i }));

    await waitFor(() => expect(generateCalls).toHaveLength(2));

    const [first, second] = generateCalls as Array<Record<string, unknown>>;
    // Everything but the seed must be identical: the user changed nothing.
    expect({ ...second, variationSeed: undefined }).toEqual({
      ...first,
      variationSeed: undefined,
    });
    expect(second.variationSeed).toBe((first.variationSeed as number) + 1);
  });

  it("keeps every form control reachable across three focused steps", async () => {
    mockApi();
    renderWithProviders(<App />);

    expect(screen.getByRole("group", { name: /meals to plan each day/i })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /how much of your budget/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(
      screen.getByRole("heading", { name: /make the plan feel like yours/i }),
    ).toHaveFocus();
    expect(screen.getByRole("group", { name: /meal preferences/i })).toBeInTheDocument();

    await userEvent.click(screen.getByText(/add must-have items/i));
    expect(screen.getByLabelText(/search aldi products/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/add allergies/i));
    expect(screen.getByRole("group", { name: /allergies to avoid/i })).toBeInTheDocument();

    await userEvent.click(screen.getByText(/add optional details/i));
    expect(screen.getByLabelText(/cuisine preferences/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disliked ingredients/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("group", { name: /cooking appliances available/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /already have at home/i })).toBeInTheDocument();
  });

  it("returns focus to each step heading after forward and back navigation", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(
      screen.getByRole("heading", { name: /make the plan feel like yours/i }),
    ).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(
      screen.getByRole("heading", { name: /set your budget and household/i }),
    ).toHaveFocus();
  });

  it("replaces one selected meal through the replacement endpoint", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();
    await screen.findByRole("heading", { name: /your week is sorted/i });

    await userEvent.click(screen.getByRole("tab", { name: /^recipes$/i }));
    await userEvent.click(screen.getByRole("button", { name: /replace this meal/i }));

    await waitFor(() => expect(replaceCalls).toHaveLength(1));
    expect(replaceCalls[0]).toMatchObject({ day: 1, mealType: "dinner" });
  });
});

describe("budget target", () => {
  it("defaults to the 80% preset", () => {
    mockApi();
    renderWithProviders(<App />);

    expect(screen.getByRole("radio", { name: /use my budget — 80%/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /tight — 50%/i })).not.toBeChecked();
  });

  it("shows the amount it will aim for, and updates it with the preset", async () => {
    mockApi();
    renderWithProviders(<App />);

    // The form starts at a £70 budget.
    expect(screen.getByTestId("budget-target-summary")).toHaveTextContent("£56.00");

    await userEvent.click(screen.getByRole("radio", { name: /tight — 50%/i }));
    expect(screen.getByTestId("budget-target-summary")).toHaveTextContent("£35.00");

    await userEvent.click(screen.getByRole("radio", { name: /balanced — 65%/i }));
    expect(screen.getByTestId("budget-target-summary")).toHaveTextContent("£45.50");
  });

  it("updates the aim when the budget changes", async () => {
    mockApi();
    renderWithProviders(<App />);

    const budget = screen.getByLabelText(/weekly budget/i);
    await userEvent.clear(budget);
    await userEvent.type(budget, "90");

    expect(screen.getByTestId("budget-target-summary")).toHaveTextContent("£72.00");
  });

  it("sends the chosen target with the generation request", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("radio", { name: /balanced — 65%/i }));
    await submitForm();

    await waitFor(() => expect(generateCalls).toHaveLength(1));
    expect(generateCalls[0]).toMatchObject({ budgetTargetPercent: 65 });
  });
});

describe("must-have product selection", () => {
  async function openMustHaveStep(): Promise<void> {
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByText(/add must-have items/i));
  }

  async function search(term: string): Promise<void> {
    await userEvent.type(screen.getByLabelText(/search aldi products/i), term);
  }

  it("debounces the catalogue search into a single request", async () => {
    mockApi();
    renderWithProviders(<App />);
    await openMustHaveStep();

    await search("chicken");

    await waitFor(() =>
      expect(screen.getByRole("list", { name: /search results/i })).toBeInTheDocument(),
    );

    expect(productSearchCalls).toHaveLength(1);
    expect(productSearchCalls[0]).toContain("search=chicken");
  });

  it("does not search before there is anything worth searching for", async () => {
    mockApi();
    renderWithProviders(<App />);
    await openMustHaveStep();

    await search("c");

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/at least two characters/i),
    );
    expect(productSearchCalls).toHaveLength(0);
  });

  it("renders results and lets one be selected, then removed", async () => {
    mockApi();
    renderWithProviders(<App />);
    await openMustHaveStep();
    await search("chicken");

    await userEvent.click(
      await screen.findByRole("button", { name: /add chicken breast fillets/i }),
    );

    const selected = screen.getByRole("list", { name: /selected must-have products/i });
    expect(within(selected).getByText(/chicken breast fillets/i)).toBeInTheDocument();
    expect(screen.getByText(/must-have subtotal/i)).toHaveTextContent("£3.89");

    await userEvent.click(
      within(selected).getByRole("button", { name: /remove chicken breast fillets/i }),
    );

    expect(
      screen.queryByRole("list", { name: /selected must-have products/i }),
    ).not.toBeInTheDocument();
  });

  it("adds up the subtotal across several selections", async () => {
    mockApi();
    renderWithProviders(<App />);
    await openMustHaveStep();
    await search("staples");

    await userEvent.click(
      await screen.findByRole("button", { name: /add chicken breast fillets/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /add basmati rice/i }));

    // £3.89 + £1.79
    expect(screen.getByText(/must-have subtotal/i)).toHaveTextContent("£5.68");
  });

  it("stops at twelve must-have products", async () => {
    mockApi({ products: () => json(LARGE_PRODUCT_SEARCH_PAGE) });
    renderWithProviders(<App />);
    await openMustHaveStep();
    await search("bulk");

    await screen.findByRole("list", { name: /search results/i });

    for (let index = 0; index < 12; index += 1) {
      await userEvent.click(
        screen.getByRole("button", { name: new RegExp(`^add bulk product ${index}$`, "i") }),
      );
    }

    expect(screen.getByRole("heading", { name: /must-have items \(12 of 12\)/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^add bulk product 12$/i }),
    ).toBeDisabled();
    expect(screen.getByText(/that is the maximum of 12/i)).toBeInTheDocument();
  });

  it("reports a failed product search accessibly", async () => {
    mockApi({
      products: () =>
        json({ error: { code: "INTERNAL_ERROR", message: "boom" } }, 500),
    });
    renderWithProviders(<App />);
    await openMustHaveStep();
    await search("chicken");

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        /product search is unavailable/i,
      ),
    );
  });

  it("sends the selected product ids with the generation request", async () => {
    mockApi();
    renderWithProviders(<App />);
    await openMustHaveStep();
    await search("chicken");

    await userEvent.click(
      await screen.findByRole("button", { name: /add chicken breast fillets/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByRole("button", { name: /generate my plan/i }));

    await waitFor(() => expect(generateCalls).toHaveLength(1));
    expect(generateCalls[0]).toMatchObject({
      mustHaveProductIds: ["p-chicken-breast"],
    });
  });

  it("keeps the target and the must-have ids when the week is regenerated", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("radio", { name: /tight — 50%/i }));
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByText(/add must-have items/i));
    await userEvent.type(screen.getByLabelText(/search aldi products/i), "chicken");
    await userEvent.click(
      await screen.findByRole("button", { name: /add chicken breast fillets/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByRole("button", { name: /generate my plan/i }));

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByRole("button", { name: /regenerate week/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm regenerate/i }));

    await waitFor(() => expect(generateCalls).toHaveLength(2));

    const [first, second] = generateCalls as Array<Record<string, unknown>>;
    expect(first.budgetTargetPercent).toBe(50);
    expect(second.budgetTargetPercent).toBe(50);
    expect(second.mustHaveProductIds).toEqual(["p-chicken-breast"]);
    expect(second.variationSeed).toBe((first.variationSeed as number) + 1);
  });
});

describe("budget and must-have results", () => {
  it("shows the maximum, the target and the actual utilization", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    expect(screen.getByText(/maximum budget/i)).toBeInTheDocument();
    expect(screen.getByText(/target \(80%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/uses 92% of your maximum/i)).toBeInTheDocument();
  });

  it("lists where each must-have product was used", async () => {
    mockApi({
      generate: () =>
        json({
          ...MEAL_PLAN,
          mustHaveUsage: [
            {
              productId: "p-chicken-breast",
              productName: "Chicken Breast Fillets",
              usedIn: [{ day: 1, mealType: "dinner", recipeId: "dinner-1" }],
            },
          ],
        }),
    });
    renderWithProviders(<App />);
    await submitForm();

    const section = await screen.findByRole("region", {
      name: /must-have items used/i,
    });

    expect(within(section).getByText("Chicken Breast Fillets")).toBeInTheDocument();
    expect(within(section).getByText(/monday dinner/i)).toBeInTheDocument();
  });

  it("shows the server's under-target warning without blocking the plan", async () => {
    const warning =
      "This plan comes to £20.08 against a target of about £72.00 (80% of your £90.00 maximum).";

    mockApi({
      generate: () => json({ ...MEAL_PLAN, warnings: [warning] }),
    });
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByText(/important shopping notes/i));

    expect(screen.getByText(warning)).toBeInTheDocument();
  });
});

describe("the planner screen", () => {
  it("is the page's own content, not a page with a landing page around it", () => {
    mockApi();
    renderWithProviders(<App />);

    // The shell supplies the header, the navigation and the footer for every
    // route. A second set here would give the page two of each.
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("leads with the planning task as the only top-level heading", () => {
    mockApi();
    renderWithProviders(<App />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/plan your week/i);
  });

  it("carries none of the retired marketing sections", () => {
    mockApi();
    renderWithProviders(<App />);

    expect(
      screen.queryByRole("heading", { name: /how it works/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: /seven days of aldi meals/i }),
    ).not.toBeInTheDocument();
    // The catalogue card survives; the marketing section that framed it does not.
    expect(
      screen.queryByText(/plans are only as current as the products behind them/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/^data source$/i)).not.toBeInTheDocument();
  });

  it("reaches every planning control without a location hash", () => {
    mockApi();
    window.history.replaceState(null, "", "/plan");
    renderWithProviders(<App />);

    // No planner mode to enter or leave, and no anchor to jump to: the route
    // is the only thing that decides what is on screen.
    expect(
      screen.queryByRole("button", { name: /plan my week/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /exit planner/i }),
    ).not.toBeInTheDocument();
    expect(document.getElementById("planner")).toBeNull();

    for (const link of screen.queryAllByRole("link")) {
      expect(link.getAttribute("href") ?? "").not.toMatch(/^#/);
    }

    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });

  it("keeps the planner heading off printed output", () => {
    mockApi();
    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /plan your week/i }).closest(
        ".print-hidden",
      ),
    ).not.toBeNull();
  });
});

describe("option cards", () => {
  it("keeps every choice a real checkbox reachable by its label", () => {
    mockApi();
    renderWithProviders(<App />);

    const group = screen.getByRole("group", { name: /meals to plan each day/i });
    const boxes = within(group).getAllByRole("checkbox");

    expect(boxes).toHaveLength(4);
    for (const box of boxes) expect(box).toHaveAttribute("type", "checkbox");
    expect(within(group).getByRole("checkbox", { name: /dinner/i })).toBeChecked();
  });

  it("marks the selected card without relying on colour alone", async () => {
    mockApi();
    renderWithProviders(<App />);

    const lunch = screen.getByRole("checkbox", { name: /lunch/i });
    const card = lunch.closest("label") as HTMLElement;

    expect(card).toHaveAttribute("data-selected", "false");
    await userEvent.click(lunch);
    expect(card).toHaveAttribute("data-selected", "true");
    expect(within(card).getByTestId("option-check")).toBeInTheDocument();
  });

  it("toggles a card from the keyboard", async () => {
    mockApi();
    renderWithProviders(<App />);

    const dinner = screen.getByRole("checkbox", { name: /dinner/i });
    dinner.focus();
    expect(dinner).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(dinner).not.toBeChecked();

    await userEvent.keyboard(" ");
    expect(dinner).toBeChecked();
  });

  it("groups the free-text preferences under optional details", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByText(/add optional details/i));

    expect(screen.getByLabelText(/cuisine preferences/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disliked ingredients/i)).toBeInTheDocument();
  });

  it("keeps the allergen safety detail available in a compact disclosure", async () => {
    mockApi();
    renderWithProviders(<App />);

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await userEvent.click(screen.getByText(/add allergies/i));
    await userEvent.click(screen.getByText(/how allergen data is worked out/i));

    expect(screen.getByText(/read the label before you cook/i)).toBeInTheDocument();
  });
});

describe("catalogue status card", () => {
  it("shows a loading state before the status arrives", () => {
    mockApi({ catalogue: () => new Promise<Response>(() => {}) });
    renderWithProviders(<App />);

    expect(screen.getByText(/checking the catalogue/i)).toBeInTheDocument();
  });

  it("badges a ready catalogue", async () => {
    mockApi();
    renderWithProviders(<App />);

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    expect(await within(card).findByText(/^ready$/i)).toBeInTheDocument();
    expect(within(card).getByText("164")).toBeInTheDocument();
    expect(within(card).getByText("Aldi Belper")).toBeInTheDocument();
  });

  it("badges a stale catalogue and keeps the price warning", async () => {
    mockApi({ catalogue: () => json({ ...CATALOGUE_STATUS, isStale: true }) });
    renderWithProviders(<App />);

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    expect(await within(card).findByText(/^stale$/i)).toBeInTheDocument();
    expect(within(card).getByText(/more than three days old/i)).toBeInTheDocument();
  });

  it("reports a catalogue that cannot be read at all", async () => {
    mockApi({
      catalogue: () =>
        json({ error: { code: "CATALOGUE_UNAVAILABLE", message: "No data." } }, 503),
    });
    renderWithProviders(<App />);

    const card = await screen.findByRole("complementary", { name: /catalogue/i });
    expect(
      await within(card).findByText(/could not read the catalogue status/i),
    ).toBeInTheDocument();
  });

  it("keeps the crawl instruction when the catalogue is empty", async () => {
    mockApi({
      catalogue: () => json({ ...CATALOGUE_STATUS, eligibleProducts: 0 }),
    });
    renderWithProviders(<App />);

    expect(
      await screen.findByText(/no products are available yet/i),
    ).toBeInTheDocument();
    expect(screen.getByText("npm run aldi:crawl")).toBeInTheDocument();
  });
});

describe("results view", () => {
  it("starts a separate plan instead of carrying the generated week forward", async () => {
    mockApi();
    const onStartNewPlan = vi.fn();
    renderWithProviders(<App onStartNewPlan={onStartNewPlan} />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByRole("button", { name: /start new plan/i }));

    expect(onStartNewPlan).toHaveBeenCalledOnce();
    expect(screen.getByRole("heading", { name: /plan your week/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /your week is sorted/i }),
    ).not.toBeInTheDocument();
  });

  it("makes the plan heading the only top-level heading on the page", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/your week is sorted/i);
  });

  it("carries a plan title onto paper that the screen does not show", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    const title = screen.getByTestId("print-title");
    expect(title).toHaveClass("print-only");
    expect(title).toHaveTextContent(/thriftchef weekly plan/i);
  });

  it("keeps the plan actions out of printed output", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });

    const edit = screen.getByRole("button", { name: /edit plan/i });
    expect(edit.closest(".print-hidden")).not.toBeNull();
    expect(screen.getByRole("tablist")).toHaveClass("print-hidden");
  });
});
