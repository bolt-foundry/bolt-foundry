import { React } from "deps.ts";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { Search } from "packages/client/components/clipsearch/Search.tsx";
import { ClipsView } from "packages/client/components/clipsearch/ClipsView.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";

export function ClipSearchPage() {
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
              onClick={() => console.log("click")}
            />
          </List>
        }
        header="Clip search"
      />
      <div className="cs-main">
        <Search />
        <ClipsView />
      </div>
    </div>
  );
}
