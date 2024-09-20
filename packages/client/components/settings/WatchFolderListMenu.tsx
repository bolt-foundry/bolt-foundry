import * as React from "react";
import { useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

type Props = {
  resourceId: string;
};

const deleteMutation = await graphql`
  mutation WatchFolderListMenu_deleteMutation($id: String) {
    deleteGoogleDriveResource(resourceId: $id) {
      id @deleteRecord
    }
  }
`;

export function WatchFolderListMenu({ resourceId }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(
    false,
  );
  const [commitDelete, deleteIsInFlight] = useMutation(deleteMutation);

  const handleDelete = () => {
    commitDelete({
      variables: {
        id: resourceId,
      },
    });
    setShowDeleteConfirmation(false);
  };

  const deleteRow = showDeleteConfirmation
    ? {
      label: "Confirm",
      showSpinnner: deleteIsInFlight,
      onClick: handleDelete,
      xstyle: { color: "white", backgroundColor: "var(--alert)" },
    }
    : {
      label: "Delete",
      closeOnClick: false,
      onClick: () => setShowDeleteConfirmation(true),
      xstyle: { color: "var(--alert)" },
    };

  return (
    <BfDsButton
      iconLeft="kebabMenu"
      kind="overlay"
      tooltipMenu={[
        { label: "Activate", disabled: true },
        { kind: "separator" },
        deleteRow,
      ]}
      tooltipJustification="end"
      tooltipPosition="bottom"
    />
  );
}
