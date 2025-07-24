import { useState } from "react";
import { BfDsTextArea } from "../BfDsTextArea.tsx";

export function BfDsTextAreaExample() {
  const [value1, setValue1] = useState("");
  const [value3, setValue3] = useState(
    "Valid content that passed validation",
  );

  return (
    <div className="bfds-example">
      <h2>BfDsTextArea Examples</h2>

      <div className="bfds-example__section">
        <h3>Controlled vs Uncontrolled</h3>
        <div className="bfds-example__group">
          <BfDsTextArea
            label="Controlled TextArea"
            placeholder="Enter your message here..."
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText={`Character count: ${value1.length}`}
            rows={3}
          />
          <BfDsTextArea
            label="Uncontrolled TextArea"
            placeholder="Manages its own state"
            defaultValue="Initial content"
            helpText="This textarea manages its own state internally"
            rows={3}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>TextArea States</h3>
        <div className="bfds-example__group">
          <BfDsTextArea
            label="Error State"
            placeholder="Enter some content"
            state="error"
            errorMessage="Content is too short"
            rows={3}
            defaultValue=""
          />
          <BfDsTextArea
            label="Success State"
            placeholder="Valid content"
            state="success"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            successMessage="Content looks great!"
            rows={3}
          />
          <BfDsTextArea
            label="Disabled State"
            placeholder="Cannot edit this"
            state="disabled"
            defaultValue="This content cannot be edited"
            rows={3}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Resize Options</h3>
        <div className="bfds-example__group">
          <BfDsTextArea
            label="No Resize"
            placeholder="Cannot be resized"
            resize="none"
            rows={2}
            defaultValue=""
          />
          <BfDsTextArea
            label="Horizontal Resize"
            placeholder="Can be resized horizontally"
            resize="horizontal"
            rows={2}
            defaultValue=""
          />
          <BfDsTextArea
            label="Vertical Resize (Default)"
            placeholder="Can be resized vertically"
            resize="vertical"
            rows={2}
            defaultValue=""
          />
          <BfDsTextArea
            label="Both Directions"
            placeholder="Can be resized in both directions"
            resize="both"
            rows={2}
            defaultValue=""
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Different Sizes</h3>
        <div className="bfds-example__group">
          <BfDsTextArea
            label="Small (2 rows)"
            placeholder="Small textarea"
            rows={2}
            defaultValue=""
          />
          <BfDsTextArea
            label="Medium (4 rows)"
            placeholder="Medium textarea"
            rows={4}
            defaultValue=""
          />
          <BfDsTextArea
            label="Large (6 rows)"
            placeholder="Large textarea"
            rows={6}
            defaultValue=""
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Without Label</h3>
        <BfDsTextArea
          placeholder="Just a placeholder with help text"
          helpText="This textarea has no label but includes help text"
          rows={3}
          defaultValue=""
        />
      </div>
    </div>
  );
}
