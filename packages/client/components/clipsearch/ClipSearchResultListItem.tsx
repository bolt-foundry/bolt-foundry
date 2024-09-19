import { ListItem } from "packages/bfDs/ListItem.tsx";
import { graphql } from "packages/client/deps.ts";
import { useFragment, useSubscription } from "react-relay";
import type { ClipSearchResultListItem_bfSearchResult$key } from "packages/__generated__/ClipSearchResultListItem_bfSearchResult.graphql.ts"
import { useMemo } from "react";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

const fragment = await graphql`
  fragment ClipSearchResultListItem_bfSearchResult on BfSearchResult {
    query
    id
  }
`;

const subscription = await graphql`
  subscription ClipSearchResultListItemSubscription($id: ID!) {
  node(id: $id) {
    ...ClipSearchResultListItem_bfSearchResult
    ... on BfSearchResult {
      query
    }
  }
}
`;

type Props = {
  bfSearchResult$key: ClipSearchResultListItem_bfSearchResult$key,
}
export function ClipSearchResultListItem({bfSearchResult$key,}: Props) {
  const { navigate } = useRouter();
  const data = useFragment(fragment, bfSearchResult$key);
  const id = data?.id;
  const config = useMemo(() => ({
    variables: {id},
    subscription,
  }), [id, subscription]);
  useSubscription(config);
  return <ListItem content={data.query} onClick={() => {navigate(`/search/${id}`)}} />;
}