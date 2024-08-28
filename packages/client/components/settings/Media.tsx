import type * as React from "react";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import type { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";

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
    return <BfDsFullPageSpinner />;
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
  const columns: BfDsColumns<Data> = [
    {
      title: "File name",
      width: "2fr",
      renderer: (data) => <BfDsTableCell text={data.filename} />,
    },
    {
      title: "Transcript words",
      width: "0.5fr",
      renderer: (data) => <BfDsTableCell text={data.words} />,
    },
    {
      title: "Tokens",
      width: "0.5fr",
      renderer: (data) => <BfDsTableCell text={data.tokens} />,
    },
  ];

  return (
    <div className="cs-main">
      <div className="cs-page-content">
        <div className="cs-page-section">
          <div className="cs-page-section-title">Media</div>
          <BfDsTable columns={columns} data={tableData} />
        </div>
      </div>
    </div>
  );
}
