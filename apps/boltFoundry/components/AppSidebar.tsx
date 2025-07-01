import { CfDsList } from "@bfmono/apps/cfDs/components/CfDsList.tsx";
import { CfDsListItem } from "@bfmono/apps/cfDs/components/CfDsListItem.tsx";
import React from "react";
import { CfDsIcon } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { classnames } from "@bfmono/lib/classnames.ts";
import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";
import { useFeatureFlagEnabled } from "@bfmono/apps/boltFoundry/hooks/useFeatureFlagHooks.ts";

const sidebarRoutes = [
  {
    name: "Formatter",
    rootPath: "formatter",
  },
  // {
  //   name: "Tweet ideator",
  //   rootPath: "twitter",
  // },
  {
    name: "Blog",
    rootPath: "blog",
  },
  // {
  //   name: "FCP subtitles",
  //   rootPath: "fcp",
  // },
  // {
  //   name: "UI",
  //   rootPath: "ui",
  // },
];

export function AppSidebar({ children }: React.PropsWithChildren) {
  const { currentPath, navigate } = useRouter();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const enableSidebar = useFeatureFlagEnabled("enable_sidebar");
  if (!enableSidebar) {
    return children;
  }

  const appSidebarClasses = classnames([
    "AppSidebar",
    "dark",
    {
      active: showSidebar,
    },
  ]);

  // e.g. "/twitter/voice" -> "twitter"
  const pathForHighlighting = currentPath.split("/")[1];

  return (
    <div className="App">
      <div className={appSidebarClasses}>
        <div
          className="sidebarButton"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <CfDsIcon
            name={showSidebar ? "sidebarClose" : "sidebarOpen"}
            color="var(--alwaysLight)"
          />
        </div>
        <CfDsList>
          {sidebarRoutes.map((route) => (
            <CfDsListItem
              content={route.name}
              key={route.rootPath}
              isHighlighted={pathForHighlighting === route.rootPath}
              onClick={() => navigate(`/${route.rootPath}`)}
            />
          ))}
        </CfDsList>
      </div>
      <div className="AppContent">{children}</div>
    </div>
  );
}
