import { useState } from "react";
import { BfDsRadio, type BfDsRadioOption } from "../BfDsRadio.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

export function BfDsRadioExample() {
  const [standaloneValue, setStandaloneValue] = useState("");
  const [formData, setFormData] = useState({
    size: "",
    theme: "",
    plan: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    details: "",
    visible: false,
  });

  const sizeOptions: Array<BfDsRadioOption> = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const themeOptions: Array<BfDsRadioOption> = [
    { value: "light", label: "Light Theme" },
    { value: "dark", label: "Dark Theme" },
    { value: "auto", label: "Auto (System)" },
  ];

  const planOptions: Array<BfDsRadioOption> = [
    { value: "free", label: "Free Plan" },
    { value: "pro", label: "Pro Plan" },
    { value: "enterprise", label: "Enterprise Plan" },
    { value: "beta", label: "Beta Plan", disabled: true },
  ];

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
      <h2>BfDsRadio Examples</h2>

      <div>
        <h3>Standalone Radio Group</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsRadio
            name="standalone-size"
            label="Size Selection"
            options={sizeOptions}
            value={standaloneValue}
            onChange={setStandaloneValue}
            required
          />
          <p>Selected: {standaloneValue || "None"}</p>
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
            <BfDsRadio
              name="size"
              label="Size"
              options={sizeOptions}
              required
            />

            <BfDsRadio
              name="theme"
              label="Theme"
              options={themeOptions}
              orientation="horizontal"
            />

            <BfDsRadio
              name="plan"
              label="Plan"
              options={planOptions}
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
        <h3>Orientations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <BfDsRadio
            name="vertical-example"
            label="Vertical Layout (default)"
            options={themeOptions}
            orientation="vertical"
          />

          <BfDsRadio
            name="horizontal-example"
            label="Horizontal Layout"
            options={themeOptions}
            orientation="horizontal"
          />
        </div>
      </div>

      <div>
        <h3>Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <BfDsRadio
            name="small-example"
            label="Small Size"
            options={[{ value: "small", label: "Small" }]}
            size="small"
          />
          <BfDsRadio
            name="medium-example"
            label="Medium Size"
            options={[{ value: "medium", label: "Medium" }]}
            size="medium"
          />
          <BfDsRadio
            name="large-example"
            label="Large Size"
            options={[{ value: "large", label: "Large" }]}
            size="large"
          />
        </div>
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsRadio
            name="disabled-example"
            label="Disabled Group"
            options={sizeOptions}
            disabled
          />

          <BfDsRadio
            name="mixed-disabled-example"
            label="Mixed Disabled Options"
            options={planOptions}
          />
        </div>
      </div>
    </div>
  );
}
