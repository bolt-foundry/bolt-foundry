import type React from "react";

export type CfDsTooltipPosition = "top" | "bottom" | "left" | "right";
export type CfDsTooltipJustification = "center" | "end" | "start";

export const OFFSET = 6; // number of pixels between the tooltip and the element it's attached to

export const getStyles = (): Record<string, React.CSSProperties> => ({
  baseTooltip: {
    position: "absolute",
    backgroundColor: "black",
    color: "white",
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 250,
    width: "max-content",
  },
  baseMenuTooltip: {
    position: "absolute",
    backgroundColor: "var(--menuBackground)",
    color: "var(--text)",
    padding: "5px 0",
    borderRadius: 5,
    fontSize: 12,
    textAlign: "center",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 12px",
    maxWidth: 250,
    width: "max-content",
    pointerEvents: "all",
  },
  baseArrow: {
    width: 0,
    height: 0,
    position: "absolute",
    color: "black", // using this to set color of arrow
  },
  baseMenuArrow: {
    width: 0,
    height: 0,
    position: "absolute",
    color: "var(--menuBackground)", // using this to set color of arrow
  },
  tooltipContainer: {
    position: "relative",
    display: "inline-block", // This makes it wrap just around its child
  },
});

export function createTooltipArrowStyle(
  baseArrowStyle: React.CSSProperties,
  position: string,
  justification: string,
): React.CSSProperties {
  const arrowStyle = { ...baseArrowStyle };
  switch (position) {
    case "bottom":
      arrowStyle.borderBottom = `10px solid ${arrowStyle.color}`;
      arrowStyle.top = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderLeft = "16px solid transparent";
        arrowStyle.borderRight = "0px solid transparent";
        arrowStyle.right = "5px";
      } else if (justification === "start") {
        arrowStyle.borderLeft = "0px solid transparent";
        arrowStyle.borderRight = "16px solid transparent";
        arrowStyle.left = "5px";
      } else { // center
        arrowStyle.borderLeft = "8px solid transparent";
        arrowStyle.borderRight = "8px solid transparent";
        arrowStyle.left = "50%";
        arrowStyle.transform = "translateX(-50%)";
      }
      break;
    case "left":
      arrowStyle.borderLeft = `10px solid ${arrowStyle.color}`;
      arrowStyle.right = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderTop = "16px solid transparent";
        arrowStyle.borderBottom = "0px solid transparent";
        arrowStyle.bottom = "5px";
      } else if (justification === "start") {
        arrowStyle.borderTop = "0px solid transparent";
        arrowStyle.borderBottom = "16px solid transparent";
        arrowStyle.top = "5px";
      } else { // center
        arrowStyle.borderTop = "8px solid transparent";
        arrowStyle.borderBottom = "8px solid transparent";
        arrowStyle.top = "50%";
        arrowStyle.transform = "translateY(-50%)";
      }
      break;
    case "right":
      arrowStyle.borderRight = `10px solid ${arrowStyle.color}`;
      arrowStyle.left = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderTop = "16px solid transparent";
        arrowStyle.borderBottom = "0px solid transparent";
        arrowStyle.bottom = "5px";
      } else if (justification === "start") {
        arrowStyle.borderTop = "0px solid transparent";
        arrowStyle.borderBottom = "16px solid transparent";
        arrowStyle.top = "5px";
      } else { // center
        arrowStyle.borderTop = "8px solid transparent";
        arrowStyle.borderBottom = "8px solid transparent";
        arrowStyle.top = "50%";
        arrowStyle.transform = "translateY(-50%)";
      }
      break;
    default: // top
      arrowStyle.borderLeft = "0px solid transparent";
      arrowStyle.borderRight = "16px solid transparent";
      arrowStyle.borderTop = `10px solid ${arrowStyle.color}`;
      arrowStyle.bottom = `-${OFFSET}px`;
      if (justification === "end") {
        arrowStyle.borderLeft = "16px solid transparent";
        arrowStyle.borderRight = "0px solid transparent";
        arrowStyle.right = "5px";
      } else if (justification === "start") {
        arrowStyle.borderLeft = "0px solid transparent";
        arrowStyle.borderRight = "16px solid transparent";
        arrowStyle.left = "5px";
      } else { // center
        arrowStyle.borderLeft = "8px solid transparent";
        arrowStyle.borderRight = "8px solid transparent";
        arrowStyle.left = "50%";
        arrowStyle.transform = "translateX(-50%)";
      }
  }
  return arrowStyle;
}

export function createTooltipStyle(
  baseStyle: React.CSSProperties,
  position: string,
  justification: string,
): React.CSSProperties {
  const tooltipStyle = { ...baseStyle };
  switch (position) {
    case "bottom":
      tooltipStyle.top = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.right = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.left = OFFSET;
      } else { // center
        tooltipStyle.left = "50%";
        tooltipStyle.transform = "translateX(-50%)";
      }
      break;
    case "left":
      tooltipStyle.right = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.bottom = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.top = OFFSET;
      } else { // center
        tooltipStyle.top = "50%";
        tooltipStyle.transform = "translateY(-50%)";
      }
      break;
    case "right":
      tooltipStyle.left = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.bottom = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.top = OFFSET;
      } else { // center
        tooltipStyle.top = "50%";
        tooltipStyle.transform = "translateY(-50%)";
      }
      break;
    default: // top
      tooltipStyle.bottom = `calc(100% + ${OFFSET}px)`;
      if (justification === "end") {
        tooltipStyle.right = OFFSET;
      } else if (justification === "start") {
        tooltipStyle.left = OFFSET;
      } else { // center
        tooltipStyle.left = "50%";
        tooltipStyle.transform = "translateX(-50%)";
      }
  }
  return tooltipStyle;
}
