import { Maybe, React, ReactRelay } from "deps.ts";
import { InternalBfPageTitle } from "packages/client/components/InternalBfPageTitle.tsx";
import { InternalBfMediaProjectList } from "packages/client/components/InternalBfMediaProjectList.tsx";
import { UserProfile } from "packages/client/components/UserProfile.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { fonts } from "packages/bfDs/const.tsx";
import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
// import { LeftNav_me$key } from "packages/__generated__/LeftNav_me.graphql.ts";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
// import { captureEvent } from "packages/events/mod.ts";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";

const styles: Record<string, React.CSSProperties> = {
  actions: {
    display: "flex",
    justifyContent: "end",
    margin: 10,
    gap: 10,
  },
  leftNav: {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "var(--sidebarBackground)",
    color: "var(--text)",
    fontFamily: fonts.fontFamily,
    position: "relative",
    height: "100%",
  },
  buttons: {
    marginTop: 15,
    padding: 20,
  },
  buttonsCollapsed: {
    padding: "20px 10px",
  },
  collapseButton: {
    position: "absolute",
    right: 5,
    height: 60,
    width: 20,
    top: "calc(50% - 30px)",
    cursor: "pointer",
  },
  projectList: {
    // backgroundColor: "var(--sidebarBackgroundDark)",
    padding: "16px 8px",
    boxSizing: "border-box",
    flex: 1,
    overflowY: "auto",
  },
  triangle: {
    fill: "#bababa",
  },
};

// const fragment = await graphql`
//   fragment LeftNav_me on Person {
//     ...ProjectList_me
//   }
// `;

type ContentProps = {
  person$key: LeftNav_me$key;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};
function LeftNavContent({ person$key, collapsed, setCollapsed }: ContentProps) {
  // const { currentViewer: { id: personId } } = useAppEnvironment();
  const { setSettingsOpen } = useAppState();
  const { navigate } = useRouter();
  // const data = ReactRelay.useFragment(fragment, person$key);
  const data = { me: {} };

  function handleCollapseButton() {
    if (collapsed) {
      // captureEvent("sidebar", "opened", {}, personId);
    }
    setCollapsed(!collapsed);
  }

  const trianglePoints = collapsed ? "10,0 20,8 10,16" : "20,0 10,8 20,16";

  const actionStyle: React.CSSProperties = {
    ...styles.actions,
    flexDirection: collapsed ? "column" : "row",
  };

  return (
    <>
      <div style={collapsed ? styles.buttonsCollapsed : styles.buttons}>
        <Button
          kind="outline"
          text={collapsed ? null : "Media"}
          /* needs "video play" icon */
          iconLeft="clipping"
          size={collapsed ? "medium" : "large"}
          tooltip="Create new media"
          tooltipPosition="right"
          testId="button-create-new-project"
          /* needs onclick to do something */
        />
      </div>
      <div style={styles.projectList}>
        {!collapsed && (
          <InternalBfMediaProjectList
            person$key={data}
          />
        )}
      </div>
      <div style={actionStyle}>
        <UserProfile />
        <div key="settings" style={styles.settingsButton}>
          <Button
            kind="secondary"
            iconLeft="settings"
            size="medium"
            onClick={() => setSettingsOpen(true)}
            testId="button-settings"
          />
        </div>
      </div>

      <div
        style={styles.collapseButton}
        onClick={handleCollapseButton}
        data-bf-testid={`toggle-sidebar-${collapsed ? "open" : "close"}`}
      >
        <svg height="16" width="20">
          <polygon points={trianglePoints} style={styles.triangle} />
          &gt;
        </svg>
      </div>
    </>
  );
}

type Props = {
  person$key?: Maybe<LeftNav_me$key>;
};
export function InternalBfLeftNav({ person$key }: Props) {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const width = collapsed ? 50 : 300;

  return (
    <div style={{ ...styles.leftNav, width }}>
      <InternalBfPageTitle collapsed={collapsed} />
      {person$key && (
        <LeftNavContent
          person$key={person$key}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}
    </div>
  );
}
