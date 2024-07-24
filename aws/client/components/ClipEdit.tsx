import { graphql, type Maybe, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import DropdownSelector from "aws/client/ui_components/DropdownSelector.tsx";
import VideoPlayer, {
  type VideoPlayerHandles,
} from "aws/client/components/VideoPlayer.tsx";
import EditWord from "aws/client/components/EditWord.tsx";
import { DGWord } from "aws/types/transcript.ts";
import { createLogger } from "aws/logs/mod.ts";
import { captureEvent } from "aws/events/mod.ts";
import { useFeatureVariant } from "aws/client/hooks/featureFlagHooks.tsx";
import DownloadClip from "aws/client/components/DownloadClip.tsx";
import {
  DEFAULT_CROP,
  type ManualCrop,
} from "aws/client/components/ManualCropMenu.tsx";
import { CropModeWord } from "aws/client/components/CropModeWord.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import classnames from "aws/client/lib/classnames.ts";
import useKeyboardInput from "packages/client/hooks/useKeyboardInput.tsx";
import {
  ActionType,
  useClipEditData,
} from "aws/client/hooks/useClipEditData.tsx";
import { useClipEditData_clip$key } from "aws/__generated__/useClipEditData_clip.graphql.ts";
import StarClipButton from "aws/client/components/StarClipButton.tsx";
import ChangeRequestButton from "aws/client/components/ChangeRequestButton.tsx";
import { RenderSettings } from "aws/types/settings.ts";
import Input from "aws/client/ui_components/Input.tsx";
import Trim from "aws/client/components/Trim.tsx";
import { swearsFilter } from "aws/client/lib/textUtilities.ts";
import ManualCropMenu, {
  getCurrentCropIndex,
} from "aws/client/components/ManualCropMenu.tsx";
import Toggle from "aws/client/ui_components/Toggle.tsx";
import { StickerMenu } from "/aws/client/components/StickerMenu.tsx";
import { StickerModeWord } from "/aws/client/components/StickerModeWord.tsx";
import TextModeWord from "/aws/client/components/TextModeWord.tsx";
import { useClipContext } from "/aws/client/contexts/ClipContext.tsx";

const log = createLogger("Clip", "debug");
const logError = createLogger("Clip", "error");

const { useEffect } = React;
const { useMutation } = ReactRelay;

export type WordData = {
  index: number;
  word: DGWord;
  renderedWord: string;
  isCurrentWord: boolean;
  isExtraText: boolean;
  isHighlighted: boolean;
  nextStart: number;
};

type ClipType = useClipEditData_clip$key;

type ClipProps = {
  clip$key: ClipType;
  clipIndex: number;
  clipNumber: number;
  isSaved: boolean;
  onEditClip: () => void;
  onSaveClip: (wordsToUpdate: Array<DGWord>) => void;
  setClickOutsideToCloseModal?: (open: boolean) => void;
  setClipChanged?: (changed: boolean) => void;
  settings: RenderSettings;
  transcriptId: Maybe<string>;
  transcriptWords: Array<DGWord>;
  videoUrl: string;
};

const updateClipMutation = await graphql`
  mutation ClipEditUpdateClipMutation(
    $id: ID!,
    $text: String!,
    $title: String!,
    $description: String!,
    $startIndex: Int!,
    $endIndex: Int!,
    $startTime: Float!,
    $endTime: Float!
    $endTimeOverride: Float,
    $transcriptId: ID!,
    $wordsToUpdate: String!,
    $manualCrop: String!,
    $manualCropActive: Boolean!,
  ) {
    updateClip(
      id: $id,
      text: $text,
      title: $title,
      description: $description,
      start_index: $startIndex,
      end_index: $endIndex,
      start_time: $startTime,
      end_time: $endTime,
      endTimeOverride: $endTimeOverride,
      transcriptId: $transcriptId,
      wordsToUpdate: $wordsToUpdate,
      manualCrop: $manualCrop,
      manualCropActive: $manualCropActive,
    ) {
      id
      text
      title
      description
      start_index
      end_index
      start_time
      end_time
      endTimeOverride
    }
  }
`;

const encodeClipMutation = await graphql`
  mutation ClipEditEncodeClipMutation(
    $id: ID!,
  ) {
    encodeClip(
      id: $id,
    ) {
      id
    }
  }
`;

function ClipEdit({
  clip$key,
  clipIndex,
  clipNumber,
  isSaved,
  onEditClip,
  onSaveClip,
  setClipChanged,
  setClickOutsideToCloseModal,
  settings,
  transcriptId,
  transcriptWords,
  videoUrl,
}: ClipProps) {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const { data, dispatch, draftClip, state } = useClipEditData(
    clip$key,
    transcriptWords,
  );
  const [editMode, setEditMode] = React.useState("text");
  const {
    croppingWord,
    setCroppingWord,
    editingWord,
    setEditingWord,
    selectedWordIndex,
    setSelectedWordIndex,
    stickerStartWord,
    setStickerStartWord,
    stickerEndWord,
    setStickerEndWord,
    trimmingWord,
    setTrimmingWord,
  } = useClipContext();
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

  const [commitUpdate, isUpdatingMutationInFlight] = useMutation(
    updateClipMutation,
  );
  const videoPlayerRef = React.useRef<VideoPlayerHandles>(null);
  const swears = useFeatureVariant("sv_swear_words");

  useEffect(() => {
    if (typeof setClickOutsideToCloseModal === "function") {
      setClickOutsideToCloseModal(
        editingWord == null && selectedWordIndex == null,
      );
    }
  }, [setClickOutsideToCloseModal, editingWord, selectedWordIndex]);

  useKeyboardInput({
    keybindings: {
      "escape": () => {
        if (selectedWordIndex != null) {
          // close word menu
          setSelectedWordIndex(null);
        } else {
          // close clip editor
          captureEvent("clip", "editing cancelled", {}, personId);
          onEditClip();
        }
      },
      "enter": () => {
        if (selectedWordIndex != null) {
          // open word editor
          const word = transcriptWords[selectedWordIndex];
          const draftWord = state.wordsToUpdate.find((w) =>
            w.start === transcriptWords[selectedWordIndex].start
          );
          setEditingWord(draftWord ?? word);
        } else {
          // save clip and close modal
          updateClip();
        }
      },
      "i": () => {
        if (editingWord) {
          return;
        }
        if (selectedWordIndex != null) {
          // set startIndex to selected word
          dispatch({
            type: ActionType.SET_START_INDEX,
            payload: selectedWordIndex,
          });
        }
      },
      "o": () => {
        if (editingWord) {
          return;
        }
        if (selectedWordIndex != null) {
          // set endIndex to selected word
          dispatch({
            type: ActionType.SET_END_INDEX,
            payload: selectedWordIndex,
          });
        }
      },
      "arrowleft": () => {
        if (editingWord) {
          return;
        }
        if (selectedWordIndex != null) {
          // Select the previous word
          const newIndex = selectedWordIndex - 1;
          if (!state.editableText) {
            return;
          }
          // If the newIndex is greater than or equal to the first index in the editable text
          if (newIndex >= state.editableText[0].index) {
            setSelectedWordIndex(newIndex);
          }
          if (newIndex <= state.editableText[1].index) {
            // If we're almost to the beginning of the editable text, add more words
            dispatch({
              type: ActionType.SET_EDITABLE_TEXT_PRE,
              payload: state.editableTextPre + 10,
            });
          }
        }
      },
      "arrowright": () => {
        if (editingWord) {
          return;
        }
        if (selectedWordIndex != null) {
          // select next word to the right
          const newIndex = selectedWordIndex + 1;
          if (!state.editableText) {
            return;
          }
          // If the newIndex is less than or equal to the last index in the editable text
          if (
            newIndex <=
              state.editableText?.[state.editableText.length - 1].index
          ) {
            setSelectedWordIndex(newIndex);
          }
          if (
            newIndex >= state.editableText[state.editableText.length - 2].index
          ) {
            // If we're almost to the end of the editable text, add more words
            dispatch({
              type: ActionType.SET_EDITABLE_TEXT_POST,
              payload: state.editableTextPost + 10,
            });
          }
        }
      },
      "arrowup": () => {
        if (editingWord) {
          return;
        }
        // find the word within the start and end index that is closest to the current time
        const word = state.editableText?.find((x, i, arr) =>
          x.item.start <= currentTime &&
          (arr[i + 1]?.item.start ?? Infinity) > currentTime
        );
        if (word) {
          setSelectedWordIndex(word.index);
        }
      },
      "arrowdown": () => {
        if (editingWord) {
          return;
        }
        setSelectedWordIndex(null);
      },
      "space": () => {
        if (editingWord) {
          return;
        }
        if (isVideoPlaying) {
          videoPlayerRef.current?.pause();
        } else {
          videoPlayerRef.current?.playThrough();
        }
      },
      "j": () => {
        if (editingWord) {
          return;
        }
        videoPlayerRef.current?.reversePlayback();
      },
      "k": () => {
        if (editingWord) {
          return;
        }
        if (isVideoPlaying) {
          if (videoPlayerRef.current?.playbackRate === 1) {
            videoPlayerRef.current?.pause();
          } else if (videoPlayerRef.current) {
            videoPlayerRef.current.playbackRate = 1;
          }
        } else {
          videoPlayerRef.current?.playThrough();
        }
      },
      "l": () => {
        if (editingWord) {
          return;
        }
        if (isVideoPlaying) {
          videoPlayerRef.current?.increasePlaybackRate();
        }
      },
    },
    isActive: !editingWord && !isEditingTitle,
  });

  useEffect(() => {
    if (typeof setClipChanged === "function") {
      // if startIndex or endIndex change, or words updated set clipChanged to true
      if (
        state.startIndex !== data?.start_index ||
        state.endIndex !== data?.end_index ||
        state.wordsToUpdate.length > 0 ||
        state.endTimeOverride !== data?.endTimeOverride
      ) {
        setClipChanged(true);
      }
    }
  }, [
    setClipChanged,
    state.startIndex,
    state.endIndex,
    state.wordsToUpdate,
    state.endTimeOverride,
  ]);

  const clipData = draftClip;

  const seconds = Math.round(
    ((clipData?.end_time ?? 0) - (clipData?.start_time ?? 0)) * 100,
  ) / 100;

  function updateClip() {
    if (!draftClip) {
      logError("No clip to update");
      return;
    }
    commitUpdate({
      variables: {
        id: draftClip.id,
        text: draftClip.text,
        title: draftClip.title,
        description: draftClip.description,
        startIndex: draftClip.start_index,
        endIndex: draftClip.end_index,
        startTime: draftClip.start_time,
        endTime: draftClip.end_time,
        endTimeOverride: draftClip.endTimeOverride,
        transcriptId,
        wordsToUpdate: JSON.stringify(state.wordsToUpdate),
        manualCrop: JSON.stringify(state.manualCrop),
        manualCropActive: state.manualCropActive,
      },
      optimisticResponse: {
        updateClip: {
          id: draftClip.id,
          text: draftClip.text,
          title: draftClip.title,
          description: draftClip.description,
          start_index: draftClip.start_index,
          end_index: draftClip.end_index,
          start_time: draftClip.start_time,
          end_time: draftClip.end_time,
          endTimeOverride: draftClip.endTimeOverride,
          manualCrop: state.manualCrop,
          manualCropActive: state.manualCropActive,
        },
      },
      onCompleted: (data) => {
        log("onCompleted", data);
        captureEvent("clip", "saved", {}, personId);
        onSaveClip(state.wordsToUpdate);
      },
      onError: (err) => {
        logError("onError", err);
      },
    });
  }

  function goto(time: number) {
    videoPlayerRef.current?.gotoTime(time);
  }

  const handleUpdateWord = (word: DGWord) => {
    dispatch({ type: ActionType.SET_WORD_TO_UPDATE, payload: word });
  };

  const handleTrimEnd = (newEndTime: number) => {
    setTrimmingWord(null);
    dispatch({ type: ActionType.SET_END_TIME_OVERRIDE, payload: newEndTime });
  };

  const handlePlayingStateChange = (isPlaying: boolean) => {
    setIsVideoPlaying(isPlaying);
  };

  function handleUpsertManualCrop(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!croppingWord) return;
    const currentCropIndex = state.manualCrop.findIndex((crop) =>
      crop.start >= croppingWord.start && crop.start < croppingWord.end
    );
    let currentCrop = { ...DEFAULT_CROP };
    if (currentCropIndex > -1) {
      currentCrop = { ...state.manualCrop[currentCropIndex] };
    }
    const name = e.target.name as keyof ManualCrop;
    currentCrop[name] = parseFloat(e.target.value);
    currentCrop.start = croppingWord.start;
    const manualCropData = [...state.manualCrop] as Array<ManualCrop>;
    if (currentCropIndex > -1) {
      manualCropData[currentCropIndex] = currentCrop;
    } else {
      manualCropData.push(currentCrop);
    }
    updateManualCrop(manualCropData);
  }

  function handleDeleteManualCrop(index: number) {
    const manualCropData = [...state.manualCrop] as Array<ManualCrop>;
    manualCropData.splice(index, 1);
    updateManualCrop(manualCropData);
  }

  function updateManualCrop(manualCropData: Array<ManualCrop>) {
    manualCropData.sort((a, b) => a.start - b.start);
    dispatch({
      type: ActionType.SET_MANUAL_CROP,
      payload: manualCropData,
    });
  }

  let displayRatio = "wide";
  if (settings.ratio === 9 / 16) {
    displayRatio = "tall";
  }
  const videoClasses = classnames([
    "videoPlayer",
    "videoPlayerEditing",
    displayRatio,
  ]);

  const lastWordStartTime = state.editableText?.[state.editableText.length - 1]
    ?.item?.start;

  const invalidTitle = draftClip.title == null || draftClip.title === "";

  const currentCropIndex = getCurrentCropIndex(state.manualCrop, currentTime);
  const currentCrop = state.manualCrop[currentCropIndex];
  const cropStyle = state.manualCropActive && currentCrop != null
    ? {
      objectViewBox:
        `inset(${currentCrop.top}% ${currentCrop.right}% ${currentCrop.bottom}% ${currentCrop.left}%)`,
    }
    : {};

  return (
    <>
      <div
        className="clipInner clipContainer clipEdit"
        style={{ minHeight: 400 }}
      >
        <div className={videoClasses}>
          <VideoPlayer
            controls="below"
            src={videoUrl}
            startTime={clipData.start_time ?? 0}
            endTime={clipData.end_time ?? 0}
            xstyle={{ borderRadius: 8, ...cropStyle }}
            playerLocation="clipEditor"
            showScrubber={true}
            onPlayingStateChange={handlePlayingStateChange}
            onTimeUpdate={(time: number) => {
              setCurrentTime(time);
            }}
            lastWordStartTime={lastWordStartTime}
            playingLastWordCb={() => {
              dispatch({
                type: ActionType.SET_EDITABLE_TEXT_POST,
                payload: state.editableTextPost + 10,
              });
            }}
            ref={videoPlayerRef}
          />
        </div>
        <div className="clipContent">
          <div className="clipHeader">
            <div className="clipHeaderLeft">
              <div className="clipTitle" dir="auto">
                <span style={{ fontWeight: 300 }}>{clipNumber}</span>
                <div style={{ flex: 1 }}>
                  <Input
                    value={clipData.title ?? ""}
                    meta={invalidTitle && (
                      <span className="metaAlert">Title is required</span>
                    )}
                    onFocus={() => setIsEditingTitle(true)}
                    onBlur={() => setIsEditingTitle(false)}
                    onChange={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: ActionType.SET_TITLE,
                        payload: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="clipDescription" dir="auto">
                {clipData.description}
              </div>
            </div>
          </div>

          <div className="clipMain">
            <div
              className="clipText"
              data-bf-testid="section-clip-text-editing"
              dir="auto"
            >
              {state.editableText?.map((xitem, index, arr) => {
                const item = xitem.item;
                const i = xitem.index;
                const draftWord = state.wordsToUpdate.find((w) =>
                  w.start === item.start
                );
                const isExtraText = i < state.startIndex ||
                  i > state.endIndex;
                if (item == null) {
                  return null;
                }
                let isHighlighted = false;
                if (
                  state.highlightStartIndex != null ||
                  state.highlightEndIndex != null
                ) {
                  isHighlighted =
                    i >= (state.highlightStartIndex ?? state.startIndex) &&
                    i <= (state.highlightEndIndex ?? state.endIndex);
                }
                const nextStart = arr[index + 1]?.item?.start ??
                  arr[arr.length - 1]?.item?.end;
                const isCurrentWord = currentTime >= item.start &&
                  currentTime < nextStart;
                const word = draftWord ?? item;

                const swearsOptions = {
                  useAsterisks: settings.censorUseAsterisks,
                  showFirstLetter: settings.censorShowFirstLetter,
                };
                let renderedWord = settings.censorSwears
                  // @ts-ignore - swears is not typed properly
                  ? swearsFilter(word.punctuated_word, swears, swearsOptions)
                  : word.punctuated_word;
                renderedWord = `${renderedWord} `; // add a space after each word

                const wordData = {
                  index: i,
                  word,
                  renderedWord,
                  isCurrentWord,
                  isExtraText,
                  isHighlighted,
                  nextStart,
                };

                switch (editMode) {
                  case "crop":
                    return (
                      <CropModeWord
                        goto={goto}
                        manualCrop={state.manualCrop}
                        updateManualCrop={updateManualCrop}
                        state={state}
                        wordData={wordData}
                      />
                    );
                  case "sticker":
                    return (
                      <StickerModeWord
                        goto={goto}
                        wordData={wordData}
                      />
                    );
                  default:
                    return (
                      <TextModeWord
                        endTimeOverride={draftClip.endTimeOverride ??
                          data.endTimeOverride ?? null}
                        wordData={wordData}
                        goto={goto}
                        state={state}
                        dispatch={dispatch}
                      />
                    );
                }
              })}
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
        {editingWord && (
          <EditWord
            onClose={() => setEditingWord(null)}
            word={editingWord}
            transcriptId={transcriptId}
            updateWord={handleUpdateWord}
            videoPlayerRef={videoPlayerRef}
            videoPlayerIsPlaying={isVideoPlaying}
          />
        )}
        {trimmingWord && (
          <Trim
            currentValue={trimmingWord.currentValue ?? 0}
            startTime={trimmingWord.startTime ?? 0}
            endTime={trimmingWord.endTime ?? 0}
            onClose={() => setTrimmingWord(null)}
            onSave={handleTrimEnd}
          />
        )}
        {croppingWord && (
          <ManualCropMenu
            clip$key={data}
            croppingWord={croppingWord}
            manualCrop={state.manualCrop}
            manualCropActive={state.manualCropActive}
            handleChange={handleUpsertManualCrop}
            handleDelete={handleDeleteManualCrop}
            handleClose={() => setCroppingWord(null)}
          />
        )}
        {stickerEndWord && (
          <StickerMenu
            handleClose={() => {
              setStickerStartWord(null);
              setStickerEndWord(null);
            }}
            /* handleDispatchAction={handleDispatchAction} */
            startingImageWord={stickerStartWord}
            endingImageWord={stickerEndWord}
          />
        )}
      </div>

      <div className="clipFooter">
        <div className="clipFooterActions">
          <div style={{ flex: 1 }}>
            <Button
              kind="outline"
              text="Cancel"
              onClick={() => {
                captureEvent("clip", "editing cancelled", {}, personId);
                onEditClip();
              }}
              testId="button-cancel-clip-editing"
            />
          </div>
          <div className="flexRow gap8">
            <DropdownSelector
              options={{ "Text": "text", "Crop": "crop", "Sticker": "sticker" }}
              value={editMode}
              onChange={setEditMode}
              placeholder="Edit mode"
              position="top"
            />
            <Toggle
              label="Crop Active"
              value={state.manualCropActive}
              onChange={() => {
                dispatch({
                  type: ActionType.SET_MANUAL_CROP_ACTIVE,
                  payload: !state.manualCropActive,
                });
              }}
            />
            <StarClipButton clip$key={data} size="medium" />
            <ChangeRequestButton clip$key={data} size="medium" />
            <DownloadClip
              asButton={true}
              videoUrl={videoUrl}
              clip$key={data}
              clipEdits={{
                startIndex: draftClip.start_index,
                endIndex: draftClip.end_index,
                startTime: draftClip.start_time,
                endTime: draftClip.end_time,
                endTimeOverride: draftClip.endTimeOverride,
                wordsToUpdate: state.wordsToUpdate,
                manualCrop: state.manualCrop,
                manualCropActive: state.manualCropActive,
              }}
              disabled={invalidTitle}
              downloadTitle={`${clipNumber} ${draftClip.title}`}
              transcriptWords={transcriptWords}
              settings={settings}
              testId="button-download-clip-editing"
            />
            <Button
              disabled={invalidTitle}
              kind="primary"
              text="Save"
              onClick={updateClip}
              showSpinner={isUpdatingMutationInFlight}
              testId="button-save-clip-editing"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default ClipEdit;
