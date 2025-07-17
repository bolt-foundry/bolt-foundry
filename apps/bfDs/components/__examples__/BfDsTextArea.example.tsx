import { useState } from "react";
import { BfDsTextArea } from "../BfDsTextArea.tsx";

export function BfDsTextAreaExample() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState(
    "This is some existing content in the textarea that demonstrates how it looks with text.",
  );
  const [value3, setValue3] = useState(
    "Valid content that passed validation",
  );

  return (
    <div className="bfds-example">
      <h2>BfDsTextArea Examples</h2>

      <div className="bfds-example__section">
        <h3>Standalone Mode</h3>
        <div className="bfds-example__group">
          <BfDsTextArea
            label="Your Message"
            placeholder="Enter your message here..."
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText="This is a standalone textarea field"
            rows={3}
          />
          <BfDsTextArea
            label="Description"
            placeholder="Describe your project..."
            required
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            rows={4}
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
            value=""
            onChange={() => {}}
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
            value="This content cannot be edited"
            rows={3}
            onChange={() => {}}
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
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Horizontal Resize"
            placeholder="Can be resized horizontally"
            resize="horizontal"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Vertical Resize (Default)"
            placeholder="Can be resized vertically"
            resize="vertical"
            rows={2}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Both Directions"
            placeholder="Can be resized in both directions"
            resize="both"
            rows={2}
            value=""
            onChange={() => {}}
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
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Medium (4 rows)"
            placeholder="Medium textarea"
            rows={4}
            value=""
            onChange={() => {}}
          />
          <BfDsTextArea
            label="Large (6 rows)"
            placeholder="Large textarea"
            rows={6}
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Without Label</h3>
        <BfDsTextArea
          placeholder="Just a placeholder with help text"
          helpText="This textarea has no label but includes help text"
          rows={3}
          value=""
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
