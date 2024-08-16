import { React, ReactRelay } from "deps.ts";
import { usePaginationFragment } from "react-relay";
import { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { graphql } from "packages/client/deps.ts";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
import { Button } from "packages/bfDs/Button.tsx";
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
  settings$key: SettingsPageQuery$data | null;
};

type Data = {
  id: string;
  folder: string;
  videos: number;
  active: boolean;
  status: string;
};

export function WatchFolderList({ settings$key }: Props) {
  if (!settings$key) {
    return <FullPageSpinner />;
  }
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

  const columns: Columns<Data> = [
    {
      title: "Folder name",
      width: "2fr",
      renderer: (data) => <TableCell text={data.folder} />,
    },
    {
      title: "Videos",
      width: "0.5fr",
      renderer: (data) => <TableCell text={data.videos} />,
    },
    {
      title: "Active",
      width: "0.5fr",
      renderer: (data) => <TableCell text={data.active ? "Yes" : "No"} />,
    },
    {
      title: "Status",
      width: "1fr",
      renderer: (data) => <TableCell text={data.status} />,
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
        <Table columns={columns} data={tableData} />
        <Button
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
