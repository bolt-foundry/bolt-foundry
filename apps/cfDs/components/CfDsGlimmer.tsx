import type * as React from "react";

type GlimmerProps = {
  className?: string;
  order?: number;
  width?: string;
  height?: string;
  xstyle?: React.CSSProperties;
};

export function CfDsGlimmer(
  { className = "", order = 0, width = "100%", height = "100%", xstyle = {} }:
    GlimmerProps,
) {
  const glimmerStyle = {
    animationDelay: `${order * 0.1}s`,
    width,
    height,
    ...xstyle,
  };

  return <div className={`${className} glimmer`} style={glimmerStyle}></div>;
}

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CfDsGlimmer order={0} width="150px" height="50px" />
      <CfDsGlimmer order={1} width="150px" height="50px" />
      <CfDsGlimmer order={2} width="150px" height="50px" />
    </div>
  );
}
