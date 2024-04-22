/// <reference path="https://esm.sh/v135/@types/google.accounts@0.0.14/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/google.picker@0.0.42/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi.drive@0.0.9/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi@0.0.47/index.d.ts" />
import { React } from "deps.ts";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";

const { useRef, useEffect } = React;

export function LoginWithGoogleButton() {
  // const { navigate } = useRouter();
  // const [commit] = useMutation(loginWithGoogleMutation);

  const googleSignInButtonRef = useRef(null);
  const { GOOGLE_OAUTH_CLIENT_ID } = useAppEnvironment();

  const onLogin = (response: google.accounts.id.CredentialResponse) => {
    // commit({
    //   variables: {
    //     credential: response.credential,
    //   },
    //   onCompleted: (_response, errors) => {
    //     navigate("/bf_projects");
    //   },
    // });
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
