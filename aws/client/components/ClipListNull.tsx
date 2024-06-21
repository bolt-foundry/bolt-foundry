import { React } from "aws/client/deps.ts";
import TVStatic from "aws/client/images/TVStatic.tsx";

const styles: Record<string, React.CSSProperties> = {
  art: {
    width: 200,
    marginBottom: 24,
  },
  nullPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    color: "var(--text)",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    wordBreak: "break-word",
  },
  subtext: {
    color: "var(--textSecondary)",
    fontSize: 14,
    marginBottom: 14,
  },
};

type Props = {
  text?: string;
  subtext?: string;
};

export default function ClipListNull(
  { text = "No clips yet", subtext }: Props,
) {
  return (
    <div style={styles.nullPage}>
      <div style={styles.art}>
        <TVStatic />
      </div>
      <div style={styles.text}>{text}</div>
      <div style={styles.subtext}>{subtext}</div>
    </div>
  );
}
