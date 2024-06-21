import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import {
  ProjectPageOldQuery,
  ProjectPageOldQuery$data,
} from "aws/__generated__/ProjectPageOldQuery.graphql.ts";
import CreateNewProject from "aws/client/components/CreateNewProject.tsx";
import ProjectView from "aws/client/components/ProjectView.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import PageFrame from "aws/client/components/PageFrame.tsx";

const { useEffect, useMemo, useState } = React;
const { useLazyLoadQuery } = ReactRelay;

const query = await graphql`
  query ProjectPageOldQuery($projectId: ID!, $includeProject: Boolean!, $count: Int!, $cursor: String) {
    project(id: $projectId) @include(if: $includeProject) {
      ...ProjectView_project
      ...CreateNewProject_project
      isReadyToView
      clips(first: $count, after: $cursor)
      @connection(key: "ClipList_project_clips") {
        edges {
          node {
            __typename
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

const subscriptionFragment = await graphql`
  subscription ProjectPageOldSubscription($id: ID!, $count: Int!, $cursor: String) {
    project(id: $id) {
      isReadyToView
      clips(first: $count, after: $cursor)
      @connection(key: "ClipList_project_clips") {
        edges {
          node {
            id
            ...useClipData_clip
            ...useClipEditData_clip
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

function ProjectPage() {
  const { routeParams } = useRouter();
  const { projectId } = routeParams;
  const includeProject = projectId != null;
  if (!projectId) {
    return <CreateNewProject project$key={null} />;
  }
  const data = useLazyLoadQuery<ProjectPageOldQuery>(query, {
    projectId,
    includeProject,
    count: 10,
  }) as ProjectPageOldQuery$data;

  const project = data.project;
  const loadedClipsCount = project?.clips?.edges?.length;

  const subscriptionConfig: GQLSubConfigOperationType = useMemo(
    () => ({
      variables: { id: projectId, count: loadedClipsCount },
      subscription: subscriptionFragment,
      updater: (store) => {
        const newProject = store.getRootField("project");
        if (newProject) {
          const currentProjectRecord = store.getRoot().getLinkedRecord(
            "project",
            { id: projectId },
          );
          const currentClips = currentProjectRecord?.getLinkedRecord("clips");

          if (currentClips) {
            // Use setValue to update the 'first' parameter of the clips connection
            currentClips.setValue(loadedClipsCount, "first");
          }

          store.getRoot().setLinkedRecord(newProject, "project", {
            id: projectId,
          });
        }
      },
    }),
    [projectId, loadedClipsCount],
  );
  ReactRelay.useSubscription(subscriptionConfig);

  if (project?.isReadyToView) {
    return <ProjectView project$key={project} />;
  }

  return <CreateNewProject project$key={project ? project : null} />;
}

export default function ProjectPageWithFrame() {
  return (
    <PageFrame xstyle={{ overflowY: "auto", flex: "auto" }}>
      <ProjectPage />
    </PageFrame>
  );
}
