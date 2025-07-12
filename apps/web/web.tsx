#! /usr/bin/env -S deno run --allow-net=localhost:8000 --allow-env

import {
  getConfigurationVariable,
  warmSecrets,
} from "@bolt-foundry/get-configuration-var";
import {
  defaultRoute,
  registerAllRoutes,
} from "@bfmono/apps/web/routes/routeRegistry.ts";
import { handleRequest } from "@bfmono/apps/web/handlers/mainHandler.ts";

// Warm the secrets cache before starting auto-refresh
const warmPromise = warmSecrets();

export type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;

// Register all routes
const routes = registerAllRoutes();

// Main request handler wrapper
async function handleRequestWrapper(req: Request): Promise<Response> {
  await warmPromise;
  return await handleRequest(req, routes, defaultRoute);
}

// Use the port from environment or default 8000
const port = Number(getConfigurationVariable("WEB_PORT") ?? 8000);

// Start the server if this is the main module
if (import.meta.main) {
  Deno.serve({ port }, handleRequestWrapper);
}
