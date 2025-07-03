import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsIcon } from "./BfDsIcon.tsx";

export type BfDsSelectOption = {
  /** The value submitted when this option is selected */
  value: string;
  /** Display text shown for this option */
  label: string;
  /** When true, this option cannot be selected */
  disabled?: boolean;
};

export type BfDsSelectProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Currently selected value */
  value?: string;
  /** Selection change callback */
  onChange?: (value: string) => void;

  // Common props
  /** Array of selectable options */
  options: Array<BfDsSelectOption>;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Field label */
  label?: string;
  /** Required for validation */
  required?: boolean;
  /** Disables component */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Element ID */
  id?: string;
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
