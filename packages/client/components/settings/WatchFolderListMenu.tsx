import * as React from "react";
import { useMutation } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { Button } from "packages/bfDs/Button.tsx";

type Props = {
  removeItem: (resourceId: string) => void;
  resourceId: string;
};

const deleteMutation = await graphql`
  mutation WatchFolderListMenu_deleteMutation($id: String) {
    deleteGoogleDriveResource(resourceId: $id) {
      success
    }
  }
`;

export function WatchFolderListMenu({ removeItem, resourceId }: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(
    false,
  );
  const [commitDelete, deleteIsInFlight] = useMutation(deleteMutation);

  const handleDelete = () => {
    removeItem(resourceId);
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
    <Button
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
