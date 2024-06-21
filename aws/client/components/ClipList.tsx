import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import {
  ClipList_project$key,
} from "aws/__generated__/ClipList_project.graphql.ts";
import { useClipEditData_clip$key } from "aws/__generated__/useClipEditData_clip.graphql.ts";
import Clip from "aws/client/components/Clip.tsx";
import Modal from "aws/client/ui_components/Modal.tsx";
import Tabs, { Tab } from "aws/client/ui_components/Tabs.tsx";
import type { DGWord } from "aws/types/transcript.ts";
import ClipListNull from "aws/client/components/ClipListNull.tsx";
import Button from "aws/client/ui_components/Button.tsx";
const { usePaginationFragment } = ReactRelay;
import { useAppState } from "aws/client/contexts/AppStateContext.tsx";
import TranscriptView from "aws/client/components/TranscriptView.tsx";
import ClipEdit from "aws/client/components/ClipEdit.tsx";
import { FullPageSpinner } from "aws/client/components/Spinner.tsx";
import {
  DEFAULT_SETTINGS,
  WatermarkLogoType,
} from "aws/types/settings.ts";
import useIntersectionObserver from "aws/client/hooks/useIntersectionObserver.tsx";
import { RenderSettings } from "aws/types/settings.ts";

const { useEffect, useState, useRef, Suspense } = React;

type Props = {
  project$key: ClipList_project$key | null;
  gotoClip: string | null;
  videoSrc: string;
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: 24,
    color: "var(--textSecondary)",
    fontSize: 14,
  },
  sidebar: {
    marginRight: 20,
    width: 180,
  },
  sidebarSettings: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 6,
    position: "sticky",
    top: 60,
  },
  tabs: {
    display: "flex",
    alignItems: "center",
  },
  contentXstyle: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: 1,
    overflowY: "hidden",
  },
};

const fragment = await graphql`
  fragment ClipList_project on Project @refetchable(
    queryName: "ClipListPaginationQuery"
  ) {
    id
    effectiveSettings {
      ...SettingsFormQuery_settings
      additionalJson
      censorShowFirstLetter
      censorSwears
      censorUseAsterisks
      captionColor
      captionHighlightColor
      captionLines
      captionWordsPerLine
      ratio
      minimumWords
      showCaptions
      font
      showWatermark
      showTrackingDebug
      template
      useAutocropping
      useTracking
      watermarkLogo
      watermarkOpacity
      watermarkPosition
      largeMovementThresholdPct
    }
    clips(
      first: $count, 
      after: $cursor
    ) @connection(key: "ClipList_project_clips") {
      edges {
        node {
          ...useClipData_clip
          ...useClipEditData_clip
          id
          downloadUrl
          end_index
          start_index
          text
          isStarred
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
    clipsLength
    transcripts(first: 1) {
      edges {
        node {
          id
          transcriptLength
          words
        }
      }
    }
    videoUrl
    opurl
  }
`;

const subscriptionFragment = await graphql`
  subscription ClipListSubscription($id: ID!) {
    project(id: $id) {
      transcripts(first: 1) {
        edges {
          node {
            transcriptLength
          }
        }
      }
    }
  }
`;

export default function ClipList({ project$key, gotoClip, videoSrc }: Props) {
  const [selectedTabName, setSelectedTabName] = useState<string>("Clips");
  const [selectedClipIndex, setSelectedClipIndex] = useState<
    number | null
  >();
  const [transcriptWords, setTranscriptWords] = useState<Array<DGWord>>([]);
  const [clipChanged, setClipChanged] = useState<boolean>(false);
  const [clickOutsideToCloseModal, setClickOutsideToCloseModal] = useState<
    boolean
  >(false);
  const { setSettingsOpen } = useAppState();
  const refContainer = useRef<Record<string, HTMLDivElement | null>>({});
  const previousSelectedClipIndex = useRef<number | null>(null);
  const { isVisible: shouldLoadMoreClips, domRef: infiniteScrollTriggerRef } =
    useIntersectionObserver();

  useEffect(() => {
    if (selectedClipIndex != null) {
      previousSelectedClipIndex.current = selectedClipIndex;
    }
  }, [selectedClipIndex]);

  const { data, loadNext, hasNext, isLoadingNext, refetch } =
    usePaginationFragment(
      fragment,
      project$key,
    );

  useEffect(() => {
    if (shouldLoadMoreClips && hasNext && !isLoadingNext) {
      loadNext(10);
    }
  }, [shouldLoadMoreClips, hasNext, isLoadingNext, loadNext]);

  const subscriptionConfig: GQLSubConfigOperationType = React.useMemo(
    () => ({
      variables: { id: data?.id },
      subscription: subscriptionFragment,
      updater: (store) => {
        const newProject = store.getRootField("project");
        store.getRoot().setLinkedRecord(newProject, "project", {
          id: data?.id,
        });
      },
    }),
    [data?.id],
  );
  ReactRelay.useSubscription(subscriptionConfig);

  const { id: transcriptId, transcriptLength, words } =
    data?.transcripts?.edges?.[0]?.node ?? {};

  useEffect(() => {
    if (transcriptLength != null && transcriptLength > 0) {
      refetch({ id: data?.id });
    }
  }, [transcriptLength]);

  useEffect(() => {
    let wordsArray = [];
    try {
      const rawData = words;
      if (rawData) {
        wordsArray = JSON.parse(rawData);
      }
    } catch (error) {
      // deno-lint-ignore no-console
      console.error("Invalid JSON:", error);
    }
    setTranscriptWords(wordsArray);
  }, [
    words,
    transcriptLength,
  ]);

  useEffect(() => {
    if (gotoClip != null) {
      const clipElement = refContainer.current[gotoClip];
      clipElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [gotoClip]);

  const updateTranscriptWords = (wordsToUpdate: Array<DGWord>) => {
    const updatedWords = [...transcriptWords];
    wordsToUpdate.forEach((word) => {
      const index = updatedWords.findIndex((w) => w.start === word.start);
      if (index > -1) {
        updatedWords[index] = word;
      }
    });
    setTranscriptWords(updatedWords);
  };

  const projectSettings = data?.effectiveSettings ?? DEFAULT_SETTINGS;
  const minClipLengthSetting = projectSettings.minimumWords;
  const minClipLength = minClipLengthSetting ?? 25;

  const clips = data?.clips?.edges ?? [];
  let clipItemsToRender = minClipLength > 0
    // filter out clips that are shorter than the minimum words in settings
    ? clips.filter((clip) => {
      return (clip?.node?.end_index ?? 0) - (clip?.node?.start_index ?? 0) >
        minClipLength;
    })
    : clips;
  if (selectedTabName === "Starred Clips") {
    clipItemsToRender = clips.filter((clip) => {
      return clip?.node?.isStarred ?? false;
    });
  }

  const showFooter = selectedTabName === "Clips";

  const tabs: Tab[] = [
    {
      name: "Clips",
      count: data?.clipsLength ?? 0,
    },
    {
      name: "Starred Clips",
    },
    {
      name: "Transcript",
    },
  ];

  const settings: RenderSettings = {
    additionalJson: projectSettings.additionalJson ??
      DEFAULT_SETTINGS.additionalJson,
    censorShowFirstLetter: projectSettings.censorShowFirstLetter ??
      DEFAULT_SETTINGS.censorShowFirstLetter,
    censorSwears: projectSettings.censorSwears ?? DEFAULT_SETTINGS.censorSwears,
    censorUseAsterisks: projectSettings.censorUseAsterisks ??
      DEFAULT_SETTINGS.censorUseAsterisks,
    captionColor: projectSettings.captionColor ?? DEFAULT_SETTINGS.captionColor,
    captionHighlightColor: projectSettings.captionHighlightColor ??
      DEFAULT_SETTINGS.captionHighlightColor,
    captionLines: projectSettings.captionLines ?? DEFAULT_SETTINGS.captionLines,
    captionWordsPerLine: projectSettings.captionWordsPerLine ??
      DEFAULT_SETTINGS.captionWordsPerLine,
    font: projectSettings.font ?? DEFAULT_SETTINGS.font,
    ratio: projectSettings.ratio ?? DEFAULT_SETTINGS.ratio,
    showCaptions: projectSettings.showCaptions ?? DEFAULT_SETTINGS.showCaptions,
    showWatermark: projectSettings.showWatermark ??
      DEFAULT_SETTINGS.showWatermark,
    showTrackingDebug: projectSettings.showTrackingDebug ??
      DEFAULT_SETTINGS.showTrackingDebug,
    template: projectSettings.template ?? DEFAULT_SETTINGS.template,
    useAutocropping: projectSettings.useAutocropping ??
      DEFAULT_SETTINGS.useAutocropping,
    useTracking: projectSettings.useTracking ?? DEFAULT_SETTINGS.useTracking,
    watermarkLogo: projectSettings.watermarkLogo as WatermarkLogoType ??
      DEFAULT_SETTINGS.watermarkLogo,
    watermarkOpacity: projectSettings.watermarkOpacity ??
      DEFAULT_SETTINGS.watermarkOpacity,
    // @ts-expect-error fix watermarkPosition type
    watermarkPosition: projectSettings.watermarkPosition ??
      DEFAULT_SETTINGS.watermarkPosition,
    largeMovementThresholdPct: projectSettings.largeMovementThresholdPct ??
      DEFAULT_SETTINGS.largeMovementThresholdPct,
  };

  const clipItems = clipItemsToRender?.map((c, index) => {
    const clip = c?.node;
    if (!clip) return null;
    const highlightClip = clip != null && gotoClip === clip.id;
    const highlightAfterEdit = selectedClipIndex == null &&
      previousSelectedClipIndex.current === index;

    return (
      <div
        className={`clip ${highlightClip && "selected"} ${highlightAfterEdit && "highlight-and-fade"
          }`}
        key={clip.id}
        ref={(el) => {
          if (clip?.id) {
            refContainer.current[clip.id] = el;
          }
        }}
      >
        <Clip
          clip$key={clip}
          key={clip.id}
          clipIndex={index}
          isSaved={false}
          settings={settings}
          transcriptId={transcriptId}
          transcriptWords={transcriptWords}
          videoUrl={videoSrc}
          onEditClip={() => setSelectedClipIndex(index)}
          onSaveClip={(wordsToUpdate) => updateTranscriptWords(wordsToUpdate)}
        />
      </div>
    );
  });

  return (
    <>
      <div className="tabs" style={styles.tabs}>
        <div style={{ flex: 1 }}>
          <Tabs tabs={tabs} onTabSelected={setSelectedTabName} />
        </div>
      </div>
      {selectedTabName === "Transcript" && (
        <Suspense fallback={<FullPageSpinner />}>
          <TranscriptView
            projectId={data?.id}
            ratio={projectSettings.ratio ?? 16 / 9}
            videoUrl={videoSrc}
          />
        </Suspense>
      )}
      {selectedTabName !== "Transcript" && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1 }}>
            <div className="clips">
              {clipItems.length > 0 ? clipItems : (
                <ClipListNull
                  text={selectedTabName === "Starred Clips"
                    ? "There aren't any starred clips"
                    : undefined}
                  subtext={selectedTabName === "Starred Clips"
                    ? "Click the star icon on a clip to star it"
                    : undefined}
                />
              )}
              {hasNext && (
                <Button
                  kind="secondary"
                  onClick={() => loadNext(10)}
                  showSpinner={isLoadingNext}
                  text={isLoadingNext ? "Loading..." : "Load more clips..."}
                  testId="button-load-more-clips"
                />
              )}
              {showFooter && (
                <div style={styles.footer} ref={infiniteScrollTriggerRef}>
                  {hasNext
                    ? `There are ${clips.length} of ${data?.clipsLength} clips loaded. `
                    : `All ${data?.clipsLength} clips are loaded. `}
                  Currently showing {clipItemsToRender.length}{" "}
                  clips with at least {minClipLength}{" "}
                  words based on the minimum word count in{" "}
                  <a
                    href="#"
                    onClick={() =>
                      setSettingsOpen(true)}
                  >
                    Settings
                  </a>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedClipIndex != null &&
        clipItemsToRender[selectedClipIndex]?.node != null && (
          <Modal
            confirmClose={clipChanged}
            clickOusideToClose={clickOutsideToCloseModal}
            onClose={() => {
              setClipChanged(false);
              setSelectedClipIndex(null);
            }}
            kind="clip editor"
            contentXstyle={styles.contentXstyle}
          >
            <ClipEdit
              clip$key={clipItemsToRender[selectedClipIndex]
                ?.node as useClipEditData_clip$key}
              clipIndex={selectedClipIndex}
              isSaved={false}
              setClipChanged={setClipChanged}
              setClickOutsideToCloseModal={setClickOutsideToCloseModal}
              settings={settings}
              transcriptId={transcriptId}
              transcriptWords={transcriptWords}
              videoUrl={data?.opurl ?? data?.videoUrl ?? ""}
              onEditClip={() => {
                setClipChanged(false);
                setSelectedClipIndex(null);
              }}
              onSaveClip={(wordsToUpdate) => {
                updateTranscriptWords(wordsToUpdate);
                setClipChanged(false);
                setSelectedClipIndex(null);
              }}
            />
          </Modal>
        )}
    </>
  );
}
