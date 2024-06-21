import { graphql, Maybe, React, ReactRelay } from "aws/client/deps.ts";
import { textStyles } from "aws/client/ui_components/ui_const.tsx";
import Tabs from "aws/client/ui_components/Tabs.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import { SettingsQuery_me$key } from "aws/__generated__/SettingsQuery_me.graphql.ts";
import { captureEvent } from "aws/events/mod.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { PasswordResetForm } from "aws/client/pages/ResetPasswordPage.tsx";
import SettingsProjectTab from "aws/client/components/SettingsProjectTab.tsx";
import Toggle from "aws/client/ui_components/Toggle.tsx";
import { useAppState } from "aws/client/contexts/AppStateContext.tsx";

const { useFragment } = ReactRelay;

type Props = {
  person$key: Maybe<SettingsQuery_me$key>;
};

const styles: Record<string, React.CSSProperties> = {
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  description: {
    fontSize: 14,
    color: "var(--textSecondary)",
    marginBottom: 20,
  },
  h3: {
    fontWeight: 700,
    marginBottom: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },
  profilePic: {
    borderRadius: "50%",
    width: 130,
    height: 130,
    objectFit: "cover",
  },
  requirements: {
    width: 150,
    border: "1px solid var(--border)",
    fontSize: "0.83em",
    padding: 20,
  },
  tabContent: {
    marginTop: 20,
  },
};

const fragment = await graphql`
  fragment SettingsQuery_me on Person {
    ...SettingsProjectTabQuery_me
    name
    email
  }
`;

export default function Settings({ person$key }: Props) {
  const { darkMode, setDarkMode } = useAppState();
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const data = useFragment(fragment, person$key);
  const [selectedTabName, setSelectedTabName] = React.useState("Project");

  React.useEffect(() => {
    captureEvent("settings", "opened", {}, personId);
  }, []);

  const tabs = [
    {
      name: "Project",
    },
    {
      name: "Profile",
    },
    {
      name: "Password",
    },
  ];

  let tabContent: React.ReactNode;
  switch (selectedTabName) {
    case "Project":
    default:
      tabContent = (
        <div style={styles.tabContent}>
          <div style={textStyles.h2}>Project settings</div>
          <div style={styles.description}>
            These are the default settings for projects. You can override these
            settings in each project.
          </div>
          <SettingsProjectTab key={data?.email} person$key={data} />
        </div>
      );
      break;
    case "Profile":
      tabContent = (
        <div style={styles.tabContent}>
          <div style={textStyles.h2}>Profile settings</div>
          <div style={styles.row}>
            {
              /* <div style={styles.column}>
            <img
              src={data?.picture?.url ?? ""}
              alt="Profile picture"
              style={styles.profilePic}
            />
            <Button
              text="Upload"
              kind="outline"
              onClick={() => console.log("todo upload")}
            />
          </div> */
            }
            <div style={styles.setting}>
              <Input
                label="Name"
                type="text"
                name="name"
                onChange={() => {
                  // deno-lint-ignore no-console
                  console.log("todo");
                }}
                value={data?.name ?? ""}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                onChange={() => {
                  // deno-lint-ignore no-console
                  console.log("todo");
                }}
                value={data?.email ?? ""}
              />
              <a href="/stripe-portal">Billing Settings</a>
            </div>
          </div>
          <div style={{ ...textStyles.h2, marginTop: 24 }}>
            Display settings
          </div>
          <div style={styles.row}>
            <div style={styles.setting}>
              Dark mode
              <Toggle
                value={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>
          </div>
        </div>
      );
      break;
    case "Password":
      tabContent = (
        <div style={styles.tabContent}>
          <div style={textStyles.h2}>Password</div>
          <div style={styles.setting}>
            <Input
              label="Current password"
              type="password"
              name="currentPassword"
              onChange={() => {
                // deno-lint-ignore no-console
                console.log("todo");
              }}
              value={"********"}
            />
          </div>
          <PasswordResetForm />
        </div>
      );
      break;
  }

  return (
    <div style={styles.content}>
      <Tabs tabs={tabs} onTabSelected={setSelectedTabName} />
      {tabContent}
    </div>
  );
}
