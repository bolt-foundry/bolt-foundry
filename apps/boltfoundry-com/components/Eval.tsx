import { iso } from "@iso-bfc";
import { EvalProvider } from "../contexts/EvalContext.tsx";
import { Header } from "./Evals/Layout/Header.tsx";
import { LeftSidebar } from "./Evals/Layout/LeftSidebar.tsx";
import { MainContent } from "./Evals/Layout/MainContent.tsx";
import { RightSidebar } from "./Evals/Layout/RightSidebar.tsx";

function EvalContent() {
  return (
    <div className="eval-page">
      <Header />
      <div className="eval-layout">
        <div className="eval-content">
          <LeftSidebar />
          <MainContent />
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
