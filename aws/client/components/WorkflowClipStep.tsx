import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import Step from "aws/client/components/Step.tsx";
import { WorkflowClipStep_project$key } from "aws/__generated__/WorkflowClipStep_project.graphql.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";

const { useMemo } = React;

type Props = {
  project$key: WorkflowClipStep_project$key;
};

const fragment = await graphql`
  fragment WorkflowClipStep_project on Project {
    id
    transcriptLength
    clipsStatus {
      progress
      status
    }
    clipsLength
  }
`;

const subscriptionFragment = await graphql`
  subscription WorkflowClipStepSubscription($id: ID!) {
    project(id: $id) {
      ...WorkflowClipStep_project
    }
  }
`;

export default function WorkflowClipStep({ project$key }: Props) {
  const project = ReactRelay.useFragment(fragment, project$key);
  const projectId = project.id;
  const subscriptionConfig: GQLSubConfigOperationType = useMemo(
    () => ({
      variables: { id: projectId },
      subscription: subscriptionFragment,
      updater: (store) => {
        const newProject = store.getRootField("project");
        store.getRoot().setLinkedRecord(newProject, "project", {
          id: projectId,
        });
      },
    }),
    [projectId],
  );
  ReactRelay.useSubscription(subscriptionConfig);

  const pending = (project?.transcriptLength ?? 0) > 0;
  const status = project?.clipsStatus?.status;
  const clipsLength = project?.clipsLength ?? 0;
  const clipsComplete = status === "COMPLETE";
  const progress = Number(project?.clipsStatus?.progress) * 100;

  const clipsSubtitle = pending
    ? clipsLength > 0 ? `${clipsLength} clips found` : (
      <span>
        <span style={{ fontFamily: fonts.fontFamilyMono }}>
          {Math.round(progress)}
        </span>% complete
      </span>
    )
    : null;

  return (
    <Step
      complete={clipsComplete}
      percent={progress ?? 0}
      initialText="Clips"
      pendingText="Finding clips..."
      completeText="Clips found"
      subtitle={clipsSubtitle}
    />
  );
}
