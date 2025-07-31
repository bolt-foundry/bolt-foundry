import * as React from "react";
import { createPortal } from "react-dom";
import { classnames } from "@bfmono/lib/classnames.ts";
import { CfDsButton } from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { useCfDs } from "@bfmono/apps/cfDs/hooks/useCfDs.tsx";

const { useState, useEffect } = React;

export const TRANSITION_DURATION = 500;

type ToastProps = {
  closeCallback?: () => void;
  shouldShow?: boolean;
  timeout?: number;
  title?: string;
};

export function CfDsToast({
  children,
  closeCallback,
  shouldShow = true,
  timeout,
  title,
}: React.PropsWithChildren<ToastProps>) {
  const [show, setShow] = useState(false);
  const [inDOM, setInDOM] = useState(false);
  const [progress, setProgress] = useState(100);
  let domTimer: number;

  function removeToast() {
    setShow(false);
    domTimer = setTimeout(() => {
      setInDOM(false);
      if (closeCallback) {
        closeCallback();
      }
    }, TRANSITION_DURATION);
  }

  useEffect(() => {
    let visibilityTimer: number;
    let progressInterval: number;

    function clearTimers() {
      clearTimeout(visibilityTimer);
      clearTimeout(domTimer);
      clearInterval(progressInterval);
    }

    if (shouldShow) {
      clearTimers();
      setInDOM(true);
      setProgress(100);
      visibilityTimer = setTimeout(() => setShow(true), 10);

      if (timeout && timeout > 0) {
        progressInterval = setInterval(() => {
          setProgress((prevProgress: number) => {
            const decrement = (100 * 10) / (timeout + TRANSITION_DURATION);
            return Math.max(prevProgress - decrement, 0);
          });
        }, 10);

        domTimer = setTimeout(() => {
          removeToast();
        }, timeout);
      }
    } else {
      removeToast();
    }

    return () => {
      clearTimers();
    };
  }, [shouldShow, timeout]);

  const toastClasses = classnames([
    "toast",
    { show },
  ]);

  return inDOM
    ? createPortal(
      <div className={toastClasses}>
        {title && (
          <div className="toast-title">
            {title}
          </div>
        )}
        <div className="close-toast">
          <CfDsButton
            iconLeft="cross"
            kind="outline"
            size="small"
            onClick={removeToast}
          />
        </div>
        {children}
        {timeout && timeout > 0 && (
          <div className="toast-progress" style={{ width: `${progress}%` }}>
          </div>
        )}
      </div>,
      document.getElementById("toast-root") as Element,
    )
    : null;
}

export function Example() {
  const { showToast } = useCfDs();
  const [toastIncrement, setToastIncrement] = React.useState<number>(0);
  return (
    <div className="ui-group">
      {/* Plain toast */}
      <CfDsButton text="Toast 1" onClick={() => showToast("Toasty")} />
      {/* Self closing toast */}
      <CfDsButton
        text="Toast 2"
        subtext="Self closing"
        onClick={() => showToast("Toasty 2", { timeout: 4000 })}
      />
      {/* TODO Toast with clickable progress */}
      <CfDsButton
        text="Toast 3"
        subtext="Click x20"
        onClick={() => {
          setToastIncrement(toastIncrement + 20);
          showToast(`Toasty 3 - ${toastIncrement}%`, {
            id: "george",
            shouldShow: toastIncrement < 100,
            closeCallback: () => {
              setToastIncrement(0);
            },
          });
        }}
      />
    </div>
  );
}
