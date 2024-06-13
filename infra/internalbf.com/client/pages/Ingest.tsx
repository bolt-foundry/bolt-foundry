import { React } from "deps.ts";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "infra/internalbf.com/client/components/InternalMediaList.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { UserProfile } from "packages/client/components/UserProfile.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
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
        <div className="internalTabs">
          <div style={{ display: "flex", gap: 5 }}>
            <Icon name="clipping" />Media
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <Icon name="subtitle" />Organiations
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <Icon name="pencil" />Projects
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, margin: 20 }}>
          <UserProfile />
        </div>
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
