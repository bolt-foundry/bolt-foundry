import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { Search } from "packages/client/components/clipsearch/Search.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { ClipsViewNullState } from "packages/client/components/clipsearch/ClipsViewNullState.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import type { ClipSearchPageQuery } from "packages/__generated__/ClipSearchPageQuery.graphql.ts";
import { SearchResultList } from "packages/client/components/clipsearch/ClipSearchSearchResultList.tsx";
import { ClipsView } from "packages/client/components/clipsearch/ClipsView.tsx";
const { Suspense } = React;

const query = await graphql`
  query ClipSearchPageQuery($searchId: ID!, $includeSearchResults: Boolean!) {
    currentViewer {
      person {
        id
      }
      organization {
        ...WatchFolderList_bfOrganization
        id
        media (first: 1) {
          count
        }
      }
      searchResults(first:10) {
        ...ClipSearchSearchResultList_bfSearchResultConnection
        ...SearchForClipsFragment_bfSearchResultConnection
      }
    }
    node(id: $searchId) @include(if: $includeSearchResults) {
      ... on BfSearchResult {
        ...ClipsView_bfSearchResult
        id
        __typename
      }
    }
  }
`;

export function ClipSearchPageContent() {
  const { navigate, routeParams } = useRouter();
  const { searchId } = routeParams;
  const includeSearchResult = searchId !== null;
  const data = useLazyLoadQuery<ClipSearchPageQuery>(query, {
    searchId: searchId ?? "",
    includeSearchResults: includeSearchResult,
  });
  const count = data?.currentViewer?.organization?.media?.count ?? 0;
  const searchResult = data.node;

  return (
    <div className="cs-page flexRow">
      <Sidebar
        contents={data.currentViewer?.searchResults && (
          <SearchResultList
            bfSearchResultConnection$key={data.currentViewer.searchResults}
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
        {data?.currentViewer?.searchResults && (
          <Search
            bfSearchResultConnection$key={data.currentViewer.searchResults}
          />
        )}
        <Suspense fallback={<BfDsFullPageSpinner />}>
          <ClipsView
            currentViewer$key={data.currentViewer}
            bfSearchResult$key={data.node}
          />
        </Suspense>
      </div>
    </div>
  );
}

export function ClipSearchPage() {
  return <ClipSearchPageContent />;
}
