import { HeaderTitle } from "apps/boltFoundry/components/Header/HeaderTitle.tsx";
import {
  matchRouteWithParams,
  useRouter,
} from "apps/boltFoundry/contexts/RouterContext.tsx";
import { appRoutes, isographAppRoutes } from "apps/boltFoundry/routes.ts";
import { getLogger } from "packages/logger/logger.ts";
import { useLazyReference } from "@isograph/react";
import { ErrorBoundary } from "apps/boltFoundry/components/ErrorBoundary.tsx";
import { BfIsographFragmentReader } from "lib/BfIsographFragmentReader.tsx";
const logger = getLogger(import.meta);

export function AppRoot() {
  const routerProps = useRouter();
  const params = { ...routerProps.routeParams, ...routerProps.queryParams };
  logger.debug("params", params);
  const { currentPath } = routerProps;
  const matchingRoute = Array.from(appRoutes).find(([path]) => {
    const pathMatch = matchRouteWithParams(currentPath, path);
    return pathMatch.match === true;
  });

  const isographMatchingRoute = Array.from(isographAppRoutes).find(
    ([path]) => {
      const pathMatch = matchRouteWithParams(currentPath, path);
      return pathMatch.match === true;
    },
  );

  logger.debug(
    `App: currentPath: ${currentPath}, matchingRoute: ${
      JSON.stringify(matchingRoute)
    }`,
  );

  if (isographMatchingRoute) {
    const [_, entrypoint] = isographMatchingRoute;
    const { fragmentReference } = useLazyReference(entrypoint, {
      ...params,
    });

    const { currentPath } = routerProps;

    return (
      <ErrorBoundary fallback="Nope. you error">
        <BfIsographFragmentReader
          fragmentReference={fragmentReference}
          key={currentPath}
        />
      </ErrorBoundary>
    );
  }

  if (matchingRoute) {
    const [_path, { Component }] = matchingRoute;
    return <Component />;
  }

  throw new Error("No matching route found");
}

AppRoot.HeaderComponent = function AppRootHeaderComponent() {
  return (
    <HeaderTitle>
      Bolt Foundry
    </HeaderTitle>
  );
};
