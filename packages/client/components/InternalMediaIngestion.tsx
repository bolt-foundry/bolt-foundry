import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { GoogleDriveFilePicker } from "packages/bfDs/GoogleDriveFilePicker.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { colors, fonts } from "packages/bfDs/const.tsx";
const styles = {
  container: {
    borderRadius: "15px",
    width: "90%",
    height: "15vh",
    display: "flex",
    alignItems: "center",
    flex: 1,
    background: "#F2F2F2",
    margin: "auto",
  },
  box: {
    flex: 1,
    marginRight: "15px",
    padding: "10px",
    borderRight: "1px solid #E0E0E0",
  },
  buttonBox: {
    display: "flex",
    gap: "inherit",
  },
};
export function InternalMediaIngestion() {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.box, marginTop: "25px" }}>
        Choose a movie file from Google Drive...
        <div style={styles.buttonBox}>
          <GoogleDriveFilePicker
            onChange={(file) => {
              console.log(file);
            }}
          />
        </div>
      </div>
      {/* <hr style={{ width: "100%", height: "1px", color: "black" }} /> */}
      <div style={styles.box}>
        Choose and organization
        <div style={styles.buttonBox}>
          <DropdownSelector
            placeholder="organization"
            options={{ "Bolt Foundry": "option1", "Tiny Cupboard": "option2" }}
          />
        </div>
      </div>
      <div style={styles.box}>
        Submit the file for ingestion
        <div style={styles.buttonBox}>
          <Button text="Ingest file..." />
        </div>
      </div>
    </div>
  );
}
