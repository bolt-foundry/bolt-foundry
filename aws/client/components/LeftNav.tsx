import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import PageTitle from "aws/client/components/PageTitle.tsx";
import ProjectList from "aws/client/components/ProjectList.tsx";
import UserProfile from "aws/client/components/UserProfile.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import { useAppState } from "aws/client/contexts/AppStateContext.tsx";
import { LeftNav_me$key } from "aws/__generated__/LeftNav_me.graphql.ts";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { captureEvent } from "aws/events/mod.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";

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
    backgroundColor: "var(--sidebarBackground)",
    color: "var(--sidebarText)",
    fontFamily: fonts.fontFamily,
    position: "relative",
    height: "100%",
  },
  buttons: {
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
    backgroundColor: "var(--sidebarBackgroundDark)",
    padding: "16px 8px",
    boxSizing: "border-box",
    flex: 1,
    overflowY: "auto",
  },
  triangle: {
    fill: "#bababa",
  },
};

const fragment = await graphql`
  fragment LeftNav_me on Person {
    ...ProjectList_me
  }
`;

type ContentProps = {
  person$key: LeftNav_me$key;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};
function LeftNavContent({ person$key, collapsed, setCollapsed }: ContentProps) {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const { setSettingsOpen } = useAppState();
  const { navigate } = useRouter();
  const data = ReactRelay.useFragment(fragment, person$key);

  function handleCollapseButton() {
    if (collapsed) {
      captureEvent("sidebar", "opened", {}, personId);
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
          text={collapsed ? null : "New project"}
          iconLeft="plus"
          size={collapsed ? "medium" : "large"}
          tooltip="Create a new project"
          tooltipPosition="right"
          onClick={() => navigate("/projects/")}
          testId="button-create-new-project"
        />
      </div>
      <div style={styles.projectList}>
        {!collapsed && (
          <ProjectList
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
function LeftNav({ person$key }: Props) {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const width = collapsed ? 50 : 300;

  return (
    <div style={{ ...styles.leftNav, width }}>
      <PageTitle collapsed={collapsed} />
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

export default LeftNav;
