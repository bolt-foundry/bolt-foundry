import * as React from "react";
import { BfDsIcon, type BfDsIconName } from "./BfDsIcon.tsx";

export type BfDsButtonSize = "small" | "medium" | "large";
export type BfDsButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

export type BfDsButtonProps = {
  children?: React.ReactNode;
  size?: BfDsButtonSize;
  variant?: BfDsButtonVariant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: BfDsIconName | React.ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function BfDsButton({
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
}: BfDsButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  const classes = [
    "bfds-button",
    `bfds-button--${variant}`,
    `bfds-button--${size}`,
    iconOnly && "bfds-button--icon-only",
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
        ? <BfDsIcon name={icon as BfDsIconName} size={iconSize} />
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

BfDsButton.Example = function BfDsButtonExample() {
  const [clickCount, setClickCount] = React.useState(0);

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
      }}
    >
      <h2>BfDsButton Examples</h2>

      <div>
        <h3>Variants</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton
            variant="primary"
            onClick={() => setClickCount((c) => c + 1)}
          >
            Primary ({clickCount})
          </BfDsButton>
          <BfDsButton variant="secondary">Secondary</BfDsButton>
          <BfDsButton variant="outline">Outline</BfDsButton>
          <BfDsButton variant="ghost">Ghost</BfDsButton>
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
          <BfDsButton size="small">Small</BfDsButton>
          <BfDsButton size="medium">Medium</BfDsButton>
          <BfDsButton size="large">Large</BfDsButton>
        </div>
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton disabled>Disabled</BfDsButton>
          <BfDsButton variant="outline" disabled>
            Disabled Outline
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Icons</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton icon="arrowRight">Next</BfDsButton>
          <BfDsButton icon="arrowLeft" iconPosition="left">
            Previous
          </BfDsButton>
          <BfDsButton icon="brand-github" variant="outline">
            GitHub
          </BfDsButton>
          <BfDsButton icon="burgerMenu" variant="ghost">
            Menu
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Icon Positions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton icon="arrowRight" iconPosition="left">
            Left Icon
          </BfDsButton>
          <BfDsButton icon="arrowRight" iconPosition="right">
            Right Icon
          </BfDsButton>
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
          <BfDsButton icon="arrowLeft" iconOnly size="small" />
          <BfDsButton icon="burgerMenu" iconOnly />
          <BfDsButton icon="arrowRight" iconOnly size="large" />
          <BfDsButton icon="brand-github" iconOnly variant="outline" />
          <BfDsButton icon="back" iconOnly variant="ghost" />
        </div>
      </div>
    </div>
  );
};
