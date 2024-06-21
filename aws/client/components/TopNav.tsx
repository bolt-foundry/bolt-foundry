import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Logo from "aws/client/images/bf-logo.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import Icon from "aws/client/ui_components/Icon.tsx";
import Tooltip from "aws/client/ui_components/Tooltip.tsx";
import { useAppState } from "aws/client/contexts/AppStateContext.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { Link } from "aws/client/components/Link.tsx";

const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  topNav: {
    backgroundColor: "var(--sidebarBackground)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    boxSizing: "border-box",
    height: 40,
  },
  container: {
    width: 160,
    height: 20,
  },
  iconButton: {
    position: "relative",
    cursor: "pointer",
    height: 24,
  },
};

type Props = {
  setMobileProjectListOpen: (open: boolean) => void;
};

const logoutMutation = await graphql`
  mutation TopNavLogoutMutation {
    logout {
      name
      }
    }
`;

export default function TopNav({ setMobileProjectListOpen }: Props) {
  const [commit, inFlight] = useMutation(logoutMutation);
  const { setSettingsOpen } = useAppState();
  const { navigate } = useRouter();

  const onLogout = () => {
    commit({
      variables: {},
      onCompleted: (response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          // deno-lint-ignore no-console
          console.log(errorMessage);
        } else {
          navigate("/");
        }
      },
      onError: (error) => {
        // deno-lint-ignore no-console
        console.log(error.message);
      },
    });
  };

  const menu = [
    {
      label: "New Project",
      onClick: () => navigate("/projects"),
    },
    {
      kind: "separator",
    },
    {
      label: "Projects",
      onClick: () => setMobileProjectListOpen(true),
    },
    {
      label: "Settings",
      onClick: () => {
        setSettingsOpen(true);
      },
    },
    {
      kind: "separator",
    },
    {
      label: inFlight ? "Logging out..." : "Logout",
      onClick: onLogout,
    },
  ];

  return (
    <div className="top-nav" style={styles.topNav}>
      <div className="top-nav-left">
        <div style={styles.container}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </div>
      <div className="top-nav-right">
        <Tooltip
          menu={menu}
          justification="end"
          position="bottom"
        >
          <div className="iconButton" style={styles.iconButton}>
            <Icon name="menu" size={24} color={"var(--background)"} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
