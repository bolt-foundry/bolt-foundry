import { getLogger, React } from "deps.ts";
import { graphql, ReactRelay } from "packages/client/deps.ts";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import {
  GoogleDriveFilePicker,
  GoogleDriveFilePickerFileType,
} from "packages/bfDs/GoogleDriveFilePicker.tsx";
import { Button } from "packages/bfDs/Button.tsx";

const { useLazyLoadQuery } = ReactRelay;
const logger = getLogger(import.meta);

const mutation = await graphql

const styles = {
  content: {
    margin: "20px auto",
    maxWidth: "calc(100% - 40px)",
    width: "60rem",
  },
  filebox: {
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
};

const handleProcessFile = () => {
  console.log("Processing...");
};

const { useState } = React;

export function InternalBfPage() {
  const [originGoogleFile, setOriginGoogleFile] = useState<
    google.picker.DocumentObject
  >();
  const [destinationGoogleFolder, setDestinationGoogleFolder] = useState<
    google.picker.DocumentObject
  >();

  return (
    <MarketingFrame>
      <div style={{ flex: 1 }}>
        <div style={styles.content}>
          <div style={{ fontSize: 36, fontWeight: "bold" }}>
            Prepare files
          </div>
          <div
            style={{
              fontSize: 18,
              marginBottom: 20,
              color: "var(--textSecondary",
            }}
          >
            Choose a file to process. This will create new files less than 2gb
            each and place them in a folder you choose below.
          </div>
          <div style={styles.filebox}>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>
              Input file
            </div>
            <div style={{ marginBottom: 16 }}>
              Choose a movie file from Google Drive.
            </div>
            <GoogleDriveFilePicker onPick={setOriginGoogleFile} />
          </div>
          <div style={styles.filebox}>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>
              Output folder
            </div>
            <div style={{ marginBottom: 16 }}>
              Choose a folder into which to save the output files.
            </div>
            <GoogleDriveFilePicker
              onPick={setDestinationGoogleFolder}
              pickerType={GoogleDriveFilePickerFileType.FOLDER}
            />
          </div>
          <div>
            <Button onClick={handleProcessFile} text="Process file" />
          </div>
        </div>
      </div>
    </MarketingFrame>
  );
}
