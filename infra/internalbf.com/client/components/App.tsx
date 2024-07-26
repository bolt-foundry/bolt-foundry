import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";

import { getLogger, React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "infra/internalbf.com/client/contexts/RouterContext.tsx";

import { LoginPage } from "infra/internalbf.com/client/pages/LoginPage.tsx";
import { QcPage } from "infra/internalbf.com/client/pages/QcPage.tsx";
import { ChangesPage } from "infra/internalbf.com/client/pages/ChangesPage.tsx";
import { RandallPlaygroundPage } from "infra/internalbf.com/client/pages/RandallPlaygroundPage.tsx";
import { ClipChangesPage } from "infra/internalbf.com/client/pages/ClipChangesPage.tsx";
import { PlaygroundPage } from "infra/internalbf.com/client/pages/PlaygroundPage.tsx";
import { IBfDashboardPage } from "infra/internalbf.com/client/pages/IBfDashboardPage.tsx";
import { IBfOrganizationsPage } from "infra/internalbf.com/client/pages/IBfOrganizationsPage.tsx";
import { InternalBfDotComPage } from "packages/client/pages/InternalBfDotComPage.tsx";

export const routes = new Map([
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/", { Component: IBfDashboardPage }],
  ["/media", { Component: IBfDashboardPage }],
  ["/organizations", { Component: IBfOrganizationsPage }],

  // class bf pages
  ["/qc", { Component: QcPage }],
  ["/changes", { Component: ChangesPage }],
  ["/clip-changes", {
    Component: ClipChangesPage,
  }],

  // playgrounds
  ["/colby", { Component: PlaygroundPage }],
  ["/randall", { Component: RandallPlaygroundPage }],
  ["/justin", { Component: InternalBfDotComPage }],
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
