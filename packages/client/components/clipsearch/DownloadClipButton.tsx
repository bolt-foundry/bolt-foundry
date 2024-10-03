import { useEffect } from "react";
import { useFragment, useMutation } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { getLogger } from "deps.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";
import type { DownloadClipButton_bfSavedSearchResult$key } from "packages/__generated__/DownloadClipButton_bfSavedSearchResult.graphql.ts";

const logger = getLogger(import.meta);

const fragment = await graphql`
  fragment DownloadClipButton_bfSavedSearchResult on BfSavedSearchResult {
    downloadable {
      url
      percentageRendered
      ready
    }
  }
`;

type Props = {
  bfSavedSearchResult$key: DownloadClipButton_bfSavedSearchResult$key;
};

export function DownloadClipButton(
  { bfSavedSearchResult$key }: Props,
) {
  const { url, percentageRendered, ready } = useFragment(
    fragment,
    bfSavedSearchResult$key,
  );
  useEffect(() => {
    logger.info({ url, percentageRendered, ready });
  }, [url, percentageRendered, ready]);

  const handleDownload = () => {
    logger.info("download goes here");
  };
  return (
    <BfDsButton
      iconLeft="download"
      onClick={handleDownload}
    />
  );
}
