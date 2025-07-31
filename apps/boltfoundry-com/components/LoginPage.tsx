import { iso } from "@iso-bfc";
import { LoginWithGoogleButton } from "./LoginWithGoogleButton.tsx";
import { DevAuthButton } from "./DevAuthButton.tsx";
import { Nav } from "./Nav.tsx";
import { useAppEnvironment } from "../contexts/AppEnvironmentContext.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useEffect } from "react";

export const LoginPage = iso(`
  field CurrentViewer.LoginPage @component {
    __typename
  }
`)(function LoginPageComponent({ data }) {
  const appEnvironment = useAppEnvironment();
  const { isAuthenticated } = useAuth();

  // Debug logging
  console.log("LoginPage environment:", {
    BF_E2E_MODE: appEnvironment.BF_E2E_MODE,
    typeof: typeof appEnvironment.BF_E2E_MODE,
    env: appEnvironment,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      globalThis.location.href = "/";
    }
  }, [isAuthenticated]);

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
  // Also enable for localhost:8002 (e2e test port)
  const isLocalE2E = typeof window !== "undefined" &&
    globalThis.location.hostname === "localhost" &&
    globalThis.location.port === "8002";
  const isE2EMode = appEnvironment.BF_E2E_MODE === true || isCodebot ||
    isLocalE2E;

  // Debug logging removed to avoid console usage

  return (
    <div className="landing-page with-header">
      <Nav page="login" />
      <div className="landing-content">
        <h1>Sign In to Bolt Foundry</h1>
        <p>Sign in with your Google Workspace account to continue</p>
        <LoginWithGoogleButton />

        {(isCodebot || isE2EMode) && (
          <>
            <div style={{ margin: "30px 0", borderTop: "1px solid #e0e0e0" }}>
            </div>
            <h3>Development Options</h3>
            <DevAuthButton />
          </>
        )}
      </div>
    </div>
  );
});
