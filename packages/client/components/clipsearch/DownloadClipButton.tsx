import type * as React from "react";
import { useMutation } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { getLogger } from "deps.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";

const logger = getLogger(import.meta);



type Props = {
  startTime: number;
  endTime: number;
  mediaId: string;
  title: string;
  transcriptId: string;
  title: string;
  disabled: boolean;
};

export function DownloadClipButton(
  { startTime = 0, endTime = 0, mediaId, title, transcriptId, disabled }: Props,
) {

  const handleDownload = () => {
    logger.error("Clip download doesn't work yet.")
  };
  return (
    <BfDsButton
      iconLeft="download"
      onClick={handleDownload}
      disabled={disabled}
    />
  );
}
