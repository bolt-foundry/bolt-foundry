import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type MainView = "Decks" | "Analyze" | "Chat";

interface EvalContextType {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeMainContent: MainView;
  rightSidebarContent: string | null;
  leftSidebarStateBeforeRightOpen: boolean;

  setLeftSidebarOpen: (open: boolean) => void;
  setActiveMainContent: (content: MainView) => void;
  openRightSidebar: (content: string) => void;
  closeRightSidebar: () => void;
}

const EvalContext = createContext<EvalContextType | undefined>(undefined);

// Helper function to detect mobile
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
};

export function EvalProvider({ children }: { children: ReactNode }) {
  const [leftSidebarOpen, setLeftSidebarOpenState] = useState(() =>
    !isMobile()
  );
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeMainContent, setActiveMainContent] = useState<MainView>("Decks");
  const [rightSidebarContent, setRightSidebarContent] = useState<string | null>(
    null,
  );
  const [leftSidebarStateBeforeRightOpen, setLeftSidebarStateBeforeRightOpen] =
    useState(false);

  const setLeftSidebarOpen = (open: boolean) => {
    setLeftSidebarOpenState(open);
  };

  const openRightSidebar = (content: string) => {
    if (!rightSidebarOpen) {
      // Remember current left sidebar state before opening right sidebar
      setLeftSidebarStateBeforeRightOpen(leftSidebarOpen);
      // Close left sidebar when opening right sidebar
      setLeftSidebarOpenState(false);
    }
    setRightSidebarContent(content);
    setRightSidebarOpen(true);
  };

  const closeRightSidebar = () => {
    setRightSidebarOpen(false);
    setRightSidebarContent(null);
    // Restore left sidebar to its previous state
    setLeftSidebarOpenState(leftSidebarStateBeforeRightOpen);
  };

  return (
    <EvalContext.Provider
      value={{
        leftSidebarOpen,
        rightSidebarOpen,
        activeMainContent,
        rightSidebarContent,
        leftSidebarStateBeforeRightOpen,
        setLeftSidebarOpen,
        setActiveMainContent,
        openRightSidebar,
        closeRightSidebar,
      }}
    >
      {children}
    </EvalContext.Provider>
  );
}

export function useEvalContext() {
  const context = useContext(EvalContext);
  if (context === undefined) {
    throw new Error("useEvalContext must be used within an EvalProvider");
  }
  return context;
}
