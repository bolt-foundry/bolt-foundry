import { React, ReactRelay } from "deps.ts";
import { useFragment, useMutation, usePaginationFragment } from "react-relay";
import { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { graphql } from "packages/client/deps.ts";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
import { Button } from "packages/bfDs/Button.tsx";

const useEffect = React.useEffect;

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

  const tableData = data?.googleDriveFolders?.edges?.map((edge) => {
    return {
      folder: edge.node.name ?? "Untitled",
      videos: 0,
      active: false,
      status: "INGESTING",
    };
  });

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
  ];

  return (
    <div className="cs-page-section">
      <div className="cs-page-section-title">Watch folders</div>
      <Table columns={columns} data={tableData} />
      <Button
        disabled={!hasNext}
        kind="outline"
        text={isLoadingNext ? "Loading..." : "Load more"}
        onClick={() => loadNext(10)}
        size="medium"
      />
    </div>
  );
}
