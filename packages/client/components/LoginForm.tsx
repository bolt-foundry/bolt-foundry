import { React } from "deps.ts";
import { graphql, ReactRelay } from "packages/client/deps.ts";
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
  const urlParams = new URLSearchParams(window.location.search);
  const sourceRepl = urlParams.get("sourceRepl");
  const sourceCluster = urlParams.get("sourceCluster");

  const onLogin = (response: google.accounts.id.CredentialResponse) => {
    if (sourceRepl && sourceCluster) {
      const replUrl = `https://${sourceRepl}.${sourceCluster}.replit.dev/login`;

      fetch(replUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          }
        })
        .catch((error) => {
          console.error("Error posting data to replUrl:", error);
        });
      return;
    }
    logger.debug("Google login response", response);
    commit({
      variables: {
        credential: response.credential,
      },
      onCompleted: () => {
        navigate("/bf_projects");
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
