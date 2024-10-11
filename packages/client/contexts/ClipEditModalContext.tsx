import * as React from "react";
import type { Word } from "packages/types/transcript.ts";
const { createContext, useContext, useState } = React;

type DraftClip = {
  duration: number;
  endTime: number;
  id: string;
  words: Array<Word>;
  startTime: number;
  title: string;
};

type ClipEditModalContextProps = {
  draftClip: DraftClip;
  isMiniModalOpen: boolean;
  newWordsString: string;
  miniModalOnConfirm: () => void;
  miniModalOnCancel: () => void;
  selectedWord: Word;
  setSelectedWord: (word: Word) => void;
  setDraftClip: (clip: DraftClip) => void;
  setIsMiniModalOpen: (isOpen: boolean) => void;
  setNewWordsString: (text: string) => void;
  updateEndTime: () => void;
  updateStartTime: () => void;
};

const ClipEditModalContext = createContext<
  ClipEditModalContextProps | undefined
>(
  undefined,
);

type ProviderProps = {
  children: React.ReactNode;
  initialDraftClip: DraftClip;
};

export default function ClipEditModalProvider(
  { children, initialDraftClip }: ProviderProps,
) {
  const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
  const [draftClip, setDraftClip] = useState<DraftClip>(initialDraftClip);
  const [selectedWord, setSelectedWord] = useState<Word>();
  const [newWordsString, setNewWordsString] = useState<string>(
    selectedWord?.text ?? "",
  );

  const miniModalOnCancel = () => {
    setSelectedWord(undefined);
    setIsMiniModalOpen(false);
    setNewWordsString("");
  };

  const miniModalOnConfirm = () => {
    const splitWords = newWordsString.split(" ");
    if (!selectedWord) throw new Error("No selected word");
    const startOfNextWord = draftClip.words.find(
      (w: Word) => w.startTime > selectedWord.startTime,
    )?.startTime ?? draftClip.words[draftClip.words.length - 1].endTime;
    const timePerWord = (startOfNextWord - selectedWord.startTime) /
      splitWords.length;
    const newWords = splitWords.map((w, i) => ({
      text: w,
      startTime: selectedWord.startTime + i * timePerWord,
      endTime: selectedWord.startTime + (i + 1) * timePerWord,
      speaker: selectedWord.speaker,
    } as Word));
    const oldDraftWordsMinusEditedWord = draftClip.words?.map((word) => {
      if (word.startTime === selectedWord.startTime) {
        return;
      }
      return word;
    });
    const updatedWords = [...oldDraftWordsMinusEditedWord, ...newWords].sort(
      (a, b) => {
        return a.startTime - b.startTime;
      },
    ).filter(Boolean);
    setDraftClip({
      ...draftClip,
      words: updatedWords,
    });
    miniModalOnCancel();
  };

  const updateStartTime = () => {
    if (!selectedWord) throw new Error("No selected word");
    setDraftClip({
      ...draftClip,
      startTime: selectedWord.startTime,
    });
    setTimeout(() => {
      setSelectedWord(undefined);
    }, 1); // hack
  };

  const updateEndTime = () => {
    if (!selectedWord) throw new Error("No selected word");
    setDraftClip({
      ...draftClip,
      endTime: selectedWord.endTime,
    });
    setTimeout(() => {
      setSelectedWord(undefined);
    }, 1); // hack
  };

  const value = {
    draftClip,
    isMiniModalOpen,
    miniModalOnCancel,
    miniModalOnConfirm,
    newWordsString,
    selectedWord,
    setIsMiniModalOpen,
    setNewWordsString,
    setSelectedWord,
    updateEndTime,
    updateStartTime,
  };

  return (
    <ClipEditModalContext.Provider value={value}>
      {children}
    </ClipEditModalContext.Provider>
  );
}

export const useClipEditModal = () => {
  const context = useContext(ClipEditModalContext);
  if (context === undefined) {
    throw new Error(
      "useClipEditModal must be used within a ClipEditModalProvider",
    );
  }
  return context;
};
