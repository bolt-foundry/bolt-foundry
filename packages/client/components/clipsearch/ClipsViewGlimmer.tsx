import type * as React from "react";
import { BfDsGlimmer } from "packages/bfDs/BfDsGlimmer.tsx";

export function ClipsViewGlimmer() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {[...Array(4)].map((_, index) => (
        <BfDsGlimmer
          key={index}
          height="150px"
          order={index}
          xstyle={{
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.06)",
            borderRadius: 16,
          }}
        />
      ))}
    </div>
  );
}
