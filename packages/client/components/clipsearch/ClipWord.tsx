import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { classnames } from "lib/classnames.ts";
import useClickOutside from "packages/client/hooks/useClickOutside.ts";
import { useClipEditModal } from "packages/client/contexts/ClipEditModalContext.tsx";
import { WordMenu } from "packages/client/components/clipsearch/WordMenu.tsx";
import type { Word } from "packages/types/transcript.ts";

export enum ClipWordKindType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SELECTED = "selected",
  CURRENT = "current",
}
type Props = {
  word: Word;
};

export function ClipWord({ word }: Props) {
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const { draftClip, isMiniModalOpen, selectedWord, setSelectedWord } =
    useClipEditModal();
  const isSelected = selectedWord?.startTime === word.startTime;
  const [tooltipSize, setTooltipSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  let kind = "primary";
  if (
    word.startTime < draftClip.startTime ||
    word.endTime > draftClip.endTime
  ) {
    kind = "secondary";
  } else if (isSelected) {
    kind = "selected";
  }

  const close = () => {
    setSelectedWord();
  };

  useClickOutside(wordRef, () => close(), {
    isActive: true,
    showConfirmation: false,
    excludeElementIds: ["tooltip-root", "mini-modal"],
  });

  useEffect(() => {
    // get the size of the tooltip-container and set the size of the tooltip-base
    if (isSelected) {
      const tooltipContainer = wordRef.current;
      if (!tooltipContainer) return;
      const { width, height, x, y } = tooltipContainer.getBoundingClientRect();
      setTooltipSize({ width, height, x, y });
    }
  }, [isSelected]);

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
        onClick={() => {
          setSelectedWord(word);
        }}
      >
        {`${word.text} `}
        {isSelected && !isMiniModalOpen && createPortal(
          <div
            style={{
              position: "absolute",
              width: tooltipSize.width,
              height: tooltipSize.height,
              left: tooltipSize.x,
              top: tooltipSize.y,
            }}
          >
            <WordMenu />
          </div>,
          document.getElementById("tooltip-root"),
        )}
      </span>
    </>
  );
}
