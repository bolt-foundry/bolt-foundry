import * as React from "react";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import type { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { DeleteMediaButton } from "packages/client/components/settings/DeleteMediaButton.tsx";

const fragment = await graphql`
fragment Media_bfOrganization on BfOrganization {
  media(first: 100) {
    edges {
      node {
        id
        filename
        name
        previewVideoUrl
        transcripts(first: 1) {
          edges {
            node {
              words {
                start
                end
                text
                confidence
                speaker
              }
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
  id: string;
  filename: string;
  previewVideoUrl: string;
  words: number;
  tokens: number;
};

export function Media({ settings$key }: Props) {
  if (!settings$key) {
    return <BfDsFullPageSpinner />;
  }
  const [deletedRows, setDeletedRows] = React.useState<Array<string>>([]);
  const data = useFragment(fragment, settings$key);

  const handleDeletedRow = (id: string) => {
    setDeletedRows((prev) => [...prev, id]);
  };

  const tableData = data?.media?.edges?.map((d, i) => {
    if (deletedRows.includes(d?.node?.id)) {
      return false;
    }
    const transcript = d?.node?.transcripts?.edges?.[0]?.node?.words ??
      [];
    return {
      id: d?.node?.id,
      filename: d?.node?.name,
      previewVideoUrl: d?.node?.previewVideoUrl,
      words: transcript.length,
      tokens: `~${transcript.length / 4}`,
    };
  }).filter(Boolean);
  const columns: BfDsColumns<Data> = [
    // {
    //   title: "File name",
    //   width: "100px",
    //   renderer: (data) => <video src={data.previewVideoUrl} />,
    // },
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
    {
      title: " ",
      width: "48px",
      renderer: (data) => (
        <BfDsTableCell
          element={
            <DeleteMediaButton
              id={data.id}
              onDelete={() => handleDeletedRow(data.id)}
            />
          }
        />
      ),
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
