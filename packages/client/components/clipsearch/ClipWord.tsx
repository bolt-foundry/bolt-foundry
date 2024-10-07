import { React } from "deps.ts";
import { useEffect, useRef, useState } from "react";
import { classnames } from "lib/classnames.ts";
import useClickOutside from "packages/client/hooks/useClickOutside.ts";
import { WordMenu } from "packages/client/components/clipsearch/WordMenu.tsx";
import { EditWordMenu } from "packages/client/components/clipsearch/EditWordMenu.tsx";

export enum ClipWordKindType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SELECTED = "selected",
  CURRENT = "current",
}
type Props = {
  word: {
    text: string;
    startTime: number;
    endTime: number;
    speaker: string;
  };
  clipStartTime: number;
  clipEndTime: number;
  updateStartAndEndTime: (startTime?: number, endTime?: number) => void;
  updateWord: (word: {
    text: string;
    startTime: number;
    endTime: number;
    speaker: string;
  }) => void;
};

export function ClipWord(
  { clipStartTime, clipEndTime, word, updateStartAndEndTime, updateWord }:
    Props,
) {
  const [isEdittingWord, setIsEdittingWord] = useState(false);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  let kind = "primary";
  if (
    word.startTime < clipStartTime ||
    word.endTime > clipEndTime
  ) {
    kind = "secondary";
  }
  const [isSelected, setIsSelected] = useState(
    kind === ClipWordKindType.SELECTED,
  );

  const close = () => {
    setIsEdittingWord(false);
    setIsSelected(false);
  };

  useClickOutside(wordRef, () => close(), {
    isActive: true,
    showConfirmation: false,
    excludeElementIds: ["tooltip-root"],
  });

  return (
    <>
      <span
        ref={wordRef}
        key={`${word.text}${word.startTime}`}
        className={classnames([
          "clipWord",
          { clipWordLight: kind === ClipWordKindType.SECONDARY },
          { clipHighlight: kind === ClipWordKindType.SELECTED },
          { clipCurrentWord: kind === ClipWordKindType.CURRENT },
        ])}
        onClick={() => setIsSelected(true)}
        onDoubleClick={() => (setIsEdittingWord(true))}
      >
        {`${word.text} `}
        {isEdittingWord && (
          <EditWordMenu
            word={word}
            updateWord={updateWord}
            handleClose={() => close()}
          />
        )}
        {isSelected && (
          <WordMenu
            wordStartTime={word.startTime}
            wordEndTime={word.endTime}
            clipStartTime={clipStartTime}
            clipEndTime={clipEndTime}
            updateStartAndEndTime={updateStartAndEndTime}
          />
        )}
      </span>
    </>
  );
}
