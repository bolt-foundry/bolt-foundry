import * as React from "react";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { useClipSearchState } from "packages/client/contexts/ClipSearchContext.tsx";
import { AiModel } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { graphql } from "packages/client/deps.ts";
import { useMutation } from "react-relay";

const mutation = await graphql`
  mutation SearchForClipsMutation($query: String!) {
    createSearch(query: $query) {
      __typename
    }
  }
`;

export function Search() {
  const { aiModel, setAiModel } =
    useClipSearchState();
  const [searchText, setSearchText] = React.useState(AiModel.OPENAI_4O);
  const [commit, isInFlight] = useMutation(mutation);

  function commitSearch() {
    commit({
      variables: {
        searchText
      }
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    commitSearch();
  }

  return (
    <form onSubmit={onSubmit} className="cs-search">
      <div style={{ flex: 1 }}>
        <BfDsInput
          placeholder="Search"
          showSpinner={isInFlight}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value as AiModel);
          }}
        />
      </div>
      <FeatureFlag name="placeholder">
        <DropdownSelector
          placeholder="Select AI Model"
          value={aiModel}
          onChange={(value) => setAiModel(value as AiModel)}
          options={{
            "GPT 3.5 turbo": AiModel.OPENAI_35,
            "GPT 4o mini": AiModel.OPENAI_4O,
            "Claude 3 opus": AiModel.CLAUDE_OPUS,
            "Claude 3.5 sonnet": AiModel.CLAUDE_SONNET,
          }}
          justification="end"
        />
      </FeatureFlag>
      <BfDsButton type="submit" text="Search" />
    </form>
  );
}
