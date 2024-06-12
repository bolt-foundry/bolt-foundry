/// <reference path="https://esm.sh/v135/@types/google.accounts@0.0.14/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/google.picker@0.0.42/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi.drive@0.0.9/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi@0.0.47/index.d.ts" />

import { React, ReactRelay, getLogger } from "deps.ts";
import { graphql } from "infra/internalbf.com/client/deps.ts";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Spinner } from "packages/bfDs/Spinner.tsx";
import { LoginPageCVQuery } from "packages/__generated__/LoginPageCVQuery.graphql.ts";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { useAppEnvironment } from "infra/internalbf.com/client/contexts/AppEnvironmentContext.tsx";

const { useMutation, useLazyLoadQuery } = ReactRelay;
const { Suspense, useEffect, useRef } = React;
const logger = getLogger(import.meta);

const loginWithGoogleMutation = await graphql`
  mutation LoginPageLoginWithGoogleMutation($credential: String!) {
    loginWithGoogle(credential: $credential) {
      actor {
        id
        ... on BfPerson {
          name
        }
      }
    }
  }
`;

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

function GoogleLoginButton() {
  const { navigate } = useRouter();
  const [commit] = useMutation(loginWithGoogleMutation);

  const googleSignInButtonRef = useRef(null);
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();
  const urlParams = new URLSearchParams(globalThis.location?.search) ??
    new Map();
  const hostname = urlParams.get("hostname");
  const credential = urlParams.get("credential");
  useEffect(() => {
    // TODO: We should redirect to the user's original page after login
    if (credential) {
      commit({
        variables: {
          credential,
        },
        onCompleted: () => {
          navigate("/projects/new");
        },
      });
    }
  }, [credential]);

  // TODO: We should redirect to the user's original page after login
  const onLogin = (response: google.accounts.id.CredentialResponse) => {
    if (hostname) {
      const replUrl =
        `https://${hostname}/login?credential=${response.credential}`;

      globalThis.location.assign(replUrl);
      return;
    }
    logger.debug("Google login response", response);
    commit({
      variables: {
        credential: response.credential,
      },
      onCompleted: () => {
        navigate("/projects/new");
      },
    });
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      use_fedcm_for_prompt: true,
      auto_select: true,
      callback: onLogin,
    });

    if (googleSignInButtonRef.current) {
      google.accounts.id.renderButton(
        googleSignInButtonRef.current,
        {
          theme: "outline",
          text: "continue_with",
          size: "large",
          type: "standard",
        },
      );
    }
  }, []);

  return <div ref={googleSignInButtonRef} style={{ marginTop: 20 }}></div>;
}

function LoginPageContent() {
  const cvData = useLazyLoadQuery<LoginPageCVQuery>(cvQuery, {});

  const [logoutError, setLogoutError] = React.useState<string | null>(null);
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
            <Button
              showSpinner={logoutInFlight}
              text="Logout"
              onClick={onLogout}
            />
          </div>
        )}
        {!loggedInPerson && <GoogleLoginButton />}
        {logoutError && <div style={styles.error}>{logoutError}</div>}
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
