import { useState, type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  INITIAL_FORM_STATE,
  type ConstraintFormState,
  type ValidationIssues,
} from "../constraints";
import { ConstraintForm } from "./ConstraintForm";

const RETAILER_ID = "000000000000000000000e5c";

interface HarnessProps {
  initialState?: Partial<ConstraintFormState>;
  serverIssues?: ValidationIssues;
  onSubmit?: ReturnType<typeof vi.fn>;
}

function Harness({
  initialState,
  serverIssues,
  onSubmit = vi.fn(),
}: HarnessProps): ReactElement {
  const [state, setState] = useState<ConstraintFormState>({
    ...INITIAL_FORM_STATE,
    ...initialState,
  });

  const retailerSelector = (
    <fieldset>
      <legend>Choose your supermarket</legend>
      <label>
        <input
          type="radio"
          name="retailer"
          checked={state.retailerId === RETAILER_ID}
          onChange={() =>
            setState((current) => ({ ...current, retailerId: RETAILER_ID }))
          }
        />
        Tesco UK
      </label>
    </fieldset>
  );

  return (
    <ConstraintForm
      state={state}
      onStateChange={setState}
      onSubmit={onSubmit}
      isGenerating={false}
      serverIssues={serverIssues}
      focusedWizard
      retailerSelector={retailerSelector}
      retailerName="Tesco UK"
    />
  );
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function renderHarness(props: HarnessProps = {}) {
  const queryClient = createQueryClient();
  const result = render(
    <QueryClientProvider client={queryClient}>
      <Harness {...props} />
    </QueryClientProvider>,
  );

  return {
    ...result,
    rerenderHarness(nextProps: HarnessProps) {
      result.rerender(
        <QueryClientProvider client={queryClient}>
          <Harness {...nextProps} />
        </QueryClientProvider>,
      );
    },
  };
}

async function next(): Promise<void> {
  await userEvent.click(screen.getByRole("button", { name: /continue/i }));
}

describe("ConstraintForm focused wizard", () => {
  it("shows only the current planning step", async () => {
    renderHarness();

    expect(
      screen.getByRole("heading", { name: /choose your supermarket/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/weekly budget/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/household size/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: /tesco uk/i }));
    await next();

    expect(
      screen.getByRole("heading", { name: /set your weekly budget/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly budget/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/household size/i)).not.toBeInTheDocument();

    await next();

    expect(
      screen.getByRole("heading", {
        name: /how many people are you cooking for/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/weekly budget/i)).not.toBeInTheDocument();
  });

  it("requires a supermarket before moving forward", async () => {
    renderHarness();

    await next();

    expect(screen.getByRole("alert")).toHaveTextContent(
      /choose a supermarket to continue/i,
    );
    expect(
      screen.getByRole("heading", { name: /choose your supermarket/i }),
    ).toBeInTheDocument();
  });

  it("preserves answers when moving back between steps", async () => {
    renderHarness({ initialState: { retailerId: RETAILER_ID } });

    await next();
    const budget = screen.getByLabelText(/weekly budget/i);
    await userEvent.clear(budget);
    await userEvent.type(budget, "91");
    await next();

    expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByLabelText(/weekly budget/i)).toHaveValue(91);
  });

  it("walks through focused steps and generates only from Review", async () => {
    const onSubmit = vi.fn();
    renderHarness({
      initialState: { retailerId: RETAILER_ID },
      onSubmit,
    });

    const headings = [
      /set your weekly budget/i,
      /how many people are you cooking for/i,
      /which meals should we plan/i,
      /which days are you cooking/i,
      /how long can dinner take/i,
      /what sounds good this week/i,
      /anything we must include or avoid/i,
      /what is already in your kitchen/i,
      /review your week/i,
    ];

    for (const heading of headings) {
      await next();
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Tesco UK/)).toBeInTheDocument();
    expect(screen.getByText(/£70 maximum/i)).toBeInTheDocument();
    expect(screen.getByText(/2 people/i)).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /generate my plan/i }),
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      retailerId: RETAILER_ID,
      budgetPence: 7000,
      householdSize: 2,
      mealsPerDay: ["dinner"],
      appliances: ["hob", "oven"],
    });
  });

  it("returns server field errors to the owning step", async () => {
    const { rerenderHarness } = renderHarness({
      initialState: { retailerId: RETAILER_ID },
    });

    for (let index = 0; index < 9; index += 1) await next();
    expect(
      screen.getByRole("heading", { name: /review your week/i }),
    ).toBeInTheDocument();

    rerenderHarness({
      initialState: { retailerId: RETAILER_ID },
      serverIssues: { budgetPounds: "Budget is out of range." },
    });

    expect(
      await screen.findByRole("heading", { name: /set your weekly budget/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/budget is out of range/i)).toBeInTheDocument();
  });
});
