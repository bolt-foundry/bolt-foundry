import { project as fakeData } from "packages/client/fakeData/ProjectPageOldQuery.js";
import { React, ReactRelay } from "deps.ts";
// import { useClipData_clip$key } from "packages/__generated__/useClipData_clip.graphql.ts";
const { useMemo } = React;
const { useFragment } = ReactRelay;

// const fragment = await graphql`
//   fragment useClipData_clip on Clip {
//     ...StarClipButton_clip
//     id
//     description
//     downloadUrl
//     encodingStatus
//     end_index
//     end_time
//     endTimeOverride
//     start_index
//     start_time
//     text
//     title
//     ...DownloadClip_clip
//   }
// `;

// const subscriptionFragment = await graphql`
//   subscription useClipDataSubscription($id: ID!) {
//     clip(id: $id) {
//       ...useClipData_clip
//     }
//   }
// `;

export function useClipData(
  clip$key: useClipData_clip$key,
) {
  // const data = useFragment(fragment, clip$key);
  // const subscriptionConfig: GQLSubConfigOperationType = useMemo(
  //   () => ({
  //     variables: { id: data.id },
  //     subscription: subscriptionFragment,
  //     updater: (store) => {
  //       const newClip = store.getRootField("clip");
  //       store.getRoot().setLinkedRecord(newClip, "clip", {
  //         id: data.id,
  //       });
  //     },
  //   }),
  //   [data.id],
  // );
  // ReactRelay.useSubscription(subscriptionConfig);
  const tempData = fakeData.data.project.clips.edges.find((clip) =>
    clip.node.id === clip$key.id
  );
  const data = tempData?.node;

  return { data };
}
