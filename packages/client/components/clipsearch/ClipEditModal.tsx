import type { React } from "packages/logger/logger.ts";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useRefetchableFragment } from "react-relay";
import { graphql } from "packages/client/deps.ts";
import { ClipWord } from "packages/client/components/clipsearch/ClipWord.tsx";
import type { ClipEditModal_bfSavedSearchResult$key } from "packages/__generated__/ClipEditModal_bfSavedSearchResult.graphql.ts";
import { useClipEditModal } from "packages/client/contexts/ClipEditModalContext.tsx";
import { useState } from "react";
import type { Word } from "packages/types/transcript.ts";
import { EditWordMiniModal } from "packages/client/components/clipsearch/EditWordMiniModal.tsx";
import { createPortal } from "react-dom";

type Props = {
  setIsEditing: (isEditing: boolean) => void;
  bfSavedSearchResult$key: ClipEditModal_bfSavedSearchResult$key;
};

const fragment = await graphql`
  fragment ClipEditModal_bfSavedSearchResult on BfSavedSearchResult
    @refetchable(queryName: "ClipEditModalRefetchQuery")
    @argumentDefinitions(
    startTime: { type: "TimecodeInMilliseconds" }
    endTime: { type: "TimecodeInMilliseconds" }
  ) {
    id
    title
    startTime
    endTime
    duration
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
            onClick={() => {
              setIsEditing(false);
            }}
          />
        </div>
        {isMiniModalOpen && <EditWordMiniModal />}
      </BfDsModal>
    </>
  );
}
