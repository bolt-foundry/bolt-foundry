//App.tsx
import { React } from "aws/client/deps.ts";

import ErrorBoundary from "aws/client/components/ErrorBoundary.tsx";

import * as DashboardModule from "aws/client/pages/DashboardPrototype.tsx";
import * as LocalMediaModule from "aws/client/components/LocalMedia.tsx";
import * as LoginPageModule from "aws/client/pages/LoginPage.tsx";
import * as PricingPageModule from "aws/client/pages/PricingPage.tsx";
import * as MarketingModule from "aws/client/components/Marketing.tsx";
import * as ProjectPageModule from "aws/client/pages/ProjectPage.tsx";
import * as ProjectPageOldModule from "aws/client/components/ProjectPageOld.tsx";
import * as ReviewPageModule from "aws/client/pages/ReviewPage.tsx";
import * as SignupPageModule from "aws/client/pages/SignupPage.tsx";
import * as UITestModule from "aws/client/ui_components/Demo.tsx";
import * as ConfirmEmailPageModule from "aws/client/pages/ConfirmEmailPage.tsx";
import * as ResetPasswordPageModule from "aws/client/pages/ResetPasswordPage.tsx";
import * as LocalVideoPageModule from "aws/client/pages/LocalVideoPage.tsx";
import * as FreeTranscribePageModule from "aws/client/pages/FreeTranscribePage.tsx";
import * as TermsAndPrivacyPageModule from "aws/client/pages/TermsAndPrivacyPage.tsx";
import * as ContentPageModule from "aws/client/pages/ContentPage.tsx";
import {
  matchRouteWithParams,
  useRouter,
} from "aws/client/contexts/RouterContext.tsx";

export const routes = new Map([
  ["/aws", { module: MarketingModule }],
  ["/awsdashboard", { module: DashboardModule }],
  ["/awstranscribe", { module: FreeTranscribePageModule }],
  ["/awsterms", { module: TermsAndPrivacyPageModule }],
  ["/awslogin", { module: LoginPageModule }],
  ["/awspricing", { module: PricingPageModule }],
  ["/awssignup/:plan?", { module: SignupPageModule }],
  ["/awsverify", { module: ConfirmEmailPageModule }],
  ["/awsforgot", { module: ResetPasswordPageModule }],
  ["/awslocalAudio", { module: LocalMediaModule }],
  ["/awslocalVideo", { module: LocalVideoPageModule }],
  ["/awsprojects/:projectId?", { module: ProjectPageOldModule }],
  ["/awsbf_projects/:projectId?", { module: ProjectPageModule }],
  ["/awsreview/:projectId?", { module: ReviewPageModule }],
  ["/awsui", { module: UITestModule }],
  ["/awsopen-mic/:contentType/:contentSlug", { module: ContentPageModule }],
]);

export default function App() {
  const { currentPath } = useRouter();

  // const pathMatch = matchRouteWithParams(currentPath, path);
  const matchingRoute = Array.from(routes).find(([path]) => {
    const pathMatch = matchRouteWithParams(currentPath, path);
    return pathMatch.match === true;
  });

  if (!matchingRoute) {
    throw new Error("No matching route found");
  }

  const [path, { module }] = matchingRoute;
  const Component = module.default;
  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
}
