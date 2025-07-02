import * as React from "react";
import { BfDsForm, useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsIcon } from "./BfDsIcon.tsx";
import { BfDsFormSubmitButton } from "./BfDsFormSubmitButton.tsx";

export type BfDsCheckboxProps = {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
};

export function BfDsCheckbox({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  className,
  id,
}: BfDsCheckboxProps) {
  const formContext = useBfDsFormContext();
  const isInForm = !!formContext;

  // Use form context if available
  const actualChecked = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name || ""] === true
    : checked || false;
  const actualOnChange = isInForm
    ? (newChecked: boolean) => {
      if (name && formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newChecked,
        });
      }
    }
    : onChange;

  const checkboxClasses = [
    "bfds-checkbox",
    actualChecked && "bfds-checkbox--checked",
    disabled && "bfds-checkbox--disabled",
    className,
  ].filter(Boolean).join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (actualOnChange) {
      actualOnChange(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (actualOnChange && !disabled) {
        actualOnChange(!actualChecked);
      }
    }
  };

  return (
    <label className="bfds-checkbox-wrapper">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={actualChecked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="bfds-checkbox-input"
      />
      <div
        className={checkboxClasses}
        role="checkbox"
        aria-checked={actualChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {actualChecked && (
          <BfDsIcon
            name="check"
            size="small"
            className="bfds-checkbox-icon"
          />
        )}
      </div>
      {label && (
        <span className="bfds-checkbox-label">
          {label}
          {required && <span className="bfds-checkbox-required">*</span>}
        </span>
      )}
    </label>
  );
}

BfDsCheckbox.Example = function BfDsCheckboxExample() {
  const [standaloneChecked, setStandaloneChecked] = React.useState(false);
  const [formData, setFormData] = React.useState({
    terms: false,
    newsletter: false,
    notifications: false,
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
          onSubmit={(data) => {
            alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
            setFormData(data);
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
};
