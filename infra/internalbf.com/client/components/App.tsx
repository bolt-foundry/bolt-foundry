import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";

import { getLogger, React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "infra/internalbf.com/client/contexts/RouterContext.tsx";

import { LoginPage } from "infra/internalbf.com/client/pages/LoginPage.tsx";
import { InternalBfPage } from "infra/internalbf.com/client/pages/InternalBfPage.tsx";
import { Ingest } from "infra/internalbf.com/client/pages/Ingest.tsx";

export const routes = new Map([
  ["/", { Component: InternalBfPage }],
  ["/new", { Component: Ingest }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
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
