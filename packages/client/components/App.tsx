import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";
import { getLogger, React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "packages/client/contexts/RouterContext.tsx";

import { LoginPage } from "packages/client/pages/LoginPage.tsx";
import { InternalBfPage } from "packages/client/pages/InternalBfPage.tsx";
import { Marketing } from "packages/client/pages/MarketingPage.tsx";
import { ProjectPage } from "packages/client/pages/ProjectPage.tsx";
import { Demo } from "packages/bfDs/Demo.tsx";
import { ProjectNew } from "packages/client/pages/ProjectNew.tsx";
import { ContactUs } from "packages/client/components/ContactUs.tsx";

export const routes = new Map([
  ["/", { Component: Marketing, allowLoggedOut: true }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/internalBf", { Component: InternalBfPage }],
  ["/projects/new", { Component: ProjectNew }],
  ["/projects/:projectId?", { Component: ProjectPage }],
  ["/projects", { Component: ProjectPage }],
  ["/ui", { Component: Demo, allowLoggedOut: true }],
  ["/contact-us", { Component: ContactUs, allowLoggedOut: true }],
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
