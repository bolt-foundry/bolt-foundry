import * as React from "react";
import { icons } from "../lib/icons.ts";
import { BfDsLiteButton } from "./BfDsLiteButton.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export type BfDsLiteIconName = keyof typeof icons;
export type BfDsLiteIconSize = "small" | "medium" | "large";

export type BfDsLiteIconProps = {
  name: BfDsLiteIconName;
  size?: BfDsLiteIconSize;
  color?: string;
  className?: string;
} & Omit<React.SVGProps<SVGSVGElement>, "children">;

export function BfDsLiteIcon({
  name,
  size = "medium",
  color,
  className,
  ...props
}: BfDsLiteIconProps) {
  const icon = icons[name];

  if (!icon) {
    logger.error(`Icon "${name}" not found`);
    return null;
  }

  const classes = [
    "bfds-lite-icon",
    `bfds-lite-icon--${size}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <svg
      {...props}
      className={classes}
      viewBox={icon.viewbox}
      fill={color || "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        ...(color && { fill: color }),
        ...props.style,
      }}
    >
      {icon.paths.map((path, index) => <path key={index} d={path} />)}
    </svg>
  );
}

BfDsLiteIcon.Example = function BfDsLiteIconExample() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState<BfDsLiteIconSize>(
    "medium",
  );

  const iconNames = Object.keys(icons) as Array<BfDsLiteIconName>;
  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "var(--bfds-lite-background)",
        color: "var(--bfds-lite-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsLiteIcon Examples</h2>

      <div style={{ marginBottom: "24px" }}>
        <h3>Size Comparison</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ textAlign: "center" }}>
            <BfDsLiteIcon name="arrowRight" size="small" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-lite-text-secondary)",
              }}
            >
              Small
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <BfDsLiteIcon name="arrowRight" size="medium" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-lite-text-secondary)",
              }}
            >
              Medium
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <BfDsLiteIcon name="arrowRight" size="large" />
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "var(--bfds-lite-text-secondary)",
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
          <BfDsLiteIcon name="brand-github" size="large" />
          <BfDsLiteIcon
            name="brand-github"
            size="large"
            color="var(--bfds-lite-primary)"
          />
          <BfDsLiteIcon
            name="brand-github"
            size="large"
            color="var(--bfds-lite-secondary)"
          />
          <BfDsLiteIcon name="brand-github" size="large" color="#ff4444" />
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
                border: "1px solid var(--bfds-lite-border)",
                backgroundColor: "var(--bfds-lite-background)",
                color: "var(--bfds-lite-text)",
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
                <BfDsLiteButton
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? "primary" : "ghost"}
                >
                  {size}
                </BfDsLiteButton>
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
                border: "1px solid var(--bfds-lite-border)",
                borderRadius: "6px",
                backgroundColor: "var(--bfds-lite-background-hover)",
                textAlign: "center",
              }}
            >
              <BfDsLiteIcon name={iconName} size={selectedSize} />
              <div
                style={{
                  fontSize: "11px",
                  marginTop: "8px",
                  color: "var(--bfds-lite-text-secondary)",
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
};
