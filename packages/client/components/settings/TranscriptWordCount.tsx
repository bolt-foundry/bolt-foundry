import { useMemo } from "react";
import { useFragment, useSubscription } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import type { TranscriptWordCount_bfTranscript$key } from "packages/__generated__/TranscriptWordCount_bfTranscript.graphql.ts";

const fragment = await graphql`
  fragment TranscriptWordCount_bfTranscript on BfMediaNodeTranscript {
    id
    words {
      __typename
    }
  }
`;

const subscription = await graphql`
  subscription TranscriptWordCountSubscription($id: ID!) {
    node(id: $id) {
      ...TranscriptWordCount_bfTranscript
    }
  }
`;

type Props = {
  settings$key: TranscriptWordCount_bfTranscript$key | null;
};

export function TranscriptWordCount({ settings$key }: Props) {
  const data = useFragment<TranscriptWordCount_bfTranscript$key>(
    fragment,
    settings$key,
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

  let words = "--";
  let tokens = "-- tokens";
  if (data?.words) {
    const length = data.words.length;
    words = length.toString();
    tokens = `~${length / 4} tokens`;
  }

  return <BfDsTableCell text={words} meta={tokens} />;
}
