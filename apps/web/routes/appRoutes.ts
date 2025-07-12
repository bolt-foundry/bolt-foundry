import { appRoutes } from "@bfmono/apps/boltFoundry/routes.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { DeploymentEnvs } from "@bfmono/infra/constants/deploymentEnvs.ts";
import { handleAppRoute } from "@bfmono/apps/web/handlers/routeHandlers.ts";
import type { Handler } from "@bfmono/apps/web/web.tsx";

/**
 * Registers standard application routes from apps/boltFoundry/routes.ts
 */
export function registerAppRoutes(routes: Map<string, Handler>): void {
  // Optionally remove UI route from non-dev environments
  const appRoutesMap = new Map(appRoutes);
  if (getConfigurationVariable("BF_ENV") !== DeploymentEnvs.DEVELOPMENT) {
    // This doesn't seem to work, it blocks the route in DEV
    // appRoutesMap.delete("/ui");
  }

  // Register each app route in the routes Map
  for (const [path] of appRoutesMap.entries()) {
    routes.set(path as string, async function AppRoute(request, routeParams) {
      return await handleAppRoute(request, routeParams, path as string);
    });
  }
}
