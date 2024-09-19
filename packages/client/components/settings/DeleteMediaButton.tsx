import * as React from "react";
import { useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

const mutation = await graphql`
  mutation DeleteMediaButtonMutation($id: String!) {
    deleteMedia(id: $id) {
      id @deleteRecord
    }
  }
`;

type Props = {
  id: string;
};

export function DeleteMediaButton({ id }: Props) {
  const [confirm, setConfirm] = React.useState(false);
  const [commit, isInFlight] = useMutation(mutation);

  const handleDelete = () => {
    commit({
      variables: { id },
      onCompleted: () => {
        setConfirm(false);
        logger.debug("Deleted media successfully");
      },
      onError: (error) => {
        setConfirm(false);
        logger.debug("Error deleting media: ", error);
      },
    });
  };

  return confirm
    ? (
      <BfDsButton
        onClick={handleDelete}
        iconLeft="trashSolid"
        kind="alert"
        showSpinner={isInFlight}
        tooltip="Confirm delete"
      />
    )
    : (
      <BfDsButton
        onClick={() => setConfirm(true)}
        iconLeft="trash"
        kind="overlay"
        tooltip="Delete"
      />
    );
}
