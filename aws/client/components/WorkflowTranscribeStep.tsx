import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import Step from "aws/client/components/Step.tsx";
import { WorkflowTranscribeStep_project$key } from "aws/__generated__/WorkflowTranscribeStep_project.graphql.ts";

const { useMemo } = React;

type Props = {
  project$key: WorkflowTranscribeStep_project$key;
};

const fragment = await graphql`
  fragment WorkflowTranscribeStep_project on Project {
    id
    transcripts(first: 1) {
      edges {
        node {
          transcriptLength
        }
      }
    }
    videoUrl
    opurl
  }
`;

const subscriptionFragment = await graphql`
  subscription WorkflowTranscribeStepSubscription($id: ID!) {
    project(id: $id) {
      ...WorkflowTranscribeStep_project
      transcripts(first: 1) {
        edges {
          node {
            transcriptLength
          }
        }
      }
    }
  }
`;

export default function WorkflowTranscribeStep(
  { project$key }: Props,
) {
  const project = ReactRelay.useFragment(fragment, project$key);
  const projectId = project.id;
  const opurl = project.opurl;
  // deno-lint-ignore no-console
  console.log("opurl", opurl);
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

  const pending = project?.videoUrl != null;
  const transcriptLength = project?.transcripts?.edges?.[0]?.node
    ?.transcriptLength;
  const transcriptComplete = (transcriptLength ?? 0) > 0;
  const transcriptSubtitle = transcriptComplete
    ? `${transcriptLength} words`
    : null;
  return (
    <Step
      complete={transcriptComplete}
      pending={pending}
      initialText="Transcribe"
      pendingText="Transcribing..."
      completeText="Transcribed"
      subtitle={transcriptSubtitle}
    />
  );
}
