import type * as React from "react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { BfDsCallout } from "./BfDsCallout.tsx";
import type { BfDsCalloutVariant } from "./BfDsCallout.tsx";

export const TOAST_TRANSITION_DURATION = 300;

export type BfDsToastItem = {
  id: string;
  message: React.ReactNode;
  variant?: BfDsCalloutVariant;
  details?: string;
  timeout?: number;
  onDismiss?: () => void;
};

type BfDsToastProps = {
  toast: BfDsToastItem;
  onRemove: (id: string) => void;
  index: number;
};

function BfDsToastComponent({ toast, onRemove, index }: BfDsToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Show toast after a brief delay to allow for entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remove from DOM after animation completes
    setTimeout(() => {
      setShouldRender(false);
      onRemove(toast.id);
      toast.onDismiss?.();
    }, TOAST_TRANSITION_DURATION);
  };

  if (!shouldRender) return null;

  const toastClasses = [
    "bfds-toast",
    isVisible ? "bfds-toast--visible" : "bfds-toast--hidden",
  ].join(" ");

  return (
    <div
      className={toastClasses}
      style={{
        "--toast-index": index,
        "--toast-offset": `${index * 80}px`,
      } as React.CSSProperties}
    >
      <BfDsCallout
        variant={toast.variant}
        details={toast.details}
        visible
        onDismiss={handleDismiss}
        autoDismiss={toast.timeout || 0} // Pass timeout to callout for countdown display
      >
        {toast.message}
      </BfDsCallout>
    </div>
  );
}

type BfDsToastContainerProps = {
  toasts: Array<BfDsToastItem>;
  onRemove: (id: string) => void;
};

export function BfDsToastContainer(
  { toasts, onRemove }: BfDsToastContainerProps,
) {
  const toastRoot = globalThis.document?.getElementById("toast-root");

  if (!toastRoot) {
    // Toast root element not found - this is expected during SSR or if toast-root div is missing
    return null;
  }

  return createPortal(
    <div className="bfds-toast-container">
      {toasts.map((toast, index) => (
        <BfDsToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>,
    toastRoot,
  );
}
