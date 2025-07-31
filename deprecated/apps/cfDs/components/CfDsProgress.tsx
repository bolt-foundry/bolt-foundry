type Props = {
  size?: number;
  progress?: number;
  spinnerColor?: string;
  backgroundColor?: string;
};

export function CfDsProgress(
  {
    size = 48,
    spinnerColor = "var(--success)",
    backgroundColor = "var(--background)",
    progress = 0,
  }: Props,
) {
  const styles: Record<string, React.CSSProperties> = {
    progressBase: {
      position: "relative",
      width: size,
      height: size,
    },
    progress: {
      borderRadius: "50%",
      width: "100%",
      height: "100%",
    },
  };
  const progressStyle = {
    ...styles.progress,
    background:
      `radial-gradient(closest-side, ${backgroundColor} 79%, transparent 80% 100%), conic-gradient(${spinnerColor} ${progress}%, var(--transparentGray) 0)`,
  };
  return (
    <div style={styles.progressBase}>
      <div className="progressCircle" style={progressStyle} />
    </div>
  );
}
