import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
import { useEffect, useRef } from "react";
import { useEvalContext } from "@bfmono/apps/boltfoundry-com/contexts/EvalContext.tsx";

export function LeftSidebar() {
  const {
    activeMainContent,
    setActiveMainContent,
    leftSidebarOpen,
    rightSidebarOpen,
  } = useEvalContext();
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Mark that we've had at least one state change after initial render
    hasAnimated.current = true;
  }, [leftSidebarOpen, rightSidebarOpen]);

  // Always render placeholder, animate based on right sidebar state or left sidebar state
  const placeholderClass = rightSidebarOpen
    ? `eval-left-sidebar-placeholder eval-left-sidebar--hidden ${
      hasAnimated.current ? "eval-left-sidebar-placeholder--animate" : ""
    }`
    : `eval-left-sidebar-placeholder ${
      !leftSidebarOpen ? "eval-left-sidebar--hidden" : ""
    } ${hasAnimated.current ? "eval-left-sidebar-placeholder--animate" : ""}`;

  // Sidebar always uses the same animation (transform), but positioning changes
  const sidebarClass = rightSidebarOpen
    ? `eval-left-sidebar eval-left-sidebar-overlay ${
      !leftSidebarOpen ? "eval-left-sidebar--hidden" : ""
    }`
    : `eval-left-sidebar eval-left-sidebar-side-by-side ${
      !leftSidebarOpen ? "eval-left-sidebar--hidden" : ""
    }`;

  return (
    <>
      <div className={placeholderClass}></div>
      <div className={sidebarClass}>
        <div className="eval-sidebar-content">
          <BfDsList header="Navigation">
            <BfDsListItem
              active={activeMainContent === "Decks"}
              onClick={() => setActiveMainContent("Decks")}
            >
              Decks
            </BfDsListItem>
            <BfDsListItem
              active={activeMainContent === "Analyze"}
              onClick={() => setActiveMainContent("Analyze")}
            >
              Analyze
            </BfDsListItem>
            <BfDsListItem
              active={activeMainContent === "Chat"}
              onClick={() => setActiveMainContent("Chat")}
            >
              Chat
            </BfDsListItem>
          </BfDsList>
        </div>
      </div>
    </>
  );
}
