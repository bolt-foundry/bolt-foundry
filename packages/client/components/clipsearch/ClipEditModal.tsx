import { React } from "deps.ts";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";

type Props = {
  setIsEditing: (isEditing: boolean) => void;
};

export function ClipEditModal({ setIsEditing }: Props) {
  return (
    <>
      <BfDsModal onClose={() => setIsEditing(false)}>
        <div className="clip">
          <div className="clipInner clipContainer">
            <FeatureFlag name="placeholder">
              <div className="videoPlayer tall">
                (video player)
              </div>
            </FeatureFlag>
            <div className="clipContent">
              <div className="clipHeader">
                <div className="clipHeaderLeft">
                  <div className="clipTitle" dir="auto">
                    {"titleText"}
                  </div>
                  <div className="clipDescription" dir="auto">
                    {"descriptionText"}
                  </div>
                </div>
                <div className="clipActions row-column">
                  <FeatureFlag name="placeholder">
                    <BfDsButton
                      kind="secondary"
                      iconLeft="pencil"
                      testId="button-edit-clip"
                    />
                  </FeatureFlag>
                  {
                    /* <DownloadClipButton
                    startTime={startTime}
                    endTime={endTime}
                    mediaId={mediaId}
                    title={titleText}
                    transcriptId={transcriptId}
                    disabled={!data.googleAuthAccessToken}
                  /> */
                  }
                  {/* <StarClipButton clip$key={{id: 20, isStarred: true}}/> */}
                  {
                    /* <ChangeRequestButton /> */
                  }
                </div>
              </div>

              <div className="clipMain">{"text"}</div>

              {
                /* <div className="clipMeta flexColumn" style={{ gap: "10px" }}>
                <div className="flexRow" style={{ gap: "5px" }}>
                  <BfDsTooltip canCopy text={mediaId} position="right">
                    <Pill label="Source" text={filename ?? "filename""} />
                  </BfDsTooltip>
                  <BfDsTooltip text={rationale} position="right">
                    <Pill label="Rating" text={confidence} />
                  </BfDsTooltip>
                  <BfDsTooltip
                    text={`Start: ${startTime} End: ${endTime}`}
                    position="right"
                  >
                    <Pill label="Length" text={length} />
                  </BfDsTooltip>
                </div>
              </div> */
              }
            </div>
          </div>
        </div>
      </BfDsModal>
    </>
  );
}
