import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { SettingsMediaQuery } from "packages/__generated__/SettingsMediaQuery.graphql.ts";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { Sidebar } from "packages/client/components/Sidebar.tsx";
const { useLazyLoadQuery } = ReactRelay;

type Data = {
  filename: string;
  words: number;
  tokens: number;
};

const query = await graphql`
query SettingsMediaQuery {
  currentViewer {
    person {
      name
    }
    organization {
      id
      name
      media(first: 100) {
        edges {
          node {
            filename
            transcripts(first: 1) {
              edges {
                node {
                  words
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

function Content() {
  const fetchedData = useLazyLoadQuery<SettingsMediaQuery>(query, {});
  const media = fetchedData?.currentViewer?.organization?.media?.edges;
  const formattedData = media?.map((d, i) => {
    const transcriptString = d?.node?.transcripts?.edges?.[0]?.node?.words ??
      "[]";
    const transcript = JSON.parse(transcriptString);
    return {
      filename: d?.node?.filename,
      words: transcript.length,
      tokens: `~${transcript.length / 4}`,
    };
  });
  const columns: Columns<Data> = [
    {
      title: "File name",
      width: "2fr",
      renderer: (data) => <TableCell text={data.filename} />,
    },
    {
      title: "Transcript words",
      width: "0.5fr",
      renderer: (data) => <TableCell text={data.words} />,
    },
    {
      title: "Tokens",
      width: "0.5fr",
      renderer: (data) => <TableCell text={data.tokens} />,
    },
  ];

  return (
    <div className="cs-page-content">
      <div className="cs-page-section">
        <div className="cs-page-section-title">Media</div>
        <Table columns={columns} data={formattedData} />
      </div>
    </div>
  );
}

export function SettingsMedia() {
  const data = useLazyLoadQuery<SettingsPageQuery>(query, {});
  return (
    <div className="cs-page">
      <Sidebar
        contents={
          <List>
            <ListItem
              content="Watch folders"
              onClick={() => console.log("click")}
            />
            <ListItem
              isHighlighted={true}
              content="Media"
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
