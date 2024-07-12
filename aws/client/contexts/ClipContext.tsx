import { React } from "aws/client/deps.ts";
import { DGWord } from "/aws/types/transcript.ts";
const { createContext, useContext, useState } = React;
import { type TrimmingType } from "aws/client/components/Trim.tsx";

interface ClipContextValue {
  croppingWord: DGWord | null;
  setCroppingWord: (word: DGWord | null) => void
  editingWord: DGWord | null;
  setEditingWord: (word: DGWord | null) => void
  selectedWordIndex: number | null;
  setSelectedWordIndex: (index: number | null) => void;
  trimmingWord: Partial<TrimmingType> | null;
  stickerStartWord: DGWord | null,
  setStickerStartWord: (word: DGWord | null) => void,
  stickerEndWord: DGWord | null,
  setStickerEndWord: (word: DGWord | null) => void,
  setTrimmingWord: (word: Partial<TrimmingType> | null) => void;
}

const ClipContext = createContext<ClipContextValue>({
  croppingWord: null,
  setCroppingWord: () => {},
  editingWord: null,
  setEditingWord: () => {},
  selectedWordIndex: null,
  setSelectedWordIndex: () => {},
  trimmingWord: null,
  stickerStartWord: null,
  setStickerStartWord: () => {},
  stickerEndWord: null,
  setStickerEndWord: () => {},
  setTrimmingWord: () => {},
});

type ClipProviderProps = React.PropsWithChildren;

export const ClipProvider = ({ children }: ClipProviderProps) => {
  const [croppingWord, setCroppingWord] = React.useState<DGWord | null>(null);
  const [editingWord, setEditingWord] = useState<DGWord | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [trimmingWord, setTrimmingWord] = useState<Partial<TrimmingType> | null>(null);
  const [stickerStartWord, setStickerStartWord] = React.useState<
    DGWord | null
  >(null);
  const [stickerEndWord, setStickerEndWord] = React.useState<DGWord | null>(null);
  
  const value = {
    croppingWord,
    setCroppingWord,
    editingWord,
    setEditingWord,
    selectedWordIndex,
    setSelectedWordIndex,
    trimmingWord,
    stickerStartWord,
    setStickerStartWord,
    stickerEndWord,
    setStickerEndWord,
    setTrimmingWord,
  }

  return (
    <ClipContext.Provider value={value}>
      {children}
    </ClipContext.Provider>
  );
};

export const useClipContext = () => {
  const context = useContext(ClipContext);
  if (!context) {
    throw new Error("useClipContext must be used within a ClipProvider");
  }
  return context;
};
