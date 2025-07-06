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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsTextArea Examples</h2>

      <div>
        <h3>Standalone Mode</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div>
        <h3>TextArea States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div>
        <h3>Resize Options</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div>
        <h3>Different Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div>
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
