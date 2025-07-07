import { useState } from "react";
import { BfDsButton } from "../BfDsButton.tsx";

export function BfDsButtonExample() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsButton Examples</h2>

      <div>
        <h3>Variants</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton
            variant="primary"
            onClick={() => setClickCount((c) => c + 1)}
          >
            Primary ({clickCount})
          </BfDsButton>
          <BfDsButton variant="secondary">Secondary</BfDsButton>
          <BfDsButton variant="outline">Outline</BfDsButton>
          <BfDsButton variant="ghost">Ghost</BfDsButton>
        </div>
      </div>

      <div>
        <h3>Overlay Buttons</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton variant="primary" overlay>
            Primary Overlay
          </BfDsButton>
          <BfDsButton variant="secondary" overlay>
            Secondary Overlay
          </BfDsButton>
          <BfDsButton variant="outline" overlay>
            Outline Overlay
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Sizes</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsButton size="small">Small</BfDsButton>
          <BfDsButton size="medium">Medium</BfDsButton>
          <BfDsButton size="large">Large</BfDsButton>
        </div>
      </div>

      <div>
        <h3>States</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton disabled>Disabled</BfDsButton>
          <BfDsButton variant="outline" disabled>
            Disabled Outline
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Icons</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton icon="arrowRight">Next</BfDsButton>
          <BfDsButton icon="arrowLeft" iconPosition="left">
            Previous
          </BfDsButton>
          <BfDsButton icon="brand-github" variant="outline">
            GitHub
          </BfDsButton>
          <BfDsButton icon="burgerMenu" variant="ghost">
            Menu
          </BfDsButton>
          <BfDsButton icon="burgerMenu" variant="primary" overlay>
            Primary Overlay
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Icon Positions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <BfDsButton icon="arrowRight" iconPosition="left">
            Left Icon
          </BfDsButton>
          <BfDsButton icon="arrowRight" iconPosition="right">
            Right Icon
          </BfDsButton>
        </div>
      </div>

      <div>
        <h3>Icon-Only Buttons</h3>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsButton icon="arrowLeft" iconOnly size="small" />
          <BfDsButton icon="burgerMenu" iconOnly />
          <BfDsButton icon="arrowRight" iconOnly size="large" />
          <BfDsButton icon="brand-github" iconOnly variant="outline" />
          <BfDsButton icon="back" iconOnly variant="ghost" />
          <BfDsButton icon="back" iconOnly variant="primary" overlay />
        </div>
      </div>
    </div>
  );
}
