import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import { useClipData_clip$key } from "aws/__generated__/useClipData_clip.graphql.ts";
const { useMemo } = React;
const { useFragment } = ReactRelay;

const fragment = await graphql`
  fragment useClipData_clip on Clip {
    ...StarClipButton_clip
    ...ChangeRequestButton_clip
    ...ManualCropMenu_clip
    id
    description
    downloadUrl
    encodingStatus
    end_index
    end_time
    endTimeOverride
    start_index
    start_time
    text
    title
    manualCrop
    manualCropActive
    ...DownloadClip_clip
  }
`;

const subscriptionFragment = await graphql`
  subscription useClipDataSubscription($id: ID!) {
    clip(id: $id) {
      ...useClipData_clip
    }
  }
`;

export function useClipData(
  clip$key: useClipData_clip$key,
) {
  const data = useFragment(fragment, clip$key);
  const subscriptionConfig: GQLSubConfigOperationType = useMemo(
    () => ({
      variables: { id: data.id },
      subscription: subscriptionFragment,
      updater: (store) => {
        const newClip = store.getRootField("clip");
        store.getRoot().setLinkedRecord(newClip, "clip", {
          id: data.id,
        });
      },
    }),
    [data.id],
  );
  ReactRelay.useSubscription(subscriptionConfig);

  return { data };
}
