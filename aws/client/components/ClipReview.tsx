import { React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";
import { ReviewStatus } from "aws/client/pages/ReviewPage.tsx";

type Props = {
  clipData: {
    title: string;
    description: string;
    text: string;
    start_time: number;
    end_time: number;
    reviewStatus: ReviewStatus;
    reviewComment: string | null;
  };
  videoUrl: string;
};

function ClipReview({ clipData, videoUrl }: Props) {
  const textRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLDivElement>(null);
  const [textHeight, setTextHeight] = React.useState<number | null>(null);
  const [videoHeight, setVideoHeight] = React.useState<number | null>(null);
  const [textMaxHeight, setTextMaxHeight] = React.useState<number>(1000);
  const [videoMaxHeight, setVideoMaxHeight] = React.useState<number>(1000);
  const [textOpacity, setTextOpacity] = React.useState<number>(1);
  const [videoOpacity, setVideoOpacity] = React.useState<number>(1);

  React.useEffect(() => {
    if (textRef.current) {
      const measuredHeight = textRef.current.getBoundingClientRect().height;
      if (textHeight !== measuredHeight && measuredHeight > 0) {
        setTextHeight(measuredHeight);
      }
    }
    if (videoRef.current) {
      const measuredHeight = videoRef.current.getBoundingClientRect().height;
      if (videoHeight !== measuredHeight && measuredHeight > 0) {
        setVideoHeight(measuredHeight);
      }
    }
  }, [textRef, clipData.reviewStatus]);

  React.useEffect(() => {
    if (clipData.reviewStatus == null && textHeight != null) {
      setTextMaxHeight(textHeight);
      setTextOpacity(1);
    } else {
      // animate height to 0
      setTextMaxHeight(0);
      setTextOpacity(0);
    }
    if (clipData.reviewStatus == null && videoHeight != null) {
      setVideoMaxHeight(videoHeight);
      setVideoOpacity(1);
    } else {
      // animate height to 0
      setVideoMaxHeight(0);
      setVideoOpacity(0);
    }
  }, [clipData.reviewStatus, textHeight]);

  const seconds = Math.round(
    ((clipData?.end_time ?? 0) - (clipData?.start_time ?? 0)) * 100,
  ) / 100;

  const videoWidthOffset = 195 + 24; // 195px for video, 24px for gap

  return (
    <div className="clipInner clipContainer">
      <div
        className="videoPlayer videoPlayerEditing defaultTransition"
        style={{
          marginBottom: 40,
          maxHeight: videoMaxHeight,
          opacity: videoOpacity,
          marginRight: clipData.reviewStatus != null ? -videoWidthOffset : 0,
        }}
        ref={videoRef}
      >
        <VideoPlayer
          controls="below"
          src={videoUrl}
          startTime={clipData.start_time ?? 0}
          endTime={clipData.end_time ?? 0}
          xstyle={{ borderRadius: 8 }}
          playerLocation="clipList"
          showScrubber={true}
        />
      </div>
      <div className="clipContent">
        <div className="clipHeader" style={{ marginBottom: 0 }}>
          <div className="clipHeaderLeft">
            <div className="clipTitle" dir="auto">{clipData.title}</div>
            <div className="clipDescription" dir="auto">
              {clipData.description}
            </div>
          </div>
          <div className="clipActions row-column">
            <Button
              kind="secondary"
              iconLeft="download"
              // deno-lint-ignore no-console
              onClick={() => console.log("TODO: download clip")}
              testId="button-review-download-clip"
            />
          </div>
        </div>
        <div
          className="clipMain defaultTransition"
          style={{
            maxHeight: textMaxHeight,
            opacity: textOpacity,
            marginBottom: 0,
          }}
          ref={textRef}
        >
          <div
            className="clipText"
            data-bf-testid="section-clip-text-not-editing"
            dir="auto"
          >
            <div style={{ marginTop: 16 }}>
              {clipData.text}
            </div>
            <div className="clipMeta" style={{ marginTop: 16 }}>
              <div className="clipStat">
                <div>Length:</div>
                <div className="clipStatBold">{seconds} seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClipReview;
