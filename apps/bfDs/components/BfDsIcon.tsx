import type * as React from "react";
import { icons } from "../lib/icons.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Extract all icon names including aliases
type BaseIconNames = keyof typeof icons;
type AliasNames = {
  [K in BaseIconNames]: typeof icons[K] extends
    { aliases: readonly Array<infer A> } ? A : never;
}[BaseIconNames];

export type BfDsIconName = BaseIconNames | AliasNames;
export type BfDsIconSize = "small" | "medium" | "large" | "xlarge";

export type BfDsIconProps = {
  /** Name of the icon to display */
  name: BfDsIconName;
  /** Size variant for icon */
  size?: BfDsIconSize;
  /** Custom color override */
  color?: string;
  /** Additional CSS classes */
  className?: string;
} & Omit<React.SVGProps<SVGSVGElement>, "children">;

export function BfDsIcon({
  name,
  size = "medium",
  color,
  className,
  ...props
}: BfDsIconProps) {
  // First try to get the icon directly
  let icon = icons[name as keyof typeof icons];

  // If not found, search for it as an alias
  if (!icon) {
    for (const [_iconName, iconData] of Object.entries(icons)) {
      if (
        "aliases" in iconData && iconData.aliases &&
        iconData.aliases.includes(name)
      ) {
        icon = iconData;
        break;
      }
    }
  }

  if (!icon) {
    logger.error(`Icon "${name}" not found`);
    return null;
  }

  const classes = [
    "bfds-icon",
    `bfds-icon--${size}`,
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
