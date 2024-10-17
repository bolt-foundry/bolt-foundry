import { useEffect } from "react";
import { useFragment, useMutation } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { getLogger } from "deps.ts";
import { sanitizeFilename } from "packages/lib/textUtils.ts";
import type {
  DownloadClipButton_bfSavedSearchResult$data,
  DownloadClipButton_bfSavedSearchResult$key,
} from "packages/__generated__/DownloadClipButton_bfSavedSearchResult.graphql.ts";

const logger = getLogger(import.meta);

const mutation = await graphql`
  mutation DownloadClipButtonDownloadMutation (
    $id: ID!
  ) {
    downloadClip (id: $id) {
      id
    }
  }
`;

const fragment = await graphql`
  fragment DownloadClipButton_bfSavedSearchResult on BfSavedSearchResult {
    id
    startTime
    endTime
    title
    downloadable {
      url
      percentageRendered
      ready
    }
    words {
      text
      startTime
      endTime
    }
  }
`;

type Props = {
  bfSavedSearchResult$key: DownloadClipButton_bfSavedSearchResult$key;
};

export function DownloadClipButton(
  { bfSavedSearchResult$key }: Props,
) {
  const [commit, isInFlight] = useMutation(mutation);
  const data: DownloadClipButton_bfSavedSearchResult$data = useFragment(
    fragment,
    bfSavedSearchResult$key,
  );
  if (!data) return null;
  const { downloadable, id, title } = data;
  const url = downloadable?.url;
  const percentageRendered = downloadable?.percentageRendered;
  const ready = downloadable?.ready;
  useEffect(() => {
    logger.info({ url, percentageRendered, ready });
  }, [url, percentageRendered, ready]);

  function download() {
    const formattedTitle = `${sanitizeFilename(title ?? "untitled")}.mp4`;
    const href = `/build/downloads/${formattedTitle}`;
    const link = document.createElement("a");
    link.href = href;
    link.download = formattedTitle;
    link.click();
  }

  const handleDownload = () => {
    commit({
      variables: {
        id,
      },
      onCompleted: (data) => {
        download();
      },
      onError: (error) => {
        logger.error(error);
        throw new Error(error);
      },
    });
  };
  return (
    <>
      <BfDsButton
        iconLeft="download"
        kind={ready ? "accent" : "secondary"}
        showSpinner={isInFlight}
        progress={percentageRendered ?? undefined}
        onClick={handleDownload}
      />
      <BfDsButton
        iconLeft="download"
        kind="accent"
        onClick={download}
      />
    </>
  );
}
