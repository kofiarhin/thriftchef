import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { renderWithProviders } from "./testing/renderApp";
import { CATALOGUE_STATUS, MEAL_PLAN } from "./testing/fixtures";

interface RouteHandlers {
  catalogue?: () => Response | Promise<Response>;
  generate?: (body: unknown) => Response | Promise<Response>;
  replace?: (body: unknown) => Response | Promise<Response>;
}

const generateCalls: unknown[] = [];
const replaceCalls: unknown[] = [];

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
  generateCalls.length = 0;
  replaceCalls.length = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function submitForm(): Promise<void> {
  await userEvent.click(screen.getByRole("button", { name: /continue/i }));
  await userEvent.click(screen.getByRole("button", { name: /continue/i }));
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
    expect(screen.getByText("belper-de56-1ar")).toBeInTheDocument();
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

    for (let day = 1; day <= 7; day += 1) {
      expect(screen.getAllByText(`Day ${day}`)).not.toHaveLength(0);
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
      /generating your meal plan/i,
    );
    expect(
      screen.queryByRole("button", { name: /generate my plan/i }),
    ).not.toBeInTheDocument();

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

  it("offers a retry after a timeout and repeats the same request", async () => {
    let attempts = 0;

    mockApi({
      generate: () => {
        attempts += 1;
        return attempts === 1
          ? json({ error: { code: "AI_TIMEOUT", message: "Timed out." } }, 504)
          : json(MEAL_PLAN);
      },
    });

    renderWithProviders(<App />);
    await submitForm();

    expect(await screen.findByText(/plan generation timed out/i)).toBeInTheDocument();

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

  it("regenerates using the constraints already submitted", async () => {
    mockApi();
    renderWithProviders(<App />);
    await submitForm();

    await screen.findByRole("heading", { name: /your week is sorted/i });
    await userEvent.click(screen.getByRole("button", { name: /regenerate week/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm regenerate/i }));

    await waitFor(() => expect(generateCalls).toHaveLength(2));
    expect(generateCalls[0]).toEqual(generateCalls[1]);
  });

  it("keeps every form control reachable across the three labelled steps", async () => {
    mockApi();
    renderWithProviders(<App />);

    expect(screen.getByRole("group", { name: /meals to plan each day/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("group", { name: /meal preferences/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /allergies to avoid/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/cuisine preferences/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disliked ingredients/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("group", { name: /cooking appliances available/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /already have at home/i })).toBeInTheDocument();
  });

  it("replaces one selected meal through the NVIDIA replacement endpoint", async () => {
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
