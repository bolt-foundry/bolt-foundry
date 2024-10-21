import { useEffect, useMemo, useState } from "react";
import { useFragment, useMutation, useSubscription } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { graphql } from "packages/client/deps.ts";
import { getLogger } from "packages/logger/logger.ts";
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
    percentageRendered
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

const subscription = await graphql`
  subscription DownloadClipButtonSubscription($id: ID!) {
    node(id: $id) {
      ...DownloadClipButton_bfSavedSearchResult
    }
  }
`;

type Props = {
  bfSavedSearchResult$key: DownloadClipButton_bfSavedSearchResult$key;
};

export function DownloadClipButton(
  { bfSavedSearchResult$key }: Props,
) {
  const [shouldDownload, setShouldDownload] = useState(false);
  const [commit, isInFlight] = useMutation(mutation);
  const data: DownloadClipButton_bfSavedSearchResult$data = useFragment(
    fragment,
    bfSavedSearchResult$key,
  );
  const subscriptionConfig = useMemo(() => {
    return {
      variables: {
        id: data?.id,
      },
      subscription,
    };
  }, [data?.id]);
  useSubscription(subscriptionConfig);
  if (!data) return null;
  const { downloadable, id, title } = data;
  const url = downloadable?.url;
  const percentageRendered = downloadable?.percentageRendered;
  const ready = downloadable?.ready;
  useEffect(() => {
    logger.info({ url, percentageRendered, ready });
    if (shouldDownload && ready) {
      download();
    }
  }, [url, percentageRendered, ready, shouldDownload]);

  function download() {
    if (!url) {
      logger.error("Download URL is not available.");
      return;
    }

    const formattedTitle = url.split("/").pop();
    const href = url;
    const link = document.createElement("a");
    link.href = href;
    link.download = formattedTitle;
    link.click();
  }

  const handleDownload = () => {
    if (ready) {
      download();
      return;
    }
    setShouldDownload(true);
    commit({
      variables: {
        id,
      },
      onCompleted: (data) => {
        // download();
      },
      onError: (error) => {
        logger.error(error);
        throw new Error(error);
      },
    });
  };

  const showProgress = percentageRendered &&
    (percentageRendered > 0 && percentageRendered !== 1);
  const progress = showProgress ? percentageRendered * 100 : undefined;
  return (
    <>
      <BfDsButton
        iconLeft="download"
        kind={ready ? "accent" : "secondary"}
        showSpinner={isInFlight}
        progress={progress}
        onClick={handleDownload}
      />
    </>
  );
}
