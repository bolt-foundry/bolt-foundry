import * as React from "react";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";

const fragment = await graphql`
fragment Media_bfOrganization on BfOrganization {
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
`;

type Props = {
  settings$key: SettingsPageQuery | null;
};

type Data = {
  filename: string;
  words: number;
  tokens: number;
};

export function Media({ settings$key }: Props) {
  if (!settings$key) {
    return <FullPageSpinner />;
  }
  const data = useFragment(fragment, settings$key);
  const tableData = data?.media?.edges?.map((d, i) => {
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
    <div className="cs-main">
      <div className="cs-page-content">
        <div className="cs-page-section">
          <div className="cs-page-section-title">Media</div>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
    </div>
  );
}
