import { BfDsTextArea } from "apps/bfDs/components/BfDsTextArea.tsx";
import { useState } from "react";

export function TextEditor() {
  const [textValue, setTextValue] = useState("");
  return (
    <div className="flexColumn text-editor">
      <BfDsTextArea
        placeholder="put your text here"
        value={textValue}
        onChange={(event) => {
          setTextValue(event.target.value);
        }}
      />
    </div>
  );
}
