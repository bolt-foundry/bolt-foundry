import { useState } from "react";
import { useFragment } from "react-relay";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { ClipEditModal } from "packages/client/components/clipsearch/ClipEditModal.tsx";
import { graphql } from "packages/client/deps.ts";
import type { ClipEditButton_bfSavedSearchResult$key } from "packages/__generated__/ClipEditButton_bfSavedSearchResult.graphql.ts";
import ClipEditModalProvider from "packages/client/contexts/ClipEditModalContext.tsx";

type Props = {
  bfSavedSearchResult$key: ClipEditButton_bfSavedSearchResult$key;
};

const fragment = await graphql`
  fragment ClipEditButton_bfSavedSearchResult on BfSavedSearchResult{
    id
    title
    startTime
    endTime
    duration
    words {
     text
     speaker
     startTime
     endTime
    }
    ...ClipEditModal_bfSavedSearchResult
  }
`;

export function ClipEditButton({ bfSavedSearchResult$key }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const data = useFragment(fragment, bfSavedSearchResult$key);
  const initialDraftClip = data as DraftClip;

  return (
    <>
      <BfDsButton
        kind="primary"
        iconLeft="pencil"
        onClick={() => setIsEditing(true)}
        testId="button-edit-clip"
      />
      {isEditing && (
        <ClipEditModalProvider initialDraftClip={initialDraftClip}>
          <ClipEditModal
            setIsEditing={setIsEditing}
            bfSavedSearchResult$key={data}
          />
        </ClipEditModalProvider>
      )}
    </>
  );
}
