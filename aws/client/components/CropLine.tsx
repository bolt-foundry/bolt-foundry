import { React } from "aws/client/deps.ts";
import Icon from "/aws/client/ui_components/Icon.tsx";
import { DGWord } from "/aws/types/transcript.ts";
import { VideoPlayerHandles } from "/aws/client/components/VideoPlayer.tsx";
import { ManualCrop } from "/aws/client/components/ManualCropMenu.tsx";

type Props = {
  handleChangeManualCropStartTime: (word: DGWord, newStartTime: number) => void;
  manualCrop: Array<ManualCrop>;
  videoPlayerRef: React.RefObject<VideoPlayerHandles>;
  word: DGWord;
};

export function CropLine(
  {
    handleChangeManualCropStartTime,
    manualCrop,
    videoPlayerRef,
    word,
  }: Props,
) {
  const [newStartTime, setNewStartTime] = React.useState(word.start);
  const [inputValue, setInputValue] = React.useState(word.start);
  const [rangeWidth, setRangeWidth] = React.useState(0);
  const rangeInputRef = React.useRef<HTMLInputElement>(null);
  const cropLineRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentCropIndex = manualCrop.findIndex((crop) =>
      crop.start >= word.start && crop.start < word.end
    );
    const currentCrop = currentCropIndex !== -1
      ? manualCrop[currentCropIndex]
      : undefined;
    // Set initial value based on saved start time
    const start = currentCrop?.start ?? word.start;
    setNewStartTime(start);
    setInputValue(start);
    // Set the width of the range input to match the cropLine element's width
    if (cropLineRef.current) {
      setRangeWidth(cropLineRef.current.getBoundingClientRect().width);
    }
  }, [word]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setNewStartTime(newValue);
    videoPlayerRef.current?.gotoTime(newValue);
  };
  const handleRangeCommit = () => {
    handleChangeManualCropStartTime(word, newStartTime);
  };
  const isCropKeyframe = manualCrop.some(
    (crop) => crop.start >= word.start && crop.start < word.end,
  );

  return (
    <div className="cropLine" ref={cropLineRef}>
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
            value={inputValue}
            onChange={(e) => {
              handleRangeChange(e);
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
  );
}
