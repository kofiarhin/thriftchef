import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createApp, SERVICE_NAME, SERVICE_VERSION } from "./app";
import {
  startTestServer,
  testConfig,
  type TestServer,
} from "./testing/httpTestServer";

describe("API skeleton", () => {
  let server: TestServer;

  before(async () => {
    server = await startTestServer(createApp(testConfig()));
  });

  after(async () => {
    await server.close();
  });

  it("reports service health", async () => {
    const response = await server.fetch("/api/health");

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      ok: true,
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
    });
  });

  it("returns a correlation id on every response", async () => {
    const response = await server.fetch("/api/health");
    assert.match(response.headers.get("x-request-id") ?? "", /[0-9a-f-]{36}/);
  });

  it("answers unknown API routes with the shared error shape", async () => {
    const response = await server.fetch("/api/does-not-exist");

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: { code: "NOT_FOUND", message: "Route not found." },
    });
  });

  it("rejects a body above the 100kb limit", async () => {
    const response = await server.fetch("/api/meal-plans/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ padding: "x".repeat(200_000) }),
    });

    assert.equal(response.status, 413);
    const body = (await response.json()) as { error: { code: string } };
    assert.equal(body.error.code, "PAYLOAD_TOO_LARGE");
  });

  it("rejects malformed JSON without leaking parser internals", async () => {
    const response = await server.fetch("/api/meal-plans/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{ not json",
    });

    assert.equal(response.status, 400);
    const body = (await response.json()) as {
      error: { code: string; message: string };
    };
    assert.equal(body.error.code, "INVALID_REQUEST");
    assert.equal(body.error.message, "The request body is not valid JSON.");
  });
});
