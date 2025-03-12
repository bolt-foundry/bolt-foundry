import { getLogger } from "packages/logger.ts";
import { Handler } from "packages/web/web.tsx";
import { matchRoute } from "./requestHandler.ts";

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
    logger.setLevel(logger.levels.DEBUG);
    logger.debug(routes, routes.get(pathWithParams));
    logger.resetLevel();

    const [handler, routeParams] = matchRoute(
      pathWithParams,
      routes,
      () => new Response("Not found™", { status: 404 }),
    );

    return await handler(req, routeParams);
  }

  return null;
}
