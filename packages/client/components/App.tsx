import { React } from "deps.ts";

import {ErrorBoundary} from "packages/client/components/ErrorBoundary.tsx";

// import * as DashboardModule from "packages/client/pages/DashboardPrototype.tsx";
// import * as LoginPageModule from "packages/client/pages/LoginPage.tsx";
// import * as PricingPageModule from "packages/client/pages/PricingPage.tsx";
import { Marketing } from "packages/client/pages/MarketingPage.tsx";
// import * as ProjectPageModule from "packages/client/pages/ProjectPage.tsx";
// import * as ProjectPageOldModule from "packages/client/components/ProjectPageOld.tsx";
// import * as ReviewPageModule from "packages/client/pages/ReviewPage.tsx";
// import * as SignupPageModule from "packages/client/pages/SignupPage.tsx";
// import * as UITestModule from "packages/client/ui_components/Demo.tsx";
// import * as ConfirmEmailPageModule from "packages/client/pages/ConfirmEmailPage.tsx";
// import * as ResetPasswordPageModule from "packages/client/pages/ResetPasswordPage.tsx";
// import * as LocalVideoPageModule from "packages/client/pages/LocalVideoPage.tsx";
// import * as FreeTranscribePageModule from "packages/client/pages/FreeTranscribePage.tsx";
// import * as TermsAndPrivacyPageModule from "packages/client/pages/TermsAndPrivacyPage.tsx";
// import * as ContentPageModule from "packages/client/pages/ContentPage.tsx";
// import {
//   matchRouteWithParams,
//   useRouter,
// } from "packages/client/contexts/RouterContext.tsx";

export const routes = new Map([
  ["/", { Component: Marketing }],
  // ["/dashboard", { module: DashboardModule }],
  // ["/transcribe", { module: FreeTranscribePageModule }],
  // ["/terms", { module: TermsAndPrivacyPageModule }],
  // ["/login", { module: LoginPageModule }],
  // ["/pricing", { module: PricingPageModule }],
  // ["/signup/:plan?", { module: SignupPageModule }],
  // ["/verify", { module: ConfirmEmailPageModule }],
  // ["/forgot", { module: ResetPasswordPageModule }],
  // ["/localAudio", { module: LocalMediaModule }],
  // ["/localVideo", { module: LocalVideoPageModule }],
  // ["/projects/:projectId?", { module: ProjectPageOldModule }],
  // ["/bf_projects/:projectId?", { module: ProjectPageModule }],
  // ["/review/:projectId?", { module: ReviewPageModule }],
  // ["/ui", { module: UITestModule }],
  // ["/open-mic/:contentType/:contentSlug", { module: ContentPageModule }],
]);

export function App() {
  // const { currentPath } = useRouter();

  // const pathMatch = matchRouteWithParams(currentPath, path);
  const matchingRoute = Array.from(routes).find(([_path]) => {
    // const pathMatch = matchRouteWithParams(currentPath, path);
    // return pathMatch.match === true;
    return true;
  });

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
