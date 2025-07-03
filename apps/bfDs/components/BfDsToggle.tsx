import * as React from "react";
import { BfDsForm, useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsCallout } from "./BfDsCallout.tsx";
import { BfDsFormSubmitButton } from "./BfDsFormSubmitButton.tsx";

export type BfDsToggleSize = "small" | "medium" | "large";

export type BfDsToggleProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Whether the toggle is on/off */
  checked?: boolean;
  /** Callback when toggle state changes */
  onChange?: (checked: boolean) => void;

  // Common props
  /** Label text displayed next to toggle */
  label?: string;
  /** Disables component */
  disabled?: boolean;
  /** Size variant for toggle switch */
  size?: BfDsToggleSize;
  /** Additional CSS classes */
  className?: string;
  /** Element ID */
  id?: string;
};

export function BfDsToggle({
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className,
  id,
  size = "medium",
}: BfDsToggleProps) {
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

  const toggleClasses = [
    "bfds-toggle",
    `bfds-toggle--${size}`,
    actualChecked && "bfds-toggle--checked",
    disabled && "bfds-toggle--disabled",
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
    <label className="bfds-toggle-wrapper">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={actualChecked}
        onChange={handleChange}
        disabled={disabled}
        className="bfds-toggle-input"
      />
      <div
        className={toggleClasses}
        role="switch"
        aria-checked={actualChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className="bfds-toggle-track">
          <div className="bfds-toggle-thumb" />
        </div>
      </div>
      {label && (
        <span className="bfds-toggle-label">
          {label}
        </span>
      )}
    </label>
  );
}

BfDsToggle.Example = function BfDsToggleExample() {
  const [standaloneChecked, setStandaloneChecked] = React.useState(false);
  const [formData, setFormData] = React.useState({
    darkMode: false,
    notifications: false,
    autoSave: false,
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
      <h2>BfDsToggle Examples</h2>

      <div>
        <h3>Standalone Toggle</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsToggle
            label="Enable feature"
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
        <h3>Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
};
