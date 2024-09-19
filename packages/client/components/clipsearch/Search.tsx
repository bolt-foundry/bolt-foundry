import * as React from "react";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { AiModel } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { graphql } from "packages/client/deps.ts";
import { useFragment, useMutation } from "react-relay";
import type { SearchForClipsFragment_bfSearchResultConnection$key } from "packages/__generated__/SearchForClipsFragment_bfSearchResultConnection.graphql.ts";
import { getLogger } from "deps.ts";
import type { SearchForClipsMutation } from "packages/__generated__/SearchForClipsMutation.graphql.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

const logger = getLogger(import.meta);
const mutation = await graphql`
  mutation SearchForClipsMutation($query: String!, $connections: [ID!]!) {
    createSearchResult(query: $query) @appendNode(connections: $connections, edgeTypeName: "BfSearchResult") {
      query
      id
    }
  }
`;

const fragment = await graphql`
  fragment SearchForClipsFragment_bfSearchResultConnection on BfSearchResultConnection {
      __id
  }
`;

type Props = {
  bfSearchResultConnection$key:
    SearchForClipsFragment_bfSearchResultConnection$key;
};

export function Search(
  { bfSearchResultConnection$key }: Props,
) {
  const { navigate } = useRouter();
  const [aiModel, setAiModel] = React.useState(AiModel.OPENAI_4O);
  const [searchText, setSearchText] = React.useState("");
  const [commit, isInFlight] = useMutation<SearchForClipsMutation>(mutation);
  const data = useFragment(
    fragment,
    bfSearchResultConnection$key,
  );

  function commitSearch() {
    logger.debug("data", data);
    commit({
      variables: {
        query: searchText,
        connections: [data?.__id],
      },
      optimisticResponse: {
        createSearchResult: {
          query: `searchText: ${searchText}`,
          id: "",
        },
      },
      onCompleted: (response) => {
        response.createSearchResult &&
          navigate(`/search/${response.createSearchResult.id}`);
      },
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
