import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
const listItems = [
  {
    title: "Movie 1",
    statusText: "processing",
    statusProgress: 65,
    organization: "Bolt Foundry",
  },
  {
    title: "Foo Fighter",
    statusProgress: 25,
    organization: "Bolt Foundry",
  },
  {
    title: "Movie 3",
    statusProgress: 97,
    organization: "Bolt Foundry",
  },
  {
    title: "Movie 4",
    statusProgress: 6,
    organization: "Bolt Foundry",
  },
];

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    padding: "20px",
  },
  listHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
};

export function InternalMediaList() {
  function renderListItems() {
    return listItems.map((item) => (
      <>
        <div style={styles.listHeader} key={item.title}>
          <div style={{ flex: 2, display: "flex", alignItems: "center" }}>
            <p style={{ flex: 1 }}>{item.title}</p>
            <Progress size={24} progress={item.statusProgress} />
          </div>
          <p style={{ flex: 1, marginLeft: "10px" }}>
            {item.organization}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flex: 2,
            }}
          >
            <Button
              kind="secondary"
              role="button"
              iconLeft="downloadSolid"
            />
            <Button
              kind="secondary"
              role="button"
              iconLeft="plus"
            />
            <Button kind="secondary" iconLeft="settings" />
          </div>
        </div>
        <hr style={{ color: "#E0E0E0", width: "100%" }} />
      </>
    ));
  }

  return (
    <div style={styles.container}>
      <div style={styles.listHeader}>
        <p style={{ flex: 3 }}>Title</p>
        <p style={{ flex: 1.5 }}>Organization</p>
        <p style={{ flex: 1.5 }}>Files</p>
        <p style={{ flex: 1.5 }}>Project</p>
      </div>
      <hr style={{ color: "#E0E0E0", width: "100%" }} />
      {renderListItems()}
    </div>
  );
}
