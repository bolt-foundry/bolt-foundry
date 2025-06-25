import { isographAppRoutes } from "@bfmono/apps/boltFoundry/routes.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { handleIsographRoute } from "@bfmono/apps/web/handlers/routeHandlers.ts";
import type { Handler } from "@bfmono/apps/web/web.tsx";

const logger = getLogger(import.meta);

/**
 * Registers isograph-based application routes from apps/boltFoundry/routes.ts
 */
export function registerIsographRoutes(routes: Map<string, Handler>): void {
  // Register isograph routes
  for (const [path, entrypoint] of isographAppRoutes.entries()) {
    logger.debug(`Registering ${path}`, entrypoint);
    routes.set(path, async function AppRoute(request, routeParams) {
      return await handleIsographRoute(request, routeParams, path, entrypoint);
    });
  }
}
