import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";
import { getLogger, React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "packages/client/contexts/RouterContext.tsx";

import { LoginPage } from "packages/client/pages/LoginPage.tsx";
import { Demo } from "packages/bfDs/Demo.tsx";
import { ContactUs } from "packages/client/components/ContactUs.tsx";
import { ComingSoonPage } from "packages/client/pages/ComingSoonPage.tsx";
import { SettingsPage } from "packages/client/pages/SettingsPage.tsx";
import { ClipSearchPage } from "packages/client/pages/ClipSearchPage.tsx";
import { BlogPage } from "packages/client/pages/BlogPage.tsx";

export const routes = new Map([
  ["/", { Component: ComingSoonPage, allowLoggedOut: true }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/ui", { Component: Demo, allowLoggedOut: true }],
  ["/contact-us", { Component: ContactUs, allowLoggedOut: true }],
  ["/settings", { Component: SettingsPage, allowLoggedOut: false }],
  ["/clip-search", { Component: ClipSearchPage, allowLoggedOut: true }],
  ["/blog", { Component: BlogPage, allowLoggedOut: true }],
  ["/blog/:slug", { Component: BlogPage, allowLoggedOut: true }],
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
