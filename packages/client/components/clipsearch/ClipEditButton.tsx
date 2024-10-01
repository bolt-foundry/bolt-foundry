import { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { ClipEditModal } from "packages/client/components/clipsearch/ClipEditModal.tsx";
const useState = React.useState;

export function ClipEditButton() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <BfDsButton
        kind="primary"
        iconLeft="pencil"
        onClick={() => setIsEditing(true)}
      />
      {isEditing && <ClipEditModal setIsEditing={setIsEditing} />}
    </>
  );
}
