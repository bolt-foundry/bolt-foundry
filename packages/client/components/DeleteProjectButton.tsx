import { React, ReactRelay } from "deps.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import { ButtonConfirmation } from "packages/bfDs/ButtonConfirmation.tsx";
import { ButtonSizeType } from "packages/bfDs/Button.tsx";

const { useMutation, ConnectionHandler } = ReactRelay;

// const deleteMutation = await graphql`
//   mutation DeleteProjectButtonDeleteProjectMutation($id: ID!, $connections: [ID!]!) {
//     deleteProject(id: $id) {
//       id @deleteEdge(connections: $connections)
//     }
//   }
// `;

type Props = {
  size?: ButtonSizeType;
  projectId: string | null;
  testId?: string; // for identifying the element in posthog
};

export function DeleteProjectButton(
  { size, projectId, testId }: Props,
) {
  // const [commitDeleteMutation, isDeleteInflight] = useMutation(deleteMutation);
  const isDeleteInflight = false;
  // const { currentViewer: { id: personId } } = useAppEnvironment();
  // const { navigate } = useRouter();
  // const connectionId = ConnectionHandler.getConnectionID(
  //   personId ?? "",
  //   "ProjectList_projects",
  // );
  // if (!projectId) return null;

  const onDelete = () => {
    console.log("delete");
    // commitDeleteMutation({
    //   variables: {
    //     id: projectId,
    //     connections: [connectionId],
    //   },
    //   onCompleted: (response) => {
    //     console.log("Response", response);
    //     navigate("/projects");
    //   },
    // });
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
