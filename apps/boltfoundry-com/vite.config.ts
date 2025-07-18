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
      port: 8081, // Dynamic port will be set by CLI
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: new URL(import.meta.resolve("./ClientRoot.tsx")).pathname,
      output: {
        dir: new URL(import.meta.resolve("./static/build")).pathname,
        entryFileNames: "ClientRoot.js",
        format: "es",
      },
    },
  },
  resolve: {
    alias: {
      "@bfmono/": "../../..",
      "@bfmono/static/": "../../../static/",
    },
  },
  publicDir: new URL(import.meta.resolve("../../../static")).pathname,
});
