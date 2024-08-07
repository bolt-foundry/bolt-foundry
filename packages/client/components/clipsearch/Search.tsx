import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { SearchQuery } from "packages/__generated__/SearchQuery.graphql.ts";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
const { useState } = React;
const { useLazyLoadQuery, useMutation } = ReactRelay;

const mutation = await graphql`
  mutation SearchMutation(
    $input: String!,
    $suggestedModel: String,
    $documents: String,
  ) {
    searchMutation(
      input: $input,
      suggestedModel: $suggestedModel,
      documents: $documents,
    ) {
      success
      message
    }
  }
`;

const query = await graphql`
  query SearchQuery {
    transcripts {
      id
      filename
      transcript
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
  const [aiModel, setAiModel] = useState("gpt-4o-mini");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClipsFound(null);
    console.log("Searching for", prompt);
    console.log("Transcripts: ", data.transcripts.length);
    commit({
      variables: {
        input: prompt,
        // suggestedModel: "claude-3-opus-20240229",
        // suggestedModel: "gpt-4o-mini",
        suggestedModel: aiModel,
        documents: JSON.stringify(data.transcripts),
      },
      onCompleted: (response) => {
        // console.log(response.searchMutation.message);
        setClips(response.searchMutation.message);
        const parsedClips = JSON.parse(response.searchMutation.message);
        setClipsFound(parsedClips.length);
      },
    });
    setPrompt("");
  }

  let metaText = `${data.transcripts.length} videos loaded`;
  if (isInFlight) {
    metaText = `Searching ${data.transcripts.length} videos...`;
  }
  if (clipsFound !== null) {
    metaText = `${clipsFound} clips found in ${data.transcripts.length} videos`;
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
            "GPT 3.5 turbo": "gpt-3.5-turbo",
            "GPT 4o mini": "gpt-4o-mini",
            "Claude 3 opus": "claude-3-opus-20240229",
            "Claude 3.5 sonnet": "claude-3-5-sonnet-20240620",
          }}
          justification="end"
        />
      </div>
    </div>
  );
}
