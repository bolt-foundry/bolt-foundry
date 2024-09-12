import type * as React from "react";
import { startTransition, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import type { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
import { WatchFolder } from "packages/client/components/settings/WatchFolder.tsx";
import { Media } from "packages/client/components/settings/Media.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { useBfDs } from "packages/bfDs/hooks/useBfDs.tsx";
import { BfDsGlimmer } from "packages/bfDs/BfDsGlimmer.tsx";

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
  const { routeParams } = useRouter();
  const { darkMode, setDarkMode } = useBfDs();
  const [selected, setSelected] = useState<Tabs>(
    (routeParams.tab as Tabs) ?? Tabs.WATCH_FOLDERS,
  );
  const data = useLazyLoadQuery<SettingsPageQuery>(query, {});
  const { navigate } = useRouter();
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

  const handleSetSelected = (tab: Tabs) => {
    startTransition(() => {
      setSelected(tab);
    });
    navigate(`/settings/${tab}`);
  };

  return (
    <div className="cs-page">
      <Sidebar
        contents={
          <List>
            <ListItem
              isHighlighted={selected === Tabs.WATCH_FOLDERS}
              content="Watch folders"
              onClick={() => handleSetSelected(Tabs.WATCH_FOLDERS)}
            />
            <ListItem
              isHighlighted={selected === Tabs.MEDIA}
              content="Media"
              onClick={() => handleSetSelected(Tabs.MEDIA)}
            />
          </List>
        }
        footer={
          <>
            <List>
              <ListItem
                content="Clip search"
                onClick={() => navigate("/search")}
              />
              <ListItem
                content="Dark mode"
                toggle={() => setDarkMode(!darkMode)}
                toggled={darkMode}
              />
            </List>
            {data?.currentViewer?.person?.name
              ? (
                <>
                  <div>Welcome, {data?.currentViewer?.person?.name}</div>
                  <div>{data?.currentViewer?.organization?.name}</div>
                </>
              )
              : <BfDsGlimmer height="42px" order={0} />}
          </>
        }
        header="Settings"
      />
      {content}
    </div>
  );
}
