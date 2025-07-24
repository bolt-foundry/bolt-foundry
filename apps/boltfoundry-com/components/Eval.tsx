import { iso } from "@iso-bfc";
import { Nav } from "./Nav.tsx";
import { EvalProvider, useEvalContext } from "../contexts/EvalContext.tsx";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { useEffect, useRef } from "react";

function LeftSidebar() {
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
          <h3>Navigation</h3>
          <div className="eval-nav-buttons">
            <BfDsButton
              variant={activeMainContent === "Decks" ? "primary" : "outline"}
              onClick={() => setActiveMainContent("Decks")}
            >
              Decks
            </BfDsButton>
            <BfDsButton
              variant={activeMainContent === "Analyze" ? "primary" : "outline"}
              onClick={() => setActiveMainContent("Analyze")}
            >
              Analyze
            </BfDsButton>
            <BfDsButton
              variant={activeMainContent === "Chat" ? "primary" : "outline"}
              onClick={() => setActiveMainContent("Chat")}
            >
              Chat
            </BfDsButton>
          </div>
        </div>
      </div>
    </>
  );
}

function MainArea() {
  const { activeMainContent, openRightSidebar } = useEvalContext();

  const renderMainContent = () => {
    switch (activeMainContent) {
      case "Decks":
        return (
          <div>
            <h2>Decks</h2>
            <p>
              Decks are evaluation frameworks that define how AI responses
              should be graded. Each deck contains multiple cards that specify
              different aspects of evaluation, such as helpfulness, accuracy,
              creativity, and adherence to guidelines. You can create custom
              decks for your specific use cases, modify existing templates, or
              use our pre-built evaluation frameworks.
            </p>
            <p>
              The deck system allows you to maintain consistency across
              different evaluations while providing flexibility to adapt to
              various scenarios. You can organize decks by project, model type,
              or evaluation criteria. Each deck can be shared across your
              organization and versioned to track improvements over time.
            </p>
            <p>
              When you run an evaluation, the deck determines which criteria are
              applied and how scores are calculated. The system supports both
              automated scoring and human feedback collection, allowing you to
              implement comprehensive RLHF workflows that combine the efficiency
              of automation with the nuance of human judgment.
            </p>
            <div className="eval-main-buttons">
              <BfDsButton onClick={() => openRightSidebar("Deck Details")}>
                View Deck Details
              </BfDsButton>
              <BfDsButton onClick={() => openRightSidebar("Deck Settings")}>
                Deck Settings
              </BfDsButton>
            </div>
          </div>
        );
      case "Analyze":
        return (
          <div>
            <h2>Analyze</h2>
            <p>
              The analysis view provides comprehensive insights into your AI
              model's performance across different evaluation criteria. Here you
              can review aggregated scores, identify patterns in model behavior,
              and track improvements over time. The dashboard displays key
              metrics such as average scores, distribution of ratings, and
              comparative analysis between different model versions or
              configurations.
            </p>
            <p>
              Advanced analytics help you understand where your model excels and
              where it needs improvement. You can drill down into specific
              evaluation categories, compare performance across different types
              of prompts, and analyze the correlation between automated scores
              and human feedback. The system provides detailed breakdowns of
              scoring patterns and highlights areas that might benefit from
              additional training data.
            </p>
            <p>
              Export capabilities allow you to generate reports for
              stakeholders, create presentations of model performance, and
              integrate findings into your development workflow. The analysis
              tools support both real-time monitoring of live models and
              historical analysis of evaluation datasets, helping you make
              data-driven decisions about model improvements.
            </p>
            <div className="eval-main-buttons">
              <BfDsButton onClick={() => openRightSidebar("Analysis Results")}>
                View Results
              </BfDsButton>
              <BfDsButton onClick={() => openRightSidebar("Analysis Config")}>
                Configure Analysis
              </BfDsButton>
            </div>
          </div>
        );
      case "Chat":
        return (
          <div>
            <h2>Chat</h2>
            <p>
              The chat interface allows you to interact directly with your AI
              models while collecting evaluation data in real-time. This
              conversational approach to evaluation enables more natural testing
              scenarios and helps identify edge cases that might not be captured
              in traditional batch evaluation methods. You can conduct
              exploratory conversations, test specific scenarios, and gather
              immediate feedback on model responses.
            </p>
            <p>
              Each chat session is automatically logged and can be evaluated
              using your configured decks. The system captures not just the
              final responses but the entire conversation context, allowing for
              more nuanced evaluation of multi-turn interactions. You can pause
              conversations at any point to provide human feedback, rate
              responses, or flag interesting examples for further analysis.
            </p>
            <p>
              Advanced features include conversation branching, where you can
              explore different response paths from the same point in a
              conversation, and comparative evaluation, where multiple model
              variants can respond to the same prompts side by side. The chat
              history serves as a valuable dataset for understanding model
              behavior in interactive scenarios and can be used to improve
              future model iterations.
            </p>
            <div className="eval-main-buttons">
              <BfDsButton onClick={() => openRightSidebar("Chat History")}>
                View History
              </BfDsButton>
              <BfDsButton onClick={() => openRightSidebar("Chat Settings")}>
                Chat Settings
              </BfDsButton>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="eval-main-area">
      <div className="eval-main-content">
        {renderMainContent()}
      </div>
    </div>
  );
}

function RightSidebar() {
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

function EvalContent() {
  const { setLeftSidebarOpen, leftSidebarOpen } = useEvalContext();

  return (
    <div className="eval-page">
      <Nav
        page="eval"
        onSidebarToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        sidebarOpen={leftSidebarOpen}
      />
      <div className="eval-layout">
        <div className="eval-content">
          <LeftSidebar />
          <MainArea />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export const Eval = iso(`
  field Query.Eval @component {
    __typename
  }
`)(function Eval({ data: _data }) {
  return (
    <EvalProvider>
      <EvalContent />
    </EvalProvider>
  );
});
