import * as React from "react";
// import { BfDsToast, TRANSITION_DURATION } from "apps/bfDs/BfDsToast.tsx";
import {
  BfDsModal,
  type ModalHandles,
} from "@bfmono/apps/bfDs/components/BfDsModal.tsx";
import { useLocalStorage } from "@bfmono/apps/boltFoundry/hooks/useLocalStorage.ts";
import {
  BfDsToast,
  TRANSITION_DURATION,
} from "@bfmono/apps/bfDs/components/BfDsToast.tsx";

const { createContext, useEffect, useState } = React;

type ReactNode = React.ReactNode;
type UseToastOptions = {
  closeCallback?: () => void;
  id?: string;
  shouldShow?: boolean;
  timeout?: number;
  title?: string;
};
type UseModalOptions = {
  clickOusideToClose?: boolean;
  confirmClose?: boolean;
  header?: string;
  onClose?: () => void;
  onSave?: (() => void) | null;
  xstyle?: React.CSSProperties;
  contentXstyle?: React.CSSProperties;
  kind?: string;
};

export type BfDsContextType = {
  showModal: (
    content: ReactNode,
    ref?: React.RefObject<ModalHandles | null>,
    options?: UseModalOptions,
  ) => () => void;
  showToast: (message: ReactNode, options?: UseToastOptions) => void;
  ModalComponent: ReactNode;
  ToastComponent: ReactNode;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

export const BfDsContext = createContext<BfDsContextType | undefined>(
  undefined,
);

type ModalType = {
  content: ReactNode;
  ref?: React.RefObject<ModalHandles | null>;
  options?: UseModalOptions;
};

type BfDsToast = {
  id: string;
  message: string | ReactNode;
  options: UseToastOptions | undefined;
};

export const BfDsProvider = ({ children }: { children: ReactNode }) => {
  const [activeToasts, setActiveToasts] = useState<Array<BfDsToast>>([]);
  const [activeModal, setActiveModal] = useState<ModalType | undefined>();
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);

  useEffect(() => {
    // TODO add setting to follow system theme
    // const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  function showModal(
    content: ReactNode,
    ref?: React.RefObject<ModalHandles | null>,
    options?: UseModalOptions,
  ) {
    setActiveModal({ content, ref, options });
    return () => {
      setActiveModal(undefined);
    };
  }

  function showToast(message: ReactNode, options: UseToastOptions = {}) {
    const id = options.id ?? Math.random().toString(36).substring(2, 15);
    const existingToastIndex = activeToasts.findIndex((toast: BfDsToast) =>
      toast.id === id
    );
    const newToastData = {
      id,
      message,
      options,
    };

    if (existingToastIndex > -1) {
      const newToasts = [...activeToasts];
      newToasts[existingToastIndex] = newToastData;
      setActiveToasts(newToasts);
      return;
    }

    setActiveToasts([...activeToasts, newToastData]);
  }

  function hideToast(id: string) {
    setActiveToasts((prevToasts: Array<BfDsToast>) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, shouldShow: false } : toast
      )
    );
    // remove from state after animate off (500ms)
    setTimeout(() => {
      setActiveToasts((prevToasts: Array<BfDsToast>) =>
        prevToasts.filter((toast) => toast.id !== id)
      );
    }, TRANSITION_DURATION);
  }

  const value = {
    darkMode,
    setDarkMode,
    showModal,
    showToast,
    ModalComponent: activeModal && (
      <BfDsModal
        ref={activeModal.ref}
        clickOusideToClose={activeModal.options?.clickOusideToClose}
        confirmClose={activeModal.options?.confirmClose}
        header={activeModal.options?.header}
        onClose={() => {
          setActiveModal(undefined);
          activeModal.options?.onClose?.();
        }}
        onSave={activeModal.options?.onSave}
        xstyle={activeModal.options?.xstyle}
        contentXstyle={activeModal.options?.contentXstyle}
        kind={activeModal.options?.kind}
      >
        {activeModal.content}
      </BfDsModal>
    ),
    ToastComponent: (
      <>
        {activeToasts.map((toast: BfDsToast) => (
          <BfDsToast
            key={toast.id}
            shouldShow={toast.options?.shouldShow}
            title={toast.options?.title}
            timeout={toast.options?.timeout}
            closeCallback={() => {
              hideToast(toast.id);
              toast.options?.closeCallback?.();
            }}
          >
            {toast.message}
          </BfDsToast>
        ))}
      </>
    ),
  };

  return (
    <BfDsContext.Provider value={value}>
      {children}
      {value.ToastComponent}
      {value.ModalComponent}
    </BfDsContext.Provider>
  );
};
