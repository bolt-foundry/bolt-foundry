import type * as React from "react";
import { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";

type MainLayoutProps = {
  sidebar: React.ReactNode;
  conversation: React.ReactNode;
  cards?: React.ReactNode;
  detailView?: React.ReactNode;
};

export function MainLayout({
  sidebar,
  conversation,
  cards,
  detailView,
}: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCards, setShowCards] = useState(true);

  return (
    <div>
      {/* Navigation Sidebar */}
      <div>
        <div>
          <div>
            {!isSidebarCollapsed && <h2>RLHF</h2>}
            <BfDsButton
              variant="ghost"
              size="small"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <BfDsIcon
                name={isSidebarCollapsed ? "arrowRight" : "arrowLeft"}
                size="small"
              />
            </BfDsButton>
          </div>
        </div>
        <div>
          {sidebar}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Chat/Conversation Area */}
        <div>
          {conversation}
        </div>

        {/* Cards/Detail Panel */}
        {(cards || detailView) && (
          <div>
            <div>
              <div>
                <h3>
                  {detailView ? "Details" : "Activity"}
                </h3>
                <BfDsButton
                  variant="ghost"
                  size="small"
                  onClick={() => setShowCards(!showCards)}
                >
                  <BfDsIcon
                    name={showCards ? "cross" : "menu"}
                    size="small"
                  />
                </BfDsButton>
              </div>
            </div>
            <div>
              {detailView || cards}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
