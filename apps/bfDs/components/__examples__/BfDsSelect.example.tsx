import { useState } from "react";
import { BfDsSelect, type BfDsSelectOption } from "../BfDsSelect.tsx";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

export function BfDsSelectExample() {
  const [standaloneValue, setStandaloneValue] = useState("");
  const [formData, setFormData] = useState({
    country: "",
    size: "",
    priority: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    details: "",
    visible: false,
  });

  const countryOptions: Array<BfDsSelectOption> = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ];

  const sizeOptions: Array<BfDsSelectOption> = [
    { value: "xs", label: "Extra Small" },
    { value: "s", label: "Small" },
    { value: "m", label: "Medium" },
    { value: "l", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ];

  const priorityOptions: Array<BfDsSelectOption> = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent", disabled: true },
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
      <h2>BfDsSelect Examples</h2>

      <div>
        <h3>Standalone Select</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsSelect
            label="Country"
            options={countryOptions}
            value={standaloneValue}
            onChange={setStandaloneValue}
            placeholder="Choose a country"
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
            <BfDsSelect
              name="country"
              label="Country"
              options={countryOptions}
              placeholder="Select country"
              required
            />

            <BfDsSelect
              name="size"
              label="Size"
              options={sizeOptions}
              placeholder="Select size"
            />

            <BfDsSelect
              name="priority"
              label="Priority"
              options={priorityOptions}
              placeholder="Select priority"
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
          <BfDsSelect
            label="Disabled"
            options={countryOptions}
            placeholder="This is disabled"
            disabled
          />

          <BfDsSelect
            label="Required"
            options={countryOptions}
            placeholder="This is required"
            required
          />

          <BfDsSelect
            label="With Disabled Options"
            options={priorityOptions}
            placeholder="Some options disabled"
          />
        </div>
      </div>
    </div>
  );
}
