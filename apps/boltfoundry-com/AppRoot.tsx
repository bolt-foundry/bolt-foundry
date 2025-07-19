import { matchRouteWithParams, useRouter } from "./contexts/RouterContext.tsx";
import { appRoutes, isographAppRoutes } from "./routes.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { useLazyReference } from "@isograph/react";
import { BfIsographFragmentReader } from "./lib/BfIsographFragmentReader.tsx";

const logger = getLogger(import.meta);

export function AppRoot() {
  const routerProps = useRouter();
  const params = { ...routerProps.routeParams, ...routerProps.queryParams };
  const { currentPath } = routerProps;

  logger.debug("AppRoot rendering with currentPath:", currentPath);
  logger.debug(
    "Available Isograph routes:",
    Array.from(isographAppRoutes.keys()),
  );
  logger.debug("Available app routes:", Array.from(appRoutes.keys()));

  const matchingRoute = Array.from(appRoutes).find(([path]) => {
    const pathMatch = matchRouteWithParams(currentPath, path);
    return pathMatch.match === true;
  });

  const isographMatchingRoute = Array.from(isographAppRoutes).find(
    ([path]) => {
      const pathMatch = matchRouteWithParams(currentPath, path);
      logger.debug(
        `Isograph route matching: ${currentPath} vs ${path}:`,
        pathMatch,
      );
      return pathMatch.match === true;
    },
  );

  if (isographMatchingRoute) {
    const [_, entrypoint] = isographMatchingRoute;
    const { fragmentReference } = useLazyReference(entrypoint, {
      ...params,
    });

    return (
      <BfIsographFragmentReader
        fragmentReference={fragmentReference}
      />
    );
  }

  if (matchingRoute) {
    const [_, routeGuts] = matchingRoute;
    const Component = routeGuts.Component;
    return <Component />;
  }

  throw new Error(`No matching route found for path: ${currentPath}`);
}
