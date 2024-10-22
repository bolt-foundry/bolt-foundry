import { graphql } from "packages/client/deps.ts";
import { useMemo } from "react";
import { useFragment, useSubscription } from "react-relay";
import { SearchResult } from "packages/client/components/clipsearch/SearchResult.tsx";
import type { SearchResults_bfSavedSearch$key } from "packages/__generated__/SearchResults_bfSavedSearch.graphql.ts";

const fragment = await graphql`
  fragment SearchResults_bfSavedSearch on BfSavedSearch {
    query
    id
    searchResults(first: 10) {
      count
      edges {
       node {
          id
          body
          ...SearchResult_bfSavedSearchResult
        } 
      }
    }
  }
`;

const subscription = await graphql`
  subscription SearchResultsSubscription($id: ID!) {
    node(id: $id) {
      ...SearchResults_bfSavedSearch
    }
  }
`;

type Props = {
  bfSavedSearch$key?: SearchResults_bfSavedSearch$key;
};

export function SearchResults({ bfSavedSearch$key }: Props) {
  const data = useFragment(fragment, bfSavedSearch$key);
  const searchId = data?.id;
  const subscriptionConfig = useMemo(() => {
    return {
      variables: {
        id: searchId,
      },
      subscription,
    };
  }, [searchId]);
  useSubscription(subscriptionConfig);
  if (!data) {
    return "null state goes here.";
  }

  const list = data?.searchResults?.edges?.map((edge) => {
    return edge?.node;
  });
  const elements = list?.map((node) => {
    if (node) {
      return (
        <SearchResult
          key={node.id}
          bfSavedSearchResult$key={node}
        />
      );
    }
  }).filter(Boolean);
  return (
    <div>
      <div>query: {data.query}</div>
      <div>Found {data?.searchResults?.count ?? "no"} results</div>
      {elements}
    </div>
  );
}
