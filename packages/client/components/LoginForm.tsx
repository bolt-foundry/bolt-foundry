import { React, ReactRelay } from "deps.ts";
import { graphql, } from "packages/client/deps.ts";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
const { useEffect, useRef } = React;

const { useMutation } = ReactRelay;

export function LoginForm() {
  return <GoogleLoginButton />;
}

const loginWithGoogleMutation = await graphql`
  mutation LoginFormLoginWithGoogleMutation($credential: String!) {
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
          navigate("/awsprojects/new/");
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
        navigate("/awsprojects/new/");
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
