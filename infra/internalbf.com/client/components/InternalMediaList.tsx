import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";
import { Button } from "packages/bfDs/Button.tsx";
const listItems = [
  {
    title: "Movie 1",
    organization: "Bolt Foundry",
  },
  {
    title: "Foo Fighter",
    organization: "Bolt Foundry",
  },
  {
    title: "Movie 3",
    organization: "Bolt Foundry",
  },
  {
    title: "Movie 4",
    organization: "Bolt Foundry",
  },
];
const styles = {
  container: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    background: "#F2F2F2",
    margin: "auto",
    borderRadius: "15px",
    padding: "20px",
  },
  listHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
};

export function InternalMediaList() {
  function renderListItems() {
    return listItems.map((item) => (
      <>
        <div style={styles.listHeader} key={item.title}>
          <p style={{ flex: 2 }}>{item.title}</p>
          <Progress />
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
