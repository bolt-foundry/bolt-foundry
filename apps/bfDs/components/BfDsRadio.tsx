import * as React from "react";
import { BfDsForm, useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsFormSubmitButton } from "./BfDsFormSubmitButton.tsx";

export type BfDsRadioOption = {
  /** The value submitted when this option is selected */
  value: string;
  /** Display text shown for this option */
  label: string;
  /** When true, this option cannot be selected */
  disabled?: boolean;
};

export type BfDsRadioSize = "small" | "medium" | "large";

export type BfDsRadioProps = {
  // Form context props
  /** Form field name for data binding (required for radio groups) */
  name: string;

  // Standalone props
  /** Currently selected value */
  value?: string;
  /** Selection change callback */
  onChange?: (value: string) => void;

  // Common props
  /** Array of radio button options */
  options: Array<BfDsRadioOption>;
  /** Group label displayed above radio buttons */
  label?: string;
  /** Required for validation */
  required?: boolean;
  /** Disables entire radio group */
  disabled?: boolean;
  /** Layout direction of radio buttons */
  orientation?: "vertical" | "horizontal";
  /** Size variant for radio buttons */
  size?: BfDsRadioSize;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsRadio({
  name,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  className,
  orientation = "vertical",
  size = "medium",
  label,
}: BfDsRadioProps) {
  const formContext = useBfDsFormContext();
  const isInForm = !!formContext;

  // Use form context if available
  const actualValue = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name] as string || ""
    : value || "";
  const actualOnChange = isInForm
    ? (newValue: string) => {
      if (formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newValue,
        });
      }
    }
    : onChange;

  const radioGroupClasses = [
    "bfds-radio-group",
    `bfds-radio-group--${orientation}`,
    `bfds-radio-group--${size}`,
    disabled && "bfds-radio-group--disabled",
    className,
  ].filter(Boolean).join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (actualOnChange) {
      actualOnChange(e.target.value);
    }
  };

  const radioGroupContent = (
    <div className={radioGroupClasses} role="radiogroup">
      {options.map((option, index) => {
        const isChecked = actualValue === option.value;
        const isDisabled = disabled || option.disabled;
        const radioId = `${name}-${option.value}`;

        const radioClasses = [
          "bfds-radio",
          `bfds-radio--${size}`,
          isChecked && "bfds-radio--checked",
          isDisabled && "bfds-radio--disabled",
        ].filter(Boolean).join(" ");

        return (
          <label key={option.value} className="bfds-radio-wrapper">
            <input
              type="radio"
              id={radioId}
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={handleChange}
              disabled={isDisabled}
              required={required && index === 0} // Only first radio needs required for validation
              className="bfds-radio-input"
            />
            <div
              className={radioClasses}
              role="radio"
              aria-checked={isChecked}
            >
              {isChecked && <div className="bfds-radio-dot" />}
            </div>
            <span className="bfds-radio-label">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );

  if (label) {
    return (
      <fieldset className="bfds-radio-fieldset">
        <legend className="bfds-input-label">
          {label}
          {required && <span className="bfds-input-required">*</span>}
        </legend>
        {radioGroupContent}
      </fieldset>
    );
  }

  return radioGroupContent;
}

BfDsRadio.Example = function BfDsRadioExample() {
  const [standaloneValue, setStandaloneValue] = React.useState("");
  const [formData, setFormData] = React.useState({
    size: "",
    theme: "",
    plan: "",
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
          onSubmit={(data) => {
            alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
            setFormData(data);
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
};
