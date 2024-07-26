import { React } from "deps.ts";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "infra/internalbf.com/client/components/InternalMediaList.tsx";

const styles: Record<string, React.CSSProperties> = {
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
    <div style={styles.container}>
      <h1>Media</h1>
      <InternalMediaIngestion />
      <InternalMediaList />
    </div>
  );
}
