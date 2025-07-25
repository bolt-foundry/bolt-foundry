import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useEffect, useRef } from "react";
import { useEvalContext } from "@bfmono//home/runner/workspace/apps/boltfoundry-com/contexts/EvalContext.tsx";

export function RightSidebar() {
  const { rightSidebarOpen, rightSidebarContent, closeRightSidebar } =
    useEvalContext();
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Mark that we've had at least one state change after initial render
    hasAnimated.current = true;
  }, [rightSidebarOpen]);

  // Always render placeholder, animate based on right sidebar state
  const placeholderClass = rightSidebarOpen
    ? `eval-right-sidebar-placeholder eval-right-sidebar-placeholder--open ${
      hasAnimated.current ? "eval-right-sidebar-placeholder--animate" : ""
    }`
    : `eval-right-sidebar-placeholder ${
      hasAnimated.current ? "eval-right-sidebar-placeholder--animate" : ""
    }`;

  // Sidebar always uses transform animation
  const sidebarClass = `eval-right-sidebar ${
    !rightSidebarOpen ? "eval-right-sidebar--hidden" : ""
  }`;

  return (
    <>
      <div className={placeholderClass}></div>
      <div className={sidebarClass}>
        <div className="eval-sidebar-content">
          <div className="eval-sidebar-header">
            <h3>{rightSidebarContent}</h3>
            <BfDsButton
              variant="ghost"
              icon="cross"
              iconOnly
              onClick={closeRightSidebar}
            />
          </div>
          <div className="eval-sidebar-body">
            <p>Content for: {rightSidebarContent}</p>
          </div>
        </div>
      </div>
    </>
  );
}
