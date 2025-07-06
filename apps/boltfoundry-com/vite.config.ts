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
  server: {
    hmr: {
      port: parseInt(getConfigurationVariable("VITE_HMR_PORT") || "5174"),
    },
  },
  resolve: {
    alias: {
      "@bfmono/": "../../../",
    },
  },
  publicDir: "../../../static", // Shared static assets from monorepo root
});
