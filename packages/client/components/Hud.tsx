import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "packages/client/hooks/useLocalStorage.ts";
import { BfDsIcon } from "packages/bfDs/BfDsIcon.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import type { featureFlags } from "packages/features/list.ts";

const flags = [
  "placeholder",
  "landing-page-videos",
];

export function Hud() {
  const { BF_ENV } = useAppEnvironment();
  const enableHud = BF_ENV !== "PRODUCTION";
  if (!enableHud) {
    return null;
  }

  const hudRef = useRef<HTMLDivElement>(null);
  const [initComplete, setInitComplete] = useState(false);
  const [showHud, setShowHud] = useLocalStorage("showHud", false);
  const [position, setPosition] = useLocalStorage("hud-position", {
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Ensure initial position load
  useEffect(() => {
    setInitComplete(true); // Flag to indicate that initialization is done
  }, [position]);

  useEffect(() => {
    if (initComplete) {
      bringHudOnScreen();
    }
  }, [initComplete]);

  const bringHudOnScreen = () => {
    if (hudRef.current) {
      const hudRect = hudRef.current.getBoundingClientRect();
      const newX = Math.min(
        Math.max(0, position.x),
        globalThis.innerWidth - hudRect.width,
      );
      const newY = Math.min(
        Math.max(0, position.y),
        globalThis.innerHeight - hudRect.height,
      );
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      bringHudOnScreen();
    };

    globalThis.addEventListener("resize", handleResize);
    return () => {
      globalThis.removeEventListener("resize", handleResize);
    };
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - offset.x - 20;
      const newY = e.clientY - offset.y - 20;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  if (!initComplete) {
    return null; // or a loading spinner or placeholder
  }

  const hudStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };
  const titleStyle: React.CSSProperties = {
    cursor: dragging ? "grabbing" : "grab",
  };

  return showHud
    ? (
      <div
        ref={hudRef}
        className="hud"
        style={hudStyle}
      >
        <div className="hud_close">
          <BfDsButton
            iconLeft="cross"
            kind="overlayDark"
            onClick={() => setShowHud(false)}
            size="medium"
          />
        </div>
        <div
          className="hud_title"
          style={titleStyle}
          onMouseDown={handleMouseDown}
        >
          <BfDsIcon name="drag" color="white" size={12} />
          Flags
        </div>
        <div>
          {flags.map((flag) => {
            return <FeatureFlag key={flag} toggle name={flag} />;
          })}
        </div>
      </div>
    )
    : (
      <div className="hud_corner" onClick={() => setShowHud(true)}>
        ⛳️
      </div>
    );
}
