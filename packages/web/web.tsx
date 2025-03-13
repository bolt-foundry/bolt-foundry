#! /usr/bin/env -S deno run --allow-net=localhost:8000 --allow-env

import { getLogger } from "packages/logger.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { initializeContentCollections } from "packages/web/initializeContent.ts";
import {
  defaultRoute,
  registerAllRoutes,
} from "packages/web/routes/routeRegistry.ts";
import { handleRequest } from "packages/web/handlers/mainHandler.ts";

const _logger = getLogger(import.meta);

export type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;

// Register all routes
const routes = registerAllRoutes();

// Main request handler wrapper
async function handleRequestWrapper(req: Request): Promise<Response> {
  return await handleRequest(req, routes, defaultRoute, Promise.resolve());
}

// Use the port from environment or default 8000
const port = Number(Deno.env.get("WEB_PORT") ?? 8000);

// Start the server if this is the main module
if (import.meta.main) {
  Deno.serve({ port }, handleRequestWrapper);
}
