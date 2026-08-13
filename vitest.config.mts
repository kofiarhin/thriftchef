import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["client/src/**/*.test.{ts,tsx}"],
    setupFiles: ["client/src/testing/setup.ts"],
    css: false,
  },
});
