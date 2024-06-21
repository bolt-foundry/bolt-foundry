import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import ButtonConfirmation from "aws/client/ui_components/ButtonConfirmation.tsx";
import { ButtonSizeType } from "aws/client/ui_components/Button.tsx";

const { useMutation, ConnectionHandler } = ReactRelay;

const deleteMutation = await graphql`
  mutation DeleteProjectButtonDeleteProjectMutation($id: ID!, $connections: [ID!]!) {
    deleteProject(id: $id) {
      id @deleteEdge(connections: $connections)
    }
  }
`;

type Props = {
  size?: ButtonSizeType;
  projectId: Maybe<string>;
  testId?: string; // for identifying the element in posthog
};

export default function DeleteProjectButton(
  { size, projectId, testId }: Props,
) {
  const [commitDeleteMutation, isDeleteInflight] = useMutation(deleteMutation);
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const { navigate } = useRouter();
  const connectionId = ConnectionHandler.getConnectionID(
    personId ?? "",
    "ProjectList_projects",
  );
  if (!projectId) return null;

  const onDelete = () => {
    commitDeleteMutation({
      variables: {
        id: projectId,
        connections: [connectionId],
      },
      onCompleted: (response) => {
        // deno-lint-ignore no-console
        console.log("Response", response);
        navigate("/projects");
      },
    });
  };

  return (
    <ButtonConfirmation
      icon="trash"
      iconSelected="trashSolid"
      onConfirm={onDelete}
      showSpinner={isDeleteInflight}
      size={size}
      testId={testId}
    />
  );
}
