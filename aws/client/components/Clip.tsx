import { type Maybe, React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";
import { DGWord } from "aws/types/transcript.ts";
import { captureEvent } from "aws/events/mod.ts";
import {
  useFeatureFlag,
  useFeatureVariant,
} from "aws/client/hooks/featureFlagHooks.tsx";
import DownloadClip from "aws/client/components/DownloadClip.tsx";
import classnames from "aws/client/lib/classnames.ts";
import { useClipData } from "aws/client/hooks/useClipData.tsx";
import { useClipData_clip$key } from "aws/__generated__/useClipData_clip.graphql.ts";
import StarClipButton from "aws/client/components/StarClipButton.tsx";
import { RenderSettings } from "aws/types/settings.ts";
import { swearsFilter } from "aws/client/lib/textUtilities.ts";
import { getCurrentCropIndex } from "aws/client/components/ManualCropMenu.tsx";

type ClipType = useClipData_clip$key;

type ClipProps = {
  clip$key: ClipType;
  clipIndex: number;
  clipNumber: number;
  isSaved: boolean;
  onEditClip: () => void;
  onSaveClip: (wordsToUpdate: Array<DGWord>) => void;
  setClipChanged?: (changed: boolean) => void;
  settings: RenderSettings;
  transcriptId: Maybe<string>;
  transcriptWords: Array<DGWord>;
  videoUrl: string;
};

function Clip({
  clip$key,
  clipIndex,
  clipNumber,
  isSaved,
  onEditClip,
  onSaveClip,
  setClipChanged,
  settings,
  transcriptId,
  transcriptWords,
  videoUrl,
}: ClipProps) {
  const { data: clipData } = useClipData(clip$key as useClipData_clip$key);
  const [currentTime, setCurrentTime] = React.useState(0);
  const hideClipListVideos = useFeatureFlag("disable_clip_list_videos");
  const swears = useFeatureVariant("sv_swear_words");

  const seconds = Math.round(
    ((clipData?.end_time ?? 0) - (clipData?.start_time ?? 0)) * 100,
  ) / 100;

  function editClip() {
    // TODO navigate(`/project/${projectId}/clip/${index}`);
    captureEvent("clip", "edited");
    onEditClip();
  }

  let displayRatio = "wide";
  if (settings.ratio === 9 / 16) {
    displayRatio = "tall";
  }
  const videoClasses = classnames([
    "videoPlayer",
    displayRatio,
  ]);

  const swearsOptions = {
    useAsterisks: settings.censorUseAsterisks,
    showFirstLetter: settings.censorShowFirstLetter,
  };

  const manualCropData = JSON.parse(clipData.manualCrop ?? "[{}]");
  const currentCropIndex = getCurrentCropIndex(manualCropData, currentTime);
  const manualCrop = manualCropData[currentCropIndex];
  const cropStyle = clipData.manualCropActive && manualCrop != null
    ? {
      objectViewBox:
        `inset(${manualCrop.top}% ${manualCrop.right}% ${manualCrop.bottom}% ${manualCrop.left}%)`,
    }
    : {};

  return (
    <div className="clipInner clipContainer">
      <div className={videoClasses}>
        {!hideClipListVideos && (
          <VideoPlayer
            controls="below"
            src={videoUrl}
            startTime={clipData.start_time ?? 0}
            endTime={clipData.end_time ?? 0}
            xstyle={{ borderRadius: 8, ...cropStyle }}
            playerLocation="clipList"
            showScrubber={false}
            onTimeUpdate={(time: number) => {
              setCurrentTime(time);
            }}
          />
        )}
      </div>
      <div className="clipContent">
        <div className="clipHeader">
          <div className="clipHeaderLeft">
            <div className="clipTitle" dir="auto">
              <span style={{ fontWeight: 300 }}>
                {clipNumber}
                {" | "}
              </span>
              {clipData.title}
            </div>
            <div className="clipDescription" dir="auto">
              {clipData.description}
            </div>
          </div>
          <div className="clipActions row-column">
            <Button
              kind="secondary"
              iconLeft="pencil"
              onClick={editClip}
              testId="button-edit-clip"
            />
            <StarClipButton clip$key={clipData} />
            <DownloadClip
              videoUrl={videoUrl}
              clip$key={clipData}
              clipEdits={{
                startIndex: clipData.start_index,
                endIndex: clipData.end_index,
                startTime: clipData.start_time,
                endTime: clipData.end_time,
                endTimeOverride: clipData.endTimeOverride,
                manualCrop: JSON.parse(clipData.manualCrop ?? "[]"),
                manualCropActive: !!clipData.manualCropActive,
              }}
              downloadTitle={`${clipNumber} ${clipData.title}`}
              transcriptWords={transcriptWords}
              settings={settings}
              testId="button-download-clip"
            />
          </div>
        </div>
        <div className="clipMain">
          <div
            className="clipText"
            data-bf-testid="section-clip-text-not-editing"
            dir="auto"
          >
            {settings.censorSwears
              // @ts-ignore - swears is not typed properly
              ? swearsFilter(clipData.text ?? "", swears, swearsOptions)
              : clipData.text}
          </div>
        </div>
        <div className="clipMeta">
          {/* TODO <div className="tags"></div> */}
          <div className="clipStat">
            <div>Length:</div>
            <div className="clipStatBold">{seconds} seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Clip;
