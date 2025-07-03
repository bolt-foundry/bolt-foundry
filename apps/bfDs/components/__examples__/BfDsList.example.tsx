import * as React from "react";
import { BfDsList } from "../BfDsList.tsx";
import { BfDsListItem } from "../BfDsListItem.tsx";
import { BfDsCallout } from "../BfDsCallout.tsx";

export function BfDsListExample() {
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
      <h2>BfDsList Examples</h2>

      <div>
        <h3>Simple List</h3>
        <BfDsList>
          <BfDsListItem>Home</BfDsListItem>
          <BfDsListItem>About</BfDsListItem>
          <BfDsListItem>Services</BfDsListItem>
          <BfDsListItem>Contact</BfDsListItem>
        </BfDsList>
      </div>

      <div>
        <h3>Navigation List</h3>
        <BfDsList>
          <BfDsListItem active>Dashboard</BfDsListItem>
          <BfDsListItem>Projects</BfDsListItem>
          <BfDsListItem>Team</BfDsListItem>
          <BfDsListItem disabled>Settings</BfDsListItem>
        </BfDsList>
      </div>

      <div>
        <h3>Clickable List</h3>
        <BfDsList>
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
          >
            Clickable Item 3
          </BfDsListItem>
        </BfDsList>
        <BfDsCallout
          message={notification.message}
          variant="info"
          visible={notification.visible}
          onDismiss={() => setNotification({ message: "", visible: false })}
          autoDismiss={3000}
        />
      </div>
    </div>
  );
}
