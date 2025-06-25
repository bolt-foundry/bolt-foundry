import * as React from "react";
import { BfDsLiteButton } from "@bfmono/apps/bfDsLite";
// import { Hello } from "./components/Hello.tsx";

export type RouteConfig = {
  path: string;
  Component: React.ComponentType;
  title?: string;
};

// Placeholder components - we'll implement these next
function ChatView() {
  const [clickCount, setClickCount] = React.useState(0);

  return (
    <div>
      <h2>Chat Interface</h2>
      <p>AI conversation interface will go here</p>
      {/* <Hello hello="Hello from GraphQL!" /> */}
      <div>GraphQL integration coming soon...</div>

      {/* Test BfDsLite integration */}
      <div style={{ marginTop: "2rem" }}>
        <h3>BfDsLite Test</h3>
        <p>Button clicked: {clickCount} times</p>
        <BfDsLiteButton
          onClick={() => {
            setClickCount(clickCount + 1);
          }}
          variant="primary"
        >
          Test BfDsLite Button
        </BfDsLiteButton>
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
