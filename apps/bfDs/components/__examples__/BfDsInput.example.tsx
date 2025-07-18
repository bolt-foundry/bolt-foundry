import { useState } from "react";
import { BfDsInput } from "../BfDsInput.tsx";

export function BfDsInputExample() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("test@example.com");
  const [value3, setValue3] = useState("Valid input");

  return (
    <div className="bfds-example">
      <h2>BfDsInput Examples</h2>

      <div className="bfds-example__section">
        <h3>Standalone Mode</h3>
        <div className="bfds-example__group">
          <BfDsInput
            label="Your Name"
            placeholder="Enter your name"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText="This is a standalone input field"
          />
          <BfDsInput
            label="Email Address"
            placeholder="email@example.com"
            required
            type="email"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Input States</h3>
        <div className="bfds-example__group">
          <BfDsInput
            label="Error State"
            placeholder="Enter something"
            state="error"
            errorMessage="This field is required"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Success State"
            placeholder="Valid input"
            state="success"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            successMessage="Looks good!"
          />
          <BfDsInput
            label="Disabled State"
            placeholder="Cannot edit this"
            state="disabled"
            value="Disabled value"
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Input Types</h3>
        <div className="bfds-example__group">
          <BfDsInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Number"
            type="number"
            placeholder="Enter a number"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Date"
            type="date"
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Without Labels</h3>
        <div className="bfds-example__group">
          <BfDsInput
            placeholder="Just a placeholder"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            placeholder="With help text"
            helpText="This input has no label but includes help text"
            value=""
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
