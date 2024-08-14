import { React } from "deps.ts";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import StarClipButton from "aws/client/components/StarClipButton.tsx";
import ChangeRequestButton from "aws/client/components/ChangeRequestButton.tsx";
import DownloadClip from "aws/client/components/DownloadClip.tsx";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";
type Props = {
  titleText: string;
  text: string;
  descriptionText: string;
  rationale: string;
  filename: string;
  topics: string;
  confidence: number;
};
export function Clip(
  { titleText, text, descriptionText, rationale, filename, topics, confidence }:
    Props,
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
              {/* <StarClipButton clip$key={{id: 20, isStarred: true}}/> */}
              {
                /* <ChangeRequestButton />
            <DownloadClip/> */
              }
            </div>
          </div>

          <div className="clipMain">{text}</div>

          <div className="clipMeta flexColumn" style={{ gap: "10px" }}>
            <div className="flexRow" style={{ gap: "5px" }}>
              <Pill label="Source" text={filename} />
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
