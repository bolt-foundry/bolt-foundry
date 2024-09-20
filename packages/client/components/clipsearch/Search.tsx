import * as React from "react";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { useFragment, useMutation } from "react-relay";
import type { SearchMutation } from "packages/__generated__/SearchMutation.graphql.ts";
import { Search_bfSavedSearchConnection$key } from "packages/__generated__/Search_bfSavedSearchConnection.graphql.ts";

const mutation = await graphql`
  mutation SearchMutation(
    $query: String!,
    $connections: [ID!]!
  ) {
    createSavedSearch(
      query: $query,
    ) @appendEdge(connections: $connections) {
      node {
        id
        query
        status
      }
    }
  }
`;

const fragment = await graphql`
  fragment Search_bfSavedSearchConnection on BfSavedSearchConnection {
    __id
  }
`;

type Props = {
  bfSavedSearchConnection$key: Search_bfSavedSearchConnection$key
};

export function Search({ bfSavedSearchConnection$key }: Props) {
  const [commitSearch, isInFlight] = useMutation<SearchMutation>(mutation);
  const connection = useFragment(fragment, bfSavedSearchConnection$key, );
  const [query, setQuery] = React.useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    commitSearch({
      variables: {
        query,
        connections: [connection.__id],
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="cs-search">
      <div style={{ flex: 1 }}>
        <BfDsInput
          placeholder="Search"
          showSpinner={isInFlight}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <BfDsButton type="submit" text="Search" />
    </form>
  );
}
