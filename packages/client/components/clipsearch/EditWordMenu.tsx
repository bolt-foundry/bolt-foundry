import { React } from "deps.ts";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useRef, useState } from "react";

export function EditWordMenu({ word, updateWord, handleClose }) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [newWord, setNewWord] = useState<string>(
    word.text,
  );

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewWord(e.target.value);
  };

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
    updateWord({
      ...word,
      text: newWord,
    });
  };

  return (
    <div className="miniModalBackground">
      <div className="miniModal" ref={menuRef}>
        <div style={{ fontSize: "16px" }}>
          Change <span>{`"${word.text}"`}</span> to
        </div>
        <form>
          <BfDsInput
            onChange={handleChangeWord}
            placeholder="New word"
            type="text"
            value={newWord}
            autoFocus={true}
            autoSelect={true}
          />
          <div className="miniModalButtons">
            <BfDsButton kind="outline" text="Cancel" size="medium" />
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
