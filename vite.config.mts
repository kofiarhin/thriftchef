import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_PORT = process.env.PORT ?? "5000";

export default defineConfig({
  root: "client",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // The browser talks to the dev server only, so no CORS setup is needed
    // locally and the client can use relative /api paths in every environment.
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
