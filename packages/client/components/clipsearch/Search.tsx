import * as React from "react";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { isValidJSON } from "packages/lib/jsonUtils.ts";
const { useState } = React;

export enum AiModel {
  OPENAI_4O = "gpt-4o-mini",
  OPENAI_35 = "gpt-3.5-turbo",
  CLAUDE_OPUS = "claude-3-opus-20240229",
  CLAUDE_SONNET = "claude-3-5-sonnet-20240620",
}

const mutation = await graphql`
  mutation SearchMutation(
    $input: String!,
    $suggestedModel: String,
  ) {
    searchMutation(
      input: $input,
      suggestedModel: $suggestedModel,
    ) {
      success
      message
    }
  }
`;


type Props = {
  setClips: (clips: string | null) => void;
};

export function Search({ setClips }: Props) {
  const [commit, isInFlight] = useMutation(mutation);
  const [prompt, setPrompt] = useState("");
  const [clipsFound, setClipsFound] = useState<number | null>(null);
  const [aiModel, setAiModel] = useState(AiModel.OPENAI_4O);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClips(null);
    setClipsFound(null);
    commit({
      variables: {
        input: prompt,
        suggestedModel: aiModel,
      },
      onCompleted: (response) => {
        setClips(response.searchMutation.message);
        const parsedClips = isValidJSON(response.searchMutation.message)
          ? JSON.parse(response.searchMutation.message)
          : { anecdotes: [] };
        const numberOfClips = parsedClips?.anecdotes?.length ?? 0;
        setClipsFound(numberOfClips);
      },
    });
    setPrompt("");
  }

  return (
    <div className="cs-search">
      <form onSubmit={onSubmit}>
        <Input
          placeholder="Search"
          showSpinner={isInFlight}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
      </form>
      <div className="cs-searchMeta">
        <DropdownSelector
          placeholder="Select AI Model"
          value={aiModel}
          onChange={(value) => setAiModel(value)}
          options={{
            "GPT 3.5 turbo": AiModel.OPENAI_35,
            "GPT 4o mini": AiModel.OPENAI_4O,
            "Claude 3 opus": AiModel.CLAUDE_OPUS,
            "Claude 3.5 sonnet": AiModel.CLAUDE_SONNET,
          }}
          justification="end"
        />
      </div>
    </div>
  );
}
