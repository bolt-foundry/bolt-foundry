import { React } from "aws/client/deps.ts";
import Icon from "/aws/client/ui_components/Icon.tsx";
import { DGWord } from "/aws/types/transcript.ts";
import { WordData } from "/aws/client/components/ClipEdit.tsx";
import { useClipContext } from "/aws/client/contexts/ClipContext.tsx";
import classnames from "/aws/client/lib/classnames.ts";

type Props = {
  goto: (index: number) => void;
  wordData: WordData;
};

export function StickerModeWord(
  {
    goto,
    wordData,
  }: Props,
) {
  const {
    stickerStartWord,
    setStickerStartWord,
    stickerEndWord,
    setStickerEndWord,
  } = useClipContext();
  const {
    index,
    word,
    renderedWord,
    isCurrentWord,
    isExtraText,
  } = wordData;
  const [inputValue, setInputValue] = React.useState(word.start);
  const [rangeWidth, setRangeWidth] = React.useState(0);
  const rangeInputRef = React.useRef<HTMLInputElement>(null);
  const stickerLineRef = React.useRef<HTMLDivElement>(null);

  function handleChangeStickerStartTime(word: DGWord) {
    setStickerStartWord(word);
  }
  function handleChangeStickerEndTime(word: DGWord) {
    setStickerEndWord(word);
  }

  const handleRangeCommit = () => {
    handleChangeStickerStartTime(word);
  };
  const isStickerKeyframe = false;
  // const isStickerKeyframe = manualCrop.some(
  //   (crop) => crop.start >= word.start && crop.start < word.end,
  // );

  return (
    <span
      key={index}
      className={classnames([
        "clipWord",
        { clipWordLight: isExtraText },
        { clipCurrentWord: isCurrentWord },
      ])}
      onClick={() => goto(word.start)}
      onDoubleClick={() => {
        if (stickerStartWord) {
          setStickerEndWord(word);
          // handleDispatchAction(
          //   ActionType.SET_STICKER_END_TIME,
          //   word.end,
          // );
          console.log("last word set");
          console.log(stickerStartWord);
          console.log(stickerEndWord);
        } else {
          setStickerStartWord(word);
          // handleDispatchAction(
          //   ActionType.SET_STICKER_START_TIME,
          //   word.start,
          // );

          console.log("first word set");
          console.log(stickerStartWord);
          console.log(stickerEndWord);
        }
      }}
    >
      {renderedWord}
      <div className="lineHighlight stickerLine" ref={stickerLineRef}>
        {isStickerKeyframe && (
          <>
            <div className="isCroppedIcon">
              <Icon
                color="white"
                name="starSolid"
                size={12}
              />
            </div>
            <input
              ref={rangeInputRef}
              type="range"
              min={word.start}
              max={word.end}
              step={0.01}
              value={inputValue}
              onChange={(e) => {
                setInputValue(parseFloat(e.target.value));
              }}
              onMouseUp={handleRangeCommit}
              onTouchEnd={handleRangeCommit}
              className="cropRangeInput"
              style={{ width: rangeWidth }}
            />
          </>
        )}
      </div>
    </span>
  );
}
