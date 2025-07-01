import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { handleMatchedRoute } from "@bfmono/apps/web/handlers/requestHandler.ts";
import { serveStaticFiles } from "@bfmono/apps/web/handlers/staticHandler.ts";
import type { Handler } from "@bfmono/apps/web/web.tsx";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

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
  // todo: this might be a good place for "using" so we don't leak cvs.
  const cvPromise = CurrentViewer.createFromRequest(
    import.meta,
    req,
    resHeaders,
  );

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
  const cv = await cvPromise;
  logger.info(
    `[${
      new Date().toISOString()
    }] [${req.method}] ${res.status} ${incomingUrl} ${
      req.headers.get("content-type") ?? ""
    } (${perfInMs}ms) - ${cv}`,
  );

  return res;
}
