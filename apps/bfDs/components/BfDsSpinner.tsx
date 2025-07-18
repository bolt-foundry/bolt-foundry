import type * as React from "react";

/**
 * Props for the BfDsSpinner component
 */
export type BfDsSpinnerProps = {
  /** Size of the spinner in pixels */
  size?: number;
  /** Color of the spinner (defaults to currentColor to inherit parent text color) */
  color?: string;
  /** When true, shows an animated icon inside the spinner */
  waitIcon?: boolean;
};

const topFrom = "23.33,58.48 57.88,-0.04 57.88,58.48"; // bolt
const topTo = "25,20 75,20 50.04,58.47"; // hourglass
const bottomFrom = "77.27,41.37 42.72,99.89 42.72,41.37"; // bolt
const bottomTo = "75,77 25,77 49.96,38.56"; // hourglass

/**
 * BfDsSpinner - A loading spinner component with optional animated icon
 *
 * @param props - Component props
 * @returns JSX element
 */
export function BfDsSpinner({
  size = 48,
  color = "currentColor",
  waitIcon = false,
}: BfDsSpinnerProps) {
  const strokeWidth = Math.max(2, size / 24);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div
      className="bfds-spinner-container"
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="bfds-spinner"
        style={{
          transform: "rotate(-90deg)",
        }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.1}
        />

        {/* Animated foreground circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
          style={{
            animation: "bfds-spinner-rotate 1.2s linear infinite",
            transformOrigin: "center",
          }}
        />
      </svg>

      {waitIcon && (
        <div
          style={{
            position: "absolute",
            width: "90%",
            height: "90%",
            top: "5%",
            left: "5%",
          }}
        >
          <svg viewBox="0 0 100 100">
            <polygon points="" fill={color}>
              <animate
                attributeName="points"
                calcMode="spline"
                dur="5s"
                fill="loop"
                repeatCount="indefinite"
                values={`${topFrom}; ${topFrom}; ${topTo}; ${topTo}; ${topFrom}`}
                keyTimes="0; 0.4; 0.5; 0.9; 1"
                keySplines="0 0 1 1; 0.5 0 0.5 1; 0 0 1 1; 0.5 0 0.5 1"
              />
            </polygon>
            <polygon points="" fill={color}>
              <animate
                attributeName="points"
                calcMode="spline"
                dur="5s"
                fill="loop"
                repeatCount="indefinite"
                values={`${bottomFrom}; ${bottomFrom}; ${bottomTo}; ${bottomTo}; ${bottomFrom}`}
                keyTimes="0; 0.4; 0.5; 0.9; 1"
                keySplines="0 0 1 1; 0.5 0 0.5 1; 0 0 1 1; 0.5 0 0.5 1"
              />
            </polygon>
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Props for the BfDsFullPageSpinner component
 */
export interface BfDsFullPageSpinnerProps {
  /** Additional styles to apply to the container */
  xstyle?: React.CSSProperties;
}

/**
 * BfDsFullPageSpinner - A full-page loading spinner component
 *
 * @param props - Component props
 * @returns JSX element
 */
export function BfDsFullPageSpinner({ xstyle = {} }: BfDsFullPageSpinnerProps) {
  return (
    <div
      style={{
        color: "var(--bfds-primary)",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
        ...xstyle,
      }}
    >
      <div className="bfds-animate-fadeIn delay-100">
        <BfDsSpinner waitIcon />
      </div>
    </div>
  );
}
