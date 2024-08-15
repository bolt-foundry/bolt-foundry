import * as React from "react";
import { useMutation } from "react-relay";
import { Button } from "packages/bfDs/Button.tsx";
import { graphql } from "packages/client/deps.ts";

const mutation = await graphql`
  mutation DownloadClipButtonDownloadMutation (
    $startTime: Float!,
    $endTime: Float!,
    $transcriptId: String!
  ) {
    downloadClip (
      startTime: $startTime, 
      endTime: $endTime, 
      transcriptId: $transcriptId
    ) {
      success
    }
  }
`;

type Props = {
  startTime: number;
  endTime: number;
  transcriptId: string;
};

export function DownloadClipButton(
  { startTime = 0, endTime = 0, transcriptId }: Props,
) {
  const [commit, isInFlight] = useMutation(mutation);

  const handleDownload = () => {
    commit({
      variables: {
        startTime,
        endTime,
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
