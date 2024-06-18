import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { UserProfile } from "packages/client/components/UserProfile.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { InternalProjectsList } from "infra/internalbf.com/client/components/InternalProjectsList.tsx";
import { InternalHeader } from "infra/internalbf.com/client/components/InternalHeader.tsx";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";

export function ProjectsPage() {
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
          <div className="internalTab" onClick={() => navigate("/media")}>
            <Icon name="clipping" />Media
          </div>
          <div className="internalTab">
            <Icon name="subtitle" />Organizations
          </div>
          <div
            className="internalTab selected"
            onClick={() => navigate("/projects")}
          >
            <Icon name="pencil" color="var(--secondaryColor)" />Projects
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
          collapsedButton="Add media"
          header="Projects"
        />
        <div className="internalMainContent">
          <InternalProjectsList />
        </div>
      </div>
    </div>
  );
}
