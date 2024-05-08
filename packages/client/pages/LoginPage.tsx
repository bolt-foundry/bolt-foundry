import { React, ReactRelay } from "deps.ts";
// import { graphql, ReactRelay } from "deps.ts";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Spinner } from "packages/bfDs/Spinner.tsx";
import { LoginForm } from "packages/client/components/LoginForm.tsx";
// import { captureEvent } from "packages/events/mod.ts";
import { LoginPageCVQuery } from "packages/__generated__/LoginPageCVQuery.graphql.ts";
// import { useFeatureFlag } from "packages/client/hooks/featureFlagHooks.tsx";

const { useQueryLoader, useMutation, useLazyLoadQuery } = ReactRelay;
const { Suspense, useEffect } = React;

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: "auto",
    padding: "0 10%",
  },
  content: {
    width: "60vw",
    maxWidth: "100%",
  },
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
  },
};

// const logoutMutation = await graphql`
//   mutation LoginPageLogoutMutation {
//     logout {
//       __typename
//       }
//     }
// `;

// const cvQuery = await graphql`
//   query LoginPageCVQuery {
//     currentViewer {
//       person {
//         name
//       }
//     }
//   }`;

function LoginPageContent() {
  // const cvData = useLazyLoadQuery<LoginPageCVQuery>(cvQuery, {});
  const cvData = {
    currentViewer: {
      person: {
        name: "Test",
      },
    },
  };
  const logoutInFlight = false;

  // const [_logoutError, setLogoutError] = React.useState<string | null>(null);
  // const [logoutCommit, logoutInFlight] = useMutation(logoutMutation);

  const loggedInPerson = cvData?.currentViewer?.person;

  useEffect(() => {
    // captureEvent("loginPage", "loaded");
  }, []);

  const onLogout = () => {
    console.log("logout");
    // logoutCommit({
    //   variables: {},
    //   onCompleted: (response, errors) => {
    //     if (errors) {
    //       const errorMessage = errors.map((e: { message: string }) => e.message)
    //         .join(", ");
    //       setLogoutError(errorMessage);
    //     } else {
    //       window.location.assign("/"); // TODO fix navigate() in RouterContext
    //     }
    //   },
    //   onError: (error) => {
    //     setLogoutError(error.message);
    //   },
    // });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {loggedInPerson && (
          <div>
            Logged in as {loggedInPerson.name}. Not you?{" "}
            <Button
              showSpinner={logoutInFlight}
              text="Logout"
              onClick={onLogout}
            />
          </div>
        )}
        {!loggedInPerson && <LoginForm />}
      </div>
    </div>
  );
}

export function LoginPage() {
  const spinner = (
    <div style={styles.container}>
      <div style={styles.content}>
        <Spinner backgroundColor={"var(--background)"} />
      </div>
    </div>
  );

  return (
    <MarketingFrame header="Welcome back!">
      <Suspense fallback={spinner}>
        <LoginPageContent />
      </Suspense>
    </MarketingFrame>
  );
}
