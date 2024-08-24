import * as React from "react";
import { IBfDashboardPage } from "infra/internalbf.com/client/pages/IBfDashboardPage.tsx";
import {
  matchRouteWithParams,
  useRouter,
} from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";

const logger = getLogger(import.meta);

export const routes = new Map([
  ["/", { Component: IBfDashboardPage, allowLoggedOut: true }],
]);

export function App() {
  const { currentPath } = useRouter();

  logger.debug("paths", routes);
  const matchingRoute = Array.from(routes).find(([path]) => {
    const pathMatch = matchRouteWithParams(currentPath, path);
    return pathMatch.match === true;
  });

  logger.debug(
    `App: currentPath: ${currentPath}, matchingRoute: ${JSON.stringify}`,
  );

  if (!matchingRoute) {
    throw new Error("No matching route found");
  }

  const [_path, { Component }] = matchingRoute;
  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
}
