import * as React from "react";
import { Suspense, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { WatchFolder } from "packages/client/components/settings/WatchFolder.tsx";
import { Media } from "packages/client/components/settings/Media.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";

const query = await graphql`
query SettingsPageQuery {
  currentViewer {
    person {
      name
    }
    organization {
      ...WatchFolderList_bfOrganization
      ...Media_bfOrganization
      id
      name
    }
  }
}
`;

enum Tabs {
  WATCH_FOLDERS = "watchFolders",
  MEDIA = "media",
}

export function SettingsPage() {
  const [selected, setSelected] = useState<Tabs>(Tabs.WATCH_FOLDERS);
  const data = useLazyLoadQuery<SettingsPageQuery>(query, {});

  const organizationFragmentRef = data?.currentViewer?.organization ?? null;

  let content: JSX.Element;
  switch (selected) {
    case Tabs.MEDIA:
      content = <Media settings$key={organizationFragmentRef} />;
      break;
    case Tabs.WATCH_FOLDERS:
    default: {
      content = <WatchFolder settings$key={organizationFragmentRef} />;
    }
  }

  return (
    <div className="cs-page">
      <Sidebar
        contents={
          <List>
            <ListItem
              isHighlighted={selected === Tabs.WATCH_FOLDERS}
              content="Watch folders"
              onClick={() => setSelected(Tabs.WATCH_FOLDERS)}
            />
            <ListItem
              isHighlighted={selected === Tabs.MEDIA}
              content="Media"
              onClick={() => setSelected(Tabs.MEDIA)}
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
      <Suspense fallback={<FullPageSpinner />}>
        {content}
      </Suspense>
    </div>
  );
}
