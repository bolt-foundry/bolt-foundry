import { React, ReactRelay } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import type { TooltipMenu } from "packages/bfDs/Tooltip.tsx";
// import { captureEvent } from "packages/events/mod.ts";
// import {
//   UserProfileQuery,
//   UserProfileQuery$data,
// } from "packages/__generated__/UserProfileQuery.graphql.ts";

const { useMutation, useLazyLoadQuery } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  profilePic: {
    aspectRatio: "1/1",
    borderRadius: "50%",
    margin: 10,
    objectFit: "cover",
  },
};

// const logoutMutation = await graphql`
//   mutation UserProfileLogoutMutation {
//     logout {
//       name
//       }
//     }
// `;

// const userProfileQuery = await graphql`
//   query UserProfileQuery {
//     currentViewer {
//       actor {
//         name
//         id
//       }
//       person {
//         id
//         accounts(first: 10) {
//           pageInfo {
//             hasNextPage
//           }
//           nodes {
//             displayName
//             id
//             organizationBfGid
//           }
//         }
//       }
//     }
//   }
// `;

// const switchAccountMutation = await graphql`
//   mutation UserProfileSwitchAccountMutation($accountId: ID!) {
//     switchAccount(accountId: $accountId) {
//       actor {
//         name
//       }
//     }
//   }
// `;

export function UserProfile() {
  // const [commit, inFlight] = useMutation(logoutMutation);
  // const [switchAccount, switchingInFlight] = useMutation(switchAccountMutation);
  const inFlight = false;
  const switchingInFlight = false;

  const onLogout = () => {
    console.log("Logout");
    // commit({
    //   variables: {},
    //   onCompleted: (_response, errors) => {
    //     if (errors) {
    //       // nothing to do
    //     } else {
    //       // captureEvent("logout", "succeeded", {}, personId);
    //       window.location.assign("/");
    //     }
    //   },
    //   onError: (error) => {
    //     // deno-lint-ignore no-console
    //     console.log(error.message);
    //   },
    // });
  };

  // const accountsQuery = useLazyLoadQuery<UserProfileQuery>(
  //   userProfileQuery,
  //   {},
  // );
  const accountsQuery = {
    currentViewer: {
      person: { id: "1", accounts: [] },
      actor: { id: "1" },
    },
  };
  const personId = accountsQuery?.currentViewer?.person?.id;
  const actorId = accountsQuery?.currentViewer?.actor?.id;
  const accountsMenuData =
    accountsQuery?.currentViewer?.person?.accounts?.nodes ?? [];
  const accountsMenu = accountsMenuData.map(
    (account) => {
      if (!account) return null;
      const organizationId = account.organizationBfGid;
      let icon = "user";
      if (organizationId === actorId) {
        icon = "check";
      }
      return {
        label: account.displayName,
        showSpinner: switchingInFlight,
        icon,
        onClick: () => {
          // captureEvent("switch account", "clicked", {}, personId);
          switchAccount({
            variables: { accountId: account.id },
            onCompleted: (response, errors) => {
              if (errors) {
                const errorMessage = errors.map((e: { message: string }) =>
                  e.message
                )
                  .join(", ");
                // deno-lint-ignore no-console
                console.log(errorMessage);
                // setSwitchAccountError(errorMessage);
              } else {
                // captureEvent("switch account", "succeeded", {}, personId);
                window.location.reload(); // TODO fix navigate() in RouterContext
              }
            },
            onError: (error) => {
              // deno-lint-ignore no-console
              console.log(error.message);
              // setSwitchAccountError(error.message);
            },
          });
        },
        testId: `menu-item-switch-account-${account.id}`,
      };
    },
  ).filter(Boolean) as TooltipMenu[];

  const tooltipMenu = [
    ...accountsMenu,
    {
      label: "Logout",
      icon: "cross",
      onClick: onLogout,
      showSpinner: inFlight,
      testId: "menu-item-logout",
    },
  ] as TooltipMenu[];

  return (
    <Button
      kind="secondary"
      iconLeft={"friend"}
      size="medium"
      tooltipMenuDropdown={tooltipMenu}
      tooltipJustification="end"
      tooltipPosition="right"
      testId="button-menu-user-profile"
    />
  );
}
