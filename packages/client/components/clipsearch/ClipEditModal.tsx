import { React } from "deps.ts";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { useRefetchableFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { useClipEditData } from "packages/client/hooks/useClipEditData.tsx";
import { ClipWord } from "packages/client/components/clipsearch/ClipWord.tsx";
import { ClipEditModal_bfSavedSearchResult$key } from "packages/__generated__/ClipEditModal_bfSavedSearchResult.graphql.ts";
import { useState } from "react";
type Props = {
  setIsEditing: (isEditing: boolean) => void;
  bfSavedSearchResult$key: ClipEditModal_bfSavedSearchResult$key;
};

const EXTRA_TIME_MS = 15000;
const FAKE_START_TIME_MS = 33530;
const FAKE_END_TIME_MS = 74434;

const fragment = await graphql`
  fragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult
    @refetchable(queryName: "ClipEditModalRefetchQuery")
    @argumentDefinitions(
    startTime: { type: "TimecodeInMilliseconds" }
    endTime: { type: "TimecodeInMilliseconds" }
  ) {
    id
    title
    startTime
    endTime
    duration
    words( startTime: $startTime, endTime: $endTime ) {
      text
      startTime
      endTime
      speaker
  }
}
`;

export function ClipEditModal(
  { setIsEditing, bfSavedSearchResult$key }: Props,
) {
  const [data, refetch] = useRefetchableFragment(
    fragment,
    bfSavedSearchResult$key,
  );

  const initialDraftClip = {
    id: data?.id,
    title: data?.title,
    startTime: data?.startTime,
    endTime: data?.endTime,
    duration: data?.duration,
    newWords: [],
  };

  const [draftClip, setDraftClip] = useState(initialDraftClip);

  const updateStartAndEndTime = (startTime?, endTime?) => {
    const newStartTime = startTime || draftClip.startTime;
    const newEndTime = endTime || draftClip.endTime;
    setDraftClip({
      ...draftClip,
      startTime: newStartTime,
      endTime: newEndTime,
    });
    refetch({ startTime: newStartTime, endTime: newEndTime });
  };
  const updateWord = (newWord) => {
    setDraftClip({
      ...draftClip,
      newWords: [...draftClip.newWords, newWord],
    });
  };
  const words = data.words.map((word) => {
    if (draftClip.newWords.length > 0) {
      for (const newWord of draftClip.newWords) {
        if (newWord.startTime === word.startTime) {
          return newWord;
        }
      }
    }
    return word;
  });
  return (
    <>
      <BfDsModal onClose={() => setIsEditing(false)}>
        <div className="clip">
          <div className="clipInner clipContainer">
            <FeatureFlag name="placeholder">
              <div className="videoPlayer tall">
                (video player)
              </div>
            </FeatureFlag>
            <div className="clipContent">
              <div className="clipHeader">
                <div className="clipHeaderLeft">
                  <div className="clipTitle" dir="auto">
                    {draftClip.title}
                  </div>
                </div>
              </div>

              <div
                className="clipText"
                data-bf-testid="section-clip-text-editing"
                dir="auto"
              >
                {words.map((word) => {
                  return (
                    <ClipWord
                      word={word}
                      clipStartTime={draftClip.startTime}
                      clipEndTime={draftClip.endTime}
                      updateStartAndEndTime={updateStartAndEndTime}
                      updateWord={updateWord}
                    />
                  );
                })}
                {
                  /* {state.editableText?.map((xitem, index, arr) => {
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
                })} */
                }
              </div>

              {
                /* <div className="clipMeta flexColumn" style={{ gap: "10px" }}>
                <div className="flexRow" style={{ gap: "5px" }}>
                  <BfDsTooltip canCopy text={mediaId} position="right">
                    <Pill label="Source" text={filename ?? "filename""} />
                  </BfDsTooltip>
                  <BfDsTooltip text={rationale} position="right">
                    <Pill label="Rating" text={confidence} />
                  </BfDsTooltip>
                  <BfDsTooltip
                    text={`Start: ${startTime} End: ${endTime}`}
                    position="right"
                  >
                    <Pill label="Length" text={length} />
                  </BfDsTooltip>
                </div>
              </div> */
              }
            </div>
          </div>
          <BfDsButton
            text="Save"
            kind="primary"
            onClick={() => {
              setIsEditing(false);
            }}
          />
        </div>
      </BfDsModal>
    </>
  );
}
