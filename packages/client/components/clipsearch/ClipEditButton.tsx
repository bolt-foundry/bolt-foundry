import { useState } from "react";
import { useFragment } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { ClipEditModal } from "packages/client/components/clipsearch/ClipEditModal.tsx";
import { graphql } from "packages/client/deps.ts";
import type { ClipEditButton_bfSavedSearchResult$key } from "packages/__generated__/ClipEditButton_bfSavedSearchResult.graphql.ts";
type Props = {
  bfSavedSearchResult$key: ClipEditButton_bfSavedSearchResult$key;
};
const fragment = await graphql`
  fragment ClipEditButton_bfSavedSearchResult on BfSavedSearchResult{
    ...ClipEditModal_bfSavedSearchResult
  }
`;
export function ClipEditButton({ bfSavedSearchResult$key }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const data = useFragment(fragment, bfSavedSearchResult$key);

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
          bfSavedSearchResult$key={data}
        />
      )}
    </>
  );
}
