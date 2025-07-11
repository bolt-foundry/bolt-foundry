import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";

export function UIDemo() {
  const [count, setCount] = useState(5);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>BfDs UI Demo</h1>
      <p>This is a simple demo of the BfDs design system components.</p>

      <div style={{ marginTop: "2rem" }}>
        <h2>Button Component</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <BfDsButton variant="primary">
            Primary Button
          </BfDsButton>
          <BfDsButton variant="secondary">
            Secondary Button
          </BfDsButton>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <p>Counter: {count}</p>
          <BfDsButton
            onClick={() => setCount(count + 1)}
            variant="primary"
          >
            Increment
          </BfDsButton>
        </div>
      </div>
    </div>
  );
}
