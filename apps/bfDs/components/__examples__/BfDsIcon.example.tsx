import * as React from "react";
import {
  BfDsIcon,
  type BfDsIconName,
  type BfDsIconSize,
} from "../BfDsIcon.tsx";
import { BfDsButton } from "../BfDsButton.tsx";
import { icons } from "@bfmono/apps/bfDs/lib/icons.ts";

export function BfDsIconExample() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState<BfDsIconSize>(
    "medium",
  );

  const iconNames = Object.keys(icons) as Array<BfDsIconName>;
  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsIcon Examples</h2>

      <div style={{ marginBottom: "24px" }}>
        <h3>Size Comparison</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ textAlign: "center" }}>
            <BfDsIcon name="arrowRight" size="small" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-text-secondary)",
              }}
            >
              Small
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <BfDsIcon name="arrowRight" size="medium" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-text-secondary)",
              }}
            >
              Medium
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <BfDsIcon name="arrowRight" size="large" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-text-secondary)",
              }}
            >
              Large
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3>Color Examples</h3>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <BfDsIcon name="brand-github" size="large" />
          <BfDsIcon
            name="brand-github"
            size="large"
            color="var(--bfds-primary)"
          />
          <BfDsIcon
            name="brand-github"
            size="large"
            color="var(--bfds-secondary)"
          />
          <BfDsIcon name="brand-github" size="large" color="#ff4444" />
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3>Controls</h3>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              htmlFor="icon-search"
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "14px",
              }}
            >
              Search Icons:
            </label>
            <input
              id="icon-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid var(--bfds-border)",
                backgroundColor: "var(--bfds-background)",
                color: "var(--bfds-text)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "14px",
              }}
            >
              Size:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["small", "medium", "large"] as const).map((size) => (
                <BfDsButton
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? "primary" : "ghost"}
                >
                  {size}
                </BfDsButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3>All Icons ({filteredIcons.length} found)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {filteredIcons.map((iconName) => (
            <div
              key={iconName}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px",
                border: "1px solid var(--bfds-border)",
                borderRadius: "6px",
                backgroundColor: "var(--bfds-background-hover)",
                textAlign: "center",
              }}
            >
              <BfDsIcon name={iconName} size={selectedSize} />
              <div
                style={{
                  fontSize: "11px",
                  marginTop: "8px",
                  color: "var(--bfds-text-secondary)",
                  wordBreak: "break-word",
                }}
              >
                {iconName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
