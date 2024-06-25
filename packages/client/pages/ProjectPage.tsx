import { getLogger, React, ReactRelay } from "deps.ts";
// import {
//   ProjectPageOldQuery,
//   ProjectPageOldQuery$data,
// } from "packages/__generated__/ProjectPageOldQuery.graphql.ts";
import { ProjectView } from "packages/client/components/ProjectView.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { PageFrame } from "packages/client/components/PageFrame.tsx";
import { ProjectPageToast } from "packages/client/components/ProjectPageToast.tsx";
import { graphql } from "packages/client/deps.ts";
const logger = getLogger(import.meta);

const { useEffect, useMemo, useState } = React;
const { useLazyLoadQuery } = ReactRelay;

// const subscriptionFragment = await graphql`
//   subscription ProjectPageOldSubscription($id: ID!, $count: Int!, $cursor: String) {
//     project(id: $id) {
//       isReadyToView
//       clips(first: $count, after: $cursor)
//       @connection(key: "ClipList_project_clips") {
//         edges {
//           node {
//             id
//             ...useClipData_clip
//             ...useClipEditData_clip
//           }
//         }
//         pageInfo {
//           endCursor
//           hasNextPage
//           hasPreviousPage
//           startCursor
//         }
//       }
//     }
//   }
// `;

export function ProjectPage() {
  const [showToast, setShowToast] = useState(false);
  const { routeParams } = useRouter();
  const { projectId } = routeParams;
  logger.info(`ProjectPage: projectId: ${projectId}`);
  const data = useLazyLoadQuery<ProjectPageContainerProjectQuery>(query, {
    id: projectId,
  });
  

  // const subscriptionConfig: GQLSubConfigOperationType = useMemo(
  //   () => ({
  //     variables: { id: projectId, count: loadedClipsCount },
  //     subscription: subscriptionFragment,
  //     updater: (store) => {
  //       const newProject = store.getRootField("project");
  //       if (newProject) {
  //         const currentProjectRecord = store.getRoot().getLinkedRecord(
  //           "project",
  //           { id: projectId },
  //         );
  //         const currentClips = currentProjectRecord?.getLinkedRecord("clips");

  //         if (currentClips) {
  //           // Use setValue to update the 'first' parameter of the clips connection
  //           currentClips.setValue(loadedClipsCount, "first");
  //         }

  //         store.getRoot().setLinkedRecord(newProject, "project", {
  //           id: projectId,
  //         });
  //       }
  //     },
  //   }),
  //   [projectId, loadedClipsCount],
  // );
  // ReactRelay.useSubscription(subscriptionConfig);

  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <ProjectView containerProject$key={data.containerProject} />
      <ProjectPageToast containerProject$key={data.containerProject} />
    </PageFrame>
  );
}
