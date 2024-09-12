import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";
import { getLogger, type React } from "deps.ts";
const logger = getLogger(import.meta);

import {
  matchRouteWithParams,
  useRouter,
} from "packages/client/contexts/RouterContext.tsx";

import { LoginPage } from "packages/client/pages/LoginPage.tsx";
import { Demo } from "packages/bfDs/Demo.tsx";
import { ContactUs } from "packages/client/components/ContactUs.tsx";
import type { ComingSoonPage } from "packages/client/pages/ComingSoonPage.tsx";
import { Marketing } from "packages/client/pages/MarketingPage.tsx";
import { SettingsPage } from "packages/client/pages/SettingsPage.tsx";
import { ClipSearchPage } from "packages/client/pages/ClipSearchPage.tsx";
import { BlogPage } from "packages/client/pages/BlogPage.tsx";
import { LandingPage } from "packages/client/pages/LandingPage.tsx";
import type { useAppState } from "packages/client/contexts/AppStateContext.tsx";
import { Hud } from "packages/client/components/Hud.tsx";

export const routes = new Map([
  ["/", { Component: LandingPage, allowLoggedOut: true }],
  ["/old", { Component: Marketing, allowLoggedOut: false }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/ui", { Component: Demo, allowLoggedOut: true }],
  ["/contact-us", { Component: ContactUs, allowLoggedOut: true }],
  ["/settings/:tab?", { Component: SettingsPage, allowLoggedOut: false }],
  ["/search", { Component: ClipSearchPage, allowLoggedOut: false }],
  ["/blog/:slug?", { Component: BlogPage, allowLoggedOut: true }],
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
      <Hud />
    </ErrorBoundary>
  );
}
