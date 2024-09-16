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
import { SearchResultList } from "packages/client/components/clipsearch/ClipSearchSearchResultList.tsx";
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
        ...WatchFolderList_bfOrganization
        id
        media (first: 1) {
          count
        }
      }
      ...ClipSearchSearchResultList_currentViewer
    }
  }
`;



export function ClipSearchPageContent() {
  const { navigate } = useRouter();
  const data = useLazyLoadQuery<ClipSearchPageQuery>(query, {});
  const count = data?.currentViewer?.organization?.media?.count ?? 0;

  return (
    <div className="cs-page flexRow">
      <Sidebar
        contents={<SearchResultList currentViewer$key={data.currentViewer} />}
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
        <Search />
        <Suspense fallback={<BfDsFullPageSpinner />}>
          <ClipsViewNullState
            count={count}
            settings$key={data?.currentViewer?.organization}
          />
        </Suspense>
      </div>
    </div>
  );
}

export function ClipSearchPage() {
  return <ClipSearchPageContent />;
}
