import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [
    deno(),
    react({
      babel: {
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@bfmono/": new URL(import.meta.resolve("../../")).pathname,
      "@iso": new URL(import.meta.resolve("./src/__isograph")).pathname,
    },
  },
  publicDir: "../../static",
  server: {
    hmr: {
      port: Number(getConfigurationVariable("VITE_HMR_PORT")) || 5173,
    },
    proxy: {
      "/api": {
        target: "http://localhost:9999",
        changeOrigin: true,
      },
    },
  },
});
