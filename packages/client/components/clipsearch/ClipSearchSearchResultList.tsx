import { List } from "packages/bfDs/List.tsx";
import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import type { ClipSearchSearchResultList_bfSearchResultConnection$key } from "packages/__generated__/ClipSearchSearchResultList_bfSearchResultConnection.graphql.ts";
import { ClipSearchResultListItem } from "packages/client/components/clipsearch/ClipSearchResultListItem.tsx";

const fragment = await graphql`
  fragment ClipSearchSearchResultList_bfSearchResultConnection on BfSearchResultConnection {
      count
      edges {
        node {
          __typename
          id
          ...ClipSearchResultListItem_bfSearchResult
        }
      }
  }
`;

type Props = {
  bfSearchResultConnection$key: ClipSearchSearchResultList_bfSearchResultConnection$key;
};
export function SearchResultList({ bfSearchResultConnection$key, }: Props) {
  const data = useFragment(fragment, bfSearchResultConnection$key);
  const results = data?.edges ?? [];
  const resultElements = results.map((resultEdge) =>
    resultEdge && resultEdge.node && (
      <ClipSearchResultListItem
        bfSearchResult$key={resultEdge.node}
        key={resultEdge.node.id}
      />
    )
  );
  return <List header="Search Results">{resultElements}</List>;
}
