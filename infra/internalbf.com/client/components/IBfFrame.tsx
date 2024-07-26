import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Icon, IconType } from "packages/bfDs/Icon.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { IbfHeader } from "infra/internalbf.com/client/components/IBfHeader.tsx";

type Tab = {route: string, name: string, icon: IconType}
const tabs: Array<Tab> = [
  { route: "/", name: "Dashboard", icon: "home" },
  { route: "/organizations", name: "Organizations", icon: "subtitle" },
  { route: "/media", name: "Media", icon: "clipping" },
];

type IbfDashboardTabProps = {
  route: string;
  name: string;
  icon: IconType;
}

function IBfDashboardTab({ route, name, icon }: IbfDashboardTabProps) {
  const { navigate, currentPath } = useRouter();
  return (
    <div
      className={`internalTab ${
        route === currentPath ? "selected" : ""
      }`}
      onClick={() => navigate(route)}
    >
      <Icon name={icon} />
      {name}
    </div>
  );
}

function IBfDashboardTabs() {
  return (
    <div className="internalTabs">
      {tabs.map((tab) => (
        <IBfDashboardTab key={tab.route} {...tab} />
      ))}
    </div>
  );
}

type IBfFrameProps = React.PropsWithChildren<{
  header: React.ReactNode;
}>;

export function IBfFrame({children, header}: IBfFrameProps) {

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
        <IBfDashboardTabs />
      </div>
      <div className="internalMain">
        <IbfHeader
          header={header}
        />
        <div className="internalMainContent">
          {children}
        </div>
      </div>
    </div>
  );
}
