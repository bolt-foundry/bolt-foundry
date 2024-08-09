import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { WatchFolder } from "packages/client/components/settings/WatchFolder.tsx";
const { useLazyLoadQuery } = ReactRelay;

const query = await graphql`
query SettingsPageQuery {
  currentViewer {
    person {
      name
    }
    organization {
      ...WatchFolderList_bfOrganization
      id
      name
    }
  }
}
`;

export function SettingsPage() {
  const data = useLazyLoadQuery<SettingsPageQuery>(query, {});

  const organizationFragmentRef = data?.currentViewer?.organization ?? null;
  
  return (
    <div className="cs-page">
      <Sidebar
        contents={
          <List>
            <ListItem
              isHighlighted={true}
              content="Watch folders"
              onClick={() => console.log("click")}
            />
            <ListItem
              content="Other settings"
              onClick={() => console.log("click")}
            />
            <ListItem
              content="Coming soon..."
              onClick={() => console.log("click")}
            />
          </List>
        }
        footer={
          <>
            <div>Welcome, {data?.currentViewer?.person?.name}</div>
            <div>{data?.currentViewer?.organization?.name}</div>
          </>
        }
        header="Settings"
      />
      <WatchFolder settings$key={organizationFragmentRef} />
    </div>
  );
}
