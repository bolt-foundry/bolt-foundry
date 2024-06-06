import { React } from "deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { Button } from "packages/bfDs/Button.tsx";
// import { captureEvent } from "packages/events/mod.ts";
import useClickOutside from "packages/client/hooks/useClickOutside.ts";
import { ReactDOMClient } from "packages/client/deps.ts";
import { classnames } from "lib/classnames.ts";

const { createPortal } = ReactDOMClient;
const { useEffect, useRef, useState } = React;
type ModalOptions = {
  children: React.ReactNode;
  clickOusideToClose?: boolean;
  confirmClose?: boolean;
  header?: string;
  onClose?: () => void;
  onSave?: (() => void) | null;
  xstyle?: React.CSSProperties;
  contentXstyle?: React.CSSProperties;
  kind?: string;
};

const styles: Record<string, React.CSSProperties> = {
  close: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  content: {
    padding: 40,
    overflowY: "auto",
  },
  footer: {
    boxSizing: "border-box",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "var(--border)",
    padding: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    width: "100%",
  },
  header: {
    padding: "40px 80px 0 40px",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalBase: {
    fontFamily: fonts.fontFamily,
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    // 'modalBase' class set in renderer.ts
    // background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    background: "var(--background)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border)",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.06)",
    maxHeight: "90%",
    display: "flex",
    flexDirection: "column",
    // 'modal' class set in renderer.ts
    // borderRadius: 16,
    // width: "60rem",
    // maxWidth: "80%",
    // position: "relative",
  },
};

export function Modal(
  {
    children,
    clickOusideToClose = true,
    confirmClose,
    header,
    onClose,
    onSave,
    xstyle,
    contentXstyle,
    kind,
  }: ModalOptions,
) {
  // const { currentViewer: { id: personId } } = useAppEnvironment();
  const [show, setShow] = useState(false);
  const [inDom, setInDom] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  let domTimer: number;

  useEffect(() => {
    clearTimeout(domTimer);
    setInDom(true);
    setTimeout(() => setShow(true), 0);
    // captureEvent("modal", "loaded", { kind }, personId);
  }, []);

  useClickOutside(modalRef, () => close(), {
    isActive: clickOusideToClose,
    showConfirmation: confirmClose,
    excludeElementIds: ["tooltip-root"],
  });

  const handleClose = () => {
    if (confirmClose) {
      const result = confirm("You have unsaved changes. Close without saving?");
      if (result) {
        close();
      }
    } else {
      close();
    }
  };

  const close = () => {
    // captureEvent("modal", "closed", { kind }, personId);
    setShow(false);
    domTimer = setTimeout(() => {
      onClose?.();
    }, 250);
  };

  const modalClasses = classnames([
    "modalBase",
    { show },
  ]);

  return inDom
    ? createPortal(
      <div
        className={modalClasses}
        style={styles.modalBase}
      >
        <div
          className="modal"
          ref={modalRef}
          style={{ ...styles.modal, ...xstyle }}
        >
          {header != null && (
            <div style={styles.header}>
              {header}
            </div>
          )}
          {onClose != null && (
            <div style={styles.close}>
              <Button
                iconLeft="cross"
                kind="overlay"
                onClick={() => {
                  // captureEvent("modal", "closed from x", { kind }, personId);
                  handleClose();
                }}
                testId="button-close-modal"
              />
            </div>
          )}
          <div style={{ ...styles.content, ...contentXstyle }}>
            {children}
          </div>
          {onSave != null && (
            <div style={styles.footer}>
              <Button text="Cancel" kind="outline" onClick={onClose} />
              <Button text="Save" kind="primary" onClick={onSave} />
            </div>
          )}
        </div>
      </div>,
      document.getElementById("modal-root") as Element,
    )
    : null;
}
