import { React } from "deps.ts";

export function LandingPageClipCollection() {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  };
  const videoStyle = {
    width: "200px",
    height: "355px",
    backgroundColor: "grey",
    margin: "10px",
  };
  return (
    <div style={containerStyle}>
      <div style={videoStyle}></div>
      <div style={videoStyle}></div>
      <div style={videoStyle}></div>
    </div>
  );
}
