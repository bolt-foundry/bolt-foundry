import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
const { useLazyLoadQuery } = ReactRelay;

type Data = {
  folder: string;
  videos: number;
  active: boolean;
  status: "INGESTING" | "TRANSCRIBING" | "COMPLETED";
};

const query = await graphql`
query SettingsPageQuery {
  currentViewer {
    person {
      name
    }
    organization {
      id
      name
    }
  }
}
`;

function Content() {
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
  const data = [
    { folder: "Video clips", videos: 28, active: false, status: "INGESTING" },
    { folder: "Broll", videos: 34, active: false, status: "TRANSCRIBING" },
    { folder: "Podcasts", videos: 45, active: true, status: "COMPLETED" },
  ];
  return (
    <div className="cs-page-content">
      <div className="cs-page-section">
        <p>
          Text about needing to authenticate with Google again to choose a
          folder...
        </p>
        <Button text="Authenticate with Google" />
      </div>
      <div className="cs-page-section">
        <div className="cs-page-section-title">Watch folders</div>
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

export function SettingsPage() {
  const data = useLazyLoadQuery<SettingsPageQuery>(query, {});
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
      <Content />
    </div>
  );
}
