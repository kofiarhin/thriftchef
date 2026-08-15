import type { AddressInfo } from "node:net";
import type { Express } from "express";
import type { AppConfig } from "../config/env";
import { loadConfig } from "../config/env";

/**
 * Tests exercise the API over real HTTP rather than a request-mocking library:
 * body-size limits, CORS and the JSON error middleware only behave correctly
 * on a live socket, and those are exactly the behaviours worth pinning down.
 */
export function testConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    ...loadConfig({
      MONGODB_URI: "mongodb://localhost:27017/thriftchef-test",
      NODE_ENV: "test",
      NVIDIA_API_KEY: "test-key",
      NVIDIA_API_URL: "https://integrate.api.nvidia.com/v1/chat/completions",
      NVIDIA_MODEL: "nvidia/test-model",
    }),
    ...overrides,
  };
}

export interface TestServer {
  url: string;
  fetch: (path: string, init?: RequestInit) => Promise<Response>;
  close: () => Promise<void>;
}

export async function startTestServer(app: Express): Promise<TestServer> {
  const server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address() as AddressInfo;
  const url = `http://127.0.0.1:${port}`;

  return {
    url,
    fetch: (path, init) => fetch(`${url}${path}`, init),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
