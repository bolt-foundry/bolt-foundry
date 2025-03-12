#! /usr/bin/env -S deno run --allow-net=localhost:8000 --allow-env

import { serveDir } from "@std/http";
import { appRoutes, isographAppRoutes } from "packages/app/routes.ts";
import { graphQLHandler } from "packages/graphql/graphqlServer.ts";
import { getLogger } from "packages/logger.ts";
import { matchRouteWithParams } from "packages/app/contexts/RouterContext.tsx";
import { getConfigurationVariable } from "packages/getConfigurationVariable.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { initializeContentCollections } from "packages/web/initializeContent.ts";
import { DeploymentEnvs } from "packages/app/constants/deploymentEnvs.ts";
import {
  handleAppRoute,
  handleAssemblyAI,
  handleIsographRoute,
  handleLogout,
} from "packages/web/handlers/routeHandlers.ts";

const logger = getLogger(import.meta);

export type Handler = (
  request: Request,
  routeParams: Record<string, string>,
) => Promise<Response> | Response;

const routes = new Map<string, Handler>();

// Optionally remove UI route from non-dev environments
if (getConfigurationVariable("BF_ENV") !== DeploymentEnvs.DEVELOPMENT) {
  appRoutes.delete("/ui");
}

// Register each app route in the routes Map
for (const entry of appRoutes.entries()) {
  const [path] = entry;
  routes.set(path, async function AppRoute(request, routeParams) {
    return await handleAppRoute(request, routeParams, path);
  });
}

// Register isograph routes
for (const [path, entrypoint] of isographAppRoutes.entries()) {
  logger.debug(`Registering ${path}`, entrypoint);
  routes.set(path, async function AppRoute(request, routeParams) {
    return await handleIsographRoute(request, routeParams, path, entrypoint);
  });
}

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

// Fallback default route
function defaultRoute() {
  return new Response("Not found™", { status: 404 });
}

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

// Initialize content collections
const contentInitCv = BfCurrentViewer
  .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createOmni(import.meta);

// Initialize content collections
const contentPromise = initializeContentCollections(contentInitCv);

const staticPrefix = "/static";
function staticHandler(req: Request) {
  return serveDir(req, {
    headers: [
      "Cache-Control: public, must-revalidate",
      "ETag: true",
    ],
  });
}

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

// Use the port from environment or default 8000
const port = Number(Deno.env.get("WEB_PORT") ?? 8000);

if (import.meta.main) {
  Deno.serve({ port }, async (req) => {
    let res;

    const incomingUrl = new URL(req.url);
    const timer = performance.now();
    const resHeaders = new Headers();
    res = await handleDomains(req);
    if (res) {
      return res;
    }
    using cv = BfCurrentViewer.createFromRequest(import.meta, req, resHeaders);

    if (incomingUrl.pathname.startsWith(staticPrefix)) {
      res = await staticHandler(req);
    } else {
      try {
        // Keep the query string, so we pass "pathname + search" to matchRoute
        const pathWithParams = incomingUrl.pathname + incomingUrl.search;
        const [handler, routeParams, needsRedirect, redirectTo] = matchRoute(
          pathWithParams,
        );

        if (needsRedirect && redirectTo) {
          // Canonicalize trailing slash mismatch with a permanent redirect
          // (could use 302 if you prefer)
          const redirectUrl = new URL(redirectTo, req.url);
          return Response.redirect(redirectUrl, 301);
        }

        await contentPromise;

        res = await handler(req, routeParams);

        // Optionally set security headers, etc.
        // if (getConfigurationVariable("BF_ENV") !== DeploymentEnvs.DEVELOPMENT) {
        //   res.headers.set("X-Frame-Options", "DENY");
        //   res.headers.set(
        //     "Content-Security-Policy",
        //     "frame-ancestors 'self' replit.dev",
        //   );
        // }
      } catch (err) {
        logger.error("Error handling request:", err);
        res = new Response("Internal Server Error", { status: 500 });
      }
    }

    const perf = performance.now() - timer;
    const perfInMs = Math.round(perf);
    logger.info(
      `[${
        new Date().toISOString()
      }] [${req.method}] ${res.status} ${incomingUrl} ${
        req.headers.get("content-type") ?? ""
      } (${perfInMs}ms) - ${cv}`,
    );

    // resHeaders.forEach((value, key) => {
    //   res.headers.set(key, value);
    // });

    return res;
  });
}
