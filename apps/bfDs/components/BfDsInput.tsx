import type * as React from "react";
import { useId, useState } from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsInputState = "default" | "error" | "success" | "disabled";

export type BfDsInputProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Current input value (controlled) */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change event handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Common props
  /** Label text displayed above input */
  label?: string;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Required for validation */
  required?: boolean;
  /** Visual state of the input */
  state?: BfDsInputState;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Help text displayed below input */
  helpText?: string;
  /** Additional CSS classes */
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export function BfDsInput({
  name,
  value: standaloneProp,
  defaultValue,
  onChange: standaloneOnChange,
  label,
  placeholder,
  required = false,
  state = "default",
  errorMessage,
  successMessage,
  helpText,
  className,
  disabled,
  id,
  ...props
}: BfDsInputProps) {
  const formContext = useBfDsFormContext();
  const inputId = id || useId();
  const helpTextId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  // Determine if we're in form context or standalone mode
  const isInFormContext = formContext !== null && name !== undefined;
  const isControlled = standaloneProp !== undefined;

  // Get value from form context, controlled prop, or internal state
  const value = isInFormContext && formContext?.data && name
    ? (formContext.data[name as keyof typeof formContext.data] as string) ?? ""
    : isControlled
    ? standaloneProp
    : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInFormContext && formContext?.onChange && formContext?.data && name) {
      formContext.onChange({ ...formContext.data, [name]: e.target.value });
    } else if (standaloneOnChange) {
      standaloneOnChange(e);
    } else if (!isControlled) {
      // Update internal state for uncontrolled mode
      setInternalValue(e.target.value);
    }
  };

  // Get error state from form context if available
  const formError = isInFormContext && formContext?.errors && name
    ? formContext.errors[name as keyof typeof formContext.errors]
    : undefined;
  const actualErrorMessage =
    (formError as unknown as { message?: string })?.message ||
    errorMessage;
  const actualState = disabled ? "disabled" : (formError ? "error" : state);

  const classes = [
    "bfds-input",
    `bfds-input--${actualState}`,
    className,
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "bfds-input-container",
    `bfds-input-container--${actualState}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="bfds-input-label">
          {label}
          {required && <span className="bfds-input-required">*</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        name={name}
        className={classes}
        placeholder={placeholder}
        disabled={disabled || actualState === "disabled"}
        required={required}
        value={value}
        onChange={handleChange}
        aria-describedby={[
          helpText ? helpTextId : null,
          actualErrorMessage ? errorId : null,
          successMessage ? successId : null,
        ].filter(Boolean).join(" ") || undefined}
        aria-invalid={actualState === "error"}
      />
      {helpText && (
        <div id={helpTextId} className="bfds-input-help">
          {helpText}
        </div>
      )}
      {actualState === "error" && actualErrorMessage && (
        <div id={errorId} className="bfds-input-error" role="alert">
          {actualErrorMessage}
        </div>
      )}
      {actualState === "success" && successMessage && (
        <div id={successId} className="bfds-input-success">
          {successMessage}
        </div>
      )}
    </div>
  );
}
