import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import type { SettingsPageQuery } from "packages/__generated__/SettingsPageQuery.graphql.ts";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { DeleteMediaButton } from "packages/client/components/settings/DeleteMediaButton.tsx";
import { PillStatusTranscript } from "packages/client/components/settings/PillStatusTranscript.tsx";
import { PillStatusPreviewVideo } from "packages/client/components/settings/PillStatusPreviewVideo.tsx";
import { TranscriptWordCount } from "packages/client/components/settings/TranscriptWordCount.tsx";

const fragment = await graphql`
fragment Media_bfOrganization on BfOrganization {
  id
  media(first: 100) {
    edges {
      node {
        id
        filename
        name
        previewVideo {
          id
          url
          ...PillStatusPreviewVideo_bfVideo
        }
        transcript {
          ...PillStatusTranscript_bfTranscript
          ...TranscriptWordCount_bfTranscript
          words {
            __typename
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
  transcript: SettingsPageQuery;
  previewVideo: SettingsPageQuery;
};

export function Media({ settings$key }: Props) {
  if (!settings$key) {
    return <BfDsFullPageSpinner />;
  }
  const [deletedRows, setDeletedRows] = useState<Array<string>>([]);
  const data = useFragment(fragment, settings$key);
  const handleDeletedRow = (id: string) => {
    setDeletedRows((prev) => [...prev, id]);
  };

  const tableData = data?.media?.edges?.map((d, i) => {
    if (deletedRows.includes(d?.node?.id)) {
      return null;
    }
    return {
      id: d?.node?.id,
      filename: d?.node?.name,
      previewVideoUrl: d?.node?.previewVideo?.url,
      transcript: d?.node?.transcript,
      previewVideo: d?.node?.previewVideo,
    };
  }).filter(Boolean);

  const columns: BfDsColumns<Data> = [
    {
      title: "File name",
      width: "2fr",
      renderer: (data) => (
        <BfDsTableCell
          text={data.filename}
          meta={
            <div className="flexRow" style={{ gap: "5px" }}>
              <PillStatusTranscript settings$key={data?.transcript} />
              <PillStatusPreviewVideo settings$key={data?.previewVideo} />
            </div>
          }
        />
      ),
    },
    {
      title: "Transcript words",
      width: "0.5fr",
      renderer: (data) => <TranscriptWordCount settings$key={data?.transcript} />,
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
