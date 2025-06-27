import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    react(),
  ],
  resolve: {
    alias: {
      "@bfmono/": new URL("../../../", import.meta.url).pathname,
      "@iso": new URL("./src/__isograph/iso.ts", import.meta.url).pathname,
    },
  },
  optimizeDeps: {
    include: ["@isograph/react"],
  },
  publicDir: new URL(import.meta.resolve("@bfmono/static")).pathname,
});
