import { isographAppRoutes } from "packages/app/routes.ts";
import { getLogger } from "packages/logger.ts";
import { handleIsographRoute } from "packages/web/handlers/routeHandlers.ts";
import type { Handler } from "packages/web/web.tsx";

const logger = getLogger(import.meta);

/**
 * Registers isograph-based application routes from packages/app/routes.ts
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
