import { React } from "deps.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { ClipEditModal } from "packages/client/components/clipsearch/ClipEditModal.tsx";
const useState = React.useState;
type Props = {
  bfSavedSearchResult$key: ClipEditButton_bfSavedSearchResult$key;
};
export function ClipEditButton({ bfSavedSearchResult$key }: props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <BfDsButton
        kind="primary"
        iconLeft="pencil"
        onClick={() => setIsEditing(true)}
        testId="button-edit-clip"
      />
      {isEditing && (
        <ClipEditModal
          setIsEditing={setIsEditing}
          bfSavedSearchResult$key={bfSavedSearchResult$key}
        />
      )}
    </>
  );
}
