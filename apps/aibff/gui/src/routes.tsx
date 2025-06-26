import * as React from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
// import { Hello } from "./components/Hello.tsx";

export type RouteConfig = {
  path: string;
  Component: React.ComponentType;
  title?: string;
};

// Placeholder components - we'll implement these next
function ChatView() {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; text: string; sender: "user" | "ai" }>
  >([
    {
      id: "1",
      text:
        "Hello! I'm here to help you create graders for classification tasks. What would you like to classify?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user" as const,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (will be replaced with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text:
          "I understand you want to classify that. Let me help you set up a grader. (This is a placeholder response - GraphQL integration coming soon)",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 200px)",
      }}
    >
      <h2>Chat Interface</h2>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: "#1f2021",
          border: "1px solid var(--bfds-border)",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: message.sender === "user"
                ? "var(--bfds-primary)"
                : "#2a2b2c",
              color: message.sender === "user"
                ? "var(--bfds-background)"
                : "var(--bfds-text)",
              border: message.sender === "user"
                ? "none"
                : "1px solid var(--bfds-border)",
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "70%",
              marginLeft: message.sender === "user" ? "auto" : "0",
              marginRight: message.sender === "user" ? "0" : "auto",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
              {message.sender === "user" ? "You" : "AI Assistant"}
            </div>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              padding: "0.75rem",
              color: "var(--bfds-text-secondary)",
              fontStyle: "italic",
            }}
          >
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid var(--bfds-border)",
            backgroundColor: "var(--bfds-background)",
            color: "var(--bfds-text)",
            resize: "vertical",
            minHeight: "60px",
            maxHeight: "200px",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
          disabled={isLoading}
        />
        <BfDsButton
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          variant="primary"
          icon="arrowRight"
        >
          Send
        </BfDsButton>
      </div>
    </div>
  );
}

function SamplesView() {
  return (
    <div>
      <h2>Samples</h2>
      <p>Sample management interface will go here</p>
    </div>
  );
}

function GradersView() {
  return (
    <div>
      <h2>Graders</h2>
      <p>Grader configuration interface will go here</p>
    </div>
  );
}

function EvaluationsView() {
  return (
    <div>
      <h2>Evaluations</h2>
      <p>Evaluation results interface will go here</p>
    </div>
  );
}

export const routes: Array<RouteConfig> = [
  {
    path: "/",
    Component: ChatView,
    title: "Chat",
  },
  {
    path: "/samples",
    Component: SamplesView,
    title: "Samples",
  },
  {
    path: "/graders",
    Component: GradersView,
    title: "Graders",
  },
  {
    path: "/evaluations",
    Component: EvaluationsView,
    title: "Evaluations",
  },
];
