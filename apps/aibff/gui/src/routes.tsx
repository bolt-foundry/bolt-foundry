import type * as React from "react";
import { ChatWithIsograph } from "./components/ChatWithIsograph.tsx";

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
    Component: ChatWithIsograph,
    title: "Chat",
  },
  {
    path: "/chat/:conversationId",
    Component: ChatWithIsograph,
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
