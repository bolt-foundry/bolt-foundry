import { React } from "deps.ts";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";

type Props = {
  setIsEditing: (isEditing: boolean) => void;
};

const fragment = await graphql`
  fragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult{
    id
    title
    body
  }
`;

export function ClipEditModal(
  { setIsEditing, bfSavedSearchResult$key }: Props,
) {
  const data = useFragment(fragment, bfSavedSearchResult$key);
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
                    {data.title}
                  </div>
                </div>
              </div>

              <div className="clipMain">{data.body}</div>

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
