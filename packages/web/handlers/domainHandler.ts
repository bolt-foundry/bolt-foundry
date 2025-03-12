import { getLogger } from "packages/logger.ts";
import type { Handler } from "packages/web/web.tsx";
import { matchRoute } from "packages/web/handlers/requestHandler.ts";

const logger = getLogger(import.meta);

/**
 * Handles domain-specific routing
 */
export async function handleDomains(
  req: Request,
  routes: Map<string, Handler>,
): Promise<Response | null> {
  const reqUrl = new URL(req.url);
  const domain = Deno.env.get("SERVE_PROJECT") ?? reqUrl.hostname;

  if (domain === "biglittletech.ai") {
    const pathWithParams = `/biglittletech.ai`;
    const [handler, routeParams] = matchRoute(
      pathWithParams,
      routes,
      () => new Response("Not found™", { status: 404 }),
    );

    return await handler(req, routeParams);
  }

  return null;
}
