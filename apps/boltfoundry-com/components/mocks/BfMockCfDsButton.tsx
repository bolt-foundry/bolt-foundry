import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import type { ReactNode } from "react";

type BfMockCfDsButtonProps = {
  kind?: "dan" | "danSelected" | "danDim" | "outline";
  size?: "small" | "medium" | "large";
  text?: string;
  iconLeft?: string;
  href?: string;
  hrefTarget?: string;
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  "aria-label"?: string;
};

export function BfMockCfDsButton({
  kind = "dan",
  size = "medium",
  text,
  iconLeft,
  href,
  hrefTarget,
  rel,
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
}: BfMockCfDsButtonProps) {
  // Map CfDs kinds to BfDs variants
  const variantMap = {
    dan: "primary",
    danSelected: "primary",
    danDim: "secondary",
    outline: "outline",
  } as const;

  const variant = variantMap[kind] || "primary";

  if (href) {
    return (
      <BfDsButton
        variant={variant}
        size={size}
        href={href}
        target={hrefTarget}
        rel={rel}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {iconLeft && <span className={`icon-${iconLeft}`} />}
        {text || children}
      </BfDsButton>
    );
  }

  return (
    <BfDsButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {iconLeft && <span className={`icon-${iconLeft}`} />}
      {text || children}
    </BfDsButton>
  );
}
