import * as React from "react";
import { createPortal } from "react-dom";
import { BfDsIcon } from "apps/bfDs/components/BfDsIcon.tsx";
import { useCopyToClipboard } from "apps/boltFoundry/hooks/useCopyToClipboard.ts";
import {
  type BfDsTooltipJustification,
  type BfDsTooltipPosition,
  createTooltipArrowStyle,
  createTooltipStyle,
  getStyles,
} from "apps/bfDs/lib/tooltips.ts";

const { useEffect, useMemo, useRef, useState } = React;

export type { BfDsTooltipJustification, BfDsTooltipPosition };

type Props = {
  text?: string | React.ReactNode;
  position?: BfDsTooltipPosition; // default: "top"
  justification?: BfDsTooltipJustification; // default: "center"
  delay?: number; // default: 1000
  canCopy?: boolean;
  xstyle?: React.CSSProperties;
};

export function BfDsTooltip(
  {
    text,
    position = "top",
    justification = "center",
    delay = 1000,
    children,
    canCopy,
    xstyle,
  }: React.PropsWithChildren<Props>,
) {
  const [copiedText, copy] = useCopyToClipboard();
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipSize, setTooltipSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const styles = useMemo(() => getStyles(), []);
  const timeoutRef = useRef<number>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // get the size of the tooltip-container and set the size of the tooltip-base
    if (showTooltip) {
      const tooltipContainer = tooltipRef.current;
      if (!tooltipContainer) return;
      const { width, height, x, y } = tooltipContainer.getBoundingClientRect();
      setTooltipSize({ width, height, x, y });
    }
  }, [showTooltip]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (shouldShowTooltip) {
      if (delay === 0) {
        setShowTooltip(true);
        return;
      }
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, delay);
    } else {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 500);
    }
    if (timeoutRef.current) {
      return () => clearTimeout(timeoutRef.current ?? 0);
    }
  }, [shouldShowTooltip]);

  const tooltipStyle = createTooltipStyle(
    styles.baseTooltip,
    position,
    justification,
  );

  const tooltipArrowStyle = createTooltipArrowStyle(
    styles.baseArrow,
    position,
    justification,
  );

  return (
    <div
      className="tooltip-container"
      ref={tooltipRef}
      style={{ ...styles.tooltipContainer, ...xstyle }}
      onMouseEnter={() => setShouldShowTooltip(true)}
      onMouseLeave={() => setShouldShowTooltip(false)}
      onClick={canCopy && text ? () => copy(text.toString()) : undefined}
    >
      {children}
      {showTooltip && text != null && createPortal(
        <div
          className="tooltip-base"
          style={{
            position: "absolute",
            width: tooltipSize.width,
            height: tooltipSize.height,
            left: tooltipSize.x,
            top: tooltipSize.y,
          }}
        >
          <div className="tooltip" style={tooltipStyle}>
            <div className="tooltip-text">
              {canCopy && (
                <span style={{ display: "inline", marginRight: 8 }}>
                  <BfDsIcon
                    color={copiedText ? "var(--success)" : "white"}
                    name={copiedText ? "check" : "clipboard"}
                    size={12}
                  />
                </span>
              )}
              {text}
            </div>
            <div
              className="tooltip-arrow"
              style={tooltipArrowStyle}
            />
          </div>
        </div>,
        document.getElementById("tooltip-root") as Element,
      )}
    </div>
  );
}
