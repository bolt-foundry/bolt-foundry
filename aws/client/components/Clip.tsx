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
import ClipEdit from "/aws/client/components/ClipEdit.tsx";

type ClipType = useClipData_clip$key;

type ClipProps = {
  clip$key: ClipType;
  clipIndex: number;
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
            <div className="clipTitle" dir="auto">{clipData.title}</div>
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
                sticker: {
                  stickerUrl:
                    "data:image/jpeg;base64,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",
                },
              }}
              downloadTitle={clipData.title}
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
