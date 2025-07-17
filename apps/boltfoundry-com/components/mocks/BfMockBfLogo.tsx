type BfMockBfLogoProps = {
  boltColor?: string;
  foundryColor?: string;
  height?: number;
};

export function BfMockBfLogo({
  boltColor = "#FFD700",
  foundryColor = "#FBFBFF",
  height = 24,
}: BfMockBfLogoProps) {
  return (
    <div
      style={{
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        fontSize: `${height * 0.8}px`,
        fontWeight: "bold",
        fontFamily: "'Bebas Neue', sans-serif",
      }}
    >
      <span style={{ color: boltColor }}>BOLT</span>
      <span style={{ color: foundryColor, marginLeft: "4px" }}>FOUNDRY</span>
    </div>
  );
}
