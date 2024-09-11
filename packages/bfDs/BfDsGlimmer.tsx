import type * as React from "react";

type GlimmerProps = {
  order: number;
  width?: string;
  height?: string;
  xstyle?: Record<string, React.CSSProperties>;
};

export function BfDsGlimmer(
  { order, width = "100%", height = "100%", xstyle = {} }: GlimmerProps,
) {
  const glimmerStyle = {
    animationDelay: `${order * 0.1}s`,
    width,
    height,
    ...xstyle,
  };

  return <div className="glimmer" style={glimmerStyle}></div>;
}

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <BfDsGlimmer order={0} width="150px" height="50px" />
      <BfDsGlimmer order={1} width="150px" height="50px" />
      <BfDsGlimmer order={2} width="150px" height="50px" />
    </div>
  );
}
