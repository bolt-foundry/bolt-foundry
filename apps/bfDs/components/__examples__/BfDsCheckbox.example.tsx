import * as React from "react";
import { BfDsCheckbox } from "../BfDsCheckbox.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

export function BfDsCheckboxExample() {
  const [standaloneChecked, setStandaloneChecked] = React.useState(false);
  const [formData, setFormData] = React.useState({
    terms: false,
    newsletter: false,
    notifications: false,
  });
  const [notification, setNotification] = React.useState({
    message: "",
    details: "",
    visible: false,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsCheckbox Examples</h2>

      <div>
        <h3>Standalone Checkbox</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsCheckbox
            label="I agree to the terms and conditions"
            checked={standaloneChecked}
            onChange={setStandaloneChecked}
          />
          <p>Checked: {standaloneChecked ? "Yes" : "No"}</p>
        </div>
      </div>

      <div>
        <h3>With BfDsForm Integration</h3>
        <BfDsForm
          initialData={formData}
          onSubmit={(data: unknown) => {
            setNotification({
              message: "Form submitted successfully!",
              details: JSON.stringify(data, null, 2),
              visible: true,
            });
            setFormData(data as typeof formData);
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <BfDsCheckbox
              name="terms"
              label="I agree to the terms and conditions"
              required
            />

            <BfDsCheckbox
              name="newsletter"
              label="Subscribe to newsletter"
            />

            <BfDsCheckbox
              name="notifications"
              label="Enable push notifications"
            />

            <BfDsFormSubmitButton text="Submit Form" />
          </div>
        </BfDsForm>
        <BfDsCallout
          message={notification.message}
          variant="success"
          details={notification.details}
          visible={notification.visible}
          onDismiss={() =>
            setNotification({ message: "", details: "", visible: false })}
          autoDismiss={5000}
        />
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsCheckbox
            label="Unchecked"
            checked={false}
            onChange={() => {}}
          />

          <BfDsCheckbox
            label="Checked"
            checked
            onChange={() => {}}
          />

          <BfDsCheckbox
            label="Disabled Unchecked"
            checked={false}
            disabled
            onChange={() => {}}
          />

          <BfDsCheckbox
            label="Disabled Checked"
            checked
            disabled
            onChange={() => {}}
          />

          <BfDsCheckbox
            label="Required"
            required
            onChange={() => {}}
          />

          <BfDsCheckbox
            label="No Label"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
