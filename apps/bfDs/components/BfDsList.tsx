import * as React from "react";

type BfDsListProps = {
  /** List items (typically BfDsListItem components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsList({ children, className }: BfDsListProps) {
  const listClasses = [
    "bfds-list",
    className,
  ].filter(Boolean).join(" ");

  return (
    <ul className={listClasses}>
      {children}
    </ul>
  );
}

BfDsList.Example = function BfDsListExample() {
  const BfDsListItem = React.lazy(() =>
    import("./BfDsListItem.tsx").then((m) => ({ default: m.BfDsListItem }))
  );

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
        <React.Suspense fallback={<div>Loading...</div>}>
          <BfDsList>
            <BfDsListItem>Home</BfDsListItem>
            <BfDsListItem>About</BfDsListItem>
            <BfDsListItem>Services</BfDsListItem>
            <BfDsListItem>Contact</BfDsListItem>
          </BfDsList>
        </React.Suspense>
      </div>

      <div>
        <h3>Navigation List</h3>
        <React.Suspense fallback={<div>Loading...</div>}>
          <BfDsList>
            <BfDsListItem active>Dashboard</BfDsListItem>
            <BfDsListItem>Projects</BfDsListItem>
            <BfDsListItem>Team</BfDsListItem>
            <BfDsListItem disabled>Settings</BfDsListItem>
          </BfDsList>
        </React.Suspense>
      </div>

      <div>
        <h3>Clickable List</h3>
        <React.Suspense fallback={<div>Loading...</div>}>
          <BfDsList>
            <BfDsListItem onClick={() => alert("Clicked Item 1")}>
              Clickable Item 1
            </BfDsListItem>
            <BfDsListItem onClick={() => alert("Clicked Item 2")}>
              Clickable Item 2
            </BfDsListItem>
            <BfDsListItem onClick={() => alert("Clicked Item 3")}>
              Clickable Item 3
            </BfDsListItem>
          </BfDsList>
        </React.Suspense>
      </div>
    </div>
  );
};
