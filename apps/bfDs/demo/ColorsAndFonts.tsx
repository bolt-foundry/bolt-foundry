const styles: Record<string, React.CSSProperties> = {
  palette: {
    position: "relative",
    width: 180,
    height: 90,
    marginBottom: 20,
  },
  box: {
    position: "absolute",
    width: 90,
    padding: "6px 10px",
    boxSizing: "border-box",
    fontSize: "0.8em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    top: 0,
    left: 0,
    height: 90,
    backgroundColor: "var(--primaryColor)",
    borderRadius: "6px 0 0 6px",
  },
  secondary: {
    top: 0,
    right: 0,
    height: 30,
    backgroundColor: "var(--secondaryColor)",
    borderRadius: "0 6px 0 0",
  },
  tertiary: {
    color: "white",
    top: 30,
    right: 0,
    height: 30,
    backgroundColor: "var(--tertiaryColor)",
  },
  fourthary: {
    top: 60,
    right: 0,
    height: 30,
    backgroundColor: "var(--fourtharyColor)",
    borderRadius: "0 0 6px 0",
  },
};

export function ColorsAndFonts() {
  return (
    <div>
      <div className="ui-section">
        <h2>Color Palette</h2>
        <div style={styles.palette}>
          <div style={{ ...styles.box, ...styles.primary }}>
            #ffd700
          </div>
          <div style={{ ...styles.box, ...styles.secondary }}>
            #22d9e5
          </div>
          <div style={{ ...styles.box, ...styles.tertiary }}>
            #0b294b
          </div>
          <div style={{ ...styles.box, ...styles.fourthary }}>
            #ee82ee
          </div>
        </div>
      </div>
      <div className="ui-section">
        <h2>Fonts</h2>
        <hr />
        <h1>H1</h1>
        <h2>H2</h2>
        <h3>H3</h3>
        <div>DM Sans</div>
      </div>
    </div>
  );
}
