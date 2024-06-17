import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { GoogleDriveFilePicker } from "infra/internalbf.com/client/components/GoogleDriveFilePicker.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { colors, fonts } from "packages/bfDs/const.tsx";
const styles = {
  container: {
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    flex: 1,
    background: "#F2F2F2",
    margin: "auto",
    padding: "20px 0",
    width: "100%",
    maxWidth: "60rem",
    boxSizing: "border-box",
  },
  box: {
    padding: "0 20px",
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
      <div style={styles.box}>
        Choose a movie file from Google Drive...
        <div style={styles.buttonBox}>
          {
            /* THIS IS CURRENTLY CRASHING THE APP
            <GoogleDriveFilePicker
            onChange={(file) => {
              console.log(file);
            }}
          /> */
          }
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
      <div style={{ ...styles.box, borderRight: "none" }}>
        Submit the file for ingestion
        <div style={styles.buttonBox}>
          <Button text="Ingest file..." />
        </div>
      </div>
    </div>
  );
}
