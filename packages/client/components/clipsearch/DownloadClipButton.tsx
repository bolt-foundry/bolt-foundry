import * as React from "react";
import { useMutation } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { getLogger } from "deps.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";

const logger = getLogger(import.meta);

const mutation = await graphql`
  mutation DownloadClipButtonDownloadMutation (
    $startTime: Float!,
    $endTime: Float!,
    $mediaId: String!,
    $title: String!,
    $transcriptId: String!
  ) {
    downloadClip (
      startTime: $startTime, 
      endTime: $endTime, 
      mediaId: $mediaId,
      title: $title,
      transcriptId: $transcriptId
    ) {
      success
    }
  }
`;

type Props = {
  startTime: number;
  endTime: number;
  mediaId: string;
  title: string;
  transcriptId: string;
};

export function DownloadClipButton(
  { startTime = 0, endTime = 0, mediaId, title, transcriptId }: Props,
) {
  const [commit, isInFlight] = useMutation(mutation);

  const handleDownload = () => {
    commit({
      variables: {
        startTime,
        endTime,
        mediaId,
        title,
        transcriptId,
      },
      onCompleted: (data) => {
        const formattedTitle = `${sanitizeFilename(title)}.mp4`;
        const href = `/build/downloads/${formattedTitle}`;
        if (data.downloadClip.success) {
          const link = document.createElement("a");
          link.href = href;
          link.download = formattedTitle;
          link.click();
        }
      },
    });
  };
  return (
    <BfDsButton
      iconLeft="download"
      showSpinner={isInFlight}
      onClick={handleDownload}
    />
  );
}
