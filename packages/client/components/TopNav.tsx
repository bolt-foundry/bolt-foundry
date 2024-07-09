import { React, ReactRelay } from "deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { colors } from "packages/bfDs/const.tsx";
import { Icon } from "packages/bfDs/Icon.tsx";
import { Tooltip } from "packages/bfDs/Tooltip.tsx";
import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { Link } from "packages/bfDs/Link.tsx";

const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  topNav: {
    backgroundColor: colors.sidebarBackground,
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

// const logoutMutation = await graphql`
//   mutation TopNavLogoutMutation {
//     logout {
//       name
//       }
//     }
// `;

export function TopNav({ setMobileProjectListOpen }: Props) {
  // const [commit, inFlight] = useMutation(logoutMutation);
  const inFlight = false;
  const { setSettingsOpen } = useAppState();
  const { navigate } = useRouter();

  const onLogout = () => {
    console.log("logout");
    // commit({
    //   variables: {},
    //   onCompleted: (response, errors) => {
    //     if (errors) {
    //       const errorMessage = errors.map((e: { message: string }) => e.message)
    //         .join(", ");
    //       console.log(errorMessage);
    //     } else {
    //       navigate("/");
    //     }
    //   },
    //   onError: (error) => {
    //     console.log(error.message);
    //   },
    // });
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
            <BfLogo />
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
            <Icon name="menu" size={24} color={colors.background} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
