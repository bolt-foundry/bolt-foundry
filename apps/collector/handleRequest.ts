import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { Handler } from "@bfmono/lib/types/Handler.ts";

const logger = getLogger(import.meta);

/**
 * Simple request handler for the collector service
 */
export async function handleRequest(
  req: Request,
  routes: Map<string, Handler>,
  defaultRoute: () => Response,
): Promise<Response> {
  const incomingUrl = new URL(req.url);
  const timer = performance.now();

  try {
    // Find matching route
    const handler = routes.get(incomingUrl.pathname);

    if (handler) {
      const res = await handler(req, {});

      // Log request timing and details
      const perf = performance.now() - timer;
      const perfInMs = Math.round(perf);
      logger.info(
        `[${
          new Date().toISOString()
        }] [${req.method}] ${res.status} ${incomingUrl} (${perfInMs}ms)`,
      );

      return res;
    }

    // No matching route, use default
    return defaultRoute();
  } catch (err) {
    logger.error("Error handling request:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
