import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { CfLogo } from "apps/bfDs/static/CfLogo.tsx";
import { BfDsInput } from "apps/bfDs/components/BfDsInput.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsDropzone } from "apps/bfDs/components/BfDsDropzone.tsx";
import { getLogger } from "packages/logger/logger.ts";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import { useState } from "react";
import createVoiceMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/CreateVoice/entrypoint.ts";
import { BfDsCallout } from "apps/bfDs/components/BfDsCallout.tsx";

export const EntrypointTwitterIdeatorVoice = iso(`
  field BfOrganization.IdentityEditor @component {
    identity {
      EditIdentity
    }
  }
`)(
  function EntrypointTwitterIdeatorVoice(
    { data },
  ) {
    const { commit } = useMutation(createVoiceMutation);
    const [isInFlight, setIsInFlight] = useState(false);
    const EditIdentity = data.identity?.EditIdentity;
    const [handle, setHandle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const showZip = false;
    const logger = getLogger(import.meta);

    // @ts-expect-error k
    const handleSubmit = (e) => {
      setError(null);
      setIsInFlight(true);
      e.preventDefault();
      commit({ handle: handle }, {
        onError: () => {
          setError("An error occurred.");
          setIsInFlight(false);
        },
        onComplete: (createVoiceMutationData) => {
          setIsInFlight(false);
          setHandle("");
          logger.debug(
            "voice created successfully",
            createVoiceMutationData,
          );
        },
      });
    };

    return (
      <div className="page">
        <div className="header">
          <CfLogo boltColor="black" foundryColor="black" />
        </div>
        <div className="voice-container">
          <div className="voice-section flex-column">
            {EditIdentity ? <EditIdentity /> : (
              <>
                <h2 className="voice-section-header">
                  Let's find your voice
                </h2>
                <div className="voice-section-text">
                  Paste your Twitter handle and we’ll get a feel for your
                  current voice.
                </div>
                <form onSubmit={handleSubmit} className="flexRow gapMedium">
                  <div className="flex1">
                    <BfDsInput
                      label="Twitter handle"
                      placeholder="George_LeVitre"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                    />
                  </div>
                  {showZip && (
                    <>
                      <div className="line-separator-container">
                        <div className="line" />
                        <div>OR</div>
                        <div className="line" />
                      </div>
                      <div className="voice-section-text">
                        Upload an archive of all your tweets. You can download
                        on{" "}
                        <a href="https://x.com/settings/download_your_data">
                          x.com
                        </a>
                      </div>
                      <BfDsDropzone
                        accept="application/zip, .zip"
                        onFileSelect={() => (logger.info("foo"))}
                      />
                    </>
                  )}
                  <div className="selfAlignEnd">
                    <BfDsButton
                      disabled={handle.length === 0 || isInFlight}
                      kind="primary"
                      type="submit"
                      showSpinner={isInFlight}
                      text="Submit"
                      xstyle={{ alignSelf: "flex-end" }}
                    />
                  </div>
                </form>
                {error && (
                  <BfDsCallout kind="error" header="Error" body={error} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);
