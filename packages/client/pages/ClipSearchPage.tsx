import * as React from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { Search } from "packages/client/components/clipsearch/Search.tsx";
import { ClipsView } from "packages/client/components/clipsearch/ClipsView.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";

const query = await graphql`
  query ClipSearchPageQuery {
    currentViewer {
      person {
        id
        ...ClipsView_bfPerson
        ...Clip_bfPerson
      }
      organization {
        id
        media (first: 1) {
          count
        }
      }
    }
  }
`; 

export function ClipSearchPage() {
  const data = useLazyLoadQuery(query, {});
  const { navigate } = useRouter();
  const [clips, setClips] = React.useState<string>();
  const sidebarContents = (
    <>
      <List collapsible={true} header="Lists">
        <ListItem
          content="work-life balance"
          onClick={() => console.log("click")}
        />
        <ListItem
          content="taxes"
          onClick={() => console.log("click")}
        />
      </List>
      <List collapsible={true} header="Searches">
        <ListItem
          content="work-life balance"
          onClick={() => console.log("click")}
        />
        <ListItem
          content="taxes"
          onClick={() => console.log("click")}
        />
        <ListItem
          content="duck"
          onClick={() => console.log("click")}
        />
        <ListItem
          content="clouds"
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
        <Search setClips={setClips} count={data?.currentViewer?.organization?.media?.count ?? 0} />
        <ClipsView clips={clips} clips$key={data?.currentViewer?.person} />
      </div>
    </div>
  );
}
