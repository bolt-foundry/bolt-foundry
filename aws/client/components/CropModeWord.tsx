import { React } from "aws/client/deps.ts";
import Icon from "/aws/client/ui_components/Icon.tsx";
import { DGWord } from "/aws/types/transcript.ts";
import { ManualCrop, getCurrentCrop } from "/aws/client/components/ManualCropMenu.tsx";
import { WordData } from "/aws/client/components/ClipEdit.tsx";
import classnames from "/aws/client/lib/classnames.ts";
import { useClipContext } from "/aws/client/contexts/ClipContext.tsx";
import { ClipReducerState } from "/aws/client/hooks/useClipEditData.tsx";

type Props = {
  goto: (time: number) => void;
  manualCrop: Array<ManualCrop>;
  updateManualCrop: (manualCrop: Array<ManualCrop>) => void;
  state: ClipReducerState,
  wordData: WordData;
};

export function CropModeWord(
  {
    goto,
    manualCrop,
    updateManualCrop,
    state,
    wordData,
  }: Props,
) {
  const {
    setCroppingWord,
  } = useClipContext();
  const {
    index,
    word,
    renderedWord,
    isCurrentWord,
    isExtraText,
  } = wordData;
  const [inputValue, setInputValue] = React.useState<number | null>(null);
  const [rangeWidth, setRangeWidth] = React.useState(0);
  const rangeInputRef = React.useRef<HTMLInputElement>(null);
  const cropLineRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (inputValue) {
      goto(inputValue);
    }
  }, [inputValue])

  React.useEffect(() => {
    // Set the width of the range input to match the cropLine element's width
    if (cropLineRef.current) {
      setRangeWidth(cropLineRef.current.getBoundingClientRect().width);
    }
  }, [cropLineRef])

  const currentCrop = getCurrentCrop(state.manualCrop, word.start);
  const initialValue = currentCrop?.start;

  function handleChangeManualCropStartTime(word: DGWord, newCropStart: number) {
    const manualCropData = [...state.manualCrop] as Array<ManualCrop>;
    const currentCropIndex = manualCropData.findIndex((crop) =>
      crop.start >= word.start && crop.start < word.end
    );
    if (currentCropIndex > -1) {
      manualCropData[currentCropIndex].start = newCropStart;
    }
    updateManualCrop(manualCropData);
  }

  function handleEditCrop(cropWord: DGWord, start: number) {
    goto(start);
    setCroppingWord(cropWord);
  }

  const handleRangeCommit = () => {
    handleChangeManualCropStartTime(word, inputValue ?? initialValue);
  };
  const isCropKeyframe = manualCrop.some(
    (crop) => crop.start >= word.start && crop.start < word.end,
  );

  return (
    <span
      key={index}
      className={classnames([
        "clipWord",
        { clipWordLight: isExtraText },
        { clipCurrentWord: isCurrentWord },
      ])}
      onClick={() =>
        goto(word.start)}
      onDoubleClick={() => {
        handleEditCrop(word, currentCrop?.start ?? word.start);
      }}
    >
      {renderedWord}
      <div className="lineHighlight cropLine" ref={cropLineRef}>
        {isCropKeyframe && (
          <>
            <div className="isCroppedIcon">
              <Icon
                color="white"
                name="crop"
                size={12}
              />
            </div>
            <input
              ref={rangeInputRef}
              type="range"
              min={word.start}
              max={word.end}
              step={0.01}
              value={inputValue ?? initialValue}
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
