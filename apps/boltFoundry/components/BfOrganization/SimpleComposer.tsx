import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
// import { getLogger } from "packages/logger/logger.ts";
import { BfDsTextArea } from "apps/bfDs/components/BfDsTextArea.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { useState } from "react";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import { BfDsCallout } from "apps/bfDs/components/BfDsCallout.tsx";
import makeTweetsMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/MakeTweets/entrypoint.ts";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);

export const SimpleComposer = iso(`
  field BfOrganization.SimpleComposer @component {
    Sidebar
  }
`)(
  function SimpleComposer(
    { data },
  ) {
    const { commit } = useMutation(makeTweetsMutation);
    const [isInFlight, setIsInFlight] = useState(false);
    const { navigate } = useRouter();
    const Sidebar = data.Sidebar;
    const [draftTweet, setDraftTweet] = useState("");
    const [error, setError] = useState<string | null>(null);
    return (
      <div className="flexRow editor-container">
        {Sidebar && <Sidebar />}
        <div className="voice-section">
          <div className="current-events-header-container-text">
            <div className="subpageHeaderRoute">Compose</div>
            <h2 className="current-events-header">Write a draft tweet</h2>
          </div>
          <div>
            Jot down a quick draft of your tweet. When you click "Continue,"
            you’ll see options to enhance it using your voice!
          </div>
          <BfDsTextArea
            value={draftTweet}
            onChange={(e) => setDraftTweet(e.target.value)}
          />
          <BfDsButton
            disabled={draftTweet.length === 0 || isInFlight}
            kind="primary"
            type="submit"
            showSpinner={isInFlight}
            text="Continue"
            xstyle={{ alignSelf: "flex-end" }}
            onClick={() => {
              setIsInFlight(true);
              setError(null);
              commit({ tweet: draftTweet }, {
                onError: () => {
                  setError("An error occurred.");
                  setIsInFlight(false);
                },
                onComplete: (makeTweetMutationData) => {
                  logger.debug(
                    "tweet created successfully",
                    makeTweetMutationData,
                  );
                  setIsInFlight(false);
                  navigate("/twitter/workshopping");
                },
              });
            }}
          />
          {error && <BfDsCallout kind="error" header="Error" body={error} />}
        </div>
      </div>
    );
  },
);
