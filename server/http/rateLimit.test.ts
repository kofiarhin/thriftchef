import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import { createRateLimiter } from "./rateLimit";
import { errorHandler } from "./errors";
import { startTestServer, type TestServer } from "../testing/httpTestServer";

/**
 * A controllable clock keeps the window-expiry test instant instead of making
 * the suite wait a real minute.
 */
function buildServer(
  options: { windowMs: number; max: number },
  clock: { value: number },
): Promise<TestServer> {
  const app = express();

  app.post(
    "/limited",
    createRateLimiter({ ...options, now: () => clock.value }),
    (_request, response) => {
      response.json({ ok: true });
    },
  );
  app.use(errorHandler);

  return startTestServer(app);
}

describe("createRateLimiter", () => {
  it("allows requests up to the limit and rejects the next one", async () => {
    const clock = { value: 0 };
    const server = await buildServer({ windowMs: 60_000, max: 3 }, clock);

    try {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        const response = await server.fetch("/limited", { method: "POST" });
        assert.equal(response.status, 200, `request ${attempt} should pass`);
      }

      const blocked = await server.fetch("/limited", { method: "POST" });
      assert.equal(blocked.status, 429);

      const body = (await blocked.json()) as {
        error: { code: string; details: { retryAfterSeconds: number } };
      };
      assert.equal(body.error.code, "RATE_LIMITED");
      assert.ok(body.error.details.retryAfterSeconds > 0);
      assert.equal(blocked.headers.get("retry-after"), "60");
    } finally {
      await server.close();
    }
  });

  it("reports how many requests remain", async () => {
    const clock = { value: 0 };
    const server = await buildServer({ windowMs: 60_000, max: 2 }, clock);

    try {
      const first = await server.fetch("/limited", { method: "POST" });
      assert.equal(first.headers.get("ratelimit-limit"), "2");
      assert.equal(first.headers.get("ratelimit-remaining"), "1");

      const second = await server.fetch("/limited", { method: "POST" });
      assert.equal(second.headers.get("ratelimit-remaining"), "0");
    } finally {
      await server.close();
    }
  });

  it("lets the caller through again once the window has passed", async () => {
    const clock = { value: 0 };
    const server = await buildServer({ windowMs: 60_000, max: 1 }, clock);

    try {
      assert.equal((await server.fetch("/limited", { method: "POST" })).status, 200);
      assert.equal((await server.fetch("/limited", { method: "POST" })).status, 429);

      clock.value += 60_001;

      assert.equal(
        (await server.fetch("/limited", { method: "POST" })).status,
        200,
        "the window should have reset",
      );
    } finally {
      await server.close();
    }
  });

  it("uses the shared error shape so the client can handle it uniformly", async () => {
    const clock = { value: 0 };
    const server = await buildServer({ windowMs: 60_000, max: 0 }, clock);

    try {
      const response = await server.fetch("/limited", { method: "POST" });
      const body = (await response.json()) as Record<string, unknown>;

      assert.deepEqual(Object.keys(body), ["error"]);
      assert.deepEqual(
        Object.keys(body.error as Record<string, unknown>).sort(),
        ["code", "details", "message"],
      );
    } finally {
      await server.close();
    }
  });
});
