import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Simplified config for Phase 1 hello world
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: new URL(import.meta.resolve("@bfmono/build")).pathname +
      "/boltFoundry-com",
  },
  server: {
    hmr: {
      port: 24678,
    },
  },
  resolve: {
    alias: {
      "@bfmono/": new URL(import.meta.resolve("@bfmono/")).pathname,
    },
  },
  publicDir: new URL(import.meta.resolve("@bfmono/static")).pathname,
});
