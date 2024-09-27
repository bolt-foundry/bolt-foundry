import type { React } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";

type Props = {
  title: string;
  body: string;
  description: string;
  rationale: string;
  filename?: string;
  topics?: string;
  confidence: number;
  mediaId?: string;
  transcriptId?: string;
  startTime?: number;
  endTime?: number;
  startIndex?: number;
  endIndex?: number;
};
export function SearchResult(
  {
    title,
    body,
    description,
    rationale,
    filename,
    topics,
    confidence,
    mediaId,
    transcriptId,
    startTime,
    endTime,
    startIndex,
    endIndex,
  }: Props,
) {
  const topicPills = topics?.split(",").map((topic) => (
    <Pill text={topic?.trim()} />
  ));
  const length = `${(endTime - startTime).toFixed(2)}s`;
  return (
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
              <div className="clipTitle" dir="auto">{title}</div>
              <div className="clipDescription" dir="auto">
                {description}
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
              <DownloadClipButton
                startTime={startTime}
                endTime={endTime}
                mediaId={mediaId}
                title={title}
                transcriptId={transcriptId}
              />
              {/* <StarClipButton clip$key={{id: 20, isStarred: true}}/> */}
              {
                /* <ChangeRequestButton /> */
              }
            </div>
          </div>

          <div className="clipMain">{body}</div>

          <div className="clipMeta flexColumn" style={{ gap: "10px" }}>
            <div className="flexRow" style={{ gap: "5px" }}>
              <BfDsTooltip canCopy text={mediaId} position="right">
                <Pill label="Source" text={filename} />
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

            <div className="flexRow" style={{ gap: "5px" }}>
              {topicPills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
