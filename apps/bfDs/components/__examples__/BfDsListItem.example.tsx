import * as React from "react";
import { BfDsListItem } from "../BfDsListItem.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";

export function BfDsListItemExample() {
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
}
