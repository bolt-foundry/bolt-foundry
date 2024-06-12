import { React } from "deps.ts";
import { InternalBfPageFrame } from "packages/client/components/InternalBfPageFrame.tsx";
import { InternalMediaIngestion } from "packages/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "packages/client/components/InternalMediaList.tsx";

const styles = {
  container: {
    display: "flex",
    width: "90vw",
    flexDirection: "column",
    gap: "2rem",
    margin: "auto 20px",
  },
};

export function InternalBfDotComPage() {
  return (
    <InternalBfPageFrame>
      <div style={styles.container}>
        <h1>Media</h1>
        <InternalMediaIngestion />
        <InternalMediaList />
      </div>
    </InternalBfPageFrame>
  );
}
