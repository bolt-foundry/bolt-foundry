import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import type { ClipSearchSearchResultList_currentViewer$key } from "packages/__generated__/ClipSearchSearchResultList_currentViewer.graphql.ts";

const fragment = await graphql`
  fragment ClipSearchSearchResultList_currentViewer on BfCurrentViewer {
    searchResults (first: 10) {
      count
      nodes {
        __typename
      }
    }
  }
`


type Props = {
  currentViewer$key: ClipSearchSearchResultList_currentViewer$key,
}
export function SearchResultList({currentViewer$key}: Props) {
  const data = useFragment(fragment, currentViewer$key)
  const results = data?.searchResults?.nodes ?? [];
  const resultElements = results.map((result) => <SearchResultListItem key="foo"/>);
  return (
    <FeatureFlag name="search">
      <List header="Search Results">{resultElements}</List>
    </FeatureFlag>
  );
}

function SearchResultListItem() {
  return <ListItem content="Something" />;
}