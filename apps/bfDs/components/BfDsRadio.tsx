import type * as React from "react";
import { useState } from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

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
  /** Currently selected value (controlled) */
  value?: string;
  /** Default selected value for uncontrolled usage */
  defaultValue?: string;
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
  defaultValue,
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

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  // Determine control mode
  const isControlled = value !== undefined;

  // Get actual value from form context, controlled prop, or internal state
  const actualValue = isInForm
    ? (formContext.data as Record<string, unknown>)?.[name] as string || ""
    : isControlled
    ? value
    : internalValue;

  const actualOnChange = isInForm
    ? (newValue: string) => {
      if (formContext.onChange && formContext.data) {
        formContext.onChange({
          ...(formContext.data as Record<string, unknown>),
          [name]: newValue,
        });
      }
    }
    : (newValue: string) => {
      onChange?.(newValue);
      if (!isControlled) {
        // Update internal state for uncontrolled mode
        setInternalValue(newValue);
      }
    };

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
