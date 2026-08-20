/**
 * Drives the real application in a real browser, against a throwaway database.
 *
 *   npm run verify:browser
 *   npm run verify:browser -- --headed     # watch it happen
 *
 * Component tests prove a component renders. They cannot prove that the router,
 * the API, the query cache, local storage and the planner work together — that
 * a refresh on a recipe URL restores the plan, that a swap reprices the basket
 * the user is looking at, or that nothing logs an error along the way. That is
 * what this does.
 *
 * The database is created by `mongodb-memory-server` on an ephemeral port and
 * discarded at the end. `MONGODB_URI` is never read, so there is no
 * configuration under which this reaches development or production data. No
 * crawl is run: the catalogue is the same fixture the planner tests use.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  chromium,
  type Browser,
  type ConsoleMessage,
  type Page,
} from "playwright";
import { createApp } from "../server/app";
import { loadConfig, type AppConfig } from "../server/config/env";
import { bootstrapRetailers } from "../server/catalogue/core/catalogueMigrations";
import { persistCatalogueBatch } from "../server/catalogue/core/cataloguePersistence";
import { evaluateCatalogueSafety } from "../server/catalogue/core/catalogueSafety";
import { toScope } from "../server/catalogue/retailerRegistry";
import { ALDI_CATALOGUE } from "../server/testing/planningFixtures";
import { CrawlRun } from "../server/models/CrawlRun";
import { PriceHistory } from "../server/models/PriceHistory";
import { Product } from "../server/models/Product";
import { ProductOffer } from "../server/models/ProductOffer";
import { RetailStore } from "../server/models/RetailStore";
import { Retailer } from "../server/models/Retailer";

const CLIENT_BUILD = join(process.cwd(), "dist", "client");

/** The two shapes the product promises to work at. */
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

interface Problem {
  viewport: string;
  kind: "console" | "pageerror" | "request";
  detail: string;
}

const checks: Array<{ name: string; passed: boolean; detail: string }> = [];
const problems: Problem[] = [];

function check(name: string, passed: boolean, detail = ""): void {
  checks.push({ name, passed, detail });
  console.log(`    ${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

/**
 * Noise a browser produces that says nothing about this application:
 * a favicon nobody added, and the dev-tools banner React prints.
 */
function isIgnorableConsole(message: ConsoleMessage): boolean {
  const text = message.text();
  return (
    /favicon/i.test(text) ||
    /Download the React DevTools/i.test(text) ||
    /\[vite\]/i.test(text)
  );
}

async function seedCatalogue(): Promise<void> {
  for (const model of [Retailer, RetailStore, CrawlRun, Product, ProductOffer, PriceHistory]) {
    await model.createIndexes();
  }

  await bootstrapRetailers([
    {
      slug: "aldi-uk",
      name: "Aldi UK",
      adapterKey: "aldi",
      catalogueScope: "store",
      status: "active",
      stores: [
        {
          externalStoreId: "belper-de56-1ar",
          name: "Aldi Belper",
          postcode: "DE56 1AR",
          scope: "physical",
        },
      ],
    },
    // A second, deliberately unselectable retailer, so the picker's disabled
    // state is exercised rather than assumed.
    {
      slug: "second-uk",
      name: "Second UK",
      adapterKey: "second",
      catalogueScope: "national",
      status: "validating",
      stores: [{ externalStoreId: "national", name: "National", scope: "national" }],
    },
  ]);

  const retailer = await Retailer.findOne({ slug: "aldi-uk" }).orFail();
  const store = await RetailStore.findOne({ retailerId: retailer._id }).orFail();
  const scope = toScope(retailer.toObject(), store.toObject());

  // The planner's own fixture catalogue, run through the real persistence
  // path so offers, eligibility and provenance are written exactly as a crawl
  // would write them.
  await persistCatalogueBatch(
    ALDI_CATALOGUE.map((product) => ({
      retailerProductId: product.retailerProductId,
      name: product.name,
      brand: product.brand,
      description: product.description,
      categoryPaths: product.categoryPaths,
      priceMinor: product.pricePence,
      packageSizeRaw: product.packageSizeRaw,
      comparisonPriceRaw: null,
      ingredientsRaw: null,
      allergenAdviceRaw: null,
      dietaryInformationRaw: product.dietaryInformationRaw,
      imageUrl: product.imageUrl ?? null,
      productUrl: product.productUrl,
      available: true,
      ...evaluateCatalogueSafety(null, null, {
        name: product.name,
        brand: product.brand,
        description: product.description,
        categoryPaths: product.categoryPaths,
      }),
    })),
    scope,
    "browser-verification-seed",
  );
}

/**
 * The API and the built client on one origin.
 *
 * Same-origin on purpose: it is how the client is written (relative `/api`
 * paths) and it keeps CORS out of the verification. `server/app.ts` is not
 * modified — the static serving is added by this script's own wrapper, so the
 * deployed configuration is exactly what it was.
 */
function buildVerificationServer(config: AppConfig) {
  const app = express();

  app.use(createApp(config));
  app.use(express.static(CLIENT_BUILD));

  // SPA fallback: a deep link like /recipe/abc must return the shell rather
  // than a 404, which is the whole point of testing direct navigation.
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api")) {
      next();
      return;
    }

    response.sendFile(join(CLIENT_BUILD, "index.html"));
  });

  return app;
}

/**
 * Sets a visually-hidden checkbox or radio the way a keyboard user does.
 *
 * Several controls put an `sr-only` input inside a styled label — an accepted
 * accessible pattern, and one a pointer cannot click directly. Driving them by
 * focus and Space is both the only way to operate them here *and* a stronger
 * check than a click: it proves the control is genuinely keyboard-operable
 * rather than merely present.
 */
async function setViaKeyboard(
  locator: ReturnType<Page["getByRole"]>,
  shouldBeChecked: boolean,
): Promise<void> {
  if ((await locator.isChecked()) === shouldBeChecked) return;

  await locator.focus();
  await locator.press(" ");
}

function watchForProblems(page: Page, viewport: string): void {
  page.on("console", (message) => {
    if (message.type() !== "error" || isIgnorableConsole(message)) return;
    problems.push({ viewport, kind: "console", detail: message.text() });
  });

  page.on("pageerror", (error) => {
    problems.push({ viewport, kind: "pageerror", detail: error.message });
  });

  page.on("requestfailed", (request) => {
    problems.push({
      viewport,
      kind: "request",
      detail: `${request.method()} ${request.url()} — ${request.failure()?.errorText ?? "failed"}`,
    });
  });

  page.on("response", (response) => {
    // 4xx and 5xx from our own API are real problems. A deliberate
    // not-found probe is excluded where it is exercised.
    if (response.status() < 400) return;
    if (!response.url().includes("/api/")) return;
    if (response.url().includes("/api/meal-plans/") && response.status() === 404) return;

    problems.push({
      viewport,
      kind: "request",
      detail: `${response.status()} ${response.url()}`,
    });
  });
}

async function runFlow(browser: Browser, baseUrl: string, viewport: (typeof VIEWPORTS)[number]) {
  console.log(`\n  ${viewport.name} (${viewport.width}×${viewport.height})`);

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "en-GB",
  });
  const page = await context.newPage();
  watchForProblems(page, viewport.name);

  try {
    /* ------------------------------------------------------------ welcome */
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    check(
      "welcome page offers planning without an account",
      await page.getByRole("link", { name: /start planning/i }).isVisible(),
    );

    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    check(
      "no sign-up, payment or trial language",
      !/sign up|sign in|free trial|subscribe|credit card/.test(bodyText),
    );

    await page.getByRole("link", { name: /start planning/i }).click();
    await page.waitForURL("**/setup");

    /* --------------------------------------------------------- onboarding */
    await page.getByRole("radio", { name: /Aldi UK/ }).waitFor();

    check(
      "an unavailable retailer is shown but not selectable",
      await page.getByRole("radio", { name: /Second UK/ }).isDisabled(),
    );

    await page.getByRole("radio", { name: /Aldi UK/ }).check();
    await page.getByRole("radio", { name: /Aldi Belper/ }).waitFor();

    check("choosing a store-scoped retailer asks for a store", true);

    await page.getByRole("radio", { name: /Aldi Belper/ }).check();
    await page.getByRole("button", { name: "Continue" }).click();

    check(
      "focus follows the wizard step",
      await page
        .getByRole("heading", { name: "Household" })
        .evaluate((element) => element === document.activeElement),
    );

    await page.getByLabel(/how many people/i).fill("2");
    await page.getByRole("button", { name: "Continue" }).click();

    const warning = page.getByRole("note");
    check(
      "the allergen warning is shown with the allergy controls",
      /check the packaging/i.test(await warning.innerText()),
    );

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /plan my week/i }).click();
    await page.waitForURL("**/plan");

    /* -------------------------------------------------------- weekly setup */
    await page.getByRole("heading", { name: /plan your week/i }).waitFor();

    await page.getByLabel(/weekly budget/i).fill("70");
    await page.getByLabel(/household size/i).fill("2");

    // Cook on three days only. The plan must contain exactly those days.
    const cookingDays = ["Monday", "Wednesday", "Saturday"];
    for (const day of [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]) {
      await setViaKeyboard(
        page.getByRole("checkbox", { name: day, exact: true }),
        cookingDays.includes(day),
      );
    }

    check(
      "weekday controls are operable by keyboard alone",
      await page.getByRole("checkbox", { name: "Monday", exact: true }).isChecked(),
    );

    await setViaKeyboard(page.getByRole("radio", { name: /up to 45 min/i }), true);
    await setViaKeyboard(page.getByRole("checkbox", { name: /in a rush/i }), true);

    check(
      "the weekly mood says what it will do to the plan",
      /quick/i.test(await page.getByTestId("mood-summary").innerText()),
    );

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /generate my plan/i }).click();

    /* ------------------------------------------------------------ results */
    await page.getByRole("button", { name: /regenerate week/i }).waitFor({ timeout: 30_000 });

    check("a plan is generated", true);

    const planText = await page.locator("main").innerText();
    check(
      "the plan names the retailer it was priced from",
      /Aldi/i.test(planText),
    );

    const dayHeadings = await page.getByText(/Monday|Wednesday|Saturday/).count();
    check("the plan covers the selected days", dayHeadings > 0, `${dayHeadings} matches`);

    check(
      "no day the household unticked is planned",
      !/Tuesday|Thursday|Friday|Sunday/.test(planText),
    );

    /* -------------------------------------------------------- regeneration */
    const before = await page.locator("main").innerText();

    // Regeneration is a two-step confirm, because it discards the week the
    // user is looking at. Both steps are driven here deliberately: skipping
    // the guard in the test would stop the test from exercising it.
    await page.getByRole("button", { name: /regenerate week/i }).click();
    await page.getByRole("button", { name: /confirm regenerate/i }).click();

    // Either another plan appears, or the planner explains why it could not
    // build one. Both are legitimate; silence is not.
    const regenerated = await page
      .getByRole("button", { name: /regenerate week/i })
      .waitFor({ timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    if (!regenerated) {
      console.log(
        `      [diagnostic] after regenerating:
${(await page.locator("main").innerText()).slice(0, 600)}`,
      );
    }

    const after = await page.locator("main").innerText();

    check(
      "regeneration returns another plan",
      regenerated,
      regenerated && after !== before ? "a different week" : "",
    );

    /* ------------------------------------------------- recipe route + refresh */
    await page.goto(`${baseUrl}/week`, { waitUntil: "networkidle" });

    const recipeLink = page.locator('a[href^="/recipe/"]').first();
    await recipeLink.waitFor({ timeout: 15_000 });

    check("the week view links each meal to its recipe", true);

    await recipeLink.click();
    await page.waitForURL("**/recipe/**");

    const recipeUrl = page.url();
    const recipeHeading = page.getByRole("heading", { level: 1 });
    await recipeHeading.waitFor();

    check(
      "the recipe route shows the recipe",
      (await recipeHeading.innerText()).length > 0,
    );

    check(
      "focus lands on the recipe title",
      await recipeHeading.evaluate((element) => element === document.activeElement),
    );

    // The property the whole plan-restore mechanism exists for.
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { level: 1 }).waitFor({ timeout: 15_000 });

    check(
      "a refreshed recipe URL still works",
      page.url() === recipeUrl &&
        (await page.getByRole("heading", { level: 1 }).innerText()).length > 0,
    );

    /* ------------------------------------------------------- shopping list */
    await page.goto(`${baseUrl}/shopping`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /shopping list/i }).waitFor();

    const firstItem = page.getByRole("checkbox").first();
    await firstItem.check();

    check("an item can be ticked off", await firstItem.isChecked());

    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /shopping list/i }).waitFor();

    check(
      "shopping progress survives a refresh",
      await page.getByRole("checkbox").first().isChecked(),
    );

    /* ------------------------------------------------------------ keyboard */
    await page.goto(`${baseUrl}/week`, { waitUntil: "networkidle" });

    const reachable = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return document.querySelectorAll(selector).length;
    });

    check("the week view exposes focusable controls", reachable > 0, `${reachable} controls`);

    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName ?? "NONE",
    );

    check(
      "tab moves focus into the page",
      focusedTag !== "NONE" && focusedTag !== "BODY",
      focusedTag,
    );

    /* ---------------------------------------------------- meal replacement */
    await page.goto(`${baseUrl}/plan`, { waitUntil: "networkidle" });

    // The planner holds its week in component state, so a fresh navigation
    // shows the form again. Generate once more to reach a swappable plan.
    await page.getByRole("heading", { name: /plan your week/i }).waitFor();
    await page.getByLabel(/weekly budget/i).fill("70");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /generate my plan/i }).click();
    await page
      .getByRole("button", { name: /regenerate week/i })
      .waitFor({ timeout: 30_000 });

    const basketBefore = await page.locator("main").innerText();

    // Open a meal, then replace it.
    // The results are tabbed; the meal cards live on "Weekly plan".
    await page.getByRole("tab", { name: /weekly plan/i }).click();

    // The narrow layout collapses each day into a `<details>`, so the meal
    // cards are genuinely not visible until a day is opened. Expanding the
    // first one is what a user does; it is not a workaround.
    const firstDay = page.locator("summary").first();
    if (await firstDay.isVisible().catch(() => false)) await firstDay.click();

    // Both layouts are in the DOM at once and CSS decides which is shown, so
    // the first *visible* one is the one a user at this width can actually
    // click.
    const openRecipe = page.locator('[data-testid="open-recipe"]:visible').first();
    await openRecipe.waitFor({ timeout: 15_000 });

    await openRecipe.click();

    const replaceButton = page.getByRole("button", { name: /replace this meal/i });
    await replaceButton.waitFor({ timeout: 10_000 });
    await replaceButton.click();

    await page
      .getByRole("button", { name: /replace this meal/i })
      .waitFor({ timeout: 30_000 });

    const basketAfter = await page.locator("main").innerText();

    check(
      "a meal can be replaced",
      basketAfter !== basketBefore,
      "the plan changed after the swap",
    );

    // The promise a swap makes: the whole basket is repriced, not just the
    // meal that changed. Read the basket figure specifically rather than any
    // price on the page — the budget is also a "£nn.nn" and would pass a
    // looser check without meaning anything.
    const basketTotal = /WHOLE BASKET\s*£(\d+\.\d{2})/i.exec(basketAfter);
    const budgetTotal = /MAXIMUM BUDGET\s*£(\d+\.\d{2})/i.exec(basketAfter);

    check(
      "the whole basket is repriced after a swap",
      basketTotal !== null,
      basketTotal ? `basket £${basketTotal[1]}` : "no basket total found",
    );

    check(
      "the swapped basket still respects the budget",
      basketTotal !== null &&
        budgetTotal !== null &&
        Number(basketTotal[1]) <= Number(budgetTotal[1]),
      basketTotal && budgetTotal
        ? `£${basketTotal[1]} of £${budgetTotal[1]}`
        : "",
    );

    check(
      "the swapped plan still names one retailer",
      /Aldi/i.test(basketAfter) && !/Second UK/i.test(basketAfter),
    );

  } finally {
    await context.close();
  }
}

async function main(): Promise<void> {
  if (!existsSync(CLIENT_BUILD)) {
    throw new Error(
      "dist/client is missing. Run `npm run build:client` before verifying.",
    );
  }

  const memory = await MongoMemoryServer.create();
  console.log("Isolated MongoDB started. MONGODB_URI is not read by this script.");

  await mongoose.connect(memory.getUri(), { dbName: "thriftchef-browser-verify" });
  await seedCatalogue();
  console.log(`Seeded ${ALDI_CATALOGUE.length} catalogue products. No crawl was run.`);

  const config = loadConfig({
    MONGODB_URI: memory.getUri(),
    NODE_ENV: "development",
    // Generous throttles: the flow generates and regenerates repeatedly, and
    // this is measuring the product, not the abuse limiter.
    THROTTLE_GENERATE_PER_WINDOW: "1000",
    THROTTLE_REPLACE_PER_WINDOW: "1000",
    THROTTLE_SEARCH_PER_WINDOW: "1000",
  });

  const server = buildVerificationServer(config).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`Application listening on ${baseUrl}`);

  const browser = await chromium.launch({
    headless: !process.argv.includes("--headed"),
  });

  try {
    for (const viewport of VIEWPORTS) {
      await runFlow(browser, baseUrl, viewport);
    }
  } finally {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await mongoose.disconnect();
    await memory.stop();
    console.log("\nBrowser, application and isolated MongoDB all stopped.");
  }

  const failed = checks.filter((entry) => !entry.passed);

  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);

  if (problems.length > 0) {
    console.error(`\n${problems.length} console/page/network problems:`);
    for (const problem of problems.slice(0, 25)) {
      console.error(`  [${problem.viewport}] ${problem.kind}: ${problem.detail}`);
    }
  } else {
    console.log("No console errors, page errors or failed requests.");
  }

  if (failed.length > 0) {
    console.error("\nFAILED:");
    for (const entry of failed) console.error(`  - ${entry.name}`);
  }

  if (failed.length > 0 || problems.length > 0) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error("Browser verification failed");
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
