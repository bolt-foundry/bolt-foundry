import { React } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";

const fragment = await graphql`
    fragment Clip_bfPerson on BfPerson {
    googleAuthAccessToken
  }
`;

type Props = {
  titleText: string;
  text: string;
  descriptionText: string;
  rationale: string;
  filename: string;
  topics: string;
  confidence: number;
  mediaId: string;
  transcriptId: string;
  startTime: number;
  endTime: number;
  startIndex: number;
  endIndex: number;
  clips$key: unknown;
};
export function Clip(
  {
    titleText,
    text,
    descriptionText,
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
    clips$key,
  }: Props,
) {
  const data = useFragment(fragment, clips$key);
  const topicPills = topics?.split(",").map((topic) => (
    <Pill text={topic?.trim()} />
  ));
  const length = `${(endTime - startTime).toFixed(2)}s`;
  return (
    <div className="clip">
      <div className="clipInner clipContainer">
        <div className="videoPlayer tall">
          (video player)
        </div>
        <div className="clipContent">
          <div className="clipHeader">
            <div className="clipHeaderLeft">
              <div className="clipTitle" dir="auto">{titleText}</div>
              <div className="clipDescription" dir="auto">
                {descriptionText}
              </div>
            </div>
            <div className="clipActions row-column">
              <BfDsButton
                kind="secondary"
                iconLeft="pencil"
                testId="button-edit-clip"
              />
              <DownloadClipButton
                startTime={startTime}
                endTime={endTime}
                mediaId={mediaId}
                title={titleText}
                transcriptId={transcriptId}
                disabled={!data.googleAuthAccessToken}
              />
              {/* <StarClipButton clip$key={{id: 20, isStarred: true}}/> */}
              {
                /* <ChangeRequestButton /> */
              }
            </div>
          </div>

          <div className="clipMain">{text}</div>

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
