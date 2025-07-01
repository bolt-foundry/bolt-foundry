import type * as React from "react";
import { createContext, useCallback, useContext, useState } from "react";

interface GraderContextType {
  graderContent: string;
  setGraderContent: (content: string) => void;
  updateGraderContent: (content: string) => void;
  appendToGrader: (text: string) => void;
}

const GraderContext = createContext<GraderContextType>({
  graderContent: "",
  setGraderContent: () => {},
  updateGraderContent: () => {},
  appendToGrader: () => {},
});

export const useGrader = () => useContext(GraderContext);

export function GraderProvider({ children }: { children: React.ReactNode }) {
  const [graderContent, setGraderContent] = useState("");

  const updateGraderContent = useCallback((content: string) => {
    setGraderContent(content);
  }, []);

  const appendToGrader = useCallback((text: string) => {
    setGraderContent((prev) => prev ? `${prev}\n\n${text}` : text);
  }, []);

  return (
    <GraderContext.Provider
      value={{
        graderContent,
        setGraderContent,
        updateGraderContent,
        appendToGrader,
      }}
    >
      {children}
    </GraderContext.Provider>
  );
}
