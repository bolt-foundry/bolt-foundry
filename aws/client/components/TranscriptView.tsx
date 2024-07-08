import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import { DGWord, TranscriptType } from "aws/types/transcript.ts";
import { useCopyToClipboard } from "aws/client/hooks/useCopyToClipboard.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import {
  generateTranscriptText,
  transcriptToSrt,
} from "aws/client/lib/textUtilities.ts";
import { useFeatureTier } from "aws/client/hooks/featureFlagHooks.tsx";
import { downloadText } from "aws/client/lib/download.ts";
import { TranscriptViewQuery$data } from "aws/__generated__/TranscriptViewQuery.graphql.ts";
import classnames from "aws/client/lib/classnames.ts";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";
import FeatureMenu from "aws/client/components/FeatureMenu.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { captureEvent } from "aws/events/mod.ts";

const { useEffect, useCallback, useState } = React;
const { useLazyLoadQuery } = ReactRelay;

type Props = {
  projectId: Maybe<string>;
  ratio: number;
  videoUrl: Maybe<string>;
};

const query = await graphql`
  query TranscriptViewQuery($id: ID!) {
    project(id: $id) {
      id
      clips(first: 1000) {
        edges {
          node {
            id
            start_index
            end_index
            start_time
            end_time
          }
        }
      }
      transcripts(first: 1) {
        edges {
          node {
            id
            words
          }
        }
      }
    }
  }
`;

type HighlightedWord = {
  index: number;
  clipIds: Set<string>;
  firstWord?: boolean;
  lastWord?: boolean;
};

export default function TranscriptView(
  { projectId, ratio, videoUrl }: Props,
) {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const [_value, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [subtitled, setSubtitled] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<HighlightedWord[]>(
    [],
  );
  const [hoverClip, setHoverClip] = useState<Maybe<string>>(null);
  const [selectedClip, setSelectedClip] = useState<Maybe<string>>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(-1);
  const [playingWordIndex, setPlayingWordIndex] = useState<number>(-1);
  const [lastEndTime, setLastEndTime] = useState<number>(0);
  const enableSrtExport = useFeatureTier("basic");
  const data = useLazyLoadQuery(query, {
    id: projectId,
  }) as TranscriptViewQuery$data;
  const [transcriptWords, setTranscriptWords] = useState<Array<DGWord>>([]);
  const [transcriptText, setTranscriptText] = useState<string>("");

  useEffect(() => {
    let words = [];
    try {
      const rawData = data.project?.transcripts?.edges?.[0]?.node?.words;

      if (rawData) {
        words = JSON.parse(rawData);
      }
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Invalid JSON:", error);
    }
    setTranscriptWords(words);
    const text = generateTranscriptText(words);
    setTranscriptText(text);
  }, [data.project?.transcripts?.edges?.[0]?.node?.words]);

  useEffect(() => {
    setLastEndTime(0);
    setPlayingWordIndex(-1);
    setSelectedClip(null);
  }, [projectId]);

  useEffect(() => {
    const clips = data.project?.clips?.edges ?? [];
    const wordsToHighlight: HighlightedWord[] = [];

    clips.forEach((clip, index) => {
      const startIndex = transcriptWords.findIndex((word) => {
        if (word == null) return false;
        return (word.start ?? 0) >= (clip?.node?.start_time ?? 0);
      });
      const endIndex = transcriptWords.findIndex((word) => {
        if (word == null) return false;
        return (word.end ?? 0) >= (clip?.node?.end_time ?? 0);
      });

      for (let i = startIndex; i <= endIndex; i++) {
        const firstWord = i === startIndex;
        const lastWord = i === endIndex;

        const existingWord = wordsToHighlight.find((word) => {
          return word.index === i;
        });
        if (existingWord && clip?.node?.id) {
          existingWord.clipIds.add(clip.node.id);
          continue;
        }
        const clipIdSet = new Set<string>();
        if (clip?.node?.id) {
          clipIdSet.add(clip.node.id);
        }
        wordsToHighlight.push({
          index: i,
          clipIds: clipIdSet,
          firstWord,
          lastWord,
        });
      }
    });

    setHighlightedWords(wordsToHighlight);
  }, [data.project?.clips, transcriptWords]);

  const handleCopy = useCallback(() => {
    copy(transcriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    captureEvent("transcript", "copied", {}, personId);
  }, [copy, transcriptText]);

  const handleDownload = useCallback(() => {
    downloadText(
      transcriptText,
      "transcript.txt",
      () => setDownloaded(true),
      () => setDownloaded(false),
      personId,
    );
  }, [transcriptText]);

  const handleDownloadSubtitle = useCallback(() => {
    if (enableSrtExport !== true) {
      // deno-lint-ignore no-console
      console.log("SRT export not enabled");
      return;
    }
    const subtitle = transcriptToSrt(transcriptWords);
    downloadText(
      subtitle,
      "transcript.srt",
      () => setSubtitled(true),
      () => setSubtitled(false),
      personId,
    );
  }, [transcriptWords, enableSrtExport]);

  const handleMouseEnter = useCallback(
    (clipId: Maybe<string>, index: number) => {
      if (clipId) {
        setHoverClip(clipId);
        captureEvent("transcript", "hovered clip", {}, personId);
      }
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverClip(null);
  }, []);

  const toggleSelected = useCallback(
    (clipId: Maybe<string>) => {
      if (selectedClip === clipId) {
        setSelectedClip(null);
      } else {
        setSelectedClip(clipId);
        captureEvent("transcript", "selected clip", {}, personId);
      }
    },
    [selectedClip, selectedWordIndex],
  );

  const handleVideoTimeUpdate = useCallback(
    (time: number) => {
      // if we haven't got to the end of the word, don't do anything
      if (time < lastEndTime) return;
      let endTime = lastEndTime;

      // Check if the next word is the correct one
      const nextWord = transcriptWords[playingWordIndex + 1];
      if (nextWord && nextWord.start <= time && nextWord.end >= time) {
        setPlayingWordIndex(playingWordIndex + 1);
        setLastEndTime(nextWord.end);
        return;
      }

      // If the next word isn't the correct one, fall back to a linear search
      const index = transcriptWords.findIndex((word) => {
        if (word == null) return false;
        endTime = word.end;
        return word.start <= time && endTime >= time;
      });

      if (index === playingWordIndex) return;
      setPlayingWordIndex(index);
      setLastEndTime(endTime);
    },
    [transcriptWords, playingWordIndex, lastEndTime],
  );

  let displayRatio = "wide";
  if (ratio === 9 / 16) {
    displayRatio = "tall";
  }
  const videoClasses = classnames([
    "transcriptVideoContainer",
    displayRatio,
  ]);

  return (
    <div className="clips">
      <div className="transcript rowReverse-column">
        <div className="transcriptSidebar">
          <div className="stickySidebar">
            <div className="actions">
              {
                /* <Button
                iconLeft="check"
                kind={dirty ? "alert" : "secondary"}
                onClick={() => console.log("TODO: save changes")}
                tooltip="Save changes to clips"
                tooltipJustification="end"
                disabled={!dirty}
              /> */
              }
              <Button
                iconLeft={copied ? "clipboardCheck" : "clipboard"}
                kind={copied ? "success" : "secondary"}
                onClick={handleCopy}
                tooltip={copied ? "Copied!" : "Copy transcript to clipboard"}
                tooltipJustification="end"
                testId="button-copy-transcript"
              />
              <Button
                iconLeft={downloaded ? "downloadSolid" : "download"}
                kind={downloaded ? "success" : "secondary"}
                onClick={handleDownload}
                tooltip={downloaded
                  ? "Downloaded!"
                  : "Download transcript as txt"}
                tooltipJustification="end"
                testId="button-download-transcript"
              />
              {enableSrtExport
                ? (
                  <Button
                    iconLeft={subtitled ? "subtitleSolid" : "subtitle"}
                    kind={subtitled ? "success" : "secondary"}
                    onClick={handleDownloadSubtitle}
                    tooltip={subtitled
                      ? "Downloaded!"
                      : "Download subtitles as srt"}
                    tooltipJustification="end"
                    disabled={enableSrtExport !== true}
                    testId="button-download-subtitles"
                  />
                )
                : (
                  <Button
                    iconLeft="subtitle"
                    kind="secondary"
                    tooltip="Download subtitles"
                    tooltipJustification="end"
                    tooltipPosition="bottom"
                    tooltipMenu={<FeatureMenu feature="Subtitle download" />}
                    testId="button-download-subtitles-button"
                  />
                )}
            </div>
            {videoUrl && (
              <div className={videoClasses}>
                <VideoPlayer
                  src={videoUrl}
                  onTimeUpdate={(time) => {
                    handleVideoTimeUpdate(time);
                  }}
                  controls="below"
                  playerLocation="transcriptView"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className="transcriptBody"
          data-bf-testid="section-transcript"
          dir="auto"
        >
          {transcriptWords.map((item, index, arr) => {
            const highlightedClip = highlightedWords.find((word) => {
              return word.index === index;
            });
            if (item == null) return null;
            const word = item.punctuated_word;

            const classes = classnames([
              "word",
              {
                "first-word": highlightedClip?.firstWord,
                "last-word": highlightedClip?.lastWord,
                highlight: highlightedClip != null,
                hover: hoverClip != null &&
                  highlightedClip?.clipIds.has(hoverClip),
                clipSelected: selectedClip != null &&
                  highlightedClip?.clipIds.has(selectedClip),
                playing: playingWordIndex === index,
              },
            ]);

            return (
              <span
                key={index}
                className={classes}
                onMouseEnter={() => {
                  highlightedClip
                    ? setHoverClip(
                      highlightedClip?.clipIds.values().next().value,
                    )
                    : null;
                }}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  toggleSelected(
                    highlightedClip?.clipIds.values().next().value,
                  );
                }}
              >
                {word}
                {" "}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
