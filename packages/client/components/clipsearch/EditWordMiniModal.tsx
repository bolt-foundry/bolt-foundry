import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useRef, useState } from "react";
import { useClipEditModal } from "packages/client/contexts/ClipEditModalContext.tsx";
import useClickOutside from "packages/client/hooks/useClickOutside.ts";

export function EditWordMiniModal() {
  const {
    miniModalOnCancel,
    miniModalOnConfirm,
    selectedWord,
    setNewWordsString,
    newWordsString,
  } = useClipEditModal();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewWordsString(e.target.value);
  };

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    miniModalOnConfirm();
  };

  useClickOutside(menuRef, miniModalOnCancel, {
    isActive: true,
    showConfirmation: false,
    excludeElementIds: [],
  });

  return (
    <div className="miniModalBackground" id="mini-modal">
      <div className="miniModal" ref={menuRef}>
        <div style={{ fontSize: "16px" }}>
          Edit <span>{`"${selectedWord?.text ?? ""}"`}</span>
        </div>
        <form>
          <BfDsInput
            onChange={handleChangeWord}
            type="text"
            value={newWordsString}
            autoFocus={true}
            autoSelect={true}
          />
          <div className="miniModalButtons">
            <BfDsButton
              kind="outline"
              text="Cancel"
              size="medium"
              onClick={miniModalOnCancel}
            />
            <BfDsButton
              kind="primary"
              type="submit"
              text="Save word"
              size="medium"
              onClick={(e) => handleSubmitWord(e)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
