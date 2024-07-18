import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";

import { getLogger, React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "infra/internalbf.com/client/contexts/RouterContext.tsx";

import { LoginPage } from "infra/internalbf.com/client/pages/LoginPage.tsx";
import { MediaPage } from "infra/internalbf.com/client/pages/MediaPage.tsx";
import { ProjectsPage } from "infra/internalbf.com/client/pages/ProjectsPage.tsx";
import { QcPage } from "infra/internalbf.com/client/pages/QcPage.tsx";
import { ChangesPage } from "infra/internalbf.com/client/pages/ChangesPage.tsx";
import { RandallPlaygroundPage } from "infra/internalbf.com/client/pages/RandallPlaygroundPage.tsx";
import { ClipChangesPage } from "infra/internalbf.com/client/pages/ClipChangesPage.tsx";
import { PlaygroundPage } from "infra/internalbf.com/client/pages/PlaygroundPage.tsx";

export const routes = new Map([
  ["/media", { Component: MediaPage}],
  ["/projects", { Component: ProjectsPage }],
  ["/qc", { Component: QcPage}],
  ["/changes", { Component: ChangesPage }],
  ["/clip-changes", {
    Component: ClipChangesPage,
  }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/colby", { Component: PlaygroundPage }],
  ["/", { Component: LoginPage }],
  ["/randall", { Component: RandallPlaygroundPage }],
  
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
