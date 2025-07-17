import {
  matchRouteWithParams,
  useRouter,
} from "../contexts/RouterContext.tsx";
import { appRoutes, isographAppRoutes } from "../routes.ts";
import { useLazyReference } from "@isograph/react";
import { BfIsographFragmentReader } from "../lib/BfIsographFragmentReader.tsx";
import type { AppEnvironmentProvider } from "../contexts/AppEnvironmentContext.tsx";

function AppRoot() {
  const routerProps = useRouter();
  const params = { ...routerProps.routeParams, ...routerProps.queryParams };
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

  return <div>404 - Page not found</div>;
}

function App() {
  return <AppRoot />;
}

export default App;
