import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { CfLogo } from "apps/boltFoundry/resources/CfLogo.tsx";
import { useFeatureFlagEnabled } from "apps/boltFoundry/hooks/useFeatureFlagHooks.ts";

export const LoggedOutView = iso(`
  field BfCurrentViewerLoggedOut.LoggedOutView @component {
    WelcomeVideo
    DemoButton
    LoginAndRegisterForm
  }
`)(function LoggedOutView({ data }) {
  const shouldRenderDemoButton = useFeatureFlagEnabled("enable_demo_button");
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
        {shouldRenderDemoButton && <data.DemoButton />}
      </div>
    </div>
  );
});
