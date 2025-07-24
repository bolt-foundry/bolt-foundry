import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsTextAreaState = "default" | "error" | "success" | "disabled";

export type BfDsTextAreaProps =
  & {
    // Form context props
    /** Form field name for data binding */
    name?: string;

    // Standalone props
    /** Current textarea value (controlled) */
    value?: string;
    /** Default value for uncontrolled usage */
    defaultValue?: string;
    /** Change event handler */
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    // Common props
    /** Label text displayed above textarea */
    label?: string;
    /** Placeholder text when empty */
    placeholder?: string;
    /** Required for validation */
    required?: boolean;
    /** Visual state of the textarea */
    state?: BfDsTextAreaState;
    /** Error message to display */
    errorMessage?: string;
    /** Success message to display */
    successMessage?: string;
    /** Help text displayed below textarea */
    helpText?: string;
    /** Additional CSS classes */
    className?: string;
    /** Resize behavior for textarea */
    resize?: "none" | "both" | "horizontal" | "vertical";
  }
  & Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  >;

export function BfDsTextArea({
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
  resize = "vertical",
  ...props
}: BfDsTextAreaProps) {
  const formContext = useBfDsFormContext();
  const textAreaId = id || React.useId();
  const helpTextId = `${textAreaId}-help`;
  const errorId = `${textAreaId}-error`;
  const successId = `${textAreaId}-success`;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

  // Determine if we're in form context or standalone mode
  const isInFormContext = formContext !== null && name !== undefined;
  const isControlled = standaloneProp !== undefined;

  // Get value from form context, controlled prop, or internal state
  const value = isInFormContext && formContext?.data && name
    ? (formContext.data[name as keyof typeof formContext.data] as string) ?? ""
    : isControlled
    ? standaloneProp
    : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    "bfds-textarea",
    `bfds-textarea--${actualState}`,
    `bfds-textarea--resize-${resize}`,
    className,
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "bfds-textarea-container",
    `bfds-textarea-container--${actualState}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={textAreaId} className="bfds-textarea-label">
          {label}
          {required && <span className="bfds-textarea-required">*</span>}
        </label>
      )}
      <textarea
        {...props}
        id={textAreaId}
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
        <div id={helpTextId} className="bfds-textarea-help">
          {helpText}
        </div>
      )}
      {actualState === "error" && actualErrorMessage && (
        <div id={errorId} className="bfds-textarea-error" role="alert">
          {actualErrorMessage}
        </div>
      )}
      {actualState === "success" && successMessage && (
        <div id={successId} className="bfds-textarea-success">
          {successMessage}
        </div>
      )}
    </div>
  );
}
