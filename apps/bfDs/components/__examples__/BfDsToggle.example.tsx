import { useState } from "react";
import { BfDsToggle } from "../BfDsToggle.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

export function BfDsToggleExample() {
  const [standaloneChecked, setStandaloneChecked] = useState(false);
  const [formData, setFormData] = useState({
    darkMode: false,
    notifications: false,
    autoSave: false,
  });
  const [notification, setNotification] = useState({
    message: "",
    details: "",
    visible: false,
  });

  return (
    <div className="bfds-example">
      <h2>BfDsToggle Examples</h2>

      <div className="bfds-example__section">
        <h3>Standalone Toggle</h3>
        <div className="bfds-example__group">
          <BfDsToggle
            label="Enable feature"
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
          onSubmit={(data) => {
            setNotification({
              message: "Form submitted successfully!",
              details: JSON.stringify(data, null, 2),
              visible: true,
            });
            setFormData(data as typeof formData);
          }}
        >
          <div className="bfds-example__group">
            <BfDsToggle
              name="darkMode"
              label="Dark mode"
            />

            <BfDsToggle
              name="notifications"
              label="Push notifications"
            />

            <BfDsToggle
              name="autoSave"
              label="Auto-save documents"
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
        <h3>Sizes</h3>
        <div className="bfds-example__group">
          <BfDsToggle
            label="Small toggle"
            size="small"
            checked
            onChange={() => {}}
          />

          <BfDsToggle
            label="Medium toggle (default)"
            size="medium"
            checked
            onChange={() => {}}
          />

          <BfDsToggle
            label="Large toggle"
            size="large"
            checked
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bfds-example__section">
        <h3>States</h3>
        <div className="bfds-example__group">
          <BfDsToggle
            label="Unchecked"
            checked={false}
            onChange={() => {}}
          />

          <BfDsToggle
            label="Checked"
            checked
            onChange={() => {}}
          />

          <BfDsToggle
            label="Disabled Unchecked"
            checked={false}
            disabled
            onChange={() => {}}
          />

          <BfDsToggle
            label="Disabled Checked"
            checked
            disabled
            onChange={() => {}}
          />

          <BfDsToggle label="Without onChange Handler" />

          <BfDsToggle
            label="No Label"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
