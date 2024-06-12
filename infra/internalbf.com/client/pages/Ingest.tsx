import { React } from "deps.ts";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "infra/internalbf.com/client/components/InternalMediaList.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";

export function Ingest() {
  return (
    <div className="internalPage">
      <div className="internalSidebar">
        <div className="internalLogo">
          <div style={{ height: 32 }}>
            <BfSymbol color="var(--textLight)" />
          </div>
          <div>InternalBF</div>
        </div>
        <div>Pages List</div>
        <div>Profile</div>
      </div>
      <div className="internalMain">
        <div className="internalMainHeader">
          <InternalMediaIngestion />
        </div>
        <div className="internalMainContent">
          <InternalMediaList />
        </div>
      </div>
    </div>
  );
}
