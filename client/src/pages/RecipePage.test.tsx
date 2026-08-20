import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecipePage } from "./RecipePage";
import { HomePage } from "./HomePage";
import { PlanProvider } from "../features/weeklyPlan/usePlan";
import { MEAL_PLAN } from "../testing/fixtures";

const PLAN_ID = MEAL_PLAN.planId;
const RECIPE_ID = MEAL_PLAN.recipes[0].id;

function json(body: unknown, status = 200): Response {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Renders at a URL with nothing in memory — which is exactly what a refresh or
 * a pasted link looks like. The plan has to come back from the server by the
 * id the device remembered.
 */
function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <PlanProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/recipe/:recipeId" element={<RecipePage />} />
            <Route path="/week" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </PlanProvider>
    </QueryClientProvider>,
  );
}

describe("recipe route", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("thriftchef.current-plan-id", PLAN_ID);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes(`/api/meal-plans/${PLAN_ID}`)) return json(MEAL_PLAN);
        return new Response("not found", { status: 404 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("restores the plan after a refresh and shows the recipe", async () => {
    renderAt(`/recipe/${RECIPE_ID}`);

    expect(
      await screen.findByRole("heading", { name: MEAL_PLAN.recipes[0].title }),
    ).toBeInTheDocument();
  });

  it("shows a loading state while the plan is being restored", () => {
    renderAt(`/recipe/${RECIPE_ID}`);

    expect(screen.getByRole("status")).toHaveTextContent(/loading your plan/i);
  });

  it("shows the times and servings a cook needs", async () => {
    renderAt(`/recipe/${RECIPE_ID}`);
    await screen.findByRole("heading", { name: MEAL_PLAN.recipes[0].title });

    const recipe = MEAL_PLAN.recipes[0];
    const total = recipe.prepMinutes + recipe.cookMinutes;

    expect(screen.getByText(new RegExp(`${total} min total`))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${recipe.servings} servings`)),
    ).toBeInTheDocument();
  });

  it("names the retailer the prices came from", async () => {
    renderAt(`/recipe/${RECIPE_ID}`);
    await screen.findByRole("heading", { name: MEAL_PLAN.recipes[0].title });

    expect(
      screen.getByText(new RegExp(MEAL_PLAN.catalogue.retailerName)),
    ).toBeInTheDocument();
  });

  it("lists the method as ordered steps", async () => {
    renderAt(`/recipe/${RECIPE_ID}`);
    await screen.findByRole("heading", { name: MEAL_PLAN.recipes[0].title });

    const method = screen.getByRole("heading", { name: /method/i });
    expect(method).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("moves focus to the recipe title on arrival", async () => {
    renderAt(`/recipe/${RECIPE_ID}`);

    const heading = await screen.findByRole("heading", {
      name: MEAL_PLAN.recipes[0].title,
    });

    await waitFor(() => expect(heading).toHaveFocus());
  });

  it("says so when the recipe is not part of this plan", async () => {
    renderAt("/recipe/not-a-recipe-in-the-plan");

    expect(
      await screen.findByRole("heading", { name: /not in this plan/i }),
    ).toBeInTheDocument();
  });

  it("distinguishes an expired plan from having no plan", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        json(
          { error: { code: "PLAN_NOT_FOUND", message: "gone" } },
          404,
        ),
      ),
    );

    renderAt(`/recipe/${RECIPE_ID}`);

    // The user needs to know it expired rather than that something broke:
    // the recovery is the same action but the explanation is not.
    expect(
      await screen.findByRole("heading", { name: /has expired/i }),
    ).toBeInTheDocument();
  });

  it("offers a way back to planning when there is no plan at all", async () => {
    window.localStorage.clear();
    renderAt(`/recipe/${RECIPE_ID}`);

    expect(
      await screen.findByRole("link", { name: /plan this week/i }),
    ).toBeInTheDocument();
  });

  it("is reachable from the week view by keyboard", async () => {
    const user = userEvent.setup();
    renderAt("/week");

    // A recipe cooked on several days appears on several day cards, which is
    // correct. Any of its links must reach the recipe.
    const [link] = await screen.findAllByRole("link", {
      name: MEAL_PLAN.recipes[0].title,
    });

    link.focus();
    expect(link).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(
      await screen.findByRole("heading", { name: MEAL_PLAN.recipes[0].title }),
    ).toBeInTheDocument();
  });
});

describe("end-of-week feedback", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("thriftchef.current-plan-id", PLAN_ID);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubFetch(feedback: () => Response) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/feedback") && init?.method === "POST") return feedback();
        if (url.includes(`/api/meal-plans/${PLAN_ID}`)) return json(MEAL_PLAN);
        return new Response("not found", { status: 404 });
      }),
    );
  }

  it("cannot be sent until a rating is chosen", async () => {
    stubFetch(() => json(null, 204));
    renderAt("/week");

    const send = await screen.findByRole("button", { name: /send feedback/i });
    expect(send).toBeDisabled();
  });

  it("records a rating without asking for free text", async () => {
    const user = userEvent.setup();
    stubFetch(() => json(null, 204));
    renderAt("/week");

    await user.click(await screen.findByRole("radio", { name: /went well/i }));
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("offers issue tags only when something went wrong", async () => {
    const user = userEvent.setup();
    stubFetch(() => json(null, 204));
    renderAt("/week");

    await user.click(await screen.findByRole("radio", { name: /went well/i }));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /did not work/i }));
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });

  it("reports a failed submission without implying the plan is affected", async () => {
    const user = userEvent.setup();
    stubFetch(() => json({ error: { code: "RATE_LIMITED" } }, 429));
    renderAt("/week");

    await user.click(await screen.findByRole("radio", { name: /mixed/i }));
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/plan is unaffected/i);
  });
});
