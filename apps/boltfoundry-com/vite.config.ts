import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    react({ babel: { babelrc: true } }),
  ],
  define: {
    "globalThis.__ENVIRONMENT__": JSON.stringify({
      GOOGLE_OAUTH_CLIENT_ID: getConfigurationVariable(
        "GOOGLE_OAUTH_CLIENT_ID",
      ),
    }),
  },
  server: {
    port: 8080,
    hmr: {
      port: 5001, // Dynamic port will be set by CLI
    },
  },
  preview: {
    port: 8081,
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
      "@bfmono/": new URL(import.meta.resolve("@bfmono/")).pathname,
      "@bfmono/static/":
        new URL(import.meta.resolve("@bfmono/static/")).pathname,
    },
  },
  publicDir: new URL(import.meta.resolve("@bfmono/static/")).pathname,
});
