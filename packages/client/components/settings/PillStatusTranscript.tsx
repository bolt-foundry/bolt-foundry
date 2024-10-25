import { useMemo } from "react";
import { useFragment, useSubscription } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { PillStatus } from "packages/bfDs/PillStatus.tsx";
import type { PillStatusTranscript_bfTranscript$key } from "packages/__generated__/PillStatusTranscript_bfTranscript.graphql.ts";

const fragment = await graphql`
  fragment PillStatusTranscript_bfTranscript on BfMediaNodeTranscript {
    id
    status
  }
`;

const subscription = await graphql`
  subscription PillStatusTranscriptSubscription($id: ID!) {
    node(id: $id) {
      ...PillStatusTranscript_bfTranscript
    }
  }
`;

type Props = {
  settings$key: PillStatusTranscript_bfTranscript$key | null;
};

export function PillStatusTranscript({ settings$key }: Props) {
  const data = useFragment<PillStatusTranscript_bfTranscript$key>(
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
  return (
    <PillStatus label="transcript" status={data?.status ?? ""} percent={0.5} />
  );
}
