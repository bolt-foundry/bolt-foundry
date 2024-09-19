import * as React from "react";
import { useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { isValidJSON } from "packages/lib/jsonUtils.ts";
const { createContext, useContext, useState } = React;

export enum AiModel {
  OPENAI_4O = "gpt-4o-mini",
  OPENAI_35 = "gpt-3.5-turbo",
  CLAUDE_OPUS = "claude-3-opus-20240229",
  CLAUDE_SONNET = "claude-3-5-sonnet-20240620",
}

type ClipSearchContextProps = {
  aiModel: AiModel;
  setAiModel: (value: AiModel) => void;
  clips: string | null;
  setClips: (clips: string | null) => void;
  clipsCount: number | null;
  setClipsCount: (clipsCount: number | null) => void;
  clearSearch: () => void;
  commitSearch: (input?: string) => void;
  isInFlight: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  previousPrompt: string;
};

const ClipSearchContext = createContext<ClipSearchContextProps | undefined>(
  undefined,
);



export default function ClipSearchProvider(
  { children }: React.PropsWithChildren,
) {
  // const [commit, isInFlight] = useMutation(mutation);
  // const [clips, setClips] = useState<string | null>();
  // const [clipsCount, setClipsCount] = useState<number | null>();
  // const [prompt, setPrompt] = useState("");
  // const [aiModel, setAiModel] = useState(AiModel.OPENAI_4O);
  // const previousPromptRef = React.useRef<string>("");

  // const commitSearch = (input: string = prompt) => {
  //   setPrompt(input);
  //   setClips(null);
  //   setClipsCount(null);
  //   commit({
  //     variables: {
  //       input,
  //       suggestedModel: aiModel,
  //     },
  //     onCompleted: (response) => {
  //       setClips(response.searchMutation.message);
  //       const parsedClips = isValidJSON(response.searchMutation.message)
  //         ? JSON.parse(response.searchMutation.message)
  //         : { anecdotes: [] };
  //       const numberOfClips = parsedClips?.anecdotes?.length ?? 0;
  //       setClipsCount(numberOfClips);
  //       previousPromptRef.current = input;
  //       setPrompt("");
  //     },
  //   });
  // };

  // const clearSearch = () => {
  //   setPrompt("");
  //   setClips(null);
  //   setClipsCount(null);
  // };

  const value = {
    // aiModel,
    // setAiModel,
    // clips,
    // setClips,
    // clipsCount,
    // setClipsCount,
    // clearSearch,
    // commitSearch,
    // isInFlight,
    // prompt,
    // setPrompt,
    // previousPrompt: previousPromptRef.current,
  };

  return (
    <ClipSearchContext.Provider value={value}>
      {children}
    </ClipSearchContext.Provider>
  );
}

export const useClipSearchState = (): ClipSearchContextProps => {
  const context = useContext(ClipSearchContext);
  if (context === undefined) {
    throw new Error("useClipSearch must be used within a ClipSearchProvider");
  }
  return context;
};
