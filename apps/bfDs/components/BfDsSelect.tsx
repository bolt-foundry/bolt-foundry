import * as React from "react";
import { BfDsForm, useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsIcon } from "./BfDsIcon.tsx";
import { BfDsFormSubmitButton } from "./BfDsFormSubmitButton.tsx";

export type BfDsSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type BfDsSelectProps = {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<BfDsSelectOption>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  label?: string;
};

export function BfDsSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  required = false,
  className,
  id,
  label,
}: BfDsSelectProps) {
  const formContext = useBfDsFormContext();
  const isInForm = !!formContext;
  const selectId = id || React.useId();

  // Use form context if available
  const actualValue = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name || ""] as string ||
      ""
    : value || "";
  const actualOnChange = isInForm
    ? (newValue: string) => {
      if (name && formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newValue,
        });
      }
    }
    : onChange;

  const selectClasses = [
    "bfds-select",
    disabled && "bfds-select--disabled",
    className,
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "bfds-select-container",
    disabled && "bfds-select-container--disabled",
  ].filter(Boolean).join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (actualOnChange) {
      actualOnChange(e.target.value);
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={selectId} className="bfds-select-label">
          {label}
          {required && <span className="bfds-select-required">*</span>}
        </label>
      )}
      <div className="bfds-select-wrapper">
        <select
          id={selectId}
          name={name}
          value={actualValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <BfDsIcon
          name="triangleDown"
          size="small"
          className="bfds-select-icon"
        />
      </div>
    </div>
  );
}

BfDsSelect.Example = function BfDsSelectExample() {
  const [standaloneValue, setStandaloneValue] = React.useState("");
  const [formData, setFormData] = React.useState({
    country: "",
    size: "",
    priority: "",
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
          onSubmit={(data) => {
            alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
            setFormData(data);
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
};
