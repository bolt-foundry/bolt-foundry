import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import { SearchResults_bfSavedSearch$key } from "packages/__generated__/SearchResults_bfSavedSearch.graphql.ts";

const fragment = await graphql`
  fragment SearchResults_bfSavedSearch on BfSavedSearch {
    query
    searchResults(first: 10) {
      count
      edges {
       node {
       id
          body 
        } 
      }
    }
  }
`;

type Props = {
  bfSavedSearch$key?: SearchResults_bfSavedSearch$key;
};

export function SearchResults({ bfSavedSearch$key }: Props) {
  const data = useFragment(fragment, bfSavedSearch$key);
  if (!data) {
    return "null state goes here.";
  }
  const list = data?.searchResults?.edges?.map((edge) => {
    return edge?.node;
  });
  const elements = list?.map(({ body, id }) => <div key={id}>{body}</div>);
  return (
    <div>
      <div>query: {data.query}</div>
      <div>Found {data?.searchResults?.count ?? "no"} results</div>
      {elements}
    </div>
  );
}
