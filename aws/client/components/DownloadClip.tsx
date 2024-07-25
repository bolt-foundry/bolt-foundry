import { graphql, type Maybe, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import { DownloadClip_clip$key } from "aws/__generated__/DownloadClip_clip.graphql.ts";
import { createLogger } from "aws/logs/mod.ts";
import { DGWord } from "aws/types/transcript.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import {
  useFeatureFlag,
  useFeatureTier,
  useFeatureVariant,
} from "aws/client/hooks/featureFlagHooks.tsx";
import {
  cancelRender,
  clearEvents,
  queueRender,
  registerEvents,
} from "aws/client/lib/renderQueue.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { captureEvent } from "aws/events/mod.ts";
import { RenderSettings } from "aws/types/settings.ts";
import { swearsFilter } from "aws/client/lib/textUtilities.ts";
import { ManualCrop } from "aws/client/components/ManualCropMenu.tsx";
const log = createLogger("DownloadClip", "info");
const logError = createLogger("DownloadClip", "error");

function sanitizeFilename(filename: string) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, "-") // Replace forbidden characters globally
    .replace(/\s+/g, "_") // Replace whitespace globally
    .replace(/&/g, "and") // Replace '&' globally
    .replace(/[^0-9a-z_\-]/gi, "") // Remove any characters that are not alphanumeric, underscore or hyphen
    .toLowerCase(); // Convert the entire string to lowercase
}

type ClipEdits = {
  startIndex?: number | null;
  endIndex?: number | null;
  startTime?: number | null;
  endTime?: number | null;
  endTimeOverride?: number | null;
  wordsToUpdate?: Array<DGWord> | null;
  manualCrop?: Array<ManualCrop>;
  manualCropActive?: boolean;
};

type DownloadClipProps = {
  asButton?: boolean;
  videoUrl: string;
  clip$key: DownloadClip_clip$key;
  clipEdits?: ClipEdits;
  disabled?: boolean;
  downloadTitle?: Maybe<string>;
  transcriptWords: Array<DGWord>;
  settings: RenderSettings;
  testId?: string; // for identifying the element in posthog
};

const fragment = await graphql`
  fragment DownloadClip_clip on Clip {
    # weird that this doesn't have the original url
    # originalUrl
    id
    start_time
    end_time
    manualCrop
    manualCropActive
    title
  }
`;

async function uploadFileToNewStorage(
  file: File,
  title: string,
  originalClipId: string,
) {
  const formData = new FormData();
  formData.append(
    "operations",
    JSON.stringify({
      "query":
        `mutation DownloadClipUpsertMutation($file: File!, $title: String!, $originalClipId: String!) {
        upsertClip(file: $file, title: $title, originalClipId: $originalClipId){
          title
        }}`,
      "variables": { "file": file.name, "title": file.name, originalClipId },
    }),
  );
  formData.append("map", JSON.stringify({ "file": ["variables.file"] }));
  formData.append("file", file);

  const response = await fetch("/graphql", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result);
  } else {
    console.error("Failed to upload file");
  }
}

const DownloadClip: React.FC<DownloadClipProps> = (
  {
    asButton = false,
    videoUrl,
    clip$key,
    clipEdits,
    disabled,
    downloadTitle = "Bolt foundry clip",
    transcriptWords,
    settings,
    testId,
  }: DownloadClipProps,
) => {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const [progress, setProgress] = React.useState<number>();
  const [downloadableFile, setDownloadableFile] = React.useState<File>();
  const [hovering, setHovering] = React.useState(false);
  const enableRedFrameHack = useFeatureFlag("enable_red_frame_hack");
  const featureFlags = {
    enableRedFrameHack,
  };
  const swears = useFeatureVariant("sv_swear_words");

  let renderStatus = "none";
  if (progress && progress === 0.001) {
    renderStatus = "queued";
  }
  if (progress && progress > 0.001 && progress < 100) {
    renderStatus = "rendering";
  }
  if (downloadableFile) {
    renderStatus = "downloaded";
  }

  const data = ReactRelay.useFragment(fragment, clip$key);
  const clipId = data.id;
  const isWatermarkDisabled = useFeatureTier("basic");
  let showWatermark = true;
  if (isWatermarkDisabled) {
    showWatermark = settings.showWatermark !== undefined
      ? settings.showWatermark
      : false;
  }

  React.useEffect(() => {
    // reset downloadable file and progress
    setDownloadableFile(undefined);
    setProgress(undefined);
    clearEvents(clipId);
  }, [clipId, settings]);

  React.useEffect(() => {
    if (clipId) {
      registerEvents(clipId, {
        setProgress,
        setDownloadableFile,
      });
    }
  }, [clipId]);

  const filteredTranscriptWordsWithEdits = React.useMemo(() => {
    // add unsaved edits
    const transcriptWordsWithEdits = [...transcriptWords];
    clipEdits?.wordsToUpdate?.forEach(
      (word) => {
        const index = transcriptWordsWithEdits.findIndex((w) =>
          w.start === word.start
        );
        if (index !== -1) {
          transcriptWordsWithEdits[index] = word;
        }
      },
    );

    if (!settings.censorSwears) {
      // If swear word censoring is not enabled, just return the words as is.
      return transcriptWordsWithEdits;
    }

    // If censoring is enabled, apply the swear word filter.
    const swearsOptions = {
      useAsterisks: settings.censorUseAsterisks,
      showFirstLetter: settings.censorShowFirstLetter,
    };

    return transcriptWordsWithEdits.map((word) => {
      if (word.punctuated_word) {
        return {
          ...word,
          punctuated_word: swearsFilter(
            word.punctuated_word,
            // @ts-ignore - swears is not typed properly
            swears,
            swearsOptions,
          ),
        };
      }
      return word;
    });
  }, [
    clipEdits?.wordsToUpdate,
    transcriptWords,
    settings.censorSwears,
    settings.censorUseAsterisks,
    settings.censorShowFirstLetter,
    swears,
  ]);

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizeFilename(downloadTitle as string)}.mp4`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    captureEvent("clip", "downloaded", { clipId }, personId);
  }

  const startTime = clipEdits?.startTime ?? data.start_time;
  let endTime = clipEdits?.endTime ?? data.end_time;
  if (
    clipEdits?.endIndex &&
    transcriptWords[clipEdits.endIndex + 1]?.start != null
  ) {
    endTime = transcriptWords[clipEdits.endIndex + 1].start;
  }
  if (clipEdits?.endTimeOverride && clipEdits.endTimeOverride > -1) {
    endTime = clipEdits.endTimeOverride;
  }

  const manualCrop = clipEdits?.manualCrop ??
    JSON.parse(data.manualCrop ?? "[{}]") ?? [];
  const manualCropActive =
    !!(clipEdits?.manualCropActive ?? data.manualCropActive);

  const cancelDownload = () => {
    cancelRender(clipId);
    setProgress(undefined);
  };

  const handleDownload = async () => {
    if (downloadableFile) {
      downloadFile(downloadableFile);
      return;
    }

    if (progress) {
      return;
    }
    if (transcriptWords.length === 0) {
      logError("no transcript defined for clip");
      return;
    }
    if (!startTime || !endTime || !clipId) {
      logError("no start or end time defined for clip");
      return;
    }

    const transcriptWordsWithEdits = [...transcriptWords];
    clipEdits?.wordsToUpdate?.forEach(
      (word) => {
        const index = transcriptWordsWithEdits.findIndex((w) =>
          w.start === word.start
        );
        if (index !== -1) {
          transcriptWordsWithEdits[index] = word;
        }
      },
    );

    const transcriptToRender = filteredTranscriptWordsWithEdits;

    try {
      const renderParams = {
        startTime,
        endTime,
        videoUrl,
        clipId,
        transcriptWords: transcriptToRender,
        settings,
        featureFlags,
        personId: personId!,
        manualCrop,
        manualCropActive,
        title: data.title ?? "",
      };
      const file = await queueRender(renderParams);
      setDownloadableFile(file);
      downloadFile(file);
      uploadFileToNewStorage(file, renderParams.title, renderParams.clipId);
    } catch (e) {
      log(e);
    }
  };

  let button = (
    <Button
      disabled={disabled}
      iconLeft="download"
      kind="secondary"
      onClick={handleDownload}
      text={asButton ? "Download" : undefined}
      tooltip="Download"
      testId={testId}
    />
  );
  if (renderStatus === "queued") {
    button = (
      <Button
        disabled={disabled}
        iconLeft={hovering ? "cross" : "download"}
        kind="accent"
        onClick={cancelDownload}
        progress={0.001}
        text={asButton ? "Cancel" : undefined}
        tooltip="Download queued"
        testId={testId}
      />
    );
  }
  if (renderStatus === "rendering" && progress) {
    button = (
      <Button
        disabled={disabled}
        iconLeft={hovering ? "cross" : "download"}
        kind="accent"
        onClick={cancelDownload}
        text={asButton ? "Cancel" : undefined}
        progress={progress}
        tooltip={
          <span style={{ fontFamily: fonts.fontFamilyMono }}>
            {progress.toFixed(2) + "%"}
          </span>
        }
        testId={testId}
      />
    );
  }
  if (renderStatus === "downloaded") {
    button = (
      <Button
        disabled={disabled}
        iconLeft="download"
        kind="success"
        onClick={handleDownload}
        text={asButton ? "Download" : undefined}
        tooltip="Download"
        testId={testId}
      />
    );
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {button}
    </div>
  );
};

export default DownloadClip;
