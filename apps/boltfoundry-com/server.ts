import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { createAppServer } from "@bolt-foundry/app-server";

const isDev = Deno.args.includes("--dev");
const portArg = Deno.args.find((arg) => arg.startsWith("--port="))?.split(
  "=",
)[1];
const envPort = getConfigurationVariable("PORT") ||
  getConfigurationVariable("WEB_PORT");
const port = portArg ? parseInt(portArg) : (envPort ? parseInt(envPort) : 8000);

// In dev mode, Vite runs on port + 2000 (as configured in app.bft.ts)
const vitePort = isDev ? port + 2000 : 5173;

const server = createAppServer({
  port,
  isDev,
  distPath: new URL(import.meta.resolve("./dist")).pathname,
  viteDevServerUrl: `http://localhost:${vitePort}`,
  enableSpaFallback: true,
});

// Handle graceful shutdown
addEventListener("beforeunload", async () => {
  await server.stop();
});

await server.start();
