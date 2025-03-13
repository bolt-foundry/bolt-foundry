import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { CfLogo } from "packages/app/resources/CfLogo.tsx";
import { useRouter } from "packages/app/contexts/RouterContext.tsx";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";

export const Home = iso(`
  field BfCurrentViewer.Home @component {
    __typename
    asBfCurrentViewerLoggedOut {
     DemoButton
    }
  }
`)(function Home({ data }) {
  // Extract content items from the data
  const { navigate } = useRouter();
  const demoButton = data?.asBfCurrentViewerLoggedOut?.DemoButton;

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      <div className="appPage flexCenter">
        <div className="appHeader">
          <div className="appHeaderCenter">
            <div className="appHeaderWelcomer">
              Welcome to
            </div>
            <div className="appHeaderLogo">
              <CfLogo boltColor="blpack" foundryColor="black" />
            </div>
          </div>
        </div>

        <div className="loginBox">
          {demoButton
            ? <data.asBfCurrentViewerLoggedOut.DemoButton />
            : (
              <BfDsButton
                kind="primary"
                text="Login"
                onClick={() => navigate("/login")}
              />
            )}

          <p>We're buliding something.</p>
        </div>
      </div>
    </>
  );
});
