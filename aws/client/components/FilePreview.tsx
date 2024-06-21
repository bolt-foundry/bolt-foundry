import { React } from "aws/client/deps.ts";
import VideoPlayer from "aws/client/components/VideoPlayer.tsx";

type Props = {
  src: string | null;
  name: string | null;
};

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "var(--text)",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "var(--textSecondary)",
    marginBottom: 12,
  },
  fileContent: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    padding: 24,
  },
  fileMeta: {
    flex: 1,
    overflowY: "auto",
  },
  videoPreview: {
    height: 108,
  },
};

export default function FilePreview(
  { src, name }: Props,
) {
  return (
    <div style={styles.fileContent}>
      <div style={styles.videoPreview}>
        <VideoPlayer src={src} />
      </div>
      <div style={styles.fileMeta}>
        <div style={styles.title}>{name}</div>
      </div>
    </div>
  );
}
