import { useRef } from "react";
import { useClipEditModal } from "packages/client/contexts/ClipEditModalContext.tsx";
import { WordMenuItem } from "packages/client/components/clipsearch/WordMenuItem.tsx";

export function WordMenu() {
  const {
    draftClip,
    selectedWord,
    setIsMiniModalOpen,
    updateStartTime,
    updateEndTime,
  } = useClipEditModal();
  const showStart = selectedWord.startTime < draftClip.endTime;
  const showEnd = selectedWord.endTime > draftClip.startTime;

  return (
    <div className="word-menu">
      {showStart && (
        <WordMenuItem
          onClick={updateStartTime}
          label={"Start here"}
        />
      )}
      {showEnd && (
        <WordMenuItem
          onClick={updateEndTime}
          label={"End here"}
        />
      )}
      <WordMenuItem
        onClick={() => setIsMiniModalOpen(true)}
        label={"Edit word"}
      />
    </div>
  );
}
