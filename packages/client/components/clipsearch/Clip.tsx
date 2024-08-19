import { React } from "deps.ts";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
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
  notAuthed: boolean;
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
    notAuthed
  }: Props,
) {
  const topicPills = topics?.split(",").map((topic) => (
    <Pill text={topic?.trim()} />
  ));
  return (
    <div className="clip">
      <div className="clipInner clipContainer">
        <div className="videoPlayer tall">
          <VideoPlayer
            controls="below"
            src=""
            xstyle={{ borderRadius: 8 }}
            showScrubber={false}
          />
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
              <Button
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
                disabled={notAuthed}
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
              <Tooltip canCopy text={mediaId} position="right">
                <Pill label="Source" text={filename} />
              </Tooltip>
              <Tooltip text={rationale} position="right">
                <Pill label="Rating" text={confidence} />
              </Tooltip>
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
