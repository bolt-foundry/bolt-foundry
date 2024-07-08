import { React } from "deps.ts";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "infra/internalbf.com/client/components/InternalMediaList.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { UserProfile } from "packages/client/components/UserProfile.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { InternalHeader } from "infra/internalbf.com/client/components/InternalHeader.tsx";
export function MediaPage() {
  const { navigate } = useRouter();
  return (
    <div className="internalPage">
      <div className="internalSidebar">
        <div className="internalLogo">
          <div style={{ height: 32 }}>
            <BfSymbol
              color="var(--backgroundIcon)"
              color2="var(--textSecondary)"
            />
          </div>
          <div>InternalBF</div>
        </div>
        <div className="internalTabs">
          <div className="internalTab selected">
            <Icon name="clipping" color="var(--secondaryColor)" />Media
          </div>
          <div className="internalTab">
            <Icon name="subtitle" />Organizations
          </div>
          <div className="internalTab" onClick={() => navigate("/projects")}>
            <Icon name="pencil" />Projects
          </div>
          <div className="internalTab">
            <Icon name="settings" />System
          </div>
          <div className="internalTab">
            <Icon name="computer" />Your stuff
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, margin: 20 }}>
          <UserProfile />
        </div>
      </div>
      <div className="internalMain">
        <InternalHeader
          expandedComponent={<InternalMediaIngestion />}
          collapsedButton="Add media"
          header="Media"
        />
        <div className="internalMainContent">
          <InternalMediaList />
        </div>
      </div>
    </div>
  );
}
