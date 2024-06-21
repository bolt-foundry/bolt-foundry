import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Input from "aws/client/ui_components/Input.tsx";
import Spinner from "aws/client/components/Spinner.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import { Link } from "aws/client/components/Link.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";

const { useEffect, useRef } = React;

const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
    color: "var(--textOnDark)",
  },
  submitButton: {
    alignItems: "center",
    display: "flex",
    gap: 12,
    marginTop: 22,
  },
  orBox: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    marginTop: 20,
  },
  orBar: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: 1,
    background: "var(--textSecondary)",
  },
  orText: {
    background: "var(--background)",
    color: "var(--textSecondary)",
    padding: 8,
    zIndex: 1,
  },
};

const loginMutation = await graphql`
  mutation LoginFormLoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      }
    }
`;

export default function LoginForm() {
  const enableGoogleLogin = useFeatureFlag("enable_google_login");
  const enableOldLogin = useFeatureFlag("enable_old_login");
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [commit, isInFlight] = useMutation(loginMutation);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInFlight) return;
    setError(null);

    commit({
      variables: {
        email: state.email,
        password: state.password,
      },
      onCompleted: (_response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          setError(errorMessage);
        } else {
          // console.log(response);
          window.location.assign("/projects"); // TODO fix navigate() in RouterContext
        }
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };
  return (
    <>
      {enableOldLogin && (
        <form onSubmit={onLogin}>
          <Input
            label="Email"
            type="email"
            value={state.email}
            onChange={(e) =>
              setState({ ...state, email: e.currentTarget.value })}
            placeholder="Your email"
            required={true}
          />
          <Input
            label="Password"
            meta={<Link to="/forgot">Forgot password?</Link>}
            type="password"
            value={state.password}
            onChange={(e) =>
              setState({ ...state, password: e.currentTarget.value })}
            placeholder="Your password"
            required={true}
          />
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.submitButton}>
            <div style={{ minWidth: 70 }}>
              <Button
                showSpinner={isInFlight}
                type="submit"
                text="Log in"
              />
            </div>
          </div>
        </form>
      )}
      {enableGoogleLogin && enableOldLogin && (
        <div style={styles.orBox}>
          <div style={styles.orBar} />
          <div style={styles.orText}>or</div>
        </div>
      )}
      {(enableGoogleLogin || enableOldLogin === false) && <GoogleLoginButton />}
    </>
  );
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

  const onLogin = (response: google.accounts.id.CredentialResponse) => {
    commit({
      variables: {
        credential: response.credential,
      },
      onCompleted: (_response, errors) => {
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
