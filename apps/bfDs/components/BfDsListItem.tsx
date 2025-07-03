import * as React from "react";
import { BfDsCallout } from "./BfDsCallout.tsx";

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
  const [notification, setNotification] = React.useState({
    message: "",
    visible: false,
  });
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
          <BfDsListItem
            onClick={() =>
              setNotification({ message: "Clicked Item 1", visible: true })}
          >
            Clickable Item 1
          </BfDsListItem>
          <BfDsListItem
            onClick={() =>
              setNotification({ message: "Clicked Item 2", visible: true })}
          >
            Clickable Item 2
          </BfDsListItem>
          <BfDsListItem
            onClick={() =>
              setNotification({ message: "Clicked Item 3", visible: true })}
            disabled
          >
            Disabled Clickable Item
          </BfDsListItem>
        </ul>
      </div>

      <div>
        <h3>Mixed Usage</h3>
        <ul className="bfds-list">
          <BfDsListItem>Static Item</BfDsListItem>
          <BfDsListItem
            active
            onClick={() =>
              setNotification({
                message: "Active and clickable",
                visible: true,
              })}
          >
            Active Clickable Item
          </BfDsListItem>
          <BfDsListItem
            onClick={() =>
              setNotification({ message: "Just clickable", visible: true })}
          >
            Clickable Item
          </BfDsListItem>
          <BfDsListItem disabled>Disabled Item</BfDsListItem>
        </ul>
      </div>
      <BfDsCallout
        message={notification.message}
        variant="info"
        visible={notification.visible}
        onDismiss={() => setNotification({ message: "", visible: false })}
        autoDismiss={3000}
      />
    </div>
  );
};
