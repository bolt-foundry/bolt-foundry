import type * as React from "react";
import { Chat } from "./components/Chat.tsx";
import { ChatWithIsograph } from "./components/ChatWithIsograph.tsx";

// Toggle this flag to switch between implementations
const useIsograph = true;

export type RouteConfig = {
  path: string;
  Component: React.ComponentType;
  title?: string;
};

// Placeholder components - we'll implement these next

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
    Component: useIsograph ? ChatWithIsograph : Chat,
    title: "Chat",
  },
  {
    path: "/chat/:conversationId",
    Component: useIsograph ? ChatWithIsograph : Chat,
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
