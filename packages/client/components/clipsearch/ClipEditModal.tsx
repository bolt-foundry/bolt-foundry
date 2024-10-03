import { React } from "deps.ts";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { DownloadClipButton } from "packages/client/components/clipsearch/DownloadClipButton.tsx";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { useClipEditData } from "packages/client/hooks/useClipEditData.tsx";
import { ClipEditModal_bfSavedSearchResult$key } from "packages/__generated__/ClipEditModal_bfSavedSearchResult.graphql.ts";
type Props = {
  setIsEditing: (isEditing: boolean) => void;
  bfSavedSearchResult$key: ClipEditModal_bfSavedSearchResult$key
};

const EXTRA_WORDS = 20;

const initialState = {
  startIndex: 30,
  endIndex: 45,
  endTimeOverride: null,
  highlightStartIndex: null,
  highlightEndIndex: null,
  editableText: null,
  editableTextPre: EXTRA_WORDS,
  editableTextPost: EXTRA_WORDS,
  wordsToUpdate: [],
  title: "test",
  manualCrop: [],
  manualCropActive: false,
};

const fragment = await graphql`
  fragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult{
    id
    title
    words(first: 10) {
      edges {
       node {
        word
        start
        end
        punctuated_word
        speaker
        }
      }
    }
  }
`;

export function ClipEditModal(
  { setIsEditing, bfSavedSearchResult$key }: Props,
) {
  const data = useFragment(fragment, bfSavedSearchResult$key);
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
                    {data.title}
                  </div>
                </div>
              </div>

              <div
                className="clipText"
                data-bf-testid="section-clip-text-editing"
                dir="auto"
              >
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
        </div>
      </BfDsModal>
    </>
  );
}
