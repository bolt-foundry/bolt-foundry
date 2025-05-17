import { getLogger } from "packages/logger/logger.ts";
import { handleMatchedRoute } from "apps/web/handlers/requestHandler.ts";
import { serveStaticFiles } from "apps/web/handlers/staticHandler.ts";
import type { Handler } from "apps/web/web.tsx";
import { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";

const logger = getLogger(import.meta);

/**
 * Main request handler
 */
export async function handleRequest(
  req: Request,
  routes: Map<string, Handler>,
  defaultRoute: () => Response,
): Promise<Response> {
  let res: Response | null;

  const incomingUrl = new URL(req.url);
  const timer = performance.now();
  const resHeaders = new Headers();
  // Use the new synchronous fromRequest method
  const currentViewer = CurrentViewer.fromRequest(req);

  const staticPrefix = "/static";
  if (incomingUrl.pathname.startsWith(staticPrefix)) {
    res = await serveStaticFiles(req);
  } else {
    try {
      // Keep the query string, so we pass "pathname + search" to matchRoute
      const pathWithParams = incomingUrl.pathname + incomingUrl.search;

      // Handle the route
      res = await handleMatchedRoute(
        req,
        pathWithParams,
        routes,
        defaultRoute,
      );
      // Add any headers from the current viewer
      resHeaders.forEach((value, key) => {
        res?.headers.set(key, value);
      });
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
    } (${perfInMs}ms) - ${currentViewer}`,
  );

  return res;
}
