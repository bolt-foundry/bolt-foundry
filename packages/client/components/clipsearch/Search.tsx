import * as React from "react";
import * as ReactRelay from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { SearchQuery } from "packages/__generated__/SearchQuery.graphql.ts";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
const { useState } = React;
const { useLazyLoadQuery, useMutation } = ReactRelay;

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

const query = await graphql`
  query SearchQuery {
    currentViewer {
      organization {
        media(first: 10) {
          edges {
            node {
              transcripts(first: 1) {
                count
              }
            }
          }
        }
      }
    }
  }
`;

type Props = {
  setClips: (clips: string) => void;
};

export function Search({ setClips }: Props) {
  const [commit, isInFlight] = useMutation(mutation);
  const data = useLazyLoadQuery<SearchQuery>(query, {});
  const [prompt, setPrompt] = useState("");
  const [clipsFound, setClipsFound] = useState<number | null>(null);
  const [aiModel, setAiModel] = useState(AiModel.OPENAI_4O);

  const transcriptsCount =
    data?.currentViewer?.organization?.transcripts?.count ?? 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClipsFound(null);
    commit({
      variables: {
        input: prompt,
        suggestedModel: aiModel,
      },
      onCompleted: (response) => {
        setClips(response.searchMutation.message);
        const parsedClips = JSON.parse(response.searchMutation.message);
        setClipsFound(parsedClips.length);
      },
    });
    setPrompt("");
  }

  let metaText = `${transcriptsCount} videos loaded`;
  if (isInFlight) {
    metaText = `Searching ${transcriptsCount} videos...`;
  }
  if (clipsFound !== null) {
    metaText = `${clipsFound} clips found in ${transcriptsCount} videos`;
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
        <div style={{ flex: 1 }}>{metaText}</div>
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
