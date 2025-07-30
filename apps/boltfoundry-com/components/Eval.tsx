import { iso } from "@iso-bfc";
import { EvalProvider } from "../contexts/EvalContext.tsx";
import { Header } from "./Evals/Layout/Header.tsx";
import { LeftSidebar } from "./Evals/Layout/LeftSidebar.tsx";
import { MainContent } from "./Evals/Layout/MainContent.tsx";
import { RightSidebar } from "./Evals/Layout/RightSidebar.tsx";

function EvalContent({ data }: { data: any }) {
  return (
    <div className="eval-page">
      <Header />
      <div className="eval-layout">
        <div className="eval-content">
          <LeftSidebar />
          <MainContent evalData={data} />
          <RightSidebar evalData={data} />
        </div>
      </div>
    </div>
  );
}

export const Eval = iso(`
  field Query.Eval @component {
    currentViewer {
      id
      personBfGid
      orgBfOid
    }
  }
`)(function Eval({ data }) {
  return (
    <EvalProvider>
      <EvalContent data={data} />
    </EvalProvider>
  );
});
