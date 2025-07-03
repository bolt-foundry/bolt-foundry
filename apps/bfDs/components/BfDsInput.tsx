import * as React from "react";
import { useBfDsFormContext } from "./BfDsForm.tsx";

export type BfDsInputState = "default" | "error" | "success" | "disabled";

export type BfDsInputProps = {
  // Form context props
  /** Form field name for data binding */
  name?: string;

  // Standalone props
  /** Current input value */
  value?: string;
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
  const inputId = id || React.useId();
  const helpTextId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  // Determine if we're in form context or standalone mode
  const isInFormContext = formContext !== null && name !== undefined;

  // Get value and onChange from form context or standalone props
  const value = isInFormContext && formContext?.data && name
    ? (formContext.data[name as keyof typeof formContext.data] as string) ?? ""
    : standaloneProp ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInFormContext && formContext?.onChange && formContext?.data && name) {
      formContext.onChange({ ...formContext.data, [name]: e.target.value });
    } else if (standaloneOnChange) {
      standaloneOnChange(e);
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

BfDsInput.Example = function BfDsInputExample() {
  const [value1, setValue1] = React.useState("");
  const [value2, setValue2] = React.useState("test@example.com");
  const [value3, setValue3] = React.useState("Valid input");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsInput Examples</h2>

      <div>
        <h3>Standalone Mode</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsInput
            label="Your Name"
            placeholder="Enter your name"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            helpText="This is a standalone input field"
          />
          <BfDsInput
            label="Email Address"
            placeholder="email@example.com"
            required
            type="email"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3>Input States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsInput
            label="Error State"
            placeholder="Enter something"
            state="error"
            errorMessage="This field is required"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Success State"
            placeholder="Valid input"
            state="success"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            successMessage="Looks good!"
          />
          <BfDsInput
            label="Disabled State"
            placeholder="Cannot edit this"
            state="disabled"
            value="Disabled value"
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3>Input Types</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Number"
            type="number"
            placeholder="Enter a number"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            label="Date"
            type="date"
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3>Without Labels</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BfDsInput
            placeholder="Just a placeholder"
            value=""
            onChange={() => {}}
          />
          <BfDsInput
            placeholder="With help text"
            helpText="This input has no label but includes help text"
            value=""
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
