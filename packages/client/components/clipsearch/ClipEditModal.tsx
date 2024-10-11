import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useMutation, useRefetchableFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { ClipWord } from "packages/client/components/clipsearch/ClipWord.tsx";
import type { ClipEditModal_bfSavedSearchResult$key } from "packages/__generated__/ClipEditModal_bfSavedSearchResult.graphql.ts";
import { useClipEditModal } from "packages/client/contexts/ClipEditModalContext.tsx";
import { EditWordMiniModal } from "packages/client/components/clipsearch/EditWordMiniModal.tsx";

type Props = {
  setIsEditing: (isEditing: boolean) => void;
  bfSavedSearchResult$key: ClipEditModal_bfSavedSearchResult$key;
};

const updateSearchResultMutation = await graphql`
  mutation ClipEditModal_updateSearchResultMutation(
    $id: String!
    $startTime: TimecodeInMilliseconds!
    $endTime: TimecodeInMilliseconds!
    $title: String!
    $description: String!
    $words: [SearchResultWordInput]
  ) {
    updateSearchResult(
      id: $id
      startTime: $startTime
      endTime: $endTime
      title: $title
      description: $description
      words: $words
    ) {
      id
      title
      description
      startTime
      endTime
      words {
        text
        startTime
        endTime
        speaker
      }
    }
  }
`;

const fragment = await graphql`
  fragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult
    @refetchable(queryName: "ClipEditModalRefetchQuery")
    @argumentDefinitions(
    startTime: { type: "TimecodeInMilliseconds" }
    endTime: { type: "TimecodeInMilliseconds" }
  ) {
    id
    title
    description
    startTime
    endTime
    words( startTime: $startTime, endTime: $endTime ) {
      text
      startTime
      endTime
      speaker
  }
}
`;

export function ClipEditModal(
  { setIsEditing, bfSavedSearchResult$key }: Props,
) {
  const [data, refetch] = useRefetchableFragment(
    fragment,
    bfSavedSearchResult$key,
  );

  const { isMiniModalOpen, draftClip } = useClipEditModal();

  const [
    updateSearchResultCommit,
    updateSearchResultInFlight,
  ] = useMutation(updateSearchResultMutation);

  const onSave = () => {
    updateSearchResultCommit({
      variables: {
        id: draftClip.id,
        startTime: draftClip.startTime,
        endTime: draftClip.endTime,
        title: draftClip.title,
        description: draftClip.description,
        words: draftClip.words,
      },
      onCompleted: (_response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          console.log("ERROROROROROROR", errorMessage);
        }
        setIsEditing(false);
      },
      onError: (error) => {
        console.log("ERROROROROROROR", error);
      },
    });
  };

  return (
    <>
      <BfDsModal onClose={() => setIsEditing(false)}>
        <div className="clip">
          <div className="clipInner clipContainer">
            <FeatureFlag name="placeholder">
              <div className="videoPlayer tall">
                (video player)
              </div>
            </FeatureFlag>
            <div className="clipContent">
              <div className="clipHeader">
                <div className="clipHeaderLeft">
                  <div className="clipTitle" dir="auto">
                    {draftClip.title}
                  </div>
                </div>
              </div>

              <div
                className="clipText"
                data-bf-testid="section-clip-text-editing"
                dir="auto"
              >
                {(draftClip.words ?? []).map((word) => {
                  return (
                    <ClipWord
                      word={word}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <BfDsButton
            text="Save"
            kind="primary"
            onClick={onSave}
          />
        </div>
        {isMiniModalOpen && <EditWordMiniModal />}
      </BfDsModal>
    </>
  );
}
