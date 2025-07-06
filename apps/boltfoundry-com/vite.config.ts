import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    react({ babel: { babelrc: true } }),
  ],
  server: {
    hmr: {
      port: 5001, // Dynamic port will be set by CLI
    },
  },
  resolve: {
    alias: {
      "@bfmono/": new URL(import.meta.resolve("../../../")).pathname,
    },
  },
  publicDir: new URL(import.meta.resolve("../../../static")).pathname,
});
