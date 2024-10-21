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
import { getLogger } from "packages/logger/logger.ts";
import { SearchResults } from "packages/client/components/clipsearch/SearchResults.tsx";
const { Suspense } = React;

const logger = getLogger(import.meta);

const query = await graphql`
  query ClipSearchPageQuery($searchId: ID!, $includeSearch: Boolean!) {
    currentViewer {
      person {
        name 
      }
      organization {
        collections(first: 10) {
          count
          edges {
            node {
              __typename
              ...Search_bfCollection
            }
          }
        }
      }
    }
    node(id: $searchId) @include(if: $includeSearch) {
      ...SearchResults_bfSavedSearch
    }
  }
`;

export function ClipSearchPageContent() {
  const { navigate, routeParams } = useRouter();
  const searchId = routeParams.searchId ?? "";
  const data = useLazyLoadQuery<ClipSearchPageQuery>(query, {
    searchId,
    includeSearch: Boolean(searchId),
  });
  const count = 0;
  const firstCollection = data?.currentViewer?.organization?.collections?.edges
    ?.[0]?.node;
  logger.debug(firstCollection);
  const sidebarContents = null;
  return (
    <div className="cs-page flexRow">
      <Sidebar
        contents={sidebarContents}
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
        {firstCollection && <Search bfCollection$key={firstCollection} />}
        <Suspense fallback={<BfDsFullPageSpinner />}>
          <SearchResults bfSavedSearch$key={data.node} />
        </Suspense>
      </div>
    </div>
  );
}

export function ClipSearchPage() {
  return (
    <ClipSearchProvider>
      <ClipSearchPageContent />
    </ClipSearchProvider>
  );
}
