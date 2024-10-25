import { useMemo } from "react";
import { useFragment, useSubscription } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { PillStatus } from "packages/bfDs/PillStatus.tsx";
import type { PillStatusPreviewVideo_bfVideo$key } from "packages/__generated__/PillStatusPreviewVideo_bfVideo.graphql.ts";

const fragment = await graphql`
  fragment PillStatusPreviewVideo_bfVideo on BfMediaNodeVideo {
    id
    status
  }
`;

const subscription = await graphql`
  subscription PillStatusPreviewVideoSubscription($id: ID!) {
    node(id: $id) {
      ...PillStatusPreviewVideo_bfVideo
    }
  }
`;

type Props = {
  settings$key: PillStatusPreviewVideo_bfVideo$key | null;
};

export function PillStatusPreviewVideo({ settings$key }: Props) {
  const data = useFragment<PillStatusPreviewVideo_bfVideo$key>(
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
    <PillStatus label="preview" status={data?.status ?? ""} percent={0.5} />
  );
}
