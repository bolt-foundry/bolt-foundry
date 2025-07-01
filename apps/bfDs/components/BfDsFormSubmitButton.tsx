import type * as React from "react";
import { BfDsButton, type BfDsButtonProps } from "./BfDsButton.tsx";

export type BfDsFormSubmitButtonProps =
  & Omit<BfDsButtonProps, "type" | "onClick">
  & {
    text?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };

export function BfDsFormSubmitButton({
  text = "Submit",
  onClick,
  children,
  ...props
}: BfDsFormSubmitButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call custom onClick first if provided
    onClick?.(e);

    // Let the form handle submission if we're in form context
    // The form's onSubmit will be called automatically by the form element
  };

  return (
    <BfDsButton
      {...props}
      type="submit"
      onClick={handleClick}
    >
      {children || text}
    </BfDsButton>
  );
}

BfDsFormSubmitButton.Example = function BfDsFormSubmitButtonExample() {
  const handleStandaloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("Standalone submit button clicked!");
  };

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
      <h2>BfDsFormSubmitButton Examples</h2>

      <div>
        <h3>Standalone Mode</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsFormSubmitButton
            text="Submit Form"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Save"
            variant="secondary"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            variant="outline"
            onClick={handleStandaloneClick}
          >
            Custom Content
          </BfDsFormSubmitButton>
        </div>
      </div>

      <div>
        <h3>Different Variants</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsFormSubmitButton
            text="Primary Submit"
            variant="primary"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Secondary Submit"
            variant="secondary"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Outline Submit"
            variant="outline"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Ghost Submit"
            variant="ghost"
            onClick={handleStandaloneClick}
          />
        </div>
      </div>

      <div>
        <h3>Different Sizes</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsFormSubmitButton
            text="Small"
            size="small"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Medium"
            size="medium"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Large"
            size="large"
            onClick={handleStandaloneClick}
          />
        </div>
      </div>

      <div>
        <h3>With Icons</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsFormSubmitButton
            text="Save"
            icon="checkmark"
            onClick={handleStandaloneClick}
          />
          <BfDsFormSubmitButton
            text="Send"
            icon="arrowRight"
            iconPosition="right"
            onClick={handleStandaloneClick}
          />
        </div>
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsFormSubmitButton
            text="Disabled"
            disabled
            onClick={handleStandaloneClick}
          />
        </div>
      </div>

      <p>
        <strong>Note:</strong>{" "}
        Form context integration will be demonstrated in the BfDsForm examples
        once complete.
      </p>
    </div>
  );
};
