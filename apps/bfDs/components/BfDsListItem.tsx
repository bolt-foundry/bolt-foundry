import * as React from "react";

export type BfDsListItemProps = {
  /** Content to display in the list item */
  children: React.ReactNode;
  /** When true, shows active state styling */
  active?: boolean;
  /** When true, disables interaction and shows disabled styling */
  disabled?: boolean;
  /** Click handler - when provided, renders as button instead of li */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsListItem({
  children,
  active = false,
  disabled = false,
  onClick,
  className,
}: BfDsListItemProps) {
  const itemClasses = [
    "bfds-list-item",
    active && "bfds-list-item--active",
    disabled && "bfds-list-item--disabled",
    onClick && !disabled && "bfds-list-item--clickable",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const element = onClick && !disabled ? "button" : "li";
  const buttonProps = element === "button"
    ? {
      type: "button" as const,
      onClick: handleClick,
    }
    : {};

  return React.createElement(
    element,
    {
      className: itemClasses,
      ...buttonProps,
    },
    children,
  );
}

BfDsListItem.Example = function BfDsListItemExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h2>BfDsListItem Examples</h2>

      <div>
        <h3>Item States</h3>
        <ul className="bfds-list">
          <BfDsListItem>Normal Item</BfDsListItem>
          <BfDsListItem active>Active Item</BfDsListItem>
          <BfDsListItem disabled>Disabled Item</BfDsListItem>
        </ul>
      </div>

      <div>
        <h3>Clickable Items</h3>
        <ul className="bfds-list">
          <BfDsListItem onClick={() => alert("Clicked Item 1")}>
            Clickable Item 1
          </BfDsListItem>
          <BfDsListItem onClick={() => alert("Clicked Item 2")}>
            Clickable Item 2
          </BfDsListItem>
          <BfDsListItem onClick={() => alert("Clicked Item 3")} disabled>
            Disabled Clickable Item
          </BfDsListItem>
        </ul>
      </div>

      <div>
        <h3>Mixed Usage</h3>
        <ul className="bfds-list">
          <BfDsListItem>Static Item</BfDsListItem>
          <BfDsListItem active onClick={() => alert("Active and clickable")}>
            Active Clickable Item
          </BfDsListItem>
          <BfDsListItem onClick={() => alert("Just clickable")}>
            Clickable Item
          </BfDsListItem>
          <BfDsListItem disabled>Disabled Item</BfDsListItem>
        </ul>
      </div>
    </div>
  );
};
