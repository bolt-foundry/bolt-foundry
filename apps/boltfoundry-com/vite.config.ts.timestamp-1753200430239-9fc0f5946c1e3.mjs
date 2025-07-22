// vite.config.ts
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { defineConfig } from "file:///home/runner/workspace/node_modules/.deno/vite@6.3.5_1/node_modules/vite/dist/node/index.js";
import deno from "file:///home/runner/workspace/node_modules/.deno/@deno+vite-plugin@1.0.5_1/node_modules/@deno/vite-plugin/dist/index.js";
import react from "file:///home/runner/workspace/node_modules/.deno/@vitejs+plugin-react@4.6.0_1/node_modules/@vitejs/plugin-react/dist/index.mjs";
var replitDomain = Deno.env.get("REPLIT_DEV_DOMAIN");
var allowedHosts = replitDomain ? [replitDomain] : void 0;
var vite_config_default = defineConfig({
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
      port: 8081,
      // Dynamic port will be set by CLI
    },
    allowedHosts,
  },
  preview: {
    port: 8081,
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: new URL(import.meta.resolve("./ClientRoot.tsx")).pathname,
      output: {
        dir: new URL(import.meta.resolve("@bfmono/build")).pathname,
        // entryFileNames: "ClientRoot.js",
        format: "es",
      },
    },
  },
  resolve: {
    alias: {
      "@bfmono/": new URL(import.meta.resolve("@bfmono/")).pathname,
      // "@bfmono/static/":
      //   new URL(import.meta.resolve("@bfmono/static/")).pathname,
    },
  },
  publicDir: new URL(import.meta.resolve("@bfmono/static/")).pathname,
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlUm9vdCI6ICIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcHMvYm9sdGZvdW5kcnktY29tLyIsCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHBzL2JvbHRmb3VuZHJ5LWNvbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHBzL2JvbHRmb3VuZHJ5LWNvbS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcHMvYm9sdGZvdW5kcnktY29tL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZ2V0Q29uZmlndXJhdGlvblZhcmlhYmxlIH0gZnJvbSBcIkBib2x0LWZvdW5kcnkvZ2V0LWNvbmZpZ3VyYXRpb24tdmFyXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGRlbm8gZnJvbSBcIkBkZW5vL3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5cbmNvbnN0IHJlcGxpdERvbWFpbiA9IERlbm8uZW52LmdldChcIlJFUExJVF9ERVZfRE9NQUlOXCIpO1xuY29uc3QgYWxsb3dlZEhvc3RzID0gcmVwbGl0RG9tYWluID8gW3JlcGxpdERvbWFpbl0gOiB1bmRlZmluZWQ7XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIGRlbm8oKSxcbiAgICByZWFjdCh7IGJhYmVsOiB7IGJhYmVscmM6IHRydWUgfSB9KSxcbiAgXSxcbiAgZGVmaW5lOiB7XG4gICAgXCJnbG9iYWxUaGlzLl9fRU5WSVJPTk1FTlRfX1wiOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBHT09HTEVfT0FVVEhfQ0xJRU5UX0lEOiBnZXRDb25maWd1cmF0aW9uVmFyaWFibGUoXG4gICAgICAgIFwiR09PR0xFX09BVVRIX0NMSUVOVF9JRFwiLFxuICAgICAgKSxcbiAgICB9KSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogODA4MCxcbiAgICBobXI6IHtcbiAgICAgIHBvcnQ6IDgwODEsIC8vIER5bmFtaWMgcG9ydCB3aWxsIGJlIHNldCBieSBDTElcbiAgICB9LFxuICAgIGFsbG93ZWRIb3N0cyxcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDgwODEsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IG5ldyBVUkwoaW1wb3J0Lm1ldGEucmVzb2x2ZShcIi4vQ2xpZW50Um9vdC50c3hcIikpLnBhdGhuYW1lLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGRpcjogbmV3IFVSTChpbXBvcnQubWV0YS5yZXNvbHZlKFwiQGJmbW9uby9idWlsZFwiKSkucGF0aG5hbWUsXG4gICAgICAgIC8vIGVudHJ5RmlsZU5hbWVzOiBcIkNsaWVudFJvb3QuanNcIixcbiAgICAgICAgZm9ybWF0OiBcImVzXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAYmZtb25vL1wiOiBuZXcgVVJMKGltcG9ydC5tZXRhLnJlc29sdmUoXCJAYmZtb25vL1wiKSkucGF0aG5hbWUsXG4gICAgICAvLyBcIkBiZm1vbm8vc3RhdGljL1wiOlxuICAgICAgLy8gICBuZXcgVVJMKGltcG9ydC5tZXRhLnJlc29sdmUoXCJAYmZtb25vL3N0YXRpYy9cIikpLnBhdGhuYW1lLFxuICAgIH0sXG4gIH0sXG4gIHB1YmxpY0RpcjogbmV3IFVSTChpbXBvcnQubWV0YS5yZXNvbHZlKFwiQGJmbW9uby9zdGF0aWMvXCIpKS5wYXRobmFtZSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLGdDQUFnQztBQUM1VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBRWxCLElBQU0sZUFBZSxLQUFLLElBQUksSUFBSSxtQkFBbUI7QUFDckQsSUFBTSxlQUFlLGVBQWUsQ0FBQyxZQUFZLElBQUk7QUFHckQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEtBQUssRUFBRSxDQUFDO0FBQUEsRUFDcEM7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLDhCQUE4QixLQUFLLFVBQVU7QUFBQSxNQUMzQyx3QkFBd0I7QUFBQSxRQUN0QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUE7QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxVQUFVO0FBQUEsSUFDVixlQUFlO0FBQUEsTUFDYixPQUFPLElBQUksSUFBSSxZQUFZLFFBQVEsa0JBQWtCLENBQUMsRUFBRTtBQUFBLE1BQ3hELFFBQVE7QUFBQSxRQUNOLEtBQUssSUFBSSxJQUFJLFlBQVksUUFBUSxlQUFlLENBQUMsRUFBRTtBQUFBO0FBQUEsUUFFbkQsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsWUFBWSxJQUFJLElBQUksWUFBWSxRQUFRLFVBQVUsQ0FBQyxFQUFFO0FBQUE7QUFBQTtBQUFBLElBR3ZEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsV0FBVyxJQUFJLElBQUksWUFBWSxRQUFRLGlCQUFpQixDQUFDLEVBQUU7QUFDN0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
