import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react()],
  resolve: {
    alias: {
      "@bfmono/": new URL("../../../", import.meta.url).pathname,
    },
  },
});
