import type * as React from "react";
import { icons } from "../lib/icons.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export type BfDsIconName = keyof typeof icons;
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
  const icon = icons[name];

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
