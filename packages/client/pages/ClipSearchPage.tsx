import type * as React from "react";
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
    }
  }
`;

export function ClipSearchPageContent() {
  const { navigate } = useRouter();
  const { clips, isInFlight } = useClipSearchState();
  const data = useLazyLoadQuery(query, {});
  const count = data?.currentViewer?.organization?.media?.count;
  const sidebarContents = (
    <>
      <List collapsible={true} header="Lists">
        <ListItem
          content="work-life balance"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
        <ListItem
          content="taxes"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
      </List>
      <List collapsible={true} header="Searches">
        <ListItem
          content="work-life balance"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
        <ListItem
          content="taxes"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
        <ListItem
          content="duck"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
        <ListItem
          content="clouds"
          // deno-lint-ignore no-console
          onClick={() => console.log("click")}
        />
      </List>
    </>
  );
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
        <Search />
        {clips || isInFlight
          ? <ClipsView count={count} clips$key={data?.currentViewer?.person} />
          : (
            <ClipsViewNullState
              count={count}
              settings$key={data?.currentViewer?.organization}
            />
          )}
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
