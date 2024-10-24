import { graphql } from "packages/client/deps.ts";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { LoginForm } from "packages/client/components/LoginForm.tsx";
// import { captureEvent } from "packages/events/mod.ts";
import type { LoginPageCVQuery } from "packages/__generated__/LoginPageCVQuery.graphql.ts";
// import { useFeatureFlag } from "packages/client/hooks/featureFlagHooks.tsx";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { Suspense, useEffect, useState } from "react";

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
    color: "var(--textOnAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
  },
};

const logoutMutation = await graphql`
  mutation LoginPageLogoutMutation {
    logout {
      __typename
      }
    }
`;

const cvQuery = await graphql`
  query LoginPageCVQuery {
    currentViewer {
      person {
        name
      }
    }
  }`;

function LoginPageContent() {
  const cvData = useLazyLoadQuery<LoginPageCVQuery>(cvQuery, {});

  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutCommit, logoutInFlight] = useMutation(logoutMutation);

  const loggedInPerson = cvData?.currentViewer?.person;

  useEffect(() => {
    // captureEvent("loginPage", "loaded");
  }, []);

  const onLogout = () => {
    logoutCommit({
      variables: {},
      onCompleted: (response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          setLogoutError(errorMessage);
        } else {
          window.location.assign("/"); // TODO fix navigate() in RouterContext
        }
      },
      onError: (error) => {
        setLogoutError(error.message);
      },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {loggedInPerson && (
          <div>
            Logged in as {loggedInPerson.name}. Not you?{" "}
            <BfDsButton
              showSpinner={logoutInFlight}
              text="Logout"
              onClick={onLogout}
            />
          </div>
        )}
        {!loggedInPerson && <LoginForm />}
        {logoutError && <div style={styles.error}>{logoutError}</div>}
      </div>
    </div>
  );
}

export function LoginPage() {
  const spinner = (
    <div style={styles.container}>
      <div style={styles.content}>
        <BfDsSpinner backgroundColor={"var(--background)"} />
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
