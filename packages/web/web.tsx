#! /usr/bin/env -S deno run --allow-net=localhost:8000 --allow-env

import { serveDir } from "@std/http";
import { getLogger } from "packages/logger.ts";
import { getConfigurationVariable } from "packages/getConfigurationVariable.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { DeploymentEnvs } from "packages/app/constants/deploymentEnvs.ts";
import { initializeContentCollections } from "packages/web/initializeContent.ts";
import { registerAppRoutes } from "packages/web/routes/appRoutes.ts";
import { registerIsographRoutes } from "packages/web/routes/isographRoutes.ts";
import { handleMatchedRoute } from "packages/web/handlers/requestHandler.ts";
import { serveStaticFiles } from "packages/web/handlers/staticHandler.ts";

const logger = getLogger(import.meta);

export type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;

// Initialize routes map
const routes = new Map<string, Handler>();

// Register all routes
function registerAllRoutes() {
  // Register standard app routes
  registerAppRoutes(routes);

  // Register isograph routes
  registerIsographRoutes(routes);

  // Register special routes from handlers/specialRoutes.ts
  registerSpecialRoutes(routes);
}

import { graphQLHandler } from "packages/graphql/graphqlServer.ts";
import {
  handleAssemblyAI,
  handleLogout,
} from "packages/web/handlers/routeHandlers.ts";
// Register special routes (GraphQL, static files, etc.)
function registerSpecialRoutes(routes: Map<string, Handler>) {
  // Import special route handlers

  // Serve static files
  routes.set("/static/:filename+", function staticHandler(req) {
    return serveDir(req, {
      headers: [
        "Cache-Control: public, must-revalidate",
        "ETag: true",
      ],
    });
  });

  // GraphQL handler
  routes.set("/graphql", graphQLHandler);

  // AssemblyAI handler
  routes.set("/assemblyai", handleAssemblyAI);

  // Simple logout route that clears cookies
  routes.set("/logout", handleLogout);
}

// Fallback default route
function defaultRoute() {
  return new Response("Not found™", { status: 404 });
}

// Initialize content collections
const contentInitCv = BfCurrentViewer
  .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createOmni(import.meta);

// Initialize content collections
const contentPromise = initializeContentCollections(contentInitCv);

// Handle domain-specific routing
async function handleDomains(req: Request) {
  const reqUrl = new URL(req.url);
  const domain = Deno.env.get("SERVE_PROJECT") ?? reqUrl.hostname;
  if (domain === "biglittletech.ai") {
    const pathWithParams = `/biglittletech.ai`;
    logger.setLevel(logger.levels.DEBUG);
    logger.debug(routes, routes.get(pathWithParams));
    logger.resetLevel();
    const [handler, routeParams] = matchRoute(
      pathWithParams,
    );
    return await handler(req, routeParams);
  }
  return null;
}

// Main request handler
async function handleRequest(req: Request): Promise<Response> {
  let res;

  const incomingUrl = new URL(req.url);
  const timer = performance.now();
  const resHeaders = new Headers();

  // Check domain-specific routing first
  res = await handleDomains(req);
  if (res) {
    return res;
  }

  // Create current viewer
  using cv = BfCurrentViewer.createFromRequest(import.meta, req, resHeaders);

  const staticPrefix = "/static";
  if (incomingUrl.pathname.startsWith(staticPrefix)) {
    res = await serveStaticFiles(req);
  } else {
    try {
      // Keep the query string, so we pass "pathname + search" to matchRoute
      const pathWithParams = incomingUrl.pathname + incomingUrl.search;

      // Wait for content to be initialized
      await contentPromise;

      // Handle the route
      res = await handleMatchedRoute(req, pathWithParams, routes, defaultRoute);
    } catch (err) {
      logger.error("Error handling request:", err);
      res = new Response("Internal Server Error", { status: 500 });
    }
  }

  // Log request timing and details
  const perf = performance.now() - timer;
  const perfInMs = Math.round(perf);
  logger.info(
    `[${
      new Date().toISOString()
    }] [${req.method}] ${res.status} ${incomingUrl} ${
      req.headers.get("content-type") ?? ""
    } (${perfInMs}ms) - ${cv}`,
  );

  // Add any headers from the current viewer
  resHeaders.forEach((value, key) => {
    res.headers.set(key, value);
  });

  return res;
}

// Register all routes
registerAllRoutes();

// Use the port from environment or default 8000
const port = Number(Deno.env.get("WEB_PORT") ?? 8000);

// Start the server if this is the main module
if (import.meta.main) {
  Deno.serve({ port }, handleRequest);
}

import { matchRouteWithParams } from "packages/app/contexts/RouterContext.tsx";
/**
 * If there's a mismatch in trailing slash (e.g. user typed "/foo" but route is "/foo/"),
 * `matchRouteWithParams` sets `needsRedirect=true` and `redirectTo="/foo/"`.
 */
function matchRoute(
  pathWithParams: string,
): [Handler, Record<string, string>, boolean, string?] {
  const match = matchRouteWithParams(pathWithParams);
  const matchedHandler = routes.get(match.pathTemplate) || defaultRoute;
  const routeParams = match.routeParams;
  const needsRedirect = match.needsRedirect;
  const redirectTo = match.redirectTo;
  return [matchedHandler, routeParams, needsRedirect, redirectTo];
}
