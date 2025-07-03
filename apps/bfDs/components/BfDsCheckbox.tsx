import type * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsIcon } from "./BfDsIcon.tsx";

export type BfDsCheckboxProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Callback when check state changes */
  onChange?: (checked: boolean) => void;

  // Common props
  /** Label text displayed next to checkbox */
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
