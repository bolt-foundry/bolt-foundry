import * as React from "react";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { Search } from "packages/client/components/clipsearch/Search.tsx";
import { ClipsView } from "packages/client/components/clipsearch/ClipsView.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { ClipsViewNullState } from "packages/client/components/clipsearch/ClipsViewNullState.tsx";
import ClipSearchProvider, {
  useClipSearchState,
} from "packages/client/contexts/ClipSearchContext.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { ClipSearchPageQuery } from "packages/__generated__/ClipSearchPageQuery.graphql.ts";
import { ClipSearchSidebar } from "packages/client/components/clipsearch/ClipSearchSidebar.tsx";
const { Suspense } = React;

const query = await graphql`
  query ClipSearchPageQuery {
    currentViewer {
      person {
        id
        ...ClipsView_bfPerson
        ...Clip_bfPerson
      }
      organization {
        savedSearches(first: 100) {
          __id
          ...Search_bfSavedSearchConnection
          ...ClipSearchSidebar_savedSearchConnection
        }
        ...WatchFolderList_bfOrganization
        id
        media (first: 1) {
          count
        }
      }
      
    }
  }
`;

const subscription = await graphql`
  subscription ClipSearchPageSavedSearchesSubscription($organizationId: ID!, $connections: [ID!]!){
    connection(id: $organizationId, targetClassName: "BfSavedSearch")  {
      append {
        node @appendNode(connections: $connections, edgeTypeName: "BfSavedSearch") {
          id
          ... on BfSavedSearch {
            query
            id
            __typename
          }
        }
      }
    }
  }
`;

export function ClipSearchPage() {
  const { navigate } = useRouter();
  const data = useLazyLoadQuery<ClipSearchPageQuery>(query, {});
  const orgId = data.currentViewer?.organization?.id;
  const connection = data.currentViewer?.organization?.savedSearches?.__id;
  const subscriptionConfig = React.useMemo(
    () => ({
      variables: { organizationId: orgId, connections: [connection] },
      subscription: subscription,
    }),
    [orgId],
  );
  useSubscription(subscriptionConfig);
  const count = data?.currentViewer?.organization?.media?.count;
  const savedSearchConnection = data?.currentViewer?.organization
    ?.savedSearches;
  return (
    <div className="cs-page flexRow">
      <Sidebar
        contents={savedSearchConnection && (
          <ClipSearchSidebar
            bfSavedSearchConnection$key={savedSearchConnection}
          />
        )}
        footer={
          <List>
            <ListItem
              content="Settings"
              onClick={() => navigate("/settings")}
            />
          </List>
        }
        header="Clip search"
      />
      <div className="cs-main">
        {savedSearchConnection && (
          <Search bfSavedSearchConnection$key={savedSearchConnection} />
        )}
        <Suspense fallback={<BfDsFullPageSpinner />}>
          {
            /* {clips || isInFlight
            ? (
              <ClipsView
                count={count}
                clips$key={data?.currentViewer?.person}
              />
            )
            : (
              <ClipsViewNullState
                count={count}
                settings$key={data?.currentViewer?.organization}
              />
            )} */
          }
        </Suspense>
      </div>
    </div>
  );
}
