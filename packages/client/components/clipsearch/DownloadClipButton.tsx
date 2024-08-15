import * as React from "react";
import { useMutation } from "react-relay";
import { Button } from "packages/bfDs/Button.tsx";
import { graphql } from "packages/client/deps.ts";

const mutation = await graphql`
  mutation DownloadClipButtonDownloadMutation (
    $startTime: Float!,
    $endTime: Float!,
    $mediaId: String!,
    $transcriptId: String!
  ) {
    downloadClip (
      startTime: $startTime, 
      endTime: $endTime, 
      mediaId: $mediaId,
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
  transcriptId: string;
};

export function DownloadClipButton(
  { startTime = 0, endTime = 0, mediaId, transcriptId }: Props,
) {
  const [commit, isInFlight] = useMutation(mutation);

  const handleDownload = () => {
    commit({
      variables: {
        startTime,
        endTime,
        mediaId,
        transcriptId,
      },
    });
  };
  return (
    <Button
      iconLeft="download"
      showSpinner={isInFlight}
      onClick={handleDownload}
    />
  );
}
