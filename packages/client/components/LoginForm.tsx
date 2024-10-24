/// <reference types="@types/google.accounts" />

import { graphql } from "packages/client/deps.ts";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
import { getLogger } from "packages/logger/logger.ts";
const logger = getLogger(import.meta);
import { useEffect, useRef, useState } from "react";

import { useMutation } from "react-relay";

export function LoginForm() {
  return <GoogleLoginButton />;
}

const loginWithGoogleMutation = await graphql`
  mutation LoginFormLoginWithGoogleMutation($credential: String!) {
    loginWithGoogle(credential: $credential) {
      person {
        id
        name
      }
    }
  }
`;

function GoogleLoginButton() {
  const { navigate } = useRouter();
  const [commit] = useMutation(loginWithGoogleMutation);
  const [googleLibraryLoaded, setGoogleLibraryLoaded] = useState(false);

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
          navigate("/search");
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
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    if (google) {
      setGoogleLibraryLoaded(true);
    } else {
      // @ts-expect-error Not typed.
      globalThis.onGoogleLibraryLoad = () => {
        setGoogleLibraryLoaded(true);
      };
    }
  }, []);

  useEffect(() => {
    if (googleLibraryLoaded) {
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
    }
    
  }, [googleLibraryLoaded]);

  return <div ref={googleSignInButtonRef} style={{ marginTop: 20 }}></div>;
}
