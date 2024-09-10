import { React, type ReactRelay } from "deps.ts";
import { usePaginationFragment } from "react-relay";
import type { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { graphql } from "packages/client/deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { WatchFolderListMenu } from "packages/client/components/settings/WatchFolderListMenu.tsx";

const fragment = await graphql`
  fragment WatchFolderList_bfOrganization on BfOrganization
  @refetchable(queryName: "WatchFolderListPaginationQuery")
  @argumentDefinitions(
    after: { type: "String" }
    first: { type: "Int", defaultValue: 5 }
  ) {
    googleDriveFolders(first: $first, after: $after) @connection(key: "WatchFolderList_googleDriveFolders") {
      count
      edges {
        node {
          name
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

type Props = {
  settings$key: SettingsPageQuery$data | ClipSearchPageQuery$data | null;
};

type Data = {
  id: string;
  folder: string;
  videos: number;
  active: boolean;
  status: string;
};

export function WatchFolderList({ settings$key }: Props) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    fragment,
    settings$key,
  );
  const [removedItems, setRemovedItems] = React.useState<Array<string>>([]);
  const removeItem = (resourceId: string) => {
    setRemovedItems(removedItems.concat(resourceId));
  };

  const tableData = data?.googleDriveFolders?.edges?.map((edge) => {
    const shouldShow = removedItems.indexOf(edge.node.id) === -1;
    if (!shouldShow) {
      return null;
    }
    return {
      id: edge.node.id,
      folder: edge.node.name ?? "Untitled",
      videos: 0,
      active: false,
      status: "INGESTING",
    };
  }).filter(Boolean);

  const columns: BfDsColumns<Data> = [
    {
      title: "Folder name",
      width: "2fr",
      renderer: (data) => <BfDsTableCell text={data.folder} />,
    },
    {
      title: "Videos",
      width: "0.5fr",
      renderer: (data) => <BfDsTableCell text={data.videos} />,
    },
    {
      title: "Active",
      width: "0.5fr",
      renderer: (data) => <BfDsTableCell text={data.active ? "Yes" : "No"} />,
    },
    {
      title: "Status",
      width: "1fr",
      renderer: (data) => <BfDsTableCell text={data.status} />,
    },
    {
      width: "0.5fr",
      renderer: (data) => (
        <WatchFolderListMenu removeItem={removeItem} resourceId={data.id} />
      ),
    },
  ];

  return (
    <div>
      {data?.googleDriveFolders?.edges?.length === 0 &&
        (
          <div className="cs-page-section">
            Authenticate with Google, then choose a folder.
          </div>
        )}
      <div className="cs-page-section">
        <BfDsTable columns={columns} data={tableData} />
        <BfDsButton
          disabled={!hasNext}
          kind="outline"
          text={isLoadingNext ? "Loading..." : "Load more"}
          onClick={() => loadNext(10)}
          size="medium"
        />
      </div>
    </div>
  );
}
