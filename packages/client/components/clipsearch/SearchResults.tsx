import { graphql } from "packages/client/deps.ts";
import { useMemo } from "react";
import { useFragment, useSubscription } from "react-relay";
import { SearchResult } from "packages/client/components/clipsearch/SearchResult.tsx"
import { SearchResults_bfSavedSearch$key } from "packages/__generated__/SearchResults_bfSavedSearch.graphql.ts";

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
          title
          description
          rationale
          confidence
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
    }
  }, [searchId]);
  useSubscription(subscriptionConfig)
  if (!data) {
    return "null state goes here.";
  }
  
  const list = data?.searchResults?.edges?.map((edge) => {
    return edge?.node;
  });
  const elements = list?.map((
    { body, title, description, rationale, topics, confidence, id },
  ) => {
  if(body !== "No excerpt found."){
   return (
    <SearchResult
      title={title}
      body={body}
      description={description}
      rationale={rationale}
      topics={topics}
      confidence={confidence}
    />
     )
  }
  });
  return (
    <div>
      <div>query: {data.query}</div>
      <div>Found {data?.searchResults?.count ?? "no"} results</div>
      {elements}
    </div>
  );
}
