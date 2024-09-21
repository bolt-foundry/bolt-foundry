import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { graphql } from "packages/client/deps.ts";
import { ClipSearchSidebar_savedSearchConnection$key } from "packages/__generated__/ClipSearchSidebar_savedSearchConnection.graphql.ts";
import { useFragment } from "react-relay";

const fragment = await graphql`
  fragment ClipSearchSidebar_savedSearchConnection on BfSavedSearchConnection {
    count
    edges {
      node {
        id
        query
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
`;

type Props = {
  bfSavedSearchConnection$key: ClipSearchSidebar_savedSearchConnection$key;
};

export function ClipSearchSidebar({ bfSavedSearchConnection$key }: Props) {
  const data = useFragment(fragment, bfSavedSearchConnection$key);
  const searches = data?.edges?.map((edge) => edge.node).map((node) =>
    node && <ListItem content={node.query} key={node.id} />
  );
  return (
    <List header="Searches">
      {searches}
    </List>
  );
}
