import { getLogger, React } from "deps.ts";

const logger = getLogger(import.meta);

import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";

// import * as DashboardModule from "packages/client/pages/DashboardPrototype.tsx";
import { LoginPage } from "packages/client/pages/LoginPage.tsx";
import { InternalBfPage } from "packages/client/pages/InternalBfPage.tsx";
// import * as PricingPageModule from "packages/client/pages/PricingPage.tsx";
import { Marketing } from "packages/client/pages/MarketingPage.tsx";
import { ProjectPage } from "packages/client/pages/ProjectPage.tsx";
// import * as ProjectPageOldModule from "packages/client/components/ProjectPageOld.tsx";
// import * as ReviewPageModule from "packages/client/pages/ReviewPage.tsx";
// import * as SignupPageModule from "packages/client/pages/SignupPage.tsx";
import { Demo } from "packages/bfDs/Demo.tsx";
// import * as ConfirmEmailPageModule from "packages/client/pages/ConfirmEmailPage.tsx";
// import * as ResetPasswordPageModule from "packages/client/pages/ResetPasswordPage.tsx";
// import * as LocalVideoPageModule from "packages/client/pages/LocalVideoPage.tsx";
// import * as FreeTranscribePageModule from "packages/client/pages/FreeTranscribePage.tsx";
// import * as TermsAndPrivacyPageModule from "packages/client/pages/TermsAndPrivacyPage.tsx";
// import * as ContentPageModule from "packages/client/pages/ContentPage.tsx";
import {
  matchRouteWithParams,
  useRouter,
} from "packages/client/contexts/RouterContext.tsx";
import { ProjectNew } from "packages/client/pages/ProjectNew.tsx";

export const routes = new Map([
  ["/", { Component: Marketing, allowLoggedOut: true }],
  ["/login", { Component: LoginPage, allowLoggedOut: true }],
  ["/internalBf", { Component: InternalBfPage }],
  ["/projects/new", { Component: ProjectNew }],
  ["/projects/:projectId?", { Component: ProjectPage }],
  ["/projects", { Component: ProjectPage }],
  ["/ui", { Component: Demo, allowLoggedOut: true }],
  ["/george", { Component: Marketing, allowLoggedOut: true }],
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
