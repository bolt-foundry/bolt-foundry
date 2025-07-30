import { useEvalContext } from "@bfmono/apps/boltfoundry-com/contexts/EvalContext.tsx";
import { DecksView } from "../Decks/DecksView.tsx";
import { AnalyzeView } from "../Analyze/AnalyzeView.tsx";
import { ChatView } from "../Chat/ChatView.tsx";

export function MainContent({ evalData }: { evalData?: any }) {
  const { activeMainContent, rightSidebarMode } = useEvalContext();

  const renderMainContent = () => {
    switch (activeMainContent) {
      case "Decks":
        return <DecksView evalData={evalData} />;
      case "Analyze":
        return <AnalyzeView />;
      case "Chat":
        return <ChatView />;
      default:
        return <DecksView evalData={evalData} />;
    }
  };

  return (
    <div
      className={`eval-main-area ${
        rightSidebarMode === "grading" ? "eval-main-area--compressed" : ""
      }`}
    >
      <div
        className={`eval-main-content ${
          activeMainContent === "Chat" ? "chat-active" : ""
        }`}
      >
        {renderMainContent()}
      </div>
    </div>
  );
}
