import type * as React from "react";
import { BfDsButton, type BfDsButtonProps } from "./BfDsButton.tsx";

export type BfDsFormSubmitButtonProps =
  & Omit<BfDsButtonProps, "type" | "onClick">
  & {
    /** Button text (defaults to "Submit") */
    text?: string;
    /** Optional click handler called before form submission */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };

export function BfDsFormSubmitButton({
  text = "Submit",
  onClick,
  children,
  ...props
}: BfDsFormSubmitButtonProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    // Call custom onClick first if provided
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);

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
