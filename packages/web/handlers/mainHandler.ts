import { getLogger } from "packages/logger.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { handleDomains } from "packages/web/handlers/domainHandler.ts";
import { handleMatchedRoute } from "packages/web/handlers/requestHandler.ts";
import { serveStaticFiles } from "packages/web/handlers/staticHandler.ts";
import type { Handler } from "packages/web/web.tsx";
import { bfLlmRouter } from "packages/bfLlmRouter/bfLlmRouter.ts";

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
  let res: Response | null;

  const incomingUrl = new URL(req.url);
  const timer = performance.now();
  const resHeaders = new Headers();
  // Create current viewer
  using cv = BfCurrentViewer.createFromRequest(import.meta, req, resHeaders);

  if (incomingUrl.pathname.startsWith("/api")) {
    res = await bfLlmRouter(req);
  }

  // Check domain-specific routing first
  res ??= await handleDomains(req);
  if (!res) {
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

  return res;
}
