import { useState } from "react";
import { BfDsCheckbox } from "../BfDsCheckbox.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

export function BfDsCheckboxExample() {
  const [standaloneChecked, setStandaloneChecked] = useState(false);
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: false,
    notifications: false,
  });
  const [notification, setNotification] = useState({
    message: "",
    details: "",
    visible: false,
  });

  return (
    <div className="bfds-example">
      <h2>BfDsCheckbox Examples</h2>

      <div className="bfds-example__section">
        <h3>Standalone Checkbox</h3>
        <div className="bfds-example__group">
          <BfDsCheckbox
            label="I agree to the terms and conditions"
            checked={standaloneChecked}
            onChange={setStandaloneChecked}
          />
          <p>Checked: {standaloneChecked ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="bfds-example__section">
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
          <div className="bfds-example__group">
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
          variant="success"
          details={notification.details}
          visible={notification.visible}
          onDismiss={() =>
            setNotification({ message: "", details: "", visible: false })}
          autoDismiss={5000}
        >
          {notification.message}
        </BfDsCallout>
      </div>

      <div className="bfds-example__section">
        <h3>States</h3>
        <div className="bfds-example__group">
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
