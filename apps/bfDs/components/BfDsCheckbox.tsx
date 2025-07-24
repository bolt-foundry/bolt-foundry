import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";
import { BfDsIcon } from "./BfDsIcon.tsx";

export type BfDsCheckboxProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
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
  defaultChecked,
  onChange,
  label,
  disabled = false,
  required = false,
  className,
  id,
}: BfDsCheckboxProps) {
  const formContext = useBfDsFormContext();
  const isInForm = !!formContext;

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false,
  );

  // Determine control mode
  const isControlled = checked !== undefined;

  // Get actual checked state from form context, controlled prop, or internal state
  const actualChecked = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name || ""] === true
    : isControlled
    ? checked
    : internalChecked;

  const actualOnChange = isInForm
    ? (newChecked: boolean) => {
      if (name && formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newChecked,
        });
      }
    }
    : (newChecked: boolean) => {
      onChange?.(newChecked);
      if (!isControlled) {
        // Update internal state for uncontrolled mode
        setInternalChecked(newChecked);
      }
    };

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
