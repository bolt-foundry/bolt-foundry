import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { CfLogo } from "packages/app/resources/CfLogo.tsx";
import { useFeatureFlagEnabled } from "packages/app/hooks/useFeatureFlagHooks.ts";

export const LoggedOutView = iso(`
  field BfCurrentViewerLoggedOut.LoggedOutView @component {
    WelcomeVideo
    DemoButton
    LoginAndRegisterForm
  }
`)(function LoggedOutView({ data }) {
  const shouldRenderDemoButton = useFeatureFlagEnabled("enable_demo_button");
  const shouldRenderLoginForm = useFeatureFlagEnabled("enable_login_form");
  return (
    <div className="appPage flexCenter">
      <div className="appHeader">
        <div className="appHeaderCenter">
          <div className="appHeaderWelcomer">
            Welcome to
          </div>
          <div className="appHeaderLogo">
            <CfLogo boltColor="black" foundryColor="black" />
          </div>
        </div>
      </div>
      <div className="loginBox">
        {/* <p>Applying to YC? Try out our YC application reviewer.</p> */}
        {shouldRenderDemoButton && <data.DemoButton />}
        {/* {shouldRenderLoginForm && <data.LoginAndRegisterForm />} */}
      </div>
    </div>
  );
});
