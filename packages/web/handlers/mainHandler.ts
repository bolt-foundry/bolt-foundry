import { getLogger } from "packages/logger.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";
import { handleMatchedRoute } from "packages/web/handlers/requestHandler.ts";
import { serveStaticFiles } from "packages/web/handlers/staticHandler.ts";
import type { Handler } from "packages/web/web.tsx";

const logger = getLogger(import.meta);

/**
 * Main request handler
 */
export async function handleRequest(
  req: Request,
  routes: Map<string, Handler>,
  defaultRoute: () => Response,
  contentPromise: Promise<unknown>,
): Promise<Response> {
  let res;

  const incomingUrl = new URL(req.url);
  const timer = performance.now();
  const resHeaders = new Headers();

  // Check domain-specific routing first
  res = await handleDomains(req, routes);
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
