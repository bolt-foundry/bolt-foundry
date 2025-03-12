import { appRoutes } from "packages/app/routes.ts";
import { getConfigurationVariable } from "packages/getConfigurationVariable.ts";
import { DeploymentEnvs } from "packages/app/constants/deploymentEnvs.ts";
import { handleAppRoute } from "packages/web/handlers/routeHandlers.ts";
import type { Handler } from "packages/web/web.tsx";

/**
 * Registers standard application routes from packages/app/routes.ts
 */
export function registerAppRoutes(routes: Map<string, Handler>): void {
  // Optionally remove UI route from non-dev environments
  const appRoutesMap = new Map(appRoutes);
  if (getConfigurationVariable("BF_ENV") !== DeploymentEnvs.DEVELOPMENT) {
    appRoutesMap.delete("/ui");
  }

  // Register each app route in the routes Map
  for (const [path] of appRoutesMap.entries()) {
    routes.set(path, async function AppRoute(request, routeParams) {
      return await handleAppRoute(request, routeParams, path);
    });
  }
}
