import * as React from "react";
import { BfDsLiteIcon, type BfDsLiteIconName } from "./BfDsLiteIcon.tsx";

export type BfDsLiteButtonSize = "small" | "medium" | "large";
export type BfDsLiteButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

export type BfDsLiteButtonProps = {
  children?: React.ReactNode;
  size?: BfDsLiteButtonSize;
  variant?: BfDsLiteButtonVariant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: BfDsLiteIconName | React.ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function BfDsLiteButton({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  onClick,
  className,
  icon,
  iconPosition = "left",
  iconOnly = false,
  ...props
}: BfDsLiteButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  const classes = [
    "bfds-lite-button",
    `bfds-lite-button--${variant}`,
    `bfds-lite-button--${size}`,
    iconOnly && "bfds-lite-button--icon-only",
    className,
  ].filter(Boolean).join(" ");

  // Determine icon size based on button size
  const iconSize = size === "small"
    ? "small"
    : size === "large"
    ? "large"
    : "medium";

  // Render icon element
  const iconElement = icon
    ? (
      typeof icon === "string"
        ? <BfDsLiteIcon name={icon as BfDsLiteIconName} size={iconSize} />
        : icon
    )
    : null;

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
    >
      {iconPosition === "left" && iconElement}
      {!iconOnly && children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}

BfDsLiteButton.Example = function BfDsLiteButtonExample() {
  const [clickCount, setClickCount] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-lite-background)",
        color: "var(--bfds-lite-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsLiteButton Examples</h2>

      <div>
        <h3>Variants</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsLiteButton
            variant="primary"
            onClick={() => setClickCount((c) => c + 1)}
          >
            Primary ({clickCount})
          </BfDsLiteButton>
          <BfDsLiteButton variant="secondary">Secondary</BfDsLiteButton>
          <BfDsLiteButton variant="outline">Outline</BfDsLiteButton>
          <BfDsLiteButton variant="ghost">Ghost</BfDsLiteButton>
        </div>
      </div>

      <div>
        <h3>Sizes</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsLiteButton size="small">Small</BfDsLiteButton>
          <BfDsLiteButton size="medium">Medium</BfDsLiteButton>
          <BfDsLiteButton size="large">Large</BfDsLiteButton>
        </div>
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsLiteButton disabled>Disabled</BfDsLiteButton>
          <BfDsLiteButton variant="outline" disabled>
            Disabled Outline
          </BfDsLiteButton>
        </div>
      </div>

      <div>
        <h3>Icons</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsLiteButton icon="arrowRight">Next</BfDsLiteButton>
          <BfDsLiteButton icon="arrowLeft" iconPosition="left">
            Previous
          </BfDsLiteButton>
          <BfDsLiteButton icon="brand-github" variant="outline">
            GitHub
          </BfDsLiteButton>
          <BfDsLiteButton icon="burgerMenu" variant="ghost">
            Menu
          </BfDsLiteButton>
        </div>
      </div>

      <div>
        <h3>Icon Positions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsLiteButton icon="arrowRight" iconPosition="left">
            Left Icon
          </BfDsLiteButton>
          <BfDsLiteButton icon="arrowRight" iconPosition="right">
            Right Icon
          </BfDsLiteButton>
        </div>
      </div>

      <div>
        <h3>Icon-Only Buttons</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsLiteButton icon="arrowLeft" iconOnly size="small" />
          <BfDsLiteButton icon="burgerMenu" iconOnly />
          <BfDsLiteButton icon="arrowRight" iconOnly size="large" />
          <BfDsLiteButton icon="brand-github" iconOnly variant="outline" />
          <BfDsLiteButton icon="back" iconOnly variant="ghost" />
        </div>
      </div>
    </div>
  );
};
