import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { CfLogo } from "packages/app/resources/CfLogo.tsx";
import { useFeatureFlagEnabled } from "packages/app/hooks/useFeatureFlagHooks.ts";
import { useRouter } from "packages/app/contexts/RouterContext.tsx";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";

export const Home = iso(`
  field BfCurrentViewer.Home @component {
    __typename
    contentCollection(slug: "marketing") {
      ContentCollection
    }
    asBfCurrentViewerLoggedOut {
     DemoButton
    }
  }
`)(function Home({ data }) {
  // Extract content items from the data
  const { navigate } = useRouter();
  const demoButton = data?.asBfCurrentViewerLoggedOut?.DemoButton;
  const collection = data?.contentCollection;
  const showExtendedContent = useFeatureFlagEnabled("show_extended_content");

  return (
    <>
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

          {collection && showExtendedContent
            ? <data.contentCollection.ContentCollection />
            : <p>Coming soon.</p>}
        </div>
      </div>
    </>
  );
});
