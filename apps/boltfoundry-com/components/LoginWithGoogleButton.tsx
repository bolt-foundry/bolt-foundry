/// <reference types="@types/google.accounts" />

import { useEffect, useRef, useState } from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { useAppEnvironment } from "../contexts/AppEnvironmentContext.tsx";
import { BfDsCallout } from "@bfmono/apps/bfDs/components/BfDsCallout.tsx";

const logger = getLogger(import.meta);

// In development, we need to get this from the server
// In production, it would be injected during SSR
const getGoogleClientId = (envClientId?: string) => {
  // Check multiple sources for the client ID
  // @ts-expect-error - globalThis.__ENVIRONMENT__ is injected by server
  const fromGlobal = globalThis.__ENVIRONMENT__?.GOOGLE_OAUTH_CLIENT_ID;
  // @ts-expect-error - import.meta.env might not have this typed
  const fromVite = import.meta.env?.VITE_GOOGLE_OAUTH_CLIENT_ID;
  // Hardcoded fallback for development (from .env.local)
  const fallback =
    "1053566961455-rreuknvho4jqcj184evmj93n7n1nrjun.apps.googleusercontent.com";

  const clientId = envClientId || fromGlobal || fromVite || fallback;
  logger.info("Google Client ID sources:", {
    envClientId,
    fromGlobal,
    fromVite,
    using: clientId,
  });
  return clientId;
};

export function LoginWithGoogleButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appEnvironment = useAppEnvironment();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const client_id = getGoogleClientId(appEnvironment.GOOGLE_OAUTH_CLIENT_ID);
    if (!client_id) {
      logger.error("GOOGLE_OAUTH_CLIENT_ID is not set");
      setError(
        "Google OAuth is not configured. Please check server configuration.",
      );
      return;
    }

    // Initialize Google Identity Services when script loads
    script.onload = () => {
      if (globalThis.google && googleButtonRef.current) {
        globalThis.google.accounts.id.initialize({
          client_id,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Display the Sign In With Google button
        globalThis.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    return () => {
      // Clean up script
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    logger.info("Google credential received", {
      hasCredential: !!response.credential,
    });

    try {
      // Send credential to backend for verification and session creation
      const loginResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status}`);
      }

      const result = await loginResponse.json();
      logger.info("Login successful", result);

      // Check if we have a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        globalThis.location.href = redirectPath;
      } else {
        // Redirect to dashboard or reload page
        globalThis.location.href = "/";
      }
    } catch (err) {
      setIsLoading(false);
      setError("Failed to sign in with Google. Please try again.");
      logger.error("Google sign-in error:", err);
    }
  };

  // Show spinner while loading
  if (isLoading) {
    return <div>Signing in...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Check if we're in a codebot environment (dynamic hostname)
  const isCodebot = typeof window !== "undefined" &&
    !globalThis.location.hostname.includes("localhost") &&
    !globalThis.location.hostname.includes("127.0.0.1");

  // Show Google Sign-In button
  return (
    <div>
      <div ref={googleButtonRef}></div>
      {isCodebot && (
        <BfDsCallout variant="warning" className="mt-5">
          <div>
            <h4>Codebot Environment Detected</h4>
            <p>
              Google OAuth won't work with dynamic hostnames like{" "}
              <code>{globalThis.location.hostname}</code>.
            </p>
            <p>
              <strong>Solutions:</strong>
            </p>
            <ol>
              <li>
                Use SSH port forwarding:{" "}
                <code>ssh -L 8000:localhost:8000 [your-connection]</code>
              </li>
              <li>
                Then access via:{" "}
                <a href="http://localhost:8000/login">
                  http://localhost:8000/login
                </a>
              </li>
            </ol>
            <p>
              <strong>For testing:</strong>{" "}
              Use E2E mode with mock authentication:
            </p>
            <pre>BF_E2E_MODE=true bft dev boltfoundry-com</pre>
          </div>
        </BfDsCallout>
      )}
    </div>
  );
}
