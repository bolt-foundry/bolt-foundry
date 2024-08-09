import { React, ReactRelay } from "deps.ts";
import { useFragment } from "react-relay";
import { SettingsPageQuery$data } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { graphql } from "packages/client/deps.ts";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";

const fragment = await graphql`
fragment WatchFolderList_bfOrganization on BfOrganization {
  googleDriveFolders(first: 20) {
    count
    edges {
      node {
        name
        id
      }
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
  const data = useFragment(fragment, settings$key);
  console.log(data);
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
    </div>
  );
}
