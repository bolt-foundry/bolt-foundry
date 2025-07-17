import * as React from "react";
import { BfDsButton, type BfDsButtonProps } from "./BfDsButton.tsx";
import { useCopyToClipboard } from "@bfmono/apps/boltFoundry/hooks/useCopyToClipboard.ts";

const { useState } = React;

export type BfDsCopyButtonProps = {
  /** Text to copy to clipboard */
  textToCopy: string;
  /** Button text when not copied */
  buttonText?: string;
  /** Button text when copied */
  copiedText?: string;
  /** Duration in ms to show copied state */
  copiedDuration?: number;
} & Omit<BfDsButtonProps, "onClick" | "children">;

export function BfDsCopyButton({
  textToCopy,
  buttonText = "Copy",
  copiedText = "Copied!",
  copiedDuration = 1000,
  variant = "outline",
  icon = "clipboard",
  iconOnly = true,
  ...props
}: BfDsCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copy(textToCopy);
    if (success) {
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), copiedDuration);
    }
  };

  const displayText = copied ? copiedText : buttonText;
  const displayIcon = copied ? "check" : icon;

  return (
    <BfDsButton
      {...props}
      variant={copied ? "primary" : variant}
      icon={displayIcon}
      iconOnly={iconOnly}
      onClick={handleCopy}
    >
      {!iconOnly && displayText}
    </BfDsButton>
  );
}
