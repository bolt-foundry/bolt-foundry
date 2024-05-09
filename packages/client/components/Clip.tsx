import { type Maybe, React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { VideoPlayer } from "packages/client/components/VideoPlayer.tsx";
import { DGWord } from "packages/types/transcript.ts";
// import { captureEvent } from "packages/events/mod.ts";
import {
  useFeatureFlag,
  useFeatureVariant,
} from "packages/client/hooks/featureFlagHooks.ts";
import { DownloadClip } from "packages/client/components/DownloadClip.tsx";
import { classnames } from "lib/classnames.ts";
import { useClipData } from "packages/client/hooks/useClipData.ts";
// import { useClipData_clip$key } from "packages/__generated__/useClipData_clip.graphql.ts";
import { StarClipButton } from "packages/client/components/StarClipButton.tsx";
import { RenderSettings } from "packages/types/settings.ts";
import { swearsFilter } from "packages/lib/textUtilities.ts";

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

export function Clip({
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
  const hideClipListVideos = useFeatureFlag("disable_clip_list_videos");
  const swears = useFeatureVariant("sv_swear_words");

  const seconds = Math.round(
    ((clipData?.end_time ?? 0) - (clipData?.start_time ?? 0)) * 100,
  ) / 100;

  function editClip() {
    // TODO navigate(`/project/${projectId}/clip/${index}`);
    // captureEvent("clip", "edited");
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

  return (
    <div className="clipInner clipContainer">
      <div className={videoClasses}>
        {!hideClipListVideos && (
          <VideoPlayer
            controls="below"
            src={videoUrl}
            startTime={clipData.start_time ?? 0}
            endTime={clipData.end_time ?? 0}
            xstyle={{ borderRadius: 8 }}
            playerLocation="clipList"
            showScrubber={false}
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
