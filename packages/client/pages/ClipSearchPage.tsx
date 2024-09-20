import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
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
        savedSearches(first: 10) {
          ...Search_bfSavedSearchConnection
          ...ClipSearchSidebar_savedSearchConnection
        }
        ...ClipsView_bfPerson
        ...Clip_bfPerson
      }
      organization {
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
  subscription ClipSearchPageSavedSearchesSubscription($id: ID!){
    node(id: $id) {
    ... on BfPerson {
      savedSearches(first: 10) {
          ...Search_bfSavedSearchConnection
          ...ClipSearchSidebar_savedSearchConnection
        }
      }
    }
  }
`

export function ClipSearchPage() {
  const { navigate } = useRouter();
  const data = useLazyLoadQuery<ClipSearchPageQuery>(query, {});
  // const subscriptionConfig = React.useMemo(
  //   () => ({
  //     variables: { id: data.currentViewer.person.id },
  //     subscription: subscription,
  //   }),
  //   [projectId],
  // );
  // useSubscription(subscriptionConfig)
  const count = data?.currentViewer?.organization?.media?.count;
  const savedSearchConnection = data?.currentViewer?.person?.savedSearches;
  return (
    <div className="cs-page flexRow">
      <Sidebar
        contents={savedSearchConnection && <ClipSearchSidebar bfSavedSearchConnection$key={savedSearchConnection} />}
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
        {savedSearchConnection && <Search bfSavedSearchConnection$key={savedSearchConnection} />}
        <Suspense fallback={<BfDsFullPageSpinner />}>
          {/* {clips || isInFlight
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
            )} */}
        </Suspense>
      </div>
    </div>
  );
}
