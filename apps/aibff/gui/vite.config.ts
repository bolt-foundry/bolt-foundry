import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    react({
      babel: {
        babelrc: true,
      },
    }),
  ],
  server: {
    hmr: (() => {
      // Get HMR port from environment variable if set
      const hmrPort = getConfigurationVariable("VITE_HMR_PORT");
      if (hmrPort) {
        return { port: parseInt(hmrPort) };
      }
      // Let Vite auto-assign port
      return true;
    })(),
  },
  resolve: {
    alias: {
      "@bfmono/": new URL(import.meta.resolve("../../../")).pathname,
      "@iso": new URL(import.meta.resolve("./src/__isograph/iso.ts")).pathname,
    },
  },
  optimizeDeps: {
    include: ["@isograph/react"],
  },
  publicDir: new URL(import.meta.resolve("@bfmono/static")).pathname,
});
