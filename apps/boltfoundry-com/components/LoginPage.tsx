import { iso } from "@iso-bfc";
import { LoginWithGoogleButton } from "./LoginWithGoogleButton.tsx";
import { DevAuthButton } from "./DevAuthButton.tsx";
import { Nav } from "./Nav.tsx";
import { useAppEnvironment } from "../contexts/AppEnvironmentContext.tsx";

export const LoginPage = iso(`
  field CurrentViewer.LoginPage @component {
    __typename
  }
`)(function LoginPageComponent({ data }) {
  const appEnvironment = useAppEnvironment();

  if (data.__typename === "CurrentViewerLoggedIn") {
    return (
      <div className="landing-page with-header">
        <Nav page="login" />
        <div className="landing-content">
          <h1>Already Signed In</h1>
          <p>Welcome back! You're already signed in.</p>
        </div>
      </div>
    );
  }

  // Check if we're in a codebot environment
  const isCodebot = typeof window !== "undefined" &&
    !globalThis.location.hostname.includes("localhost") &&
    !globalThis.location.hostname.includes("127.0.0.1");

  // Check if E2E mode is enabled from environment
  // In codebot environments, always enable E2E mode
  const isE2EMode = appEnvironment.BF_E2E_MODE === true || isCodebot;

  // Debug logging removed to avoid console usage

  return (
    <div className="landing-page with-header">
      <Nav page="login" />
      <div className="landing-content">
        <h1>Sign In to Bolt Foundry</h1>
        <p>Sign in with your Google Workspace account to continue</p>
        <LoginWithGoogleButton />

        {isCodebot && (
          <>
            <div style={{ margin: "30px 0", borderTop: "1px solid #e0e0e0" }}>
            </div>
            <h3>Development Options</h3>
            {isE2EMode
              ? <DevAuthButton />
              : (
                <p style={{ color: "#666", fontSize: "14px" }}>
                  To use development authentication, restart the server
                  with:<br />
                  <code
                    style={{ backgroundColor: "#f5f5f5", padding: "2px 6px" }}
                  >
                    BF_E2E_MODE=true bft dev boltfoundry-com
                  </code>
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );
});
