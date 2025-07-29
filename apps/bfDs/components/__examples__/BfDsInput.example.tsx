import { useState } from "react";
import { BfDsInput } from "../BfDsInput.tsx";

export function BfDsInputExample() {
  const [value1, setValue1] = useState("");
  const [value3, setValue3] = useState("Valid input");

  return (
    <div className="bfds-example">
      <h2>BfDsInput Examples</h2>

      <div className="bfds-example__section">
        <h3>Controlled vs Uncontrolled</h3>
        <div className="bfds-example__group">
          <BfDsInput
            label="Controlled Input"
            placeholder="Enter your name"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText={`Current value: "${value1}"`}
          />
          <BfDsInput
            label="Uncontrolled Input"
            placeholder="Manages its own state"
            defaultValue="Initial value"
            helpText="This input manages its own state internally"
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
            defaultValue=""
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
            defaultValue="Disabled value"
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
            defaultValue=""
          />
          <BfDsInput
            label="Number"
            type="number"
            placeholder="Enter a number"
            defaultValue=""
          />
          <BfDsInput
            label="Date"
            type="date"
            defaultValue=""
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>Without Labels</h3>
        <div className="bfds-example__group">
          <BfDsInput
            placeholder="Just a placeholder"
            defaultValue=""
          />
          <BfDsInput
            placeholder="With help text"
            helpText="This input has no label but includes help text"
            defaultValue=""
          />
        </div>
      </div>
    </div>
  );
}
